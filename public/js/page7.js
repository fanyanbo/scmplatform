document.write("<script language=javascript src='../js/sentHTTP.js' charset=\"utf-8\"></script>");

$(function() {
	$(".page7_boxes")[0].style.display = "block";
	buttonInitBefore();
	//model/query----config/query----setting/query
	var node1 = '{}';
	sendHTTPRequest("/config/query", node1, configQueryResult);
});

function buttonInitBefore() {
	var _curIndex, _bIndex = "";
	$(".page7_tabs").click(function() {
		_curIndex = $(".page7_tabs").index($(this));
		console.log(_curIndex);
		for(var k = 0; k < $(".page7_tabs").length; k++) {
			$(".page7_boxes")[k].style.display = "none";
			$(".page7_tabs")[k].style.backgroundColor = "buttonface";
		}
		$(".page7_boxes")[_curIndex].style.display = "block";
		$(".page7_tabs")[_curIndex].style.backgroundColor = "darkturquoise";
	});
	$(".page7_boxes .btn").click(function() {
		_bIndex = $(".page7_boxes .btn").index($(this));
		console.log(_bIndex);
		if (_bIndex == 0) {
			console.log("点击Config文件页的新增按钮");
			$('#page7_config').modal();
			$("#configSubmit").attr("hidedata",1);
			$("#configSubmit").attr("oldValue","null");
			clearAllPart();
		} else if(_bIndex == 1){
			console.log("点击系统设置的新增按钮");
			
			
		}else if(_bIndex == 2){
			console.log("点击系统信号源工具箱的新增按钮");
			
			
		}else if(_bIndex == 3){
			console.log("点击卖场演示的新增按钮");
			
			
		}else if(_bIndex == 4){
			console.log("点击系统中间件的新增按钮");
			
			
		} else if(_bIndex == 5){
			console.log("点击MK的新增按钮");
			$('#myModuleAddChangeModal').modal();
			$("#inputModuleSubmit").attr("hidedata",1);
			$("#inputModuleSubmit").attr("oldValue","null");
			clearAllPart2();
			
		} else if(_bIndex == 6){
			console.log("点击Prop的新增按钮");
			
			
		}
		$(".modal-backdrop").addClass("new-backdrop");
	});
}
function configQueryResult() {
	if(this.readyState == 4) {
		if(this.status == 200) {
			var data = JSON.parse(this.responseText);
			console.log(data);
			if(data.resultCode == "0") {
				var kk = 0;

				var _rowConfigBase = document.getElementById("configTableTdBase");
				var _rowConfigServerip = document.getElementById("configTableTdServerip");
				var _rowConfigAd = document.getElementById("configTableTdAd");
				var _rowConfigChannel = document.getElementById("configTableTdChannel");
				var _rowConfigLocalmedia = document.getElementById("configTableTdLocalmedia");
				var _rowConfigOther = document.getElementById("configTableTdOther");
				
				_rowConfigBase.innerHTML = '<div class="grouptitle" title="base">基础功能</div>';
				_rowConfigServerip.innerHTML = '<div class="grouptitle" title="serverip">服务器IP配置</div>';
				_rowConfigAd.innerHTML = '<div class="grouptitle" title="ad">广告配置</div>';
				_rowConfigChannel.innerHTML = '<div class="grouptitle" title="channel">TV通道</div>';
				_rowConfigLocalmedia.innerHTML = '<div class="grouptitle" title="localmedia">本地媒体</div>';
				_rowConfigOther.innerHTML = '<div class="grouptitle" title="other">其他功能</div>';
				
				
				for(var i = 0; i < data.resultData.length; i++) {
					kk = i;
					if(data.resultData[i].category == "base") {
						_rowConfigBase.innerHTML += "<div class='col-xs-4 subitem'><a class='page7_a' part='0' hidedata='" + JSON.stringify(data.resultData[kk]) + "' title='" + data.resultData[kk].engName + "' name='" + data.resultData[kk].engName + "'>" + data.resultData[kk].cnName + "</a></div>";
					} else if(data.resultData[i].category == "serverip") {
						_rowConfigServerip.innerHTML += "<div class='col-xs-4 subitem'><a class='page7_a' part='0' hidedata='" + JSON.stringify(data.resultData[kk]) + "' title='" + data.resultData[kk].engName + "' name='" + data.resultData[kk].engName + "'>" + data.resultData[kk].cnName + "</a></div>";
					} else if(data.resultData[i].category == "ad") {
						_rowConfigAd.innerHTML += "<div class='col-xs-4 subitem'><a class='page7_a' part='0' hidedata='" + JSON.stringify(data.resultData[kk]) + "' title='" + data.resultData[kk].engName + "' name='" + data.resultData[kk].engName + "'>" + data.resultData[kk].cnName + "</a></div>";
					} else if(data.resultData[i].category == "channel") {
						_rowConfigChannel.innerHTML += "<div class='col-xs-4 subitem'><a class='page7_a' part='0' hidedata='" + JSON.stringify(data.resultData[kk]) + "' title='" + data.resultData[kk].engName + "' name='" + data.resultData[kk].engName + "'>" + data.resultData[kk].cnName + "</a></div>";
					} else if(data.resultData[i].category == "localmedia") {
						_rowConfigLocalmedia.innerHTML += "<div class='col-xs-4 subitem'><a class='page7_a' part='0' hidedata='" + JSON.stringify(data.resultData[kk]) + "' title='" + data.resultData[kk].engName + "' name='" + data.resultData[kk].engName + "'>" + data.resultData[kk].cnName + "</a></div>";
					} else if(data.resultData[i].category == "other") {
						_rowConfigOther.innerHTML += "<div class='col-xs-4 subitem'><a class='page7_a' part='0' hidedata='" + JSON.stringify(data.resultData[kk]) + "' title='" + data.resultData[kk].engName + "' name='" + data.resultData[kk].engName + "'>" + data.resultData[kk].cnName + "</a></div>";
					}
				}
			}
		}
		var node2 = '{}';
		sendHTTPRequest("/settings/query", node2, settingQueryResult);
	}
}

