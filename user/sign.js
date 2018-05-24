var validator = require('validator');
var eventproxy = require('eventproxy');
var utility = require('utility');
var config = require('../config/config');
var output = require('../common/output');
var logger = require('../common/logger');
var mailer = require('../common/mail');
var userModel = require('./userModel');

//var user = new User();

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

    userModel.getUserByQuery(loginname, function(err,result) {
       if(err){
         return output.error(req,res,err);
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
           req.session.email = result[0].email;
           return output.success(req,res,"登录成功!");
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
    resultData.email = req.session.email;
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
      // let userName = req.body.userName;
      // let action = req.body.action;
      // let detail = req.body.detail;
      // syslogModel.newAndSave(userName, action, detail, function(err,results) {
      //   if(err) {
      //     return output.error(req,res,"当前登出操作失败!");
      //   }
      //   req.session.logined = false;
      //   output.success(req,res,"登出成功!");
      // });
   }
};

exports.sendMail = function (req, res, next) {
  let data = req.body.data;
  console.log(data);
  mailer.sendActiveMail(data,function(err,data){
    if (err) return output.error(req,res,"发送邮件失败!");
    output.success(req,res,"发送邮件成功!");
  });
};

exports.getUserInfo = function (req, res, next) {
  let userName = req.body.userName;
  console.log(userName);
  userModel.getUserByQuery(loginname, function(err,result){
    if(err) return output.error(req,res,err);
    output.success(req,res,"获取用户信息成功!");
  });
}
