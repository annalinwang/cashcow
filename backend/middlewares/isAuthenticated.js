const isAuthenticated = (req, res, next) => {
    const { author } = req.body
    const { sendFrom } = req.body
    if (author === req.session.username || sendFrom === req.session.username ) {
        next()
    }
    else {
        next(new Error('user not authenticated' ))
    }
  }
  
  module.exports = { isAuthenticated }
  