function settingQueryResult() {
	if(this.readyState == 4) {
		if(this.status == 200) {
			var data = JSON.parse(this.responseText);
			console.log(data);
			if(data.resultCode == "0") {
				var kk = 0;
				var _rowSysSBoot = document.getElementById("SysSTableBoot");
				var _rowSysSSetting = document.getElementById("SysSTableSetting");
				var _rowSysSNet = document.getElementById("SysSTableNet");
				var _rowSysSPicture = document.getElementById("SysSTablePicture");
				var _rowSysSSound = document.getElementById("SysSTableSound");
				var _rowSysSGeneral = document.getElementById("SysSTableGeneral");

				var _rowSourceBoxQuick = document.getElementById("SourceBoxTableQuick");
				var _rowSourceBoxGeneral = document.getElementById("SourceBoxTableGeneral");

				var _rowMarketShowSound = document.getElementById("MarketShowSound");
				var _rowMarketShowPicture = document.getElementById("MarketShowPicture");

				var _rowMiddleware1 = document.getElementById("Middleware1");
				var _rowMiddleware2 = document.getElementById("Middleware2");
				
				_rowSysSBoot.innerHTML = '<div class="grouptitle" title="PlayerLibrary">开机引导</div>';
				_rowSysSSetting.innerHTML = '<div class="grouptitle" title="App">设置入口页</div>';
				_rowSysSNet.innerHTML = '<div class="grouptitle" title="net_connect_setting">网络与连接</div>';
				_rowSysSPicture.innerHTML = '<div class="grouptitle" title="picture_setting">图像设置</div>';
				_rowSysSSound.innerHTML = '<div class="grouptitle" title="sound_setting">声音设置</div>';
				_rowSysSGeneral.innerHTML = '<div class="grouptitle" title="general_setting">通用设置</div>';
				
				_rowSourceBoxQuick.innerHTML = '<div class="grouptitle" title="quickOperate">快捷功能</div>';
				_rowSourceBoxGeneral.innerHTML = '<div class="grouptitle" title="General">常用设置</div>';
				
				_rowMarketShowSound.innerHTML = '<div class="grouptitle" title="PlayerLibrary">声音演示</div>';
				_rowMarketShowPicture.innerHTML = '<div class="grouptitle" title="App">图像演示</div>';
				
				_rowMiddleware1.innerHTML = '<div class="grouptitle" title="Middleware1">输入信号源</div>';
				_rowMiddleware2.innerHTML = '<div class="grouptitle" title="Middleware2">支持纵横比</div>';
				
				
				for(var i = 0; i < data.resultData.length; i++) {
					kk = i;
					if(data.resultData[i].uiGroup1 == "系统设置") {
						if(data.resultData[i].uiGroup2 == "开机引导") {
							_rowSysSBoot.innerHTML += "<div class='col-xs-4 subitem'><a class='page7_a' part='1' hidedata='" + JSON.stringify(data.resultData[kk]) + "' title='" + data.resultData[kk].engName + "' name='" + data.resultData[kk].engName + "'>" + data.resultData[kk].cnName + "</a></div>";
						} else if(data.resultData[i].uiGroup2 == "设置入口页") {
							_rowSysSSetting.innerHTML += "<div class='col-xs-4 subitem'><a class='page7_a' part='1' hidedata='" + JSON.stringify(data.resultData[kk]) + "' title='" + data.resultData[kk].engName + "' name='" + data.resultData[kk].engName + "'>" + data.resultData[kk].cnName + "</a></div>";
						} else if(data.resultData[i].uiGroup2 == "网络与连接") {
							_rowSysSNet.innerHTML += "<div class='col-xs-4 subitem'><a class='page7_a' part='1' hidedata='" + JSON.stringify(data.resultData[kk]) + "' title='" + data.resultData[kk].engName + "' name='" + data.resultData[kk].engName + "'>" + data.resultData[kk].cnName + "</a></div>";
						} else if(data.resultData[i].uiGroup2 == "图像设置") {
							_rowSysSPicture.innerHTML += "<div class='col-xs-4 subitem'><a class='page7_a' part='1' hidedata='" + JSON.stringify(data.resultData[kk]) + "' title='" + data.resultData[kk].engName + "' name='" + data.resultData[kk].engName + "'>" + data.resultData[kk].cnName + "</a></div>";
						} else if(data.resultData[i].uiGroup2 == "声音设置") {
							_rowSysSSound.innerHTML += "<div class='col-xs-4 subitem'><a class='page7_a' part='1' hidedata='" + JSON.stringify(data.resultData[kk]) + "' title='" + data.resultData[kk].engName + "' name='" + data.resultData[kk].engName + "'>" + data.resultData[kk].cnName + "</a></div>";
						} else if(data.resultData[i].uiGroup2 == "通用设置") {
							_rowSysSGeneral.innerHTML += "<div class='col-xs-4 subitem'><a class='page7_a' part='1' hidedata='" + JSON.stringify(data.resultData[kk]) + "' title='" + data.resultData[kk].engName + "' name='" + data.resultData[kk].engName + "'>" + data.resultData[kk].cnName + "</a></div>";
						}
					} else if(data.resultData[i].uiGroup1 == "信号源工具箱") {
						if(data.resultData[i].uiGroup2 == "快捷功能") {
							_rowSourceBoxQuick.innerHTML += "<div class='col-xs-4 subitem'><a class='page7_a' part='2' hidedata='" + JSON.stringify(data.resultData[kk]) + "' title='" + data.resultData[kk].engName + "' name='" + data.resultData[kk].engName + "'>" + data.resultData[kk].cnName + "</a></div>";
						} else if(data.resultData[i].uiGroup2 == "常用设置") {
							_rowSourceBoxGeneral.innerHTML += "<div class='col-xs-4 subitem'><a class='page7_a' part='2' hidedata='" + JSON.stringify(data.resultData[kk]) + "' title='" + data.resultData[kk].engName + "' name='" + data.resultData[kk].engName + "'>" + data.resultData[kk].cnName + "</a></div>";
						}
					} else if(data.resultData[i].uiGroup1 == "卖场演示") {
						if(data.resultData[i].uiGroup2 == "声音演示") {
							_rowMarketShowSound.innerHTML += "<div class='col-xs-4 subitem'><a class='page7_a' part='3' hidedata='" + JSON.stringify(data.resultData[kk]) + "' title='" + data.resultData[kk].engName + "' name='" + data.resultData[kk].engName + "'>" + data.resultData[kk].cnName + "</a></div>";
						} else if(data.resultData[i].uiGroup2 == "图像演示") {
							_rowMarketShowPicture.innerHTML += "<div class='col-xs-4 subitem'><a class='page7_a' part='3' hidedata='" + JSON.stringify(data.resultData[kk]) + "' title='" + data.resultData[kk].engName + "' name='" + data.resultData[kk].engName + "'>" + data.resultData[kk].cnName + "</a></div>";
						}
					} else if(data.resultData[i].uiGroup1 == "中间件") {
						if(data.resultData[i].uiGroup2 == "输入信号源") {
							_rowMiddleware1.innerHTML += "<div class='col-xs-4 subitem'><a class='page7_a' part='4' hidedata='" + JSON.stringify(data.resultData[kk]) + "' title='" + data.resultData[kk].engName + "' name='" + data.resultData[kk].engName + "'>" + data.resultData[kk].cnName + "</a></div>";
						} else if(data.resultData[i].uiGroup2 == "支持纵横比") {
							_rowMiddleware2.innerHTML += "<div class='col-xs-4 subitem'><a class='page7_a' part='4' hidedata='" + JSON.stringify(data.resultData[kk]) + "' title='" + data.resultData[kk].engName + "' name='" + data.resultData[kk].engName + "'>" + data.resultData[kk].cnName + "</a></div>";
						}
					}
				}
			}
		}
		var node3 = '{}';
		sendHTTPRequest("/module/query", node3, modelQueryResult);
	}
}

