
var mysql = require('mysql');
var dbparam = {
		host     : '172.20.5.239',
		user     : 'scmplatform',
		password : 'scmplatform',
		port: '3306',
		database: 'scm_test',
	};

var os = require('os');
var fs = require('fs');
var writer = require("./writer");
var settingfiles = require("./settingfiles");
var writerlog = require("./filelog");
var dbConfig = require('../models/dbConfig');

var connection;							// 数据库连接
var action_type;                        // 当前动作为预览还是git提交
var mod_callback;                       // 

var allInfos;
var infoTotal;
var infoCnt;

var allTargets;
var targetTotal;
var targetCnt;
var targetProductParam;

var tempdir = "";                       // 临时文件夹

var version = "6.0";

var tab_products;
var tab_configdata;
var tab_settingsdata;
var tab_propsdata;
var tab_mkdata;

var infoTxt = "";
var sql = ";";

var filelist;
var filecnt = 0;
var shellFileName;

var i, j, k;
var generator = new Generator();

function Generator()
{
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

function CreateFileInfo(tempName, finalName, chip, model, typeStr)
{
	var fileInfo = new Object;
    fileInfo.tempName = tempName;                   // 临时文件名
    fileInfo.finalName = finalName;                 // 最终文件名
    fileInfo.chip = chip;
    fileInfo.model = model;
    fileInfo.typeStr = typeStr;
    return fileInfo;
}

function generateFiles( 
                        chip,		    // 机芯
                        model,          // 机型
                        actionType,     // 动作类型(preview为预览)
                        callback		// 回调函数
                        )
{
	action_type = actionType;
	mod_callback = callback;

    tab_products = dbConfig.tables.products;
    tab_configdata = dbConfig.tables.configdata;
    tab_settingsdata = dbConfig.tables.settingsdata;
    tab_propsdata = dbConfig.tables.propsdata;
    tab_mkdata = dbConfig.tables.mkdata;

	infoTxt = "";
	writerlog.checkLogFile();
	
	allInfos = new Array();
	infoTotal = 0;
	infoCnt = 0;
	allTargets = new Array();
	targetTotal = 0;
    targetCnt = 0;
    
    filelist = new Array();
    filecnt = 0;

    connection = mysql.createConnection(dbparam);
	connection.connect();
	
    if (action_type ==  "preview")
    {
        allInfos[infoTotal] = CreateInfo(chip, model);
        infoTotal++;
        doit(connection, action_type);
    }
    else if (action_type == "chip_and_model")
    {
        allInfos[infoTotal] = CreateInfo(chip, model);
        infoTotal++;
        
        if (version == "6.0")
            sql = "call v60_copy_temp_to_data(\"" + chip + "\", \"" + model + "\");";
        else if (version == "6.5")
            sql = "call v65_copy_temp_to_data(\"" + chip + "\", \"" + model + "\");";
        
        console.log("同步临时数据到正式数据");
        writerlog.w("同步临时data到正式data : " + sql + "\n");
            
        connection.query(sql, function (err, result) {
        	if(err){
        		console.log('[SELECT ERROR] - ', err.message);
        		writerlog.w("查询出错: " + err.message + "\n");
        		return;
        	}
        
        	writerlog.w("SQL查询成功  \n");
        	console.log(result);
            doit(connection, action_type);
        });
    }
    else if (action_type == "chip_only")
    {
        var result = 0;
        var sql = "select model from " + tab_products + " where chip=\"" +
        			chip + "\";";
        
        writerlog.w("开始查询: " + sql + "\n");
        
        connection.query(sql, function (err, result) {
        	if(err){
        		console.log('[SELECT ERROR] - ', err.message);
        		writerlog.w("查询出错: " + err.message + "\n");
        		return;
        	}
        
        	writerlog.w("SQL查询成功 0 \n");
        	console.log(result);
        
            for (var i in result)
            {
                var curValue = result[i].model;
                allInfos[infoTotal] = CreateInfo(chip, curValue);
                infoTotal++;
            }
            doit(connection, action_type);
        });
    }
    else if (action_type == "model_only")
    {
        var result = 0;
        var sql = "select chip from " + tab_products + " where model=\"" +
        			model + "\";";
        
        writerlog.w("开始查询: " + sql + "\n");
        
        connection.query(sql, function (err, result) {
        	if(err){
        		console.log('[SELECT ERROR] - ', err.message);
        		writerlog.w("查询出错: " + err.message + "\n");
        		return;
        	}
        
        	writerlog.w("SQL查询成功 0 \n");
        	console.log(result);
        
            for (var i in result)
            {
                var curValue = result[i].chip;
                allInfos[infoTotal] = CreateInfo(curValue, model);
                infoTotal++;
            }
            doit(connection, action_type);
        });
    }
    else if (action_type == "targetProduct")
    {
        console.log("only targetProduct");
        targetProductParam = model;
        doit(connection, action_type);
    }
}

function doit(connection, callback)
{
    infoCnt = 0;
	step_query_targetProduct(connection);
}

function step_query_targetProduct(connection)
{
    if (action_type == "targetProduct")
    {
        allTargets[targetTotal] = CreateTarget(targetProductParam);
        targetTotal++;
        step_query_all_config(connection);
    }
    else
    {
        if (infoCnt >= infoTotal)
        {
            infoCnt = 0;
            step_query_all_config(connection);
        }
        else 
        {
            var result = 0;
        	var sql = "select targetProduct from " + tab_products + " where chip=\"" +
        				allInfos[infoCnt].chip + "\"" +
        				" and model=\"" +
        				allInfos[infoCnt].model + "\";";
        
        	writerlog.w("开始查询: " + sql + "\n");
        
        	connection.query(sql, function (err, result) {
        		if(err){
        			console.log('[SELECT ERROR] - ', err.message);
        			writerlog.w("查询出错: " + err.message + "\n");
        			//return;
        			infoCnt = 0;
                    step_query_all_config(connection);
        		}
        
        		writerlog.w("SQL查询成功 1 \n");
        
        		console.log(result);
        
        		var curTargetProduct = result[0].targetProduct;
        		if (typeof(curTargetProduct) == "undefined" || curTargetProduct == "")
        		{
        			// 打印错误信息
        			//return;
        			infoCnt = 0;
                    step_query_all_config(connection);
        		}
        		
        		var findIdx = targetArrayIndex(allTargets, curTargetProduct);
        		console.log("findIdx = " + findIdx + ", name = " + curTargetProduct);
                if (findIdx < 0)
                {
        		    allTargets[targetTotal] = CreateTarget(curTargetProduct);
        		    targetTotal++;
        	    }
        
                infoCnt++;
        		step_query_targetProduct(connection);
        	});
        }
    }
}

function step_query_all_config(connection)
{    
    if (action_type == "targetProduct")
    {
        targetCnt = 0;
        step_query_mkdata(connection);
        return;
    }
    
    if (infoCnt >= infoTotal)
    {
        infoCnt = 0;
        targetCnt = 0;
        step_query_mkdata(connection);
    }
    else
    {
    	var chip = allInfos[infoCnt].chip;
    	var model = allInfos[infoCnt].model;
    	var configid = allInfos[infoCnt].curConfigId;
    	var list = allInfos[infoCnt].list;
    	var sqltext;
    
    	if (list[configid].type == "general_config")
    	{
    		sqltext = "select a.engName, a.curValue, b.descText from " + tab_configdata + " a, configs b where a.engName=b.engName and a.chip=\"" +
    				allInfos[infoCnt].chip + "\"" +
    				" and a.model=\"" +
    				allInfos[infoCnt].model + "\";";
    	}
    	else if (list[configid].type == "system_settings")
    	{
    		sqltext = "select a.engName, b.cnName, b.xmlFileName, b.xmlText, b.xmlNode1, b.xmlNode2, b.level2_order, b.level3_order, b.orderId, b.descText "
    		        + " from " + tab_settingsdata + " a, settings b where a.engName = b.engName and a.chip = \"" +
    				allInfos[infoCnt].chip + "\"" +
    				" and a.model=\"" +
    				allInfos[infoCnt].model + "\";";
    	}
    	else if (list[configid].type == "prop")
    	{
    		sqltext = "select engName, curValue from " + tab_propsdata + " where chip = \"" +
    				allInfos[infoCnt].chip + "\"" +
    				" and model=\"" +
    				allInfos[infoCnt].model + "\";";
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
    
    		allInfos[infoCnt].list[configid].result = result;
    
    		//console.log(result);
    
    		console.log(typeof(result));
    
    		allInfos[infoCnt].curConfigId++;
    		if (allInfos[infoCnt].curConfigId >= 3)
    		{
    			allInfos[infoCnt].curConfigId = 0;
    			infoCnt++;
    			step_query_all_config(connection);
    		}
    		else
    		    step_query_all_config(connection);
    	});
    }
}

