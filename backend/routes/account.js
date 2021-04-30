const express = require('express')
const User = require('../models/user')
const router = express.Router()
const passport = require('../passport/setup')


router.post('/', (req, res) => {
  res.send(req.session.username)
})


router.get('/users', (req, res) => {
  User.find({}, async (err, result) => {
    if (err) {
      next(err)
    } else {
      res.send(result)
    }
  })
})

router.post('/signup', async (req, res) => {
    const { username, password } = req.body
    try {
        await User.create({ username, password })
        res.send('user created succesfully')
      } catch {
        res.send('failure to create the user')
      }
  })

 
router.post('/login', (req, res, next) => {
  const { username, password } = req.body
   User.findOne({ username, password }, (err, user) => {
    if (err) {
      return next(new Error('username, password doesnt exist'))
    }
    if (user) {
      req.session.username = username
      req.session.password = password
      res.send(`logged in as ${username}`)
    } else {
      return next(new Error('user does not exist'))
    }
    passport.authenticate('local', (err, user) => {
      if (err) {
        console.log(err)
        next(err)
      } else {
        req.session = user.username
        req.session = user.password
        res.send('logged in')
      }
    })
  })
})

router.post('/logout', (req, res) => {
    const user = req.session.username
    req.session.username = ''
    req.session.password = ''
    res.send(`user ${user} logged out`)
})

module.exports = router