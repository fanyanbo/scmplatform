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
  let engName = data.engName;
  let defaultValue = data.defaultValue;
  let category = data.category;
  let desc = data.desc;
  let sql = "INSERT INTO props (engName,defaultValue,category,desc) VALUES (?,?,?,?)";
  let sql_params = [engName,defaultValue,category,desc];
  db.conn.query(sql,sql_params,function(err,rows,fields){
    if (err) {
      logger.error("新增props项发生错误:" + err);
      return callback(err);
    }
    callback(null, rows);
  });

}

PropModel.prototype.update = function (data, callback) {
  let engName = data.engName;
  let defaultValue = data.defaultValue;
  let category = data.category;
  let desc = data.desc;
  let sql = "UPDATE props SET defaultValue = ?, category = ?, desc = ? WHERE engName = ?";
  let sql_params = [defaultValue,category,desc,engName];
  db.conn.query(sql,sql_params,function(err,rows,fields){
    if (err) {
      logger.error("更新属性信息发生错误:" + err);
      return callback(err);
    }
    callback(null, rows);
  });
}

/**
 * @param {新增props的分类，props的分类名唯一，同时保证增加的分类orderId值最大}
 */
PropModel.prototype.addCategory = function (categoryName, callback) {

  let ep = new eventproxy();
  let _orderId;

  ep.bind('error', function (err) {
      logger.error("捕获到错误-->" + err);
      ep.unbind();
      callback(err,null);
  });

  ep.all('event1', 'event2', function (data1, data2) {
      let sql = "INSERT INTO propscategory(category,orderId) values (?,?)";
      let sql_param = [categoryName,_orderId];
      db.conn.query(sql,sql_param,function(err,rows,fields){
        if (err) return ep.emit('error', err);
        return callback(null, "addPropsCategory OK");
      });
  });

  let sql1 = "SELECT orderId FROM propscategory order by orderId desc limit 0,1";
  db.conn.query(sql1,[],function(err,rows,fields){
    if (err) {
      logger.error("查询propscategory表中最大orderId发生错误：" + err);
      return ep.emit('error', err);
    }
    if(rows.length == 0) return ep.emit('error', "props类别不存在!");
    _orderId = rows[0].orderId + 1; //当新类别中没有任何模块是判断
    console.log("新增的props分类的orderId = " + _orderId);
    ep.emit('event1',"event1 OK");
  });

  let sql2 = "SELECT * FROM propscategory WHERE category = ?";
  db.conn.query(sql2,[categoryName],function(err,rows,fields){
    if (err) {
      logger.error("查询propscategory表发生错误：" + err);
      return ep.emit('error', err);
    }
    if(rows.length == 0) return ep.emit('event2',"event2 OK");
    ep.emit('error', "categoryName必须唯一!");
  });
}

var propModel = new PropModel();

module.exports = propModel;
