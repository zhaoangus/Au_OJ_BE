const Router = require('koa-router')
const mongoose = require('mongoose')

const Contest = require('../models/Contest')

const router = new Router({
  prefix: '/contest'
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

  let contestPageModel = Contest.find(params).skip(skip).limit(pageSize).sort({cid: sort})
  let contestModel = await Contest.find().exec()
  const res = await contestPageModel.exec()
  const num = contestModel.length
  const pageNum = Math.ceil(num / pageSize)

  ctx.body = {
    pageNum,
    num,
    res
  }
})

router.get('/:cid/problem/:id', async (ctx) => {
  const cid = parseInt(ctx.params.cid)
  // const pid = parseInt(ctx.params.id)
  const res = await Contest.findOne({
    cid,
    // 'problemList.id': pid
  })

  ctx.body = {
    code: 0,
    res
  }
})

router.get('/:id', async (ctx) => {
  const cid = parseInt(ctx.params.id)
  const res = await Contest.findOne({
    cid
  })

  ctx.body = {
    code: 0,
    res
  }
})

module.exports = router
