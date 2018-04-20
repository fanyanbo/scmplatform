var db = require('./db');
var eventproxy = require('eventproxy');
var logger = require('../common/logger');

var DeviceModel = function() {};

DeviceModel.prototype.queryChip = function (callback) {

  let sql = "SELECT * FROM chips";
  let sql_params = [];
  db.conn.query(sql,sql_params,function(err,rows,fields){
    if (err) {
        return callback(err);
    }
    callback(null, rows);
  });
}

DeviceModel.prototype.addChip = function (chip, callback) {

  let sql = "INSERT INTO chips(name) values (?)";
  let sql_params = [chip];
  db.conn.query(sql,sql_params,function(err,rows,fields){
    if (err) {
        return callback(err);
    }
    callback(null, rows);
  });
}

DeviceModel.prototype.updateChip = function (newValue, oldValue, callback) {
  var sql = "UPDATE chips set name = ? WHERE name = ?";
  let sql_params = [newValue,oldValue];
  db.conn.query(sql,sql_params,function(err,rows,fields){
    if (err) {
        return callback(err);
    }
    callback(null, rows);
  });
}

DeviceModel.prototype.queryModel = function (callback) {

  let sql = "SELECT * FROM models";
  let sql_params = [];
  db.conn.query(sql,sql_params,function(err,rows,fields){
    if (err) {
        return callback(err);
    }
    callback(null, rows);
  });
}

DeviceModel.prototype.addModel = function (value, callback) {

  let sql = "INSERT INTO models(name) values (?)";
  let sql_params = [value];
  db.conn.query(sql,sql_params,function(err,rows,fields){
    if (err) {
        return callback(err);
    }
    callback(null, rows);
  });
}

DeviceModel.prototype.updateModel = function (newValue, oldValue, callback) {
  var sql = "UPDATE models set name = ? WHERE name = ?";
  let sql_params = [newValue,oldValue];
  db.conn.query(sql,sql_params,function(err,rows,fields){
    if (err) {
        return callback(err);
    }
    callback(null, rows);
  });
}

DeviceModel.prototype.queryTargetProduct = function (callback) {

  let sql = "SELECT * FROM targetProducts";
  let sql_params = [];
  db.conn.query(sql,sql_params,function(err,rows,fields){
    if (err) {
        return callback(err);
    }
    callback(null, rows);
  });
}

DeviceModel.prototype.addTargetProduct = function (value, callback) {

  let sql = "INSERT INTO targetProducts(name) values (?)";
  let sql_params = [value];
  db.conn.query(sql,sql_params,function(err,rows,fields){
    if (err) {
        return callback(err);
    }
    callback(null, rows);
  });
}

DeviceModel.prototype.updateTargetProduct = function (newValue, oldValue, callback) {
  var sql = "UPDATE targetProducts set name = ? WHERE name = ?";
  let sql_params = [newValue,oldValue];
  db.conn.query(sql,sql_params,function(err,rows,fields){
    if (err) {
        return callback(err);
    }
    callback(null, rows);
  });
}

DeviceModel.prototype.querySoc = function (callback) {

  let sql = "SELECT * FROM soc";
  let sql_params = [];
  db.conn.query(sql,sql_params,function(err,rows,fields){
    if (err) {
        return callback(err);
    }
    callback(null, rows);
  });
}

DeviceModel.prototype.addSoc = function (value, callback) {

  let sql = "INSERT INTO soc(name) values (?)";
  let sql_params = [value];
  db.conn.query(sql,sql_params,function(err,rows,fields){
    if (err) {
        return callback(err);
    }
    callback(null, rows);
  });
}

DeviceModel.prototype.updateSoc = function (newValue, oldValue, callback) {
  var sql = "UPDATE soc set name = ? WHERE name = ?";
  let sql_params = [newValue,oldValue];
  db.conn.query(sql,sql_params,function(err,rows,fields){
    if (err) {
        return callback(err);
    }
    callback(null, rows);
  });
}


var deviceModel = new DeviceModel();

module.exports = deviceModel;