function modelQueryResult() {
	if(this.readyState == 4) {
		if(this.status == 200) {
			var data = JSON.parse(this.responseText);
			console.log(data);
			if(data.resultCode == "0") {
				var kk = 0;
				var _rowModuleApp = document.getElementById("myMkTableApp");
				var _rowModuleService = document.getElementById("myMkTableService");
				var _rowModuleAppStore = document.getElementById("myMkTableAppStore");
				var _rowModuleHomePage = document.getElementById("myMkTableHomePage");
				var _rowModuleIME = document.getElementById("myMkTableIME");
				var _rowModuleSysApp = document.getElementById("myMkTableSysApp");
				var _rowModuleTV = document.getElementById("myMkTableTV");
				var _rowModuleOther = document.getElementById("myMkTableOther");
				var _rowModulePlayerLibrary = document.getElementById("myMkTablePlayerLibrary");

				_rowModuleApp.innerHTML = '<div class="grouptitle" title="App">App</div>';
				_rowModuleService.innerHTML = '<div class="grouptitle" title="Service">Service</div>';
				_rowModuleAppStore.innerHTML = '<div class="grouptitle" title="AppStore">AppStore</div>';
				_rowModuleHomePage.innerHTML = '<div class="grouptitle" title="HomePage">HomePage</div>';
				_rowModuleIME.innerHTML = '<div class="grouptitle" title="IME">IME</div>';
				_rowModuleSysApp.innerHTML = '<div class="grouptitle" title="SysApp">SysApp</div>';
				_rowModuleTV.innerHTML = '<div class="grouptitle" title="TV">TV</div>';
				_rowModuleOther.innerHTML = '<div class="grouptitle" title="Other">Other</div>';
				_rowModulePlayerLibrary.innerHTML = '<div class="grouptitle" title="PlayerLibrary">PlayerLibrary</div>';

				for(var i = 0; i < data.resultData.length; i++) {
					kk = i;
					if(data.resultData[i].category == "App") {
						_rowModuleApp.innerHTML += "<div class='col-xs-4 subitem'><a class='page7_a' part='5' hidedata='" + JSON.stringify(data.resultData[kk]) + "' title='" + data.resultData[kk].engName + "' name='" + data.resultData[kk].engName + "'>" + data.resultData[kk].cnName + "</a></div>";
					} else if(data.resultData[i].category == "Service") {
						_rowModuleService.innerHTML += "<div class='col-xs-4 subitem'><a class='page7_a' part='5' hidedata='" + JSON.stringify(data.resultData[kk]) + "' title='" + data.resultData[kk].engName + "' name='" + data.resultData[kk].engName + "'>" + data.resultData[kk].cnName + "</a></div>";
					} else if(data.resultData[i].category == "AppStore") {
						_rowModuleAppStore.innerHTML += "<div class='col-xs-4 subitem'><a class='page7_a' part='5' hidedata='" + JSON.stringify(data.resultData[kk]) + "' title='" + data.resultData[kk].engName + "' name='" + data.resultData[kk].engName + "'>" + data.resultData[kk].cnName + "</a></div>";
					} else if(data.resultData[i].category == "HomePage") {
						_rowModuleHomePage.innerHTML += "<div class='col-xs-4 subitem'><a class='page7_a' part='5' hidedata='" + JSON.stringify(data.resultData[kk]) + "' title='" + data.resultData[kk].engName + "' name='" + data.resultData[kk].engName + "'>" + data.resultData[kk].cnName + "</a></div>";
					} else if(data.resultData[i].category == "IME") {
						_rowModuleIME.innerHTML += "<div class='col-xs-4 subitem'><a class='page7_a' part='5' hidedata='" + JSON.stringify(data.resultData[kk]) + "' title='" + data.resultData[kk].engName + "' name='" + data.resultData[kk].engName + "'>" + data.resultData[kk].cnName + "</a></div>";
					} else if(data.resultData[i].category == "SysApp") {
						_rowModuleSysApp.innerHTML += "<div class='col-xs-4 subitem'><a class='page7_a' part='5' hidedata='" + JSON.stringify(data.resultData[kk]) + "' title='" + data.resultData[kk].engName + "' name='" + data.resultData[kk].engName + "'>" + data.resultData[kk].cnName + "</a></div>";
					} else if(data.resultData[i].category == "TV") {
						_rowModuleTV.innerHTML += "<div class='col-xs-4 subitem'><a class='page7_a' part='5' hidedata='" + JSON.stringify(data.resultData[kk]) + "' title='" + data.resultData[kk].engName + "' name='" + data.resultData[kk].engName + "'>" + data.resultData[kk].cnName + "</a></div>";
					} else if(data.resultData[i].category == "Other") {
						_rowModuleOther.innerHTML += "<div class='col-xs-4 subitem'><a class='page7_a' part='5' hidedata='" + JSON.stringify(data.resultData[kk]) + "' title='" + data.resultData[kk].engName + "' name='" + data.resultData[kk].engName + "'>" + data.resultData[kk].cnName + "</a></div>";
					} else if(data.resultData[i].category == "PlayerLibrary") {
						_rowModulePlayerLibrary.innerHTML += "<div class='col-xs-4 subitem'><a class='page7_a' part='5' hidedata='" + JSON.stringify(data.resultData[kk]) + "' title='" + data.resultData[kk].engName + "' name='" + data.resultData[kk].engName + "'>" + data.resultData[kk].cnName + "</a></div>";
					}

				}
			}
			//var node4 = '{}';
			//sendHTTPRequest("/prop/query", node4, propQueryResult);
			buttonInitAfter();
		}
	}
}

