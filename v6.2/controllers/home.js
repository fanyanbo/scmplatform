var config = require('../../config/config');
var logger = require('../../common/logger');
var statisticsModel = require('../models/statisticsModel');
var syslogModel = require('../models/syslogModel');
var output = require('../../common/output');

//var statistics = new Statistics();
//var syslog = new Syslog();

/**
 * @param {HttpRequest} req
 * @param {HttpResponse} res
 * @param {Function} next
 */
exports.getSummary = function (req, res, next) {

    statisticsModel.getSummaryByQuery(null, function(err,results) {
      if(err) {
        return output.error(req,res,err);
      }
      let resultData = {};
      resultData.productTotalNum = results[0];
      resultData.chipTotalNum = results[1];
      resultData.modelTotalNum = results[2];
      resultData.mstarTotalNum = results[3];
      resultData.hisiTotalNum = results[4];
      resultData.rtkTotalNum = results[5];
      resultData.amlogicTotalNum = results[6];
      resultData.novaTotalNum = results[7];

      return output.success(req,res,resultData);
    });
};

exports.querySyslog = function (req, res, next) {

    let offset = +req.body.offset;
    let rows = +req.body.rows;
    syslogModel.queryByPage(offset, rows, function(err,results) {
      if(err) {
        return output.error(req,res,err);
      }
      output.success(req,res,"querySyslog查询成功",results);
    });
};

exports.querySyslogTotalNum = function (req, res, next) {

    syslogModel.queryTotalNum(function(err,results) {
      if(err) {
        return output.error(req,res,err);
      }
      output.success(req,res,"查询系统日志项总数成功",results);
    });
};

exports.addSyslog = function (req, res, next) {

    let userName = req.body.userName;
    let action = req.body.action;
    let detail = req.body.detail;
    syslogModel.newAndSave(userName, action, detail, function(err,results) {
      if(err) {
        return output.error(req,res,"addSyslog执行失败!");
      }
      output.success(req,res,"addSyslog执行成功!");
    });
};
