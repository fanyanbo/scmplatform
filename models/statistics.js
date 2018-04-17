var db = require('./db');
var eventproxy = require('eventproxy');
var config = require('../config/config');
var logger = require('../common/logger');

var Statistics = function() {};

Statistics.prototype.getSummaryByQuery = function(username, callback) {

  let ep = new eventproxy();
  let sql_list = [
                  "SELECT count(*) AS count FROM products",
                  "SELECT count(*) AS count FROM chips",
                  "SELECT count(*) AS count FROM models",
                  "SELECT count(*) AS count FROM chips WHERE name like '%S%'",
                  "SELECT count(*) AS count FROM chips WHERE name like '%H%'",
                  "SELECT count(*) AS count FROM chips WHERE name like '%R%'",
                  "SELECT count(*) AS count FROM chips WHERE name like '%A%'",
                  "SELECT count(*) AS count FROM chips WHERE name like '%N%'"
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
        console.log(list[i][0]);
        listObject.push(list[i][0].count);
      }
      callback(null,listObject);
  });

  // for (var i = 0; i < sql_list.length; i++) { //数据结果与调用顺序无关
  //   db.conn.query(sql_list[i],[],function(err,rows,fields) {
  //     if (err) {
  //         return ep.emit('error', err);
  //     }
  //     ep.emit('query_result', rows);
  //   });
  // }
  for (var i = 0; i < sql_list.length; i++) { //数据结构与调用顺序有关
    db.conn.query(sql_list[i],[],ep.group('query_result',function(data) {
    //  console.log(data); 可以在这里对数据进行预处理
      return data;
    }));
  }
}



module.exports = Statistics;
