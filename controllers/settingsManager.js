var validator = require('validator');
var settingsModel = require('../models/settingsModel');
var output = require('../common/output');
var logger = require('../common/logger');

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

 exports.add = function (req, res, next) {

   settingsModel.add(engName, cnName, category, type, options, defaultValue, desc, function(err,results) {
     if(err) {
       return output.error(req,res,err);
     }
     output.success(req,res,"添加Setting项成功");
   });
 };

 exports.update = function (req, res, next) {

   let engName = validator.trim(req.body.engName);
   let cnName = validator.trim(req.body.cnName);
   let desc = validator.trim(req.body.desc);

   settingsModel.update(engName, cnName, desc, function(err,results) {
     if(err) {
       return output.error(req,res,err);
     }
     output.success(req,res,"修改Setting项成功",results);
   });
 };
