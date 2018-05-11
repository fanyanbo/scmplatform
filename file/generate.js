
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
var action_type;                        // 当前动作为预览还是git提交
var mod_callback;
var baseinfo;							// 信息表(包括general_config)
var targetinfo;							// 所有机型targetProduct表
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
	generateFiles(chip, model, version, "preview", callback);
}

function generateFiles( chip,		    // 机芯
                        model,          // 机型
                        version,		// 版本
                        actionType,     // 动作类型(preview为预览)
                        callback		// 回调函数
                        )
{

	action_type = actionType;
	mod_callback = callback;

	infoTxt = "";

	writerlog.checkLogFile();

	//console.log("machines param type = " + type + "\n");
    baseinfo = CreateInfo(chip, model);
    return doit(version, actionType);
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
	var newtarget = new Object;
    newtarget.name = targetProduct;
    newtarget.mklist = new Array;
    newtarget.mkFileName = "";
    return newtarget;
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
				callback  			// 回调函数
								)
{
	connection = mysql.createConnection(dbparam);

	connection.connect();

	step_query_targetProduct(connection);
}

function step_query_targetProduct(connection)
{
	var result = 0;
	var sql = "select targetProduct from products where chip=\"" +
				baseinfo.chip + "\"" +
				" and model=\"" +
				baseinfo.model + "\";";

	writerlog.w("开始查询: " + sql + "\n");

	connection.query(sql, function (err, result){
		if(err){
			console.log('[SELECT ERROR] - ', err.message);
			writerlog.w("查询出错: " + err.message + "\n");
			return;
		}

		writerlog.w("SQL查询成功 1 \n");

		console.log(result);

		var curTargetProduct = result[0].targetProduct;
		if (typeof(curTargetProduct) == "undefined" || curTargetProduct == "")
		{
			// 打印错误信息
			return;
		}

		targetinfo = CreateTarget(curTargetProduct);

		step_query_all_config(connection);

	});
}

function step_query_all_config(connection)
{
	var chip = baseinfo.chip;
	var model = baseinfo.model;
	var configid = baseinfo.curConfigId;
	var list = baseinfo.list;
	var sqltext;

	if (list[configid].type == "general_config")
	{
		sqltext = "select a.engName, a.curValue, b.descText from configdata a, configs b where a.engName=b.engName and a.chip=\"" +
				baseinfo.chip + "\"" +
				" and a.model=\"" +
				baseinfo.model + "\";";
	}
	else if (list[configid].type == "system_settings")
	{
		sqltext = "select a.engName, b.cnName, b.xmlFileName, b.xmlText, b.xmlNode1, b.xmlNode2, b.level2_order, b.level3_order, b.orderId, b.descText "
		        + " from settingsdata a, settings b where a.engName = b.engName and a.chip = \"" +
				baseinfo.chip + "\"" +
				" and a.model=\"" +
				baseinfo.model + "\";";
	}
	else if (list[configid].type == "prop")
	{
		sqltext = "select engName, curValue from propsdata where chip = \"" +
				baseinfo.chip + "\"" +
				" and model=\"" +
				baseinfo.model + "\";";
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

		writerlog.w("SQL查询成功 2 \n");

		baseinfo.list[configid].result = result;

		//console.log(result);

		console.log(typeof(result));

		baseinfo.curConfigId++;
		if (baseinfo.curConfigId >= 3)
		{
			baseinfo.curConfigId = 0;
			step_query_mkdata(connection);
		}
		else
		    step_query_all_config(connection);
	});

}

function step_query_mkdata(connection)
{
	step_query_mkdata_item(connection);
}

function step_query_mkdata_item(connection)
{
	if (true)
	{
		var curTargetProduct = targetinfo.name;
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

			writerlog.w("SQL查询成功 3 \n");

			for (j in result)
			{
                targetinfo.mklist[j] = result[j];
			}

			//console.log(result[j]);

			console.log("***********************\n");
		    connection.end();
		    generate_files();
		});
	}
	else
	{

	}
}

function generate_files()
{
	var randValue = Math.ceil(1000 * Math.random());

	writerlog.w("开始生成临时文件\n");

	writerlog.w("机芯 = " + baseinfo.chip + ", 机型 = " + baseinfo.model + "\n");

	var temp_config_filename = getTempGernalConfigFileName(baseinfo.chip, baseinfo.model);

	var list = baseinfo.list;
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
		    settingfiles.generate(baseinfo.chip, baseinfo.model, curitem, getTmpDir());
		}
		else if (curitem.type == "prop")
		{
		    writerlog.w("生成临时的prop文件 \n");
		    settingfiles.generate(baseinfo.chip, baseinfo.model, curitem, getTmpDir());
		}
		else
			continue;

	}

	if (true)
	{
		var curtarget = targetinfo;

		console.log(curtarget);
		generateMkFile(curtarget);
	}

	if (action_type == "preview")
	{
	    console.log("preview");
	    var content1 = fs.readFileSync(getTempGernalConfigFileName(baseinfo.chip, baseinfo.model), "utf-8");
        var content2 = fs.readFileSync(getTempMkFileName(targetinfo.name), "utf-8");
        var content4 = fs.readFileSync(getTmpDir() + baseinfo.chip + "_" + baseinfo.model + "-build.prop", "utf-8");

        var content3_1 = fs.readFileSync(getTmpDir() + baseinfo.chip + "_" + baseinfo.model + "-setting_main.xml", "utf-8");
        var content3_2 = fs.readFileSync(getTmpDir() + baseinfo.chip + "_" + baseinfo.model + "-setting_guide.xml", "utf-8");
        var content3_3 = fs.readFileSync(getTmpDir() + baseinfo.chip + "_" + baseinfo.model + "-setting_connect.xml", "utf-8");
        var content3_4 = fs.readFileSync(getTmpDir() + baseinfo.chip + "_" + baseinfo.model + "-market_show_configuration.xml", "utf-8");
        var content3_5 = fs.readFileSync(getTmpDir() + baseinfo.chip + "_" + baseinfo.model + "-setting_general.xml", "utf-8");
        var content3_6 = fs.readFileSync(getTmpDir() + baseinfo.chip + "_" + baseinfo.model + "-ssc_item.xml", "utf-8");
        var content3_7 = fs.readFileSync(getTmpDir() + baseinfo.chip + "_" + baseinfo.model + "-setting_picture_sound.xml", "utf-8");
        var content3_8 = fs.readFileSync(getTmpDir() + baseinfo.chip + "_" + baseinfo.model + "-driverbase_net_config.ini", "utf-8");

        var content3 = content3_1 + content3_2 + content3_3 + content3_4 + content3_5 + content3_6 + content3_7 + content3_8 ;
        if (mod_callback != null)
        {
            var preview_result = new Object;
            preview_result.text1 = content1;
            preview_result.text2 = content2;
            preview_result.text3 = content3;
            preview_result.text4 = content4;
            mod_callback(0, preview_result);
        }
	}
	else
	{

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



//generator.generate("5S02", "15U", "Rel6.0", null);
//generator.preview("5S02", "15U", "Rel6.0", show_preview_text_test);


function show_preview_text_test(errno, result)
{
    console.log(result.text1);
    console.log(result.text2);
    console.log(result.text3);
    console.log(result.text4);
}


module.exports = generator;
