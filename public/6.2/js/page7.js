document.write("<script language=javascript src='../js/sentHTTP.js' charset=\"utf-8\"></script>");

var _twoLevelLinkageArrayOne = [[],[],[],[]];
var _twoLevelLinkageArrayTwo = [[],[],[],[]];
var _twoLevelLinkageArrayThree = [[],[],[],[]];
var _myArray = [];

var coocaaVersion = "/v6.2";

$(function() {
	$(".page7_boxes")[0].style.display = "block";
	buttonInitBefore();
	sendHTTPRequest(coocaaVersion+"/module/queryCategory", '{}', moduleCategoryQueryResult);
});

function buttonInitBefore() {
	var _curIndex, _bIndex = "";
	$(".page7_tabs").click(function() {
		_curIndex = $(".page7_tabs").index($(this));
		tabsClick(_curIndex);
	});
	$(".page7_boxes .btn").click(function() {
		_bIndex = $(".page7_boxes .btn").index($(this));
		console.log(_bIndex);
		if(_bIndex == 0) {
			console.log("点击MK的新增按钮");
			$('#page7_module').modal();
			$("#moduleSubmit").attr("hidedata", 1);
			$("#moduleSubmit").attr("oldValue", "null");
			clearMKPart();
		} else if(_bIndex == 1) {
			console.log("点击Prop的新增按钮");
			$('#page7_prop').modal();
			$("#propSubmit").attr("hidedata", 1);
			$("#propSubmit").attr("oldValue", "null");
			clearPropPart();
		}  else if(_bIndex == 2) {
			console.log("点击Config文件页的新增按钮");
			$('#page7_config').modal();
			$("#configSubmit").attr("hidedata", 1);
			$("#configSubmit").attr("oldValue", "null");
			clearConfigPart(1);
		} else if(_bIndex == 3 || _bIndex == 4 || _bIndex == 5 || _bIndex == 6) {
			console.log("点击系统设置大项的新增按钮");
			$('#page7_sys').modal();
			$("#sysSubmit").attr("hidedata", 1);
			$("#sysSubmit").attr("tabindex", _bIndex);
			$("#sysSubmit").attr("oldValue", "null");
			editEachSelect(_bIndex);
			clearSysPart(_bIndex);
		}
		$(".modal-backdrop").addClass("new-backdrop");
	});
	
	/*枚举1各个图标的点击事件*/
	$(".menuEdit").click(function() {
		var _cIndex3 = $(".menuEdit").index($(this));
		console.log(_cIndex3);
		if(_cIndex3 == 0) {
			console.log("lxw " + "点击的是添加");
			var parentDiv = document.getElementsByClassName("ADCSEfficient")[0];
			var child1 = document.createElement("div");
			child1.setAttribute("class", "menuUnit");
			var child2 = document.createElement("input");
			child2.setAttribute("type", "text");
			child2.setAttribute("class", "menuUnitInput");
			child2.setAttribute("placeholder", "Value");
			child1.appendChild(child2);
			parentDiv.appendChild(child1);
		} else if(_cIndex3 == 1) {
			console.log("lxw " + "点击的是删除");
			var forDeleteObject = document.getElementsByClassName("ADCSEfficient")[0];
			var deleteObject = document.getElementsByClassName("menuUnit");
			var curLength = deleteObject.length;
			console.log("lxw " + curLength);
			if(curLength != 0) {
				forDeleteObject.removeChild(document.getElementsByClassName("menuUnit")[curLength - 1]);
			} else {
				console.log("lxw 已经删除完...");
			}
		} else if(_cIndex3 == 2) {
			console.log("lxw " + "点击的是全部删除");
			var appendObject = document.getElementsByClassName("ADCSEfficient")[0];
			appendObject.innerHTML = "";
		}
	});
	/*config-保存*/
	$("#configSubmit").click(function() {
		console.log("asdasda");
		saveInConfig();
	});
	/*mk-保存*/
	$("#moduleSubmit").click(function() {
		saveInMK();
	});
	/*sys-保存*/
	$("#sysSubmit").click(function() {
		saveInSys();
	});
	/*prop-保存*/
	$("#propSubmit").click(function() {
		saveInProp();
	});
}

function moduleCategoryQueryResult() {
	if(this.readyState == 4) {
		if(this.status == 200) {
			var data = JSON.parse(this.responseText);
			console.log(data);
			if(data.resultCode == "0") {
				$("#moduleSelect").attr("hasvalue", "true");
				var _myMKTbody = document.getElementById("myMKTbody");
				for(var i = 0; i < data.resultData.length; i++) {
					document.getElementById("moduleSelect").options.add(new Option(data.resultData[i].category));
					_myMKTbody.innerHTML += '<tr><td class="moduleitems" category="'+ data.resultData[i].category +'" id="moduleTr'+data.resultData[i].orderId+'"><div class="grouptitle" title="'+data.resultData[i].category+'">'+data.resultData[i].category+'</div></td></tr>';
				}
			}
		}
		sendHTTPRequest(coocaaVersion+"/module/query", '{}', moduleQueryResult);
	}
}
function moduleQueryResult() {
	if(this.readyState == 4) {
		if(this.status == 200) {
			var data = JSON.parse(this.responseText);
			console.log(data);
			if(data.resultCode == "0") {
				$(".page7_tabs:eq(0)").attr("hasvalue","true");
				editEachPage("0",data.resultData);
			}
		}
		buttonInitAfter();
	}
}
function propQueryResult() {
	if(this.readyState == 4) {
		if(this.status == 200) {
			var data = JSON.parse(this.responseText);
			console.log(data);
			if(data.resultCode == "0") {
				$(".page7_tabs:eq(1)").attr("hasvalue","true");
				editEachPage("1",data.resultData);
			}
		}
		buttonInitAfter();
	}
}
function configQueryResult() {
	if(this.readyState == 4) {
		if(this.status == 200) {
			var data = JSON.parse(this.responseText);
			console.log(data);
			if(data.resultCode == "0") {
				$(".page7_tabs:eq(2)").attr("hasvalue","true");
				editEachPage("2",data.resultData);
			}
		}
		buttonInitAfter();
	}
}
function settingQueryResult() {
	if(this.readyState == 4) {
		if(this.status == 200) {
			var data = JSON.parse(this.responseText);
			console.log(data);
			if(data.resultCode == "0") {
				$(".page7_tabs:eq(3)").attr("hasvalue","true");
				$(".page7_tabs:eq(4)").attr("hasvalue","true");
				$(".page7_tabs:eq(5)").attr("hasvalue","true");
				$(".page7_tabs:eq(6)").attr("hasvalue","true");
				editEachPage("5",data.resultData);
			}
		}
		buttonInitAfter();
	}
}

