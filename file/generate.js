
var mysql = require('mysql');
var dbparam = {
		host     : '172.20.5.239',       
		user     : 'scmplatform',              
		password : 'scmplatform',       
		port: '3306',                   
		database: 'scm', 
	};
	
var os = require('os');
var fs = require('fs');
var writer = require("./writer");
var settingfiles = require("./settingfiles");
var writerlog = require("./filelog");

var connection;							// 数据库连接
var action_type;                        // 当前动作为
var infos;								// 所有机型信息表
var targets;							// 所有机型targetProduct表
var info_cnt = 0;						// 所有机型信息表计数器
var target_cnt = 0;						// targetProduct表格计算器
var tempdir = "";                       // 临时文件夹

var i, j, k;
var generator = new Generator();

function Generator()
{
} 

Generator.prototype.generate = function(
                                chip,		    // 机芯
								model,		    // 机型
								version,		// 版本
								callback		// 回调函数
								)
{
    generateFiles(chip, model, version, "gitpush", callback);
}

Generator.prototype.preview = function(chip, model, version, callback)
{
	//generateFiles(chip, model, version, "preview", callback);
}

function generateFiles( chip,		    // 机芯
                        model,          // 机型
                        version,		// 版本
                        actionType,     // 动作类型(preview为预览)
                        callback		// 回调函数
                        )
{
	infos = new Array();
	targets = new Array();
	info_cnt = 0;
	target_cnt = 0;
	
	var type = Object.prototype.toString.call(machines);
	
	infoTxt = "";
	
	writerlog.checkLogFile();
	
	//console.log("machines param type = " + type + "\n");
    infos[0] = CreateInfo(chip, model);
    infos[1] = CreateInfo("", "");
    return doit(version, actionType, callback);
}


function CreateInfo(chip, model)
{
	var newinfo = new Object;
	newinfo.chip = chip;						// 机芯
	newinfo.model = model;						// 机型
	newinfo.targetProduct = "";					// 对应的机芯机型的targetProduct
	newinfo.curConfigId = 0;					// 当前已处理好configID
	newinfo.list = new Array();
	
	newinfo.list[0] = new Object;
	newinfo.list[0].type = "general_config";	// general_config
	newinfo.list[0].tmpFileName = "";			// 生成的文件名(临时文件)
	newinfo.list[0].needConfig = true;
	newinfo.list[0].result = new Object;
	
	newinfo.list[1] = new Object;
	newinfo.list[1].type = "system_settings";	// 系统设置
	newinfo.list[1].tmpFileName = new Array;    // 生成的文件名(临时文件)
	newinfo.list[1].needConfig = true;
	newinfo.list[1].result = new Object;

	newinfo.list[2] = new Object;
	newinfo.list[2].type = "prop";				// 属性列表
	newinfo.list[2].tmpFileName = "";			// 生成的文件名(临时文件)
	newinfo.list[2].needConfig = true;
	newinfo.list[2].result = new Object;
	
	return newinfo;
} 

function CreateTarget(targetProduct)
{
	var idx = targetArrayIndex(targets, targetProduct);
	if (idx < 0)
	{
		var newtarget = new Object;
		newtarget.name = targetProduct;
		newtarget.mklist = new Array;
		newtarget.mkFileName = "";
		return newtarget;
	}
	return 0;
}

function targetArrayIndex(arr, targetProduct)
{
	var i = arr.length;
	while (i--)
	{
		if (i < 0)
			break;
		if (arr[i].name == targetProduct) {
			return i;
		}
	}
	return -1;
}

function doit(	systemVersion,		// 系统版本
				callback 			// 回调函数
								)
{
	info_cnt = 0;
	connection = mysql.createConnection(dbparam);
	
	connection.connect();
	
	step_query_targetProduct(connection);
}

function step_query_targetProduct(connection)
{
	var result = 0;
	var sql = "select targetProduct from products where chip=\"" + 
				infos[info_cnt].chip + "\"" + 
				" and model=\"" + 
				infos[info_cnt].model + "\";";
				
	writerlog.w("开始查询: " + sql + "\n");
				
	connection.query(sql,function (err, result){
		if(err){
			console.log('[SELECT ERROR] - ', err.message);
			writerlog.w("查询出错: " + err.message + "\n");
			return;
		}
		
		writerlog.w("SQL查询成功\n");
		
		var curTargetProduct = result[0].targetProduct;
		if (typeof(curTargetProduct) == "undefined" || curTargetProduct == "")
		{
			// 打印错误信息
			return;
		}
		
		var newTarget = CreateTarget(curTargetProduct);
		if (typeof(newTarget) == "object")
		{
			targets[targets.length] = newTarget;			// 把targetProduct存起来
		}
		
		step_query_all_config(connection);
		
	});
}

