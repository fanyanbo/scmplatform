// TO-DO  
// 1. return 的处理
// 2. 排序

var version = require("./ccosversion");
var test_flag = 0;

var mysql = require('mysql');
var dbparam = {
		host     : '172.20.217.11',
		user     : 'admin',
		password : 'xtrjs',
		port: '3306',
		database: 'scmv3_test',
	};

var os = require('os');
var fs = require('fs');
var writer = require("./writer");
var gerrit = require("./gerrit");
var settingfiles = require("./settingfiles");
var writerlog = require("./filelog");
var dbConfig = require('../models/dbConfig');

var connection;							// 数据库连接
var action_type;                        // 当前动作为预览还是git提交
var mod_callback;                       // 回调函数

var allInfos;                           // 记录所有机芯机型信息
var infoTotal;                          // 机芯机型信息总数
var infoCnt;                            // 机芯机型的counter计数器

var allTargets;                         // 记录target products信息
var targetTotal;                        // target products信息总数
var targetCnt;                          // target products的counter计数器
var targetProductParam;                 // 如果产生文件时只传了target products一个参数，这里保存这个参数值

var tempdir = "";                       // 临时文件夹

var tab_products;                       // 数据库中,产品表的表名
var tab_configdata;                     // 数据库中,配置数据表名
var tab_settingsdata;                   // 数据库中,设置数据表名
var tab_propsdata;                      // 数据库中,属性数据表名
var tab_mkdata;                         // 数据库中,mk数据表名
var tab_settings;                       // 数据库中,设置表名
var tab_modifyhistory;					// 数据库中,修改历史表

var infoTxt = "";
var sql = ";";
var commitText = "";					// 提交给gerrit时的注释

var filelist;                           // 产生的文件列表
var filetotal = 0;                      // 产生的文件列表数量计数
var shellFileName;

var product_maps;                       // 所有targetProduct与机芯机型的对应表
var maps_total = 0;                     // 对应表总数

var i, j, k;
var generator = new Generator();

function Generator(){}

function CreateInfo(chip, model, panel)
{
	var newinfo = new Object;
	newinfo.chip = chip;						// 机芯
	newinfo.model = model;						// 机型
	newinfo.panel = panel;                      // 屏幕大小
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

	return newinfo;
}

function CreateTarget(targetProduct)
{
	var newtarget = new Object;
    newtarget.name = targetProduct;
    newtarget.mklist = new Array;
    newtarget.mkFileName = "";
    newtarget.props = new Array;
    newtarget.propsFileName = "";
    return newtarget;
}

