var eventproxy = require('eventproxy');
var db = require('../common/db');
var config = require('../config/config');
var logger = require('../common/logger');
var dbConfig = require('./dbConfig');

var StatisticsModel = function() {};

/**
 * @param {首页的统计信息，不能根据机芯进行模糊匹配，应该根据platform进行匹配，后续修改}
 */
StatisticsModel.prototype.getSummaryByQuery = function(username, callback) {

  let ep = new eventproxy();
  let sql_list = [
                  `SELECT count(*) AS count FROM ${dbConfig.tables.products} WHERE auditState = 0`,
                  "SELECT count(*) AS count FROM chips",
                  "SELECT count(*) AS count FROM models",
                  `SELECT count(*) AS count FROM ${dbConfig.tables.products} WHERE chip like '%S%' AND auditState = 0`,
                  `SELECT count(*) AS count FROM ${dbConfig.tables.products} WHERE chip like '%H%' AND auditState = 0`,
                  `SELECT count(*) AS count FROM ${dbConfig.tables.products} WHERE chip like '%R%' AND auditState = 0`,
                  `SELECT count(*) AS count FROM ${dbConfig.tables.products} WHERE chip like '%A%' AND auditState = 0`,
                  `SELECT count(*) AS count FROM ${dbConfig.tables.products} WHERE chip like '%N%' AND auditState = 0`
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
        //console.log(list[i][0]);
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

let statisticsModel = new StatisticsModel();

module.exports = statisticsModel;
