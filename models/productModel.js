var eventproxy = require('eventproxy');
var async = require('async');
var db = require('../common/db');
var logger = require('../common/logger');
var generator = require('../file/generate');
var dbConfig = require('./dbConfig');

var ProductModel = function() {};

ProductModel.prototype.queryByPage = function (offset, rows, callback) {
  let sql, sql_params;
  if(offset == -1 || offset == undefined) {
    sql = `select * from ${dbConfig.tables.products} order by operateTime desc`;
    sql_params = [];
  } else {
    sql = `select a.*,b.userName from ${dbConfig.tables.products} AS a, ${dbConfig.tables.modifyhistory} AS b WHERE a.chip = b.chip AND a.model = b.model order by a.operateTime desc limit ?,?`;
    sql_params = [offset,rows];
  }
  console.log(sql);
  db.conn.query(sql,sql_params,function(err,rows,fields){
    if (err) {
        return callback(err);
    }
    callback(null, rows);
  });
}

ProductModel.prototype.queryByRegEx = function (data, callback) {
    console.log(data);
    let _chip, _model, _verison, _memory, _soc, _EMMC, _targetProduct, _gitBranch;
    (data.chip == undefined) ? _chip = `chip like '%%'` : _chip = `chip like '%${data.chip}%'`;
    (data.model == undefined) ? _model = `model like '%%'` : _model = `model like '%${data.model}%'`;
    (data.version == undefined) ? _verison = `androidVersion like '%%'` : _verison = `androidVersion like '%${data.version}%'`;
    (data.memory == undefined) ? _memory = `memorySize like '%%'` : _memory = `memorySize like '%${data.memory}%'`;
    (data.soc == undefined) ? _soc = `soc like '%%'` : _soc = `soc like '%${data.soc}%'`;
    (data.EMMC == undefined) ? _EMMC = `EMMC like '%%'` : _EMMC = `EMMC like '%${data.EMMC}%'`;
    (data.targetProduct == undefined) ? _targetProduct = `targetProduct like '%%'` : _targetProduct = `targetProduct like '%${data.targetProduct}%'`;
    (data.gitBranch == undefined) ? _gitBranch = `gitBranch like '%%'` : _gitBranch = `gitBranch like '%${data.gitBranch}%'`;

    console.log(_chip);
    console.log(_model);
    console.log(_verison);
    console.log(_memory);
    console.log(_soc);
    console.log(_EMMC);
    console.log(_targetProduct);
    console.log(_gitBranch);

    var sql = `SELECT * FROM ${dbConfig.tables.products} WHERE ${_chip} AND ${_model} AND ${_verison} AND ${_memory} AND ${_soc} AND ${_EMMC} AND ${_targetProduct} AND ${_gitBranch} order by operateTime desc`;
    console.log(sql);
    let sql_params = [];
    db.conn.query(sql,sql_params,function(err,rows,fields){
      if (err) {
        return callback(err,null);
      }
      callback(null, rows);
    });
}

/**
 * @param {注：查询某个机芯机型的修改历史记录，state：0->审核已通过 1->待审核 2->审核未通过}
 */
ProductModel.prototype.queryHistory = function (chip, model, callback) {

  var sql = `SELECT * FROM ${dbConfig.tables.modifyhistory} WHERE chip = ? AND model = ?`;
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

  let sql = `SELECT * FROM ${dbConfig.tables.products} WHERE targetProduct IN (SELECT a.targetProduct FROM ${dbConfig.tables.mkdata} a, modules b WHERE a.engName=b.engName AND b.cnName=?)`;
  let sql_params = [name]; //模块中文名
  db.conn.query(sql,sql_params,function(err,rows,fields){
    if (err) {
        return callback(err);
    }
    callback(null, rows);
  });
}

ProductModel.prototype.queryByChipModel = function (data, callback) {
  let chip = data.chip;
  let model = data.model;
  let sql = `SELECT * FROM ${dbConfig.tables.products} WHERE chip = ? AND model = ?`;
  let sql_params = [chip,model];
  db.conn.query(sql,sql_params,function(err,rows,fields) {
    if (err) {
        return callback(err);
    }
    callback(null, rows);
  });
}

