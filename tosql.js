
// 转换mongodb数据为SQL
var dbname = "scmplatform";
var url = 'mongodb://127.0.0.1:27017/';
var sqlname = "a.sql";

var fs = require('fs');
var mongo = require("mongodb");
var client = mongo.MongoClient;
var assert = require('assert');
var dbo;
var sqltext;
var targets = new Array();

fs.writeFileSync(sqlname, "-- \n");
fs.appendFileSync(sqlname, "-- 此文件是由脚本自动产生,自动将MongoDB中的数据转换为MySQL的语句\n");
fs.appendFileSync(sqlname, "-- \n");
fs.appendFileSync(sqlname, "\n");
tosql();


function tosql()
{
	client.connect(url, function(err, db) {
		if (err)
			console.log("connect database error!");
		assert.equal(null, err);
		console.log("Connected successfully to server");
		dbo = db.db(dbname);
		convert_users_table(dbo);
	});
}

function convert_users_table(dbo)
{
	// 转换users表数据
	var user_collection = dbo.collection('users');

	user_collection.find({}).toArray(function(err, user_docs) {
		if (err)
			console.log(-3, "query database table users error!");
		assert.equal(null, err);

		console.log(user_docs);

		for (var user_i in user_docs)
		{
			var user = user_docs[user_i];
			var userName = user.userName;
			var password = user.password;
			var level = user.level;
			var email = user.email;

			sqltext =  "insert into users ";
			sqltext += "(userName, password, email, adminFlag ) values (";
			sqltext += '\"' + userName + '\", ';
			sqltext += '\"' + password + '\", ';
			sqltext += '\"' + email + '\", ';
			sqltext += level;
			sqltext += ");\n";

			fs.appendFileSync(sqlname, sqltext);
		}
		fs.appendFileSync(sqlname, "\n");

		convert_chips_table(dbo);
		fs.appendFileSync(sqlname, "-- ======================================================================\n");
		fs.appendFileSync(sqlname, "-- ======================================================================\n");
		fs.appendFileSync(sqlname, "\n");
	});
}

function convert_chips_table(dbo)
{
	var chips_collection = dbo.collection('chips');

	chips_collection.find({}).toArray(function(err, chips_docs) {
		if (err)
			console.log(-3, "query database table chips error!");
		assert.equal(null, err);

		console.log(chips_docs);

		for (var chip_i in chips_docs)
		{
			var chip = chips_docs[chip_i];
			var name = chip.name;

			sqltext =  "insert into chips ";
			sqltext += "(name) values (";
			sqltext += '\"' + name + '\" ';
			sqltext += ");\n";

			fs.appendFileSync(sqlname, sqltext);
		}
		fs.appendFileSync(sqlname, "\n");

		convert_models_table(dbo);
		fs.appendFileSync(sqlname, "-- ======================================================================\n");
		fs.appendFileSync(sqlname, "-- ======================================================================\n");
		fs.appendFileSync(sqlname, "\n");
	});
}

function convert_models_table(dbo)
{
	var collection = dbo.collection('models');

	collection.find({}).toArray(function(err, docs) {
		if (err)
			console.log(-3, "query database table models error!");
		assert.equal(null, err);

		console.log(docs);

		for (var i in docs)
		{
			var data = docs[i];
			var name = data.name;

			sqltext =  "insert into models ";
			sqltext += "(name) values (";
			sqltext += '\"' + name + '\" ';
			sqltext += ");\n";

			fs.appendFileSync(sqlname, sqltext);
		}
		fs.appendFileSync(sqlname, "\n");

		convert_soc_table(dbo);
		fs.appendFileSync(sqlname, "-- ======================================================================\n");
		fs.appendFileSync(sqlname, "-- ======================================================================\n");
		fs.appendFileSync(sqlname, "\n");
	});
}

function convert_soc_table(dbo)
{
	var collection = dbo.collection('chipModels');

	collection.find({}).toArray(function(err, docs) {
		if (err)
			console.log(-3, "query database table chipModels error!");
		assert.equal(null, err);

		console.log(docs);

		for (var i in docs)
		{
			var data = docs[i];
			var name = data.name;

			sqltext =  "insert into soc ";
			sqltext += "(name) values (";
			sqltext += '\"' + name + '\" ';
			sqltext += ");\n";

			fs.appendFileSync(sqlname, sqltext);
		}
		fs.appendFileSync(sqlname, "\n");

		convert_config_table(dbo);
		fs.appendFileSync(sqlname, "-- ======================================================================\n");
		fs.appendFileSync(sqlname, "-- ======================================================================\n");
		fs.appendFileSync(sqlname, "\n");
	});
}

function convert_config_table(dbo)
{
	var collection = dbo.collection('configs');

	collection.find({}).toArray(function(err, docs) {
		if (err)
			console.log(-3, "query database table configs error!");
		assert.equal(null, err);

		console.log(docs);

		for (var i in docs)
		{
			var data = docs[i];

			sqltext =  "insert into configs ";
			sqltext += "(orderId, engName, defaultValue, cnName, typeStr, category, options, descText) values \n    ";
			sqltext += "(0, ";
			sqltext += '\"' + data.engName + '\", ';
			sqltext += '\"' + data.value + '\", ';
			sqltext += '\"' + data.cnName + '\", ';
			sqltext += '\"' + data.type + '\", ';
			sqltext += '\"' + data.category + '\", ';
			var optionStr = "{\\\"options\\\": [";
			for (var M in data.options)
			{
				if (M != 0)
					optionStr += ",";
				optionStr += "\\\"";
				optionStr += data.options[M];
				optionStr += "\\\"";
			}
			optionStr += "]";
			sqltext += '\"' + optionStr + '\", \n    ';

			var desc_text= escStr(data.desc);
			sqltext += '\"' + desc_text + '\"     \n    ';

			sqltext += ");\n";

			fs.appendFileSync(sqlname, sqltext);
		}
		fs.appendFileSync(sqlname, "\n");

		convert_modules_table(dbo);
		fs.appendFileSync(sqlname, "-- ======================================================================\n");
		fs.appendFileSync(sqlname, "-- ======================================================================\n");
		fs.appendFileSync(sqlname, "\n");
	});
}