function CreateProductMap(targetProduct)
{
    var newtarget = new Object;
    newtarget.name = targetProduct;
    newtarget.chipModelList = new Array;
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

function chipModelArrayIndex(arr, chip, model)
{
    var i = arr.length;
	while (i--)
	{
		if (i < 0)
			break;
		if (arr[i].chip == chip && arr[i].model == model) {
			return i;
		}
	}
	return -1;
}

function CreateFileInfo(tempName, finalName, chip, model, panel, typeStr)
{
	var fileInfo = new Object;
    fileInfo.tempName = tempName;                   // 临时文件名
    fileInfo.finalName = finalName;                 // 最终文件名
    fileInfo.chip = chip;
    fileInfo.model = model;
    fileInfo.panel = panel;
    fileInfo.typeStr = typeStr;
    return fileInfo;
}

function generateFiles( 
                        chip,		    // 机芯
                        model,          // 机型
                        panel,          // 屏幕尺寸
                        actionType,     // 动作类型(preview为预览)
                        tempflag,       // 是否使用临时表
                        callback		// 回调函数
                        )
{
	action_type = actionType;
	mod_callback = callback;

    if (test_flag)
        dbparam.database = "scmv3_test";
    else
        dbparam.database = "scmv3";
        
    //dbparam.host = config.mysql.host;

    tab_products = dbConfig.tables.products;
    tab_propsdata = dbConfig.tables.propsdata;
    if (tempflag != 0)
    {
        tab_configdata = dbConfig.tables.configdata_temp;
        tab_settingsdata = dbConfig.tables.settingsdata_temp;
        tab_settings = dbConfig.tables.settings;
    }
    else
    {
        tab_configdata = dbConfig.tables.configdata;
        tab_settingsdata = dbConfig.tables.settingsdata;
        tab_settings = dbConfig.tables.settings;
    }
    tab_mkdata = dbConfig.tables.mkdata;
	tab_modifyhistory = dbConfig.tables.modifyhistory;

	infoTxt = "";
	writerlog.checkLogFile();
	
	infoTxt = "";
	tempdir = "";
	commitText = "";
	
	allInfos = new Array();
	infoTotal = 0;
	infoCnt = 0;
	allTargets = new Array();
	targetTotal = 0;
    targetCnt = 0;
    
    filelist = new Array();
    filetotal = 0;
    
    product_maps = new Array();
    maps_total = 0;

	writerlog.w("=============================================================================\n");
	
    connection = mysql.createConnection(dbparam);
	connection.connect();
	
    if (action_type ==  "preview")
    {
        allInfos[infoTotal] = CreateInfo(chip, model, panel);
        infoTotal++;
        doit(connection, action_type);
    }
    else if (action_type == "chip_and_model")
    {
        allInfos[infoTotal] = CreateInfo(chip, model, panel);
        infoTotal++;
		
        if (version == "6.1")
            sql = "select current_time;";//"call v60_copy_temp_to_data(\"" + chip + "\", \"" + model + "\", " + panel + ");";
        else if (version == "6.2")
            sql = "select current_time;";//"call v62_copy_temp_to_data(\"" + chip + "\", \"" + model + "\", " + panel + ");";
        else if (version == "7.0")
            sql = "select current_time;";//"call v70_copy_temp_to_data(\"" + chip + "\", \"" + model + "\", " + panel + ");";
        
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
			
			// 查修改记录信息
			sql = 'select reason,content,userName from ' + tab_modifyhistory + 
					' where chip="' + chip + 
					'" and model="' + model + 
					'" and panel=' + panel + 
					' order by modifyTime desc limit 1;' ;
					
			console.log("查询修改记录表,用于查找修改信息");
			writerlog.w("查询修改记录表,用于查找修改信息,语句 : " + sql + "\n");
			connection.query(sql, function (err, result) {
				if(err){
					console.log('[SELECT ERROR] - ', err.message);
					writerlog.w("查询出错: " + err.message + "\n");
					return;
				}	
				writerlog.w("SQL查询成功  \n");
				console.log(result);
				
				var reason = "";
				var content = "";
				var userName = "";
				var panelText = "";
				if (panel == 0)
					panelText = "所有";
				else
					panelText = String(panel + "寸");
				
				for (var i in result)
				{
					reason = result[i].reason;
					content = result[i].content;
					userName = result[i].userName;
					break;
				}
				
				if (reason != "")
					commitText += "【解决问题】：" + reason + "\n\n";
				else
					commitText += "【解决问题】：" + "配置平台修改配置,机芯机型: " + chip + "_" + model + ", 屏幕尺寸: " + panelText + "\n\n";;
				commitText += "【操作员】：" + userName + "\n";
				commitText += "【测试注意】：setting\n";
				commitText += "【测试结果】：未测试\n";
				commitText += "【BUG_ID】：no\n";
				commitText += "【操作类型】：";
				if (content != "")
					commitText += parseModifyContent(content);
				else 
					commitText += "无\n";
				commitText += "【重要程度】：重要\n";
				commitText += "【影响产品】：" + chip + "_" + model + ", 屏幕尺寸: " + panelText + "\n\n";
				
				doit(connection, action_type);
			});
        });
    }
    else if (action_type == "chip_only")
    {
        var result = 0;
		
		commitText += "【解决问题】：" + "修改了机芯，生成该机芯的所有机型的配置文件: " + chip + "\n\n";
		commitText += "【测试注意】：setting\n";
		commitText += "【测试结果】：未测试\n";
		commitText += "【BUG_ID】：no\n";
		commitText += "【操作类型】：修改了机芯\n";
		commitText += "【重要程度】：重要\n";
		commitText += "【影响产品】：" + "所有机芯为\"" + chip + "\"的机型都受影响\n\n";
				
        sql = "select model, panel from " + tab_products + " where chip=\"" +
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
                var curPanel = result[i].panel;
                allInfos[infoTotal] = CreateInfo(chip, curValue, curPanel);
                infoTotal++;
            }
            doit(connection, action_type);
        });
    }
    else if (action_type == "model_only")
    {
        var result = 0;
		
		commitText += "【解决问题】：" + "修改了机型，不管什么机芯，该机型的所有机型的配置文件都生成: " + model + "\n\n";
		commitText += "【测试注意】：setting\n";
		commitText += "【测试结果】：未测试\n";
		commitText += "【BUG_ID】：no\n";
		commitText += "【操作类型】：修改了机型\n";
		commitText += "【重要程度】：重要\n";
		commitText += "【影响产品】：" + "所有机型为\"" + model + "\"的都受影响\n\n";
		
        sql = "select chip, panel from " + tab_products + " where model=\"" +
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
                var curPanel = result[i].panel;
                allInfos[infoTotal] = CreateInfo(curValue, model, curPanel);
                infoTotal++;
            }
            doit(connection, action_type);
        });
    }
    else if (action_type == "targetProduct")
    {
        console.log("only targetProduct");
		
		commitText += "【解决问题】：" + "修改了targetProduct，所有\"" + model + "\"的机芯机型的配置文件都生成\n\n";
		commitText += "【测试注意】：setting\n";
		commitText += "【测试结果】：未测试\n";
		commitText += "【BUG_ID】：no\n";
		commitText += "【操作类型】：修改了targetProduct\n";
		commitText += "【重要程度】：重要\n";
		commitText += "【影响产品】：" + "所有targetProduct为\"" + model + "\"的机芯机型都受影响\n\n";
		
        targetProductParam = model;
        doit(connection, action_type);
    }
    else if (action_type == "generate_all")
    {
        var result = 0;
		
		commitText += "【解决问题】：" + "全部机芯机型的配置文件重新生成\n\n";
		commitText += "【测试注意】：setting\n";
		commitText += "【测试结果】：未测试\n";
		commitText += "【BUG_ID】：no\n";
		commitText += "【操作类型】：全部机芯机型的配置文件重新生成\n";
		commitText += "【重要程度】：重要\n";
		commitText += "【影响产品】：" + "所有机芯机型都受影响\n\n";
		
        sql = "select chip, model, panel from " + tab_products + " ;";
        
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
                var curChip = result[i].chip;
                var curModel = result[i].model;
                var curPanel = result[i].panel;
                allInfos[infoTotal] = CreateInfo(curChip, curModel, curPanel);
                infoTotal++;
            }
            doit(connection, action_type);
        });
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
        	sql = "select targetProduct from " + tab_products + " where chip=\"" +
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
    	var panel = allInfos[infoCnt].panel;
    	var configid = allInfos[infoCnt].curConfigId;
    	var list = allInfos[infoCnt].list;
    
    	if (list[configid].type == "general_config")
    	{
    		sql = "select a.engName, a.curValue, b.descText from " + tab_configdata + " a, configs b where a.engName=b.engName and a.chip=\"" +
    				allInfos[infoCnt].chip + "\"" +
    				" and a.model=\"" +
    				allInfos[infoCnt].model + "\"" + 
    				" and a.panel=" +
    				allInfos[infoCnt].panel + ";";
    				
    	}
    	else if (list[configid].type == "system_settings")
    	{
    		sql = "select a.engName, b.cnName, b.xmlFileName, b.xmlText, b.xmlNode1, b.xmlNode2, b.level2_order, b.level3_order, b.orderId, b.descText "
    		        + " from " + tab_settingsdata + " a, " + tab_settings + " b where a.engName = b.engName and a.chip = \"" +
    				allInfos[infoCnt].chip + "\"" +
    				" and a.model=\"" +
    				allInfos[infoCnt].model + "\"" + 
    				" and a.panel=" +
    				allInfos[infoCnt].panel + ";";
    	}
    	else
    		return;
    
        writerlog.w("开始查询: " + sql + "\n");
    
    	connection.query(sql, function (err, result) {
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
    		if (allInfos[infoCnt].curConfigId >= 2)
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
		sql = "select a.engName,b.cnName,b.gitPath,b.category from " + tab_mkdata + " a, modules b where a.engName = b.engName and a.targetProduct=\"" +
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
	    targetCnt = 0;
	    step_query_prop_data(connection);
	}
}

