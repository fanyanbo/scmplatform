/*!
 * scmplatform
 * Copyright(c) 2018 fanyanbo <fanyanbo@skyworth.com>
 * MIT Licensed
 */
var express = require('express');
var path = require('path');
var config = require('../config/config');
var logger = require('../common/logger');
var output = require('../common/output');
var prefixPath =  path.join(config.rootPath, '/v6.5');
var modules = require(prefixPath + '/controllers/moduleManager');
var configs = require(prefixPath + '/controllers/configManager');
var settings = require(prefixPath + '/controllers/settingsManager');
var props = require(prefixPath + '/controllers/propManager');
var product = require(prefixPath + '/controllers/productManager');
var home = require(prefixPath + '/controllers/home');
var device = require(prefixPath + '/controllers/deviceManager');

var router = express.Router();

let isAuthenticated = function(req, res, next) {
  if(req.session.username == undefined || !req.session.logined) {
    return output.error(req,res,"拒绝访问");
  }
  next();
}

router.use('/', isAuthenticated); //api访问控制。除了登录，session校验，登出接口外，其余接口访问需要进行验证

router.post('/product/add', product.add);                        //新增产品项
router.post('/product/addHistory', product.addHistory);          //新增产品项的修改记录
router.post('/product/update', product.update);                  //更新产品信息
router.post('/product/queryByPage', product.queryByPage);        //分页查询产品信息
router.post('/product/queryByRegEx', product.queryByRegEx);      //模糊查询产品信息
router.post('/product/queryHistory', product.queryHistory);      //查询某产品的历史修改记录
router.post('/product/queryByModule', product.queryByModule);    //查询配置有某个模块的所有产品
router.post('/product/queryBytp', product.queryMKDataByTargetProduct);  //根据targetproduct查询对应的所有modules
router.post('/product/queryAll', product.queryAll);
router.post('/product/queryAllByMachine', product.queryAllByMachine);
router.post('/product/queryAllByMachineTemp', product.queryAllByMachineTemp);
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



module.exports = router;
