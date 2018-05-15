document.write("<script language=javascript src='../js/sentHTTP.js' charset=\"utf-8\"></script>");

var autoDataArray1 = new Array();
var autoDataArray2 = new Array();
var autoDataArray3 = new Array();
var autoDataArray4 = new Array();
var autogitArray = ["a", "b", "c", "bb", "cb", "bvv", "ca", "bsd", "cfg", "bd", "adfc", "bas", "asc"];

var _twoLevelLinkageArrayOne = [[],[],[],[]];
var _twoLevelLinkageArrayTwo = [[],[],[],[]];
var _twoLevelLinkageArrayThree = [[],[],[],[]];
var _myArray = [];

var level = 1;

$(function() {
	var node = '{"offset":"-1","rows":"10"}';
	sendHTTPRequest("/product/queryByPage", node, productQuery);
	
	buttonInitBefore();
});

function productQuery() {
	if(this.readyState == 4) {
		if(this.status == 200) {
			var data = JSON.parse(this.responseText);
			console.log(data);
			//auditState(0审核通过\1待审核\2审核未通过)、modifyState(0正常\1修改\2增加\3删除)
			if(data.resultCode == "0") {
				var arr = new Array();
				for (var i=0; i<data.resultData.length; i++) {
					if (data.resultData[i].auditState == 1) {
						arr.push(data.resultData[i]);
					}
				}
				handleTableData(arr);
			}
		}
		sendHTTPRequest("/product/queryAll", '{}', allQueryResult);
	}
}
function handleTableData(arr) {
	var getdataArray2 = new Array();
	
	for(var i = 0; i < arr.length; i++) {
		var eachItem2 = {
			"number": "0",
			"model": "G7200",
			"chip": "8H81",
			"target_product": "123123",
			"chipmodel": "123",
			"coocaaVersion": "1",
			"AndroidVersion": "6.0",
			"memory": "1.5G",
			"type": "1",
			"author": "林心旺",
			"reason": "<span class='eachlook'>查看</a>",
			"operate": "<span class='eachedit'>编辑</span><span class='eachaudit'>审核</a>"
		};
		eachItem2.number = (i+1);
		eachItem2.model = arr[i].model;
		eachItem2.chip = arr[i].chip;
		eachItem2.target_product = arr[i].targetProduct;
		eachItem2.chipmodel = arr[i].soc;
		eachItem2.coocaaVersion = arr[i].coocaaVersion;
		eachItem2.AndroidVersion = arr[i].androidVersion;
		eachItem2.memory = arr[i].memorySize;
		eachItem2.type = arr[i].modifyState;
		getdataArray2.push(eachItem2);
	}
	console.log(getdataArray2);
	pageTableInit(getdataArray2);
}
function pageTableInit(data1) {
	//前台分页
	$('#page4_table').CJJTable({
		'title': ["序号", "机型", "机芯", "TP", "芯片型号", "酷开版本", "安卓版本", "内存", "类型", "提交者", "跟新原因", "操作"],
		'body': ["number", "model", "chip", "target_product", "chipmodel", "coocaaVersion", "AndroidVersion", "memory", "type", "author", "reason", "operate"], //tbody td 取值的字段 必填
		'display': [2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1], //隐藏域，1显示，2隐藏 必填
		'pageNUmber': 10, //每页显示的条数 选填
		'pageLength': data1.length, //选填
		'url': data1 //数据源 必填
	});
	editStatusByLength(data1.length);
	buttonInitAfter();
}
function editStatusByLength(num){
	if (num == 0) {
		console.log("查询结果为空");
		$('#page5_table').css("display", "none");
		$('#noList').css("display", "block");
	} else if (num < 11) {
		console.log("查询结果个数小于11");
		
	}else{
		console.log("查询结果个数大于11");
		
	}
}

function buttonInitBefore(){
	$(".page4_tabs").click(function() {
		var _curIndex = $(".page4_tabs").index($(this));
		colorstatus(_curIndex);
	});
	$("#closeReview").click(function() {
		if (level == 1) {
	        freshReviewHtml();
	    }
	    else{
	        document.getElementById("mydialog").style.display = "block";
	        document.getElementById("myDeleteModalLabel").innerHTML = "关闭操作";
	        document.getElementById("dialogword").innerHTML = "当前操作未保存，是否确认退出？";
	    }
	});
	$("#closeReview").click(function() {
		document.getElementById("mydialog").style.display = "none";
		document.getElementById("myDeleteModalLabel").style.display = "none";
//		changeAdd.splice(0,changeAdd.length);
//		changeConf.splice(0,changeConf.length);
//		changeDev.splice(0,changeDev.length);
//		changeReduce.splice(0,changeReduce.length);
		$("#page4Modal1").modal('hide');
	});
}
function colorstatus(number){
	for(var k = 0; k < $(".page4_tabs").length; k++) {
		$(".page4_boxes")[k].style.display = "none";
		$(".page4_tabs")[k].style.backgroundColor = "buttonface";
	}
	$(".page4_boxes")[number].style.display = "block";
	$(".page4_tabs")[number].style.backgroundColor = "red";
}

