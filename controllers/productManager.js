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
  let propsInfo = req.body.propsInfo;

  productModel.add(baseInfo, configInfo, settingsInfo, propsInfo, function(err,results) {
    if(err) {
      return output.error(req,res,err);
    }
    output.success(req,res,"新增产品项成功");
  });

};

/**
 * @param {添加某个产品修改记录}
 */
exports.addHistory = function (req, res, next) {

  let data = req.body.data;

  productModel.addHistory(data, function(err,results) {
    if(err) {
      return output.error(req,res,err);
    }
    output.success(req,res,"新增产品的历史修改记录成功");
  });

};

/**
 * @param {更新产品数据}
 */
exports.update = function (req, res, next) {
  let baseInfo = req.body.baseInfo;
  let configInfo = req.body.configInfo;
  let settingsInfo = req.body.settingsInfo;

  productModel.update(baseInfo, configInfo, settingsInfo, function(err,results) {
    if(err) {
      return output.error(req,res,err);
    }
    output.success(req,res,"update产品项成功");
  });
};

/**
 * @param {预览}
 */
exports.preview = function (req, res, next) {
  let chip = req.body.chip;
  let model = req.body.model;
  console.log(chip);
  productModel.preview(chip, model, function(err,results) {
    if(err) {
      return output.error(req,res,err);
    }
    console.log(results);
    output.success(req,res,"获取预览信息成功",results);
  });
}

/**
 * @param {删除某个产品}
 */
exports.delete = function (req, res, next) {
  let data = req.body.data;
  console.log(data);
  productModel.delete(data, function(err,results) {
    if(err) {
      return output.error(req,res,err);
    }
    output.success(req,res,"执行产品删除操作成功");
  });
};

/**
 * @param {进行审核操作}
 */
exports.review = function (req, res, next) {
  let data = req.body.data;
  console.log(data);
  productModel.review(data, function(err,results) {
    if(err) {
      return output.error(req,res,err);
    }
    output.success(req,res,"执行审核操作成功");
  });
};

exports.deleteRecovery = function (req, res, next) {
  let data = req.body.data;
  console.log(data);
  productModel.deleteRecovery(data, function(err,results) {
    if(err) {
      return output.error(req,res,err);
    }
    output.success(req,res,"执行产品删除恢复操作成功");
  });
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

    let data = req.body.data;
    productModel.queryByRegEx(data,function(err,results) {
      if(err) {
        return output.error(req,res,err);
      }
      output.success(req,res,"模糊查询产品表成功",results);
    });
};

exports.queryByChipModel = function (req, res, next) {

    let data = req.body.data;
    productModel.queryByChipModel(data,function(err,results) {
      if(err) {
        return output.error(req,res,err);
      }
      output.success(req,res,"根据机芯机型查询产品表成功",results);
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

exports.queryProductsByTargetProduct = function (req, res, next) {
    let targetproduct = req.body.targetproduct;
    console.log(targetproduct);
    productModel.queryProductsByTargetProduct(targetproduct, function(err,results) {
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

/**
 * @param {注：查询某个机芯&机型的全部临时信息（之前有过修改，还处于待审核状态)}
 */
exports.queryAllByMachineTemp = function (req, res, next) {
    let chip = req.body.chip;
    let model = req.body.model;
    productModel.queryAllByMachineTemp(chip, model, function(err,results) {
      if(err) {
        return output.error(req,res,err);
      }
      console.log(results);
      output.success(req,res,"查询queryAllByMachineTemp成功",results);
    });
};

exports.queryAuditByUser = function (req, res, next) {
    let data = req.body.data;
    productModel.queryAuditByUser(data, function(err,results) {
      if(err) {
        return output.error(req,res,err);
      }
      console.log(results);
      output.success(req,res,"查询审核状态信息成功",results);
    });
};
