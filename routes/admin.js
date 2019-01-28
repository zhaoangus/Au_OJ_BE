const Router = require('koa-router')
const mongoose = require('mongoose')

const User = require('../models/User')
const News = require('../models/News')

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

router.post('/admin/add', async ctx => {
  let username = ctx.request.body.username
  const res = await User.findOneAndUpdate({name: username}, {$set: 
    {isAdmin: true}
  })
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

router.post('/admin/remove', async ctx => {
  let uid = ctx.request.body.uid
  const res = await User.findOneAndUpdate({uid}, {$set: 
    {isAdmin: false}
  })
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

router.get('/admin/list', async ctx => {
  const res = await User.find({isAdmin: true}).sort({uid: 1})
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

router.post('/admin/newscreate', async ctx => {
  const find = await News.find({})
  const nid = ++find.length
  let news = new News({
    nid,
    title: ctx.request.body.title,
    content: ctx.request.body.content,
    status: 2,
    create: ctx.request.body.create
  })
  const res = await news.save()
  if (res) {
    ctx.body = {
      code: 0,
      res
    }
  } else {
    ctx.body = {
      code: 1,
      msg: 'error!'
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