function buttonInitAfter(){
	$(".eachlook").click(function() {
		var _Index = $(".eachlook").index($(this));
		console.log("点击的是第" + _Index + "个 查看项。");
		console.log($("#page4_table2 .chip")[_Index].innerHTML);
		console.log($("#page4_table2 .model")[_Index].innerHTML);
		
	});
	$(".eachedit").click(function() {
		var _Index = $(".eachedit").index($(this));
		console.log("点击的是第" + _Index + "个编辑项 。");
		var node = '{"chip":"'+$("#page4_table2 .chip")[_Index].innerHTML+'","model":"'+$("#page4_table2 .model")[_Index].innerHTML+'"}';
		sendHTTPRequest("/product/queryAllByMachine", node, getPointProductInfo);
		$('#page4Modal1').modal();
    	$(".modal-backdrop").addClass("new-backdrop");
    	
	});
	$(".eachaudit").click(function() {
		var _Index = $(".eachaudit").index($(this));
		console.log("点击的是第" + _Index + "个审核项。");
		var node = '{"chip":"'+$("#page4_table2 .chip")[_Index].innerHTML+'","model":"'+$("#page4_table2 .model")[_Index].innerHTML+'"}';
		sendHTTPRequest("/product/queryAllByMachine", node, getPointProductInfo);
		$('#page4Modal1').modal();
    	$(".modal-backdrop").addClass("new-backdrop");
	});
	
}

//页面加载时新增页的查询功能
function allQueryResult() {
	if(this.readyState == 4) {
		if(this.status == 200) {
			var data = JSON.parse(this.responseText);
			configQueryData(data.resultData[3],data.resultData[0]);
			moduleQueryData(data.resultData[4],data.resultData[1]);
			settingsQueryData(data.resultData[5],data.resultData[2]);
		};
	}
}
function configQueryData(arr1,arr2) {
	var _myConfigBox = document.getElementById("myConfigBox");
	for(var i = 0; i < arr1.length; i++) {
		_myConfigBox.innerHTML += '<div class="configitems1 eachpartbox" category="'+ arr1[i].category +'"><div class="grouptitle" title="'+arr1[i].category+'">'+arr1[i].category+'</div></div>';
	}
	var kk = 0;
	for (var j=0; j< $(".configitems1").length; j++) {
		for(var i = 0; i < arr2.length; i++) {
			if(arr2[i].category == $(".configitems1:eq(" + (j) + ")").attr("category")) {
				kk = i;
				configDataInsert(kk, $(".configitems1")[j], arr2);
			}
		}
	}
}
function moduleQueryData(arr1,arr2) {
	var _myMKBox = document.getElementById("myMkBox");
	for(var i = 0; i < arr1.length; i++) {
		_myMKBox.innerHTML += '<div class="moduleitems eachpartbox" category="'+ arr1[i].category +'"><div class="grouptitle" title="'+arr1[i].category+'">'+arr1[i].category+'</div></div>';
	}
	var kk = 0;
	for (var j=0; j< $(".moduleitems").length; j++) {
		for(var i = 0; i < arr2.length; i++) {
			if(arr2[i].category == $(".moduleitems:eq(" + (j) + ")").attr("category")) {
				kk = i;
				mkDataInsert(kk, $(".moduleitems")[j], arr2);
			}
		}
	}
	document.getElementsByClassName("mkradio")[0].setAttribute('checked', 'true');
}
function settingsQueryData(arr1,arr2) {
	var _mySysSettingBox = document.getElementById("mySysSettingBox");
	var _mySourceBoxBox = document.getElementById("mySourceBoxBox");
	var _myMarketShowBox = document.getElementById("myMarketShowBox");
	var _myMiddlewareBox = document.getElementById("myMiddlewareBox");
	var kk = 0;
	for(var i = 0; i < arr1.length; i++) {
		if (arr1[i].level1 == "系统设置") {
			kk = i;
			sysDataInsert(kk,_mySysSettingBox,0,arr1);
		} else if(arr1[i].level1 == "信号源工具箱"){
			kk = i;
			sysDataInsert(kk,_mySourceBoxBox,1,arr1);
		}else if(arr1[i].level1 == "卖场演示"){
			kk = i;
			sysDataInsert(kk,_myMarketShowBox,2,arr1);
		}else if(arr1[i].level1 == "中间件"){
			kk = i;
			sysDataInsert(kk,_myMiddlewareBox,3,arr1);
		}
	}
	for (var j=0; j< $(".settingsitems").length; j++) {
		for(var i = 0; i < arr2.length; i++) {
			if(arr2[i].level2 == $(".settingsitems:eq(" + (j) + ")").attr("level2")) {
				if (arr2[i].level3 === null || arr2[i].level3 == "") {
					$(".settingsitems")[j].innerHTML += "<div class='col-xs-3'><input id='"+arr2[i].engName+"' type='checkbox' class='sysitems' cnName='"+arr2[i].cnName+"' descText='"+arr2[i].descText+"' engName='"+arr2[i].engName+"' level1='" + arr2[i].level1 + "' level2='" + arr2[i].level2 + "' level3='" + arr2[i].level3 + "' value=''><span title='" + arr2[i].descText + "'>" + arr2[i].cnName + "</span></div>";
				} else{
					if (arr2[i].level3 == $(".settingsitems:eq(" + (j) + ")").attr("level3")) {
						$(".settingsitems")[j].innerHTML += "<div class='col-xs-3'><input id='"+arr2[i].engName+"' type='checkbox' class='sysitems' cnName='"+arr2[i].cnName+"' descText='"+arr2[i].descText+"' engName='"+arr2[i].engName+"' level1='" + arr2[i].level1 + "' level2='" + arr2[i].level2 + "' level3='" + arr2[i].level3 + "' value=''><span title='" + arr2[i].descText + "'>" + arr2[i].cnName + "</span></div>";
					}
				}
			}
		}
	}
}