function buttonInitAfter() {
	/*配置管理板块-修改 */
	var _aPart, _aIndex, _cHidedata = "";
	$(".page7_a").click(function() {
		console.log("sadasd");
		_aIndex = $(".page7_a").index($(this));
		_cHidedata = $(this).attr("hidedata");
		_aPart = $(this).attr("part");
		eachPartChange(_aPart, _cHidedata);
	});
	
	$(".defaultOption").click(function() {
		var _cIndex2 = $(".defaultOption").index($(this));
		var _box1 = $(this).attr("boxone");
		var _box2 = $(this).attr("boxtwo");
		console.log(_box1 + "---" + _box2);
		document.getElementById(_box1).style.display = "block";
		document.getElementById(_box2).style.display = "none";
	});
	$(".defaultOption2").click(function() {
		var _cIndex2 = $(".defaultOption2").index($(this));
		var _box1 = $(this).attr("boxone");
		var _box2 = $(this).attr("boxtwo");
		document.getElementById(_box1).style.display = "block";
		document.getElementById(_box2).style.display = "none";
	});
}

function eachPartChange(part, data) {
	console.log(part + "---" + data);
	if(part == 0) {
		console.log("MK子项的修改");
		$('#page7_module').modal();
		$("#moduleSubmit").attr("hidedata", 2);
		$("#moduleSubmit").attr("oldValue", data);
		clearMKPart();
		editMKModel(data);
	} else if(part == 1) {
		console.log("Prop子项的修改");
		$('#page7_prop').modal();
		$("#propSubmit").attr("hidedata", 2);
		$("#propSubmit").attr("oldValue", data);
		clearPropPart();
		editPropModel(data);
	} else if(part == 2) {
		console.log("config子项的修改");
		$('#page7_config').modal();
		$("#configSubmit").attr("hidedata", 2);
		$("#configSubmit").attr("oldValue", data);
		clearConfigPart(2);
		editConfigModel(data);
	} else if(part == 3 || part == 4 || part == 5 || part == 6) {
		console.log("系统设置子项的修改");
//		$('#page7_sys').modal();
//		$("#sysSubmit").attr("hidedata", 2);
//		$("#sysSubmit").attr("tabindex", part);
//		$("#sysSubmit").attr("oldValue", data);
//		editEachSelect(part);
//		clearSysPart(part);
//		editSysModel(part, data);
	}
	$(".modal-backdrop").addClass("new-backdrop");
}

