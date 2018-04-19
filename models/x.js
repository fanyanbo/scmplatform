var db = require('./db');
var eventproxy = require('eventproxy');

//mysql的基本用法知识点
var sql = "SELECT `userName`,`email` FROM users WHERE LOCATE('skyworth',`email`) > 0";  //使用LOCATE进行模糊查询
var sql = "SELECT `userName`,`email` FROM users WHERE email like '%feng%'";  //使用like进行模糊查询
var sql = "SELECT `userName`,`email` FROM users WHERE email like binary '%feng%'";  //使用like进行模糊查询，区分大小写
var sql = "SELECT `userName`,`email` FROM users WHERE email like '%fan%' and email like '%bo%'";  //使用like进行and模糊查询
var sql = "SELECT `userName`,`email` FROM users WHERE email like '%feng%' or email like '%bo%'";  //使用like进行or模糊查询
var sql = "SELECT * FROM products limit 0,1";  //第几行,行数,用于分页查询
var sql = "SELECT count(*) AS count FROM chips WHERE name like '%S%'";  //注意AS的用法，查询MSTAR机芯的个数

//具体业务场景
//查询某个机芯机型的所有模块表
var sql = SELECT a.engName, b.* FROM mkdata a, modules b WHERE a.engName=b.engName AND a.targetProduct=(SELECT targetProduct FROM products WHERE chip="5S02" AND model="15U");
//查询某个机芯机型的配置项的值
var sql = SELECT * FROM configdata WHERE chip="5S02" AND model="15U";
//查询配置项为某值的所有机芯机型
var sql = SELECT chip,model FROM configdata WHERE engName="SUPPORT_H265" AND curValue="false";
//查询模块为某值的所有机芯机型
var sql = SELECT chip,model FROM products WHERE targetProduct in (SELECT targetProduct FROM mkdata WHERE engName="iwangding");

var x1 = function() {

  var ep = new eventproxy();

  var sql_list = ["SELECT count(*) AS count FROM products",
                  "SELECT count(*) AS count FROM chips",
                  "SELECT count(*) AS count FROM models",
                  "SELECT count(*) AS count FROM chips WHERE name like '%S%'",
                  "SELECT count(*) AS count FROM chips WHERE name like '%H%'",
                  "SELECT count(*) AS count FROM chips WHERE name like '%R%'",
                  "SELECT count(*) AS count FROM chips WHERE name like '%A%'",
                  "SELECT count(*) AS count FROM chips WHERE name like '%N%'"
                ];

  ep.bind('error', function (err) {
      console.log("捕获到错误-->" + err);
      //卸掉所有的handler
      ep.unbind();
  });

  ep.after('query_result', sql_list.length, function (list) {
      // 所有查询的内容都存在list数组中
        for (var i in list) {
          console.log(list[i][0].count);
        }
  });

  for (var i = 0; i < sql_list.length; i++) {
    db.conn.query(sql_list[i],[],function(err,rows,fields) {
      if (err) {
          return ep.emit('error', err);
      }
      ep.emit('query_result', rows);
    });
  }

};

x1();


















db.conn.end();
