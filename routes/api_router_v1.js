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

var router = express.Router();

// home page
router.get('/', function(req, res, next) {
  logger.debug('req = ' + req);
  res.render('index', { title: 'Express' });
});

router.post('/login', sign.login);
router.get('/logout', sign.logout);
// router.post('/signout', sign.signout);  // 登出
// router.get('/signin', sign.showLogin);  // 进入登录页面
// router.post('/signin', sign.login);  // 登录校验
// router.get('/active_account', sign.activeAccount);  //帐号激活
//机芯管理
router.post('/chip/add', chip.add);
router.post('/chip/delete', chip.delete);
router.post('/chip/query', chip.query);
router.post('/chip/update', chip.update);
// // 机型管理
// router.post('/model/query', model.query);
// router.post('/model/add', model.add);
// router.post('/model/delete', model.delete);
// router.post('/model/update', model.update);
// // target_product管理，一个target_product对应唯一MK文件
// router.post('/targetproduct/query', targetproduct.query);
// router.post('/targetproduct/add', targetproduct.add);
// router.post('/targetproduct/delete', targetproduct.delete);
// router.post('/targetproduct/update', targetproduct.update);
// // 模块管理
// router.post('/modules/query', modules.query);
// router.post('/modules/add', modules.add);
// router.post('/modules/delete', modules.delete);
// router.post('/modules/update', modules.update);
// // config配置项管理
// router.post('/configs/query', configs.query);
// router.post('/configs/add', configs.add);
// router.post('/configs/delete', configs.delete);
// router.post('/configs/update', configs.update);
// // 操作记录管理
// router.post('/record/query', record.query);
// router.post('/record/add', record.add);
// router.post('/record/delete', record.delete);
// router.post('/record/update', record.update);


module.exports = router;
