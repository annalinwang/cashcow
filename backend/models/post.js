const { Schema, model } = require('mongoose')

const postSchema = new Schema({
    task: { type: String, required: true },
    amount: { type: String, required: true },
    sendFrom: { type: String, required: true },
    sendTo: { type: String, required: true },
    completed: { type: String, required: true }
  })
  
  module.exports = model('Post', postSchema)