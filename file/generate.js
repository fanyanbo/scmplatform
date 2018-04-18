
var mysql = require('mysql');
var dbparam = {
		host     : '172.20.5.239',       
		user     : 'scmplatform',              
		password : 'scmplatform',       
		port: '3306',                   
		database: 'scm', 
	};
	
var writer = require("./writer");
	
var connection;							// 数据库连接
var infos;								// 所有机型信息表
var targets;							// 所有机型targetProduct表
var info_cnt = 0;						// 所有机型信息表计数器
var target_cnt = 0;						// targetProduct表格计算器

var i, j, k;
var generator = new Generator();

function Generator()
{
} 
Generator.prototype.generate = function(
                                machines,		// 机器列表
								version,		// 版本
								callback		// 回调函数
								)
{
	infos = new Array();
	targets = new Array();
	info_cnt = 0;
	target_cnt = 0;
	
	var type = Object.prototype.toString.call(machines);
	
	infoTxt = "";
	
	if (type == "[object Array]")
	{
		//console.log("machines param type = " + type + "\n");
		for (i in machines)
		{
			infos[i] = CreateInfo(machines[i].chip, machines[i].model);
		}
		i++;
		infos[i] = CreateInfo("", "");
		
		return doit(version, callback);
	}
	else if (type == "[object Object]")
	{
		//console.log("machines param type = " + type + "\n");
		infos[0] = CreateInfo(machines.chip, machines.model);
		infos[1] = CreateInfo("", "");
		return doit(version, callback);
	}
	else
	{
		if (callback != null)
			callback(-1, "connect database error!");
	}
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
	newinfo.list[1].tmpFileName = "";			// 生成的文件名(临时文件)
	newinfo.list[1].needConfig = true;
	newinfo.list[1].result = new Object;
	
	newinfo.list[2] = new Object;
	newinfo.list[2].type = "source_toolbox";	// 信号源工具箱
	newinfo.list[2].tmpFileName = "";			// 生成的文件名(临时文件)
	newinfo.list[2].needConfig = true;
	newinfo.list[2].result = new Object;
	
	newinfo.list[3] = new Object;
	newinfo.list[3].type = "sky_tv";			// SKY_TV
	newinfo.list[3].tmpFileName = "";			// 生成的文件名(临时文件)
	newinfo.list[3].needConfig = true;
	newinfo.list[3].result = new Object;
	
	newinfo.list[4] = new Object;
	newinfo.list[4].type = "demo";				// DEMO
	newinfo.list[4].tmpFileName = "";			// 生成的文件名(临时文件)
	newinfo.list[4].needConfig = true;
	newinfo.list[4].result = new Object;
	
	newinfo.list[5] = new Object;
	newinfo.list[5].type = "midware";			// 中间件
	newinfo.list[5].tmpFileName = "";			// 生成的文件名(临时文件)
	newinfo.list[5].needConfig = true;
	newinfo.list[5].result = new Object;
	
	newinfo.list[6] = new Object;
	newinfo.list[6].type = "prop";				// 属性列表
	newinfo.list[6].tmpFileName = "";			// 生成的文件名(临时文件)
	newinfo.list[6].needConfig = true;
	newinfo.list[6].result = new Object;
	
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
				
	connection.query(sql,function (err, result){
		if(err){
			console.log('[SELECT ERROR] - ',err.message);
			return;
		}
		
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
		sqltext = "select count(*) from configdata where chip=\"" + 
				infos[info_cnt].chip + "\"" + 
				" and model=\"" +
				infos[info_cnt].model + "\";";
	}
	else if (list[configid].type == "source_toolbox")
	{
		sqltext = "select count(*) from configdata where chip=\"" + 
				infos[info_cnt].chip + "\"" + 
				" and model=\"" +
				infos[info_cnt].model + "\";";
	}
	else if (list[configid].type == "sky_tv")
	{
		sqltext = "select count(*) from configdata where chip=\"" + 
				infos[info_cnt].chip + "\"" + 
				" and model=\"" +
				infos[info_cnt].model + "\";";
	}
	else if (list[configid].type == "demo")
	{
		sqltext = "select count(*) from configdata where chip=\"" + 
				infos[info_cnt].chip + "\"" + 
				" and model=\"" +
				infos[info_cnt].model + "\";";
	}
	else if (list[configid].type == "midware")
	{
		sqltext = "select count(*) from configdata where chip=\"" + 
				infos[info_cnt].chip + "\"" + 
				" and model=\"" +
				infos[info_cnt].model + "\";";
	}
	else if (list[configid].type == "prop")
	{
		sqltext = "select count(*) from configdata where chip=\"" + 
				infos[info_cnt].chip + "\"" + 
				" and model=\"" +
				infos[info_cnt].model + "\";";
	}
	else 
		return;


	connection.query(sqltext, function (err, result) {
		if(err)
		{
			console.log('[SELECT ERROR] - ', err.message);
			return;
		}
		
		infos[info_cnt].list[configid].result = result;
		
		//console.log(result);
		
		console.log(typeof(result));
		
		infos[info_cnt].curConfigId++;
		if (infos[info_cnt].curConfigId >= 7)
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
		var sql = "select a.engName,a.selected,b.cnName,b.gitPath from mkdata a, modules b where a.engName = b.engName and a.targetProduct=\"" + 
					curTargetProduct + "\";";
					
		connection.query(sql, function (err, result){
			if(err){
				console.log('[SELECT ERROR] - ', err.message);
				return;
			}
			
			for (j in result)
			{
				if (result[j].selected != 0)
				{
					targets[target_cnt].mklist[j] = result[j].name;
				}
			}
			
			//console.log(result);
			
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
	
	for (k in infos)
	{
		if (infos[k].chip == "")
			break;
		var temp_config_filename =  getTmpDir() + "/temp_general_config_" + infos[k].chip + "_" + infos[k].model + "_" + randValue + ".txt";
		//var temp_mk_filename =  getTmpDir() + "/temp_android_mk_" + infos[k].chip + "_" + infos[k].model + "_" + randValue + ".txt";
		
		var list = infos[k].list;
		for (var L in list)
		{
			var curitem = list[L];
			if (curitem.type == "general_config")
			{
				var result = curitem.result;
				console.log(result);
				writer.writeGeneralConfigStart(temp_config_filename);
				for (var M in result)
				{
					writer.writeGeneralConfigItem(temp_config_filename, result[M].engName, result[M].curValue, result[M].descText);
				}
				writer.writeGeneralConfigEnd(temp_config_filename);
				
			}
			else if (curitem.type == "system_settings")
			{
			}
			else if (curitem.type == "source_toolbox")
			{
			}
			else if (curitem.type == "sky_tv")
			{
			}
			else if (curitem.type == "demo")
			{
			}
			else if (curitem.type == "midware")
			{
			}
			else if (curitem.type == "prop")
			{
			}
			else 
				continue;
			
		}
		
		//infos.list[k].tmpFileName = temp_config_filename;
		/*
		
		*/
		
		
		
		
		
	}
	
	
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
	var os = require('os');
	//console.log(os.tmpdir());
	return os.tmpdir();
}


//var info = [
//		{"chip":"5S07", "model":"A2" },
//		{"chip":"5S02", "model":"15U" }
//	];

var info = {"chip":"8H87", "model":"G7200" };

generator.generate(info, "Rel6.0", null);

//generator.preview("5S02", "15U", function(errno, text1, text2){
//	if (errno == 0)
//	{
//		console.log(text2);
//	}
//});



module.exports = generator;



