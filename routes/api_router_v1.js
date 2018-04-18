/*!
 * scmplatform
 * Copyright(c) 2018 fanyanbo <fanyanbo@skyworth.com>
 * MIT Licensed
 */

var express = require('express');
var config = require('../config/config');
var logger = require('../common/logger');
var sign = require('../controllers/sign');
var chip = require('../controllers/chip');
var model = require('../controllers/model');
var targetproduct = require('../controllers/targetproduct');
var modules = require('../controllers/modules');
var configs = require('../controllers/configs');
var record = require('../controllers/record');
var home = require('../controllers/home');

var router = express.Router();

// home page
router.get('/', function(req, res, next) {
  logger.debug('req = ' + req);
  res.render('index', { title: 'Express' });
});

// router.get('/setcookie', function(req, res, next) {
//   let userInfo = {
//     "name":"fanyanbo",
//     "age":31
//   };
//   res.cookie('user',JSON.stringify(userInfo),{maxAge:50*1000});
//   res.send('<h1>Set-Cookie<h1>');
// });
//
// router.get('/getcookie', function(req, res, next) {
//   var cookies = req.cookies;
//   var text = JSON.stringify(cookies);
//   res.send('<h1>Show-Cookie: ' + text + '</h1>');
// });
//
// router.get('/delcookie', function(req, res, next) {
//   res.clearCookie('user');
//   res.send('<h1>Del-Cookie</h1>');
// });

// router.get('/cookie', function(req, res, next) {
//
//   logger.debug(req.cookies.isVisit);
//
//   if (req.cookies.isVisit) {
//         req.cookies.isVisit++;
//         res.cookie('isVisit',req.cookies.isVisit,{maxAge:50000});
//         res.send('<p>第 ' + req.cookies.isVisit + '次来此页面</p>');
//     } else {
//         res.cookie('isVisit',0,{maxAge:50000});
//         req.cookies.isVisit = 1;
//         res.send("欢迎第一次来这里");
//   }
// });

router.get('/session', function(req, res, next) {
  if (req.session.sign) {
      console.log(req.session);
      res.send('welecome <strong>' + req.session.name + '</strong>,xixixi');
  } else {
      req.session.sign = true;
      req.session.name = '哇嘎嘎';
      res.json('中文');
  }
});

router.post('/login', sign.login);
router.post('/verify', sign.verify);
router.post('/logout', sign.logout);
// router.post('/signout', sign.signout);  // 登出
// router.get('/signin', sign.showLogin);  // 进入登录页面
// router.post('/signin', sign.login);  // 登录校验
// router.get('/active_account', sign.activeAccount);  //帐号激活
//机芯管理
router.post('/chip/add', chip.add);
router.post('/chip/delete', chip.delete);
router.post('/chip/query', chip.query);
router.post('/chip/update', chip.update);
// 机型管理
router.post('/model/add', model.add);
router.post('/model/delete', model.delete);
router.post('/model/query', model.query);
router.post('/model/update', model.update);
// target_product管理，一个target_product对应唯一MK文件
router.post('/targetproduct/add', targetproduct.add);
router.post('/targetproduct/delete', targetproduct.delete);
router.post('/targetproduct/query', targetproduct.query);
router.post('/targetproduct/update', targetproduct.update);
// 模块管理
router.post('/modules/add', modules.add);
router.post('/modules/delete', modules.delete);
router.post('/modules/query', modules.query);
router.post('/modules/update', modules.update);
// config配置项管理
router.post('/configs/add', configs.add);
router.post('/configs/delete', configs.delete);
router.post('/configs/query', configs.query);
router.post('/configs/update', configs.update);
// 操作记录管理
router.post('/record/add', record.add);
router.post('/record/delete', record.delete);
router.post('/record/query', record.query);
router.post('/record/update', record.update);

// 开始对接
router.post('/home/getSummary', home.getSummary);


//用于插件预研
// var jwt = require('../study/jsonwebtokenModule');
// router.get('/gen',jwt.gen);
// router.get('/verify',jwt.verify);


var bcrypt = require('../study/bcryptModule');
router.get('/test/signup',bcrypt.signup);
router.get('/test/login',bcrypt.login);
router.get('/test/logout',bcrypt.logout);
router.get('/test/verify',bcrypt.verifySession);















module.exports = router;
