var eventproxy = require('eventproxy');
var db = require('../common/db');
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

/**
 * @param {新增config的分类，config的分类名唯一，同时保证增加的分类orderId值最大}
 */
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
  db.conn.query(sql1,[],function(err,rows,fields){
    if (err) {
      logger.error("查询configcategory表中最大orderId发生错误：" + err);
      return ep.emit('error', err);
    }
    if(rows.length == 0) return ep.emit('error', "模块类别不存在!");
    _orderId = rows[0].orderId + 1; //当新类别中没有任何模块是判断
    console.log("新增的config分类的orderId = " + _orderId);
    ep.emit('event1',"event1 OK");
  });

  let sql2 = "SELECT * FROM configcategory WHERE category = ?";
  db.conn.query(sql2,[categoryName],function(err,rows,fields){
    if (err) {
      logger.error("查询configcategory表发生错误：" + err);
      return ep.emit('error', err);
    }
    if(rows.length == 0) return ep.emit('event2',"event2 OK");
    ep.emit('error', "categoryName必须唯一!");
  });
}

/**
 * @param {更新config分类的排序}
 */
ConfigModel.prototype.updateCategoryOrderId = function (arr, callback) {

  if(arr.length == 0) return callback("updateCategory参数为空",null);

  let ep = new eventproxy();

  ep.bind('error', function (err) {
      logger.error("捕获到错误-->" + err);
      ep.unbind();
      callback(err,null);
  });

  ep.after('update_result', arr.length, function (list) {
      for(let j in list){
        console.log(list[j]);
      }
      callback(null,"updateCategory OK");
  });

  for (let i = 0; i < arr.length; i++) {
    let sql = "UPDATE configcategory SET orderId = ? WHERE category = ?";
    let sql_param = [arr[i].orderId,arr[i].category];
    db.conn.query(sql,sql_param,function(err,rows,fields) {
      if(err) {
        logger.error("更新configcategory表的orderId发生错误:" + err);
        return ep.emit('error', err);
      }
      ep.emit('update_result', 'ok' + i);
    });
  }
}

/**
 * @param {更新分类里子项的排序}
 */
ConfigModel.prototype.updateItemsOrderId = function (arr, callback) {

  if(arr.length == 0) return callback("updateConfigItemsOrderId参数为空!",null);

  let ep = new eventproxy();

  ep.bind('error', function (err) {
      logger.error("捕获到错误-->" + err);
      ep.unbind();
      callback(err,null);
  });

  ep.after('update_result', arr.length, function (list) {
      callback(null,"updateCategory OK");
  });

  for (let i = 0; i < arr.length; i++) {
    let sql = "UPDATE configs SET orderId = ? WHERE engName = ?";
    let sql_param = [arr[i].orderId,arr[i].engName];
    db.conn.query(sql,sql_param,function(err,rows,fields) {
      if (err) {
        logger.error("更新configs表的orderId发生错误:" + err);
        return ep.emit('error', err);
      }
      ep.emit('update_result', 'ok' + i);
    });
  }
}

/**
 * @param {新增模块项，新增的模块项在所属分类里orderId默认为最大值}
 * @param {这里进行插入操作时容易出错，要明确哪些字段是不能重复的}
 */
ConfigModel.prototype.add = function (engName, cnName, category, type, options, defaultValue, desc, callback) {
  //SELECT orderId FROM configs WHERE category = '广告配置' order by orderId desc limit 0,1
  let sql_order = "SELECT orderId FROM configs WHERE category = ? order by orderId desc limit 0,1";
  db.conn.query(sql_order,[category],function(err,rows,fields){
    if (err) {
      logger.error("查询configs表的orderId发生错误:" + err);
      return callback(err);
    }
    let _orderId = (rows.length == 0) ? 1 : rows[0].orderId + 1; //当新类别中没有任何模块是判断
    console.log("新增的mk模块的orderId：" + _orderId);
    let sql = "INSERT INTO configs(engName,cnName,category,typeStr,options,defaultValue,descText,orderId) VALUES (?,?,?,?,?,?,?,?)";
    let sql_params = [engName,cnName,category,type,options,defaultValue,desc,_orderId];
    db.conn.query(sql,sql_params,function(err,rows,fields){
      if (err) {
        logger.error("新增configs表发生错误:" + err);
        return callback(err);
      }
      callback(null, rows);
    });
  });
}

/**
 * @param {更新模块项}
 * @param {要明确哪些字段是不能重复的，目前只有engName不能改}
 */
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
