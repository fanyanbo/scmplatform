/*!
 * scmplatform
 * Copyright(c) 2018 fanyanbo <fanyanbo@skyworth.com>
 * MIT Licensed
 */

var express = require('express');
var config = require('../config/config');
var logger = require('../common/logger');
//var sign = require('../controllers/sign');
var modules = require('../controllers/moduleManager');
var configs = require('../controllers/configManager');
var settings = require('../controllers/settingsManager');
var props = require('../controllers/propManager');
var product = require('../controllers/productManager');
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

// router.post('/login', sign.login);
// router.post('/verify', sign.verify);
// router.post('/logout', sign.logout);

router.use('/', isAuthenticated); //api访问控制。除了登录，session校验，登出接口外，其余接口访问需要进行验证

router.post('/product/add', product.add);                        //新增产品项
router.post('/product/addHistory', product.addHistory);          //新增产品项的修改记录
router.post('/product/update', product.update);                  //更新产品信息
router.post('/product/queryByPage', product.queryByPage);        //分页查询产品信息
router.post('/product/queryByRegEx', product.queryByRegEx);      //模糊查询产品信息
router.post('/product/queryByChipModel', product.queryByChipModel);  //根据机芯机型查询产品信息
router.post('/product/queryByChipModelPanel', product.queryByChipModelPanel);  //根据机芯机型尺寸查询产品信息
router.post('/product/queryHistory', product.queryHistory);      //查询某产品的历史修改记录
router.post('/product/queryByModule', product.queryByModule);    //查询配置有某个模块的所有产品
router.post('/product/queryProductsByTp', product.queryProductsByTargetProduct);//根据targetproduct查询所有配置该TP的产品
router.post('/product/queryMKByTp', product.queryMKAndPropsByTargetProduct);  //根据targetproduct查询对应的所有modules和props
router.post('/product/queryAll', product.queryAll);
router.post('/product/queryAllByMachine', product.queryAllByMachine);
router.post('/product/queryAllByMachineTemp', product.queryAllByMachineTemp);
router.post('/product/queryAuditByUser', product.queryAuditByUser);
router.post('/product/preview', product.preview);
router.post('/product/review', product.review);
router.post('/product/delete', product.delete);
router.post('/product/deleteRecovery', product.deleteRecovery);

router.post('/device/queryAll', device.queryAll);
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
router.post('/targetproduct/queryByRegEx', device.queryTargetProductByRegEx);
router.post('/targetproduct/update', device.updateTargetProduct);
router.post('/targetproduct/updateName', device.updateTargetProductName);

//机芯型号(soc)管理
router.post('/soc/add', device.addSoc);
router.post('/soc/query', device.querySoc);
router.post('/soc/update', device.updateSoc);

// 模块管理
router.post('/module/add', modules.add);
router.post('/module/delete', modules.delete);
router.post('/module/query', modules.query);
router.post('/module/update', modules.update);
router.post('/module/queryCategory', modules.queryCategory);
router.post('/module/addCategory', modules.addCategory);
router.post('/module/updateCategoryOrderId', modules.updateCategoryOrderId);
router.post('/module/updateItemsOrderId', modules.updateItemsOrderId);
router.post('/module/queryByCategory', modules.queryByCategory);

// config配置项管理
router.post('/config/add', configs.add);
//router.post('/config/delete', content.delete);
router.post('/config/query', configs.query);
router.post('/config/update', configs.update);
router.post('/config/queryCategory', configs.queryCategory);
router.post('/config/addCategory', configs.addCategory);
router.post('/config/updateCategoryOrderId', configs.updateCategoryOrderId);
router.post('/config/updateItemsOrderId', configs.updateItemsOrderId);
router.post('/config/queryByCategory', configs.queryByCategory);

// Settings项管理
router.post('/settings/add', settings.add);
router.post('/settings/query', settings.query);
router.post('/settings/update', settings.update);
router.post('/settings/queryCategory', settings.queryCategory);
router.post('/settings/updateItemsOrderId', settings.updateItemsOrderId);
router.post('/settings/queryByCategory', settings.queryItemsByCategory);

// prop项管理
router.post('/prop/add', props.add);
router.post('/prop/query', props.query);
router.post('/prop/update', props.update);
router.post('/prop/queryCategory', props.queryCategory);
router.post('/prop/addCategory', props.addCategory);

// 操作记录管理
router.post('/home/getSummary',function(req,res,next){
  console.log("test");
  console.log(req.session.username);
  console.log(req.session.logined);
  next();
}, home.getSummary);                //查询总览信息
router.post('/syslog/queryByPage', home.querySyslog);            //查询系统操作日志
router.post('/syslog/queryTotalNum', home.querySyslogTotalNum);  //查询系统操作日志总数
router.post('/syslog/add', home.addSyslog);                      //新增系统操作日志

//用于插件预研
// var jwt = require('../study/jsonwebtokenModule');
// router.get('/gen',jwt.gen);
// router.get('/verify',jwt.verify);

// var bcrypt = require('../study/bcryptModule');
// router.get('/test/signup',bcrypt.signup);
// router.get('/test/login',bcrypt.login);
// router.get('/test/logout',bcrypt.logout);
// router.get('/test/verify',bcrypt.verifySession);

module.exports = router;

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
