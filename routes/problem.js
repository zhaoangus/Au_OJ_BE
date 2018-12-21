const Router = require('koa-router')
const mongoose = require('mongoose')

const Problem = require('../models/Problem')

const router = new Router({
  prefix: '/problem'
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
  const pageSize = 2
  const sort = -1
  const skip  = (page - 1) * pageSize
  let params = {}

  let problemPageModel = Problem.find(params).skip(skip).limit(pageSize).sort({pid: sort})
  let problemModel = await Problem.find().exec()
  const res = await problemPageModel.exec()
  const num = problemModel.length
  const pageNum = Math.ceil(num / pageSize)

  ctx.body = {
    pageNum,
    num,
    res
  }
})

// router.get('/:id', async (ctx) => {
//   const nid = parseInt(ctx.params.id)
//   const res = await News.findOne({
//     nid
//   })

//   ctx.body = {
//     code: 0,
//     res
//   }
// })

module.exports = router
