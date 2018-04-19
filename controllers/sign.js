var validator = require('validator');
var eventproxy = require('eventproxy');
var config = require('../config/config');
var utility = require('utility');
var output = require('../common/output');
var logger = require('../common/logger');

var User = require('../models/user');
var user = new User();

/**
 * Handle user login.
 *
 * @param {HttpRequest} req
 * @param {HttpResponse} res
 * @param {Function} next
 */
exports.login = function (req, res, next) {

    logger.debug("enter login");
    var loginname = validator.trim(req.body.loginname).toLowerCase();
    var pass = validator.trim(req.body.password);

    if (!loginname || !pass) {
      return output.error(req,res,"用户信息不完整!");
    }

    user.getUserByQuery(loginname, function(err,result) {
       if(err){
         return output.error(req,res,"调用接口报错!");
       }
       if(result.length == 0) {
         return output.error(req,res,"用户不存在!");
       }
       logger.debug("result = " + result[0]);
       if(result.length == 1) {
         let passStored = result[0].password;
         if(passStored == pass){
           req.session.username = loginname;
           req.session.logined = true;
           req.session.level = result[0].adminFlag;
           output.success(req,res,"登录成功!");
         }else{
           output.error(req,res,"密码有误!");
         }
       }
     });
};

exports.verify = function (req, res, next) {
  logger.debug(req.session.username);
  logger.debug(req.session.logined);
  if(req.session.username && req.session.logined) {
    let resultData = {};
    resultData.username = req.session.username;
    resultData.logined = req.session.logined;
    resultData.level = req.session.level;
    output.success(req,res,"验证成功!",resultData);
  }else{
    output.error(req,res,"验证失败!");
  }
}

exports.logout = function (req, res, next) {
    if(req.session.username == undefined){
      output.error(req,res,"当前已是登出状态!");
    }else{
      req.session.logined = false;
      output.success(req,res,"登出成功!");
    }
};
