var eventproxy = require('eventproxy');
var db = require('../common/db');
var logger = require('../common/logger');
var config = require('../config/config');

var PropModel = function() {};

PropModel.prototype.query = function (callback) {
  let sql = "SELECT * FROM props";
  db.conn.query(sql,[],function(err,rows,fields){
    if (err) {
        return callback(err);
    }
    callback(null, rows);
  });
}

PropModel.prototype.queryCategory = function (callback) {
  let sql = "SELECT * FROM propscategory";
  db.conn.query(sql,[],function(err,rows,fields){
    if (err) {
        return callback(err);
    }
    callback(null, rows);
  });
}

PropModel.prototype.add = function (data, callback) {
  callback("err");
}

PropModel.prototype.update = function (data, callback) {
  callback("err");
}

var propModel = new PropModel();

module.exports = propModel;
