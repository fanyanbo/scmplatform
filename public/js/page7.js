document.write("<script language=javascript src='../js/sentHTTP.js' charset=\"utf-8\"></script>");

$(function() {
	$(".page7_boxes")[0].style.display = "block";
	buttonInitBefore();
	//model/query----config/query----setting/query
	var node1 = '{}';
	sendHTTPRequest("/config/query", node1 , configQueryResult);
	buttonInitAfter();
	
	
	
});

function buttonInitBefore(){
	var _curIndex = "";
	$(".page7_tabs").click(function() {
		_curIndex = $(".page7_tabs").index($(this));
		console.log(_curIndex);
		for(var k = 0; k < $(".page7_tabs").length; k++) {
			$(".page7_boxes")[k].style.display = "none";
			$(".page7_tabs")[k].style.backgroundColor = "buttonface";
		}
		$(".page7_boxes")[_curIndex].style.display = "block";
		$(".page7_tabs")[_curIndex].style.backgroundColor = "red";
	});
}
function buttonInitAfter(){
	
}

function configQueryResult(){
	if(this.readyState == 4) {
		if(this.status == 200) {
			var data = JSON.parse(this.responseText);
			console.log(data);
			if(data.resultCode == "0") {
				var kk = 0;
				var pullDataOne,pullDataTwo =null;
				var _rowConfigBase = document.getElementById("configTableTdBase");
				var _rowConfigServerip = document.getElementById("configTableTdServerip");
				var _rowConfigAd = document.getElementById("configTableTdAd");
				var _rowConfigChannel = document.getElementById("configTableTdChannel");
				var _rowConfigLocalmedia = document.getElementById("configTableTdLocalmedia");
				var _rowConfigOther = document.getElementById("configTableTdOther");
				
				for(var i = 0; i < data.resultData.length; i++) {
					console.log("lxw "+data.resultData[i].category);
					if (data.resultData[i].category == "base") {
						kk = i;
						pullDataOne = JSON.stringify(data.resultData[kk]);
						_rowConfigBase.innerHTML += "<div class='col-xs-4 subitem'><a hidedata='"+ pullDataOne +"' title='"+data.resultData[kk].engName+"' name='"+data.resultData[kk].engName+"'>" + data.resultData[kk].cnName + "</a></div>";
					}
					else if(data.resultData[i].category == "serverip"){
						kk = i;
						pullDataTwo = JSON.stringify(data.resultData[kk]);
						_rowConfigServerip.innerHTML += "<div class='col-xs-4 subitem'><a hidedata='"+ pullDataOne +"' title='"+data.resultData[kk].engName+"' name='"+data.resultData[kk].engName+"'>" + data.resultData[kk].cnName + "</a></div>";
					}
					else if(data.resultData[i].category == "ad"){
						kk = i;
						pullDataTwo = JSON.stringify(data.resultData[kk]);
						_rowConfigAd.innerHTML += "<div class='col-xs-4 subitem'><a hidedata='"+ pullDataOne +"' title='"+data.resultData[kk].engName+"' name='"+data.resultData[kk].engName+"'>" + data.resultData[kk].cnName + "</a></div>";
					}
					else if(data.resultData[i].category == "channel"){
						kk = i;
						pullDataTwo = JSON.stringify(data.resultData[kk]);
						_rowConfigChannel.innerHTML += "<div class='col-xs-4 subitem'><a hidedata='"+ pullDataOne +"' title='"+data.resultData[kk].engName+"' name='"+data.resultData[kk].engName+"'>" + data.resultData[kk].cnName + "</a></div>";
					}
					else if(data.resultData[i].category == "localmedia"){
						kk = i;
						pullDataTwo = JSON.stringify(data.resultData[kk]);
						_rowConfigLocalmedia.innerHTML += "<div class='col-xs-4 subitem'><a hidedata='"+ pullDataOne +"' title='"+data.resultData[kk].engName+"' name='"+data.resultData[kk].engName+"'>" + data.resultData[kk].cnName + "</a></div>";
					}
					else if(data.resultData[i].category == "other"){
						kk = i;
						pullDataTwo = JSON.stringify(data.resultData[kk]);
						_rowConfigOther.innerHTML += "<div class='col-xs-4 subitem'><a hidedata='"+ pullDataOne +"' title='"+data.resultData[kk].engName+"' name='"+data.resultData[kk].engName+"'>" + data.resultData[kk].cnName + "</a></div>";
					}
				}
			}
		}
		var node2 = '{}';
		sendHTTPRequest("/settings/query", node2, settingQueryResult);
	}
}
function settingQueryResult(){
	if(this.readyState == 4) {
		if(this.status == 200) {
			var data = JSON.parse(this.responseText);
			console.log(data);
			if(data.resultCode == "0") {
				var kk = 0;
				var pullDataS1,pullDataS2,pullDataS3,pullDataS4,pullDataS5,pullDataS6 =null;
				var pullDataS7,pullDataS8 =null;
				var pullDataS9,pullDataS10 =null;
				
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
				
				
				
				for(var i = 0; i < data.resultData.length; i++) {
					if (data.resultData[i].uiGroup1 == "系统设置") {
						if (data.resultData[i].uiGroup2 == "开机引导") {
							kk = i;
							pullDataS1 = JSON.stringify(data.resultData[kk]);
							_rowSysSBoot.innerHTML += "<div class='col-xs-4 subitem'><a hidedata='"+ pullDataS1 +"' title='"+data.resultData[kk].engName+"' name='"+data.resultData[kk].engName+"'>" + data.resultData[kk].cnName + "</a></div>";
						}else if(data.resultData[i].uiGroup2 == "设置入口页"){
							kk = i;
							pullDataS2 = JSON.stringify(data.resultData[kk]);
							_rowSysSSetting.innerHTML += "<div class='col-xs-4 subitem'><a hidedata='"+ pullDataS2 +"' title='"+data.resultData[kk].engName+"' name='"+data.resultData[kk].engName+"'>" + data.resultData[kk].cnName + "</a></div>";
						}else if (data.resultData[i].uiGroup2 == "网络与连接") {
							kk = i;
							pullDataS3 = JSON.stringify(data.resultData[kk]);
							_rowSysSNet.innerHTML += "<div class='col-xs-4 subitem'><a hidedata='"+ pullDataS3 +"' title='"+data.resultData[kk].engName+"' name='"+data.resultData[kk].engName+"'>" + data.resultData[kk].cnName + "</a></div>";
						}else if (data.resultData[i].uiGroup2 == "图像设置") {
							kk = i;
							pullDataS4 = JSON.stringify(data.resultData[kk]);
							_rowSysSPicture.innerHTML += "<div class='col-xs-4 subitem'><a hidedata='"+ pullDataS4 +"' title='"+data.resultData[kk].engName+"' name='"+data.resultData[kk].engName+"'>" + data.resultData[kk].cnName + "</a></div>";
						}else if (data.resultData[i].uiGroup2 == "声音设置") {
							kk = i;
							pullDataS5 = JSON.stringify(data.resultData[kk]);
							_rowSysSSound.innerHTML += "<div class='col-xs-4 subitem'><a hidedata='"+ pullDataS5 +"' title='"+data.resultData[kk].engName+"' name='"+data.resultData[kk].engName+"'>" + data.resultData[kk].cnName + "</a></div>";
						}else if (data.resultData[i].uiGroup2 == "通用设置") {
							kk = i;
							pullDataS6 = JSON.stringify(data.resultData[kk]);
							_rowSysSGeneral.innerHTML += "<div class='col-xs-4 subitem'><a hidedata='"+ pullDataS6 +"' title='"+data.resultData[kk].engName+"' name='"+data.resultData[kk].engName+"'>" + data.resultData[kk].cnName + "</a></div>";
						}
					}
					else if(data.resultData[i].uiGroup1 == "信号源工具箱"){
						if (data.resultData[i].uiGroup2 == "快捷功能") {
							kk = i;
							pullDataS7 = JSON.stringify(data.resultData[kk]);
							_rowSourceBoxQuick.innerHTML += "<div class='col-xs-4 subitem'><a hidedata='"+ pullDataS7 +"' title='"+data.resultData[kk].engName+"' name='"+data.resultData[kk].engName+"'>" + data.resultData[kk].cnName + "</a></div>";
						}else if(data.resultData[i].uiGroup2 == "常用设置"){
							kk = i;
							pullDataS8 = JSON.stringify(data.resultData[kk]);
							_rowSourceBoxGeneral.innerHTML += "<div class='col-xs-4 subitem'><a hidedata='"+ pullDataS8 +"' title='"+data.resultData[kk].engName+"' name='"+data.resultData[kk].engName+"'>" + data.resultData[kk].cnName + "</a></div>";
						}
					}
					else if(data.resultData[i].uiGroup1 == "卖场演示"){
						if (data.resultData[i].uiGroup2 == "声音演示") {
							kk = i;
							pullDataS9 = JSON.stringify(data.resultData[kk]);
							_rowMarketShowSound.innerHTML += "<div class='col-xs-4 subitem'><a hidedata='"+ pullDataS9 +"' title='"+data.resultData[kk].engName+"' name='"+data.resultData[kk].engName+"'>" + data.resultData[kk].cnName + "</a></div>";
						}else if(data.resultData[i].uiGroup2 == "图像演示"){
							kk = i;
							pullDataS10 = JSON.stringify(data.resultData[kk]);
							_rowMarketShowPicture.innerHTML += "<div class='col-xs-4 subitem'><a hidedata='"+ pullDataS10 +"' title='"+data.resultData[kk].engName+"' name='"+data.resultData[kk].engName+"'>" + data.resultData[kk].cnName + "</a></div>";
						}
					}
					else if(data.resultData[i].uiGroup1 == "中间件"){
						if (data.resultData[i].uiGroup2 == "输入信号源") {
							kk = i;
							pullDataS11 = JSON.stringify(data.resultData[kk]);
							_rowMiddleware1.innerHTML += "<div class='col-xs-4 subitem'><a hidedata='"+ pullDataS11 +"' title='"+data.resultData[kk].engName+"' name='"+data.resultData[kk].engName+"'>" + data.resultData[kk].cnName + "</a></div>";
						}else if(data.resultData[i].uiGroup2 == "支持纵横比"){
							kk = i;
							pullDataS12 = JSON.stringify(data.resultData[kk]);
							_rowMiddleware2.innerHTML += "<div class='col-xs-4 subitem'><a hidedata='"+ pullDataS12 +"' title='"+data.resultData[kk].engName+"' name='"+data.resultData[kk].engName+"'>" + data.resultData[kk].cnName + "</a></div>";
						}
					}
				}
			}
		}
		var node3 = '{}';
		//sendHTTPRequest("/model/query", node3, modelQueryResult);
	}
}
function modelQueryResult(){
	if(this.readyState == 4) {
		if(this.status == 200) {
			var data = JSON.parse(this.responseText);
			console.log(data);
			if(data.resultCode == "0") {
				
			}
		}
		//var node4 = '{}';
		//sendHTTPRequest("/prop/query", node4, propQueryResult);
	}
}
function propQueryResult(){
	if(this.readyState == 4) {
		if(this.status == 200) {
			var data = JSON.parse(this.responseText);
			console.log(data);
			if(data.resultCode == "0") {
				
			}
		}
	}
}