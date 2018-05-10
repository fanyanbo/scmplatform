var validator = require('validator');
var eventproxy = require('eventproxy');
var config = require('../config/config');
var logger = require('../common/logger');
var output = require('../common/output');
var productModel = require('../models/productModel');

/**
 * @param {HttpRequest} req
 * @param {HttpResponse} res
 * @param {Function} next
 */
exports.add = function (req, res, next) {

  let baseInfo = req.body.baseInfo;
  let configInfo = req.body.configInfo;
  let settingsInfo = req.body.settingsInfo;

  console.log(baseInfo);
  console.log(configInfo);
  console.log(settingsInfo);

  return output.success(req,res);

  productModel.add(baseInfo, configInfo, settingsInfo, function(err,results) {
    if(err) {
      return output.error(req,res,err);
    }
    output.success(req,res,"新增产品项成功",results);
  });

};

exports.preview = function (req, res, next) {
  let chip = req.body.chip;
  let model = req.body.model;
  console.log(chip + model);
  productModel.preview(chip, model, function(err,results) {
    if(err) {
      return output.error(req,res,err);
    }
    output.success(req,res,"获取预览信息成功",results);
  });
}

exports.delete = function (req, res, next) {
    res.json("delete:" + req.url);
};

exports.queryByPage = function (req, res, next) {
  let offset = +req.body.offset;
  let rows = +req.body.rows;
  productModel.queryByPage(offset, rows, function(err,results) {
    if(err) {
      return output.error(req,res,err);
    }
    output.success(req,res,"分页查询产品表成功",results);
  });
};

exports.queryByRegEx = function (req, res, next) {

    let _chip = req.body.chip;
    let _model = req.body.model;
    let _version = req.body.version;
    let _soc = req.body.soc;
    let _memory = req.body.memory;

    productModel.queryByRegEx(_chip,_model,_version,_memory,_soc,function(err,results) {
      if(err) {
        return output.error(req,res,err);
      }
      output.success(req,res,"模糊查询产品表成功",results);
    });
};

/**
 * @param {注：模块名称为中文名，且需全匹配，暂不支持模糊查询}
 */
exports.queryByModule = function (req, res, next) {

    let name = req.body.name;
    productModel.queryByModule(name, function(err,results) {
      if(err) {
        return output.error(req,res,err);
      }
      output.success(req,res,"按模块查询产品表成功",results);
    });
};

/**
 * @param {注：查询某个机芯机型的修改历史记录}
 */
exports.queryHistory = function (req, res, next) {
    let chip = req.body.chip;
    let model = req.body.model;
    productModel.queryHistory(chip,model,function(err,results) {
      if(err) {
        return output.error(req,res,err);
      }
      output.success(req,res,"查询产品修改历史表成功",results);
    });
};

exports.queryMKDataByTargetProduct = function (req, res, next) {
    let targetproduct = req.body.targetproduct;
    console.log(targetproduct);
    productModel.queryMKDataByTargetProduct(targetproduct, function(err,results) {
      if(err) {
        return output.error(req,res,err);
      }
      output.success(req,res,"根据TargetProduct查询mkdata列表成功",results);
    });
};

/**
 * @param {注：查询一切，一切...全部信息打包给前端}
 */
exports.queryAll = function (req, res, next) {

    productModel.queryAll(function(err,results) {
      if(err) {
        return output.error(req,res,err);
      }
      console.log(results);
      output.success(req,res,"查询queryAll成功",results);
    });
};

/**
 * @param {注：查询某个机芯&机型的全部信息}
 */
exports.queryAllByMachine = function (req, res, next) {
    let chip = req.body.chip;
    let model = req.body.model;
    productModel.queryAllByMachine(chip, model, function(err,results) {
      if(err) {
        return output.error(req,res,err);
      }
      console.log(results);
      output.success(req,res,"查询queryAllByMachine成功",results);
    });
};

exports.update = function (req, res, next) {

};
