var validator = require('validator');
var eventproxy = require('eventproxy');
var config = require('../config/config');
var logger = require('../common/logger');
var output = require('../common/output');
var productModel = require('../models/product');

/**
 * @param {HttpRequest} req
 * @param {HttpResponse} res
 * @param {Function} next
 */
exports.add = function (req, res, next) {
    res.json("add:" + req.url);
};

exports.delete = function (req, res, next) {
    res.json("delete:" + req.url);
};

exports.queryByPage = function (req, res, next) {
  let offset = +req.body.offset;
  let rows = +req.body.rows;
  productModel.queryByPage(offset, rows, function(err,results) {
    if(err) {
      return output.error(req,res,err);
    }
    output.success(req,res,"分页查询产品表成功",results);
  });
};

exports.queryByRegEx = function (req, res, next) {

    let _chip = req.body.chip;
    let _model = req.body.model;
    let _version = req.body.version;
    let _soc = req.body.soc;
    let _memory = req.body.memory;

    productModel.queryByRegEx(_chip,_model,_version,_memory,_soc,function(err,results) {
      if(err) {
        return output.error(req,res,err);
      }
      output.success(req,res,"模糊查询产品表成功",results);
    });
};

exports.queryByModule = function (req, res, next) {

    let _name = req.body.name;

    productModel.queryByModule(_name, function(err,results) {
      if(err) {
        return output.error(req,res,err);
      }
      output.success(req,res,"按模块查询产品表成功",results);
    });
};

exports.queryHistory = function (req, res, next) {
    let _chip = req.body.chip;
    let _model = req.body.model;
    productModel.queryHistory(_chip,_model,function(err,results) {
      if(err) {
        return output.error(req,res,err);
      }
      output.success(req,res,"查询产品修改历史表成功",results);
    });
};

exports.queryTargetProduct = function (req, res, next) {

    productModel.queryHistory(_chip,_model,function(err,results) {
      if(err) {
        return output.error(req,res,err);
      }
      output.success(req,res,"查询产品修改历史表成功",results);
    });
};

exports.update = function (req, res, next) {

};
