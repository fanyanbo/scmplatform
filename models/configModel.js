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

ConfigModel.prototype.queryByCategory = function (category, callback) {

  let sql = "SELECT * FROM configs WHERE category = ? order by orderId";
  let sql_params = [category];
  db.conn.query(sql,sql_params,function(err,rows,fields){
    if (err) {
        return callback(err);
    }
    callback(null, rows);
  });
}

ConfigModel.prototype.queryCategory = function (callback) {

  let sql = "SELECT * FROM configcategory order by orderId";
  let sql_params = [];
  db.conn.query(sql,sql_params,function(err,rows,fields){
    if (err) {
        return callback(err);
    }
    callback(null, rows);
  });
}

ConfigModel.prototype.addCategory = function (categoryName, callback) {

  let sql = "SELECT * FROM configcategory";
  let sql_params = [];
  db.conn.query(sql,sql_params,function(err,rows,fields){
    if (err) {
        return callback(err);
    }
    callback(null, rows);
  });
}

ConfigModel.prototype.addCategory = function (categoryName, callback) {

  let ep = new eventproxy();
  let _orderId;

  ep.bind('error', function (err) {
      logger.error("捕获到错误-->" + err);
      ep.unbind();
      callback(err,null);
  });

  ep.all('event1', 'event2', function (data1, data2) {
      let sql = "INSERT INTO configcategory(category,orderId) values (?,?)";
      let sql_param = [categoryName,_orderId];
      db.conn.query(sql,sql_param,function(err,rows,fields){
        if (err) return ep.emit('error', err);
        return callback(null, "addModuleCategory OK");
      });
  });

  let sql1 = "SELECT orderId FROM configcategory order by orderId desc limit 0,1";
  let sql1_param = [];
  db.conn.query(sql1,sql1_param,function(err,rows,fields){
    if (err) {
        return ep.emit('error', err);
    }
    if(rows.length == 0) return ep.emit('error', "模块类别不存在!");
    _orderId = rows[0].orderId + 1; //当新类别中没有任何模块是判断
    console.log(_orderId);
    ep.emit('event1',"event1 OK");
  });

  let sql2 = "SELECT * FROM configcategory WHERE category = ?";
  let sql2_param = [categoryName];
  db.conn.query(sql2,sql2_param,function(err,rows,fields){
    if (err) {
        return ep.emit('error', err);
    }
    if(rows.length == 0) return ep.emit('event2',"event2 OK");
    ep.emit('error', "categoryName必须唯一!");
  });
}

ConfigModel.prototype.updateCategoryOrderId = function (arr, callback) {
  console.log("enter updateCategoryOrderId model");
  if(arr.length == 0) return callback("updateCategory参数为空",null);

  let ep = new eventproxy();

  ep.bind('error', function (err) {
      logger.error("捕获到错误-->" + err);
      ep.unbind();
      callback(err,null);
  });

  ep.after('update_result', arr.length, function (list) { // 所有查询的内容都存在list数组中
      for(let j in list){
        console.log(list[j]);
      }
      callback(null,"updateCategory OK");
  });

  for (let i = 0; i < arr.length; i++) { //数据结果与调用顺序无关
    let sql = "UPDATE configcategory SET orderId = ? WHERE category = ?";
    let sql_param = [arr[i].orderId,arr[i].category];
    db.conn.query(sql,sql_param,function(err,rows,fields) {
      if(err) return ep.emit('error', err);
      ep.emit('update_result', 'ok' + i);
    });
  }
}

ConfigModel.prototype.updateItemsOrderId = function (arr, callback) {

  console.log("enter updateItemsOrderId model");
  if(arr.length == 0) return callback("updateConfigItemsOrderId参数为空!",null);

  let ep = new eventproxy();

  ep.bind('error', function (err) {
      logger.error("捕获到错误-->" + err);
      ep.unbind();
      callback(err,null);
  });

  ep.after('update_result', arr.length, function (list) { // 所有查询的内容都存在list数组中
      callback(null,"updateCategory OK");
  });

  for (let i = 0; i < arr.length; i++) { //数据结果与调用顺序无关
    let sql = "UPDATE configs SET orderId = ? WHERE engName = ?";
    let sql_param = [arr[i].orderId,arr[i].engName];
    db.conn.query(sql,sql_param,function(err,rows,fields) {
      if (err) return ep.emit('error', err);
      ep.emit('update_result', 'ok' + i);
    });
  }
}

ConfigModel.prototype.add = function (engName, cnName, category, type, options, defaultValue, desc, callback) {

  let sql_order = "SELECT orderId FROM configs WHERE category = ? order by orderId desc limit 0,1";
  let sql_order_param = [category];
  db.conn.query(sql_order,sql_order_param,function(err,rows,fields){
    if (err) {
        return callback(err);
    }
    let _orderId = (rows.length == 0) ? 1 : rows[0].count + 1; //当新类别中没有任何模块是判断
    console.log(_orderId);
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