function step_query_mkdata(connection)
{
    targetCnt = 0;
	step_query_mkdata_item(connection);
}

function step_query_mkdata_item(connection)
{
	if (targetCnt < targetTotal)
	{
		var curTargetProduct = allTargets[targetCnt].name;
		var result = 0;
		var sql = "select a.engName,b.cnName,b.gitPath,b.category from " + tab_mkdata + " a, modules b where a.engName = b.engName and a.targetProduct=\"" +
					curTargetProduct + "\";";

		writerlog.w("开始查询: " + sql + "\n");

		connection.query(sql, function (err, result){
			if(err){
				console.log('[SELECT ERROR] - ', err.message);
				writerlog.w("查询出错: " + err.message + "\n");
				return;
			}

			writerlog.w("SQL查询成功 3 \n");

            console.log("AAAAAAAAAAAAAAAAAAAAABBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB: " + curTargetProduct);

			for (j in result)
			{
                allTargets[targetCnt].mklist[j] = result[j];
			}

		    targetCnt++;
		    step_query_mkdata_item(connection)
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
    infoCnt = 0;
    while (infoCnt < infoTotal)
    {
        writerlog.w("开始生成临时文件\n");

    	writerlog.w("机芯 = " + allInfos[infoCnt].chip + ", 机型 = " + allInfos[infoCnt].model + "\n");
    
    	var temp_config_filename = getTempGernalConfigFileName(allInfos[infoCnt].chip, allInfos[infoCnt].model);
    
    	var list = allInfos[infoCnt].list;
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
    
                filelist[filecnt++] = CreateFileInfo(temp_config_filename, "general_config.xml", allInfos[infoCnt].chip, allInfos[infoCnt].model, "general_config");
    		}
    		else if (curitem.type == "system_settings")
    		{
    		    writerlog.w("生成临时的setting文件 \n");
    		    settingfiles.generate(allInfos[infoCnt].chip, allInfos[infoCnt].model, curitem, getTmpDir(), 
    		        function(tempName, finalName, chip, model, typeStr){
    		            filelist[filecnt++] = CreateFileInfo(tempName, finalName, chip, model, typeStr);
    		        });
    		}
    		else if (curitem.type == "prop")
    		{
    		    writerlog.w("生成临时的prop文件 \n");
    		    settingfiles.generate(allInfos[infoCnt].chip, allInfos[infoCnt].model, curitem, getTmpDir(), 
    		        function(tempName, finalName, chip, model, typeStr){
    		            filelist[filecnt++] = CreateFileInfo(tempName, finalName, chip, model, typeStr);
    		        });
    		}
    		else
    			continue;
    
    	}
    	
        infoCnt++;
    }
    
    //console.log("targetTotal = " + targetTotal);
	
    targetCnt = 0;
	while (targetCnt < targetTotal)
	{
		var curtarget = allTargets[targetCnt];
		//console.log("AAAAA 2 : " + curtarget.name);
		generateMkFile(curtarget);
        targetCnt++;
	}

	if (action_type == "preview")
	{
	    console.log("preview");
	    infoCnt = 0;
	    targetCnt = 0;
	    
	    var content1 = fs.readFileSync(getTempGernalConfigFileName(allInfos[infoCnt].chip, allInfos[infoCnt].model), "utf-8");
        var content2 = fs.readFileSync(getTempMkFileName(allTargets[targetCnt].name), "utf-8");
        var content4 = fs.readFileSync(getTmpDir() + allInfos[infoCnt].chip + "_" + allInfos[infoCnt].model + "-build.prop", "utf-8");

        var content3_1 = fs.readFileSync(getTmpDir() + allInfos[infoCnt].chip + "_" + allInfos[infoCnt].model + "-setting_main.xml", "utf-8");
        var content3_2 = fs.readFileSync(getTmpDir() + allInfos[infoCnt].chip + "_" + allInfos[infoCnt].model + "-setting_guide.xml", "utf-8");
        var content3_3 = fs.readFileSync(getTmpDir() + allInfos[infoCnt].chip + "_" + allInfos[infoCnt].model + "-setting_connect.xml", "utf-8");
        var content3_4 = fs.readFileSync(getTmpDir() + allInfos[infoCnt].chip + "_" + allInfos[infoCnt].model + "-market_show_configuration.xml", "utf-8");
        var content3_5 = fs.readFileSync(getTmpDir() + allInfos[infoCnt].chip + "_" + allInfos[infoCnt].model + "-setting_general.xml", "utf-8");
        var content3_6 = fs.readFileSync(getTmpDir() + allInfos[infoCnt].chip + "_" + allInfos[infoCnt].model + "-ssc_item.xml", "utf-8");
        var content3_7 = fs.readFileSync(getTmpDir() + allInfos[infoCnt].chip + "_" + allInfos[infoCnt].model + "-setting_picture_sound.xml", "utf-8");
        var content3_8 = fs.readFileSync(getTmpDir() + allInfos[infoCnt].chip + "_" + allInfos[infoCnt].model + "-driverbase_net_config.ini", "utf-8");

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
	else        // 非预览则复制并提交文件到git
	{
        var pushret = copyFileAndCommit();
        if (pushret)
        ;
	}
	
	if (mod_callback != null)
	    mod_callback(0, "");
}

function generateMkFile(target_info)
{
    let playerType = "";
    let targetName = target_info.name;
    let mkList = target_info.mklist;

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

    filelist[filecnt++] = CreateFileInfo(mk_filename, targetName + ".mk", null, null, "mk");
}


function getTempGernalConfigFileName(chip, model)
{
    return getTmpDir() + chip + "_" + model + "-general_config" + ".xml";
}

function getTempMkFileName(targetProductName)
{
    return getTmpDir() + targetProductName + ".mk";
}

function copyFileAndCommit()
{
    //var filelist;
    //var filecnt = 0;
    
    shellFileName =  getTmpDir() + "shell_script.sh";
    
    var cmd;
	var shcmd = "#!/bin/sh\n\n";
	
	var gitdir = getGitDir(version);	// 把git仓库下载到这里,并且要加上commit-msg脚本,并且设置可执行的权限 
	
	cmd = "cd " + gitdir + " \n";
	shcmd += "echo " + cmd;
	shcmd += cmd;
	
	cmd = "git pull \n";
	shcmd += "echo " + cmd;
	shcmd += cmd;
	
    shcmd += "\n";
	
	fs.writeFileSync(shellFileName, shcmd);
	
	for (var i in filelist)
	{
	    var config_dir_relpath;
	    var config_file_relpath;
	    var fileinfo = filelist[i];
	    
	    shcmd = "";
	    
	    if (fileinfo.typeStr == "general_config")
	    {
	        config_dir_relpath = "pcfg/" + fileinfo.chip + "_" + fileinfo.model + "/config/";
    	    config_file_relpath = config_dir_relpath + fileinfo.finalName;
	    }
	    else if (fileinfo.typeStr == "build.prop")
	    {
	        config_dir_relpath = "pcfg/" + fileinfo.chip + "_" + fileinfo.model + "/prop/";
    	    config_file_relpath = config_dir_relpath + fileinfo.finalName;
	    }
	    else if (fileinfo.typeStr == "mk")
	    {
	        config_dir_relpath = "";
    	    config_file_relpath = config_dir_relpath + fileinfo.finalName;
	    }
	    else
	    {
	        config_dir_relpath = "pcfg/" + fileinfo.chip + "_" + fileinfo.model + "/settings/";
    	    config_file_relpath = config_dir_relpath + fileinfo.finalName;
	    }
	    
    	
        if (config_dir_relpath != "")
        {
    	    cmd = "mkdir -p " + config_dir_relpath + "\n";
    	    shcmd += "echo " + cmd;
    	    shcmd += cmd;
        }
    	
        cmd = "cp -f " + fileinfo.tempName + '  ' + config_file_relpath + "\n";
    	shcmd += "echo " + cmd;
    	shcmd += cmd;
    	
    	cmd = "git add " + config_file_relpath + "\n";
    	shcmd += "echo " + cmd;
    	shcmd += cmd;
    	
    	shcmd += "\n";
    	
    	fs.appendFileSync(shellFileName, shcmd);
	}
	
	shcmd = "";
	var gitbranch = getGitBranch(version);
	
	cmd = "git commit -m  '\n";
	cmd += "some_message"; //commit_msg;
	cmd += "'\n";
	
	//shcmd += "echo " + cmd;
	shcmd += cmd;
	
    // cmd = "git push origin HEAD:refs/for/" + gitbranch + "  \n\n";
    cmd = "git push 1 HEAD:refs/for/" + gitbranch + "  \n\n";
	shcmd += "echo " + cmd;
	shcmd += cmd;
	
	shcmd += "\n";
	
	fs.appendFileSync(shellFileName, shcmd);
	
	gitpush(shellFileName);
}

function gitpush(shellFileName, callback)
{
	var shcmd = "";
	
	shcmd += "sleep 0.2s ; ";
	shcmd += "sh " + shellFileName;
	
	var spawn = require('child_process').spawn;
    var free = spawn('/bin/sh', ['-c', shcmd]); 
    
    // 捕获标准输出并将其打印到控制台 
    free.stdout.on('data', function (data) { 
		console.log("" + data); 
    }); 
    
    // 捕获标准错误输出并将其打印到控制台 
    free.stderr.on('data', function (data) { 
		console.log('stderr output:\n' + data); 
		infoTxt += data;
    }); 
    
    // 注册子进程关闭事件 
    free.on('exit', function (code, signal) { 
		console.log('child process eixt ,exit:' + code); 
		if (callback != null) 
		{
			callback(code, infoTxt);
		}
		//deleteTempFiles();
    });
}

function getGitDir(systemVersion)
{
	var gitdir;
	if (systemVersion == "6.0")
        //gitdir = "/home/scmplatform/gitfiles/Rel6.0/Custom/";
        gitdir = "/home/scmplatform/temp1/";
    else
        //gitdir = "/home/scmplatform/gitfiles/Rel6.0/Custom/";
        gitdir = "/home/scmplatform/temp1/";
	return gitdir;
}

function getGitBranch(systemVersion)
{
	var gitbranch;
	if (systemVersion == "6.0")
        gitbranch = "CCOS/Rel6.0";
	else if (systemVersion == "6.0")
        gitbranch = "CCOS/Rel6.5";
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

////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////                    //////////////////////////////////////////////////
//////////////////////////////////////////        API         //////////////////////////////////////////////////
//////////////////////////////////////////                    //////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////

Generator.prototype.generate = function(chip, model, callback)
{
    generateFiles(chip, model, "chip_and_model", callback);
}

Generator.prototype.preview = function(chip, model, callback)
{
	generateFiles(chip, model, "preview", callback);
}

Generator.prototype.generateByTargetProduct = function(targetProduct, callback)
{
    generateFiles("", targetProduct, "targetProduct", callback);
}

Generator.prototype.generateByChip = function(chip, callback)
{
    generateFiles(chip, "", "chip_only", callback);
}

Generator.prototype.generateByModel = function(model, callback)
{
    generateFiles("", model, "model_only", callback);
}


function show_preview_text_test(errno, result)
{
    console.log(result.text1);
    console.log(result.text2);
    console.log(result.text3);
    console.log(result.text4);
}

function show_callback(errno, result)
{
    console.log("$$$$$$$$$$$$$$$$$$$$");
}

//generator.generate("6S57", "K5S",  null);
//generator.generateByModel("E6000", null);
//generator.preview("5S02", "15U",  show_preview_text_test);
//generator.generateByTargetProduct("p201", show_callback);





module.exports = generator;

