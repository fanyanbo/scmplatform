var db = require('./db');
var eventproxy = require('eventproxy');
var logger = require('../common/logger');
var config = require('../config/config');
//var mysql = require( 'mysql');
// var connection = mysql.createConnection(config.mysql);
// connection.connect();
// connection.on('error', function(e){
//   logger.error(e);
// });

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

  let ep = new eventproxy();
  let _orderId;

  ep.bind('error', function (err) {
      logger.error("捕获到错误-->" + err);
      ep.unbind();
      callback(err,null);
  });

  ep.all('event1', 'event2', function (data1, data2) {

      let sql = "INSERT INTO modules(engName,cnName,category,gitPath,descText,orderId) values (?,?,?,?,?,?)";
      let sql_param = [engName,cnName,category,gitPath,desc,_orderId];
      db.conn.query(sql,sql_param,function(err,rows,fields){
        if (err) return ep.emit('error', err);
        return callback(null, "addModuleData OK");
      });
  });

  // let sql_category_count = "SELECT max(orderId) AS count FROM modules WHERE category = ?";
  // let sql_category_count_param = [category];
  // connection.query(sql_category_count,sql_category_count_param,function(err,rows,fields){
  //   if (err) {
  //       return ep.emit('error', err);
  //       // logger.debug(err);
  //       // return callback(err);
  //   }
  //   if(rows.length == 0) return callback("模块类别不存在!");
  //   logger.debug(rows[0].count + 1);
  //   //let sql = "INSERT INTO modules(engName,cnName,category,gitPath,descText,orderId) values (?,?,?,?,?,?)";
  //   //let sql = "INSERT INTO modules SET ?";
  //   //let sql_params = [engName,cnName,category,gitPath,desc,rows[0].count+1];
  //   //let sql_params = {'engName':engName,'cnName':cnName,'category':category,'gitPath':gitPath,'descText':desc,'orderId':rows[0].count+1};
  //   let sql = ""
  //   connection.query(sql,sql_params,function(err,rows,fields){
  //     if (err) {
  //         return ep.emit('error', err);
  //     }
  //     callback(null, rows);
  //   });
  // });
  let sql1 = "SELECT max(orderId) AS maxIndex FROM modules WHERE category = ?";
  let sql1_param = [category];
  db.conn.query(sql1,sql1_param,function(err,rows,fields){
    if (err) {
        return ep.emit('error', err);
    }
    if(rows.length == 0) return ep.emit('error', "模块类别不存在!");
    _orderId = rows[0].maxIndex + 1; //当新类别中没有任何模块是判断
    console.log(_orderId);
    ep.emit('event1',"event1 OK");
  });

  let sql2 = "SELECT * FROM modules WHERE engName = ?";
  let sql2_param = [engName];
  db.conn.query(sql2,sql2_param,function(err,rows,fields){
    if (err) {
        return ep.emit('error', err);
    }
    if(rows.length == 0) return ep.emit('event2',"event2 OK");
    ep.emit('error', "engName必须唯一!");
  });
}

ContentModel.prototype.updateModuleData = function (engName, cnName, category, gitPath, desc, orderId, callback) {

  //*******************************下面这条语句导致TCP协议抛异常：ECONNRESET
  // let sql_category_count = "SELECT max(orderId) AS count FROM modules WHERE category = ?"; //当修改类别时需要同步修改orderId,以免在新分类中造成冲突
  // logger.debug(sql_category_count);
  // let sql_category_count_param = [category];
  // db.conn.query(sql_category_count,sql_category_count_param,function(err,rows,fields){
  //   if (err) return callback(err);
  //   let _orderId = (rows.length == 0) ? 1 : rows[0].count + 1; //当新类别中没有任何模块是判断
  //   var sql = "UPDATE modules SET cnName = ?, category = ?, gitPath = ?, descText = ?, orderId = ? WHERE engName = ?";
  //   logger.debug(sql);
  //   let sql_params = [cnName,category,gitPath,desc,_orderId,engName];
  //   db.conn.query(sql,sql_params,function(err,rows,fields){
  //     if (err) return callback(err);
  //     callback(null, rows);
  //   });
  // });
    let sql = "UPDATE modules SET cnName = ?, category = ?, gitPath = ?, descText = ?, orderId = ? WHERE engName = ?";
    logger.debug(sql);
    let sql_params = [cnName,category,gitPath,desc,orderId,engName];
    logger.debug(sql_params);
    db.conn.query(sql,sql_params,function(err,rows,fields){
      if (err) return callback(err);
      callback(null, rows);
    });
}

ContentModel.prototype.deleteModuleData = function (callback) {
  let fyb = "fyb";
  let sql_category_count = "DELETE FROM modules WHERE engName = ?";
  let sql_category_count_param = [fyb];
  db.conn.query(sql_category_count,sql_category_count_param,function(err,rows,fields){
    if (err) return callback(err);
    console.log(rows.length);
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
