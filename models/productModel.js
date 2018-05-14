var eventproxy = require('eventproxy');
var db = require('../common/db');
var logger = require('../common/logger');
var generator = require('../file/generate');

var ProductModel = function() {};

ProductModel.prototype.queryByPage = function (offset, rows, callback) {
  let sql, sql_params;
  if(offset == -1 || offset == undefined) {
    sql = "select * from products order by operateTime desc";
    sql_params = [];
  } else {
    sql = "select * from products order by operateTime desc limit ?,?";
    sql_params = [offset,rows];
  }
  db.conn.query(sql,sql_params,function(err,rows,fields){
    if (err) {
        return callback(err);
    }
    callback(null, rows);
  });
}

ProductModel.prototype.queryByRegEx = function (chip, model, version, memory, soc, callback) {

    let _chip, _model, _verison, _memory, _soc;
    (chip == undefined) ? _chip = `chip like '%%'` : _chip = `chip like '%${chip}%'`;
    (model == undefined) ? _model = `model like '%%'` : _model = `model like '%${model}%'`;
    (version == undefined) ? _verison = `androidVersion like '%%'` : _verison = `androidVersion like '%${version}%'`;
    (memory == undefined) ? _memory = `memorySize like '%%'` : _memory = `memorySize like '%${memory}%'`;
    (soc == undefined) ? _soc = `soc like '%%'` : _soc = `soc like '%${soc}%'`;

    console.log(_chip);
    console.log(_model);
    console.log(_verison);
    console.log(_memory);
    console.log(_soc);

    var sql = `SELECT * FROM products WHERE ${_chip} AND ${_model} AND ${_verison} AND ${_memory} AND ${_soc}  order by operateTime desc`;
    console.log(sql);
    let sql_params = [];
    db.conn.query(sql,sql_params,function(err,rows,fields){
      if (err) {
        return callback(err);
      }
      callback(null, rows);
    });
}

/**
 * @param {注：查询某个机芯机型的修改历史记录，state：0->审核已通过 1->待审核 2->审核未通过}
 */
ProductModel.prototype.queryHistory = function (chip, model, callback) {
  var sql = "SELECT * FROM modifyhistory WHERE chip = ? AND model = ?";
  let sql_params = [chip, model];
  db.conn.query(sql,sql_params,function(err,rows,fields){
    if (err) {
        console.log(err);
        return callback(err);
    }
    callback(null, rows);
  });
}

ProductModel.prototype.queryByModule = function (name, callback) {
//  var sql = "SELECT * FROM products WHERE targetProduct in (SELECT targetProduct FROM mkdata WHERE cnName=?)";
  let sql = "SELECT * FROM products WHERE targetProduct IN (SELECT a.targetProduct FROM mkdata a, modules b WHERE a.engName=b.engName AND b.cnName=?)";
  let sql_params = [name];
  db.conn.query(sql,sql_params,function(err,rows,fields){
    if (err) {
        return callback(err);
    }
    callback(null, rows);
  });
}

ProductModel.prototype.queryMKDataByTargetProduct = function (targetproduct, callback) {
  let sql = "SELECT * FROM mkdata WHERE targetProduct = ?";
  let sql_params = [targetproduct];
  db.conn.query(sql,sql_params,function(err,rows,fields){
    if (err) {
        return callback(err);
    }
    callback(null, rows);
  });
}

