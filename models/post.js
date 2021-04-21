const { Schema, model } = require('mongoose')

const postSchema = new Schema({
    postText: { type: String, required: true },
    imageUrl: { type: String, required: true },
    author: { type: String, required: true },
    likes: { type: Number, required: true },
  })
  
  module.exports = model('Post', postSchema)