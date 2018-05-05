document.write("<script language=javascript src='../js/sentHTTP.js' charset=\"utf-8\"></script>");

$(function() {
	$(".page7_boxes")[0].style.display = "block";
	buttonInitBefore();
	var node11 = '{}';
	sendHTTPRequest("/config/queryCategory", node11, configCategoryQueryResult);
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
			console.log("点击Config文件页的新增按钮");
			$('#page7_config').modal();
			$("#configSubmit").attr("hidedata", 1);
			$("#configSubmit").attr("oldValue", "null");
			clearConfigPart();
		} else if(_bIndex == 1 || _bIndex == 2 || _bIndex == 3 || _bIndex == 4) {
			console.log("点击系统设置大项的新增按钮");
			$('#page7_sys').modal();
			$("#sysSubmit").attr("hidedata", 1);
			$("#sysSubmit").attr("oldValue", "null");
			clearSysPart(_bIndex);
		} else if(_bIndex == 5) {
			console.log("点击MK的新增按钮");
			$('#page7_module').modal();
			$("#moduleSubmit").attr("hidedata", 1);
			$("#moduleSubmit").attr("oldValue", "null");
			clearMKPart();
		} else if(_bIndex == 6) {
			console.log("点击Prop的新增按钮");
//			clearPropPart();
		}
		$(".modal-backdrop").addClass("new-backdrop");
	});
}
function configCategoryQueryResult() {
	if(this.readyState == 4) {
		if(this.status == 200) {
			var data = JSON.parse(this.responseText);
			console.log(data);
			if(data.resultCode == "0") {
				$("#configSelect").attr("hasvalue", "true");
				var _myConfigTbody = document.getElementById("myConfigTbody");
				for(var i = 0; i < data.resultData.length; i++) {
					document.getElementById("configSelect").options.add(new Option(data.resultData[i].category));
					_myConfigTbody.innerHTML += '<tr><td class="configitems" category="'+ data.resultData[i].category +'" id="configTr'+data.resultData[i].orderId+'"><div class="grouptitle" title="'+data.resultData[i].category+'">'+data.resultData[i].category+'</div></td></tr>';
				}
			}
		}
		var node1 = '{}';
		sendHTTPRequest("/config/query", node1, configQueryResult);
	}
}

function configQueryResult() {
	if(this.readyState == 4) {
		if(this.status == 200) {
			var data = JSON.parse(this.responseText);
			console.log(data);
			if(data.resultCode == "0") {
				editEachPage("0",data.resultData);
			}
		}
	}
}

