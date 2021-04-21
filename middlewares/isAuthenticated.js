const isAuthenticated = (req, res, next) => {
    const { author } = req.body
    const { username } = req.body
    if (author === req.session.username || username === req.session.username ) {
        next()
    }
    else {
        next(new Error('user not authenticated' ))
    }
  }
  
  module.exports = { isAuthenticated }
  