const Router = require('koa-router')
const mongoose = require('mongoose')

const User = require('../models/User')

const router = new Router({
  prefix: '/users'
})

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

router.post('/login', async (ctx) => {
  var param = {
    name: ctx.request.body.userName,
    pwd: ctx.request.body.userPwd
  }
await User.findOne(param, (err, doc) => {
    if (doc) {
      ctx.response.body = {
        status: "0",
        msg: '',
        result: {
          userName: doc.name,
          userPwd: doc.pwd
        }
      }
      ctx.cookies.set('userName', doc.name, {
        domain: 'localhost',
        path: '/',
        maxAge: 2 * 60 * 60 * 1000
      })
      ctx.cookies.set('userPwd', doc.pwd, {
        domain: 'localhost',
        path: '/',
        maxAge: 2 * 60 * 60 * 1000
      })
    } else {
      ctx.response.body = {
        status: "1",
        msg: '用户名或密码错误',
      }
    }
  })
})

router.get('/check', async (ctx) => {
  if (ctx.cookies.get('userName')) {
    ctx.response.body = {
      status: "0",
      msg: '',
      result: {
        userName: ctx.cookies.get('userName'),
        userPwd: ctx.cookies.get('userPwd')
      }
    }
  } else {
    ctx.response.body = {
      status: "1",
      msg: '未登录',
      result: ''
    }
  }
})

router.get('/logout', async (ctx) => {
  ctx.cookies.set('userName', '', {
    domain: 'localhost',
    path: '/',
    maxAge: -1
  })
  ctx.response.body = {
    status: "0",
    msg: '',
    result: ''
  }
})

module.exports = router
