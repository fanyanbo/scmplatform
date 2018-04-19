var db = require('./db');
var eventproxy = require('eventproxy');
var logger = require('../common/logger');

var ProductModel = function() {};

ProductModel.prototype.queryByPage = function (offset, rows, callback) {
  var sql = "select * from products order by operateTime desc limit ?,?";
  let sql_params = [offset,rows];
  db.conn.query(sql,sql_params,function(err,rows,fields){
    if (err) {
        return callback(err);
    }
    callback(null, rows);
  });
}

ProductModel.prototype.queryByRegEx = function (chip, model, version, memory, soc, callback) {

    let _chip = `chip like '%${chip}%'`;
    console.log(_chip);
    var sql = `SELECT * FROM products WHERE ${_chip}`;
    console.log(sql);
    let sql_params = [];
    db.conn.query(sql,sql_params,function(err,rows,fields){
      if (err) {
        return callback(err);
      }
      callback(null, rows);
    });
}

ProductModel.prototype.queryHistory = function (offset, rows, callback) {
  var sql = "select * from products limit ?,?";
  let sql_params = [offset,rows];
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