function propQueryResult() {
	if(this.readyState == 4) {
		if(this.status == 200) {
			var data = JSON.parse(this.responseText);
			console.log(data);
			if(data.resultCode == "0") {

			}
		}
	}
}

function buttonInitAfter() {
	/*配置管理板块-修改 */
	var _aPart,_aIndex,_cHidedata = "";
	$(".page7_a").click(function() {
		_aIndex = $(".page7_a").index($(this));
		_cHidedata = $(this).attr("hidedata");
		console.log(_cHidedata);
		_aPart = $(this).attr("part");
		eachPartChange(_aPart,_cHidedata);
	});	
	
	/*config-保存*/
	$("#configSubmit").click(function() {
		saveInConfig();
	});
	/*mk-保存*/
	$("#inputModuleSubmit").click(function() {
		saveInMK();
	});
	
	var _cIndex2 = ""; 
	$(".defaultOption").click(function(){
		_cIndex2 = $(".defaultOption").index($(this));
		if (_cIndex2 == 0) {
			console.log("lxw " + "点击的是字符串");
			document.getElementById("configString").style.display = "block";
			document.getElementsByClassName("tableBox")[0].style.display = "none";
		} else{
			console.log("lxw " + "点击的是枚举");
			document.getElementById("configString").style.display = "none";
			document.getElementsByClassName("tableBox")[0].style.display = "block";
		}
	});

	/*枚举各个图标的点击事件*/
	var _cIndex3 = "";
	$(".menuEdit").click(function(){
		_cIndex3 = $(".menuEdit").index($(this));
		console.log(_cIndex3);
		if(_cIndex3 == 0) {
			console.log("lxw " + "点击的是添加");
			var parentDiv = document.getElementById("ADCSEfficient");
			var child1 = document.createElement("div");
			child1.setAttribute("class","menuUnit");
			var child2 = document.createElement("input");
			child2.setAttribute("type","text");
			child2.setAttribute("class","menuUnitInput");
			child2.setAttribute("placeholder","Value");			
			child1.appendChild(child2);
			parentDiv.appendChild(child1);
		} else if(_cIndex3 == 1) {
			console.log("lxw " + "点击的是删除");
			var forDeleteObject = document.getElementById("ADCSEfficient");
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
			var appendObject = document.getElementById("ADCSEfficient");
			appendObject.innerHTML = "";
		}
	});
	
	
}

