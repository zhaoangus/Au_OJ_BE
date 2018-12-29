const mongoose = require('mongoose')

const contestSchema = mongoose.Schema({
  cid: {
    type: Number,
    index: {
      unique: true
    },
    default: -1
  },
  title: String,
  status: {
    type: Number,
    default: 2 //开放
  },
  create: {
    type: Number,
    default: Date.now
  },
  start: Number,
  end: Number,
  creator: String,
  problemList: [Object],
  encrypt: {
    type: String,
    default: 'aaa'
  },
  ranklist: {
    type: Array,
    default: [Object]
  }
})

module.exports = mongoose.model('Contest', contestSchema)