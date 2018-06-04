var eventproxy = require('eventproxy');
var db = require('../common/db');
var logger = require('../common/logger');
var config = require('../config/config');
//var mysql = require( 'mysql');
// var connection = mysql.createConnection(config.mysql);
// connection.connect();
// connection.on('error', function(e){
//   logger.error(e);
// });

var ModuleModel = function() {};

ModuleModel.prototype.query = function (callback) {

  let sql = "SELECT * FROM modules";
  let sql_params = [];
  db.conn.query(sql,sql_params,function(err,rows,fields){
    if (err) {
        return callback(err);
    }
    callback(null, rows);
  });
}

ModuleModel.prototype.queryByCategory = function (category, callback) {

  let sql = "SELECT * FROM modules WHERE category = ? order by orderId";
  let sql_params = [category];
  db.conn.query(sql,sql_params,function(err,rows,fields){
    if (err) {
        return callback(err);
    }
    callback(null, rows);
  });
}

ModuleModel.prototype.add = function (engName, cnName, category, gitPath, desc, callback) {

  let ep = new eventproxy();
  let _orderId;

  ep.bind('error', function (err) {
      logger.error("捕获到错误-->" + err);
      ep.unbind();
      callback(err,null);
  });

  ep.all('event1', 'event2', function (data1, data2) {

      let sql = "INSERT INTO modules(engName,cnName,category,gitPath,descText,orderId) values (?,?,?,?,?,?)";
      console.log(sql);
      let sql_param = [engName,cnName,category,gitPath,desc,_orderId];
      console.log(sql_param);
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

ModuleModel.prototype.update = function (engName, cnName, category, gitPath, desc, orderId, callback) {

  //*******************************下面这条语句导致TCP协议抛异常：ECONNRESET****************************************
  // let sql_category_count = "SELECT max(orderId) AS count FROM modules WHERE category = ?"; //当修改类别时需要同步修改orderId,以免在新分类中造成冲突
  let sql_order = "SELECT orderId FROM modules WHERE category = ? order by orderId desc limit 0,1";
  let sql_order_param = [category];
  db.conn.query(sql_order,sql_order_param,function(err,rows,fields){
    if (err) return callback(err);
    let _orderId = (rows.length == 0) ? 1 : rows[0].orderId + 1; //当新类别中没有任何模块是判断
    logger.debug('updateModuleData _orderId = ' + _orderId);
    let sql = "UPDATE modules SET cnName = ?, category = ?, gitPath = ?, descText = ?, orderId = ? WHERE engName = ?";
    let sql_params = [cnName,category,gitPath,desc,_orderId,engName];
    logger.debug(sql_params);
    db.conn.query(sql,sql_params,function(err,rows,fields){
      if (err) return callback(err);
      callback(null, rows);
    });
  });
}

ModuleModel.prototype.delete = function (callback) {
  let fyb = "fyb";
  let sql_category_count = "DELETE FROM modules WHERE engName = ?";
  let sql_category_count_param = [fyb];
  db.conn.query(sql_category_count,sql_category_count_param,function(err,rows,fields){
    if (err) return callback(err);
    console.log(rows.length);
    callback(null, rows);
  });
}

ModuleModel.prototype.queryCategory = function (callback) {

  let sql = "SELECT * FROM mkcategory order by orderId";
  let sql_params = [];
  db.conn.query(sql,sql_params,function(err,rows,fields){
    if (err) {
        return callback(err);
    }
    callback(null, rows);
  });
}

/**
 * @param {注：新增模块分类，这里注意，一定得进行去重判断}
 */
ModuleModel.prototype.addCategory = function (categoryName, callback) {

  let ep = new eventproxy();
  let _orderId;

  ep.bind('error', function (err) {
      logger.error("捕获到错误-->" + err);
      ep.unbind();
      callback(err,null);
  });

  ep.all('event1', 'event2', function (data1, data2) {
      let sql = "INSERT INTO mkcategory(category, orderId) values (?,?)";
      let sql_param = [categoryName,_orderId];
      db.conn.query(sql,sql_param,function(err,rows,fields){
        if (err) return callback(err, null);
        callback(null, "addModuleCategory OK");
      });
  });

  let sql1 = "SELECT orderId FROM mkcategory order by orderId desc limit 0,1";
  db.conn.query(sql1,[],function(err,rows,fields){
    if (err) {
        return ep.emit('error', err);
    }
    if(rows.length == 0) return ep.emit('error', "模块类别不存在!");
    _orderId = rows[0].orderId + 1; //当新类别中没有任何模块是判断
    console.log("_orderId = " + _orderId);
    ep.emit('event1',"event1 OK");
  });

  let sql2 = "SELECT * FROM mkcategory WHERE category = ?";
  db.conn.query(sql2,[categoryName],function(err,rows,fields){
    if (err) {
        return ep.emit('error', err);
    }
    if(rows.length == 0) return ep.emit('event2',"event2 OK");
    ep.emit('error', "categoryName必须唯一!");
  });
}

ModuleModel.prototype.updateCategory = function (arr, callback) {

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
    let sql = "UPDATE mkcategory SET orderId = ? WHERE category = ?";
    let sql_param = [arr[i].orderId,arr[i].category];
    db.conn.query(sql,sql_param,function(err,rows,fields) {
      if (err) return ep.emit('error', err);
      ep.emit('update_result', 'ok' + i);
    });
  }
}

ModuleModel.prototype.updateItemsOrderId = function (arr, callback) {

  if(arr.length == 0) return callback("Module updateItemsOrderId",null);

  let ep = new eventproxy();

  ep.bind('error', function (err) {
      logger.error("捕获到错误-->" + err);
      ep.unbind();
      callback(err,null);
  });

  ep.after('update_result', arr.length, function (list) { // 所有查询的内容都存在list数组中
      callback(null,"updateItemsOrderId OK");
  });

  for (let i = 0; i < arr.length; i++) { //数据结果与调用顺序无关
    let sql = "UPDATE modules SET orderId = ? WHERE engName = ?";
    let sql_param = [arr[i].orderId,arr[i].engName];
    db.conn.query(sql,sql_param,function(err,rows,fields) {
      if (err) return ep.emit('error', err);
      console.log('update_result----ok' + i);
      ep.emit('update_result', 'ok' + i);
    });
  }
}

var moduleModel = new ModuleModel();

module.exports = moduleModel;
