document.write("<script language=javascript src='../js/sentHTTP.js' charset=\"utf-8\"></script>");

var autoDataArray1 = new Array();
var autogitArray = ["a", "b", "c", "bb", "cb", "bvv", "ca", "bsd", "cfg", "bd", "adfc", "bas", "asc"];
var autoComplete1,autoComplete2 = "";

var _twoLevelLinkageArrayOne = [[],[],[],[]];
var _twoLevelLinkageArrayTwo = [[],[],[],[]];
var _twoLevelLinkageArrayThree = [[],[],[],[]];
var _myArray = [];

var level = null;
var loginusername = null;
var fromEmail = null;
var adminControl = null;

var changeAdd = [];
var changeReduce = [];
var changeConf = [];
var changeDev = [];

var coocaaVersion = "/6.0";

$(function() {
	level = parent.adminFlag;
    loginusername = parent.loginusername;
    fromEmail = parent.loginEmail;
	
	var node = '{"offset":"-1","rows":"10"}';
	sendHTTPRequest(coocaaVersion+"/product/queryByPage", node, productQuery);
	
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
					if (data.resultData[i].auditState == 2) {
						arr.push(data.resultData[i]);
					}
				}
				handleTableData(arr);
			}
		}
		sendHTTPRequest(coocaaVersion+"/product/queryAll", '{}', allQueryResult);
	}
}
function handleTableData(arr) {
	var getdataArray2 = new Array();
	console.log("level= "+ level + "loginusername = " +loginusername + "fromEmail = " + fromEmail);
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
			"operate": "<span class='eachedit'>编辑</span><span class='eachaudit'>审核</span>"
		};
		//auditState(0审核通过\1待审核\2审核未通过
		//modifyState(0正常\1修改\2增加\3删除)
		var operateType = arr[i].modifyState;
		var	userName = "fanyanbo";
		eachItem2.number = (i+1);
		eachItem2.model = arr[i].model;
		eachItem2.chip = arr[i].chip;
		eachItem2.target_product = arr[i].targetProduct;
		eachItem2.chipmodel = arr[i].soc;
		eachItem2.coocaaVersion = arr[i].coocaaVersion;
		eachItem2.AndroidVersion = arr[i].androidVersion;
		eachItem2.memory = arr[i].memorySize;
		if (operateType == 0) {
			eachItem2.type = "正常";
		} else if(operateType == 1){
			eachItem2.type = "修改";
		}else if(operateType == 2){
			eachItem2.type = "增加";
		}else if(operateType == 3){
			eachItem2.type = "删除";
		}
		if (level == 0) {
            if (userName == loginusername) {
                if (operateType == 3) {
                	//管理员&&是提交者&&删除
                	eachItem2.operate = "<span class='eachaudit' onclick='review(this,1,3)'>审核</span><span class='eachedit' onclick='recover(this,"+operateType+")'>恢复</span>";
                }else{
                	//管理员&&是提交者&&编辑或者增加
                	eachItem2.operate = "<span class='eachaudit' onclick='review(this,1,"+operateType+")'>审核</span><span class='eachedit' onclick='edit(this,1,0)'>编辑</span>";
                }
            }else{
            	//管理员&&非提交者
            	eachItem2.operate = "<span class='eachaudit' onclick='review(this,0,"+operateType+")'>审核</span>";
            }
            getdataArray2.push(eachItem2);
        }else{
        	if (userName == loginusername) {
		        if (operateType == 3) {
		        	//非管理员&&是提交者&&删除
		        	eachItem2.operate = "<span class='eachedit' onclick='recover(this,"+operateType+")'>恢复</span>";
		        }else{
		        	//非管理员&&是提交者&&新增或者编辑
		        	eachItem2.operate = "<span class='eachedit' onclick='edit(this,1,"+operateType+")'>编辑</span>";
		        }
		        getdataArray2.push(eachItem2);
		    }else{
		    	//非管理员&&非提交者
		    	//不可见、即不插入数组中
		    }
        }
	}
	console.log(getdataArray2);
	pageTableInit(getdataArray2);
}
function pageTableInit(data1) {
	//前台分页
	$('#page5_table').CJJTable({
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
	$(".page5_tabs").click(function() {
		var _curIndex = $(".page5_tabs").index($(this));
		colorstatus(_curIndex);
	});
	
	$("#lable5ChipMode").keyup(function(event) {
		autoComplete1.start(event);
	});
	$("#lable5GitBranch").keyup(function(event) {
		autoComplete2.start(event);
	});
}
function colorstatus(number){
	for(var k = 0; k < $(".page5_tabs").length; k++) {
		$(".page5_boxes")[k].style.display = "none";
		$(".page5_tabs")[k].style.backgroundColor = "buttonface";
	}
	$(".page5_boxes")[number].style.display = "block";
	$(".page5_tabs")[number].style.backgroundColor = "red";
}

function buttonInitAfter(){
	$(".eachlook").click(function() {
		var _Index = $(".eachlook").index($(this));
		console.log("点击的是第" + _Index + "个 查看项。");
		console.log($("#page5_table2 .chip")[_Index].innerHTML);
		console.log($("#page5_table2 .model")[_Index].innerHTML);
		
	});
	$("#ReviewCat").click(function() {
		console.log("点击了审核页面的预览");
		var _chip = $("#lable5Chip").val();
		var _model = $("#lable5Model").val();
		var node = '{"chip":"'+_chip+'","model":"'+_model+'"}';
		console.log(node);
		sendHTTPRequest(coocaaVersion+"/product/preview", node, getPreviewInfo);
	});
	$("#noPassReview").click(function() {
        console.log("点击了审核页面的审核不通过");
        var _type = $("#myAddModalLabel").attr("num");//1-审核、2-编辑、3-恢复
		var _state = $("#myAddModalLabel").attr("type");//(0正常\1修改\2增加\3删除)
        console.log(_type +"----"+_state);
        $("#mydialog").attr("buttontype","0");//点击审核不通过
        document.getElementById("mydialog").style.display = "block";
	    document.getElementById("myDeleteModalLabel").innerHTML = "审核操作";
	    document.getElementById("dialogword").innerHTML = "是否确认不通过该文件？";
	    scrollTopStyle("page5Modal1");
	    //sendHTTPRequest();
	});
	$("#reButton").click(function() {
		passSubmit();
	});
	$("#btn_submit").click(function() {
		passSubmit();
	});
	$("#closeReview").click(function() {
		console.log("点击了审核页面的关闭");
		console.log("用户等级："+level);
		$("#mydialog").attr("buttontype","2");//点击审核不通过
		var _type = $("#myAddModalLabel").attr("num");//1-审核、2-编辑、3-恢复
		var _state = $("#myAddModalLabel").attr("type");//(0正常\1修改\2增加\3删除)
        console.log(_type +"----"+_state);
        if (_type == 1) {
        	if (level == 1) {
		        freshReviewHtml(1);
		    }else{
		        document.getElementById("mydialog").style.display = "block";
		        document.getElementById("myDeleteModalLabel").innerHTML = "关闭操作";
		        document.getElementById("dialogword").innerHTML = "当前操作未保存，是否确认退出？";
		    }
        } else{
        	document.getElementById("mydialog").style.display = "block";
	        document.getElementById("myDeleteModalLabel").innerHTML = "关闭操作";
	        document.getElementById("dialogword").innerHTML = "当前操作未保存，是否确认退出？";
        }
	});
	$("#myDeleteModalEnsure").click(function() {
		var _type = $("#myAddModalLabel").attr("num");//1-审核、2-编辑、3-恢复
		var _state = $("#myAddModalLabel").attr("type");//(0正常\1修改\2增加\3删除)
	    console.log(_type +"----"+_state);
		
		if (_type == 1) {
			console.log("审核时确认框的确认键的点击");
			var _chip = $("#lable5Chip").val();
			var _model = $("#lable5Model").val();
			var _flag = "";
			if($("#mydialog").attr("buttontype") == 0||$("#mydialog").attr("buttontype") == 1){
				_flag = $("#mydialog").attr("buttontype");
			}
			var recoveObj = {
				"chip" : _chip,
				"model" : _model,
				"flag" : _flag
			}
			var _recove = JSON.stringify(recoveObj);
			var node = '{"data":' + _recove + '}';
			console.log(node);
			sendHTTPRequest(coocaaVersion+"/product/review", node, setreviewInfo);
		} else if(_type == 2){
			console.log("编辑时确认框的确认键的点击");
			reviewEdit();
		} else if(_type == 3){
			console.log("恢复时确认框的确认键的点击");
			recoverSure();
		}
		
	    changeAdd.splice(0,changeAdd.length);
	    changeConf.splice(0,changeConf.length);
	    changeDev.splice(0,changeDev.length);
	    changeReduce.splice(0,changeReduce.length);
	});
	$("#myCopyModalClose").click(function() {
		$("#myPreviewModal").css("display","none");
	});
	
	$("#myEditEnsureX").click(function() {
		console.log("修改提示框的X按钮");
		document.getElementById("myEditEnsureDiv").style.display = "none";
		freshReviewHtml(1);//1-本身、2-本身+第一页第二页、3-本身+第五页
	});
	$("#myEditCancle").click(function() {
		console.log("修改提示框的取消按钮");
		document.getElementById("myEditEnsureDiv").style.display = "none";
		freshReviewHtml(1);//1-本身、2-本身+第一页第二页、3-本身+第五页
	});
	$("#myEditEnsure").click(function() {
		console.log("修改提示框的确定按钮");
		//获取基本项、config、MK、系统设置的值
		var _base = getBaseValue();
		var _config = getConfigValue();
		var _sys = getSysValue();
		_base = JSON.stringify(_base);
		_config = JSON.stringify(_config);
		_sys = JSON.stringify(_sys);
		var node = '{"baseInfo":' + _base + ',"configInfo":' + _config + ',"settingsInfo":' + _sys + '}';
		console.log(node);
		sendHTTPRequest(coocaaVersion+"/product/update", node, productAddResult);
	});
	
}
function setreviewInfo(){
	if(this.readyState == 4) {
		if(this.status == 200) {
			var data = JSON.parse(this.responseText);
            console.log(data);
            if(data.resultCode == 0){
            	console.log("success");
            	$("#page5Modal1").modal('hide');
            	$("#mydialog").css("display","none");
            	freshReviewHtml(2);
            }
		};
	}
}

function passSubmit(){
	var _type = $("#myAddModalLabel").attr("num");//1-审核、2-编辑、3-恢复
	var _state = $("#myAddModalLabel").attr("type");//(0正常\1修改\2增加\3删除)
    console.log(_type +"----"+_state);
    if (_type == 1) {
    	console.log("点击了审核页面的审核通过");
    	$("#mydialog").attr("buttontype","1");//点击审核通过
    	passIssue();
    } else if(_type == 2){
    	console.log("点击了审核页面的编辑操作的提交");
    	editIssue();
    } else if(_type == 3){
    	console.log("点击了审核页面删除操作的确认删除");
    	deleteIssue();
    }
    scrollTopStyle("page5Modal1");
}
//页面加载时新增页的查询功能
function allQueryResult() {
	if(this.readyState == 4) {
		if(this.status == 200) {
			var data = JSON.parse(this.responseText);
            console.log(data);
            if(data.resultCode == 0){
            	configQueryData(data.resultData[3],data.resultData[0]);
				moduleQueryData(data.resultData[4],data.resultData[1]);
				settingsQueryData(data.resultData[5],data.resultData[2]);
            }
			colorstatus(0);
		};
		var node1 = '{}';
		sendHTTPRequest(coocaaVersion+"/device/queryAll", node1 , targetproductQueryResult);
	}
}
function targetproductQueryResult() {
	if(this.readyState == 4) {
		if(this.status == 200) {
			var data = JSON.parse(this.responseText);
			console.log(data);
			if(data.resultCode == "0") {
				for(var i = 0; i < data.resultData[3].length; i++) {
					autoDataArray1.push(data.resultData[3][i].name);
				}
				instantQuery(autoDataArray1,autogitArray);
			}
		}
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
					$(".settingsitems")[j].innerHTML += "<div class='col-xs-3'><input id='"+arr2[i].engName+"' type='checkbox' oldvalue='0' class='sysitems' cnName='"+arr2[i].cnName+"' descText='"+arr2[i].descText+"' engName='"+arr2[i].engName+"' level1='" + arr2[i].level1 + "' level2='" + arr2[i].level2 + "' level3='" + arr2[i].level3 + "' value=''><span title='" + arr2[i].descText + "'>" + arr2[i].cnName + "</span></div>";
				} else{
					if (arr2[i].level3 == $(".settingsitems:eq(" + (j) + ")").attr("level3")) {
						$(".settingsitems")[j].innerHTML += "<div class='col-xs-3'><input id='"+arr2[i].engName+"' type='checkbox' oldvalue='0' class='sysitems' cnName='"+arr2[i].cnName+"' descText='"+arr2[i].descText+"' engName='"+arr2[i].engName+"' level1='" + arr2[i].level1 + "' level2='" + arr2[i].level2 + "' level3='" + arr2[i].level3 + "' value=''><span title='" + arr2[i].descText + "'>" + arr2[i].cnName + "</span></div>";
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
		obj.innerHTML += "<div class='col-xs-3'><input id='"+data[kk].engName+"' type='checkbox' class='mkitems' category='" + data[kk].category + "' cnName='"+data[kk].cnName+"' descText='"+data[kk].descText+"' engName='"+data[kk].engName+"' gitPath='"+data[kk].gitPath+"' name='"+data[kk].category+"' value='' disabled><span title='" + data[kk].descText + "'>" + data[kk].cnName + "</span></div>";
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

//管理员点审核时的执行函数
function review(obj,adminControl,deleteFlag){
	//document.getElementById("loading").style.display = "block";
    if (adminControl) {
    	//是管理员、是提交者
        if (deleteFlag == "3") {
        	//删除
            document.getElementById("changeDescDiv").style.display="none";
        }else{
        	//新增或者修改
            document.getElementById("changeDescDiv").style.display="block";
        }       
    }
    $("#newFileDesc").hide();
    $("#changeDeviceDesc").hide();
    $("#addModelDesc").hide();
    $("#removeModelDesc").hide();
    $("#changeConfigDesc").hide();
	var a = $(".eachaudit").index($(obj));
	var b = $(".eachedit").index($(obj));
	console.log(a+"||||"+b);
	var _index = Math.abs(a)*Math.abs(b);
	console.log(_index);
	$("#myAddModalLabel").attr("num","1");//1-审核、2-编辑、3-恢复
	$("#myAddModalLabel").attr("type",deleteFlag);//(0正常\1修改\2增加\3删除)
	var node = '{"chip":"'+$("#page5_table2 .chip")[_index].innerHTML+'","model":"'+$("#page5_table2 .model")[_index].innerHTML+'"}';
	sendHTTPRequest(coocaaVersion+"/product/queryAllByMachine", node, getPointProductInfo);
}
function edit(obj,adminControl,deleteFlag){
//	document.getElementById("loading").style.display = "block";
    $("#changeDescDiv").css("display","none");
    $("#myAddModalLabel").attr("num","2");//1-审核、2-编辑、3-恢复
	$("#myAddModalLabel").attr("type",deleteFlag);//(0正常\1修改\2增加\3删除)
	
	var a = $(".eachaudit").index($(obj));
	var b = $(".eachedit").index($(obj));
	console.log(a+"||||"+b);
	var _index = Math.abs(a)*Math.abs(b);
	console.log(_index);
	var node = '{"chip":"'+$("#page5_table2 .chip")[_index].innerHTML+'","model":"'+$("#page5_table2 .model")[_index].innerHTML+'"}';
	sendHTTPRequest(coocaaVersion+"/product/queryAllByMachine", node, getPointProductInfo);
}
//恢复
function recover(obj,deleteFlag){
	console.log("in recover");
	var a = $(".eachaudit").index($(obj));
	var b = $(".eachedit").index($(obj));
	console.log(a+"||||"+b);
	var _index = Math.abs(a)*Math.abs(b);
	console.log(_index);
	var chip = $("#page5_table2 .chip")[_index].innerHTML;
	var model = $("#page5_table2 .model")[_index].innerHTML;
	$("#reviewDialog").attr("ochip",chip);
	$("#reviewDialog").attr("omodel",model);
	$("#myAddModalLabel").attr("num","3");//1-审核、2-编辑、3-恢复
	$("#myAddModalLabel").attr("type",deleteFlag);//(0正常\1修改\2增加\3删除)
    document.getElementById("mydialog").style.display = "block";
    document.getElementById("myDeleteModalLabel").innerHTML = "恢复操作";
    document.getElementById("dialogword").innerHTML = "确认撤销删除吗？";   
}
function recoverSure(){
	var chip = $("#reviewDialog").attr("ochip");
	var model = $("#reviewDialog").attr("omodel");
	console.log(chip+"------"+model);
	var recoveObj = {
		"chip" : chip,
		"model" : model
	}
	var _recove = JSON.stringify(recoveObj);
	var node = '{"data":' + _recove + '}';
	console.log(node);
	sendHTTPRequest(coocaaVersion+"/product/deleteRecovery", node, getRecoverProductInfo);
}
function getRecoverProductInfo(){
	if(this.readyState == 4) {
        if(this.status == 200) {
            var data = JSON.parse(this.responseText);
            console.log(data);
            if(data.resultCode == 0){
            	console.log("数据返回成功");
            	document.getElementById("mydialog").style.display = "none";
				document.getElementById("myDeleteModalLabel").style.display = "none";
				freshReviewHtml(2);
            }
        };
    }
}
//管理员点审核、时的数据请求函数
function getPointProductInfo(){
	if(this.readyState == 4) {
        if(this.status == 200) {
            var data = JSON.parse(this.responseText);
            console.log(data);
            if(data.resultCode == 0){
            	console.log("数据返回成功");
            	var _type = $("#myAddModalLabel").attr("num");//1-审核、2-编辑、3-恢复
            	var _state = $("#myAddModalLabel").attr("type");//(0正常\1修改\2增加\3删除)
            	console.log(_type +"---"+_state);
            	CommonDataInsert2(_type,data.resultData[0]);
            	ConfigDataInsert2(_type,data.resultData[1]);
            	SysDataInsert2(_type,data.resultData[2]);
            	MKDataInsert2(_type,data.resultData[3]);
				buttonstyle(_type,_state);
				
				$('#page5Modal1').modal();
				$(".modal-backdrop").addClass("new-backdrop");
            }
        };
    }
}
function CommonDataInsert2(type,arr){
	console.log(type);
	console.log(arr);
	$("#lable5Chip").val(arr[0].chip);
	$("#lable5Model").val(arr[0].model);
	$("#lable5TP").val(arr[0].targetProduct);
	$("#lable5CoocaaVersion").val(arr[0].coocaaVersion);
	$("#lable5AndroidVersion").val(arr[0].androidVersion);
	$("#lable5ChipMode").val(arr[0].soc);
	$("#lable5Emmc").val(arr[0].EMMC);
	$("#lable5Memory").val(arr[0].memorySize);
	$("#lable5GitBranch").val(arr[0].gitBranch);
	$("#lable5Platform").val(arr[0].platform);
	if(type == 2){//编辑
		$("#lable5CoocaaVersion").attr("oldvalue",arr[0].coocaaVersion);
		$("#lable5AndroidVersion").attr("oldvalue",arr[0].androidVersion);
		$("#lable5ChipMode").attr("oldvalue",arr[0].chipModel);
		$("#lable5Emmc").attr("oldvalue",arr[0].EMMC);
		$("#lable5Memory").attr("oldvalue",arr[0].memorySize);
		$("#lable5GitBranch").attr("oldvalue",arr[0].gitBranch);
		$("#lable5Platform").attr("oldvalue",arr[0].platform);
		
		$("#lable5CoocaaVersion").attr("onchange","changeDevice(this)");
		$("#lable5AndroidVersion").attr("onchange","changeDevice(this)");
        $("#lable5ChipMode").attr("onchange","changeDevice(this)");
        $("#lable5Emmc").attr("onchange","changeDevice(this)");
        $("#lable5Memory").attr("onchange","changeDevice(this)");
        $("#lable5GitBranch").attr("onchange","changeDevice(this)");
        $("#lable5Platform").attr("onchange","changeDevice(this)");
	}
	
}
function ConfigDataInsert2(type, arr){
	for (var i=0; i<arr.length; i++) {
		$("#"+arr[i].engName).val(arr[i].curValue);
		$("#"+arr[i].engName).attr("value",arr[i].curValue);
	}
	if (type == 2) {
		for (var i=0; i<$(".configitems").length; i++) {
			$(".configitems:eq("+i+")").attr("onchange","changeConfig(this)");
			$(".configitems:eq("+i+")").attr("oldvalue",$(".configitems:eq("+i+")").attr("value"));
		}
	}
}
function MKDataInsert2(type, arr){
	console.log(type);
	for (var j=0; j<$(".mkradio").length; j++) {
		document.getElementsByClassName("mkradio")[j].removeAttribute('checked');
	}
	for (var i=0; i<arr.length; i++) {
		document.getElementById(arr[i].engName).setAttribute('checked', 'true');
	}
//	olrplayerid = arr[i].id;
}
function SysDataInsert2(type, arr){
	for (var i=0; i<arr.length; i++) {
		document.getElementById(arr[i].engName).setAttribute('checked', 'true');
	}
	if (type == 2) {
		for (var i=0; i<$(".sysitems").length; i++) {
			$(".sysitems:eq("+i+")").attr("onchange","changeSettings(this)");
//			$(".sysitems:eq("+i+")").attr("oldvalue",$(".sysitems:eq("+i+")").attr("value"));
		}
	}
}
function buttonstyle(type,state){
	if(type == 1){
		console.log("点击的是审核");
		$("#myAddModalLabel").html("审核");
		$("#noPassReview").css("display","block");
		$("#ReviewCat").css("display","block");
		var inputcounts = document.getElementsByTagName("input");
        var selectcounts = document.getElementsByTagName("select");
        for (var i = 0; i < inputcounts.length; i++) {
            inputcounts[i].setAttribute('disabled','');
            inputcounts[i].style.backgroundColor = "#ebebe4";
        }
        for (var i = 0; i < selectcounts.length; i++) {
            selectcounts[i].setAttribute('disabled','');
            selectcounts[i].style.backgroundColor = "#ebebe4";
        }
		if (state == 3) {
            document.getElementById("btn_submit").innerHTML = "确认删除";
            document.getElementById("reButton").innerHTML = "确认删除";
            document.getElementById("btn_submit").style.color = "red";
            document.getElementById("reButton").style.color = "red";
        }else{
            document.getElementById("btn_submit").innerHTML = "审核通过";
            document.getElementById("reButton").innerHTML = "审核通过";
        }
		
	}else{
		console.log("点击的是编辑");
		$("#noPassReview").css("display","none");
		$("#ReviewCat").css("display","none");
		$("#myAddModalLabel").html("编辑");
		$("#btn_submit").html("提交");
		$("#reButton").html("提交");
		
		var inputcounts = document.getElementsByTagName("input");
        var selectcounts = document.getElementsByTagName("select");
        for (var i = 0; i < inputcounts.length; i++) {
            inputcounts[i].removeAttribute('disabled');
            inputcounts[i].style.backgroundColor = "#FFFFFF";
        }
        for (var i = 0; i < selectcounts.length; i++) {
            selectcounts[i].removeAttribute('disabled');
            selectcounts[i].style.backgroundColor = "#FFFFFF";
        }
        for (var i=0; i<$(".mkitems").length; i++) {
			$(".mkitems:eq("+i+")").attr("disabled","disabled");
		}
        $("#lable5Chip").attr("disabled","disabled");
		$("#lable5Model").attr("disabled","disabled");
		$("#lable5TP").attr("disabled","disabled");
		$("#lable5Chip").css("backgroundColor","#ebebe4");
		$("#lable5Model").css("backgroundColor","#ebebe4");
		$("#lable5TP").css("backgroundColor","#ebebe4");
	}
}

//删除弹窗
function deleteIssue(){
    document.getElementById("mydialog").style.display = "block";
    document.getElementById("myDeleteModalLabel").innerHTML = "删除操作";
    document.getElementById("dialogword").innerHTML = "确认要删除该配置信息吗？";
}
//审核弹窗
function passIssue(){
    document.getElementById("mydialog").style.display = "block";
    document.getElementById("myDeleteModalLabel").innerHTML = "审核操作";
    document.getElementById("dialogword").innerHTML = "确认通过审核吗？";
}

//编辑提交弹窗
function editIssue(){
    console.log("changeDev"+changeDev);
    console.log("changeAdd"+changeAdd);
    console.log("changeReduce"+changeReduce);
    console.log("changeConf"+changeConf);
    //判断基本项是否为空
	var nullName = 0;
	for (var i=0; i<$("#page5Modal1Table .inputstyle").length; i++) {
		var _curValue = $("#page5Modal1Table .inputstyle")[i].value;
		var _curInput = $("#page5Modal1Table .inputstyle")[i].getAttribute("name");
		console.log(_curValue);
		if (_curValue==null||_curValue=="") {
			console.log(_curInput + "项不能为空");
			nullName = i+1;
			i = $("#page5Modal1Table .inputstyle").length;
			document.getElementById("page5Modal1ErrorInfo").style.display = "block";
			document.getElementById("page5Modal1ErrorInfo").innerHTML = _curInput + "项不能为空";
			setTimeout("document.getElementById('page5Modal1ErrorInfo').style.display = 'none';", 3000);
		}
	}
	console.log(nullName);
	if (nullName == 0) {
		console.log("没有空项");
		var _errNum = 0;
		var isTrueData0 = $("#page5Modal1Table .fuzzySearch")[3].value;
		var isTrueData1 = $("#page5Modal1Table .fuzzySearch")[4].value;
		console.log(isTrueData0+"-"+isTrueData1);
		var index0 = autoDataArray1.indexOf(isTrueData0);
		var index1 = autogitArray.indexOf(isTrueData1);
		console.log(index0+"-"+index1);
		if (index0 == "-1"||index1 == "-1") {
			var _curInput = "";
			if (index0 == "-1") {
				_errNum = 3;
			}
			if (index1 == "-1") {
				_errNum = 4;
			}
			var _curInput = $("#page5Modal1Table .fuzzySearch")[_errNum].getAttribute("name");
			document.getElementById("page5Modal1ErrorInfo").style.display = "block";
			document.getElementById("page5Modal1ErrorInfo").innerHTML = _curInput + "项的值不存在";
			setTimeout("document.getElementById('page5Modal1ErrorInfo').style.display = 'none';", 3000);
		} else{
			//弹出确认框
			console.log(changeAdd);
			console.log(changeReduce);
			console.log(changeConf);
			console.log(changeDev);
			if (changeAdd.length+changeReduce.length+changeConf.length+changeDev.length == 0) {
				console.log("未做任何修改");
				document.getElementById("page2Modal1ErrorInfo").innerHTML = "您未做任何修改。";
				document.getElementById("MoreEditBack").style.display = "none";
				setTimeout("document.getElementById('page2Modal1ErrorInfo').innerHTML='　'",3000);
			} else{
				console.log("做了修改");
				document.getElementById("myEditEnsureDiv").style.display = "block";
				if (changeDev.length != 0) {
			        $("#txt1").css("display", "block");
			        document.getElementById("txt11").innerHTML = changeDev;
				}
			    if(changeAdd.length != 0){
			        $("#txt2").css("display", "block");
			        document.getElementById("txt22").innerHTML = changeAdd;
			    }
			    if (changeReduce.length != 0) {
			        $("#txt3").css("display", "block");
			        document.getElementById("txt33").innerHTML = changeReduce;
			    }
			    if (changeConf.length != 0) {
			        $("#txt4").css("display", "block");
			        $("#txt44").val(changeConf);
			        document.getElementById("txt44").innerHTML = changeConf;
			    }
			}
		}
	}
}
//点击编辑提交的函数
function reviewEdit(){
	console.log("lxw " + loginusername + "--" + level);
}
//点击预览
function getPreviewInfo(){
    if(this.readyState == 4) {
        if(this.status == 200) {
            var data = JSON.parse(this.responseText);
            console.log(data);
            if(data.resultCode == 0) {
                console.log("lxw " + "预览-成功");
//              document.getElementById("loading").style.display = "none";
                $("#myPreviewModalLabel").text("预览");
				$('#myPreviewModal').css("display","block"); //弹出编辑页（即新增页，只是每项都有数据，这个数据从后台获取）
				$("#myPreviewModal").find("li")[0].className = "presentation active";
				$("#myPreviewModal").find("li")[1].className = "presentation";
				$("#myPreviewModal").find("li")[2].className = "presentation";
               	
               	document.getElementById("myPreviewBodyOne").innerHTML = data.resultData.text1;
                document.getElementById("myPreviewBodyTwo").innerHTML = data.resultData.text2;
                document.getElementById("myPreviewBodyThree").innerHTML = data.resultData.text3;
            } else{
                console.log("lxw " + "预览-失败");
                document.getElementById("myPreviewBodyOne").innerHTML = "信息出错，请刷新";
                document.getElementById("myPreviewBodyTwo").innerHTML = "信息出错，请刷新";
                document.getElementById("myPreviewBodyThree").innerHTML = "信息出错，请刷新";
            };
        };
    }
}

function getBaseValue(){
	var _chip = $("#page5Modal1Table .inputstyle")[0].value;
	var _model = $("#page5Modal1Table .inputstyle")[1].value;
	var _tp = $("#page5Modal1Table .inputstyle")[2].value;
	var _coocaa = $("#page5Modal1Table .inputstyle")[3].value;
	var _android = $("#page5Modal1Table .inputstyle")[4].value;
	var _soc = $("#page5Modal1Table .inputstyle")[5].value;
	var _emmc = $("#page5Modal1Table .inputstyle")[6].value;
	var _memory = $("#page5Modal1Table .inputstyle")[7].value;
	var _branch = $("#page5Modal1Table .inputstyle")[8].value;
	var _platform = $("#page5Modal1Table .inputstyle")[9].value;
	//auditState(0审核通过\1待审核\2审核未通过)、modifyState(0正常\1修改\2增加\3删除)
	var baseObj = {
		"chip" : _chip,
		"model" : _model,
		"targetProduct" : _tp,
		"coocaaVersion" : _coocaa,
		"androidVersion" : _android,
		"soc" : _soc,
		"EMMC" : _emmc,
		"memorySize" : _memory,
		"gitBranch" : _branch,
		"auditState" : 1,
		"modifyState" : 2,
		"platform" : _platform,
		"userName" : loginusername
	}
	baseObj = JSON.stringify(baseObj);
	return baseObj;
}
function getConfigValue(){
	var configData = [];
	for (var i=0; i<$(".configitems").length; i++) {
		var oAconfigInfo = {
			"engName": "",
			"curValue": ""
		};
		oAconfigInfo.engName = $(".configitems")[i].getAttribute("id");
		oAconfigInfo.curValue = $(".configitems")[i].value;
		configData.push(oAconfigInfo);
	}
	return configData;
	
}
function getSysValue(){
	var sysData = [];
	for (var i=0; i<$(".sysitems").length; i++) {
		var oAsysInfo = {
			"engName": "",
		};
		oAsysInfo.engName = $(".sysitems")[i].getAttribute("engname");
		sysData.push(oAsysInfo);
	}
	return sysData;
}

function changeConfig(obj){
    var x = obj.value;
    console.log(x);
    console.log(obj.getAttribute("oldvalue"))
    if(x == obj.getAttribute("oldvalue")){
        Array.prototype.indexOf = function(val) {
            for (var i = 0; i < this.length; i++) {
                if (this[i] == val) return i;
            }
            return -1;
        };
        Array.prototype.remove = function(val) {
            var index = this.indexOf(val);
            if (index > -1) {
                this.splice(index, 1);
            }
        };
        changeConf.remove(obj.getAttribute("cnname"));
        console.log("changeConf= "+changeConf);
    }
    else{
        if (changeConf.indexOf(obj.getAttribute("cnname")) == -1){
            changeConf.push(obj.getAttribute("cnname"));
            console.log("changeConf= "+changeConf);
        }
    }
}
function changeSettings(obj){
	console.log(obj.checked+"--"+obj.getAttribute("oldvalue"));
    if (obj.checked && (obj.getAttribute("oldvalue") == '0')) {
        // obj.oldvalue = '1';
        obj.setAttribute("oldvalue","1");
        changeAdd.push(obj.getAttribute("cnname"));
        console.log("add"+changeAdd);
        console.log("changeReduce"+changeReduce);
    }else if(!(obj.checked) && (obj.getAttribute("oldvalue") == '0')){
        obj.setAttribute("oldvalue","2");
        changeReduce.push(obj.getAttribute("cnname"));
        console.log("add"+changeAdd);
        console.log("changeReduce"+changeReduce);
    }else{
        obj.setAttribute("oldvalue","0");
        Array.prototype.indexOf = function(val) {
            for (var i = 0; i < this.length; i++) {
                if (this[i] == val) return i;
            }
            return -1;
        };
        Array.prototype.remove = function(val) {
            var index = this.indexOf(val);
            if (index > -1) {
                this.splice(index, 1);
            }
        };
        changeReduce.remove(obj.getAttribute("cnname"));
        changeAdd.remove(obj.getAttribute("cnname"));
        console.log("add"+changeAdd);
        console.log("changeReduce"+changeReduce);
    }   
}
function changeDevice(obj){
    var x = obj.value;
    console.log(x);
    console.log(obj.getAttribute("oldvalue"))
    if(x == obj.getAttribute("oldvalue")){
        Array.prototype.indexOf = function(val) {
            for (var i = 0; i < this.length; i++) {
                if (this[i] == val) return i;
            }
            return -1;
        };
        Array.prototype.remove = function(val) {
            var index = this.indexOf(val);
            if (index > -1) {
                this.splice(index, 1);
            }
        };
        changeDev.remove(obj.getAttribute("name"));
        console.log("changeDev = "+changeDev);
    }
    else{
        if (changeDev.indexOf(obj.getAttribute("name")) == -1) {
            changeDev.push(obj.getAttribute("name"));
            console.log("changeDev = "+changeDev);
        }
    }
}

function productAddResult(){
	if(this.readyState == 4) {
		if(this.status == 200) {
			var data = JSON.parse(this.responseText);
			console.log(data);
			if(data.resultCode == "0") {
				console.log("数据修改提交成功");
				var _desc = '{"changeDev":"'+changeDev+'","changeAdd":"'+changeAdd+'","changeReduce":"'+changeReduce+'","changeConf":"'+changeConf+'"}';
				var _reason = document.getElementById("changeReason").innerHTML;
				var _chip = $("#lable5Chip").val();
				var _model = $("#lable5Model").val();
				//0审核通过\1待审核\2审核未通过
				var _state = "1";
				var _author = loginusername;
				var historyObj = {
					"chip" : _chip,
					"model" : _model,
					"reason" : _reason,
					"state" : _state,
					"userName" : _author,
					"content" : _desc
				}
				$("#page5Modal1").modal('hide');
				document.getElementById("myEditEnsureDiv").style.display = "none";
				var _history = JSON.stringify(historyObj);
				var node = '{"data":' + _history + '}';
				sendHTTPRequest(coocaaVersion+"/product/addHistory", node, productHistoryAdd);
			}
		}
	}
}

function productHistoryAdd(){
	if(this.readyState == 4) {
		if(this.status == 200) {
			var data = JSON.parse(this.responseText);
			console.log(data);
			if(data.resultCode == "0") {
				console.log("日志数据提交成功");
				freshReviewHtml(1);
			}
		}
	}
}










function instantQuery(arr1, arr2) {
	console.log(arr1);
	console.log(arr2);
	var _$ = function(id) {
		return "string" == typeof id ? document.getElementById(id) : id;
	}
	var Bind = function(object, fun) {
		return function() {
			return fun.apply(object, arguments);
		}
	}

	function AutoComplete(obj, autoObj, arr) {
		this.obj = _$(obj); //输入框
		this.autoObj = _$(autoObj); //DIV的根节点
		this.value_arr = arr; //不要包含重复值
		this.index = -1; //当前选中的DIV的索引
		this.search_value = ""; //保存当前搜索的字符
		this.curvalue = ""; //保存当前搜索到的结果
		this.curname = ""; //保存当前输入框id
	}
	AutoComplete.prototype = {
		//初始化DIV的位置
		init: function() {
			this.autoObj.style.left = this.obj.offsetLeft + "px";
			this.autoObj.style.top = this.obj.offsetTop + this.obj.offsetHeight + "px";
			this.autoObj.style.width = this.obj.offsetWidth - 2 + "px"; //减去边框的长度2px
		},
		//删除自动完成需要的所有DIV
		deleteDIV: function() {
			while(this.autoObj.hasChildNodes()) {
				this.autoObj.removeChild(this.autoObj.firstChild);
			}
			this.autoObj.className = "auto_hidden";
		},
		//设置值
		setValue: function(_this) {
			return function() {
				_this.obj.value = this.seq;
				//checkInArray(_this.obj.id,$("#"+_this.obj.id).val());
				if (_this.obj.id == "lable2TargetProduct") {
					changeMKByTP(_this.obj.id, _this.obj.value);
				}
				_this.autoObj.className = "auto_hidden";
			}
		},
		//模拟鼠标移动至DIV时，DIV高亮
		autoOnmouseover: function(_this, _div_index) {
			return function() {
				_this.index = _div_index;
				var length = _this.autoObj.children.length;
				for(var j = 0; j < length; j++) {
					if(j != _this.index) {
						_this.autoObj.childNodes[j].className = 'auto_onmouseout';
					} else {
						_this.autoObj.childNodes[j].className = 'auto_onmouseover';
					}
				}
			}
		},
		//更改classname
		changeClassname: function(length) {
			for(var i = 0; i < length; i++) {
				if(i != this.index) {
					this.autoObj.childNodes[i].className = 'auto_onmouseout';
				} else {
					this.autoObj.childNodes[i].className = 'auto_onmouseover';
					this.obj.value = this.autoObj.childNodes[i].seq;
				}
			}
		},

		//响应键盘
		pressKey: function(event) {
			var length = this.autoObj.children.length;
			//光标键"↓"
			if(event.keyCode == 40) {
				++this.index;
				if(this.index > length) {
					this.index = 0;
				} else if(this.index == length) {
					this.obj.value = this.search_value;
				}
				this.curvalue = this.autoObj.children[this.index].innerText;
				console.log(this.curvalue + "--" + this.index + "--" + this.autoObj);
				this.changeClassname(length);
				this.autoObj.scrollTop = this.autoObj.children[this.index].offsetHeight * this.index;
			}
			//光标键"↑"
			else if(event.keyCode == 38) {
				this.index--;
				if(this.index < -1) {
					this.index = length - 1;
				} else if(this.index == -1) {
					this.obj.value = this.search_value;
				}
				this.curvalue = this.autoObj.children[this.index].innerText;
				console.log(this.curvalue);
				this.changeClassname(length);
			}
			//回车键
			else if(event.keyCode == 13) {
				this.autoObj.className = "auto_hidden";
				//checkInArray(this.autoObj.id,document.getElementById(this.autoObj.id).childNodes[this.index].innerText);
				if (this.autoObj.id == "page2_tp_auto2") {
					changeMKByTP(this.curname, this.curvalue);
				}
				this.index = -1;
			} else {
				this.index = -1;
			}
		},
		//程序入口
		start: function(event) {
			if(event.keyCode != 13 && event.keyCode != 38 && event.keyCode != 40) {
				this.init();
				this.deleteDIV();
				this.search_value = this.obj.value;
				var valueArr = this.value_arr;
				valueArr.sort();
				if(this.obj.value.replace(/(^\s*)|(\s*$)/g, '') == "") {
					return;
				} //值为空，退出
				try {
					var reg = new RegExp("(" + this.obj.value + ")", "i");
				} catch(e) {
					return;
				}
				var div_index = 0; //记录创建的DIV的索引
				for(var i = 0; i < valueArr.length; i++) {
					if(reg.test(valueArr[i])) {
						var div = document.createElement("div");
						div.className = "auto_onmouseout";
						div.seq = valueArr[i];
						div.onclick = this.setValue(this);
						div.onmouseover = this.autoOnmouseover(this, div_index);
						div.innerHTML = valueArr[i].replace(reg, "<strong>$1</strong>"); //搜索到的字符粗体显示
						this.autoObj.appendChild(div);
						this.autoObj.className = "auto_show";
						this.curname = this.obj.id;
						div_index++;
					}
				}
			}
			this.pressKey(event);
			window.onresize = Bind(this, function() {
				this.init();
			});
		}
	}
	autoComplete1 = new AutoComplete('lable5ChipMode', 'page5_soc_auto2', arr1);
	autoComplete2 = new AutoComplete('lable5GitBranch', 'page5_git_auto2', arr2);
	
	/* 点击空白出隐藏临时div */
	_$(document).onclick = function(e) {
		var e = e || window.event; //浏览器兼容性 
		var elem = e.target || e.srcElement;
		var showArray = ["page5_soc_auto2","page5_git_auto2"];
		var showBox = ["lable5ChipMode","lable5ChipMode"];
		eachShowObj(showArray,showBox);
	}
	function eachShowObj(arr,arr2){
		for (var i=0; i<arr.length; i++) {
			var _style = document.getElementById(arr[i]).getAttribute("class");
			if(_style == "auto_show") {
				document.getElementById(arr[i]).setAttribute("class", "auto_hidden")
			}
		}
	}
}
function scrollTopStyle(name){
	var div = document.getElementById(name);
	var body = parent.document.getElementById("homePage");
	document.getElementById(name).scrollTop = 0;
	parent.document.getElementById("homePage").scrollTop = 0;
}
//刷新当前iframe
function freshReviewHtml(num) {
    var htmlObject = parent.document.getElementById("tab_userMenu5");
    var htmlObject2 = parent.document.getElementById("tab_userMenu4");
    var htmlObject3 = parent.document.getElementById("tab_userMenu2");
    var htmlObject4 = parent.document.getElementById("tab_userMenu1");
    htmlObject.firstChild.src = "page5.html";
    if (htmlObject2) {
        htmlObject2.firstChild.src = "page4.html";
    }
    if (htmlObject3) {
    	htmlObject3.firstChild.src = "page2.html";
    }
    if (htmlObject4) {
    	htmlObject4.firstChild.src = "page1.html";
    }
}   