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
  var sql = "SELECT * FROM modifyhistory WHRER chip = ？ AND model ?";
  let sql_params = [chip,model];
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

var productModel = new ProductModel();

module.exports = productModel;
