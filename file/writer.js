var fs = require('fs');

function Writer(){}

Writer.prototype.writeGeneralConfigStart = function(configFileName)
{
    var startStr = '<?xml version="1.0" encoding="utf-8"?>   \n<!--  此文件是自动化配置平台根据配置值自动生成  -->   \n\n<SkyGeneralCfgs>\n';
    fs.writeFileSync(configFileName, startStr);
}

Writer.prototype.writeGeneralConfigItem = function(configFileName, key, value, desc)
{
	var str = '';
	str += '    <!--  ' + desc + '  -->  \n';
    str += '    <config' + ' name="' + key + '" value="' + value + '" />  \n\n';
    fs.appendFileSync(configFileName, str);
}

Writer.prototype.writeGeneralConfigEnd = function(configFileName)
{
    var endStr = "</SkyGeneralCfgs>\n\n\n\n";
    fs.appendFileSync(configFileName, endStr);
}

Writer.prototype.writeAndroidmkStart = function(mkFileName, playerType)
{
    var str = "\n";
	var playerTypeStr;
	
	if (playerType == "mix")
		playerTypeStr = "mix";
	else if (playerType == "intact")
		playerTypeStr = "intact";
	else
		playerTypeStr = "null";
	
	str += "#路径定义，sky_def.mk处理  \n";
	str += "COOCAAOS_PATH := $(CUSTOM_BUILD_PATH)/../\n";
	str += "$(shell rm $(TOP)/packages/sky_def.mk)\n";
	str += "$(shell ln -s $(ANDROID_BUILD_TOP)/$(COOCAAOS_PATH)/Framework/sky_def.mk $(TOP)/packages/sky_def.mk)\n";
	str += "\n";
	str += "#北京播放器选择(北京播放器的类型是自动化平台根据配置值生成)   \n";
	str += "BJ_PLAYER := " + playerTypeStr + "\n";
	str += "\n";
	str += "#酷开系统核心SDK及版本    \n";
	str += "include $(COOCAAOS_PATH)/Framework/Android.mk\n";
	str += "include $(COOCAAOS_PATH)/VersionInfo/Android.mk\n";
	str += "\n";
	str += "# 产品自选的模块    \n";
	str += "# 格式：    \n";
	str += "# include $(COOCAAOS_PATH)/xxxx/xxxx/xxxxx/Android.mk\n";
	str += "# 中间xxx部分，来自模块配置的路径    \n";
	str += "\n";
	str += "#===================================================================================\n";
	str += "#===================================================================================\n";
	str += "#=========================以下由自动化平台根据配置生成==============================\n";
	str += "#===================================================================================\n\n";
	
    fs.writeFileSync(mkFileName, str);
}

Writer.prototype.writeAndroidmkItem = function(mkFileName, value)
{
    var str = "include $(COOCAAOS_PATH)/" + value + "/Android.mk\n";
    fs.appendFileSync(mkFileName, str);
}

Writer.prototype.writeAndroidmkEnd = function(mkFileName)
{
    var str = "\n"
	str += "#===================================================================================\n"; 
	str += "#===================================================================================\n"; 
	str += "#===================================================================================\n"; 
	str += "#===================================================================================\n\n"; 
    str += "include $(COOCAAOS_PATH)/Framework/analyze.mk\n\n\n\n\n\n\n\n";
    fs.appendFileSync(mkFileName, str);
}

Writer.prototype.writeDeviceTabStart = function(tabFileName)
{
	var str = '\n';
	
	str += '### This file is automatically generated, do not edit it   \n';
	str += '### This file Recorded each device corresponding to the    \n';
	str += '### CoocaaOS customization mk,                             \n';
	str += '### As well as the corresponding product configuration     \n\n\n';

    fs.writeFileSync(tabFileName, str);
}

Writer.prototype.writeDeviceTabItem = function(tabFileName, key, value)
{
	var configItem = key + " := " + value + "\n";
    fs.appendFileSync(tabFileName, configItem);
}

Writer.prototype.writeDeviceTabEnd = function(tabFileName)
{
	var endStr = "\n";
    fs.appendFileSync(tabFileName, endStr);
}

Writer.prototype.deleteTempFiles = function()
{
	if (tempFileList != null)
	{
		for (var i in tempFileList)
		{
			var filename = tempFileList[i];
			fs.unlinkSync(filename);
		}
	}
}

var writer = new Writer();


module.exports = writer;
