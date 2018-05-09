var db = require('./db');
var eventproxy = require('eventproxy');
var logger = require('../common/logger');

var ProductModel = function() {};

ProductModel.prototype.queryByPage = function (offset, rows, callback) {
  let sql, sql_params;
  if(offset == -1 || offset == undefined) {
    sql = "select * from products order by operateTime desc";
    sql_params = [];
  } else {
    sql = "select * from products order by operateTime desc limit ?,?";
    sql_params = [offset,rows];
  }
  db.conn.query(sql,sql_params,function(err,rows,fields){
    if (err) {
        return callback(err);
    }
    callback(null, rows);
  });
}

ProductModel.prototype.queryByRegEx = function (chip, model, version, memory, soc, callback) {

    let _chip, _model, _verison, _memory, _soc;
    (chip == undefined) ? _chip = `chip like '%%'` : _chip = `chip like '%${chip}%'`;
    (model == undefined) ? _model = `model like '%%'` : _model = `model like '%${model}%'`;
    (version == undefined) ? _verison = `androidVersion like '%%'` : _verison = `androidVersion like '%${version}%'`;
    (memory == undefined) ? _memory = `memorySize like '%%'` : _memory = `memorySize like '%${memory}%'`;
    (soc == undefined) ? _soc = `soc like '%%'` : _soc = `soc like '%${soc}%'`;

    console.log(_chip);
    console.log(_model);
    console.log(_verison);
    console.log(_memory);
    console.log(_soc);

    var sql = `SELECT * FROM products WHERE ${_chip} AND ${_model} AND ${_verison} AND ${_memory} AND ${_soc}  order by operateTime desc`;
    console.log(sql);
    let sql_params = [];
    db.conn.query(sql,sql_params,function(err,rows,fields){
      if (err) {
        return callback(err);
      }
      callback(null, rows);
    });
}

ProductModel.prototype.queryHistory = function (chip, model, callback) {
  var sql = "SELECT * FROM modifyhistory WHRER chip = ? AND model ?";
  let sql_params = [chip,model];
  db.conn.query(sql,sql_params,function(err,rows,fields){
    if (err) {
        return callback(err);
    }
    callback(null, rows);
  });
}

ProductModel.prototype.queryByModule = function (name, callback) {
//  var sql = "SELECT * FROM products WHERE targetProduct in (SELECT targetProduct FROM mkdata WHERE cnName=?)";
  let sql = "SELECT * FROM products WHERE targetProduct IN (SELECT a.targetProduct FROM mkdata a, modules b WHERE a.engName=b.engName AND b.cnName=?)";
  let sql_params = [name];
  db.conn.query(sql,sql_params,function(err,rows,fields){
    if (err) {
        return callback(err);
    }
    callback(null, rows);
  });
}

ProductModel.prototype.queryMKDataByTargetProduct = function (targetproduct, callback) {
  let sql = "SELECT * FROM mkdata WHERE targetProduct = ?";
  let sql_params = [targetproduct];
  db.conn.query(sql,sql_params,function(err,rows,fields){
    if (err) {
        return callback(err);
    }
    callback(null, rows);
  });
}

ProductModel.prototype.newAndSave = function(userName, action, detail, callback) {
  let sql = "insert into syslog(userName, action, detail) values (?,?,?)";
  let sql_params = [userName,action,detail];
  db.conn.query(sql,sql_params,function(err,rows,fields) {
      if(err) {
        return callback(err);
      }
      callback(null,rows);
  });
}

ProductModel.prototype.queryAll = function (callback) {
  let ep = new eventproxy();
  let sql_list = [
                  "SELECT * FROM configs",
                  "SELECT * FROM modules",
                  "SELECT * FROM settings",
                  "SELECT * FROM configcategory order by orderId",
                  "SELECT * FROM mkcategory order by orderId"
                  //预留设置部分分类查询
                ];

  ep.bind('error', function (err) {
      logger.error("捕获到错误-->" + err);
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
      let settingsCategory = [
        {level1:"系统设置", level2:"设置入口页", level3:""},
        {level1:"系统设置", level2:"开机引导", level3:""},
        {level1:"系统设置", level2:"网络与连接", level3:""},
        {level1:"系统设置", level2:"通用设置", level3:"个性化设置"},
        {level1:"系统设置", level2:"通用设置", level3:"系统设置"},
        {level1:"系统设置", level2:"通用设置", level3:"位置与安全"},
        {level1:"系统设置", level2:"图像设置", level3:"基础设置"},
        {level1:"系统设置", level2:"图像设置", level3:"高级亮度设置"},
        {level1:"系统设置", level2:"图像设置", level3:"彩色设置"},
        {level1:"系统设置", level2:"图像设置", level3:"高级清晰度设置"},
        {level1:"系统设置", level2:"图像设置", level3:"运动设置"},
        {level1:"系统设置", level2:"声音设置", level3:"基础设置"},
        {level1:"系统设置", level2:"声音设置", level3:"声音输出设置"},
        {level1:"系统设置", level2:"声音设置", level3:"ATMOS专业音效设置"},
        {level1:"信号源工具箱", level2:"快捷功能", level3:""},
        {level1:"信号源工具箱", level2:"常用设置", level3:""},
        {level1:"卖场演示", level2:"声音演示", level3:""},
        {level1:"卖场演示", level2:"图像演示", level3:""},
        {level1:"中间件", level2:"输入信号源", level3:""},
        {level1:"中间件", level2:"支持纵横比", level3:""}
      ];
      listObject.push(settingsCategory);
      callback(null,listObject);
  });

  for (var i = 0; i < sql_list.length; i++) { //数据结构与调用顺序有关
    db.conn.query(sql_list[i],[],ep.group('query_result'));
  }
}

ProductModel.prototype.queryAllByMachine = function (chip, model, callback) {
  let ep = new eventproxy();
  let sql_list = [
                  "SELECT * FROM products WHERE chip = ? AND model = ?",
                  "SELECT * FROM configdata WHERE chip = ? AND model = ?",
                  "SELECT * FROM mkdata WHERE targetProduct in (SELECT targetProduct FROM products WHERE chip = ? AND model = ?)"
                ];

  ep.bind('error', function (err) {
      logger.error("捕获到错误-->" + err);
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
    db.conn.query(sql_list[i],[chip,model],ep.group('query_result'));
  }
}

var productModel = new ProductModel();

module.exports = productModel;
