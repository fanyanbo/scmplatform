var logger = require('../common/logger');
var moduleModel = require('../models/moduleModel');
var output = require('../common/output');
var validator = require('validator');
/**
 * @param {HttpRequest} req
 * @param {HttpResponse} res
 * @param {Function} next
 */
exports.query = function (req, res, next) {
  moduleModel.query(function(err,results) {
    if(err) {
      return output.error(req,res,err);
    }
    output.success(req,res,"查询Module列表成功",results);
  });
};

exports.add = function (req, res, next) {
  let engName = validator.trim(req.body.engName);
  let cnName = validator.trim(req.body.cnName);
  let category = validator.trim(req.body.category);
  let gitPath = validator.trim(req.body.gitPath);
  let desc = validator.trim(req.body.desc);

  // 验证信息的正确性
  if ([engName, cnName, category, gitPath].some(function (item) { return item === ''; })) {
    return output.error(req,res,"请检查参数是否为空！");;
  }

  moduleModel.add(engName, cnName, category, gitPath, desc, function(err,results) {
    if(err) {
      return output.error(req,res,err);
    }
    output.success(req,res,"添加Module成功");
  });
};

exports.update = function (req, res, next) {

  let engName = validator.trim(req.body.engName);
  let cnName = validator.trim(req.body.cnName);
  let category = validator.trim(req.body.category);
  let gitPath = validator.trim(req.body.gitPath);
  let desc = validator.trim(req.body.desc);
  let orderId = validator.trim(req.body.orderId);

  if ([engName, cnName, category, gitPath, orderId].some(function (item) { return item === ''; })) {
    return output.error(req,res,"请检查参数是否为空！");;
  }

  moduleModel.update(engName, cnName, category, gitPath, desc, orderId, function(err,results) {
    if(err) {
      return output.error(req,res,err);
    }
    output.success(req,res,"修改Module成功",results);
  });
};

exports.delete = function (req, res, next) {

  moduleModel.delete(function(err,results) {
    if(err) {
      return output.error(req,res,err);
    }
    output.success(req,res,"删除Module成功",results);
  });
};

exports.queryCategory = function (req, res, next) {
  moduleModel.queryCategory(function(err,results) {
    if(err) {
      return output.error(req,res,err);
    }
    output.success(req,res,"查询Module分类列表成功",results);
  });
};

exports.addCategory = function (req, res, next) {

  let categoryName = validator.trim(req.body.name);

  moduleModel.addCategory(categoryName,function(err,results) {
    if(err) {
      return output.error(req,res,err);
    }
    output.success(req,res,"查询Module分类列表成功",results);
  });
};
