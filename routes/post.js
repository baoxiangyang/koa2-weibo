let router = require('koa-router')(),
		newEjs = require('../common/newEjs.js'),
		mongo = require('../common/mongo.js'),
    fsRename = require('../common/fsRename.js'),
    util = require('util'), 
    request = require('request');
router.post('reg', async function (ctx, next) {
  let data = ctx.request.body;
  ctx.state = {
    title: '注册'
  };
  if(!data.username){
		ctx.state.local = '用户名不能为空;';
  }
  if(!data.password){
		ctx.state.local += ' 密码不能为空;';
  }
  if(data.password != data['password-repeat']){
		ctx.state.local += ' 两次密码不相同;';
  }
  if(!data.email){
		ctx.state.local += ' 邮箱不能为空';
  }
  if(ctx.state.local){
		await newEjs(ctx, 'reg');
  }
  var doc = await mongo.UserModel({
		username: data.username,
		password: data.password,
		email: data.email
  });
  console.log('doc' + doc);
  if(doc.error){
    ctx.state.local = ' 该用户已经存在请重新输入';
    await newEjs(ctx, 'reg');
  }else{
    ctx.status = 301;
    ctx.redirect('/login');
  }
});

router.post('login', async function(ctx, next){
  let data = ctx.request.body,
  doc = await mongo.Userfind({
    username: data.username,
    password: data.password
  });
  if(doc[0]){
    ctx.session.user = doc[0];
    ctx.status = 301;
    ctx.redirect('/');
  }
});

router.post('/', async function(ctx, next){
  let data = ctx.req.body, 
    file = ctx.req.file,
    imgPath  = '';
  try {
    if(file){
      imgPath = await fsRename(file.path, 'public/images/' + ctx.session.user.username + '/' + file.originalname);
    }
    let doc = await mongo.DataModel({
      username: ctx.session.user.username,
      post: data.post,
      img: imgPath
    });
    ctx.redirect('/');
  }catch (e) {
    ctx.redirect('/');
    console.log(e);
  }
});
module.exports = router;
