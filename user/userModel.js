var db = require('../common/db');
var logger = require('../common/logger');
var config = require('../config/config');

var UserModel = function() {};

UserModel.prototype.query = function (id, callback) {
  logger.debug("User.prototype.query id = " + id);
  var sql = "select * from users";
  db.conn.query(sql,[],function(err,rows,fields){
    if (err) {
        return callback(err);
    }
    callback(null, rows);
  });
}

UserModel.prototype.getUserByQuery = function(username, callback) {
  logger.debug("User.prototype.getUserByQuery username = " + username);
  let sql = "select * from users where userName = ?";
  let sql_params = [username];
  db.conn.query(sql,sql_params,function(err,rows,fields) {
      if(err) {
        return callback(err);
      }
      callback(null,rows);
  });
}

UserModel.prototype.newAndSave = function(username, hashpass, callback) {
  logger.debug("User.prototype.newAndSave username = " + username + ",hashpass = " + hashpass);
  let sql = "insert into user(name, password) values (?,?)";
  let sql_params = [username,hashpass];
  db.conn.query(sql,sql_params,function(err,result) {
      if(err) {
        return callback(err);
      }
      logger.debug("newAndSave result = " + result);
      callback(null);
  });
}

var userModel = new UserModel();

module.exports = userModel;
