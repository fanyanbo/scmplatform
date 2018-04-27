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

 exports.queryByCategory = function (req, res, next) {
   let category = validator.trim(req.body.category);
   configModel.queryByCategory(category, function(err,results) {
     if(err) {
       return output.error(req,res,err);
     }
     output.success(req,res,"根据分类查询Config子项成功",results);
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

 exports.queryCategory = function (req, res, next) {
   configModel.queryCategory(function(err,results) {
     if(err) {
       return output.error(req,res,err);
     }
     output.success(req,res,"查询Config分类列表成功",results);
   });
 };

 exports.addCategory = function (req, res, next) {

   let category = validator.trim(req.body.category);

   configModel.addCategory(category, function(err,results) {
     if(err) {
       return output.error(req,res,err);
     }
     output.success(req,res,"新增Config分类列表成功",results);
   });
 };

 exports.updateCategoryOrderId = function (req, res, next) {

   let arr = validator.trim(req.body.arr);
   var arrObj = JSON.parse(arr); //由JSON字符串转换为JSON对象
   console.log(arrObj);
   console.log(arrObj.length);
   configModel.updateCategoryOrderId(arrObj, function(err,results) {
     if(err) {
       return output.error(req,res,err);
     }
     output.success(req,res,"修改Config分类列表成功",results);
   });
 };

 exports.updateItemsOrderId = function (req, res, next) {
   console.log("1111");
   console.log(typeof req.body.arr);
   console.log(req.body.arr);
   console.log(req.body.arr.length);
   let arr = validator.trim(req.body.arr);
   console.log(arr);
   console.log(arr.length);
   var arrObj = JSON.parse(arr); //由JSON字符串转换为JSON对象
   console.log(arrObj);
   console.log(arrObj.length);
   configModel.updateItemsOrderId(arrObj, function(err,results) {
     if(err) {
       return output.error(req,res,err);
     }
     output.success(req,res,"修改Config Items orderId成功",results);
   });
 };