function eachPartChange(part,data){
	console.log(part+"---"+data);
	if (part == 0) {
		console.log("config子项的修改");
		$('#page7_config').modal();
		$("#configSubmit").attr("hidedata",2);
		$("#configSubmit").attr("oldValue",data);
		clearAllPart();
		editConfigModel(data);
	} else if(part == 1){
		console.log("系统设置子项的修改");
		
	} else if(part == 2){
		console.log("信号源工具箱子项的修改");
		
	} else if(part == 3){
		console.log("卖场演示子项的修改");
		
	} else if(part == 4){
		console.log("中间件子项的修改");
		
	} else if(part == 5){
		console.log("MK子项的修改");
		$('#myModuleAddChangeModal').modal();
		$("#inputModuleSubmit").attr("hidedata",2);
		$("#inputModuleSubmit").attr("oldValue",data);
		clearAllPart2();
		editMKModel(data);
	}
	$(".modal-backdrop").addClass("new-backdrop");
}

function editConfigModel(data){
	console.log(JSON.parse(data));
	$("#configCName").val(JSON.parse(data).cnName);
	$("#configEName").val(JSON.parse(data).engName);
	
	$("#configCName").attr('disabled','');
	$("#configEName").attr('disabled','');
	$("#configString").attr('disabled','');
	$(".menuUnitInput").attr('disabled','');
	$("#ADCSAction").attr('disabled','');
	$("#configSelect").attr('disabled','');
	$("#configSelect").css("background-color","#ebebe4")
	
	if(JSON.parse(data).typeStr == "string"){
		$("#configString").css("display","block");
		$("#configTableBoxEnum").css("display","none");
		$("#configString").val(JSON.parse(data).defaultValue);
		for (var i = 0; i < $(".menuUnitInput").length; i++) {
			document.getElementsByClassName("menuUnitInput")[i].value = "";
		};
	}else{
		$("#configString").css("display","none");
		$("#configTableBoxEnum").css("display","block");
		var oOpt = new Array(); 
		oOpt = JSON.parse(data).options;
		document.getElementById("ADCSEfficient").innerHTML="";
		console.log(JSON.parse(oOpt));
		console.log(JSON.parse(oOpt).length);
		for (var j = 0; j < JSON.parse(oOpt).length; j++) {
			var parentDiv = document.getElementById("ADCSEfficient");
			var child1 = document.createElement("div");
			child1.setAttribute("class","menuUnit");
			var child2 = document.createElement("input");
			child2.setAttribute("type","text");
			child2.setAttribute("class","menuUnitInput");
			child2.setAttribute("placeholder","Value");
			child1.appendChild(child2);
			parentDiv.appendChild(child1);
		};
		for (var k = 0; k < JSON.parse(oOpt).length; k++) {
			$(".menuUnitInput")[k].value = JSON.parse(oOpt)[k];
			$(".menuUnitInput:eq("+k+")").attr('disabled','');
		};
	}
	$("#configInstr").val(JSON.parse(data).descText);
	var categoryClass = JSON.parse(data).category;
	var opt = document.getElementById("configSelect").getElementsByTagName("option");
	for (var j = 0; j < opt.length; j++) {
		opt[j].removeAttribute("selected");
		if(opt[j].value == categoryClass){
			opt[j].setAttribute("selected","");
		}
	};
}

