let router = require('koa-router')(),
  newEjs = require('../common/newEjs.js'),
  mongo = require('../common/mongo.js');
router.get('/', async function (ctx, next) {
  ctx.state = {
    title: '首页',
    active:'/'
  };
  if(ctx.session.user){
    ctx.state.user = {
      name: ctx.session.user.username
    };  
  }
  try {
    let docs = await mongo.Datafind({}); 
    await newEjs(ctx, 'index', {data: docs});
  }catch (e) {
    await newEjs(ctx, 'index');
  }
});
router.get('reg', async function (ctx, next) {
  ctx.state = {
    title: '注册',
    active:'/reg'
  };
  await newEjs(ctx, 'reg');
});
router.get('login', async function (ctx, next) {
  ctx.state = {
    title: '登录',
    active:'/login'
  };
  await newEjs(ctx, 'login');
});
router.get('out', async function (ctx, next) {
  ctx.session = {};
  ctx.redirect('/');
});
module.exports = router;