function step_query_all_config(connection)
{
	var chip = infos[info_cnt].chip;
	var model = infos[info_cnt].model;
	var configid = infos[info_cnt].curConfigId;
	var list = infos[info_cnt].list;
	var sqltext;
	
	if (chip == "")
	{
		step_query_mkdata(connection);
		return;
	}
	
	if (list[configid].type == "general_config")
	{
		sqltext = "select a.engName, a.curValue, b.descText from configdata a, configs b where a.engName=b.engName and a.chip=\"" + 
				infos[info_cnt].chip + "\"" + 
				" and a.model=\"" +
				infos[info_cnt].model + "\";";
	}
	else if (list[configid].type == "system_settings")
	{
		sqltext = "select a.engName, b.cnName, b.xmlFileName, b.xmlText, b.xmlNode1, b.xmlNode2, b.level2_order, b.level3_order, b.orderId, b.descText " 
		        + " from settingsdata a, settings b where a.engName = b.engName and a.chip = \"" + 
				infos[info_cnt].chip + "\"" + 
				" and a.model=\"" +
				infos[info_cnt].model + "\";";
	}
	else if (list[configid].type == "prop")
	{
		sqltext = "select engName, curValue from propsdata where chip = \"" + 
				infos[info_cnt].chip + "\"" + 
				" and model=\"" +
				infos[info_cnt].model + "\";";
	}
	else 
		return;

    writerlog.w("开始查询: " + sqltext + "\n");

	connection.query(sqltext, function (err, result) {
		if(err)
		{
			console.log('[SELECT ERROR] - ', err.message);
			writerlog.w("查询出错: " + err.message + "\n");
			return;
		}
		
		writerlog.w("SQL查询成功\n");
		
		infos[info_cnt].list[configid].result = result;
		
		//console.log(result);
		
		console.log(typeof(result));
		
		infos[info_cnt].curConfigId++;
		if (infos[info_cnt].curConfigId >= 3)
		{
			infos[info_cnt].curConfigId = 0;
			info_cnt++;
		}
		
		step_query_all_config(connection);
		
	});

}

function step_query_mkdata(connection)
{
	step_query_mkdata_item(connection);
}

function step_query_mkdata_item(connection)
{
	if (target_cnt < targets.length)
	{
		var curTargetProduct = targets[target_cnt].name;
		var result = 0;
		var sql = "select a.engName,b.cnName,b.gitPath,b.category from mkdata a, modules b where a.engName = b.engName and a.targetProduct=\"" + 
					curTargetProduct + "\";";
					
		writerlog.w("开始查询: " + sql + "\n");
					
		connection.query(sql, function (err, result){
			if(err){
				console.log('[SELECT ERROR] - ', err.message);
				writerlog.w("查询出错: " + err.message + "\n");
				return;
			}
			
			writerlog.w("SQL查询成功\n");
			
			for (j in result)
			{
                targets[target_cnt].mklist[j] = result[j];
			}
			
			//console.log(result[j]);
			
			target_cnt++;
			
			step_query_mkdata_item(connection);
		
		});
	}
	else
	{
		console.log("***********************\n");
		connection.end();
		generate_files();
	}
}

function generate_files()
{
	var randValue = Math.ceil(1000 * Math.random());
	
	writerlog.w("开始生成临时文件\n");
	
	for (k in infos)
	{
		if (infos[k].chip == "")
			break;
			
		writerlog.w("机芯 = " + infos[k].chip + ", 机型 = " + infos[k].model + "\n");
			
		var temp_config_filename = getTempGernalConfigFileName(infos[k].chip, infos[k].model);
		
		var list = infos[k].list;
		for (var L in list)
		{   
			var curitem = list[L];
			var result = curitem.result;
			
			if (curitem.type == "general_config")
			{
				//console.log(result);
				writerlog.w("生成临时的general_config \n");
				
				writer.writeGeneralConfigStart(temp_config_filename);
				for (var M in result)
				{
					writer.writeGeneralConfigItem(temp_config_filename, result[M].engName, result[M].curValue, result[M].descText);
				}
				writer.writeGeneralConfigEnd(temp_config_filename);
				
			}
			else if (curitem.type == "system_settings")
			{
			    writerlog.w("生成临时的setting文件 \n");
			    settingfiles.generate(infos[k].chip, infos[k].model, curitem, getTmpDir());
			}
			else if (curitem.type == "prop")
			{
			    writerlog.w("生成临时的prop文件 \n");
			    settingfiles.generate(infos[k].chip, infos[k].model, curitem, getTmpDir());
			}
			else 
				continue;
			
		}
		
		//infos.list[k].tmpFileName = temp_config_filename;
		/*
		
		*/
	}
	
	for (x in targets)
	{
		var curtarget = targets[x];
		
		console.log(curtarget);
		generateMkFile(curtarget);
	}
	
	
}


