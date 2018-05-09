var config = require('../config/config');
var logger = require('../common/logger');
var output = require('../common/output');
var deviceModel = require('../models/deviceModel');


exports.queryAll = function (req, res, next) {

    deviceModel.queryAll(function(err,results) {
      if(err) {
        return output.error(req,res,err);
      }
      output.success(req,res,"查询所有设备信息列表成功",results);
    });
};

exports.queryTargetProduct = function (req, res, next) {

    deviceModel.queryTargetProduct(function(err,results) {
      if(err) {
        return output.error(req,res,err);
      }
      output.success(req,res,"查询TargetProduct列表成功",results);
    });
};

exports.addTargetProduct = function (req, res, next) {

    let name = req.body.name;
    let arrObj = req.body.arr;
    deviceModel.addTargetProduct(name, arrObj, function(err,results) {
      if(err) {
        return output.error(req,res,err);
      }
      output.success(req,res,"添加TargetProduct项成功",results);
    });
};

exports.updateTargetProduct = function (req, res, next) {

    let newValue = req.body.newValue;
    let oldValue = req.body.oldValue;
    deviceModel.updateTargetProduct(newValue,oldValue,function(err,results) {
      if(err) {
        return output.error(req,res,err);
      }
      output.success(req,res,"修改TargetProduct项成功",results);
    });
};

exports.queryChip = function (req, res, next) {

    deviceModel.queryChip(function(err,results) {
      if(err) {
        return output.error(req,res,err);
      }
      output.success(req,res,"查询Chip列表成功",results);
    });
};

exports.addChip = function (req, res, next) {

    let name = req.body.name;
    deviceModel.addChip(name, function(err,results) {
      if(err) {
        return output.error(req,res,err);
      }
      output.success(req,res,"添加Chip项成功",results);
    });
};

exports.updateChip = function (req, res, next) {

    let newValue = req.body.newValue;
    let oldValue = req.body.oldValue;
    deviceModel.updateChip(newValue,oldValue,function(err,results) {
      if(err) {
        return output.error(req,res,err);
      }
      output.success(req,res,"修改Chip项成功",results);
    });
};

exports.queryModel = function (req, res, next) {

    deviceModel.queryModel(function(err,results) {
      if(err) {
        return output.error(req,res,err);
      }
      output.success(req,res,"查询Model列表成功",results);
    });
};

exports.addModel = function (req, res, next) {

    let name = req.body.name;
    deviceModel.addModel(name, function(err,results) {
      if(err) {
        return output.error(req,res,err);
      }
      output.success(req,res,"添加Model项成功",results);
    });
};

exports.updateModel = function (req, res, next) {

    let newValue = req.body.newValue;
    let oldValue = req.body.oldValue;
    deviceModel.updateModel(newValue,oldValue,function(err,results) {
      if(err) {
        return output.error(req,res,err);
      }
      output.success(req,res,"修改Model项成功",results);
    });
};

exports.querySoc = function (req, res, next) {

    deviceModel.querySoc(function(err,results) {
      if(err) {
        return output.error(req,res,err);
      }
      output.success(req,res,"查询Soc列表成功",results);
    });
};

exports.addSoc = function (req, res, next) {

    let name = req.body.name;
    deviceModel.addSoc(name, function(err,results) {
      if(err) {
        return output.error(req,res,err);
      }
      output.success(req,res,"添加Soc项成功",results);
    });
};

exports.updateSoc = function (req, res, next) {

    let newValue = req.body.newValue;
    let oldValue = req.body.oldValue;
    deviceModel.updateSoc(newValue,oldValue,function(err,results) {
      if(err) {
        return output.error(req,res,err);
      }
      output.success(req,res,"修改Soc项成功",results);
    });
};
