var eventproxy = require('eventproxy');
var db = require('../common/db');
var logger = require('../common/logger');
var dbConfig = require('./dbConfig');

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

DeviceModel.prototype.queryTargetProductByRegEx = function (value, callback) {

  let _targetProduct;
  (value == undefined) ? _targetProduct = `name like '%%'` : _targetProduct = `name like '%${value}%'`;
  console.log(_targetProduct);
  var sql = `SELECT * FROM targetProducts WHERE ${_targetProduct}`;
  console.log(sql);
  db.conn.query(sql,[],function(err,rows,fields){
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

/**
 * @param {修改TP的内容，这会相应到已经配置好并且以来该TP的产品}
 * @param {需要更新1个表，mkdata表，这时相关产品需要重新生成TP文件，并静默上传git仓库，不需要再进行审核步骤}
 * @param {无法满足需要进行审核的步骤，主要是逻辑复杂，在提交是进一步确认是否修改即可}
 */
DeviceModel.prototype.updateTargetProduct = function (data, callback) {

  console.log(data.name);
  console.log(data.arr);
  let ep = new eventproxy();
  ep.bind('error', function (err) {
      logger.error("updateTargetProduct 捕获到错误-->" + err);
      ep.unbind();
      callback(err,null);
  });

  ep.after('insert_result', data.arr.length, function (list) {
      console.log(list);
      callback(null,"updateTargetProduct OK");
  });

  let sql = `DELETE FROM ${dbConfig.tables.mkdata} WHERE targetProduct = ?`;
  db.conn.query(sql,[data.name],function(err,rows,fields){
    if (err) return callback(err,null);

    for (let i = 0; i < data.arr.length; i++) { //数据结果与调用顺序无关
        let sql = `UPDATE ${dbConfig.tables.mkdata} SET engName = ? WHERE targetProduct = ?`;
        let sql_param = [data.arr[i].engName,data.name];
        db.conn.query(sql,sql_param,function(err,rows,fields) {
          if (err) return ep.emit('error', err);
          ep.emit('insert_result', 'ok' + i);
        });
      }
  });
}

/**
 * @param {修改TP的名称，这个情况很可能出现，在添加的时候失误输错一个字符等}
 * @param {需要更新三个表，产品表，mkdata表，targetproducts表，这时相关产品需要重新生成TP文件，并静默上传，不需要再进行审核步骤}
 * @param {无法满足需要进行审核的步骤，万一审核不通过，TP的名称事实上已改，无法恢复}
 */
DeviceModel.prototype.updateTargetProductName = function (data, callback) {

  let newValue = data.newValue;
  let oldValue = data.oldValue;
  let ep = new eventproxy();
  ep.bind('error', function (err) {
      logger.error("updateTargetProductName 捕获到错误-->" + err);
      ep.unbind();
      callback(err,null);
  });

  ep.after('update_result', 3, function (list) {
      console.log(list);
      callback(null,"updateTargetProductName OK");
  });

  let sql0 = `UPDATE ${dbConfig.tables.products} SET targetProduct = ? WHERE targetProduct = ?`;
  let sql_params0 = [newValue,oldValue];
  db.conn.query(sql0,sql_params0,function(err,rows,fields){
    if (err) return ep.emit('error',error);
    ep.emit('update_result',"UPDATE products OK");
  });

  let sql1 = "UPDATE targetProducts SET name = ? WHERE name = ?";
  let sql_params1 = [newValue,oldValue];
  db.conn.query(sql1,sql_params1,function(err,rows,fields){
    if (err) return ep.emit('error',error);
    ep.emit('update_result',"UPDATE targetProducts OK");
  });

  let sql2 = `UPDATE ${dbConfig.tables.mkdata} SET targetProduct = ? WHERE targetProduct = ?`;
  let sql_params2 = [newValue,oldValue];
  db.conn.query(sql2,sql_params2,function(err,rows,fields){
    if (err) return ep.emit('error',error);
    ep.emit('update_result',"UPDATE mkdata OK");
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
