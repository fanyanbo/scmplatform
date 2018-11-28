let eventproxy = require('eventproxy');
let db = require('../../common/db');
let logger = require('../../common/logger');
let config = require('../../config/config');
let dbConfig = require('./dbConfig');

let SettingsModel = function() {};

SettingsModel.prototype.query = function (callback) {
  let sql = `SELECT * FROM ${dbConfig.tables.settings}`;
  let sql_params = [];
  console.log(sql + sql_params);
  db.conn.query(sql,sql_params,function(err,rows,fields){
    if (err) {
        return callback(err);
    }
    callback(null, rows);
  });
}

/**
 * @param {本接口返回的数据暂时不从数据库查询，查询相对复杂，另外数据改动极少，影响执行效率，直接写死返回}
 */
SettingsModel.prototype.queryCategory = function (callback) {
  // let sql = "SELECT * FROM settings";
  // let sql_params = [];
  // console.log(sql + sql_params);
  // db.conn.query(sql,sql_params,function(err,rows,fields){
  //   if (err) {
  //       return callback(err);
  //   }
  //   callback(null, rows);
  // });
  let rows = [
    {level1:"系统设置", level2:"设置入口页", level3:""},
    {level1:"系统设置", level2:"开机引导", level3:""},
    {level1:"系统设置", level2:"网络与连接", level3:""},
    {level1:"系统设置", level2:"通用设置", level3:"个性化设置"},
    {level1:"系统设置", level2:"通用设置", level3:"系统设置"},
    {level1:"系统设置", level2:"通用设置", level3:"位置与安全"},
	{level1:"系统设置", level2:"图像设置", level3:"图像模式"},
    {level1:"系统设置", level2:"图像设置", level3:"基础设置"},
    {level1:"系统设置", level2:"图像设置", level3:"高级亮度设置"},
    {level1:"系统设置", level2:"图像设置", level3:"彩色设置"},
    {level1:"系统设置", level2:"图像设置", level3:"高级清晰度设置"},
    {level1:"系统设置", level2:"图像设置", level3:"运动设置"},
    {level1:"系统设置", level2:"图像设置", level3:"恢复默认值"},
	{level1:"系统设置", level2:"声音设置", level3:"声音模式"},
    {level1:"系统设置", level2:"声音设置", level3:"基础设置"},
    {level1:"系统设置", level2:"声音设置", level3:"声音输出设置"},
    {level1:"系统设置", level2:"声音设置", level3:"ATMOS专业音效设置"},
    {level1:"系统设置", level2:"声音设置", level3:"恢复默认值"},
    {level1:"信号源工具箱", level2:"快捷功能", level3:""},
    {level1:"信号源工具箱", level2:"常用设置", level3:""},
    {level1:"卖场演示", level2:"声音演示", level3:""},
    {level1:"卖场演示", level2:"图像演示", level3:""},
    {level1:"卖场演示", level2:"功能配置开关", level3:""},
    {level1:"中间件", level2:"PQ", level3:""},
    {level1:"中间件", level2:"Board", level3:""}
  ];
  callback(null, rows);
}

SettingsModel.prototype.update = function (engName, cnName, desc, callback) {
  let sql = `UPDATE ${dbConfig.tables.settings} SET cnName = ?, descText = ? WHERE engName = ?`;
  let sql_params = [cnName,desc,engName];
  console.log(sql + sql_params);
  db.conn.query(sql,sql_params,function(err,rows,fields){
    if (err) return callback(err);
    callback(null, rows);
  });
}

/**
 * @param {本接口支持查询某分类下设置项，这里注意：每项是最终节点元素，而不是子分类}
 * @param {传递参数level的原因：分类中有些level2下是节点元素，如“系统设置-开机引导”；有些level3下是节点元素，如“系统设置-图像设置-图像高级”}
 */
SettingsModel.prototype.queryItemsByCategory = function (level, category, callback) {
  let sql;
  if(level == "level2")
    sql = `SELECT * FROM ${dbConfig.tables.settings} WHERE level2 = ? order by orderId`;
  else if(level == "level3")
    sql = `SELECT * FROM ${dbConfig.tables.settings} WHERE level3 = ? order by orderId`;
  else
    return callback("queryItemsByCategory参数错误！");
  let sql_params = [category];
  console.log(sql + sql_params);
  db.conn.query(sql,sql_params,function(err,rows,fields){
    if (err) {
        return callback(err);
    }
    callback(null, rows);
  });
}

SettingsModel.prototype.updateItemsOrderId = function (arr, callback) {

  if(arr.length == 0) return callback("Settings updateItemsOrderId",null);

  let ep = new eventproxy();

  ep.bind('error', function (err) {
      logger.error("捕获到错误-->" + err);
      ep.unbind();
      callback(err,null);
  });

  ep.after('update_result', arr.length, function (list) { // 所有查询的内容都存在list数组中
      callback(null,"updateItemsOrderId OK");
  });

  for (let i = 0; i < arr.length; i++) { //数据结果与调用顺序无关
    let sql = `UPDATE ${dbConfig.tables.settings} SET orderId = ? WHERE engName = ?`;
    let sql_param = [arr[i].orderId,arr[i].engName];
    db.conn.query(sql,sql_param,function(err,rows,fields) {
      if (err) return ep.emit('error', err);
      console.log('update_result----ok' + i);
      ep.emit('update_result', 'ok' + i);
    });
  }
}



var settingsModel = new SettingsModel();

module.exports = settingsModel;