ProductModel.prototype.queryAll = function (callback) {
  let ep = new eventproxy();
  let sql_list = [
                  "SELECT * FROM configs",
                  "SELECT * FROM modules",
                  "SELECT * FROM settings",
                  "SELECT * FROM configcategory order by orderId",
                  "SELECT * FROM mkcategory order by orderId"
                  //预留设置部分分类查询
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
        listObject.push(list[i]);
      }
      let settingsCategory = [
        {level1:"系统设置", level2:"设置入口页", level3:""},
        {level1:"系统设置", level2:"开机引导", level3:""},
        {level1:"系统设置", level2:"网络与连接", level3:""},
        {level1:"系统设置", level2:"通用设置", level3:"个性化设置"},
        {level1:"系统设置", level2:"通用设置", level3:"系统设置"},
        {level1:"系统设置", level2:"通用设置", level3:"位置与安全"},
        {level1:"系统设置", level2:"图像设置", level3:"基础设置"},
        {level1:"系统设置", level2:"图像设置", level3:"高级亮度设置"},
        {level1:"系统设置", level2:"图像设置", level3:"彩色设置"},
        {level1:"系统设置", level2:"图像设置", level3:"高级清晰度设置"},
        {level1:"系统设置", level2:"图像设置", level3:"运动设置"},
        {level1:"系统设置", level2:"声音设置", level3:"基础设置"},
        {level1:"系统设置", level2:"声音设置", level3:"声音输出设置"},
        {level1:"系统设置", level2:"声音设置", level3:"ATMOS专业音效设置"},
        {level1:"信号源工具箱", level2:"快捷功能", level3:""},
        {level1:"信号源工具箱", level2:"常用设置", level3:""},
        {level1:"卖场演示", level2:"声音演示", level3:""},
        {level1:"卖场演示", level2:"图像演示", level3:""},
        {level1:"中间件", level2:"输入信号源", level3:""},
        {level1:"中间件", level2:"支持纵横比", level3:""}
      ];
      listObject.push(settingsCategory);
      callback(null,listObject);
  });

  for (var i = 0; i < sql_list.length; i++) { //数据结构与调用顺序有关
    db.conn.query(sql_list[i],[],ep.group('query_result'));
  }
}

ProductModel.prototype.queryAllByMachine = function (chip, model, callback) {
  let ep = new eventproxy();
  let sql_list = [
                  "SELECT * FROM products WHERE chip = ? AND model = ?",
                  "SELECT * FROM configdata WHERE chip = ? AND model = ?",
                  "SELECT * FROM mkdata WHERE targetProduct in (SELECT targetProduct FROM products WHERE chip = ? AND model = ?)"
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
        listObject.push(list[i]);
      }
      callback(null,listObject);
  });

  for (var i = 0; i < sql_list.length; i++) { //数据结构与调用顺序有关
    db.conn.query(sql_list[i],[chip,model],ep.group('query_result'));
  }
}

ProductModel.prototype.add = function (baseInfo, configInfo, settingsInfo, callback) {
  console.log(baseInfo);
  console.log(configInfo);
  console.log(settingsInfo);
  let baseInfoObj = JSON.parse(baseInfo);
  console.log(baseInfoObj.chip);
  console.log(baseInfoObj.auditState);
  console.log(baseInfoObj.coocaaVersion);
  console.log(configInfo.length);
  console.log(configInfo[0].engName);
  console.log(settingsInfo.length);
  console.log(settingsInfo[0].engName);

  let ep = new eventproxy();

  ep.bind('error', function (err) {
      logger.error("ProductModel.prototype.add 捕获到错误-->" + err);
      //卸掉所有的handler
      ep.unbind();
      callback(err,null);
  });

  ep.after('query_result', configInfo.length + settingsInfo.length + 1, function (list) {
      // 所有查询的内容都存在list数组中
      callback(null,null);
  });

  let sql0 = "INSERT INTO products(chip,model,auditState,modifyState,androidVersion,memorySize,EMMC,targetProduct,soc,platform,gitBranch,coocaaVersion) values (?,?,?,?,?,?,?,?,?,?,?,?)";
  let sql0_param = [baseInfo.chip,baseInfo.chip,baseInfo.auditState,baseInfo.modifyState,baseInfo.androidVersion,baseInfo.memorySize,baseInfo.EMMC,baseInfo.targetProduct,baseInfo.soc,baseInfo.platform,baseInfo.gitBranch,baseInfo.coocaaVersion];
  console.log(sql0_param);
  db.conn.query(sql0,sql0_param,function(err,rows,fields){
    if (err) return ep.emit('error', err);
    ep.emit('insert_result',"INSERT INTO products OK");
  });

  let sql1 = "INSERT INTO configdata_temp(chip,model,engName,curValue) values (?,?,?,?)";
  for(var i=0; i<configInfo.length;i++) {
    let sql1_param = [baseInfo.chip,baseInfo.model,configInfo[i].engName,configInfo[i].curValue];
    db.conn.query(sql1,sql1_param,function(err,rows,fields){
      if (err) return ep.emit('error', err);
      ep.emit('insert_result',"INSERT INTO configdata_temp OK");
    });
  }

  let sql2 = "INSERT INTO settingsdata_temp(chip,model,engName) values (?,?,?)";
  for(var i=0; i<settingsInfo.length;i++) {
    let sql2_param = [baseInfo.chip,baseInfo.model,settingsInfo[i].engName];
    db.conn.query(sql2,sql2_param,function(err,rows,fields){
      if (err) return ep.emit('error', err);
      ep.emit('insert_result',"INSERT INTO settingsdata_temp OK");
    });
  }
}