//function settingQueryResult() {
//	if(this.readyState == 4) {
//		if(this.status == 200) {
//			var data = JSON.parse(this.responseText);
//			console.log(data);
//			if(data.resultCode == "0") {
//				var kk = 0;
//				var _rowSysSBoot = document.getElementById("SysSTableBoot");
//				var _rowSysSSetting = document.getElementById("SysSTableSetting");
//				var _rowSysSNet = document.getElementById("SysSTableNet");
//				var _rowSysSPicture = document.getElementById("SysSTablePicture");
//				var _rowSysSSound = document.getElementById("SysSTableSound");
//				var _rowSysSGeneral = document.getElementById("SysSTableGeneral");
//
//				var _rowSourceBoxQuick = document.getElementById("SourceBoxTableQuick");
//				var _rowSourceBoxGeneral = document.getElementById("SourceBoxTableGeneral");
//
//				var _rowMarketShowSound = document.getElementById("MarketShowSound");
//				var _rowMarketShowPicture = document.getElementById("MarketShowPicture");
//
//				var _rowMiddleware1 = document.getElementById("Middleware1");
//				var _rowMiddleware2 = document.getElementById("Middleware2");
//
//				_rowSysSBoot.innerHTML = '<div class="grouptitle" title="PlayerLibrary">开机引导</div>';
//				_rowSysSSetting.innerHTML = '<div class="grouptitle" title="App">设置入口页</div>';
//				_rowSysSNet.innerHTML = '<div class="grouptitle" title="net_connect_setting">网络与连接</div>';
//				_rowSysSPicture.innerHTML = '<div class="grouptitle" title="picture_setting">图像设置</div>';
//				_rowSysSSound.innerHTML = '<div class="grouptitle" title="sound_setting">声音设置</div>';
//				_rowSysSGeneral.innerHTML = '<div class="grouptitle" title="general_setting">通用设置</div>';
//
//				_rowSourceBoxQuick.innerHTML = '<div class="grouptitle" title="quickOperate">快捷功能</div>';
//				_rowSourceBoxGeneral.innerHTML = '<div class="grouptitle" title="General">常用设置</div>';
//
//				_rowMarketShowSound.innerHTML = '<div class="grouptitle" title="PlayerLibrary">声音演示</div>';
//				_rowMarketShowPicture.innerHTML = '<div class="grouptitle" title="App">图像演示</div>';
//
//				_rowMiddleware1.innerHTML = '<div class="grouptitle" title="Middleware1">输入信号源</div>';
//				_rowMiddleware2.innerHTML = '<div class="grouptitle" title="Middleware2">支持纵横比</div>';
//
//				for(var i = 0; i < data.resultData.length; i++) {
//					kk = i;
//					if(data.resultData[i].level1 == "系统设置") {
//						if(data.resultData[i].level2 == "开机引导") {
//							_rowSysSBoot.innerHTML += "<div class='col-xs-4 subitem'><a class='page7_a' part='1' hidedata='" + JSON.stringify(data.resultData[kk]) + "' title='" + data.resultData[kk].engName + "' name='" + data.resultData[kk].engName + "'>" + data.resultData[kk].cnName + "</a></div>";
//						} else if(data.resultData[i].level2 == "设置入口页") {
//							_rowSysSSetting.innerHTML += "<div class='col-xs-4 subitem'><a class='page7_a' part='1' hidedata='" + JSON.stringify(data.resultData[kk]) + "' title='" + data.resultData[kk].engName + "' name='" + data.resultData[kk].engName + "'>" + data.resultData[kk].cnName + "</a></div>";
//						} else if(data.resultData[i].level2 == "网络与连接") {
//							_rowSysSNet.innerHTML += "<div class='col-xs-4 subitem'><a class='page7_a' part='1' hidedata='" + JSON.stringify(data.resultData[kk]) + "' title='" + data.resultData[kk].engName + "' name='" + data.resultData[kk].engName + "'>" + data.resultData[kk].cnName + "</a></div>";
//						} else if(data.resultData[i].level2 == "图像设置") {
//							_rowSysSPicture.innerHTML += "<div class='col-xs-4 subitem'><a class='page7_a' part='1' hidedata='" + JSON.stringify(data.resultData[kk]) + "' title='" + data.resultData[kk].engName + "' name='" + data.resultData[kk].engName + "'>" + data.resultData[kk].cnName + "</a></div>";
//						} else if(data.resultData[i].level2 == "声音设置") {
//							_rowSysSSound.innerHTML += "<div class='col-xs-4 subitem'><a class='page7_a' part='1' hidedata='" + JSON.stringify(data.resultData[kk]) + "' title='" + data.resultData[kk].engName + "' name='" + data.resultData[kk].engName + "'>" + data.resultData[kk].cnName + "</a></div>";
//						} else if(data.resultData[i].level2 == "通用设置") {
//							_rowSysSGeneral.innerHTML += "<div class='col-xs-4 subitem'><a class='page7_a' part='1' hidedata='" + JSON.stringify(data.resultData[kk]) + "' title='" + data.resultData[kk].engName + "' name='" + data.resultData[kk].engName + "'>" + data.resultData[kk].cnName + "</a></div>";
//						}
//					} else if(data.resultData[i].level1 == "信号源工具箱") {
//						if(data.resultData[i].level2 == "快捷功能") {
//							_rowSourceBoxQuick.innerHTML += "<div class='col-xs-4 subitem'><a class='page7_a' part='2' hidedata='" + JSON.stringify(data.resultData[kk]) + "' title='" + data.resultData[kk].engName + "' name='" + data.resultData[kk].engName + "'>" + data.resultData[kk].cnName + "</a></div>";
//						} else if(data.resultData[i].level2 == "常用设置") {
//							_rowSourceBoxGeneral.innerHTML += "<div class='col-xs-4 subitem'><a class='page7_a' part='2' hidedata='" + JSON.stringify(data.resultData[kk]) + "' title='" + data.resultData[kk].engName + "' name='" + data.resultData[kk].engName + "'>" + data.resultData[kk].cnName + "</a></div>";
//						}
//					} else if(data.resultData[i].level1 == "卖场演示") {
//						if(data.resultData[i].level2 == "声音演示") {
//							_rowMarketShowSound.innerHTML += "<div class='col-xs-4 subitem'><a class='page7_a' part='3' hidedata='" + JSON.stringify(data.resultData[kk]) + "' title='" + data.resultData[kk].engName + "' name='" + data.resultData[kk].engName + "'>" + data.resultData[kk].cnName + "</a></div>";
//						} else if(data.resultData[i].level2 == "图像演示") {
//							_rowMarketShowPicture.innerHTML += "<div class='col-xs-4 subitem'><a class='page7_a' part='3' hidedata='" + JSON.stringify(data.resultData[kk]) + "' title='" + data.resultData[kk].engName + "' name='" + data.resultData[kk].engName + "'>" + data.resultData[kk].cnName + "</a></div>";
//						}
//					} else if(data.resultData[i].level1 == "中间件") {
//						if(data.resultData[i].level2 == "输入信号源") {
//							_rowMiddleware1.innerHTML += "<div class='col-xs-4 subitem'><a class='page7_a' part='4' hidedata='" + JSON.stringify(data.resultData[kk]) + "' title='" + data.resultData[kk].engName + "' name='" + data.resultData[kk].engName + "'>" + data.resultData[kk].cnName + "</a></div>";
//						} else if(data.resultData[i].level2 == "支持纵横比") {
//							_rowMiddleware2.innerHTML += "<div class='col-xs-4 subitem'><a class='page7_a' part='4' hidedata='" + JSON.stringify(data.resultData[kk]) + "' title='" + data.resultData[kk].engName + "' name='" + data.resultData[kk].engName + "'>" + data.resultData[kk].cnName + "</a></div>";
//						}
//					}
//				}
//			}
//		}
////		var node3 = '{}';
////		sendHTTPRequest("/module/query", node3, moduleQueryResult);
//	}
//}
function moduleQueryResult() {
	if(this.readyState == 4) {
		if(this.status == 200) {
			var data = JSON.parse(this.responseText);
			console.log(data);
			if(data.resultCode == "0") {
				editEachPage("5",data.resultData);
			}
			//buttonInitAfter();
		}
	}
}
//function propQueryResult() {
//	if(this.readyState == 4) {
//		if(this.status == 200) {
//			var data = JSON.parse(this.responseText);
//			console.log(data);
//			if(data.resultCode == "0") {
//
//			}
//		}
//	}
//}
//
//function buttonInitAfter() {
//	/*配置管理板块-修改 */
//	var _aPart, _aIndex, _cHidedata = "";
//	$(".page7_a").click(function() {
//		_aIndex = $(".page7_a").index($(this));
//		_cHidedata = $(this).attr("hidedata");
//		_aPart = $(this).attr("part");
//		eachPartChange(_aPart, _cHidedata);
//	});
//
//	/*config-保存*/
//	$("#configSubmit").click(function() {
//		saveInConfig();
//	});
//	/*mk-保存*/
//	$("#moduleSubmit").click(function() {
//		saveInMK();
//	});
//	$("#sysSubmit").click(function() {
//		saveInSys();
//	});
//
//	var _cIndex2, _box1, _box2 = "";
//	$(".defaultOption").click(function() {
//		_cIndex2 = $(".defaultOption").index($(this));
//		_box1 = $(this).attr("boxone");
//		_box2 = $(this).attr("boxtwo");
//		console.log(_box1 + "---" + _box2);
//		document.getElementById(_box1).style.display = "block";
//		document.getElementById(_box2).style.display = "none";
//	});
//
//	/*枚举各个图标的点击事件*/
//	var _cIndex3 = "";
//	$(".menuEdit").click(function() {
//		_cIndex3 = $(".menuEdit").index($(this));
//		console.log(_cIndex3);
//		if(_cIndex3 == 0) {
//			console.log("lxw " + "点击的是添加");
//			var parentDiv = document.getElementsByClassName("ADCSEfficient")[0];
//			var child1 = document.createElement("div");
//			child1.setAttribute("class", "menuUnit");
//			var child2 = document.createElement("input");
//			child2.setAttribute("type", "text");
//			child2.setAttribute("class", "menuUnitInput");
//			child2.setAttribute("placeholder", "Value");
//			child1.appendChild(child2);
//			parentDiv.appendChild(child1);
//		} else if(_cIndex3 == 1) {
//			console.log("lxw " + "点击的是删除");
//			var forDeleteObject = document.getElementsByClassName("ADCSEfficient")[0];
//			var deleteObject = document.getElementsByClassName("menuUnit");
//			var curLength = deleteObject.length;
//			console.log("lxw " + curLength);
//			if(curLength != 0) {
//				forDeleteObject.removeChild(document.getElementsByClassName("menuUnit")[curLength - 1]);
//			} else {
//				console.log("lxw 已经删除完...");
//			}
//		} else if(_cIndex3 == 2) {
//			console.log("lxw " + "点击的是全部删除");
//			var appendObject = document.getElementsByClassName("ADCSEfficient")[0];
//			appendObject.innerHTML = "";
//		}
//	});
//
//}
//
//function eachPartChange(part, data) {
//	console.log(part + "---" + data);
//	if(part == 0) {
//		console.log("config子项的修改");
//		$('#page7_config').modal();
//		$("#configSubmit").attr("hidedata", 2);
//		$("#configSubmit").attr("oldValue", data);
//		clearConfigPart();
//		editConfigModel(data);
//	} else if(part == 1 || part == 2 || part == 3 || part == 4) {
//		console.log("系统设置子项的修改");
//		$('#page7_sys').modal();
//		$("#sysSubmit").attr("hidedata", 1);
//		$("#sysSubmit").attr("oldValue", "null");
//		clearSysPart(part);
//		editSysModel(part, data);
//	} else if(part == 5) {
//		console.log("MK子项的修改");
//		$('#page7_module').modal();
//		$("#moduleSubmit").attr("hidedata", 2);
//		$("#moduleSubmit").attr("oldValue", data);
//		clearMKPart();
//		editMKModel(data);
//	}
//	$(".modal-backdrop").addClass("new-backdrop");
//}
//
//function editConfigModel(data) {
//	console.log(JSON.parse(data));
//	$("#configCName").val(JSON.parse(data).cnName);
//	$("#configEName").val(JSON.parse(data).engName);
//	$("#configEName").attr('disabled', '');
//	if(JSON.parse(data).typeStr == "string") {
//		$("#configString").css("display", "block");
//		$("#configTableBoxEnum").css("display", "none");
//		$("#configString").val(JSON.parse(data).defaultValue);
//		for(var i = 0; i < $(".menuUnitInput").length; i++) {
//			document.getElementsByClassName("menuUnitInput")[i].value = "";
//		};
//	} else {
//		$("#configString").css("display", "none");
//		$("#configTableBoxEnum").css("display", "block");
//		var oOpt = new Array();
//		oOpt = JSON.parse(data).options;
//		document.getElementsByClassName("ADCSEfficient")[0].innerHTML = "";
//		console.log(JSON.parse(oOpt));
//		console.log(JSON.parse(oOpt).length);
//		for(var j = 0; j < JSON.parse(oOpt).length; j++) {
//			var parentDiv = document.getElementsByClassName("ADCSEfficient")[0];
//			var child1 = document.createElement("div");
//			child1.setAttribute("class", "menuUnit");
//			var child2 = document.createElement("input");
//			child2.setAttribute("type", "text");
//			child2.setAttribute("class", "menuUnitInput");
//			child2.setAttribute("placeholder", "Value");
//			child1.appendChild(child2);
//			parentDiv.appendChild(child1);
//		};
//		for(var k = 0; k < JSON.parse(oOpt).length; k++) {
//			$(".menuUnitInput")[k].value = JSON.parse(oOpt)[k];
//		};
//	}
//	$("#configInstr").val(JSON.parse(data).descText);
//	var categoryClass = JSON.parse(data).category;
//	var opt = document.getElementById("configSelect").getElementsByTagName("option");
//	console.log(opt);
//	for(var j = 0; j < opt.length; j++) {
//		console.log(opt[j].value + "---" + categoryClass);
//		opt[j].removeAttribute("selected");
//		if(opt[j].value == categoryClass) {
//			console.log(j);
//			opt[j].setAttribute("selected", "");
//		}
//	};
//}
//
//function editSysModel(part, data) {
//	console.log(JSON.parse(data));
//	$("#sysCName").val(JSON.parse(data).cnName);
//	$("#sysEName").val(JSON.parse(data).engName);
//	$("#sysInstr").val(JSON.parse(data).descText);
//	var categoryClass = JSON.parse(data).category;
//	var opt = document.getElementById("sysSelect").getElementsByTagName("option");
//	for(var j = 0; j < opt.length; j++) {
//		opt[j].removeAttribute("selected");
//		if(opt[j].value == categoryClass) {
//			opt[j].setAttribute("selected", "");
//		}
//	};
//}
//
//function editMKModel(data) {
//	console.log(data);
//	document.getElementById("moduleCName").value = JSON.parse(data).cnName;
//	document.getElementById("moduleEName").value = JSON.parse(data).engName;
//	document.getElementById("moduleEName").setAttribute('disabled', '');
//	document.getElementById("moduleEName").style.backgroundColor = "#ebebe4";
//	document.getElementById("moduleSrc").value = JSON.parse(data).gitPath;
//	document.getElementById("moduleInstr").value = JSON.parse(data).descText;
//
//	var childSelect = document.getElementById("moduleSelect");
//	console.log(childSelect.options.length);
//	for(var j = 0; j < childSelect.options.length; j++) {
//		if(childSelect.options[j].value == JSON.parse(data).category) {
//			childSelect.options[j].selected = true;
//		} else {
//			childSelect.options[j].selected = false;
//		}
//	};
//}
//
function clearConfigPart() {
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
	$("#configSelect")[0].options[0].selected = true;
}
function clearSysPart(num) {
	document.getElementById("sysCName").value = "";
	document.getElementById("sysEName").value = "";
	document.getElementById("sysInstr").value = "";
	$("#sysSelect")[0].options[0].selected = true;
}
function clearMKPart() {
	document.getElementById("moduleCName").value = "";
	document.getElementById("moduleEName").value = "";
	document.getElementById("moduleSrc").value = "";
	document.getElementById("moduleEName").removeAttribute('disabled');
	document.getElementById("moduleEName").style.backgroundColor = "white";
	document.getElementById("moduleInstr").value = "";
//	$("#moduleSelect")[0].options[0].selected = true;
}
//function saveInConfig() {
//	var _Hidendata = $("#configSubmit").attr("hidedata");
//	var _oldValue = $("#configSubmit").attr("oldValue");
//
//	var node = null; //向后台传递的数据
//
//	var newConfigEnName = $("#configEName").val();
//	var newConfigCzName = $("#configCName").val();
//	var newConfigSelect = $("#configSelect").val();
//	var newConfigInstr = $("#configInstr").val();
//	newConfigInstr = newConfigInstr.replace(new RegExp("\"", "gm"), "\\\"");
//	newConfigInstr = newConfigInstr.replace(new RegExp("\n", "gm"), "\\n");
//	var newConfigType = "";
//	var newConfigOptions = new Array();
//	var newConfigString = "";
//	newConfigString = $("#configString").val();
//	newConfigString = newConfigString.replace(new RegExp("\"", "gm"), "\\\"");
//	newConfigString = newConfigString.replace(new RegExp("\n", "gm"), "\\n");
//	var newConfigOrderId = "";
//	var inputNum = document.getElementsByClassName("menuUnitInput");
//	var inputNumState = 0; //枚举型为空时的状态值
//	for(var i = 0; i < inputNum.length; i++) {
//		if(inputNum[i].value != "") {
//			inputNumState = 1;
//		}
//	}
//	if(newConfigCzName == "" || newConfigEnName == "" || newConfigInstr == "" || (newConfigString == "" && inputNumState == 0)) {
//		console.log("数据项都为空");
//		$("#configErrorInfo")[0].innerHTML = "请确保所有项不为空！";
//		setTimeout('$("#configErrorInfo")[0].innerHTML = "　"', 3000);
//	} else {
//		if(newConfigString != "" && inputNumState == 1) {
//			console.log("字符串型不为空，枚举型不为空！！！冲突！！！！");
//			$("#configErrorInfo")[0].innerHTML = "输入有误，请确保字符串与枚举型的唯一！";
//			setTimeout('$("#configErrorInfo")[0].innerHTML = "　"', 3000);
//		} else if(newConfigString != "" && inputNumState == 0) {
//			console.log("枚举型为空，字符串型！！！");
//			newConfigType = "string";
//			newConfigOptions = "";
//			newConfigString = $("#configString").val();
//		} else if(newConfigString == "" && inputNumState == 1) {
//			console.log("枚举型不为空，字符串型为空！！！");
//			newConfigType = "enum";
//			var newConfigMenuDiv = document.getElementsByClassName("ADCSEfficient")[0];
//			var valueTwo = null;
//			for(var i = 0; i < $(".menuUnit").length; i++) {
//				valueTwo = newConfigMenuDiv.getElementsByTagName("input")[i].value;
//				newConfigOptions.push(valueTwo);
//			}
//			newConfigString = newConfigOptions[0];
//		}
//		console.log("engName = " + newConfigEnName);
//		console.log("cnName = " + newConfigCzName);
//		console.log("category = " + newConfigSelect);
//		console.log("type = " + newConfigType);
//		console.log("options = " + newConfigOptions);
//		console.log("defaultValue = " + newConfigString);
//		console.log("desc = " + newConfigInstr);
//		if(_Hidendata == 1) {
//			console.log("lxw in edit 新增");
//			node = '{"engName":"' + newConfigEnName + '","cnName":"' + newConfigCzName + '","category":"' + newConfigSelect + '","type":"' + newConfigType + '","options":"[' + newConfigOptions + ']","defaultValue":"' + newConfigString + '","desc":"' + newConfigInstr + '"}';
//			console.log("lxw " + node);
//			sendHTTPRequest("/config/add", node, returnConfigAddInfo);
//		} else {
//			console.log("lxw in edit 修改");
//			newConfigOrderId = JSON.parse(_oldValue).orderId;
//			console.log("orderId = " + newConfigOrderId);
//			node = '{"engName":"' + newConfigEnName + '","cnName":"' + newConfigCzName + '","category":"' + newConfigSelect + '","type":"' + newConfigType + '","options":"[' + newConfigOptions + ']","defaultValue":"' + newConfigString + '","desc":"' + newConfigInstr + '","orderId":"' + newConfigOrderId + '"}';
//			console.log("lxw " + node);
//			sendHTTPRequest("/config/update", node, returnConfigAddInfo);
//		}
//	}
//}
//
//function saveInSys() {
//	var _Hidendata2 = $("#sysSubmit").attr("hidedata");
//	var _oldValue2 = $("#sysSubmit").attr("oldValue");
//	console.log(_oldValue2);
//
//	var newSysCName = document.getElementById("sysCName").value;
//	var newSysEName = document.getElementById("sysEName").value;
//	var newSysInstr = document.getElementById("sysInstr").value;
//	var newSysSelect = document.getElementById("sysSelect").value;
//
//	newSysCName = newSysCName.replace(/(^\s*)|(\s*$)/g, "");
//	newSysEName = newSysEName.replace(/(^\s*)|(\s*$)/g, "");
//	newSysInstr = newSysInstr.replace(/(^\s*)|(\s*$)/g, "");
//
//	if(newSysCName == "" || newSysEName == "" || newSysInstr == "") {
//		console.log("存在空项");
//		document.getElementById("sysErrorInfo").style.display = "block";
//		if(newSysCName == "") {
//			document.getElementById("sysCName").innerHTML = "模块中文名项不能为空！";
//		} else if(newSysEName == "") {
//			document.getElementById("sysEName").innerHTML = "模块英文名项不能为空！";
//		} else if(newSysInstr == "") {
//			document.getElementById("sysInstr").innerHTML = "模块描述项不能为空！";
//		}
//		setTimeout("document.getElementById('sysErrorInfo').innerHTML='　'", 3000);
//	} else {
//		if(_Hidendata2 == 1) {
//			console.log("lxw sys 新增");
//			var node = '{"engName":"' + newSysEName + '","cnName":"' + newSysCName + '","category":"' + newSysSelect + '","desc":"' + newSysInstr + '"}';
//			console.log(node);
//			//sendHTTPRequest("/module/add", node, returnMKAddInfo);
//		} else {
//			console.log("lxw sys 修改");
//			_oldValue3 = JSON.parse(_oldValue3);
//			var node = '{"engName":"' + newSysEName + '","cnName":"' + newSysCName + '","category":"' + newSysSelect + '","desc":"' + newSysInstr + '"}';
//			console.log("lxw " + node);
//			//sendHTTPRequest("/module/update", node, returnMKAddInfo);
//		}
//	}
//
//}
//
//function saveInMK() {
//	var _Hidendata3 = $("#moduleSubmit").attr("hidedata");
//	var _oldValue3 = $("#moduleSubmit").attr("oldValue");
//	console.log(_oldValue3);
//
//	var newModuleCzName = document.getElementById("moduleCName").value;
//	var newModuleEnName = document.getElementById("moduleEName").value;
//	var newModuleSrc = document.getElementById("moduleSrc").value;
//	var newModuleInstr = document.getElementById("moduleInstr").value;
//	var newModuleSelect = document.getElementById("moduleSelect").value;
//
//	newModuleCzName = newModuleCzName.replace(/(^\s*)|(\s*$)/g, "");
//	newModuleEnName = newModuleEnName.replace(/(^\s*)|(\s*$)/g, "");
//	newModuleSrc = newModuleSrc.replace(/(^\s*)|(\s*$)/g, "");
//	newModuleInstr = newModuleInstr.replace(/(^\s*)|(\s*$)/g, "");
//	console.log("lxw " + newModuleCzName + "--" + newModuleEnName + "--" + newModuleSrc + "--" + newModuleInstr + "--" + newModuleSelect);
//
//	if(newModuleCzName == "" || newModuleEnName == "" || newModuleSrc == "" || newModuleInstr == "") {
//		console.log("存在空项");
//		document.getElementById("moduleErrorInfo").style.display = "block";
//		if(newModuleCzName == "") {
//			document.getElementById("moduleErrorInfo").innerHTML = "模块中文名项不能为空！";
//		} else if(newModuleEnName == "") {
//			document.getElementById("moduleErrorInfo").innerHTML = "模块英文名项不能为空！";
//		} else if(newModuleSrc == "") {
//			document.getElementById("moduleErrorInfo").innerHTML = "模块路径项不能为空！";
//		} else if(newModuleInstr == "") {
//			document.getElementById("moduleErrorInfo").innerHTML = "描述项不能为空！";
//		}
//		setTimeout("document.getElementById('moduleErrorInfo').innerHTML='　'", 3000);
//	} else {
//		if(_Hidendata3 == 1) {
//			console.log("lxw model 新增");
//			var node = '{"engName":"' + newModuleEnName + '","cnName":"' + newModuleCzName + '","category":"' + newModuleSelect + '","desc":"' + newModuleInstr + '","gitPath":"' + newModuleSrc + '"}';
//			console.log(node);
//			sendHTTPRequest("/module/add", node, returnMKAddInfo);
//		} else {
//			console.log("lxw model 修改");
//			_oldValue3 = JSON.parse(_oldValue3);
//			var node = '{"engName":"' + newModuleEnName + '","cnName":"' + newModuleCzName + '","category":"' + newModuleSelect + '","desc":"' + newModuleInstr + '","gitPath":"' + newModuleSrc + '","orderId":"' + _oldValue3.orderId + '"}';
//			console.log("lxw " + node);
//			sendHTTPRequest("/module/update", node, returnMKAddInfo);
//		}
//	}
//}
//
//function returnMKAddInfo() {
//	if(this.readyState == 4) {
//		if(this.status == 200) {
//			var data = JSON.parse(this.responseText);
//			console.log(data);
//			if(data.resultCode == "0") {
//				console.log("数据添加成功");
//				$("#page7_module").modal('hide');
//				freshModuleAddHtml();
//
//			} else {
//				console.log("数据添加失败");
//				document.getElementById("moduleErrorInfo").innerHTML = "添加失败！该内容或已存在。";
//				setTimeout("document.getElementById('moduleErrorInfo').innerHTML='　'", 3000);
//
//			}
//		}
//	}
//}
//
//function returnSysAddInfo() {
//	if(this.readyState == 4) {
//		if(this.status == 200) {
//			var data = JSON.parse(this.responseText);
//			console.log(data);
//			if(data.resultCode == "0") {
//				console.log("数据添加成功");
//				$("#page7_sys").modal('hide');
//				freshModuleAddHtml();
//
//			} else {
//				console.log("数据添加失败");
//				document.getElementById("sysErrorInfo").innerHTML = "添加失败！该内容或已存在。";
//				setTimeout("document.getElementById('sysErrorInfo').innerHTML='　'", 3000);
//			}
//		}
//	}
//}
//
//function returnConfigAddInfo() {
//	if(this.readyState == 4) {
//		if(this.status == 200) {
//			var data = JSON.parse(this.responseText);
//			console.log(data);
//			if(data.resultCode == "0") {
//				console.log("数据添加成功");
//				$("#page7_config").modal('hide');
//				freshModuleAddHtml();
//
//			} else {
//				console.log("数据添加失败");
//				document.getElementById("configErrorInfo").innerHTML = "添加失败！该内容或已存在。";
//				setTimeout("document.getElementById('configErrorInfo').innerHTML='　'", 3000);
//			}
//		}
//	}
//}
//
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
		var node31 = '{}';
		var ajaxUrl = "";
		if(num == 0) {
			ajaxUrl = "/config/queryCategory";
		} else if(num == 1 || num == 2 || num == 3 || num == 4) {
			ajaxUrl = "/settings/queryCategory";
		} else if(num == 5) {
			ajaxUrl = "/module/queryCategory";
		}
		sendHTTPRequest(ajaxUrl, node31, categoryQueryResult);
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
					$("#configSelect").attr("hasvalue", "true");
					var _myConfigTbody = document.getElementById("myConfigTbody");
					for(var i = 0; i < data.resultData.length; i++) {
						document.getElementById("configSelect").options.add(new Option(data.resultData[i].category));
						_myConfigTbody.innerHTML += '<tr><td class="configitems" category="'+ data.resultData[i].category +'" id="configTr'+data.resultData[i].orderId+'"><div class="grouptitle" title="'+data.resultData[i].category+'">'+data.resultData[i].category+'</div></td></tr>';
					}
					var node = '{}';
					sendHTTPRequest("/config/query", node, configQueryResult);
				}else if(_curId==1||_curId==2||_curId==3||_curId==4) {
					console.log(data);
					var _mySysSettingTbody = document.getElementById("mySysSettingTbody");
					var _mySourceBoxTbody = document.getElementById("mySourceBoxTbody");
					var _myMarketShowTbody = document.getElementById("myMarketShowTbody");
					var _myMiddlewareTbody = document.getElementById("myMiddlewareTbody");
					
					for(var i = 0; i < data.resultData.length; i++) {
						if (data.resultData[i].level1 == "系统设置") {
							
						} else if(data.resultData[i].level1 == "信号源工具箱"){
							
						}else if(data.resultData[i].level1 == "卖场演示"){
							
						}else if(data.resultData[i].level1 == "中间件"){
							
						}
					}
					
					var node = '{}';
					sendHTTPRequest("/config/query", node, settingQueryResult);
				} else if(_curId==5){
					$("#moduleSelect").attr("hasvalue", "true");
					var _myMKTbody = document.getElementById("myMKTbody");
					for(var i = 0; i < data.resultData.length; i++) {
						document.getElementById("moduleSelect").options.add(new Option(data.resultData[i].category));
						_myMKTbody.innerHTML += '<tr><td class="moduleitems" category="'+ data.resultData[i].category +'" id="moduleTr'+data.resultData[i].orderId+'"><div class="grouptitle" title="'+data.resultData[i].category+'">'+data.resultData[i].category+'</div></td></tr>';
					}
					var node = '{}';
					sendHTTPRequest("/module/query", node, moduleQueryResult);
				}
			}
		}
	}
}

