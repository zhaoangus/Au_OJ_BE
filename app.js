const Koa = require('koa')
const app = new Koa()
const views = require('koa-views')
const json = require('koa-json')
const onerror = require('koa-onerror')
const bodyparser = require('koa-bodyparser')
const logger = require('koa-logger')
// const historyFallback = require('koa2-history-api-fallback')

const index = require('./routes/index')
const users = require('./routes/users')
const news = require('./routes/news')
const problem = require('./routes/problem')
const discuss = require('./routes/discuss')
const contest = require('./routes/contest')
const ranklist = require('./routes/ranklist')

// error handler
onerror(app)

// middlewares
app.use(bodyparser({
  enableTypes:['json', 'form', 'text']
}))
app.use(json())
app.use(logger())
app.use(require('koa-static')(__dirname + '/public'))

app.use(views(__dirname + '/views', {
  extension: 'pug'
}))

// logger
app.use(async (ctx, next) => {
  const start = new Date()
  await next()
  const ms = new Date() - start
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
})

app.use(async (ctx, next) => {
  await next()
  if (ctx.status === 404) {
    return send(ctx, './index.html')
  }
})

// routes
app.use(index.routes(), index.allowedMethods())
app.use(users.routes(), users.allowedMethods())
app.use(news.routes(), news.allowedMethods())
app.use(problem.routes(), problem.allowedMethods())
app.use(discuss.routes(), discuss.allowedMethods())
app.use(contest.routes(), contest.allowedMethods())
app.use(ranklist.routes(), ranklist.allowedMethods())

// error-handling
app.on('error', (err, ctx) => {
  console.error('server error', err, ctx)
});

module.exports = app
