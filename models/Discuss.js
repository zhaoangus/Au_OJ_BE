const mongoose = require('mongoose')

const discussSchema = mongoose.Schema({
  did: {
    type: Number,
    index: {
      unique: true
    },
    default: -1
  },
  title: {
    type: String,
    require: true
  },
  create: {
    type: Number,
    default: Date.now
  },
  update: {
    type: Number,
    default: Date.now
  },
  uid: {
    type: Number,
    required: true
  },
  comments: [{
    uid: {
      type: Number,
      required: true
    },
    content: {
      type: String,
      default: ''
    },
    create: {
      type: Number,
      default: Date.now
    }
  }]
})

var discussCollection = 'discusss'

module.exports = mongoose.model('Discuss', discussSchema, discussCollection)