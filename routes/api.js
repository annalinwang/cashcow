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
        const { postText, imageUrl, author, likes } = req.body
        await Post.create({ postText, imageUrl, author, likes })
        res.send('post created succesfully')
      } catch (err) {
        res.send(`failure to create the post. err: ${err}`)
      }
  })

module.exports = router