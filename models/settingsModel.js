var db = require('./db');
var eventproxy = require('eventproxy');
var logger = require('../common/logger');
var config = require('../config/config');

var SettingsModel = function() {};


SettingsModel.prototype.query = function (callback) {

  let sql = "SELECT * FROM settings";
  let sql_params = [];
  db.conn.query(sql,sql_params,function(err,rows,fields){
    if (err) {
        return callback(err);
    }
    callback(null, rows);
  });
}

SettingsModel.prototype.update = function (engName, cnName, desc, callback) {

  let sql = "UPDATE settings SET cnName = ?, descText = ? WHERE engName = ?";
  let sql_params = [cnName,desc,engName];
  db.conn.query(sql,sql_params,function(err,rows,fields){
    if (err) return callback(err);
    callback(null, rows);
  });
}

SettingsModel.prototype.add = function (engName, cnName, desc, callback) {

  let sql = "SELECT * FROM settings";
  let sql_params = [];
  db.conn.query(sql,sql_params,function(err,rows,fields){
    if (err) {
        return callback(err);
    }
    callback(null, rows);
  });
}


var settingsModel = new SettingsModel();

module.exports = settingsModel;