function editConfigModel(data) {
	console.log(JSON.parse(data));
	$("#configCName").val(JSON.parse(data).cnName);
	$("#configEName").val(JSON.parse(data).engName);
	$("#configEName").attr('disabled', '');
	if(JSON.parse(data).typeStr == "string") {
		$("#configString").css("display", "block");
		$("#configTableBoxEnum").css("display", "none");
		$("#configString").val(JSON.parse(data).defaultValue);
		for(var i = 0; i < $(".menuUnitInput").length; i++) {
			document.getElementsByClassName("menuUnitInput")[i].value = "";
		};
	} else {
		$("#configString").css("display", "none");
		$("#configTableBoxEnum").css("display", "block");
		var oOpt = JSON.parse(data).options.replace(/"/g, '');
		oOpt = oOpt.replace("[", "");
		oOpt = oOpt.replace("]", "");
		oOpt = oOpt.split(",");
		oOpt = clear_arr_trim(oOpt);
		console.log(oOpt);
		console.log(oOpt.length);
		document.getElementsByClassName("ADCSEfficient")[0].innerHTML = "";
		for(var j = 0; j < oOpt.length; j++) {
			var parentDiv = document.getElementsByClassName("ADCSEfficient")[0];
			var child1 = document.createElement("div");
			child1.setAttribute("class", "menuUnit");
			var child2 = document.createElement("input");
			child2.setAttribute("type", "text");
			child2.setAttribute("class", "menuUnitInput");
			child2.setAttribute("placeholder", "Value");
			child1.appendChild(child2);
			parentDiv.appendChild(child1);
		};
		for(var k = 0; k < oOpt.length; k++) {
			$(".menuUnitInput")[k].value = oOpt[k];
		};
	}
	$("#configInstr").val(JSON.parse(data).descText);
	var categoryClass = JSON.parse(data).category;
	var opt = document.getElementById("configSelect").getElementsByTagName("option");
	console.log(opt);
	for(var j = 0; j < opt.length; j++) {
		opt[j].removeAttribute("selected");
		if(opt[j].value == categoryClass) {
			console.log(j);
			opt[j].setAttribute("selected", "");
		}
	};
}

function editSysModel(part, data) {
	console.log(JSON.parse(data));
	$("#sysCName").val(JSON.parse(data).cnName);
	$("#sysEName").val(JSON.parse(data).engName);
	$("#sysInstr").val(JSON.parse(data).descText);
	
	var _level2 = JSON.parse(data).level2;
	var opt = document.getElementById("selectFirst").getElementsByTagName("option");
	for(var j = 0; j < opt.length; j++) {
		opt[j].removeAttribute("selected");
		if(opt[j].value == _level2) {
			opt[j].setAttribute("selected", "");
		}
	};
	
	var _tableIndex = $("#sysSubmit").attr("tabindex");
	if (_myArray.indexOf(_level2) != -1) {
		console.log("有次级分类 " + _tableIndex );
		for (var i=0; i<_twoLevelLinkageArrayThree[_tableIndex-1].length; i++) {
			console.log(_twoLevelLinkageArrayThree[_tableIndex-1][i][0] == _level2);
			if (_twoLevelLinkageArrayThree[_tableIndex-1][i][0] == _level2) {
				document.getElementById("selectSecond").options.add(new Option(_twoLevelLinkageArrayThree[_tableIndex-1][i][1]));
			}
		}
		document.getElementById("selectSecond").style.display = "block";
	}
	var _level3 = JSON.parse(data).level3;
	var opt2 = document.getElementById("selectSecond").getElementsByTagName("option");
	for(var j = 0; j < opt2.length; j++) {
		opt2[j].removeAttribute("selected");
		if(opt2[j].value == _level3) {
			opt2[j].setAttribute("selected", "");
		}
	};
}

function editMKModel(data) {
	console.log(data);
	document.getElementById("moduleCName").value = JSON.parse(data).cnName;
	document.getElementById("moduleEName").value = JSON.parse(data).engName;
	document.getElementById("moduleEName").setAttribute('disabled', '');
	document.getElementById("moduleEName").style.backgroundColor = "#ebebe4";
	document.getElementById("moduleSrc").value = JSON.parse(data).gitPath;
	document.getElementById("moduleInstr").value = JSON.parse(data).descText;

	var childSelect = document.getElementById("moduleSelect");
	console.log(childSelect.options.length);
	for(var j = 0; j < childSelect.options.length; j++) {
		if(childSelect.options[j].value == JSON.parse(data).category) {
			childSelect.options[j].selected = true;
		} else {
			childSelect.options[j].selected = false;
		}
	};
}

function editPropModel(data) {
	console.log(JSON.parse(data));
	$("#propEName").val(JSON.parse(data).engName);
	$("#propEName").attr('disabled', '');
	$("#propInstr").val(JSON.parse(data).descText);
	$("#propString").val(JSON.parse(data).defaultValue);
	var categoryClass = JSON.parse(data).category;
	var opt = document.getElementById("propSelect").getElementsByTagName("option");
	console.log(opt);
	for(var j = 0; j < opt.length; j++) {
		opt[j].removeAttribute("selected");
		if(opt[j].value == categoryClass) {
			console.log(j);
			opt[j].setAttribute("selected", "");
		}
	};
}

function clearConfigPart(num) {
	document.getElementById("configCName").value = "";
	document.getElementById("configEName").value = "";
	document.getElementById("configEName").removeAttribute('disabled');
	document.getElementById("configInstr").value = "";
	document.getElementById("configString").value = "";
	document.getElementsByClassName("ADCSEfficient")[0].innerHTML = "";
	for(var j = 0; j < 2; j++) {
		var parentDiv = document.getElementsByClassName("ADCSEfficient")[0];
		var child1 = document.createElement("div");
		child1.setAttribute("class", "menuUnit");
		var child2 = document.createElement("input");
		child2.setAttribute("type", "text");
		child2.setAttribute("class", "menuUnitInput");
		child2.setAttribute("placeholder", "Value");
		child1.appendChild(child2);
		parentDiv.appendChild(child1);
	};
	document.getElementById("configString").style.display = "block";
	document.getElementById("configTableBoxEnum").style.display = "none";
	
	var opt = document.getElementById("configSelect").getElementsByTagName("option");
	for (var j = 0; j < opt.length; j++) {
		opt[j].removeAttribute("selected");
	};
	opt[0].setAttribute("selected","");
}
function clearSysPart(num) {
	document.getElementById("sysCName").value = "";
	document.getElementById("sysEName").value = "";
	document.getElementById("sysInstr").value = "";
}
function clearMKPart() {
	document.getElementById("moduleCName").value = "";
	document.getElementById("moduleEName").value = "";
	document.getElementById("moduleSrc").value = "";
	document.getElementById("moduleEName").removeAttribute('disabled');
	document.getElementById("moduleEName").style.backgroundColor = "white";
	document.getElementById("moduleInstr").value = "";
}
function clearPropPart() {
	$("#propEName").removeAttr('disabled');
	document.getElementById("propEName").value = "";
	document.getElementById("propString").value = "";
	document.getElementById("propInstr").value = "";
	document.getElementById("propSelect").value = "";
	var opt = document.getElementById("propSelect").getElementsByTagName("option");
	for (var j = 0; j < opt.length; j++) {
		opt[j].removeAttribute("selected");
	};
	opt[0].setAttribute("selected","");
}

function editEachSelect(num){
	document.getElementById("selectFirst").options.length = 0;
	document.getElementById("selectSecond").options.length = 0;
	document.getElementById("selectSecond").style.display = "none";
	for (var i=0; i<_twoLevelLinkageArrayOne[num-1].length; i++) {
		document.getElementById("selectFirst").options.add(new Option(_twoLevelLinkageArrayOne[num-1][i]));
	}
	for (var j=0; j<_twoLevelLinkageArrayThree[num-1].length; j++) {
		_myArray[j] = _twoLevelLinkageArrayThree[num-1][j][0];
	}
	console.log(_myArray.indexOf(_twoLevelLinkageArrayOne[num-1][0]));
	if (_myArray.indexOf(_twoLevelLinkageArrayOne[num-1][0]) != -1) {
		console.log("有次级分类");
		document.getElementById("selectSecond").style.display = "block";
	}
}

function saveInConfig() {
	var _Hidendata = $("#configSubmit").attr("hidedata");
	var _oldValue = $("#configSubmit").attr("oldValue");

	var node = null; //向后台传递的数据

	var newConfigEnName = $("#configEName").val();
	var newConfigCzName = $("#configCName").val();
	var newConfigSelect = $("#configSelect").val();
	var newConfigInstr = $("#configInstr").val();
	newConfigInstr = newConfigInstr.replace(new RegExp("\"", "gm"), "\\\"");
	newConfigInstr = newConfigInstr.replace(new RegExp("\n", "gm"), "\\n");
	var newConfigType = "";
	var newConfigOptions = new Array();
	var newConfigString = "";
	newConfigString = $("#configString").val();
	newConfigString = newConfigString.replace(new RegExp("\"", "gm"), "\\\"");
	newConfigString = newConfigString.replace(new RegExp("\n", "gm"), "\\n");
	var newConfigOrderId = "";
	var inputNum = document.getElementsByClassName("menuUnitInput");
	var inputNumState = 0; //枚举型为空时的状态值
	for(var i = 0; i < inputNum.length; i++) {
		if(inputNum[i].value != "") {
			inputNumState = 1;
		}
	}
	if(newConfigCzName == "" || newConfigEnName == "" || newConfigInstr == "" || (newConfigString == "" && inputNumState == 0)) {
		console.log("数据项都为空");
		$("#configErrorInfo")[0].innerHTML = "请确保所有项不为空！";
		setTimeout('$("#configErrorInfo")[0].innerHTML = "　"', 3000);
	} else {
		if(newConfigString != "" && inputNumState == 1) {
			console.log("字符串型不为空，枚举型不为空！！！冲突！！！！");
			$("#configErrorInfo")[0].innerHTML = "输入有误，请确保字符串与枚举型的唯一！";
			setTimeout('$("#configErrorInfo")[0].innerHTML = "　"', 3000);
		} else if(newConfigString != "" && inputNumState == 0) {
			console.log("枚举型为空，字符串型！！！");
			newConfigType = "string";
			newConfigOptions = "";
			newConfigString = $("#configString").val();
		} else if(newConfigString == "" && inputNumState == 1) {
			console.log("枚举型不为空，字符串型为空！！！");
			newConfigType = "enum";
			var newConfigMenuDiv = document.getElementsByClassName("ADCSEfficient")[0];
			var valueTwo = null;
			for(var i = 0; i < $(".menuUnit").length; i++) {
				valueTwo = newConfigMenuDiv.getElementsByTagName("input")[i].value;
				console.log(valueTwo);
				if (valueTwo == "" || typeof(valueTwo) == "undefined") {
					console.log("为空");
				}else{
					newConfigOptions.push(valueTwo);
				}
			}
			newConfigString = newConfigOptions[0];
		}
		if(_Hidendata == 1) {
			console.log("lxw in edit 新增");
			node = '{"engName":"' + newConfigEnName + '","cnName":"' + newConfigCzName + '","category":"' + newConfigSelect + '","type":"' + newConfigType + '","options":"[' + newConfigOptions + ']","defaultValue":"' + newConfigString + '","desc":"' + newConfigInstr + '"}';
			console.log("lxw " + node);
			sendHTTPRequest(coocaaVersion+"/config/add", node, returnAddOrUpdateInfo);
		} else {
			console.log("lxw in edit 修改");
			newConfigOrderId = JSON.parse(_oldValue).orderId;
			console.log("orderId = " + newConfigOrderId);
			node = '{"engName":"' + newConfigEnName + '","cnName":"' + newConfigCzName + '","category":"' + newConfigSelect + '","type":"' + newConfigType + '","options":"[' + newConfigOptions + ']","defaultValue":"' + newConfigString + '","desc":"' + newConfigInstr + '","orderId":"' + newConfigOrderId + '"}';
			console.log("lxw " + node);
			sendHTTPRequest(coocaaVersion+"/config/update", node, returnAddOrUpdateInfo);
		}
	}
}

function saveInSys() {
	var _Hidendata2 = $("#sysSubmit").attr("hidedata");
	var _oldValue2 = $("#sysSubmit").attr("oldValue");
	var _index = $("#sysSubmit").attr("tabindex");
	console.log(_oldValue2+"---"+_index);

	var newSysCName = document.getElementById("sysCName").value;
	var newSysEName = document.getElementById("sysEName").value;
	var newSysInstr = document.getElementById("sysInstr").value;
	var newSysSelect1,newSysSelect2,newSysSelect3 = "";
	if (_index == 1) {
		newSysSelect1 = "系统设置";
	} else if(_index == 2){
		newSysSelect1 = "信号源工具箱";
	} else if(_index == 3){
		newSysSelect1 = "卖场演示";
	} else if(_index == 4){
		newSysSelect1 = "中间件";
	}
	newSysSelect2 = document.getElementById("selectFirst").value;
	if (document.getElementById("selectSecond").style.display == "block") {
		newSysSelect3 = document.getElementById("selectSecond").value;
	}
	
	newSysCName = newSysCName.replace(/(^\s*)|(\s*$)/g, "");
	newSysEName = newSysEName.replace(/(^\s*)|(\s*$)/g, "");
	newSysInstr = newSysInstr.replace(/(^\s*)|(\s*$)/g, "");

	if(newSysCName == "" || newSysEName == "" || newSysInstr == "") {
		console.log("存在空项");
		document.getElementById("sysErrorInfo").style.display = "block";
		if(newSysCName == "") {
			document.getElementById("sysCName").innerHTML = "模块中文名项不能为空！";
		} else if(newSysEName == "") {
			document.getElementById("sysEName").innerHTML = "模块英文名项不能为空！";
		} else if(newSysInstr == "") {
			document.getElementById("sysInstr").innerHTML = "模块描述项不能为空！";
		}
		setTimeout("document.getElementById('sysErrorInfo').innerHTML='　'", 3000);
	} else {
		if(_Hidendata2 == 1) {
			console.log("lxw sys 新增");
			var node = '{"engName":"' + newSysEName + '","cnName":"' + newSysCName + '","level1":"' + newSysSelect1 + '","level2":"' + newSysSelect2 + '","level3":"' + newSysSelect3 + '","desc":"' + newSysInstr + '"}';
			console.log(node);
		} else {
			console.log("lxw sys 修改");
			_oldValue2 = JSON.parse(_oldValue2);
			var node = '{"engName":"' + newSysEName + '","cnName":"' + newSysCName + '","level1":"' + newSysSelect1 + '","level2":"' + newSysSelect2 + '","level3":"' + newSysSelect3 + '","desc":"' + newSysInstr + '"}';
			console.log("lxw " + node);
		}
	}
}

function saveInMK() {
	var _Hidendata3 = $("#moduleSubmit").attr("hidedata");
	var _oldValue3 = $("#moduleSubmit").attr("oldValue");

	var newModuleCzName = document.getElementById("moduleCName").value;
	var newModuleEnName = document.getElementById("moduleEName").value;
	var newModuleSrc = document.getElementById("moduleSrc").value;
	var newModuleInstr = document.getElementById("moduleInstr").value;
	var newModuleSelect = document.getElementById("moduleSelect").value;

	newModuleCzName = newModuleCzName.replace(/(^\s*)|(\s*$)/g, "");
	newModuleEnName = newModuleEnName.replace(/(^\s*)|(\s*$)/g, "");
	newModuleSrc = newModuleSrc.replace(/(^\s*)|(\s*$)/g, "");
	newModuleInstr = newModuleInstr.replace(/(^\s*)|(\s*$)/g, "");

	if(newModuleCzName == "" || newModuleEnName == "" || newModuleSrc == "" || newModuleInstr == "") {
		console.log("存在空项");
		document.getElementById("moduleErrorInfo").style.display = "block";
		if(newModuleCzName == "") {
			document.getElementById("moduleErrorInfo").innerHTML = "模块中文名项不能为空！";
		} else if(newModuleEnName == "") {
			document.getElementById("moduleErrorInfo").innerHTML = "模块英文名项不能为空！";
		} else if(newModuleSrc == "") {
			document.getElementById("moduleErrorInfo").innerHTML = "模块路径项不能为空！";
		} else if(newModuleInstr == "") {
			document.getElementById("moduleErrorInfo").innerHTML = "描述项不能为空！";
		}
		setTimeout("document.getElementById('moduleErrorInfo').innerHTML='　'", 3000);
	} else {
		if(_Hidendata3 == 1) {
			console.log("lxw model 新增");
			var node = '{"engName":"' + newModuleEnName + '","cnName":"' + newModuleCzName + '","category":"' + newModuleSelect + '","desc":"' + newModuleInstr + '","gitPath":"' + newModuleSrc + '"}';
			console.log(node);
			sendHTTPRequest(coocaaVersion+"/module/add", node, returnAddOrUpdateInfo);
		} else {
			console.log("lxw model 修改");
			_oldValue3 = JSON.parse(_oldValue3);
			var node = '{"engName":"' + newModuleEnName + '","cnName":"' + newModuleCzName + '","category":"' + newModuleSelect + '","desc":"' + newModuleInstr + '","gitPath":"' + newModuleSrc + '","orderId":"' + _oldValue3.orderId + '"}';
			console.log("lxw " + node);
			sendHTTPRequest(coocaaVersion+"/module/update", node, returnAddOrUpdateInfo);
		}
	}
}

function saveInProp() {
	var _Hidendata = $("#propSubmit").attr("hidedata");
	var _oldValue3 = $("#propSubmit").attr("oldValue");

	var node = null; //向后台传递的数据
	var newPropEnName = $("#propEName").val();
	var newPropString = $("#propString").val();
	newPropString = newPropString.replace(new RegExp("\"", "gm"), "\\\"");
	newPropString = newPropString.replace(new RegExp("\n", "gm"), "\\n");
	var newPropInstr = $("#propInstr").val();
	newPropInstr = newPropInstr.replace(new RegExp("\"", "gm"), "\\\"");
	newPropInstr = newPropInstr.replace(new RegExp("\n", "gm"), "\\n");
	var newPropSelect = $("#propSelect").val();
	
	if(newPropEnName == "" || newPropString == "" || newPropInstr == "") {
		console.log("数据项都为空");
		$("#propErrorInfo")[0].innerHTML = "请确保所有项不为空！";
		setTimeout('$("#propErrorInfo")[0].innerHTML = "　"', 3000);
	} else {
		var editObj = {
			"engName" : newPropEnName,
			"defaultValue" : newPropString,
			"category" : newPropSelect,
			"descText" : newPropInstr
		}
		var _edit = JSON.stringify(editObj);
		var node = '{"data":' + _edit + '}';
		if(_Hidendata == 1) {
			console.log("lxw in Prop 新增");
			console.log("lxw " + node);
			sendHTTPRequest(coocaaVersion+"/prop/add", node, returnAddOrUpdateInfo);
		} else {
			console.log("lxw in Prop 修改");
			console.log(node);
			sendHTTPRequest(coocaaVersion+"/prop/update", node, returnAddOrUpdateInfo);
		}
	}
}

function returnAddOrUpdateInfo() {
	if(this.readyState == 4) {
		if(this.status == 200) {
			var data = JSON.parse(this.responseText);
			console.log(data);
			var _curId = $("#tabClickIndex").attr("curId");
			if(data.resultCode == "0") {
				console.log("数据添加成功");
				if (_curId ==0) {
					$("#page7_module").modal('hide');
					$(".page7_tabs:eq(0)").attr("hasvalue","false");
				} else if(_curId==1){
					$("#page7_prop").modal('hide');
					$(".page7_tabs:eq(1)").attr("hasvalue","false");
				} else if(_curId==2){
					$("#page7_config").modal('hide');
					$(".page7_tabs:eq(2)").attr("hasvalue","false");
				} else{
					$("#page7_sys").modal('hide');
					$(".page7_tabs:eq(3)").attr("hasvalue","false");
					$(".page7_tabs:eq(4)").attr("hasvalue","false");
					$(".page7_tabs:eq(5)").attr("hasvalue","false");
					$(".page7_tabs:eq(6)").attr("hasvalue","false");
				}
				tabsClick(_curId);
				freshModuleAddHtml(1);
			} else {
				console.log("数据添加失败");
				document.getElementById("configErrorInfo").innerHTML = "添加失败！该内容或已存在。";
				setTimeout("document.getElementById('configErrorInfo').innerHTML='　'", 3000);
				
				if (_curId ==0) {
					document.getElementById("moduleErrorInfo").innerHTML = "添加失败！该内容或已存在。";
					setTimeout("document.getElementById('moduleErrorInfo').innerHTML='　'", 3000);
				} else if(_curId==1){
					document.getElementById("propErrorInfo").innerHTML = "添加失败！该内容或已存在。";
					setTimeout("document.getElementById('propErrorInfo').innerHTML='　'", 3000);
				} else if(_curId==2){
					document.getElementById("configErrorInfo").innerHTML = "添加失败！该内容或已存在。";
					setTimeout("document.getElementById('configErrorInfo').innerHTML='　'", 3000);
				} else{
					document.getElementById("sysErrorInfo").innerHTML = "添加失败！该内容或已存在。";
					setTimeout("document.getElementById('sysErrorInfo').innerHTML='　'", 3000);
				}
			}
		}
	}
}

function tabsClick(num) {
	for(var k = 0; k < $(".page7_tabs").length; k++) {
		$(".page7_boxes")[k].style.display = "none";
		$(".page7_tabs")[k].style.backgroundColor = "buttonface";
	}
	$(".page7_boxes")[num].style.display = "block";
	$(".page7_tabs")[num].style.backgroundColor = "darkturquoise";
	$("#tabClickIndex").attr("curId", num);

	var _hasValue = $(".page7_tabs:eq(" + (num) + ")").attr("hasvalue");
	
	console.log(_hasValue);
	if(_hasValue == "false") {
		var ajaxUrl = "";
		if(num == 0) {
			ajaxUrl = coocaaVersion+"/module/queryCategory";
		} else if(num == 1){
			ajaxUrl = coocaaVersion+"/prop/queryCategory";
		} else if(num == 2) {
			ajaxUrl = coocaaVersion+"/config/queryCategory";
		} else if(num == 3 || num == 4 || num == 5 || num == 6) {
			ajaxUrl = coocaaVersion+"/settings/queryCategory";
		}
		sendHTTPRequest(ajaxUrl, '{}', categoryQueryResult);
	} else {
		console.log("已经获取过了");
	}
}

function categoryQueryResult() {
	if(this.readyState == 4) {
		if(this.status == 200) {
			var data = JSON.parse(this.responseText);
			console.log(data);
			if(data.resultCode == "0") {
				var _curId = $("#tabClickIndex").attr("curId");
				console.log(_curId);
				if (_curId==0) {
					$("#moduleSelect").attr("hasvalue", "true");
					var _myMKTbody = document.getElementById("myMKTbody");
					_myMKTbody.innerHTML = "";
					for(var i = 0; i < data.resultData.length; i++) {
						document.getElementById("moduleSelect").options.add(new Option(data.resultData[i].category));
						_myMKTbody.innerHTML += '<tr><td class="moduleitems" category="'+ data.resultData[i].category +'" id="moduleTr'+data.resultData[i].orderId+'"><div class="grouptitle" title="'+data.resultData[i].category+'">'+data.resultData[i].category+'</div></td></tr>';
					}
					sendHTTPRequest(coocaaVersion+"/module/query", '{}', moduleQueryResult);
				} else if(_curId==1){
					$("#propSelect").attr("hasvalue", "true");
					var _myPropTbody = document.getElementById("myPropTbody");
					_myPropTbody.innerHTML = "";
					for(var i = 0; i < data.resultData.length; i++) {
						document.getElementById("propSelect").options.add(new Option(data.resultData[i].category));
						_myPropTbody.innerHTML += '<tr><td class="propitems" category="'+ data.resultData[i].category +'" id="propTr'+data.resultData[i].orderId+'"><div class="grouptitle" title="'+data.resultData[i].category+'">'+data.resultData[i].category+'</div></td></tr>';
					}
					sendHTTPRequest(coocaaVersion+"/prop/query", '{}', propQueryResult);
				} else if(_curId==2){
					$("#configSelect").attr("hasvalue", "true");
					var _myConfigTbody = document.getElementById("myConfigTbody");
					_myConfigTbody.innerHTML = "";
					for(var i = 0; i < data.resultData.length; i++) {
						document.getElementById("configSelect").options.add(new Option(data.resultData[i].category));
						_myConfigTbody.innerHTML += '<tr><td class="configitems" category="'+ data.resultData[i].category +'" id="configTr'+data.resultData[i].orderId+'"><div class="grouptitle" title="'+data.resultData[i].category+'">'+data.resultData[i].category+'</div></td></tr>';
					}
					sendHTTPRequest(coocaaVersion+"/config/query", '{}', configQueryResult);
				} else if(_curId==3||_curId==4||_curId==5||_curId==6) {
					$("#selectFirst").attr("hasvalue", "true");
					var _mySysSettingTbody = document.getElementById("mySysSettingTbody");
					var _mySourceBoxTbody = document.getElementById("mySourceBoxTbody");
					var _myMarketShowTbody = document.getElementById("myMarketShowTbody");
					var _myMiddlewareTbody = document.getElementById("myMiddlewareTbody");
					_mySysSettingTbody.innerHTML = "";
					_mySourceBoxTbody.innerHTML = "";
					_myMarketShowTbody.innerHTML = "";
					_myMiddlewareTbody.innerHTML = "";
					for(var i = 0; i < data.resultData.length; i++) {
						if (data.resultData[i].level1 == "系统设置") {
							if(data.resultData[i].level3 != ""){
								_mySysSettingTbody.innerHTML += '<tr><td class="settingsitems" level2="'+data.resultData[i].level2+'" level3="'+data.resultData[i].level3+'"><div class="grouptitle" title="'+data.resultData[i].level2+"-"+data.resultData[i].level3+'">'+data.resultData[i].level2+"-"+data.resultData[i].level3+'</div></td></tr>';
								if (_twoLevelLinkageArrayTwo[0].indexOf(data.resultData[i].level3)== -1) {
									_twoLevelLinkageArrayTwo[0].push(data.resultData[i].level3);
									_twoLevelLinkageArrayThree[0].push([data.resultData[i].level2,data.resultData[i].level3]);
								}
							}else{
								_mySysSettingTbody.innerHTML += '<tr><td class="settingsitems" level2="'+data.resultData[i].level2+'"><div class="grouptitle" title="'+data.resultData[i].level2+'">'+data.resultData[i].level2+'</div></td></tr>';
							}
							if (_twoLevelLinkageArrayOne[0].indexOf(data.resultData[i].level2)== -1) {
								_twoLevelLinkageArrayOne[0].push(data.resultData[i].level2);
							}
						} else if(data.resultData[i].level1 == "信号源工具箱"){
							if(data.resultData[i].level3 != ""){
								_mySourceBoxTbody.innerHTML += '<tr><td class="settingsitems" level2="'+data.resultData[i].level2+'" level3="'+data.resultData[i].level3+'"><div class="grouptitle" title="'+data.resultData[i].level2+"-"+data.resultData[i].level3+'">'+data.resultData[i].level2+"-"+data.resultData[i].level3+'</div></td></tr>';
								if (_twoLevelLinkageArrayTwo[1].indexOf(data.resultData[i].level3)== -1) {
									_twoLevelLinkageArrayTwo[1].push(data.resultData[i].level3);
									_twoLevelLinkageArrayThree[1].push([data.resultData[i].level2,data.resultData[i].level3]);
								}
							}else{
								_mySourceBoxTbody.innerHTML += '<tr><td class="settingsitems" level2="'+data.resultData[i].level2+'"><div class="grouptitle" title="'+data.resultData[i].level2+'">'+data.resultData[i].level2+'</div></td></tr>';
							}
							if (_twoLevelLinkageArrayOne[1].indexOf(data.resultData[i].level2)== -1) {
								_twoLevelLinkageArrayOne[1].push(data.resultData[i].level2);
							}
						}else if(data.resultData[i].level1 == "卖场演示"){
							if(data.resultData[i].level3 != ""){
								_myMarketShowTbody.innerHTML += '<tr><td class="settingsitems" level2="'+data.resultData[i].level2+'" level3="'+data.resultData[i].level3+'"><div class="grouptitle" title="'+data.resultData[i].level2+"-"+data.resultData[i].level3+'">'+data.resultData[i].level2+"-"+data.resultData[i].level3+'</div></td></tr>';
								if (_twoLevelLinkageArrayTwo[2].indexOf(data.resultData[i].level3)== -1) {
									_twoLevelLinkageArrayTwo[2].push(data.resultData[i].level3);
									_twoLevelLinkageArrayThree[2].push([data.resultData[i].level2,data.resultData[i].level3]);
								}
							}else{
								_myMarketShowTbody.innerHTML += '<tr><td class="settingsitems" level2="'+data.resultData[i].level2+'"><div class="grouptitle" title="'+data.resultData[i].level2+'">'+data.resultData[i].level2+'</div></td></tr>';
							}
							if (_twoLevelLinkageArrayOne[2].indexOf(data.resultData[i].level2)== -1) {
								_twoLevelLinkageArrayOne[2].push(data.resultData[i].level2);
							}
						}else if(data.resultData[i].level1 == "中间件"){
							if(data.resultData[i].level3 != ""){
								_myMiddlewareTbody.innerHTML += '<tr><td class="settingsitems" level2="'+data.resultData[i].level2+'" level3="'+data.resultData[i].level3+'"><div class="grouptitle" title="'+data.resultData[i].level2+"-"+data.resultData[i].level3+'">'+data.resultData[i].level2+"-"+data.resultData[i].level3+'</div></td></tr>';
								if (_twoLevelLinkageArrayTwo[3].indexOf(data.resultData[i].level3)== -1) {
									_twoLevelLinkageArrayTwo[3].push(data.resultData[i].level3);
									_twoLevelLinkageArrayThree[3].push([data.resultData[i].level2,data.resultData[i].level3]);
								}
							}else{
								_myMiddlewareTbody.innerHTML += '<tr><td class="settingsitems" level2="'+data.resultData[i].level2+'"><div class="grouptitle" title="'+data.resultData[i].level2+'">'+data.resultData[i].level2+'</div></td></tr>';
							}
							if (_twoLevelLinkageArrayOne[3].indexOf(data.resultData[i].level2)== -1) {
								_twoLevelLinkageArrayOne[3].push(data.resultData[i].level2);
							}
						}
					}
					sendHTTPRequest(coocaaVersion+"/settings/query", '{}', settingQueryResult);
				}
			}
		}
	}
}

function editEachPage(num,array){
	if(num==0){
		for (var j=0; j< $(".moduleitems").length; j++) {
			for(var i = 0; i < array.length; i++) {
				if(array[i].category == $(".moduleitems:eq(" + (j) + ")").attr("category")) {
					$(".moduleitems")[j].innerHTML += "<div class='col-xs-4 subitem'><a class='page7_a' disabled='disabled' part='0' hidedata='" + JSON.stringify(array[i]) + "' title='" + array[i].engName + "' name='" + array[i].engName + "'>" + array[i].cnName + "</a></div>";
				}
			}
		}
	} else if(num==1){
		for (var j=0; j< $(".propitems").length; j++) {
			for(var i = 0; i < array.length; i++) {
				if(array[i].category == $(".propitems:eq(" + (j) + ")").attr("category")) {
					$(".propitems")[j].innerHTML += "<div class='col-xs-4 subitem'><a class='page7_a' part='1' hidedata='" + JSON.stringify(array[i]) + "' title='" + array[i].engName + "' name='" + array[i].engName + "'>" + array[i].engName + "</a></div>";
				}
			}
		}
	} else if(num==2){
		for (var j=0; j< $(".configitems").length; j++) {
			for(var i = 0; i < array.length; i++) {
				if(array[i].category == $(".configitems:eq(" + (j) + ")").attr("category")) {
					$(".configitems")[j].innerHTML += "<div class='col-xs-4 subitem'><a class='page7_a' disabled='disabled' part='2' hidedata='" + JSON.stringify(array[i]) + "' title='" + array[i].engName + "' name='" + array[i].engName + "'>" + array[i].cnName + "</a></div>";
				}
			}
		}
	} else if(num==5){
		for (var j=0; j< $(".settingsitems").length; j++) {
			for(var i = 0; i < array.length; i++) {
				if(array[i].level2 == $(".settingsitems:eq(" + (j) + ")").attr("level2")) {
					if (array[i].level3 === null || array[i].level3 == "") {
						$(".settingsitems")[j].innerHTML += "<div class='col-xs-4 subitem'><a class='page7_a' disabled='disabled' part='5' hidedata='" + JSON.stringify(array[i]) + "' title='" + array[i].engName + "' name='" + array[i].engName + "'>" + array[i].cnName + "</a></div>";
					} else{
						if (array[i].level3 == $(".settingsitems:eq(" + (j) + ")").attr("level3")) {
							$(".settingsitems")[j].innerHTML += "<div class='col-xs-4 subitem'><a class='page7_a' disabled='disabled' part='5' hidedata='" + JSON.stringify(array[i]) + "' title='" + array[i].engName + "' name='" + array[i].engName + "'>" + array[i].cnName + "</a></div>";
						}
					}
				}
			}
		}
	}
}

/*刷新页面*/
function freshModuleAddHtml(num) {
	if (num == 0) {
		var htmlObject = parent.document.getElementById("tab_userMenu7");
		htmlObject.firstChild.src = "page7.html";
	}else{
		var htmlObject1 = parent.document.getElementById("tab_userMenu1");
	    var htmlObject2 = parent.document.getElementById("tab_userMenu2");
	    var htmlObject4 = parent.document.getElementById("tab_userMenu4");
	    var htmlObject5 = parent.document.getElementById("tab_userMenu5");
	    if (htmlObject1) {
	        htmlObject1.firstChild.src = "page1.html";
	    }
	    if (htmlObject2) {
	    	htmlObject2.firstChild.src = "page2.html";
	    }
	    if (htmlObject4) {
	    	htmlObject4.firstChild.src = "page4.html";
	    }
	     if (htmlObject5) {
	    	htmlObject5.firstChild.src = "page5.html";
	    }
	}
}

function changeSelect(str){
	console.log("in changeSelect " + str);
	console.log(_twoLevelLinkageArrayThree);
	console.log(_myArray.indexOf(str));
	var _tableIndex = $("#sysSubmit").attr("tabindex");
	document.getElementById("selectSecond").options.length = 0;
	document.getElementById("selectSecond").style.display = "none";
	if (_myArray.indexOf(str) != -1) {
		console.log("有次级分类 " + _tableIndex );
		for (var i=0; i<_twoLevelLinkageArrayThree[_tableIndex-1].length; i++) {
			console.log(_twoLevelLinkageArrayThree[_tableIndex-1][i][0] == str);
			if (_twoLevelLinkageArrayThree[_tableIndex-1][i][0] == str) {
				document.getElementById("selectSecond").options.add(new Option(_twoLevelLinkageArrayThree[_tableIndex-1][i][1]));
			}
		}
		document.getElementById("selectSecond").style.display = "block";
	}
}

function clear_arr_trim(array) {  
    for(var i = 0 ;i<array.length;i++)  
    {  
        if(array[i] == "" || typeof(array[i]) == "undefined")  
        {  
            array.splice(i,1);  
            i= i-1;  
        }  
    }  
    return array;  
}  