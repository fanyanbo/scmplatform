var eventproxy = require('eventproxy');
var db = require('../../common/db');
var logger = require('../../common/logger');

var PropModel = function() {};


PropModel.prototype.query = function (callback) {

  let sql = "SELECT * FROM props";
  let sql_params = [];
  db.conn.query(sql,sql_params,function(err,rows,fields){
    if (err) {
        return callback(err);
    }
    callback(null, rows);
  });
}

var propModel = new PropModel();

module.exports = propModel;
