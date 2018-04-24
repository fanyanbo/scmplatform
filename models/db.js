var mysql = require( 'mysql');
var config = require('../config/config');

// 从远程复制数据库
// mysqldump scm -h 172.20.5.239 -uscmplatform -pscmplatform --add-drop-table | mysql scm -u root -proot

var conn;
function handleError () {
    conn = mysql.createConnection(config.mysql);

    //连接错误，2秒重试
    conn.connect(function (err) {
        if (err) {
            console.log('error when connecting to db:', err);
            setTimeout(handleError, 2000);
        }
    });

    conn.on('error', function (err) {
        console.log('db error', err);
        // 如果是连接断开，自动重新连接
        if (err.code === 'PROTOCOL_CONNECTION_LOST') {
            handleError();
        } else {
            throw err;
        }
    });
}
handleError();

exports.conn = conn;

// function handleError (err) {
//
//   if (err) {
//     // 如果是连接断开，自动重新连接
//     console.error(err.stack || err);
//     if (err.code === 'PROTOCOL_CONNECTION_LOST') {
//       this.connect();
//     } else {
//
//     }
//   }
// }
//
// var connection = mysql.createConnection(config.mysql);
// connection.connect();
// connection.on('error', handleError);

// var sql = "select * from user";
// connection.query(sql,[],function(err,rows,fields){
//         console.log(rows);
// });

// connection.end();
