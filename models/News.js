const mongoose = require('mongoose')

const newsSchema = mongoose.Schema({
  nid: Number,
  title: String,
  content: String,
  status: Number,
  create: {
    type: Number,
    default: Date.now
  }
})

module.exports = mongoose.model('New', newsSchema)