function step_query_prop_data(connection)
{
    if (targetCnt < targetTotal)
	{
		var curTargetProduct = allTargets[targetCnt].name;
		var result = 0;
		sql = "select engName,curValue from " + tab_propsdata + " where targetProduct=\"" +
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
                allTargets[targetCnt].props[j] = result[j];
			}

		    targetCnt++;
		    step_query_prop_data(connection)
		});
	}
	else
	{
	    step_query_all_products_info(connection);
	}
}

function step_query_all_products_info(connection)
{
    
    sql = "select chip, model, targetProduct from " + tab_products + " order by targetProduct;";
        
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
            var curchip = result[i].chip;
            var curmodel = result[i].model;
            var curTargetProduct = result[i].targetProduct;
            var index1 = targetArrayIndex(product_maps, curTargetProduct);
            var curmap;
            if (index1 < 0)
            {
                curmap = CreateProductMap(curTargetProduct);
                product_maps[maps_total] = curmap;
                maps_total++;
            }
            else
            {
                curmap = product_maps[index1];
            }
            
            var index2 = chipModelArrayIndex(curmap.chipModelList, curchip, curmodel);
            if (index2 < 0)
            {
                var index3 = curmap.chipModelList.length;
                var newChipModel = new Object;
                newChipModel.chip = curchip;
                newChipModel.model = curmodel;
                curmap.chipModelList[index3] = newChipModel;
            }
            
        }
        
        console.log("***********************\n");
        connection.end();
        generate_files();
    });
}

