var eventproxy = require('eventproxy');
var db = require('../common/db');
var logger = require('../common/logger');

var DeviceModel = function() {};

DeviceModel.prototype.queryAll = function (callback) {
  let ep = new eventproxy();
  let sql_list = [
                  "SELECT * FROM chips",
                  "SELECT * FROM models",
                  "SELECT * FROM targetProducts",
                  "SELECT * FROM soc"
                ];

  ep.bind('error', function (err) {
      logger.error("queryAll 捕获到错误-->" + err);
      //卸掉所有的handler
      ep.unbind();
      callback(err,null);
  });

  ep.after('query_result', sql_list.length, function (list) {
      // 所有查询的内容都存在list数组中
      let listObject = [];
      for(let i in list){
        listObject.push(list[i]);
      }
      callback(null,listObject);
  });

  for (var i = 0; i < sql_list.length; i++) { //数据结构与调用顺序有关
    db.conn.query(sql_list[i],[],ep.group('query_result'));
  }
}

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
  var sql = "UPDATE models SET name = ? WHERE name = ?";
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

/**
 * @param {新增targetproduct,这里需要更新两个表，mkdata和targetProducts}
 */
DeviceModel.prototype.addTargetProduct = function (name, arr, callback) {
  console.log(name);
  console.log(arr);
  if(arr.length == 0) return callback("addTargetProduct参数错误！",null);
  let ep = new eventproxy();

  ep.bind('error', function (err) {
      logger.error("捕获到错误-->" + err);
      ep.unbind();
      callback(err,null);
  });

  ep.after('insert_result', arr.length + 1, function (list) { // 注意：长度是 arr.length + 1
      callback(null,"addTargetProduct OK");
  });

  let sql0 = "INSERT INTO targetProducts(name) values (?)";
  let sql_params0 = [name];
  db.conn.query(sql0,sql_params0,function(err,rows,fields){
    if (err) return ep.emit('error', err);
    ep.emit('insert_result', 'sql0 ok');
  });

  for (let i = 0; i < arr.length; i++) { //数据结果与调用顺序无关
    let sql = "INSERT INTO mkdata(targetProduct,engName) values (?,?)";
    let sql_params = [name ,arr[i].engName];
    db.conn.query(sql,sql_params,function(err,rows,fields) {
      if (err) return ep.emit('error', err);
      console.log('insert_result----ok' + i);
      ep.emit('insert_result', 'ok' + i);
    });
  }
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
