var logger = require('../common/logger');
var contentModel = require('../models/contentModel');
var output = require('../common/output');
var validator = require('validator');
/**
 * @param {HttpRequest} req
 * @param {HttpResponse} res
 * @param {Function} next
 */
exports.queryConfigData = function (req, res, next) {
  contentModel.queryConfigData(function(err,results) {
    if(err) {
      return output.error(req,res,err);
    }
    output.success(req,res,"查询Config列表成功",results);
  });
};

exports.addConfigData = function (req, res, next) {
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

  contentModel.addConfigData(engName, cnName, category, type, options, defaultValue, desc, function(err,results) {
    if(err) {
      return output.error(req,res,err);
    }
    output.success(req,res,"添加Config成功");
  });
};

exports.updateConfigData = function (req, res, next) {

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

  contentModel.updateConfigData(engName, cnName, category, type, options, defaultValue, desc, orderId, function(err,results) {
    if(err) {
      return output.error(req,res,err);
    }
    output.success(req,res,"修改Config成功",results);
  });
};

exports.queryModuleData = function (req, res, next) {
  contentModel.queryModuleData(function(err,results) {
    if(err) {
      return output.error(req,res,err);
    }
    output.success(req,res,"查询Module列表成功",results);
  });
};

exports.addModuleData = function (req, res, next) {
  let engName = validator.trim(req.body.engName);
  let cnName = validator.trim(req.body.cnName);
  let category = validator.trim(req.body.category);
  let gitPath = validator.trim(req.body.gitPath);
  let desc = validator.trim(req.body.desc);

  // 验证信息的正确性
  if ([engName, cnName, category, gitPath].some(function (item) { return item === ''; })) {
    return output.error(req,res,"请检查参数是否为空！");;
  }

  contentModel.addModuleData(engName, cnName, category, gitPath, desc, function(err,results) {
    if(err) {
      return output.error(req,res,err);
    }
    output.success(req,res,"添加Module成功");
  });
};

exports.updateModuleData = function (req, res, next) {

  let engName = validator.trim(req.body.engName);
  let cnName = validator.trim(req.body.cnName);
  let category = validator.trim(req.body.category);
  let gitPath = validator.trim(req.body.gitPath);
  let desc = validator.trim(req.body.desc);
  let orderId = validator.trim(req.body.orderId);

  if ([engName, cnName, category, gitPath, orderId].some(function (item) { return item === ''; })) {
    return output.error(req,res,"请检查参数是否为空！");;
  }

  contentModel.updateModule(function(engName, cnName, category, gitPath, desc, orderId, err,results) {
    if(err) {
      return output.error(req,res,err);
    }
    output.success(req,res,"修改Module成功",results);
  });
};

exports.querySettingsData = function (req, res, next) {
  contentModel.querySettingsData(function(err,results) {
    if(err) {
      return output.error(req,res,err);
    }
    output.success(req,res,"查询Settings列表成功",results);
  });
};

exports.queryPropData = function (req, res, next) {
  contentModel.queryPropData(function(err,results) {
    if(err) {
      return output.error(req,res,err);
    }
    output.success(req,res,"查询Prop列表成功",results);
  });
};
