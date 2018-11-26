const mongoose = require('mongoose')

const newsSchema = mongoose.Schema({
  nid: Number,
  title: String,
  content: String,
  status: Number
})

module.exports = mongoose.model('New', newsSchema)