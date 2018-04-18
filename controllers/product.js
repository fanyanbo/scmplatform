var validator = require('validator');
var eventproxy = require('eventproxy');
var config = require('../config/config');
var logger = require('../common/logger');
var output = require('../common/output');
var ProductModel = require('../models/product');

var productModel = new ProductModel();

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

};

exports.queryHistory = function (req, res, next) {

};

exports.update = function (req, res, next) {

};
