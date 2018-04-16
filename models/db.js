var mysql = require( 'mysql');
var config = require('../config/config');

function handleError (err) {
  if (err) {
    // 如果是连接断开，自动重新连接
    console.error(err.stack || err);
    if (err.code === 'PROTOCOL_CONNECTION_LOST') {
    //  connect();
    } else {

    }
  }
}

var connection = mysql.createConnection(config.mysql);
connection.connect();
connection.on('error', handleError);

exports.conn = connection;

// var sql = "select * from user";
// connection.query(sql,[],function(err,rows,fields){
//         console.log(rows);
// });

// connection.end();