ProductModel.prototype.update = function (baseInfo, configInfo, settingsInfo, callback) {
  console.log(baseInfo);
  console.log(configInfo);
  console.log(settingsInfo);
  let baseInfoObj = JSON.parse(baseInfo);
  console.log(baseInfoObj.chip);
  console.log(baseInfoObj.auditState);
  console.log(baseInfoObj.coocaaVersion);
  console.log(configInfo.length);
  console.log(configInfo[0].engName);
  console.log(settingsInfo.length);
  console.log(settingsInfo[0].engName);

  let ep = new eventproxy();

  ep.bind('error', function (err) {
      logger.error("ProductModel.prototype.update 捕获到错误-->" + err);
      //卸掉所有的handler
      ep.unbind();
      callback(err,null);
  });

  ep.after('query_result', configInfo.length + settingsInfo.length + 1, function (list) {
      // 所有查询的内容都存在list数组中
      callback(null,null);
  });

  let sql0 = "UPDATE products SET auditState=1,modifyState=1,androidVersion=?,memorySize=?,EMMC=?,targetProduct=?,soc=?,platform=?,gitBranch=?,coocaaVersion=? WHERE chip=? AND model=?";
  let sql0_param = [baseInfo.androidVersion,baseInfo.memorySize,baseInfo.EMMC,baseInfo.targetProduct,baseInfo.soc,baseInfo.platform,baseInfo.gitBranch,baseInfo.coocaaVersion,baseInfo.chip,baseInfo.chip];
  console.log(sql0_param);
  db.conn.query(sql0,sql0_param,function(err,rows,fields){
    if (err) return ep.emit('error', err);
    ep.emit('insert_result',"INSERT INTO products OK");
  });

  let sql1 = "INSERT INTO configdata_temp(chip,model,engName,curValue) values (?,?,?,?)";
  for(var i=0; i<configInfo.length;i++) {
    let sql1_param = [baseInfo.chip,baseInfo.model,configInfo[i].engName,configInfo[i].curValue];
    db.conn.query(sql1,sql1_param,function(err,rows,fields){
      if (err) return ep.emit('error', err);
      ep.emit('insert_result',"INSERT INTO configdata_temp OK");
    });
  }

  let sql2 = "INSERT INTO settingsdata_temp(chip,model,engName) values (?,?,?)";
  for(var i=0; i<settingsInfo.length;i++) {
    let sql2_param = [baseInfo.chip,baseInfo.model,settingsInfo[i].engName];
    db.conn.query(sql2,sql2_param,function(err,rows,fields){
      if (err) return ep.emit('error', err);
      ep.emit('insert_result',"INSERT INTO settingsdata_temp OK");
    });
  }
}

ProductModel.prototype.addHistory = function (data, callback) {
  console.log(data);
  let dataObj = JSON.parse(data);
  console.log(dataObj.chip);

  let sql = "INSERT INTO modifyhistory(chip,model,state,userName,content,reason) values (?,?,?,?,?,?)";
  let sql_param = [dataObj.chip,dataObj.model,dataObj.state,dataObj.userName,dataObj.content,dataObj.reason];
  console.log(sql_param);
  db.conn.query(sql,sql_param,function(err,rows,fields){
    if (err) return callback(err);
    callback(null, rows);
  });
}

ProductModel.prototype.preview = function (chip, model, callback) {
    console.log("preview chip:" + chip);
    console.log("preview model:" + model);
    generator.preview(chip, model, "6.0", function(err, results){
      if (err) {
          return callback(err);
      }
      callback(null, results);
    });
}

ProductModel.prototype.delete = function (chip, model, callback) {
    var sql = "UPDATE products set auditState = 1, modifyState = 2 WHERE chip = ? AND model = ?";
    let sql_params = [chip, model];
    db.conn.query(sql,sql_params,function(err,rows,fields){
      if (err) {
        return callback(err);
      }
      callback(null, rows);
    });
}

var productModel = new ProductModel();

module.exports = productModel;
