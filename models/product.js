var db = require('./db');
var eventproxy = require('eventproxy');
var logger = require('../common/logger');

var productModel = function() {};

productModel.prototype.queryByPage = function (offset, rows, callback) {
  var sql = "select * from products order by operateTime desc limit ?,?";
  let sql_params = [offset,rows];
  db.conn.query(sql,sql_params,function(err,rows,fields){
    if (err) {
        return callback(err);
    }
    callback(null, rows);
  });
}

productModel.prototype.queryByRegEx = function (chip, model, version, memory, soc, callback) {

    if(chip != undefined){
      
    }
    var sql = "SELECT * FROM products WHERE email like '%feng%' or email like '%bo%";
    let sql_params = [offset,rows];
    db.conn.query(sql,sql_params,function(err,rows,fields){
      if (err) {
        return callback(err);
      }
      callback(null, rows);
    });
}

productModel.prototype.queryHistory = function (offset, rows, callback) {
  var sql = "select * from products limit ?,?";
  let sql_params = [offset,rows];
  db.conn.query(sql,sql_params,function(err,rows,fields){
    if (err) {
        return callback(err);
    }
    callback(null, rows);
  });
}


productModel.prototype.newAndSave = function(userName, action, detail, callback) {
  let sql = "insert into syslog(userName, action, detail) values (?,?,?)";
  let sql_params = [userName,action,detail];
  db.conn.query(sql,sql_params,function(err,rows,fields) {
      if(err) {
        return callback(err);
      }
      callback(null,rows);
  });
}

module.exports = productModel;
