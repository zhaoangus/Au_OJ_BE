const Router = require('koa-router')
const mongoose = require('mongoose')

const Discuss = require('../models/Discuss')

const router = new Router({
  prefix: '/discuss'
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

router.get('/', async (ctx) => {
  const page = ctx.request.query.page || 1
  const pageSize = 20
  const sort = -1
  const skip  = (page - 1) * pageSize
  let params = {}

  let discussPageModel = Discuss.find(params).skip(skip).limit(pageSize).sort({did: sort})
  let discussModel = await Discuss.find().exec()
  const res = await discussPageModel.exec()
  const num = discussModel.length
  const pageNum = Math.ceil(num / pageSize)

  ctx.body = {
    pageNum,
    num,
    res
  }
})

router.get('/:id', async (ctx) => {
  let did = parseInt(ctx.params.id)
  const res = await Discuss.findOne({
    did
  })

  ctx.body = {
    code: 0,
    res
  }
})

router.post('/submit', async (ctx) => {
  const find = await Discuss.find({})
  let did = ++find.length
  let discuss = new Discuss({
    did,
    title: ctx.request.body.title,
    create: ctx.request.body.create,
    update: ctx.request.body.create,
    uid: 1,
    comments: [{
      uid: 1,
      content: ctx.request.body.reply,
      create: ctx.request.body.create
    }]
  })
const res = await discuss.save()
  if (res) {
    ctx.response.body = {
      status: "0",
      msg: '',
      result: {
        did,
        comments: discuss.comments
      }
    }
  } else {
    ctx.response.body = {
      status: '1',
      msg: '添加失败！'
    }
  }
})

router.post('/:id', async (ctx) => {
  const update = await Discuss.update({did: parseInt(ctx.params.id)},
  {$push: {comments: {uid:1, content:ctx.request.body.reply, create:ctx.request.body.time}}})
  if (update) {
    ctx.response.body = {
      status: "0",
      msg: '',
      result: {
        update
      }
    }
  } else {
    ctx.response.body = {
      status: '1',
      msg: '添加失败！'
    }
  }
})

module.exports = router
