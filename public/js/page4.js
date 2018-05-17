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

var level = null;
var loginusername = null;
var fromEmail = null;
var adminControl = null;

var changeAdd = [];
var changeReduce = [];
var changeConf = [];
var changeDev = [];

$(function() {
	level = parent.adminFlag;
    loginusername = parent.loginusername;
    fromEmail = parent.loginEmail;
	
	var node = '{"offset":"-1","rows":"10"}';
	sendHTTPRequest("/product/queryByPage", node, productQuery);
	
	buttonInitBefore();
});

function productQuery() {
	if(this.readyState == 4) {
		if(this.status == 200) {
			var data = JSON.parse(this.responseText);
			console.log(data);
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
	$("#ReviewCat").click(function() {
		console.log("点击了审核页面的预览");
		var _chip = $("#lable4Chip").val();
		var _model = $("#lable4Model").val();
		var node = '{"chip":"'+_chip+'","model":"'+_model+'"}';
		console.log(node);
		sendHTTPRequest("/product/preview", node, getPreviewInfo);
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
	    scrollTopStyle("page4Modal1");
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
			var _chip = $("#lable4Chip").val();
			var _model = $("#lable4Model").val();
			var _flag = "";
			if($("#mydialog").attr("buttontype") == 0){
				_flag = 0
			}else if($("#mydialog").attr("buttontype") == 1){
				_flag = 1
			}
			
			var recoveObj = {
				"chip" : _chip,
				"model" : _model,
				"flag" : _flag
			}
			var _recove = JSON.stringify(recoveObj);
			var node = '{"data":' + _recove + '}';
			console.log(node);
			sendHTTPRequest("/product/review", node, setreviewInfo);
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
}
function setreviewInfo(){
	if(this.readyState == 4) {
		if(this.status == 200) {
			var data = JSON.parse(this.responseText);
            console.log(data);
            if(data.resultCode == 0){
            	console.log("success");
            	$("#page4Modal1").modal('hide');
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
    scrollTopStyle("page4Modal1");
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
	var node = '{"chip":"'+$("#page4_table2 .chip")[_index].innerHTML+'","model":"'+$("#page4_table2 .model")[_index].innerHTML+'"}';
	sendHTTPRequest("/product/queryAllByMachine", node, getPointProductInfo);
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
	var node = '{"chip":"'+$("#page4_table2 .chip")[_index].innerHTML+'","model":"'+$("#page4_table2 .model")[_index].innerHTML+'"}';
	sendHTTPRequest("/product/queryAllByMachine", node, getPointProductInfo);
}
//恢复
function recover(obj,deleteFlag){
	console.log("in recover");
	var a = $(".eachaudit").index($(obj));
	var b = $(".eachedit").index($(obj));
	console.log(a+"||||"+b);
	var _index = Math.abs(a)*Math.abs(b);
	console.log(_index);
	var chip = $("#page4_table2 .chip")[_index].innerHTML;
	var model = $("#page4_table2 .model")[_index].innerHTML;
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
	sendHTTPRequest("/product/deleteRecovery", node, getRecoverProductInfo);
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
            	MKDataInsert2(_type,data.resultData[2]);
            	//SysDataInsert2(_type,data.resultData[3]);
				buttonstyle(_type,_state);
				
				$('#page4Modal1').modal();
				$(".modal-backdrop").addClass("new-backdrop");
            }
        };
    }
}
function CommonDataInsert2(type,arr){
	console.log(type);
	console.log(arr);
	$("#lable4Chip").val(arr[0].chip);
	$("#lable4Model").val(arr[0].model);
	$("#lable4TP").val(arr[0].targetProduct);
	$("#lable4CoocaaVersion").val(arr[0].coocaaVersion);
	$("#lable4AndroidVersion").val(arr[0].androidVersion);
	$("#lable4ChipMode").val(arr[0].soc);
	$("#lable4Emmc").val(arr[0].EMMC);
	$("#lable4Memory").val(arr[0].memorySize);
	$("#lable4GitBranch").val(arr[0].gitBranch);
	$("#lable4Platform").val(arr[0].platform);
	if (type == 1) {//审核、都不可修改
		$("#lable4Chip").attr("disabled","disabled");
		$("#lable4Model").attr("disabled","disabled");
		$("#lable4TP").attr("disabled","disabled");
	}else if(type == 2){//编辑
		$("#lable4Chip").val(arr[0].chip);
		$("#lable4Chip").css("color","red");
		$("#lable4Chip").attr("disabled","disabled");
		$("#lable4Model").val(arr[0].model);
		$("#lable4Model").css("color","red");
		$("#lable4Model").attr("disabled","disabled");
		$("#lable4TP").val(arr[0].targetProduct);
		$("#lable4TP").css("color","red");
		$("#lable4TP").attr("disabled","disabled");
		
		$("#lable4CoocaaVersion").attr("oldvalue",arr[0].coocaaVersion);
		$("#lable4AndroidVersion").attr("oldvalue",arr[0].androidVersion);
		$("#lable4ChipMode").attr("oldvalue",arr[0].chipModel);
		$("#lable4Emmc").attr("oldvalue",arr[0].EMMC);
		$("#lable4Memory").attr("oldvalue",arr[0].memorySize);
		$("#lable4GitBranch").attr("oldvalue",arr[0].gitBranch);
		$("#lable4Platform").attr("oldvalue",arr[0].platform);
		
		$("#lable4CoocaaVersion").attr("onchange","changeDevice(this)");
		$("#lable4AndroidVersion").attr("onchange","changeDevice(this)");
        $("#lable4ChipMode").attr("onchange","changeDevice(this)");
        $("#lable4Emmc").attr("onchange","changeDevice(this)");
        $("#lable4Memory").attr("onchange","changeDevice(this)");
        $("#lable4GitBranch").attr("onchange","changeDevice(this)");
        $("#lable4Platform").attr("onchange","changeDevice(this)");
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
			$(".sysitems:eq("+i+")").attr("onchange","changeConfig(this)");
			$(".sysitems:eq("+i+")").attr("oldvalue",$(".sysitems:eq("+i+")").attr("value"));
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
//	if (changeDev.length==0&&changeAdd.length==0&&changeReduce.length==0&&changeConf.length==0) {
//		document.getElementById("myAddModalErrorInfo").innerHTML = "您未做任何修改。";
//		setTimeout("document.getElementById('myAddModalErrorInfo').innerHTML='　'",3000);
//	} else{
//	   	document.getElementById("mydialog").style.display = "block";
//	    document.getElementById("dialogword").setAttribute("style","text-align:left");
//	    document.getElementById("myDeleteModalLabel").innerHTML = "编辑操作";
//	    document.getElementById("dialogword").innerHTML = "您做了以下操作，确认提交该修改吗？<br>"+"<span id='txt1'>修改设备信息：<br><span id='txt11'>　"+changeDev+"</span></span><span id='txt2'>新增模块：<br><span id='txt22'>　"+changeAdd+"</span></span><span id='txt3'>删除模块：<br><span id='txt33'>　"+changeReduce+"</span></span><span id='txt4'>修改配置：<br>　<span id='txt44'>"+changeConf+"</span></span>";
//	    if (changeDev.length != 0) {
//	        document.getElementById("txt1").style.display="block";
//	    }
//	    if(changeAdd.length != 0    ){
//	        document.getElementById("txt2").style.display="block";
//	    }
//	    if (changeReduce.length != 0) {
//	        document.getElementById("txt3").style.display="block";
//	    }
//	    if (changeConf.length != 0) {
//	        document.getElementById("txt4").style.display="block";
//	    }
//	    document.getElementById("dialogword").setAttribute("max-height","350px");
// 	}
}
//点击编辑提交的函数
function reviewEdit(){
	console.log("lxw " + loginusername + "--" + level);
//	var dataObj = {
//		"configFile": "",
//		"mkFile": "",
//		"memorySize": "",
//		"chipModel": "",
//		"androidVersion": "",
//		"model": "",
//		"chip": "",
//		"targetProduct": "",
//		"gerritState": "1", // 0表示正常状态，1表示待审核状态，2表示审核不通过状态
//		"operateType": "3", // 0表示无状态，1表示增加，2表示删除，3表示修改
//		"userName": loginusername,
//		"desc": "enenen"
//	};
//	// 获取DeviceInfo里的信息
//	var oEchip = document.getElementById("newCheckChip").value;
//  oEchip123 = oEchip;
//	var oEmodel = document.getElementById("newCheckModel").value;
//  oEmodel123 = oEmodel;
//	var oEandroidVersion = document.getElementById("newCheckAndroidVersion").value;
//	var oEchipModel = document.getElementById("newCheckChipMode").value;
//	var oEmemorySize = document.getElementById("newCheckMemory").value;
//	var oEtargetProduct = document.getElementById("newCheckDevice").value;
//  var oldProduct = document.getElementById("newCheckDevice").getAttribute("oldvalue");
//	var oEgerritState = "1";
//	var oEoperateType = "3";
//	var userName = loginusername;
//	var desc = "enheng";
//
//	//获取config里的数据
//	var editConfigFile = {};
//	var oEconfigTrlength = $("#myCheckModalConfigTableTbody").find("tr");
//	console.log("lxw " + oEconfigTrlength.length);
//	for(var i = 0; i < oEconfigTrlength.length; i++) {
//		var oEConfigobj = {};
//		var thisConfigindex = null;
//		oEconfigTrDiv = $("#myCheckModalConfigTableTbody").find("tr:eq(" + i + ")").find("div");
//		console.log("lxw" + oEconfigTrDiv.length);
//		for(var j = 1; j < oEconfigTrDiv.length; j++) {
//			var oEopt = [];
//			var oEstuInfo = {
//				"cnName": "",
//				"engName": "",
//				"configKey": "",
//				"type": "",
//				"value": "",
//				"category": "",
//				"desc": "XXXXX",
//				"options": []
//			};
//			thisConfigindex = j;
//			oEstuInfo.category = oEconfigTrDiv[0].title;
//			oEstuInfo.cnName = oEconfigTrDiv[thisConfigindex].childNodes[0].getAttribute("cnName");
//			oEstuInfo.engName = oEconfigTrDiv[thisConfigindex].childNodes[0].getAttribute("name");
//			oEstuInfo.configKey = oEconfigTrDiv[thisConfigindex].childNodes[0].getAttribute("configKey");
//			oEstuInfo.type = oEconfigTrDiv[thisConfigindex].childNodes[1].name;
//			oEstuInfo.value = oEconfigTrDiv[thisConfigindex].childNodes[1].value;
//          oEstuInfo.desc = oEconfigTrDiv[thisConfigindex].childNodes[0].getAttribute("title");
//			if(oEstuInfo.type == "string") {
//				oEopt = [];
//			} else if(oEstuInfo.type == "enum") {
//				var jjlength = oEconfigTrDiv[thisConfigindex].childNodes[1].childNodes;
//				console.log("lxw " + jjlength.length);
//				for(var jj = 0; jj < jjlength.length; jj++) {
//					var optValue = jjlength[jj].value;
//					oEopt.push(optValue);
//				}
//			}
//			oEstuInfo.options = oEopt;
//			editConfigFile[oEconfigTrDiv[thisConfigindex].childNodes[1].getAttribute("id")] = oEstuInfo;
//		}
//	}
//	//获取mkFile里的信息
//	var editMkFile = {};
//	var oEMkTrDiv = $("#myCheckModalMkTableTbody").find("tr");
//	console.log("lxw " + oEMkTrDiv.length);
//	var oEMkindex = null;
//	for(var i = 0; i < oEMkTrDiv.length; i++) {
//		var oEMkobj = {};
//		oEMkTrDivTwo = $("#myCheckModalMkTableTbody").find("tr:eq(" + i + ")").find("div");
//		console.log("lxw" + oEMkTrDivTwo.length);
//		for(var j = 1; j < oEMkTrDivTwo.length; j++) {
//			oEMkindex = j;
//			if(oEMkTrDivTwo[oEMkindex].childNodes[0].checked == true) {
//				var oEoptTwo = [];
//				var oEstuInfoTwo = {
//					"cnName": "",
//					"engName": "",
//					"gitPath": "",
//					"category": "",
//					"desc": "XXXXX", //后期做“”的处理。
//				};
//				oEstuInfoTwo.category = oEMkTrDivTwo[oEMkindex].childNodes[1].getAttribute("category");
//				oEstuInfoTwo.cnName = oEMkTrDivTwo[oEMkindex].childNodes[1].innerHTML;
//				oEstuInfoTwo.engName = oEMkTrDivTwo[oEMkindex].childNodes[1].getAttribute("name");
//				oEstuInfoTwo.gitPath = oEMkTrDivTwo[oEMkindex].childNodes[1].getAttribute("gitPath");
//				oEstuInfoTwo.desc = oEMkTrDivTwo[oEMkindex].childNodes[1].getAttribute("title");
//				editMkFile[oEMkTrDivTwo[oEMkindex].childNodes[0].getAttribute("id")] = oEstuInfoTwo;
//			}
//		}
//	}
//	dataObj.configFile = editConfigFile;
//	dataObj.mkFile = editMkFile;
//	dataObj.memorySize = oEmemorySize;
//	dataObj.chipModel = oEchipModel;
//	dataObj.androidVersion = oEandroidVersion;
//	dataObj.model = oEmodel;
//	dataObj.chip = oEchip;
//	dataObj.targetProduct = oEtargetProduct;
//	dataObj.gerritState = "1"; // 0表示审核通过，1表示待审核状态，2表示审核不通过状态
//	dataObj.operateType = "3"; // 0表示无状态，1表示增加，2表示删除，3表示修改
//	dataObj.userName = loginusername;
//	dataObj.desc = "enenene";
//  var operateTime = new Date().getTime();
//  console.log(operateTime);
//  var changedesc = '{"changeDev":"'+changeDev+'","changeAdd":"'+changeAdd+'","changeReduce":"'+changeReduce+'","changeConf":"'+changeConf+'"}';
//  var a = JSON.parse(changedesc);
//	var oEnode = '{"data":{"condition":{"targetProduct":"'+oldProduct+'","chip":"' + oEchip + '","model":"' + oEmodel + '"},"action":"set","update":{"userName":"' + loginusername +'","operateTime":"' + operateTime + '","memorySize":"' + oEmemorySize + '","chipModel":"' + oEchipModel + '","androidVersion":"' + oEandroidVersion + '","targetProduct":"' + oEtargetProduct + '","gerritState":"1","operateType":"3","androidVersion":"' + oEandroidVersion + '","mkFile":' + JSON.stringify(editMkFile) + ',"configFile":' + JSON.stringify(editConfigFile) + ',"desc":'+JSON.stringify(a) + '}}}';
//	console.log("lxw " + oEnode);
//  allTargetMk = editMkFile;
//	submitStatus(hashObj,dataObj,oEnode);
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






















function scrollTopStyle(name){
	var div = document.getElementById(name);
	var body = parent.document.getElementById("homePage");
	document.getElementById(name).scrollTop = 0;
	parent.document.getElementById("homePage").scrollTop = 0;
}
//刷新当前iframe
function freshReviewHtml(num) {
    var htmlObject = parent.document.getElementById("tab_userMenu4");
    var htmlObject2 = parent.document.getElementById("tab_userMenu5");
    var htmlObject3 = parent.document.getElementById("tab_userMenu2");
    var htmlObject4 = parent.document.getElementById("tab_userMenu1");
    htmlObject.firstChild.src = "page4.html";
//  if (htmlObject2) {
//      htmlObject2.firstChild.src = "page5.html";
//  }
    if (htmlObject3) {
    	htmlObject3.firstChild.src = "page2.html";
    }
    if (htmlObject4) {
    	htmlObject4.firstChild.src = "page1.html";
    }
}   