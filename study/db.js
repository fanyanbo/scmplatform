var mongoose  = require('mongoose');

var db = mongoose.createConnection('mongodb://127.0.0.1/bkv3_0119');

db.once("open", function (callback) {
    console.log("数据库成功连接");
});

db.on("error", function (error) {
    console.log("数据库连接失败：" + error);
});

module.exports = db;