ProductModel.prototype.queryMKDataByTargetProduct = function (targetproduct, callback) {
  let sql = `SELECT * FROM ${dbConfig.tables.mkdata} WHERE targetProduct = ?`;
  let sql_params = [targetproduct];
  db.conn.query(sql,sql_params,function(err,rows,fields){
    if (err) {
        return callback(err);
    }
    callback(null, rows);
  });
}

/**
 * @param {注：通过targetProduct查询产品项}
 */
ProductModel.prototype.queryProductsByTargetProduct = function (targetproduct, callback) {
  let sql = `SELECT * FROM ${dbConfig.tables.products} WHERE targetProduct = ?`;
  let sql_params = [targetproduct];
  db.conn.query(sql,sql_params,function(err,rows,fields){
    if (err) {
        logger.error("queryProductsByTargetProduct:"+err);
        return callback(err);
    }
    callback(null, rows);
  });
}

ProductModel.prototype.queryAll = function (callback) {
  let ep = new eventproxy();
  let sql_list = [
                  "SELECT * FROM configs order by category,orderId",
                  "SELECT * FROM modules order by category,orderId",
                  "SELECT * FROM settings",
                  "SELECT * FROM props",
                  "SELECT * FROM configcategory order by orderId",
                  "SELECT * FROM mkcategory order by orderId",
                  "SELECT * FROM propscategory order by orderId"
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

/**
 * @param {注：查询某个机芯&机型的全部信息}
 */
ProductModel.prototype.queryAllByMachine = function (chip, model, callback) {
  let ep = new eventproxy();
  let sql_list = [
                  `SELECT * FROM ${dbConfig.tables.products} WHERE chip = ? AND model = ?`,
                  `SELECT * FROM ${dbConfig.tables.configdata} WHERE chip = ? AND model = ?`,
                  `SELECT * FROM ${dbConfig.tables.settingsdata} WHERE chip = ? AND model = ?`,
                  `SELECT * FROM ${dbConfig.tables.propsdata} WHERE chip = ? AND model = ?`,
                  `SELECT * FROM ${dbConfig.tables.mkdata} WHERE targetProduct in (SELECT targetProduct FROM ${dbConfig.tables.products} WHERE chip = ? AND model = ?)`
                ];

  ep.bind('error', function (err) {
      logger.error("queryAllByMachine 捕获到错误-->" + err);
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

/**
 * @param {注：查询某个机芯&机型的全部临时信息（之前有过修改，还处于待审核状态)}
 */
ProductModel.prototype.queryAllByMachineTemp = function (chip, model, callback) {
  let ep = new eventproxy();
  let sql_list = [
                  `SELECT * FROM ${dbConfig.tables.products} WHERE chip = ? AND model = ?`,
                  `SELECT * FROM ${dbConfig.tables.configdata_temp} WHERE chip = ? AND model = ?`,
                  `SELECT * FROM ${dbConfig.tables.settingsdata_temp} WHERE chip = ? AND model = ?`,
                  `SELECT * FROM ${dbConfig.tables.propsdata_temp} WHERE chip = ? AND model = ?`,
                  `SELECT * FROM ${dbConfig.tables.mkdata} WHERE targetProduct in (SELECT targetProduct FROM ${dbConfig.tables.products} WHERE chip = ? AND model = ?)`
                ];

  ep.bind('error', function (err) {
      logger.error("queryAllByMachine 捕获到错误-->" + err);
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

ProductModel.prototype.add = function (baseInfo, configInfo, settingsInfo, propsInfo, callback) {

  console.log(baseInfo);
  console.log(configInfo[0]);
  console.log(settingsInfo[0]);
  console.log(propsInfo);
  console.log(configInfo.length);
  console.log(settingsInfo.length);
  console.log(propsInfo.length);

  let ep = new eventproxy();

  ep.bind('error', function (err) {
      logger.error("ProductModel.prototype.add 捕获到错误-->" + err);
      //卸掉所有的handler
      ep.unbind();
      callback(err,null);
  });

  ep.after('insert_result', configInfo.length + settingsInfo.length + propsInfo.length + 1, function (list) {
      // 所有查询的内容都存在list数组中
      callback(null,null);
  });

  let baseInfoObj = JSON.parse(baseInfo);
  let chip = baseInfoObj.chip;
  let model = baseInfoObj.model;
  let targetProduct = baseInfoObj.targetProduct;
  let auditState = baseInfoObj.auditState;
  let modifyState = baseInfoObj.modifyState;
  let androidVersion = baseInfoObj.androidVersion;
  let memorySize = baseInfoObj.memorySize;
  let EMMC = baseInfoObj.EMMC;
  let soc = baseInfoObj.soc;
  let platform = baseInfoObj.platform;
  let gitBranch = baseInfoObj.gitBranch;
  let userName = baseInfoObj.userName;

  let sql0 = `INSERT INTO ${dbConfig.tables.products}(chip,model,targetProduct,auditState,modifyState,androidVersion,memorySize,EMMC,soc,platform,\
    gitBranch,userName) values (?,?,?,?,?,?,?,?,?,?,?,?)`;
  let sql0_param = [chip,model,targetProduct,auditState,modifyState,androidVersion,memorySize,EMMC,soc,platform,gitBranch,userName];
  console.log(sql0_param);
  db.conn.query(sql0,sql0_param,function(err,rows,fields){
    if (err) return ep.emit('error', err);
    ep.emit('insert_result',"INSERT INTO products OK");
  });

  let sql1 = `INSERT INTO ${dbConfig.tables.configdata_temp}(chip,model,engName,curValue) values (?,?,?,?)`;
  for(let i=0; i<configInfo.length; i++) {
    let sql1_param = [chip,model,configInfo[i].engName,configInfo[i].curValue];
    db.conn.query(sql1,sql1_param,function(err,rows,fields){
      if (err) return ep.emit('error', err);
      ep.emit('insert_result',"INSERT INTO configdata_temp OK");
    });
  }

  let sql2 = `INSERT INTO ${dbConfig.tables.settingsdata_temp}(chip,model,engName) values (?,?,?)`;
  for(let i=0; i<settingsInfo.length; i++) {
    let sql2_param = [chip,model,settingsInfo[i].engName];
    db.conn.query(sql2,sql2_param,function(err,rows,fields){
      if (err) return ep.emit('error', err);
      ep.emit('insert_result',"INSERT INTO settingsdata_temp OK");
    });
  }

  let sql3 = `INSERT INTO ${dbConfig.tables.propsdata_temp}(chip,model,engName,curValue) values (?,?,?,?)`;
  for(let i=0; i<propsInfo.length; i++) {
    let sql3_param = [chip,model,propsInfo[i].engName,propsInfo[i].curValue];
    db.conn.query(sql3,sql3_param,function(err,rows,fields){
      if (err) return ep.emit('error', err);
      ep.emit('insert_result',"INSERT INTO settingsdata_temp OK");
    });
  }
}

/**
 * @param {注意：更新时应该先清空某产品的临时表内容，再插入新数据}
 */
ProductModel.prototype.update = function (baseInfo, configInfo, settingsInfo, callback) {
  console.log(baseInfo);
  let baseInfoObj = JSON.parse(baseInfo);
  let chip = baseInfoObj.chip;
  let model = baseInfoObj.model;

  async.parallel(
    {
      delConfigTemp: function(callback1){
          let sql = `DELETE FROM ${dbConfig.tables.configdata_temp} WHERE chip=? AND model=?`;
          db.conn.query(sql,[chip,model],function(err,rows,fields){
            if (err) return callback1(err,null);
            callback1(null,"delConfigTemp OK");
          });
      },
      delSettingsTemp: function(callback1){
        let sql = `DELETE FROM ${dbConfig.tables.settingsdata_temp} WHERE chip=? AND model=?`;
        db.conn.query(sql,[chip,model],function(err,rows,fields){
          if (err) return callback1(err,null);
          callback1(null,"delSettingsTemp OK");
        });
      }
  },
  function(err, results) {
      console.log(results);
      if(err) return callback(err,null);
      _update(baseInfo, configInfo, settingsInfo, callback);
  })
}

function _update(baseInfo, configInfo, settingsInfo, callback) {

  let baseInfoObj = JSON.parse(baseInfo);
  let chip = baseInfoObj.chip;
  let model = baseInfoObj.model;
  let targetProduct = baseInfoObj.targetProduct;
  let auditState = baseInfoObj.auditState;
  let modifyState = baseInfoObj.modifyState;
  let androidVersion = baseInfoObj.androidVersion;
  let memorySize = baseInfoObj.memorySize;
  let EMMC = baseInfoObj.EMMC;
  let soc = baseInfoObj.soc;
  let platform = baseInfoObj.platform;
  let gitBranch = baseInfoObj.gitBranch;
  let userName = baseInfoObj.userName;

  let ep = new eventproxy();

  ep.bind('error', function (err) {
      logger.error("ProductModel.prototype.update 捕获到错误-->" + err);
      ep.unbind();
      callback(err,null);
  });

  ep.after('insert_result', configInfo.length + settingsInfo.length + 1, function (list) {
      // 所有查询的内容都存在list数组中
      console.log("ProductModel.prototype.update OK");
      callback(null,null);
  });

  let sql0 = `UPDATE ${dbConfig.tables.products} SET auditState=1,modifyState=1,androidVersion=?,memorySize=?,EMMC=?,targetProduct=?,soc=?,platform=?,gitBranch=?, \
  userName=? WHERE chip=? AND model=?`;
  let sql0_param = [androidVersion,memorySize,EMMC,targetProduct,soc,platform,gitBranch,userName,chip,model];
  console.log(sql0_param);
  db.conn.query(sql0,sql0_param,function(err,rows,fields){
    if (err) return ep.emit('error', err);
    ep.emit('insert_result',"INSERT INTO products OK");
  });

  let sql1 = `INSERT INTO ${dbConfig.tables.configdata_temp}(chip,model,engName,curValue) values (?,?,?,?)`;
  for(var i=0; i<configInfo.length;i++) {
    let sql1_param = [chip,model,configInfo[i].engName,configInfo[i].curValue];
    console.log(sql1_param + i);
    db.conn.query(sql1,sql1_param,function(err,rows,fields){
      if (err) return ep.emit('error', err);
      ep.emit('insert_result',"INSERT INTO configdata_temp OK");
    });
  }

  let sql2 = `INSERT INTO ${dbConfig.tables.settingsdata_temp}(chip,model,engName) values (?,?,?)`;
  for(var j=0; j<settingsInfo.length;j++) {
    let sql2_param = [chip,model,settingsInfo[i].engName];
    console.log(sql2_param + j);
    db.conn.query(sql2,sql2_param,function(err,rows,fields){
      if (err) return ep.emit('error', err);
      ep.emit('insert_result',"INSERT INTO settingsdata_temp OK");
    });
  }
}

ProductModel.prototype.addHistory = function (data, callback) {
  console.log(data);
  let sql = `INSERT INTO ${dbConfig.tables.modifyhistory}(chip,model,state,userName,content,reason) values (?,?,?,?,?,?)`;
  let sql_param = [data.chip,data.model,data.state,data.userName,data.content,data.reason];
  console.log(sql_param);
  db.conn.query(sql,sql_param,function(err,rows,fields){
    if (err) return callback(err);
    callback(null, rows);
  });
}

/**
 * @param {预览某产品生成的文件}
 */
ProductModel.prototype.preview = function (chip, model, callback) {
    console.log("preview chip:" + chip);
    console.log("preview model:" + model);
    generator.preview(chip, model, function(err, results){
      if (err) {
          return callback(err);
      }
      callback(null, results);
    });
}

/**
 * @param {进行审核，level 0表示审核通过，1 表示审核不通过}
 * @param {当审核通过时，需要修改历史表，产品表，调用临时数据同步到正式表的过程，最后在调用生成文件的接口}
 * @param {当审核不通过时，也更新修改历史的状态，同时把审核不通过的原因发邮件告知用户}
 */
ProductModel.prototype.review = function (data, callback) {
    console.log(data);
    let chip = data.chip;
    let model = data.model;
    let flag = data.flag; //0表示审核通过，1表示不通过
    let sql;
    if(flag === 0){
      sql = `UPDATE ${dbConfig.tables.products} set auditState = 0, modifyState = 0 WHERE chip = ? AND model = ?`;
      db.conn.query(sql,[chip, model],function(err,rows,fields){
        if (err) return callback(err);
        let sql1 = `UPDATE ${dbConfig.tables.modifyhistory} set state = 0 WHERE chip = ? AND model = ?`;
        db.conn.query(sql1,[chip, model],function(err,rows,fields){
          if (err) {
            logger.debug("更新历史表时出错：" + err);
            return callback(err);
          }
          //当更新产品表和修改历史表成功后，执行生成文件的操作
          generator.generate(chip, model, function(err,result){
            if(err) {
              logger.debug("在审核生成文件时出错：" + err);
              return callback(err);
            }
            callback(null, result);
          });
          // callback(null, rows);
        });
      });
    }else {
      sql = `UPDATE ${dbConfig.tables.products} set auditState = 2 WHERE chip = ? AND model = ?`;
      db.conn.query(sql,[chip, model],function(err,rows,fields){
        if (err) {
          logger.error("调用审核不通过接口，更新产品表状态时错误" + err);
          return callback(err);
        }
        let sql1 = `UPDATE ${dbConfig.tables.modifyhistory} set state = 2 WHERE chip = ? AND model = ? AND state = 1`;
        db.conn.query(sql1,[chip, model],function(err,rows,fields){
          if (err) return callback(err);
          callback(null, rows);
        });
      });
    }
}

/**
 * @param {删除某产品，auditState 0->正常 1->待审核 2->审核未通过；modifyState 0->正常 1->修改 2->增加 3->删除}
 */
ProductModel.prototype.delete = function (data, callback) {
    let chip = data.chip;
    let model = data.model;
    let userName = data.userName;
    var sql = `UPDATE ${dbConfig.tables.products} set auditState = 1, modifyState = 3, userName = ? WHERE chip = ? AND model = ?`;
    let sql_params = [userName, chip, model];
    console.log(sql_params);
    db.conn.query(sql,sql_params,function(err,rows,fields){
      if (err) {
        return callback(err);
      }
      callback(null, rows);
    });
}

/**
 * @param {撤销删除操作}
 */
ProductModel.prototype.deleteRecovery = function (data, callback) {
    let chip = data.chip;
    let model = data.model;
    var sql = `UPDATE ${dbConfig.tables.products} set auditState = 0, modifyState = 0 WHERE chip = ? AND model = ?`;
    let sql_params = [chip, model];
    console.log(sql_params);
    db.conn.query(sql,sql_params,function(err,rows,fields){
      if (err) {
        return callback(err);
      }
      callback(null, rows);
    });
}

/**
 * @param {获取待审核消息数和未审核消息数。这里要区分普通用户和管理员用户，普通用户只需获取自己的消息数，管理员用户需要获取全部的消息数}
 */
ProductModel.prototype.queryAuditByUser = function (data, callback) {
    let userName = data.userName;
    let level = data.level;

    console.log("queryAuditByUser = " + userName + level);

    let ep = new eventproxy();
    let sql_list0 = [
                    `SELECT * FROM ${dbConfig.tables.products} WHERE auditState = 1`,
                    `SELECT * FROM ${dbConfig.tables.products} WHERE auditState = 2`
                  ];

    let sql_list1 = [
                    `SELECT * FROM ${dbConfig.tables.products} WHERE auditState = 1 AND userName = ?`,
                    `SELECT * FROM ${dbConfig.tables.products} WHERE auditState = 2 AND userName = ?`
                  ];

    ep.bind('error', function (err) {
        logger.error("queryAuditByUser 捕获到错误-->" + err);
        //卸掉所有的handler
        ep.unbind();
        callback(err,null);
    });

    ep.after('query_result', 2, function (list) {
        // 所有查询的内容都存在list数组中
        let listObject = [];
        for(let i in list) {
          listObject.push(list[i]);
        }
        callback(null,listObject);
    });

    if (level == 1) {
      for (var i = 0; i < sql_list0.length; i++) { //数据结构与调用顺序有关
        db.conn.query(sql_list0[i],[],ep.group('query_result'));
      }
    } else {
      for (var i = 0; i < sql_list1.length; i++) { //数据结构与调用顺序有关
        db.conn.query(sql_list1[i],[userName],ep.group('query_result'));
      }
    }
}

var productModel = new ProductModel();

module.exports = productModel;
