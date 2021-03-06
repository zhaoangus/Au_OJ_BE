const Router = require('koa-router')
const mongoose = require('mongoose')
const utils = require('utility')

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
  let param = {
    name: ctx.request.body.userName,
    pwd: md5Pwd(ctx.request.body.userPwd)
  }
const res = await User.findOne(param)
    if (res) {
      ctx.response.body = {
        status: "0",
        msg: '',
        result: {
          userName: res.name,
          uid: parseInt(res.uid),
          isAdmin: res.isAdmin
        }
      }
      ctx.cookies.set('userName', res.name, {
        domain: 'localhost',
        path: '/',
        maxAge: 5 * 60 * 60 * 1000
      })
      ctx.cookies.set('isAdmin', res.isAdmin, {
        domain: 'localhost',
        path: '/',
        maxAge: 5 * 60 * 60 * 1000
      })
      ctx.cookies.set('uid', parseInt(res.uid), {
        domain: 'localhost',
        path: '/',
        maxAge: 5 * 60 * 60 * 1000
      })
    } else {
      ctx.response.body = {
        status: "1",
        msg: '用户名或密码错误',
      }
    }
  })

router.get('/check', async (ctx) => {
  if (ctx.cookies.get('userName')) {
    if (ctx.cookies.get('isAdmin')) {
      ctx.body = {
        status: 2,
        msg: 'Admin!',
        result: {
          userName: ctx.cookies.get('userName'),
          isAdmin: ctx.cookies.get('isAdmin'),
          uid: ctx.cookies.get('uid')
        }
      }
    } else {
      ctx.response.body = {
        status: "0",
        msg: '',
        result: {
          userName: ctx.cookies.get('userName'),
          uid: ctx.cookies.get('uid')
        }
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

router.post('/register', async (ctx) => {
  const search = await User.findOne({name: ctx.request.body.userName})
  if (search) {
    ctx.response.body = {
      status: '2',
      msg: '账户已被注册！',
      result: search.name
    }
  } else {
  const find = await User.find({})
    var uid = ++find.length
    var user = new User({
      name: ctx.request.body.userName,
      uid,
      nick: ctx.request.body.nickName,
      motto: '',
      mail: '',
      school: '',
      solve: 0,
      pwd: md5Pwd(ctx.request.body.userPwd),
      submit: 0,
      solved: [],
      unsolved: []
    })
  const res = await user.save()
  if (res) {
    ctx.response.body = {
      status: "0",
      msg: '',
      result: {
        uid,
        find:find.length
      }
    }
  } else {
    ctx.response.body = {
      status: '1',
      msg: '注册失败！'
    }
  }
  }
})

router.post('/name', async ctx => {
  const res = await User.findOne({uid: ctx.request.body.uid})
  if (res) {
    ctx.body = {
      code: 0,
      res
    }
  } else {
    ctx.body = {
      code: 1,
      mes: 'error!'
    }
  }
})

function md5Pwd (pwd) {
  const salt = 'zhao_angus_666heiheihei!@#EEFRFdwd~'
  return utils.md5(utils.md5(pwd + salt))
}

module.exports = router
