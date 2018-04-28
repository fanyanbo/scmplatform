var validator = require('validator');
var settingsModel = require('../models/settingsModel');
var output = require('../common/output');
var logger = require('../common/logger');


/**
 * @param {经过讨论，目前设置项不支持从配置平台上添加，删除，修改只支持修改中文名，主要功能就是查询}
 */

/**
 * @param {HttpRequest} req
 * @param {HttpResponse} res
 * @param {Function} next
 */
 exports.query = function (req, res, next) {
   settingsModel.query(function(err,results) {
     if(err) {
       return output.error(req,res,err);
     }
     output.success(req,res,"查询Settings列表成功",results);
   });
 };

 exports.queryCategory = function (req, res, next) {
   settingsModel.queryCategory(function(err,results) {
     if(err) {
       return output.error(req,res,err);
     }
     output.success(req,res,"查询Settings分类列表成功",results);
   });
 };

 exports.add = function (req, res, next) {
   output.error(req,res,"设置项目前版本不支持新增功能");
 };

 exports.update = function (req, res, next) {

   let engName = validator.trim(req.body.engName);
   let cnName = validator.trim(req.body.cnName);
   let desc = validator.trim(req.body.desc);

   settingsModel.update(engName, cnName, desc, function(err,results) {
     if(err) {
       return output.error(req,res,err);
     }
     output.success(req,res,"修改Settings项成功",results);
   });
 };

 exports.updateItemsOrderId = function (req, res, next) {

   let arrObj = req.body.arr;
   settingsModel.updateItemsOrderId(arrObj, function(err,results) {
     if(err) {
       return output.error(req,res,err);
     }
     output.success(req,res,"修改一组Settings项orderId成功",results);
   });
 };

 exports.queryItemsByCategory = function (req, res, next) {
   let category = validator.trim(req.body.category);
   let level = validator.trim(req.body.level);
   settingsModel.queryItemsByCategory(level, category, function(err,results) {
     if(err) {
       return output.error(req,res,err);
     }
     output.success(req,res,"根据分类查询Settings子项成功",results);
   });
 };
