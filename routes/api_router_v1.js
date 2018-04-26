/*!
 * scmplatform
 * Copyright(c) 2018 fanyanbo <fanyanbo@skyworth.com>
 * MIT Licensed
 */

var express = require('express');
var config = require('../config/config');
var logger = require('../common/logger');
var sign = require('../controllers/sign');
var modules = require('../controllers/moduleManager');
var configs = require('../controllers/configManager');
var settings = require('../controllers/settingsManager');
var props = require('../controllers/propManager');
var product = require('../controllers/product');
var record = require('../controllers/record');
var home = require('../controllers/home');
var device = require('../controllers/deviceManager');
var output = require('../common/output');

var router = express.Router();

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

let isAuthenticated = function(req, res, next) {
  if(req.session.username == undefined || !req.session.logined) {
    return output.error(req,res,"拒绝访问");
  }
  next();
}

router.post('/login', sign.login);
router.post('/verify', sign.verify);
router.post('/logout', sign.logout);

router.use('/', isAuthenticated); //api访问控制。除了登录，session校验，登出接口外，其余接口访问需要进行验证

//机芯管理
router.post('/chip/add', device.addChip);
router.post('/chip/query', device.queryChip);
router.post('/chip/update', device.updateChip);
// 机型管理
router.post('/model/add', device.addModel);
router.post('/model/query', device.queryModel);
router.post('/model/update', device.updateModel);
// target_product管理，一个target_product对应唯一MK文件
router.post('/targetproduct/add', device.addTargetProduct);
router.post('/targetproduct/query', device.queryTargetProduct);
router.post('/targetproduct/update', device.updateTargetProduct);
//机芯型号(soc)管理
router.post('/soc/add', device.addSoc);
router.post('/soc/query', device.querySoc);
router.post('/soc/update', device.updateSoc);
// 模块管理
router.post('/module/add', modules.add);
router.post('/module/delete', modules.delete);
router.post('/module/query', modules.query);
router.post('/module/update', modules.update);
// config配置项管理
router.post('/config/add', configs.add);
//router.post('/config/delete', content.delete);
router.post('/config/query', configs.query);
router.post('/config/update', configs.update);
// Settings项管理
router.post('/settings/add', settings.add);
router.post('/settings/query', settings.query);
router.post('/settings/update', settings.update);
// 操作记录管理
router.post('/record/add', record.add);
router.post('/record/delete', record.delete);
router.post('/record/query', record.query);
router.post('/record/update', record.update);

// 开始对接
router.post('/home/getSummary',function(req,res,next){
  console.log("test");
  console.log(req.session.username);
  console.log(req.session.logined);
  next();
}, home.getSummary);                //查询总览信息
router.post('/syslog/queryByPage', home.querySyslog);            //查询系统操作日志
router.post('/syslog/queryTotalNum', home.querySyslogTotalNum);  //查询系统操作日志总数
router.post('/syslog/add', home.addSyslog);                      //新增系统操作日志

router.post('/product/add', product.add);                        //新增产品项
router.post('/product/update', product.update);                  //更新产品信息
router.post('/product/queryByPage', product.queryByPage);        //分页查询产品信息
router.post('/product/queryByRegEx', product.queryByRegEx);      //模糊查询产品信息
router.post('/product/queryHistory', product.queryHistory);      //查询某产品的历史修改记录
router.post('/product/queryByModule', product.queryByModule);    //查询配置有某个模块的所有产品

//用于插件预研
// var jwt = require('../study/jsonwebtokenModule');
// router.get('/gen',jwt.gen);
// router.get('/verify',jwt.verify);

var bcrypt = require('../study/bcryptModule');
router.get('/test/signup',bcrypt.signup);
router.get('/test/login',bcrypt.login);
router.get('/test/logout',bcrypt.logout);
router.get('/test/verify',bcrypt.verifySession);


// home page
// router.get('/', function(req, res, next) {
//   logger.debug('req = ' + req);
//   res.render('index', { title: 'Express' });
// });

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

// router.get('/session', function(req, res, next) {
//   if (req.session.sign) {
//       console.log(req.session);
//       res.send('welecome <strong>' + req.session.name + '</strong>,xixixi');
//   } else {
//       req.session.sign = true;
//       req.session.name = '哇嘎嘎';
//       res.json('中文');
//   }
// });












module.exports = router;
