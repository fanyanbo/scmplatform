let mysql = require( 'mysql');
let config = require('../config/config');
let logger = require('./logger');

// 从远程复制数据库
// mysqldump scm -h 172.20.5.239 -uscmplatform -pscmplatform --add-drop-table | mysql scm -u root -proot

let conn;
function handleError () {
    conn = mysql.createConnection(config.mysql);
    logger.error("createConnection to mysql on scmplatform...");
    //连接错误，2秒重试
    conn.connect(function (err) {
        if (err) {
            logger.error('error when connecting to db:', err);
            setTimeout(handleError, 2000);
        }
    });

    conn.on('error', function (err) {
        logger.error('db error', err);
        // 如果是连接断开，自动重新连接
        if (err.code == 'PROTOCOL_CONNECTION_LOST') {
            logger.error("Try to handle reconnection...");
            conn.end();
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
