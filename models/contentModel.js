var db = require('./db');
var eventproxy = require('eventproxy');
var logger = require('../common/logger');

var ContentModel = function() {};

ContentModel.prototype.queryConfigData = function (callback) {

  let sql = "SELECT * FROM configs";
  let sql_params = [];
  db.conn.query(sql,sql_params,function(err,rows,fields){
    if (err) {
        return callback(err);
    }
    callback(null, rows);
  });
}

ContentModel.prototype.queryModuleData = function (callback) {

  let sql = "SELECT * FROM modules";
  let sql_params = [];
  db.conn.query(sql,sql_params,function(err,rows,fields){
    if (err) {
        return callback(err);
    }
    callback(null, rows);
  });
}

ContentModel.prototype.querySettingsData = function (callback) {

  let sql = "SELECT * FROM settings";
  let sql_params = [];
  db.conn.query(sql,sql_params,function(err,rows,fields){
    if (err) {
        return callback(err);
    }
    callback(null, rows);
  });
}

ContentModel.prototype.queryPropData = function (callback) {

  let sql = "SELECT * FROM props";
  let sql_params = [];
  db.conn.query(sql,sql_params,function(err,rows,fields){
    if (err) {
        return callback(err);
    }
    callback(null, rows);
  });
}

var contentModel = new ContentModel();

module.exports = contentModel;
