var db = require('./db');


var sql = "SELECT `userName`,`email` FROM users WHERE LOCATE('skyworth',`email`) > 0";  //使用LOCATE进行模糊查询
var sql = "SELECT `userName`,`email` FROM users WHERE email like '%feng%'";  //使用like进行模糊查询
var sql = "SELECT `userName`,`email` FROM users WHERE email like '%fan%' and email like '%bo%'";  //使用like进行and模糊查询


var x1 = function() { //简单查询
//  var sql = "select * from users";
  var sql = "SELECT `userName`,`email` FROM users WHERE email like '%feng%' and email like '%bo%'";  //使用like进行and模糊查询
  db.conn.query(sql,[],function(err,rows,fields){
    if (err) {
        console.log(err);
        return;
    }
    for (var i in rows) {
      console.log(rows[i]);
}

  });
};

x1();

db.conn.end();
