var validator = require('validator');
var propModel = require('../models/propModel');
var output = require('../common/output');
var logger = require('../common/logger');
/**
 * @param {HttpRequest} req
 * @param {HttpResponse} res
 * @param {Function} next
 */
 exports.query = function (req, res, next) {
   propModel.query(function(err,results) {
     if(err) {
       return output.error(req,res,err);
     }
     output.success(req,res,"查询props列表成功",results);
   });
 };

 exports.queryCategory = function (req, res, next) {
   propModel.queryCategory(function(err,results) {
     if(err) {
       return output.error(req,res,err);
     }
     output.success(req,res,"查询props分类列表成功",results);
   });
 };

 exports.addCategory = function (req, res, next) {

   let category = validator.trim(req.body.category);

   propModel.addCategory(category, function(err,results) {
     if(err) {
       return output.error(req,res,err);
     }
     output.success(req,res,"新增props分类列表成功",results);
   });
 };

 exports.add = function (req, res, next) {

   console.log(req.body.data);
   propModel.add(data, function(err,results) {
     if(err) {
       return output.error(req,res,err);
     }
     output.success(req,res,"新增props项成功",results);
   });
 };

 exports.update = function (req, res, next) {

   console.log(req.body.data);
   propModel.update(data, function(err,results) {
     if(err) {
       return output.error(req,res,err);
     }
     output.success(req,res,"修改props项成功",results);
   });
 };
