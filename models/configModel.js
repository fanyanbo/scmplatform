var db = require('./db');
var eventproxy = require('eventproxy');
var logger = require('../common/logger');
var config = require('../config/config');

var ConfigModel = function() {};

ConfigModel.prototype.query = function (callback) {

  let sql = "SELECT * FROM configs";
  let sql_params = [];
  db.conn.query(sql,sql_params,function(err,rows,fields){
    if (err) {
        return callback(err);
    }
    callback(null, rows);
  });
}

ConfigModel.prototype.add = function (engName, cnName, category, type, options, defaultValue, desc, callback) {

  let sql_order = "SELECT orderId FROM configs WHERE category = ? order by orderId desc limit 0,1";
  let sql_order_param = [category];
  db.conn.query(sql_order,sql_order_param,function(err,rows,fields){
    if (err) {
        return callback(err);
    }
    let _orderId = (rows.length == 0) ? 1 : rows[0].count + 1; //当新类别中没有任何模块是判断
    let sql = "INSERT INTO configs(engName,cnName,category,typeStr,options,defaultValue,descText,orderId) VALUES (?,?,?,?,?,?,?,?)";
    let sql_params = [engName,cnName,category,type,options,defaultValue,desc,_orderId];
    logger.debug(sql_params);
    db.conn.query(sql,sql_params,function(err,rows,fields){
      if (err) {
          return callback(err);
      }
      callback(null, rows);
    });
  });
}

ConfigModel.prototype.update = function (engName, cnName, category, type, options, defaultValue, desc, orderId, callback) {

  let sql_category_count = "SELECT max(orderId) AS count FROM modules WHERE category = ?"; //当修改类别时需要同步修改orderId,以免在新分类中造成冲突
  logger.debug(sql_category_count);
  let sql_category_count_param = [category];
  db.conn.query(sql_category_count,sql_category_count_param,function(err,rows,fields){
    if (err) return callback(err);

  //  if(rows.length == 0) return callback("模块类别不存在!");
    let _orderId = (rows.length == 0) ? 1 : rows[0].count + 1; //当新类别中没有任何模块是判断

    var sql = "UPDATE configs SET cnName = ?, category = ?, typeStr = ?, options = ?, defaultValue = ?, descText = ?, orderId = ? WHERE engName = ?";
    logger.debug(sql);
    let sql_params = [cnName,category,type,options,defaultValue,desc,_orderId,engName];
    db.conn.query(sql,sql_params,function(err,rows,fields){
      if (err) return callback(err);
      callback(null, rows);
    });
  });
}


var configModel = new ConfigModel();

module.exports = configModel;
