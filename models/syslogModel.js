var eventproxy = require('eventproxy');
var db = require('../common/db');
var config = require('../config/config');
var logger = require('../common/logger');

var SyslogModel = function() {};

SyslogModel.prototype.queryByPage = function (offset, rows, callback) {
  let sql = "select * from syslog order by time desc limit ?,?";
  let sql_params = [offset,rows];
  db.conn.query(sql,sql_params,function(err,rows,fields){
    if (err) {
        return callback(err);
    }
    callback(null, rows);
  });
}

SyslogModel.prototype.queryTotalNum = function (callback) {
  var sql = "SELECT count(*) AS count FROM syslog";
  let sql_params = [];
  db.conn.query(sql,sql_params,function(err,rows,fields){
    if (err) {
        return callback(err);
    }
    callback(null, rows);
  });
}

SyslogModel.prototype.newAndSave = function(userName, action, detail, callback) {
  let sql = "insert into syslog(userName, action, detail) values (?,?,?)";
  let sql_params = [userName,action,detail];
  db.conn.query(sql,sql_params,function(err,rows,fields) {
      if(err) {
        return callback(err);
      }
      callback(null,rows);
  });
}

let syslogModel = new SyslogModel();

module.exports = syslogModel;