function editEachPage(num,array){
	console.log(num+"--------"+array);
	$(".page7_tabs:eq(" + (num) + ")").attr("hasvalue","true");
	if(num==0){
		for (var j=0; j< $(".configitems").length; j++) {
			for(var i = 0; i < array.length; i++) {
				if(array[i].category == $(".configitems:eq(" + (j) + ")").attr("category")) {
					$(".configitems")[j].innerHTML += "<div class='col-xs-4 subitem'><a class='page7_a' part='0' hidedata='" + JSON.stringify(array[i]) + "' title='" + array[i].engName + "' name='" + array[i].engName + "'>" + array[i].cnName + "</a></div>";
				}
			}
		}
	}else if(num==1||num==2||num==3||num==4){
		
	} else if(num==5){
		for (var j=0; j< $(".moduleitems").length; j++) {
			for(var i = 0; i < array.length; i++) {
				if(array[i].category == $(".moduleitems:eq(" + (j) + ")").attr("category")) {
					$(".moduleitems")[j].innerHTML += "<div class='col-xs-4 subitem'><a class='page7_a' part='5' hidedata='" + JSON.stringify(array[i]) + "' title='" + array[i].engName + "' name='" + array[i].engName + "'>" + array[i].cnName + "</a></div>";
				}
			}
		}
	}
}

//
///*刷新页面*/
//function freshModuleAddHtml() {
//	var htmlObject = parent.document.getElementById("tab_userMenu7");
//	console.log("lxw " + htmlObject.firstChild.src);
//	htmlObject.firstChild.src = "page7.html";
//
//	//	var indexObject = parent.document.getElementById("home");
//	//  var iframe = indexObject.getElementsByTagName("iframe");
//	//  iframe[0].src = "wait.html";
//	//  if(parent.document.getElementById("tab_userMenu2")){
//	//	    var htmlObject1 = parent.document.getElementById("tab_userMenu2");
//	//	    htmlObject1.firstChild.src = "review.html";
//	//	}  
//}