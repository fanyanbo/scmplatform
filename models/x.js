var db = require('./db');
var eventproxy = require('eventproxy');

var sql = "SELECT `userName`,`email` FROM users WHERE LOCATE('skyworth',`email`) > 0";  //使用LOCATE进行模糊查询
var sql = "SELECT `userName`,`email` FROM users WHERE email like '%feng%'";  //使用like进行模糊查询
var sql = "SELECT `userName`,`email` FROM users WHERE email like binary '%feng%'";  //使用like进行模糊查询，区分大小写
var sql = "SELECT `userName`,`email` FROM users WHERE email like '%fan%' and email like '%bo%'";  //使用like进行and模糊查询
var sql = "SELECT `userName`,`email` FROM users WHERE email like '%feng%' or email like '%bo%'";  //使用like进行or模糊查询
var sql = "SELECT * FROM products limit 0,1";  //第几行,行数,用于分页查询
var sql = "SELECT count(*) AS count FROM chips WHERE name like '%S%'";  //注意AS的用法，查询MSTAR机芯的个数

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
