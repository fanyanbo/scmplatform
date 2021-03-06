var mailer        = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');
var config        = require('../config/config');
var util          = require('util');
var logger = require('./logger');
var transporter     = mailer.createTransport(smtpTransport(config.mail_opts));
var SITE_ROOT_URL = 'http://' + config.host;
var async = require('async')

/**
 * Send an email
 * @param {Object} data 邮件对象
 */
var sendMail = function (data, callback) {
  logger.info(data);
  // if (config.debug) {
  //   return;
  // }

  // 重试5次
  async.retry({times: 5}, function (done) {

    transporter.sendMail(data, function (err) {
      if (err) {
        // 写为日志
        logger.error('send mail error', err, data);
        return done(err);
      }
      return done()
    });
  }, function (err) {
    if (err) {
      return callback(err, null);
    }
    //logger.info('send mail success', data)
    callback(null,'send mail success');
  })
};
exports.sendMail = sendMail;

/**
 * 发送激活通知邮件
 * @param {String} who 接收人的邮件地址
 * @param {String} token 重置用的token字符串
 * @param {String} name 接收人的用户名
 */
exports.sendActiveMail = function (data, callback) {
  let _from = data.from;
  let _to = data.to;
  let _subject = data.subject;
  let _html = data.desc;

  var from    = util.format('%s <%s>', config.name, config.mail_opts.auth.user);
  var to      = _to;
  var cc      = _from;
  var subject = _subject;
  var html    = _html;
  // var subject = config.name + '帐号激活';
  // var html    = '<p>您好：' + name + '</p>' +
  //   '<p>我们收到您在' + config.name + '的注册信息，请点击下面的链接来激活帐户：</p>' +
  //   '<a href  = "' + SITE_ROOT_URL + '/active_account?key=' + token + '&name=' + name + '">激活链接</a>' +
  //   '<p>若您没有在' + config.name + '填写过注册信息，说明有人滥用了您的电子邮箱，请删除此邮件，我们对给您造成的打扰感到抱歉。</p>' +
  //   '<p>' + config.name + ' 谨上。</p>';

  exports.sendMail({
    from: from,
    to: to,
    cc: cc,
    subject: subject,
    html: html
  }, callback);
};

/**
 * 发送密码重置通知邮件
 * @param {String} who 接收人的邮件地址
 * @param {String} token 重置用的token字符串
 * @param {String} name 接收人的用户名
 */
exports.sendResetPassMail = function (who, token, name) {
  var from = util.format('%s <%s>', config.name, config.mail_opts.auth.user);
  var to = who;
  var subject = config.name + '社区密码重置';
  var html = '<p>您好：' + name + '</p>' +
    '<p>我们收到您在' + config.name + '社区重置密码的请求，请在24小时内单击下面的链接来重置密码：</p>' +
    '<a href="' + SITE_ROOT_URL + '/reset_pass?key=' + token + '&name=' + name + '">重置密码链接</a>' +
    '<p>若您没有在' + config.name + '社区填写过注册信息，说明有人滥用了您的电子邮箱，请删除此邮件，我们对给您造成的打扰感到抱歉。</p>' +
    '<p>' + config.name + '社区 谨上。</p>';

  exports.sendMail({
    from: from,
    to: to,
    subject: subject,
    html: html
  });
};

//exports.sendActiveMail("linxinwang@skyworth.com","aaa","linxinwang");
