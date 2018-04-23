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

ContentModel.prototype.addConfigData = function (engName, cnName, category, type, options, defaultValue, desc, callback) {

  let sql_category_count = "SELECT max(orderId) AS count FROM modules WHERE category = ?";
  logger.debug(sql_category_count);
  let sql_category_count_param = [category];
  db.conn.query(sql_category_count,sql_category_count_param,function(err,rows,fields){
    if (err) {
        return callback(err);
    }
    if(rows.length == 0) return callback("模块类别不存在!");

    let sql = "INSERT INTO configs(engName,cnName,category,type,options,defaultValue,desc,orderId) values (?,?,?,?,?,?,?,?)";
    logger.debug(sql);
    let sql_params = [engName,cnName,category,type,options,defaultValue,desc,rows[0].count+1];
    db.conn.query(sql,sql_params,function(err,rows,fields){
      if (err) {
          return callback(err);
      }
      callback(null, rows);
    });
  });
}

ContentModel.prototype.updateConfigData = function (engName, cnName, category, type, options, defaultValue, desc, orderId, callback) {

  let sql_category_count = "SELECT max(orderId) AS count FROM modules WHERE category = ?"; //当修改类别时需要同步修改orderId,以免在新分类中造成冲突
  logger.debug(sql_category_count);
  let sql_category_count_param = [category];
  db.conn.query(sql_category_count,sql_category_count_param,function(err,rows,fields){
    if (err) return callback(err);

  //  if(rows.length == 0) return callback("模块类别不存在!");
    let _orderId = (rows.length == 0) ? 1 : rows[0].count + 1; //当新类别中没有任何模块是判断

    var sql = "UPDATE configs SET cnName = ?, category = ?, type = ?, options = ?, defaultValue = ?, desc = ?, orderId = ? WHERE engName = ?";
    logger.debug(sql);
    let sql_params = [cnName,category,type,options,defaultValue,desc,_orderId,engName];
    db.conn.query(sql,sql_params,function(err,rows,fields){
      if (err) return callback(err);
      callback(null, rows);
    });
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

ContentModel.prototype.addModuleData = function (engName, cnName, category, gitPath, desc, callback) {

  let sql_category_count = "SELECT max(orderId) AS count FROM modules WHERE category = ?";
  logger.debug(sql_category_count);
  let sql_category_count_param = [category];
  db.conn.query(sql_category_count,sql_category_count_param,function(err,rows,fields){
    if (err) {
        return callback(err);
    }
    if(rows.length == 0) return callback("模块类别不存在!");

    let sql = "INSERT INTO modules(engName,cnName,category,gitPath,descText,orderId) values (?,?,?,?,?,?)";
    logger.debug(sql);
    let sql_params = [engName,cnName,category,gitPath,desc,rows[0].count+1];
    db.conn.query(sql,sql_params,function(err,rows,fields){
      if (err) {
          return callback(err);
      }
      callback(null, rows);
    });
  });
}

ContentModel.prototype.updateModuleData = function (engName, cnName, category, gitPath, desc, callback) {

  let sql_category_count = "SELECT max(orderId) AS count FROM modules WHERE category = ?"; //当修改类别时需要同步修改orderId,以免在新分类中造成冲突
  logger.debug(sql_category_count);
  let sql_category_count_param = [category];
  db.conn.query(sql_category_count,sql_category_count_param,function(err,rows,fields){
    if (err) return callback(err);
    let _orderId = (rows.length == 0) ? 1 : rows[0].count + 1; //当新类别中没有任何模块是判断
    var sql = "UPDATE modules SET cnName = ?, category = ?, gitPath = ?, descText = ?, orderId = ? WHERE engName = ?";
    logger.debug(sql);
    let sql_params = [cnName,category,gitPath,desc,_orderId,engName];
    db.conn.query(sql,sql_params,function(err,rows,fields){
      if (err) return callback(err);
      callback(null, rows);
    });
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