function generate_files()
{
    infoCnt = 0;
    while (infoCnt < infoTotal)
    {
        writerlog.w("开始生成临时文件\n");

    	writerlog.w("机芯 = " + allInfos[infoCnt].chip + ", 机型 = " + allInfos[infoCnt].model + "\n");
    
    	var temp_config_filename = getTempGernalConfigFileName(allInfos[infoCnt].chip, allInfos[infoCnt].model, allInfos[infoCnt].panel);
    
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
    
                filelist[filetotal++] = CreateFileInfo(temp_config_filename, "general_config.xml", 
                    allInfos[infoCnt].chip, allInfos[infoCnt].model, allInfos[infoCnt].panel, "general_config");
    		}
    		else if (curitem.type == "system_settings")
    		{
    		    writerlog.w("生成临时的setting文件 \n");
    		    settingfiles.generate(allInfos[infoCnt].chip, allInfos[infoCnt].model, allInfos[infoCnt].panel, curitem, getTmpDir(), 
    		        function(tempName, finalName, chip, model, panel, typeStr){
    		            filelist[filetotal++] = CreateFileInfo(tempName, finalName, chip, model, panel, typeStr);
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
		generate_prop_file(curtarget);
        targetCnt++;
	}
	
	generate_device_tab();

	if (action_type == "preview")
	{
	    console.log("preview");
	    infoCnt = 0;
	    targetCnt = 0;
	    
	    var content1 = fs.readFileSync(getTempGernalConfigFileName(allInfos[infoCnt].chip, allInfos[infoCnt].model, allInfos[infoCnt].panel), "utf-8");
        var content2 = fs.readFileSync(getTempMkFileName(allTargets[targetCnt].name), "utf-8");
        var content4 = fs.readFileSync(getTempPropFileName(allTargets[targetCnt].name), "utf-8");

        var content3_1 = fs.readFileSync(getTmpDir() + allInfos[infoCnt].chip + "_" + allInfos[infoCnt].model + "_" + allInfos[infoCnt].panel + "-setting_main.xml", "utf-8");
        var content3_2 = fs.readFileSync(getTmpDir() + allInfos[infoCnt].chip + "_" + allInfos[infoCnt].model + "_" + allInfos[infoCnt].panel + "-setting_guide.xml", "utf-8");
        var content3_3 = fs.readFileSync(getTmpDir() + allInfos[infoCnt].chip + "_" + allInfos[infoCnt].model + "_" + allInfos[infoCnt].panel + "-setting_connect.xml", "utf-8");
        var content3_4 = fs.readFileSync(getTmpDir() + allInfos[infoCnt].chip + "_" + allInfos[infoCnt].model + "_" + allInfos[infoCnt].panel + "-setting_general.xml", "utf-8");
        var content3_5 = fs.readFileSync(getTmpDir() + allInfos[infoCnt].chip + "_" + allInfos[infoCnt].model + "_" + allInfos[infoCnt].panel + "-market_show_configuration.xml", "utf-8");
        var content3_6 = fs.readFileSync(getTmpDir() + allInfos[infoCnt].chip + "_" + allInfos[infoCnt].model + "_" + allInfos[infoCnt].panel + "-ssc_item.xml", "utf-8");
        var content3_7 = fs.readFileSync(getTmpDir() + allInfos[infoCnt].chip + "_" + allInfos[infoCnt].model + "_" + allInfos[infoCnt].panel + "-setting_picture_sound.xml", "utf-8");
        var content3_8 = fs.readFileSync(getTmpDir() + allInfos[infoCnt].chip + "_" + allInfos[infoCnt].model + "_" + allInfos[infoCnt].panel + "-panel_common_pq.ini", "utf-8");
        var content3_9 = fs.readFileSync(getTmpDir() + allInfos[infoCnt].chip + "_" + allInfos[infoCnt].model + "_" + allInfos[infoCnt].panel + "-panel_common_board.ini", "utf-8");

        var content3 =  content3_1 + '\n\n\n\n\n' + 
                        content3_2 + '\n\n\n\n\n' + 
                        content3_3 + '\n\n\n\n\n' + 
                        content3_4 + '\n\n\n\n\n' + 
                        content3_5 + '\n\n\n\n\n' + 
                        content3_6 + '\n\n\n\n\n' + 
                        content3_7 + '\n\n\n\n\n' + 
                        content3_8 + '\n\n\n\n\n' + 
                        content3_9;
                        
        if (mod_callback != null)
        {
            var preview_result = new Object;
            preview_result.text1 = content1;
            preview_result.text2 = content2;
            preview_result.text3 = content3;
            preview_result.text4 = content4;
            mod_callback(0, preview_result);
        }
        return;
	}
	else        // 非预览则复制并提交文件到git
	{
        var pushret = copyFileAndCommit();
        if (pushret)
        ;
	}
}

function generate_device_tab()
{
    var deviceTabFileName = getTempDevTabFileName();
    var str = '\n';
	
	str += '### This file is automatically generated, do not edit it   \n';
	str += '### This file Recorded each device corresponding to the    \n';
	str += '### CoocaaOS customization mk,                             \n';
	str += '### As well as the corresponding product configuration     \n\n\n';

    fs.writeFileSync(deviceTabFileName, str);
    
    for (var i in product_maps)
    {
        var configItem = product_maps[i].name + " :=";
        for (var j in product_maps[i].chipModelList)
        {
            configItem += " " + product_maps[i].chipModelList[j].chip + "_" + product_maps[i].chipModelList[j].model;
        }
        configItem += "\n";
        fs.appendFileSync(deviceTabFileName, configItem);
    }
    
    var endStr = "\n\n\n\n";
    fs.appendFileSync(deviceTabFileName, endStr);
    
    filelist[filetotal++] = CreateFileInfo(deviceTabFileName, "device_tab.mk", null, null, null, "deviceTab");
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

    filelist[filetotal++] = CreateFileInfo(mk_filename, targetName + ".mk", null, null, null, "mk");
}

// build.prop
function generate_prop_file(target_info)
{
    let playerType = "";
    let targetName = target_info.name;
    let props = target_info.props;

    var prop_filename = getTempPropFileName(targetName);

    writerlog.w("生成临时的prop文件 " + prop_filename + "\n");

    fs.writeFileSync(prop_filename, ' \n');
    
    for (let i in props)
    {        
        fs.appendFileSync(prop_filename, props[i].engName + '=' + props[i].curValue + '\n');
    }
    
    fs.appendFileSync(prop_filename, '\n\n\n\n');

    filelist[filetotal++] = CreateFileInfo(prop_filename, targetName + ".prop", null, null, null, "prop");
}

function getTempGernalConfigFileName(chip, model, panel)
{
    return getTmpDir() + chip + "_" + model + "_" + panel + "-general_config" + ".xml";
}

function getTempMkFileName(targetProductName)
{
    return getTmpDir() + targetProductName + ".mk";
}

function getTempDevTabFileName()
{
    return getTmpDir() + "device_tab.mk";
}

function getTempPropFileName(targetProductName)
{
    return getTmpDir() + targetProductName + ".prop";
}

function copyFileAndCommit()
{
    var rand1 = Math.ceil(1000 * Math.random());
    var rand2 = Math.ceil(1000 * Math.random());
    var rand3 = Math.ceil(1000 * Math.random());
    var rand4 = Math.ceil(1000 * Math.random());
    var rand5 = Math.ceil(1000 * Math.random());
    var commit_sn = "" + rand1 + "-" + rand2 + "-" + rand3 + "-" + rand4 + "-" + rand5;
    
    writerlog.w("GIT 提交SN为  commit_sn = " + commit_sn + "\n");
    
    var gitdir = getGitDir(version);	// 把git仓库下载到这里,并且要加上commit-msg脚本,并且设置可执行的权限
    var gitbranch = getGitBranch(version);
    
    gerrit.commit(getTmpDir(), gitdir, commit_sn, version, commitText, gitbranch, filelist, function(err, text){
        if (mod_callback != null)
	        mod_callback(0, "产生文件完成.");
    });
    
    return 0;
}

function copyFileAndCommit_old()
{    
    shellFileName =  getTmpDir() + "shell_script.sh";
    
    var cmd;
    var commitmsg = "";
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
	    var ignore_gitpush;
	    
	    ignore_gitpush = false;
	    shcmd = "";
	    
	    if (fileinfo.typeStr == "general_config")
	    {
	        if (fileinfo.panel == 0)
	            config_dir_relpath = "pcfg/" + fileinfo.chip + "_" + fileinfo.model + "/config/";
	        else
	            config_dir_relpath = "pcfg/" + fileinfo.chip + "_" + fileinfo.model + "/" + fileinfo.panel + "/config/";
    	    config_file_relpath = config_dir_relpath + fileinfo.finalName;
	    }
	    else if (fileinfo.typeStr == "prop")
	    {
	        config_dir_relpath = "property/";
    	    config_file_relpath = config_dir_relpath + fileinfo.finalName;
	    }
	    else if (fileinfo.typeStr == "mk")
	    {
	        config_dir_relpath = "makefile/";
    	    config_file_relpath = config_dir_relpath + fileinfo.finalName;
	    }
	    else
	    {
	        if (fileinfo.panel == 0)
	            config_dir_relpath = "pcfg/" + fileinfo.chip + "_" + fileinfo.model + "/config/";
	        else
	            config_dir_relpath = "pcfg/" + fileinfo.chip + "_" + fileinfo.model + "/" + fileinfo.panel + "/config/";
    	    config_file_relpath = config_dir_relpath + fileinfo.finalName;
    	    
    	    if (version == "6.1")
    	        ignore_gitpush = true;
	    }
	    commitmsg += "修改" + config_file_relpath + ";\n";
    	
        if (config_dir_relpath != "")
        {
    	    cmd = "mkdir -p " + config_dir_relpath + "\n";
    	    shcmd += "echo " + cmd;
    	    shcmd += cmd;
        }
    	
        cmd = "cp -f " + fileinfo.tempName + '  ' + config_file_relpath + "\n";
    	shcmd += "echo " + cmd;
    	shcmd += cmd;
    	
    	if (!ignore_gitpush)
    	    cmd = "git add " + config_file_relpath + "\n";
    	shcmd += "echo " + cmd;
    	shcmd += cmd;
    	
    	shcmd += "\n";
    	
    	fs.appendFileSync(shellFileName, shcmd);
	}
	
	shcmd = "";
	var gitbranch = getGitBranch(version);
	
	cmd = "git commit -m  '\n";
	cmd += commitmsg;
	cmd += "'\n";
	
	//shcmd += "echo " + cmd;
	shcmd += cmd;
	
    // cmd = "git push origin HEAD:refs/for/" + gitbranch + "  \n\n";
    cmd = "git push origin HEAD:refs/for/" + gitbranch + "  \n\n";
	shcmd += "echo " + cmd;
	shcmd += cmd;
	
	shcmd += "\n";
	
	fs.appendFileSync(shellFileName, shcmd);
	
	gitpush(shellFileName, function(code, result){
	    
	});
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
	if (test_flag)
	{
	    gitdir = os.homedir() + "/scmplatform_v3/git/test/";
	}
	else
	{
	    if (systemVersion == "6.1")
            gitdir = os.homedir() + "/scmplatform_v3/git/6.1/";
        else if (systemVersion == "6.2")
            gitdir = os.homedir() + "/scmplatform_v3/git/6.2/";
        else if (systemVersion == "7.0")
            gitdir = os.homedir() + "/scmplatform_v3/git/7.0/";
        else
            gitdir = os.homedir() + "/scmplatform_v3/git/test/";
	}
	return gitdir;
}

function getGitBranch(systemVersion)
{
	var gitbranch;
	
	if (test_flag)
	{
	    gitbranch = "test";
	}
	else
	{
	    if (systemVersion == "6.1")
            gitbranch = "CCOS/Rel6.1";
    	else if (systemVersion == "6.2")
            gitbranch = "CCOS/Rel6.2";
        else if (systemVersion == "7.0")
            gitbranch = "CCOS/Rel7.0";
        else
            gitbranch = "test";
	}
    return gitbranch;
}

function getTmpDir()
{
    if (tempdir == "")
    {
        var date = new Date();
        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        var day = date.getDate();
        var hour = date.getHours();
        var minute = date.getMinutes();
        var second = date.getSeconds();
		if (month < 10)
			month = String("0" + month);
		if (day < 10)
			day = String("0" + day);
		if (hour < 10)
			hour = String("0" + hour);
		if (minute < 10)
			minute = String("0" + minute);
		if (second < 10)
			second = String("0" + second);
        var curtimestr = "a_" + year + "" + month + "" + day + "-" + hour + "" + minute + "" + second;
        var randValue = Math.ceil(1000 * Math.random());

        console.log(curtimestr + "_" + randValue);

        if (os.platform() == "win32")
        {
			tempdir = os.tmpdir();
			
            tempdir += "\\";
            tempdir += curtimestr + "_" + randValue;

            fs.mkdirSync(tempdir);
            tempdir += "\\";

        }
        else
        {
			tempdir = os.homedir();
			
            tempdir += "/scmplatform_v3/temp_dir/";
			//fs.mkdirSync(tempdir);
			
            tempdir += curtimestr + "_" + randValue;
            fs.mkdirSync(tempdir);
			
            tempdir += "/";
        }

        writerlog.w("临时存放文件夹为 " + tempdir + "\n");
    }
	return tempdir;
}

function parseModifyContent(content)
{
	var r1;
	var alltext = "";
	var text1 = new Array();
	var textcnt = 0;
	
	try {
		r1 = JSON.parse(content);
	}
	catch (err) {
		alltext = content + "\n";
		return alltext;
	}
	
	if (r1.changeDev != null && r1.changeDev != "") {
		text1[textcnt++] = "修改设备: " + r1.changeDev;
	}
	if (r1.changeAdd != null && r1.changeAdd != "") {
		text1[textcnt++] = "新增模块: " + r1.changeAdd;
	}
	if (r1.changeReduce != null && r1.changeReduce != "") {
		text1[textcnt++] = "删除模块: " + r1.changeReduce;
	}
	if (r1.changeConf != null && r1.changeConf != "") {
		text1[textcnt++] = "修改配置: " + r1.changeConf;
	}
	if (r1.changeProp != null && r1.changeProp != "") {
		text1[textcnt++] = "修改属性: " + r1.changeProp;
	}
	
	for (var n in text1) {
		if (n > 0)
			alltext += "              ";
		alltext += text1[n] + "\n";
	}
	return alltext;
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////                    //////////////////////////////////////////////////
//////////////////////////////////////////        API         //////////////////////////////////////////////////
//////////////////////////////////////////                    //////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////

Generator.prototype.generate = function(chip, model, panel, callback)
{
    generateFiles(chip, model, panel, "chip_and_model", 0, callback);
}

Generator.prototype.preview = function(chip, model, panel, tempflag, callback)
{
	generateFiles(chip, model, panel, "preview", tempflag, callback);
}

Generator.prototype.generateByTargetProduct = function(targetProduct, callback)
{
    generateFiles("", targetProduct, 0, "targetProduct", 0, callback);
}

Generator.prototype.generateByChip = function(chip, callback)
{
    generateFiles(chip, "", 0, "chip_only", 0, callback);
}

Generator.prototype.generateByModel = function(model, callback)
{
    generateFiles("", model, 0, "model_only", 0, callback);
}

Generator.prototype.generateAll = function(callback)
{
    generateFiles("", "", 0, "generate_all", 0, callback);
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
    console.log("$$$$$$$$$$$$$$$$$$$$");
    console.log("$$$$$$$$$$$$$$$$$$$$");
    console.log("$$$$$$$$$$$$$$$$$$$$");
}


//generator.generateByModel("E6000", null);
//generator.preview("8N01", "G730S", 0, 0, show_preview_text_test);
//generator.generateByTargetProduct("p201", show_callback);

generator.generate("VS01", "TEST", 0, show_callback);

//generator.generateAll(show_callback);

// git clone ssh://172.20.5.240/skyworth/CoocaaOS/Custom -b test
// git clone ssh://172.20.5.240/skyworth/CoocaaOS/Custom -b CCOS/Rel6.1
// ssh://source.skyworth.com/skyworth/CoocaaOS/Custom

module.exports = generator;


// git 配置:
//git config --global url.ssh://scmptfm@source.skyworth.com:29419.insteadof ssh://source.skyworth.com
//git config --global url.ssh://scmptfm@172.20.5.240:29419.insteadof ssh://172.20.5.240
//git config --global user.name scmptfm
//git config --global user.email scmptfm@skyworth.com

