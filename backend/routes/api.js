const express = require('express')

const Post = require('../models/post')
const { isAuthenticated } = require('../middlewares/isAuthenticated')
const router = express.Router()

router.get('/posts', (req, res) => {
  Post.find({}, async (err, result) => {
    if (err) {
      next(err)
    } else {
      res.send(result)
    }
  })
})

router.post('/posts/add', isAuthenticated, async (req, res) => {
    try {
        const { task, sendFrom, sendTo } = req.body
        await Post.create({ task, sendFrom, sendTo, completed: 'no' })
        res.send('post created succesfully')
      } catch (err) {
        res.send(`failure to create the post. err: ${err}`)
      }
  })

router.post('/posts/complete', isAuthenticated, async (req, res) => {
    const { _id} = req.body
    await Post.findById(_id, async (err, task) => {
      if (err) {
        return next(err)
      }
      if (task) {
        try {
          await Post.findByIdAndUpdate(_id, { completed: 'yes' }, { useFindAndModify: false })
          //task.completed = 'yes'
          await task.save()
          res.send('task completed')
        } catch (err) {
          res.send(`failed to complete task: ${err}`)
        }
      } else {
        res.send('could not complete task')
      }
    })
})

module.exports = router