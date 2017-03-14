const Koa = require('koa'),
	app = new Koa(),
	router = require('koa-router')(),
	views = require('koa-views'),
	convert = require('koa-convert'),
	json = require('koa-json'),
	onerror = require('koa-onerror'),
	bodyparser = require('koa-bodyparser')(),
	logger = require('koa-logger'),
	ejs = require('ejs'),
	index = require('./routes/index'),
	post = require('./routes/post'),
	koaStatic = require('koa-static'),
	multer = require('koa-multer'),
	mount = require('koa-mount'),
	upload = multer({ dest: 'uploads/' });
import session from 'koa-session2';
import RedisStore from './common/store.js';
// middlewares
app.use(convert(bodyparser));
app.use(convert(json()));
// app.use(convert(logger()));
// logger
app.use(async (ctx, next) => {
  const start = new Date();
  await next();
  const ms = new Date() - start;
  console.log(`${ctx.method} ${ctx.status} ${ctx.url} - ${ms}ms`);
});
app.use(mount('/public', convert(koaStatic(__dirname + '/public'))));
app.use(views(__dirname + '/views', {map: {html: 'ejs' }}));
//session
app.use(session({
	key: "sessionId",
	store: new RedisStore(),
  httpOnly: true
}));


router.use('/', index.routes(), index.allowedMethods());
router.use('/', upload.single('img'), post.routes(), post.allowedMethods());

app.use(router.routes(), router.allowedMethods());
// response

app.on('error', function(err, ctx){
  console.log(err);
  logger.error('server error', err, ctx);
});


module.exports = app;