function generateMkFile(targetinfo)
{
    let playerType = "";
    let targetName = targetinfo.name;
    let mkList = targetinfo.mklist;
    
    var mk_filename = getTempMkFileName(targetName);
    
    writerlog.w("生成临时的mk文件 " + mk_filename + "\n");
    
	for (let i in mkList)
	{
		var category = mkList[i].category;
		if (category == "PlayerLibrary")
		{
			playerType = mkList[i].gitPath;
		}
	}
	
	console.log("playerType = " + playerType);
	
	writer.writeAndroidmkStart(mk_filename, playerType);
	for (var k in mkList)
	{
		var category = mkList[k].category;
		if (category != "PlayerLibrary")
		{
			//console.log("mk: " + JSON.stringify(mkList[k]));
			var path = mkList[k].gitPath;
			writer.writeAndroidmkItem(mk_filename, path);
		}
	}
	writer.writeAndroidmkEnd(mk_filename);
	
}


function getTempGernalConfigFileName(chip, model)
{
    return getTmpDir() + chip + "_" + model + "-general_config" + ".xml";
}

function getTempMkFileName(targetProductName)
{
    return getTmpDir() + targetProductName + ".mk";
}

function gitpush(
            systemVersion,                      // 系统版本，例如 'Rel6.0' 
            targetProduct,                      // target_product的值, 例如 'full_sky828_5s02'    
            chip,                               // 机芯, 例如 '5S02' 
            model,                              // 机型, 例如 'A2'  
            deviceTabTempFileName,              // device_tab.mk 临时文件名 
            mkTempFileName,                     // mk临时文件名 
            configTempFileName                  // config临时文件名 
            )
{
	var git = require("./gitcommit");
	git.push(systemVersion, targetProduct, chip, model, deviceTabTempFileName, mkTempFileName, configTempFileName);
	//deleteTempFile(deviceTabTempFileName, mkTempFileName, configTempFileName);
}


function getGitDir(systemVersion)
{
	var gitdir;
	if (systemVersion == "Rel6.0")
        gitdir = "/home/scmplatform/gitfiles/Rel6.0/Custom/";
    else
        gitdir = "/home/scmplatform/gitfiles/Rel6.0/Custom/";
	return gitdir;
}

function getGitBranch(systemVersion)
{
	var gitbranch;
	if (systemVersion == "Rel6.0")
        gitbranch = "CCOS/Rel6.0";
	else
        gitbranch = "CCOS/Rel6.0";
    return gitbranch;
}

function getTmpDir()
{
    if (tempdir == "")
    {        
        let date = new Date();
        let year = date.getFullYear();
        let month = date.getMonth()+1;
        let day = date.getDate();
        let hour = date.getHours();
        let minute = date.getMinutes();
        let second = date.getSeconds();
        let curtimestr = "scmplatform_" + year + "" + month + "" + day + "-" + hour + "" + minute + "" + second;
        let randValue = Math.ceil(1000 * Math.random());
        
        console.log(curtimestr + "_" + randValue);

        tempdir = os.tmpdir();
        if (os.platform() == "win32")
        {
            tempdir += "\\";
            tempdir += curtimestr + "_" + randValue;
            
            fs.mkdirSync(tempdir);
            tempdir += "\\";
            
        }
        else
        {
            tempdir += "/";
            tempdir += curtimestr + "_" + randValue;
            
            fs.mkdirSync(tempdir);
            tempdir += "/";
        }
        
        writerlog.w("临时存放文件夹为 " + tempdir + "\n");
    }
	return tempdir;
}


//var info = [
//		{"chip":"5S07", "model":"A2" },
//		{"chip":"5S02", "model":"15U" }
//	];

var info = {"chip":"5S02", "model":"15U" };

generator.generate(info, "Rel6.0", null);

//generator.preview("5S02", "15U", function(errno, text1, text2){
//	if (errno == 0)
//	{
//		console.log(text2);
//	}
//});



module.exports = generator;



