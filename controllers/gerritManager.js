var config = require('../config/config');
var logger = require('../common/logger');
var output = require('../common/output');
var gerritModel = require('../models/gerritModel');

//删除左右两端的空格
function trim(str)
{
	return str.replace(/(^\s*)|(\s*$)/g, "");
}

exports.ReGenerateByChipAndModel = function (req, res, next) {
	var chip = req.body.chip;
    var model = req.body.model;
	var panel = req.body.panel;
	chip = trim(chip);
	model = trim(model);
	panel = trim(panel);
	if (panel == "")
		panel = "0";
	
	gerritModel.ReGenerateByChipAndModel(chip, model, panel, function(err, results) {
		if(err) {
			return output.error(req, res, err);
		}
		output.success(req, res, "重新生成成功",results);
	});
}

exports.ReGenerateByChip = function (req, res, next) {
	var chip = req.body.chip;
	chip = trim(chip);
	
	gerritModel.ReGenerateByChip(chip, function(err, results) {
		if(err) {
			return output.error(req, res, err);
		}
		output.success(req, res, "重新生成成功",results);
	});
}

exports.ReGenerateByModel = function (req, res, next) {
    var model = req.body.model;
	model = trim(model);
	
	gerritModel.ReGenerateByModel(model, function(err, results) {
		if(err) {
			return output.error(req, res, err);
		}
		output.success(req, res, "重新生成成功",results);
	});
}

exports.ReGenerateByTargetProduct = function (req, res, next) {
	var targetProduct = req.body.targetProduct;
	targetProduct = trim(targetProduct);
	
	gerritModel.ReGenerateByTargetProduct(targetProduct, function(err, results) {
		if(err) {
			return output.error(req, res, err);
		}
		output.success(req, res, "重新生成成功",results);
	});
}

exports.ReGenerateAll = function (req, res, next) {
	gerritModel.ReGenerateAll(function(err, results) {
		if(err) {
			return output.error(req, res, err);
		}
		output.success(req, res, "重新生成成功",results);
	});
}

exports.resetDepository = function (req, res, next) {
	gerritModel.resetDepository(function(err, results) {
		if(err) {
			return output.error(req, res, err);
		}
		output.success(req, res, "本地仓库清理复位修复成功",results);
	});
}


