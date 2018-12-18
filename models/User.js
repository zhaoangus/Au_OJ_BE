const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
  name: '',
  uid: Number,
  nick: {
    type: String,
    default: ''
  },
  motto: '',
  mail: '',
  school: '',
  solve: {
    type: Number,
    default: 0
  },
  pwd: {
    type: String,
    required: true
  },
  submit: {
    type: Number,
    default: 0
  },
  solved: {
    type: [Number],
    default: []
  },
  unsolved: {
    type: [Number],
    default: []
  }
})

module.exports = mongoose.model('User', userSchema)