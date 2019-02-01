var logger = require('../../common/logger');
var regenerator = require('../file/regenerate');

var GerritModel = function() {};

GerritModel.prototype.ReGenerateByChipAndModel = function (chip, model, panel, callback) {
	regenerator.generate(chip, model, panel, function(err, result) {
		if(err){
			logger.error("ReGenerateByChipAndModel err=" + err);
			return callback(err);
		}
		callback(false, "ReGenerateByChipAndModel OK" + result);
	});
}

GerritModel.prototype.ReGenerateByChip = function (chip, callback) {
	regenerator.generateByChip(chip, function(err, result) {
		if(err){
			logger.error("ReGenerateByChip err=" + err);
			return callback(err);
		}
		callback(false, "ReGenerateByChip OK" + result);
	});
}

GerritModel.prototype.ReGenerateByModel = function (model, callback) {
	regenerator.generateByModel(model, function(err, result) {
		if(err){
			logger.error("ReGenerateByModel err=" + err);
			return callback(err);
		}
		callback(false, "ReGenerateByModel OK" + result);
	});
}

GerritModel.prototype.ReGenerateByTargetProduct = function (targetProduct, callback) {
	regenerator.generateByTargetProduct(targetProduct, function(err, result) {
		if(err){
			logger.error("ReGenerateByTargetProduct err=" + err);
			return callback(err);
		}
		callback(false, "ReGenerateByTargetProduct OK" + result);
	});
}

GerritModel.prototype.ReGenerateAll = function (callback) {
	regenerator.generateAll(function(err, result) {
		if(err){
			logger.error("ReGenerateAll err=" + err);
			return callback(err);
		}
		callback(false, "ReGenerateAll OK" + result);
	});
}

GerritModel.prototype.resetDepository = function (callback) {
	
	var shcmd = "";
	
	shcmd += "rm -rf ~/scmplatform_v3/temp_dir ; ";
	shcmd += "rm -rf ~/scmplatform_v3/git/* ; ";
	
	var spawn = require('child_process').spawn;
    var free = spawn('/bin/sh', ['-c', shcmd]); 
    
    // 捕获标准输出并将其打印到控制台 
    free.stdout.on('data', function (data) { 
		console.log("" + data); 
    }); 
    
    // 捕获标准错误输出并将其打印到控制台 
    free.stderr.on('data', function (data) { 
		console.log('stderr output:\n' + data); 
		
    }); 
    
    // 注册子进程关闭事件 
    free.on('exit', function (code, signal) { 
		console.log('child process eixt ,exit:' + code); 
		if (callback != null) 
		{
			callback(0, "执行完毕");
		}
    });
}

var gerritModel = new GerritModel();

module.exports = gerritModel;


