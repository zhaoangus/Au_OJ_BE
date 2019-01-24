const Router = require('koa-router')
const mongoose = require('mongoose')

const User = require('../models/User')

const router = new Router()

mongoose.connect('mongodb://127.0.0.1:27017/Au_OJ')

mongoose.connection.on('connected', function() {
  console.log('Mongodb connected success.')
})

mongoose.connection.on('error', function() {
  console.log('Mongodb connected fail.')
})

mongoose.connection.on('disconnected', function() {
  console.log('Mongodb connected disconnected.')
})

router.post('/user', async ctx => {
  let username = ctx.request.body.username
  const res = await User.findOne({name: username})
  if (res) {
    ctx.body = {
      code: 0,
      res
    }
  } else {
    ctx.body = {
      code: 1,
      msg: '出错了！'
    }
  }
})

// router.post('/user/:uid', async ctx => {
//   let uid = parseInt(ctx.params.uid)
//   let nick = ctx.request.body.nick
//   let motto = ctx.request.body.motto
//   let school = ctx.request.body.school
//   let mail = ctx.request.body.mail
//   let pwd = ctx.request.body.password
//   const res = await User.findOneAndUpdate({uid}, {$set: 
//     {nick, motto, school, mail, pwd}
//   })
//   if (res) {
//     ctx.body = {
//       code: 0,
//       res
//     }
//   } else {
//     ctx.body = {
//       code: 1,
//       msg: 'error!'
//     }
//   }
// })

module.exports = router
