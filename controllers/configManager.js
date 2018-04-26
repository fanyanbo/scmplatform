var validator = require('validator');
var configModel = require('../models/configModel');
var output = require('../common/output');
var logger = require('../common/logger');

/**
 * @param {HttpRequest} req
 * @param {HttpResponse} res
 * @param {Function} next
 */
 exports.query = function (req, res, next) {
   configModel.query(function(err,results) {
     if(err) {
       return output.error(req,res,err);
     }
     output.success(req,res,"查询Config列表成功",results);
   });
 };

 exports.add = function (req, res, next) {
   let engName = validator.trim(req.body.engName);
   let cnName = validator.trim(req.body.cnName);
   let category = validator.trim(req.body.category);
   let type = validator.trim(req.body.type);
   let options = validator.trim(req.body.options);
   let defaultValue = validator.trim(req.body.defaultValue);
   let desc = validator.trim(req.body.desc);

   // 验证信息的正确性
   if ([engName, cnName, category, type, defaultValue].some(function (item) { return item === ''; })) {
     return output.error(req,res,"请检查参数是否为空！");;
   }

   configModel.add(engName, cnName, category, type, options, defaultValue, desc, function(err,results) {
     if(err) {
       return output.error(req,res,err);
     }
     output.success(req,res,"添加Config成功");
   });
 };

 exports.update = function (req, res, next) {

   let engName = validator.trim(req.body.engName);
   let cnName = validator.trim(req.body.cnName);
   let category = validator.trim(req.body.category);
   let type = validator.trim(req.body.type);
   let options = validator.trim(req.body.options);
   let defaultValue = validator.trim(req.body.defaultValue);
   let desc = validator.trim(req.body.desc);
   let orderId = validator.trim(req.body.orderId);

   if ([engName, cnName, category, type, defaultValue, orderId].some(function (item) { return item === ''; })) {
     return output.error(req,res,"请检查参数是否为空！");;
   }

   configModel.update(engName, cnName, category, type, options, defaultValue, desc, orderId, function(err,results) {
     if(err) {
       return output.error(req,res,err);
     }
     output.success(req,res,"修改Config成功",results);
   });
 };
