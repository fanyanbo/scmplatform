//var bcrypt = require('bcrypt');
var validator = require('validator');
var bcrypt = require('bcryptjs');//是对原有bcrypt的优化，优点是不需要安装任何依赖
var config  = require('../config/config');
var logger  = require('../common/logger');
var User = require('../models/user');
//var user = new User();

/**
 * @param {HttpRequest} req
 * @param {HttpResponse} res
 * @param {Function} next
 */
exports.login = function (req, res, next) {

    var loginname = validator.trim(req.query.loginname).toLowerCase();
    var pass      = validator.trim(req.query.password);
    // var password = "wonderful!";

    if (!loginname || !pass) {
      res.status(422);
      return res.json('信息不完整');
    }

     user.getUserByQuery(loginname, function(err,result){
       if(err){
         return res.send('调用接口报错！');
       }
       if(result.length == 0) {
         return res.json("用户不存在！");
       }
       logger.debug("result = " + result);
       if(result.length == 1) {
         let passStored = result[0].password;
         logger.debug("password1 = " + passStored + ",password2 = " + pass);
         bcrypt.compare(pass,passStored,(err,isMatch) => {
           if(err) logger.debug("bcrypt compare发生错误");
           logger.debug("isMatch = " + isMatch);
           if(isMatch) {
             req.session.username = loginname;
             req.session.logined = true;
             return res.json("登录成功！");
           } else {
             return res.json("密码有误！");
           }
        });
       }
     });
};

exports.verifySession = function (req, res, next) {
  logger.debug(req.session.username);
  logger.debug(req.session.logined);
  if(req.session.username && req.session.logined) {
    res.json("session有效！");
  }else{
    res.json("session失效！");
  }
}

exports.signup = function (req, res, next) {
    var loginname = validator.trim(req.body.loginname).toLowerCase();
    var pass = validator.trim(req.body.password);
    logger.debug("loginname = " + loginname + ", pass = " + pass);

    if (!loginname || !pass) {
      res.status(422);
      return res.json("信息不完整");
    }

    //生成salt的迭代次数
    const saltRounds = 10;
    //随机生成salt
    const salt = bcrypt.genSaltSync(saltRounds);
    //获取hash值
    var passhash = bcrypt.hashSync(pass, salt);
    logger.debug("passhash ：" + passhash);

    user.getUserByQuery(loginname,function(err, result) {
      if(err){
        return res.json("调用接口报错！");
      }
      if(result.length > 0) {
        return res.json("用户名已经存在！");
      }
      user.newAndSave(loginname,passhash,function(err) {
        if(err) {
          return res.json("调用接口报错！");
        }
        res.json("注册成功！");
      });

    });

}

exports.logout = function (req, res, next) {
    req.session.logined = false;
    res.json("登出成功！");
};
