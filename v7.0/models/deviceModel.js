var eventproxy = require('eventproxy');
var async = require('async');
var db = require('../../common/db');
var logger = require('../../common/logger');
var dbConfig = require('./dbConfig');
var generator = require('../file/generate');

var DeviceModel = function() {};

DeviceModel.prototype.queryAll = function (callback) {
  let ep = new eventproxy();
  let sql_list = [
                  "SELECT * FROM chips",
                  "SELECT * FROM models",
                  "SELECT * FROM targetProducts",
                  "SELECT * FROM soc"
                ];

  ep.bind('error', function (err) {
      logger.error("queryAll 捕获到错误-->" + err);
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
    db.conn.query(sql_list[i],[],ep.group('query_result'));
  }
}

DeviceModel.prototype.queryChip = function (callback) {

  let sql = "SELECT * FROM chips";
  db.conn.query(sql,[],function(err,rows,fields){
    if (err) {
        logger.error("查询机芯报错：" + err);
        return callback(err);
    }
    callback(null, rows);
  });
}

DeviceModel.prototype.addChip = function (chip, callback) {

  let sql = "INSERT INTO chips(name) values (?)";
  let sql_params = [chip];
  db.conn.query(sql,sql_params,function(err,rows,fields){
    if (err) {
        logger.error("新增机芯报错：" + err);
        return callback(err);
    }
    callback(null, rows);
  });
}

/**
 * @param {修改机芯，需要对影响到的产品重新生成文件，也需要默认提交，不经过审核}
 */
DeviceModel.prototype.updateChip = function (newValue, oldValue, callback) {
  var sql = "UPDATE chips set name = ? WHERE name = ?";
  db.conn.query(sql,[newValue,oldValue],function(err,rows,fields){
    if (err) {
        logger.error("更新机芯报错：" + err);
        return callback(err);
    }
    let sql1 = `UPDATE ${dbConfig.tables.products} SET chip = ? WHERE chip = ?`;
    db.conn.query(sql1,[newValue,oldValue],function(err,rows,fields){
      if (err) {
        logger.error("更新机芯，修改产品表的机芯值报错：" + err);
        return callback(err);
      }
      generator.generateByChip(newValue, function(err,result){
        if(err){
          logger.error("generateByChip" + err);
          return callback(err);
        }
        callback(null,"generateByChip OK" + result);
      });
      //callback(null,rows);
    });
  });
}

DeviceModel.prototype.queryModel = function (callback) {

  let sql = "SELECT * FROM models";
  let sql_params = [];
  db.conn.query(sql,sql_params,function(err,rows,fields){
    if (err) {
        return callback(err);
    }
    callback(null, rows);
  });
}

DeviceModel.prototype.addModel = function (value, callback) {

  let sql = "INSERT INTO models(name) values (?)";
  let sql_params = [value];
  db.conn.query(sql,sql_params,function(err,rows,fields){
    if (err) {
        return callback(err);
    }
    callback(null, rows);
  });
}

/**
 * @param {修改机型，需要对影响到的产品重新生成文件，也需要默认提交，不经过审核}
 */
DeviceModel.prototype.updateModel = function (newValue, oldValue, callback) {
  var sql = "UPDATE models SET name = ? WHERE name = ?";
  db.conn.query(sql,[newValue,oldValue],function(err,rows,fields){
    if (err) {
      logger.error("更新机型报错：" + err);
      return callback(err);
    }
    let sql1 = `UPDATE ${dbConfig.tables.products} SET model = ? WHERE model = ?`;
    db.conn.query(sql1,[newValue,oldValue],function(err,rows,fields){
      if (err) {
        logger.error("更新机型，修改产品表的机型值报错：" + err);
        return callback(err);
      }
      generator.generateByModel(newValue, function(err,result){
        if(err){
          logger.error("generateByModel" + err);
          return callback(err);
        }
        callback(null,"generateByModel OK" + result);
      });
      //callback(null,rows);
    });
  });
}

DeviceModel.prototype.queryTargetProduct = function (callback) {

  let sql = "SELECT * FROM targetProducts";
  let sql_params = [];
  db.conn.query(sql,sql_params,function(err,rows,fields){
    if (err) {
        return callback(err);
    }
    callback(null, rows);
  });
}

DeviceModel.prototype.queryTargetProductByRegEx = function (value, callback) {

  let _targetProduct;
  (value == undefined) ? _targetProduct = `name like '%%'` : _targetProduct = `name like '%${value}%'`;
  console.log(_targetProduct);
  var sql = `SELECT * FROM targetProducts WHERE ${_targetProduct}`;
  console.log(sql);
  db.conn.query(sql,[],function(err,rows,fields){
    if (err) {
      return callback(err);
    }
    callback(null, rows);
  });
}

/**
 * @param {新增targetproduct,这里需要更新两个表，mkdata和targetProducts}
 */
DeviceModel.prototype.addTargetProduct = function (data, callback) {
  let name = data.name;
  let mkArr = data.mkArr;
  let propsArr = data.propsArr;
  console.log(mkArr.length);
  console.log(propsArr.length);

  if(mkArr.length == 0) return callback("addTargetProduct参数错误！",null);
  let ep = new eventproxy();

  ep.bind('error', function (err) {
      logger.error("捕获到错误-->" + err);
      ep.unbind();
      callback(err,null);
  });

  ep.after('insert_result', mkArr.length + propsArr.length + 1, function (list) { // 注意：长度是 arr.length + 1
      callback(null,"addTargetProduct OK");
  });

  let sql0 = "INSERT INTO targetProducts(name) values (?)";
  db.conn.query(sql0,[name],function(err,rows,fields){
    if (err) return ep.emit('error', err);
    ep.emit('insert_result', 'sql0 ok');
  });

  for (let i = 0; i < mkArr.length; i++) { //数据结果与调用顺序无关
    let sql1 = `INSERT INTO ${dbConfig.tables.mkdata}(targetProduct,engName) values (?,?)`;
    let sql_params1 = [name ,mkArr[i].engName];
    db.conn.query(sql1,sql_params1,function(err,rows,fields) {
      if (err) return ep.emit('error', err);
      console.log('insert_result----ok' + i);
      ep.emit('insert_result', 'ok' + i);
    });
  }

  for (let j = 0; j < propsArr.length; j++) { //数据结果与调用顺序无关
    let sql2 = `INSERT INTO ${dbConfig.tables.propsdata}(targetProduct,engName,curValue) values (?,?,?)`;
    let sql_params2 = [name ,propsArr[j].engName,propsArr[j].curValue];
    db.conn.query(sql2,sql_params2,function(err,rows,fields) {
      if (err) return ep.emit('error', err);
      console.log('insert_result----ok' + j);
      ep.emit('insert_result', 'ok' + j);
    });
  }
}

/**
 * @param {修改TP的内容，这会影响到已经配置好该TP的正式产品}
 * @param {需要更新2个表，mkdata表，props表，这时相关产品需要重新生成TP文件，并静默上传git仓库，不需要再进行审核步骤}
 * @param {无法满足需要进行审核的步骤，主要是逻辑复杂，在提交是进一步确认是否修改即可}
 * @param {当确认提交后，平台会自动生成对应产品的mk文件，这里无论是待审核还是正式产品，都会重新生成mk文件}
 */
DeviceModel.prototype.updateTargetProduct = function (data, callback) {

  let name = data.name;
  let mkArr = data.mkArr;
  let propsArr = data.propsArr;
  console.log(mkArr.length);
  console.log(propsArr.length);

  let ep = new eventproxy();
  ep.bind('error', function (err) {
      logger.error("updateTargetProduct 捕获到错误-->" + err);
      ep.unbind();
      callback(err,null);
  });
  ep.after('insert_result', mkArr.length + propsArr.length , function (list) {
      console.log(list);
      // 这个接口可能有问题
      generator.generateByTargetProduct(name, function(err,result){
        if(err){
          logger.error("generateByTargetProduct错误：" + err);
          return callback(err);
        }
        callback(null,"updateTargetProduct OK" + result);
      });
      // callback(null,"updateTargetProduct OK");
  });
  async.parallel(
    {
      delMKdata: function(callback1) {
          let sql = `DELETE FROM ${dbConfig.tables.mkdata} WHERE targetProduct = ?`;
          db.conn.query(sql,[name],function(err,rows,fields){
            if (err) return callback1(err,null);
            callback1(null,"delMKdata OK");
          });
      },
      delPropsdata: function(callback1) {
        let sql = `DELETE FROM ${dbConfig.tables.propsdata} WHERE targetProduct = ?`;
        db.conn.query(sql,[name],function(err,rows,fields) {
          if (err) return callback1(err,null);
          callback1(null,"delPropsdata OK");
        });
      }
  },
  function(err, results) {
      if(err) {
        logger.error("删除tp数据失败" + err);
        return callback(err,null);
      }
      for (let i = 0; i < mkArr.length; i++) {
          let sql0 = `INSERT INTO ${dbConfig.tables.mkdata} (targetProduct, engName) VALUES (?,?)`;
          let sql_param0 = [name, mkArr[i].engName];
          console.log("sql_param0=" + sql_param0);
          db.conn.query(sql0,sql_param0,function(err,rows,fields) {
            if (err) return ep.emit('error', err);
            ep.emit('insert_result', 'ok' + i);
          });
      }
      for (let j = 0; j < propsArr.length; j++) {
          let sql1 = `INSERT INTO ${dbConfig.tables.propsdata} (targetProduct, engName, curValue) VALUES (?,?,?)`;
          let sql_param1 = [name, propsArr[j].engName,propsArr[j].curValue];
          console.log("sql_param1=" + sql_param1);
          db.conn.query(sql1,sql_param1,function(err,rows,fields) {
            if (err) return ep.emit('error', err);
            ep.emit('insert_result', 'ok' + j);
          });
      }
  })
}

/**
 * @param {修改TP的名称，这个情况很可能出现，在添加的时候失误输错一个字符等}
 * @param {需要更新三个表，产品表，mkdata表，targetproducts表，这时相关产品需要重新生成TP文件，并静默上传，不需要再进行审核步骤}
 * @param {无法满足需要进行审核的步骤，万一审核不通过，TP的名称事实上已改，无法恢复}
 */
DeviceModel.prototype.updateTargetProductName = function (data, callback) {

  let newValue = data.newValue;
  let oldValue = data.oldValue;
  let ep = new eventproxy();
  ep.bind('error', function (err) {
      logger.error("updateTargetProductName 捕获到错误-->" + err);
      ep.unbind();
      callback(err,null);
  });

  ep.after('update_result', 3, function (list) {
      console.log(list);
      generator.generateByTargetProduct(name, function(err,result){
        if(err){
          logger.error("updateTargetProductName" + err);
          return callback(err);
        }
        callback(null,"updateTargetProductName OK" + result);
      });
      //callback(null,"updateTargetProductName OK");
  });

  let sql0 = `UPDATE ${dbConfig.tables.products} SET targetProduct = ? WHERE targetProduct = ?`;
  let sql_params0 = [newValue,oldValue];
  db.conn.query(sql0,sql_params0,function(err,rows,fields){
    if (err) return ep.emit('error',error);
    ep.emit('update_result',"UPDATE products OK");
  });

  let sql1 = "UPDATE targetProducts SET name = ? WHERE name = ?";
  let sql_params1 = [newValue,oldValue];
  db.conn.query(sql1,sql_params1,function(err,rows,fields){
    if (err) return ep.emit('error',error);
    ep.emit('update_result',"UPDATE targetProducts OK");
  });

  let sql2 = `UPDATE ${dbConfig.tables.mkdata} SET targetProduct = ? WHERE targetProduct = ?`;
  let sql_params2 = [newValue,oldValue];
  db.conn.query(sql2,sql_params2,function(err,rows,fields){
    if (err) return ep.emit('error',error);
    ep.emit('update_result',"UPDATE mkdata OK");
  });
}

DeviceModel.prototype.querySoc = function (callback) {

  let sql = "SELECT * FROM soc";
  let sql_params = [];
  db.conn.query(sql,sql_params,function(err,rows,fields){
    if (err) {
        return callback(err);
    }
    callback(null, rows);
  });
}

DeviceModel.prototype.addSoc = function (value, callback) {

  let sql = "INSERT INTO soc(name) values (?)";
  let sql_params = [value];
  db.conn.query(sql,sql_params,function(err,rows,fields){
    if (err) {
        return callback(err);
    }
    callback(null, rows);
  });
}

DeviceModel.prototype.updateSoc = function (newValue, oldValue, callback) {
  var sql = "UPDATE soc set name = ? WHERE name = ?";
  let sql_params = [newValue,oldValue];
  db.conn.query(sql,sql_params,function(err,rows,fields){
    if (err) {
        return callback(err);
    }
    callback(null, rows);
  });
}


var deviceModel = new DeviceModel();

module.exports = deviceModel;