function convert_modules_table(dbo)
{
	var collection = dbo.collection('modules');

	collection.find({}).toArray(function(err, docs) {
		if (err)
			console.log(-3, "query database table modules error!");
		assert.equal(null, err);

		console.log(docs);

		for (var i in docs)
		{
			var data = docs[i];

			sqltext =  "insert into modules ";
			sqltext += "(orderId, cnName, engName, category, gitPath, descText) values \n    ";
			sqltext += "(0, ";
			sqltext += '\"' + data.cnName + '\", ';
			sqltext += '\"' + data.engName + '\", ';
			sqltext += '\"' + data.category + '\", ';
			sqltext += '\"' + data.gitPath + '\", \n    ';

			var desc_text= escStr(data.desc);
			sqltext += '\"' + desc_text + '\" ';

			sqltext += ");\n";

			fs.appendFileSync(sqlname, sqltext);
		}
		fs.appendFileSync(sqlname, "\n");

		convert_products_table(dbo);
		fs.appendFileSync(sqlname, "-- ======================================================================\n");
		fs.appendFileSync(sqlname, "-- ======================================================================\n");
		fs.appendFileSync(sqlname, "\n");
	});
}

function convert_products_table(dbo)
{
	var collection = dbo.collection('products');

	collection.find({}).toArray(function(err, docs) {
		if (err)
			console.log(-3, "query database table products error!");
		assert.equal(null, err);

		//console.log(docs);

		for (var i in docs)
		{
			var data = docs[i];

			sqltext =  "insert into products ";
			sqltext += "(chip, model, androidVersion, memorySize, EMMC, targetProduct, soc, gitBranch, operateTime) values \n    ";
			sqltext += "(";
			sqltext += '\"' + data.chip + '\", ';
			sqltext += '\"' + data.model + '\", ';
			sqltext += '\"' + data.androidVersion + '\", ';
			sqltext += '\"' + data.memorySize + '\", ';
			sqltext += '\"' + "4GB" + '\", ';
			sqltext += '\"' + data.targetProduct + '\", ';
			sqltext += '\"' + data.chipModel + '\", ';
			sqltext += '\"' + "" + '\", ';
			sqltext += "current_timestamp() ";

			sqltext += ");\n";

			fs.appendFileSync(sqlname, sqltext);

			for (var j in data.configFile)
			{
				var key = data.configFile[j].configKey;
				var value = data.configFile[j].value;

				sqltext =  "insert into configdata ";
				sqltext += "(chip, model, engName, curValue) values \n    ";
				sqltext += "(";
				sqltext += '\"' + data.chip + '\", ';
				sqltext += '\"' + data.model + '\", ';
				sqltext += '\"' + key + '\", ';
				sqltext += '\"' + value + '\" ';

				sqltext += ");\n";

				fs.appendFileSync(sqlname, sqltext);
			}

			// 判断targetProduct是否已经存在于数组里面
			var index = targetArrayIndex(targets, data.targetProduct);
			if (index >= 0)
			{
				// skip
			}
			else
			{
				var newindex = targets.length;
				targets[newindex] = data.targetProduct;

				for (var k in data.mkFile)
				{
					sqltext =  "insert into mkdata ";
					sqltext += "(targetProduct, engName, selected) values \n    ";
					sqltext += "(";
					sqltext += '\"' + data.targetProduct + '\", ';
					sqltext += '\"' + data.mkFile[k].engName + '\", ';
					sqltext += "1";

					sqltext += ");\n";

					fs.appendFileSync(sqlname, sqltext);
				}

			}

			fs.appendFileSync(sqlname, "\n");
		}
		fs.appendFileSync(sqlname, "\n");

		for (var L in targets)
		{
			sqltext =  "insert into targetProducts ";
			sqltext += "(name) values (";
			sqltext += '\"' + targets[L] + '\"';
			sqltext += ");\n";

			fs.appendFileSync(sqlname, sqltext);
		}

		fs.appendFileSync(sqlname, "-- ======================================================================\n");
		fs.appendFileSync(sqlname, "-- ======================================================================\n");
		fs.appendFileSync(sqlname, "\n");

		console.log("all finish!");

	});
}

// 转义
function escStr(str1)
{
	var str2 = "";
	var ch;
	for(var ci = 0; ci < str1.length; ci++)
	{
		ch = str1.charAt(ci);
		if (ch == '\"')
			str2 += "\\\"";
		else if (ch == '\'')
			str2 += "\\\'";
		else if (ch == '\n')
			str2 += "\\n";
		else if (ch == '\r')
			str2 += "\\r";
		else if (ch == '\\')
			str2 += "\\\\";
		else
			str2 += ch;
	}
	return str2;
}

function targetArrayIndex(arr, obj)
{
	var i = arr.length;
	while (i--)
	{
		if (i < 0)
			break;
		if (arr[i] == obj) {
			return i;
		}
	}
	return -1;
}
