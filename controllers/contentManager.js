var logger = require('../common/logger');
var contentModel = require('../models/contentModel');

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

exports.queryModuleData = function (req, res, next) {
  contentModel.queryModuleData(function(err,results) {
    if(err) {
      return output.error(req,res,err);
    }
    output.success(req,res,"查询Module列表成功",results);
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