function editMKModel(data){
	console.log(data);
	document.getElementById("moduleCzName").value = JSON.parse(data).cnName;
	document.getElementById("moduleEnName").value = JSON.parse(data).engName;
	document.getElementById("moduleEnName").setAttribute('disabled','');
	document.getElementById("moduleEnName").style.backgroundColor = "#ebebe4";
	document.getElementById("moduleSrc").value = JSON.parse(data).gitPath;
//	document.getElementById("moduleSrc").setAttribute('disabled','');
// 	document.getElementById("moduleSrc").style.backgroundColor = "#ebebe4";
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
function clearAllPart(){
	document.getElementById("configCName").value = "";
	document.getElementById("configEName").value = "";
	document.getElementById("configCName").removeAttribute('disabled');
	document.getElementById("configEName").removeAttribute('disabled');
	document.getElementById("configString").removeAttribute('disabled');
	var myMenuUnitInputTwo = document.getElementsByClassName("menuUnitInput");
	for (var kk = 0; kk<myMenuUnitInputTwo.length; kk++) {
		document.getElementsByClassName("menuUnitInput")[kk].removeAttribute('disabled');
	}
	document.getElementById("configSelect").removeAttribute('disabled');
	document.getElementById("configSelect").style.backgroundColor = "white";
	document.getElementById("configInstr").value = "";
	document.getElementById("configString").value = "";
	document.getElementById("ADCSEfficient").innerHTML="";
	for (var j = 0; j < 2; j++) {
		var parentDiv = document.getElementById("ADCSEfficient");
		var child1 = document.createElement("div");
		child1.setAttribute("class","menuUnit");
		var child2 = document.createElement("input");
		child2.setAttribute("type","text");
		child2.setAttribute("class","menuUnitInput");
		child2.setAttribute("placeholder","Value");			
		child1.appendChild(child2);
		parentDiv.appendChild(child1);
	};
}
function clearAllPart2(){
	document.getElementById("moduleCzName").value = "";
	document.getElementById("moduleEnName").value = "";
	document.getElementById("moduleSrc").value = "";
	document.getElementById("moduleSrc").removeAttribute('disabled');
    document.getElementById("moduleSrc").style.backgroundColor = "white";
	document.getElementById("moduleInstr").value = "";
	document.getElementById("moduleSelect").value = "App";
}

function saveInConfig(){
	var _Hidendata = $("#configSubmit").attr("hidedata");
	var _oldValue = $("#configSubmit").attr("oldValue");
	
	var node = null;//向后台传递的数据
	
	var newConfigEnName = $("#configEName").val();
	var newConfigCzName = $("#configCName").val();
	var newConfigSelect = $("#configSelect").val();
	var newConfigInstr = $("#configInstr").val();
	newConfigInstr = newConfigInstr.replace(new RegExp("\"","gm"),"\\\"");
	newConfigInstr = newConfigInstr.replace(new RegExp("\n","gm"),"\\n");
	var newConfigType = "";
	var newConfigOptions = new Array();
	var newConfigString = "";
	newConfigString = $("#configString").val();
	newConfigString = newConfigString.replace(new RegExp("\"","gm"),"\\\"");
	newConfigString = newConfigString.replace(new RegExp("\n","gm"),"\\n");
	var newConfigOrderId = "";
	var inputNum = document.getElementsByClassName("menuUnitInput");
	var inputNumState = 0; //枚举型为空时的状态值
	for (var i = 0; i < inputNum.length; i++) {
		if (inputNum[i].value != ""){
			inputNumState = 1;
		}
	}
	if (newConfigCzName == "" || newConfigEnName == "" || newConfigInstr =="" ||(newConfigString == "" && inputNumState == 0)) {
		console.log("数据项都为空");
		$("#configErrorInfo")[0].innerHTML = "请确保所有项不为空！";
		setTimeout('$("#configErrorInfo")[0].innerHTML = "　"',3000);
	}else{
		if (newConfigString !="" && inputNumState == 1) {
			console.log("字符串型不为空，枚举型不为空！！！冲突！！！！");
			$("#configErrorInfo")[0].innerHTML = "输入有误，请确保字符串与枚举型的唯一！";
			setTimeout('$("#configErrorInfo")[0].innerHTML = "　"',3000);
		}else if (newConfigString !="" && inputNumState == 0) {
			console.log("枚举型为空，字符串型！！！");
			newConfigType = "string";
			newConfigOptions = "";
			newConfigString = $("#configString").val();
		}else if(newConfigString =="" && inputNumState == 1){
			console.log("枚举型不为空，字符串型为空！！！");
			newConfigType = "enum";
			var newConfigMenuDiv = document.getElementById("ADCSEfficient");
			var valueTwo = null;
			for (var i=0; i<$(".menuUnit").length;i++) {
				valueTwo =  newConfigMenuDiv.getElementsByTagName("input")[i].value;
				newConfigOptions.push(valueTwo);
			}
			newConfigString = newConfigOptions[0];
		}
		console.log("engName = "+newConfigEnName);
		console.log("cnName = "+newConfigCzName);
		console.log("category = "+newConfigSelect);
		console.log("type = "+newConfigType);
		console.log("options = "+newConfigOptions);
		console.log("defaultValue = "+newConfigString);
		console.log("desc = "+newConfigInstr);
		if (_Hidendata == 1) {
			console.log("lxw in edit 新增");
			node = '{"engName":"'+newConfigEnName+'","cnName":"'+newConfigCzName+'","category":"'+newConfigSelect+'","type":"'+newConfigType+'","options":"['+newConfigOptions+']","defaultValue":"'+newConfigString+'","desc":"'+newConfigInstr+'"}';
			console.log("lxw "+ node);
			sendHTTPRequest("/config/add", node, returnConfigAddInfo);
		} else{
			console.log("lxw in edit 修改");
			newConfigOrderId = JSON.parse(_oldValue).orderId;
			console.log("orderId = "+newConfigOrderId);
			node = '{"engName":"'+newConfigEnName+'","cnName":"'+newConfigCzName+'","category":"'+newConfigSelect+'","type":"'+newConfigType+'","options":"['+newConfigOptions+']","defaultValue":"'+newConfigString+'","desc":"'+newConfigInstr+'","orderId":"'+newConfigOrderId+'"}';
			console.log("lxw "+ node);
			sendHTTPRequest("/config/update", node, returnConfigAddInfo);
		}
	}
}
function saveInMK(){
	var _Hidendata2 = $("#inputModuleSubmit").attr("hidedata");
	var _oldValue2 = $("#inputModuleSubmit").attr("oldValue");
	console.log(_oldValue2);
	
	var newModuleCzName = document.getElementById("moduleCzName").value;
	var newModuleEnName = document.getElementById("moduleEnName").value;
	var newModuleSrc = document.getElementById("moduleSrc").value;
	var newModuleInstr = document.getElementById("moduleInstr").value;
	var newModuleSelect = document.getElementById("moduleSelect").value;

	newModuleCzName = newModuleCzName.replace(/(^\s*)|(\s*$)/g, "");
	newModuleEnName = newModuleEnName.replace(/(^\s*)|(\s*$)/g, "");
	newModuleSrc = newModuleSrc.replace(/(^\s*)|(\s*$)/g, "");
	newModuleInstr = newModuleInstr.replace(/(^\s*)|(\s*$)/g, "");
	console.log("lxw " + newModuleCzName + "--" + newModuleEnName + "--" + newModuleSrc + "--" + newModuleInstr + "--" + newModuleSelect);

	var currentArray = [newModuleCzName, newModuleEnName, newModuleSrc, newModuleInstr];
	if(newModuleCzName == "" || newModuleEnName == "" || newModuleSrc == "" || newModuleInstr == "") {
		console.log("存在空项");
		document.getElementById("moduleErrorInfo").style.display = "block";
		if (newModuleCzName == "") {
			document.getElementById("moduleErrorInfo").innerHTML = "模块中文名项不能为空！";
		}else if(newModuleEnName == ""){
			document.getElementById("moduleErrorInfo").innerHTML = "模块英文名项不能为空！";
		}else if(newModuleSrc == ""){
			document.getElementById("moduleErrorInfo").innerHTML = "模块路径项不能为空！";
		}else if(newModuleInstr == ""){
			document.getElementById("moduleErrorInfo").innerHTML = "描述项不能为空！";
		}
		setTimeout("document.getElementById('moduleErrorInfo').innerHTML='　'", 3000);
	} else {
		if(_Hidendata2 == 1) {
			console.log("lxw model 新增");
			var node = '{"engName":"' + newModuleEnName + '","cnName":"' + newModuleCzName + '","category":"' + newModuleSelect + '","desc":"' + newModuleInstr + '","gitPath":"' + newModuleSrc + '"}';
			console.log(node);
			sendHTTPRequest("/module/add", node, returnMKAddInfo);
		} else {
			console.log("lxw model 修改");
			_oldValue2 = JSON.parse(_oldValue2);
			var node = '{"engName":"' + newModuleEnName + '","cnName":"' + newModuleCzName + '","category":"' + newModuleSelect + '","desc":"' + newModuleInstr + '","gitPath":"' + newModuleSrc + '","orderId":"' + _oldValue2.orderId + '"}';
			console.log("lxw " + node);
			sendHTTPRequest("/module/update", node, returnMKAddInfo);
		}
	}
	
	
	
}


function returnMKAddInfo(){
	if(this.readyState == 4) {
		if(this.status == 200) {
			var data = JSON.parse(this.responseText);
			console.log(data);
			if(data.resultCode == "0") {
				console.log("数据添加成功");
				$("#myModuleAddChangeModal").modal('hide');
				freshModuleAddHtml();
				
			}else{
				console.log("数据添加失败");
				document.getElementById("moduleErrorInfo").innerHTML = "添加失败！该内容或已存在。";
				setTimeout("document.getElementById('moduleErrorInfo').innerHTML='　'", 3000);
				
			}
		}
	}
}
function returnConfigAddInfo(){
	if(this.readyState == 4) {
		if(this.status == 200) {
			var data = JSON.parse(this.responseText);
			console.log(data);
			if(data.resultCode == "0") {
				console.log("数据添加成功");
				$("#page7_config").modal('hide');
				freshModuleAddHtml();
				
			}else{
				console.log("数据添加失败");
				document.getElementById("configErrorInfo").innerHTML = "添加失败！该内容或已存在。";
				setTimeout("document.getElementById('configErrorInfo').innerHTML='　'", 3000);
				
			}
		}
	}
}

















/*刷新页面*/
function freshModuleAddHtml() {
	var htmlObject = parent.document.getElementById("tab_userMenu7");
	console.log("lxw " + htmlObject.firstChild.src);
	htmlObject.firstChild.src = "page7.html";

//	var indexObject = parent.document.getElementById("home");
//  var iframe = indexObject.getElementsByTagName("iframe");
//  iframe[0].src = "wait.html";
//  if(parent.document.getElementById("tab_userMenu2")){
//	    var htmlObject1 = parent.document.getElementById("tab_userMenu2");
//	    htmlObject1.firstChild.src = "review.html";
//	}  
}