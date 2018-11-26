const Router = require('koa-router')
const mongoose = require('mongoose')

const News = require('../models/News')

const router = new Router({
  prefix: '/news'
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

router.get('/', async (ctx, next) => {
  const page = ctx.request.query.page
  const pageSize = 2
  const sort = -1
  const skip  = (page - 1) * pageSize
  let params = {}

  let newsPageModel = News.find(params).skip(skip).limit(pageSize).sort({nid: sort})
  let newsModel = await News.find().exec()
  const res = await newsPageModel.exec()

  const pageNum = Math.ceil(newsModel.length / pageSize)

  ctx.body = {
    pageNum,
    res
  }
})

router.get('/:nid', async (ctx, next) => {
  const nid = parseInt(ctx.params.nid)
  const res = await News.findOne({
    nid
  })

  ctx.body = {
    code: 0,
    res
  }
})

module.exports = router