function configDataInsert(kk, obj, data) {
	if(data[kk].typeStr == "string") {
		obj.innerHTML += "<div class='col-xs-6'><span title='"+data[kk].descText+"'>"+data[kk].cnName+":</span><input class='configitems' type='text' category='"+data[kk].category+"' cnName='"+data[kk].cnName+"' descText='"+data[kk].descText+"' id='"+data[kk].engName+"' options='"+data[kk].options+"' typeStr='"+data[kk].typeStr+"' value='"+data[kk].defaultValue+"' defaultValue='"+data[kk].defaultValue+"'></div>";
	} else if(data[kk].typeStr == "enum") {
		var _myAddselect = "<select class='configitems' category='"+data[kk].category+"' cnName='"+data[kk].cnName+"' descText='"+data[kk].descText+"' id='"+data[kk].engName+"' options='"+data[kk].options+"' typeStr='" + data[kk].typeStr + "' defaultValue='" + data[kk].defaultValue + "' value='" + data[kk].defaultValue + "'>";
		var str2 = data[kk].options.replace(/"/g, '');
		str2 = str2.replace("[", "");
		str2 = str2.replace("]", "");
		str2 = str2.split(",");
		for(var k = 0; k < str2.length; k++) {
			if(str2[k] == data[kk].value) {
				_myAddselect += "<option value='" + str2[k] + "'selected>" + str2[k] + "</option>";
			} else {
				_myAddselect += "<option value='" + str2[k] + "'>" + str2[k] + "</option>";
			}
		}
		_myAddselect = "<div class='col-xs-6'><span title='" + data[kk].descText + "'>" + data[kk].cnName + " :</span>" + _myAddselect + "</select></div>";
		obj.innerHTML += _myAddselect;
	}
}
function mkDataInsert(kk, obj, data) {
	if (data[kk].category == "PlayerLibrary") {
		obj.innerHTML += "<div class='col-xs-3'><input id='"+data[kk].engName+"' type='radio' class='mkitems mkradio' category='" + data[kk].category + "' cnName='"+data[kk].cnName+"' descText='"+data[kk].descText+"' engName='"+data[kk].engName+"' gitPath='" + data[kk].gitPath + "' name='" + data[kk].category + "' value='' disabled><span title='" + data[kk].descText + "'>" + data[kk].cnName + "</span></div>";
	} else{
		obj.innerHTML += "<div class='col-xs-3'><input id='"+data[kk].engName+"' type='checkbox'class='mkitems' category='" + data[kk].category + "' cnName='"+data[kk].cnName+"' descText='"+data[kk].descText+"' engName='"+data[kk].engName+"' gitPath='" + data[kk].gitPath + "' name='" + data[kk].category + "' value='' disabled><span title='" + data[kk].descText + "'>" + data[kk].cnName + "</span></div>";
	}
}
function sysDataInsert(i, obj, num, arr1){
	if(arr1[i].level3 != ""){
		obj.innerHTML += '<div class="settingsitems eachpartbox" level2="'+arr1[i].level2+'" level3="'+arr1[i].level3+'"><div class="grouptitle" title="'+arr1[i].level2+"-"+arr1[i].level3+'">'+arr1[i].level2+"-"+arr1[i].level3+'</div></div>';
		if (_twoLevelLinkageArrayTwo[num].indexOf(arr1[i].level3)== -1) {
			_twoLevelLinkageArrayTwo[num].push(arr1[i].level3);
			_twoLevelLinkageArrayThree[num].push([arr1[i].level2,arr1[i].level3]);
		}
	}else{
		obj.innerHTML += '<div class="settingsitems eachpartbox" level2="'+arr1[i].level2+'"><div class="grouptitle" title="'+arr1[i].level2+'">'+arr1[i].level2+'</div></div>';
	}
	if (_twoLevelLinkageArrayOne[num].indexOf(arr1[i].level2)== -1) {
		_twoLevelLinkageArrayOne[num].push(arr1[i].level2);
	}
}

//点击复制或者编辑
function getPointProductInfo(){
	if(this.readyState == 4) {
        if(this.status == 200) {
            var data = JSON.parse(this.responseText);
            console.log(data);
            if(data.resultCode == 0){
            	console.log("数据返回成功");
            	//var _type = $("#lable1SubmitTwo").attr("catagory");//2-编辑、3-复制
            	var _type = 1;
            	CommonDataInsert2(_type,data.resultData[0]);
            	ConfigDataInsert2(_type,data.resultData[1]);
            	MKDataInsert2(_type,data.resultData[2]);
//          	SysDataInsert2(_type,data.resultData[3]);
            }
        };
    }
}
function CommonDataInsert2(type,arr){
	$("#lable4Chip").val(arr[0].chip);
	$("#lable4Model").val(arr[0].model);
	$("#lable4TP").val(arr[0].targetProduct);
	$("#lable4CoocaaVersion").val(arr[0].coocaaVersion);
	$("#lable4AndroidVersion").val(arr[0].androidVersion);
	$("#lable4ChipMode").val(arr[0].soc);
	$("#lable4Emmc").val(arr[0].EMMC);
	$("#lable4Memory").val(arr[0].memorySize);
	$("#lable4GitBranch").val(arr[0].gitBranch);
	
	
	if (type == 1) {//审核、都不可修改
		$("#lable4Chip").attr("disabled","disabled");
		$("#lable4Model").attr("disabled","disabled");
		$("#lable4TP").attr("disabled","disabled");
	}
}
function ConfigDataInsert2(type, arr){
	for (var i=0; i<arr.length; i++) {
		$("#"+arr[i].engName).val(arr[i].curValue);
		$("#"+arr[i].engName).attr("value",arr[i].curValue);
	}
	if (type == 2) {
		for (var i=0; i<$(".configitems").length; i++) {
			$(".configitems:eq("+i+")").attr("oldvalue",$(".configitems:eq("+i+")").attr("value"));
		}
	}
}
function MKDataInsert2(type, arr){
	for (var j=0; j<$(".mkradio").length; j++) {
		document.getElementsByClassName("mkradio")[j].removeAttribute('checked');
	}
	for (var i=0; i<arr.length; i++) {
		document.getElementById(arr[i].engName).setAttribute('checked', 'true');
	}
//	olrplayerid = arr[i].id;
}


































//刷新当前iframe
function freshReviewHtml() {
    var htmlObject = parent.document.getElementById("tab_userMenu4");
    var htmlObject2 = parent.document.getElementById("tab_userMenu5");
    var htmlObject3 = parent.document.getElementById("tab_userMenu2");
    htmlObject.firstChild.src = "page4.html";
//  if (htmlObject2) {
//      htmlObject2.firstChild.src = "page5.html";
//  }
//  if (htmlObject3) {
//  	htmlObject3.firstChild.src = "page2.html";
//  }
}   