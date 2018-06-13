document.write("<script language=javascript src='../js/sentHTTP.js' charset=\"utf-8\"></script>");

var autoDataArray1 = new Array();
var autoComplete1 = "";

var _twoLevelLinkageArrayOne = [[],[],[],[]];
var _twoLevelLinkageArrayTwo = [[],[],[],[]];
var _twoLevelLinkageArrayThree = [[],[],[],[]];
var _myArray = [];

var level = null;
var loginusername = null;
var fromEmail = null;
var toEmail = null;
var emailReason = null;
var _author = null;
var adminControl = null;

var changeAdd = [];
var changeReduce = [];
var changeConf = [];
var changeDev = [];
var changeProp = [];

var recoverChip = null;
var recoverModel = null;

var coocaaVersion = "/v6.0";

$(function() {
	level = parent.loginlevel;
    loginusername = parent.loginusername;
    fromEmail = parent.loginEmail;
	
//	var node = '{"offset":"-1","rows":"10"}';
//	sendHTTPRequest(coocaaVersion+"/product/queryByPage", node, productQuery);
	
	var searchObj = {
		"userName" : loginusername,
		"level" : level
	}
	var _search = JSON.stringify(searchObj);
	var node = '{"data":' + _search + '}';
	console.log(node);
	sendHTTPRequest(coocaaVersion+"/product/queryAuditByUser", node, productQuery);
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
				for (var i=0; i<data.resultData[1].length; i++) {
					arr.push(data.resultData[1][i]);
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
			"number": "",
			"model": "",
			"chip": "",
			"chipmodel": "",
			"AndroidVersion": "",
			"memory": "",
			"type": "",
			"author": "",
			"reason": "<button class='btn-success eachlook'>查看</button>",
			"time" : "",
			"operate": ""
		};
		//auditState(0审核通过\1待审核\2审核未通过
		//modifyState(0正常\1修改\2增加\3删除)
		var operateType = arr[i].modifyState;
		var	userName = loginusername;
		eachItem2.number = (i+1);
		eachItem2.model = arr[i].model;
		eachItem2.chip = arr[i].chip;
		eachItem2.chipmodel = arr[i].soc;
		eachItem2.AndroidVersion = arr[i].androidVersion;
		eachItem2.memory = arr[i].memorySize;
		eachItem2.author = arr[i].userName;
		eachItem2.time = arr[i].operateTime;
		if (operateType == 0) {
			eachItem2.type = "正常";
		} else if(operateType == 1){
			eachItem2.type = "修改";
		}else if(operateType == 2){
			eachItem2.type = "增加";
		}else if(operateType == 3){
			eachItem2.type = "删除";
		}
		if (level == 1) {
            if (eachItem2.author == loginusername) {
                if (operateType == 3) {
                	//管理员&&是提交者&&删除
                	eachItem2.operate = "<button class='btn-danger eachaudit' onclick='review(this,1,3)'>审核</button><button class='btn-danger eachedit' onclick='recover(this,"+operateType+")'>恢复</button>";
                }else{
                	//管理员&&是提交者&&编辑或者增加
                	eachItem2.operate = "<button class='btn-danger eachaudit' onclick='review(this,1,"+operateType+")'>审核</button><button class='btn-danger eachedit' onclick='edit(this,1,0)'>编辑</button>";
                }
            }else{
            	//管理员&&非提交者
            	eachItem2.operate = "<button class='btn-danger eachaudit' onclick='review(this,0,"+operateType+")'>审核</button>";
            }
            getdataArray2.push(eachItem2);
        }else{
        	if (eachItem2.author == loginusername) {
		        if (operateType == 3) {
		        	//非管理员&&是提交者&&删除
		        	eachItem2.operate = "<button class='btn-danger eachedit' onclick='recover(this,"+operateType+")'>恢复</button>";
		        }else{
		        	//非管理员&&是提交者&&新增或者编辑
		        	eachItem2.operate = "<button class='btn-danger eachedit' onclick='edit(this,1,"+operateType+")'>编辑</button>";
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
		'title': ["序号", "机型", "机芯", "芯片型号", "安卓版本", "内存", "类型", "提交者", "修改历史", "时间", "操作"],
		'body': ["number", "model", "chip", "chipmodel", "AndroidVersion", "memory", "type", "author", "reason", "time", "operate"], //tbody td 取值的字段 必填
		'display': [2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1], //隐藏域，1显示，2隐藏 必填
		'pageNUmber': 10, //每页显示的条数 选填
		'pageLength': data1.length, //选填
		'url': data1 //数据源 必填
	});
	editStatusByLength(data1.length);
}
function reloadClick(){
	console.log("in reloadClick");
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
	$("#oButtonX").click(function() {
		$("#mydialog").css("display","none");
	});
	$("#oButtonX2").click(function() {
		$("#mydialog2").css("display","none");
	});
	$("#page5_close1").click(function() {
		document.getElementById("descriptTbody").innerHTML = "";
		$("#page5_examine").modal('hide');
	});
	$("#page5_close2").click(function() {
		document.getElementById("descriptTbody").innerHTML = "";
		$("#page5_examine").modal('hide');
	});
}
function colorstatus(number){
	for(var k = 0; k < $(".page5_tabs").length; k++) {
		$(".page5_boxes")[k].style.display = "none";
		$(".page5_tabs")[k].style.backgroundColor = "#337ab7";
		$(".page5_tabs")[k].style.borderColor = "#2e6da4";
	}
	$(".page5_boxes")[number].style.display = "block";
	$(".page5_tabs")[number].style.backgroundColor = "#5cb85c";
	$(".page5_tabs")[number].style.borderColor = "#4cae4c";
}

function buttonInitAfter(){
	$(".eachlook").click(function() {
		var _Index = $(".eachlook").index($(this));
		console.log("点击的是第" + _Index + "个 查看项。");
		console.log($("#page5_table2 .chip")[_Index].innerHTML);
		console.log($("#page5_table2 .model")[_Index].innerHTML);
		$("#page5_check_chip").html($("#page5_table2 .chip")[_Index].innerHTML);
		$("#page5_check_model").html($("#page5_table2 .model")[_Index].innerHTML);
		$('#page5_examine').modal();
		var node = '{"chip":"'+$("#page5_table2 .chip")[_Index].innerHTML+'","model":"'+$("#page5_table2 .model")[_Index].innerHTML+'"}';
		sendHTTPRequest(coocaaVersion+"/product/queryHistory", node, productHistoryQuery);
	});
	$("#ReviewCat").click(function() {
		console.log("点击了审核页面的预览");
		var _chip = $("#lable5Chip").val();
		var _model = $("#lable5Model").val();
		var reviewObj = {
			"chip" : _chip,
			"model" : _model,
			"flag" : 1,
		}
		var _review = JSON.stringify(reviewObj);
		var node = '{"data":' + _review + '}';
		console.log(node);
		sendHTTPRequest(coocaaVersion+"/product/preview", node, getPreviewInfo);
	});
	$("#noPassReview").click(function() {
        console.log("点击了审核页面的审核不通过");
        var _type = $("#myAddModalLabel").attr("num");//1-审核、2-编辑、3-恢复
		var _state = $("#myAddModalLabel").attr("type");//(0正常\1修改\2增加\3删除)
        console.log(_type +"----"+_state);
        $("#mydialog").attr("buttontype","1");//点击审核不通过
        $("#mydialog").css("display","block");
        $("#errorChangeInfo2").css("display","none");
        $("#changetitle3").css("display","block");
        $("#changeReason3").css("display","block");
	    document.getElementById("myDeleteModalLabel").innerHTML = "审核操作";
	    document.getElementById("dialogword").innerHTML = "是否确认不通过该文件？";
	    scrollTopStyle("page5Modal1");
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
		$("#mydialog").attr("buttontype","2");//点击关闭
		var _type = $("#myAddModalLabel").attr("num");//1-审核、2-编辑、3-恢复
		var _state = $("#myAddModalLabel").attr("type");//(0正常\1修改\2增加\3删除)
        console.log(_type +"----"+_state);
        if (_type == 1) {
	        document.getElementById("mydialog").style.display = "block";
	        $("#errorChangeInfo2").css("display","none");
	        $("#changeReason3").css("display","none");
	        $("#changetitle3").css("display","none");
	        document.getElementById("myDeleteModalLabel").innerHTML = "关闭操作";
	        document.getElementById("dialogword").innerHTML = "当前操作未保存，是否确认退出？";
        } else{
        	document.getElementById("mydialog").style.display = "block";
        	$("#errorChangeInfo2").css("display","none");
        	$("#changeReason3").css("display","none");
        	$("#changetitle3").css("display","none");
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
			if (document.getElementById("changeReason3").style.display == "block") {
				var content = document.getElementById("changeReason3").value;
				content = content.replace(/\s*/g,"");
				console.log(content +"---"+content.length);
				if(content == null || content.length == 0){
					document.getElementById("errorChangeInfo2").style.display = "inline-block";
					setTimeout("document.getElementById('errorChangeInfo2').style.display = 'none';", 3000);
				} else{
					emailReason = content;
					reviewSure(_state);
				}
			} else{
				reviewSure(_state);
			}
		} else if(_type == 2){
			console.log("编辑时关闭确认框的的点击");
			$("#mydialog").css("display","none");
			$("#page5Modal1").modal("hide");
//			page5fresh(2);
		} else if(_type == 3){
			console.log("恢复时确认框的确认键的点击");
			recoverSure();
		}
		
	    changeAdd.splice(0,changeAdd.length);
	    changeConf.splice(0,changeConf.length);
	    changeDev.splice(0,changeDev.length);
	    changeReduce.splice(0,changeReduce.length);
	    changeProp.splice(0,changeProp.length);
	});
	$("#myDeleteModalEnsure2").click(function() {
		recoverSure();
	});
	
	$("#myCopyModalClose").click(function() {
		$("#myPreviewModal").css("display","none");
	});
	
	$("#myEditEnsureX").click(function() {
		console.log("修改提示框的X按钮");
		document.getElementById("myEditEnsureDiv").style.display = "none";
		//page5fresh(1);//1-本身、2-本身+第一页第二页、3-本身+第五页
	});
	$("#myEditCancle").click(function() {
		console.log("修改提示框的取消按钮");
		document.getElementById("myEditEnsureDiv").style.display = "none";
		//page5fresh(1);//1-本身、2-本身+第一页第二页、3-本身+第五页
	});
	$("#myEditEnsure").click(function() {
		console.log("修改提示框的确定按钮");
		var content = document.getElementById("changeReason").value;
		content = content.replace(/\s*/g,"");
		console.log(content +"---"+content.length);
		if(content == null || content.length == 0){
			document.getElementById("errorChangeInfo").style.display = "inline-block";
			setTimeout("document.getElementById('errorChangeInfo').style.display = 'none';", 3000);
		} else{
			editSure();
		}
	});
	
}

function passSubmit(){
	var _type = $("#myAddModalLabel").attr("num");//1-审核、2-编辑、3-恢复
	var _state = $("#myAddModalLabel").attr("type");//(0正常\1修改\2增加\3删除)
    console.log(_type +"----"+_state);
    if (_type == 1) {
    	console.log("点击了审核页面的审核通过");
    	$("#mydialog").attr("buttontype","0");//点击审核通过
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
            	configQueryData1(data.resultData[4],data.resultData[0]);
				moduleQueryData1(data.resultData[5],data.resultData[1]);
				settingsQueryData1(data.resultData[7],data.resultData[2]);
				propQueryData1(data.resultData[6],data.resultData[3]);
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
				instantQuery(autoDataArray1);
			}
		}
	}
}

function configQueryData1(arr1,arr2) {
	var _myConfigBox = document.getElementById("myConfigBox");
	for(var i = 0; i < arr1.length; i++) {
		_myConfigBox.innerHTML += '<div class="configitems1 eachpartbox" category="'+ arr1[i].category +'"><div class="grouptitle" title="'+arr1[i].category+'">'+arr1[i].category+'</div></div>';
	}
	var kk = 0;
	for (var j=0; j< $(".configitems1").length; j++) {
		for(var i = 0; i < arr2.length; i++) {
			if(arr2[i].category == $(".configitems1:eq(" + (j) + ")").attr("category")) {
				kk = i;
				configDataInsert1(kk, $(".configitems1")[j], arr2);
			}
		}
	}
}
function moduleQueryData1(arr1,arr2) {
	var _myMKBox = document.getElementById("myMkBox");
	for(var i = 0; i < arr1.length; i++) {
		_myMKBox.innerHTML += '<div class="moduleitems eachpartbox" category="'+ arr1[i].category +'"><div class="grouptitle" title="'+arr1[i].category+'">'+arr1[i].category+'</div></div>';
	}
	var kk = 0;
	for (var j=0; j< $(".moduleitems").length; j++) {
		for(var i = 0; i < arr2.length; i++) {
			if(arr2[i].category == $(".moduleitems:eq(" + (j) + ")").attr("category")) {
				kk = i;
				mkDataInsert1(kk, $(".moduleitems")[j], arr2);
			}
		}
	}
	document.getElementsByClassName("mkradio")[0].setAttribute('checked', 'true');
}
function settingsQueryData1(arr1,arr2) {
	var _mySysSettingBox = document.getElementById("mySysSettingBox");
	var _mySourceBoxBox = document.getElementById("mySourceBoxBox");
	var _myMarketShowBox = document.getElementById("myMarketShowBox");
	var _myMiddlewareBox = document.getElementById("myMiddlewareBox");
	var kk = 0;
	for(var i = 0; i < arr1.length; i++) {
		if (arr1[i].level1 == "系统设置") {
			kk = i;
			sysDataInsert1(kk,_mySysSettingBox,0,arr1);
		} else if(arr1[i].level1 == "信号源工具箱"){
			kk = i;
			sysDataInsert1(kk,_mySourceBoxBox,1,arr1);
		}else if(arr1[i].level1 == "卖场演示"){
			kk = i;
			sysDataInsert1(kk,_myMarketShowBox,2,arr1);
		}else if(arr1[i].level1 == "中间件"){
			kk = i;
			sysDataInsert1(kk,_myMiddlewareBox,3,arr1);
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
function propQueryData1(arr1,arr2) {
	var _myPropBox = document.getElementById("myPropBox");
	for(var i = 0; i < arr1.length; i++) {
		_myPropBox.innerHTML += '<div class="propitems eachpartbox" category="'+ arr1[i].category +'"><div class="grouptitle" title="'+arr1[i].category+'">'+arr1[i].category+'</div></div>';
	}
	var kk = 0;
	for (var j=0; j< $(".propitems").length; j++) {
		for(var i = 0; i < arr2.length; i++) {
			if(arr2[i].category == $(".propitems:eq(" + (j) + ")").attr("category")) {
				kk = i;
				propDataInsert1(kk, $(".propitems")[j], arr2);
			}
		}
	}
}

function configDataInsert1(kk, obj, data) {
	if(data[kk].typeStr == "string") {
		obj.innerHTML += "<div class='col-xs-6' style='margin-bottom:2px;'><span class='col-xs-6' title='"+data[kk].descText+"'>"+data[kk].cnName+":</span><input class='col-xs-6 configitems' type='text' category='"+data[kk].category+"' cnName='"+data[kk].cnName+"' descText='"+data[kk].descText+"' id='"+data[kk].engName+"' options='"+data[kk].options+"' typeStr='"+data[kk].typeStr+"' value='"+data[kk].defaultValue+"' defaultValue='"+data[kk].defaultValue+"'></div>";
	} else if(data[kk].typeStr == "enum") {
		var _myAddselect = "<select class='col-xs-6 configitems' category='"+data[kk].category+"' cnName='"+data[kk].cnName+"' descText='"+data[kk].descText+"' id='"+data[kk].engName+"' options='"+data[kk].options+"' typeStr='" + data[kk].typeStr + "' defaultValue='" + data[kk].defaultValue + "' value='" + data[kk].defaultValue + "'>";
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
		_myAddselect = "<div class='col-xs-6' style='margin-bottom:2px;'><span class='col-xs-6' title='" + data[kk].descText + "'>" + data[kk].cnName + " :</span>" + _myAddselect + "</select></div>";
		obj.innerHTML += _myAddselect;
	}
}
function mkDataInsert1(kk, obj, data) {
	if (data[kk].category == "PlayerLibrary") {
		obj.innerHTML += "<div class='col-xs-3'><input id='"+data[kk].engName+"' type='radio' class='mkitems mkradio' category='" + data[kk].category + "' cnName='"+data[kk].cnName+"' descText='"+data[kk].descText+"' engName='"+data[kk].engName+"' gitPath='" + data[kk].gitPath + "' name='" + data[kk].category + "' value='' disabled><span title='" + data[kk].descText + "'>" + data[kk].cnName + "</span></div>";
	} else{
		obj.innerHTML += "<div class='col-xs-3'><input id='"+data[kk].engName+"' type='checkbox' class='mkitems' category='" + data[kk].category + "' cnName='"+data[kk].cnName+"' descText='"+data[kk].descText+"' engName='"+data[kk].engName+"' gitPath='"+data[kk].gitPath+"' name='"+data[kk].category+"' value='' disabled><span title='" + data[kk].descText + "'>" + data[kk].cnName + "</span></div>";
	}
}
function sysDataInsert1(i, obj, num, arr1){
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
function propDataInsert1(kk, obj, data) {
	obj.innerHTML += "<div class='col-xs-6' style='margin-bottom:2px;'><span class='col-xs-6' title='"+data[kk].descText+"'>"+data[kk].engName+":</span><input class='col-xs-6 propitem' type='text' category='"+data[kk].category+"' descText='"+data[kk].descText+"' id='"+data[kk].engName+"' value='"+data[kk].defaultValue+"' defaultValue='"+data[kk].defaultValue+"'></div>";
}

//审核
function review(obj,adminControl,deleteFlag){
	//document.getElementById("loading").style.display = "block";
    if (adminControl) {
    	//是管理员、是提交者
        if (deleteFlag == "3") {
        	//删除
        	document.getElementById("page5_firstTr").style.display="none";
        }else{
        	//新增或者修改
        	document.getElementById("page5_firstTr").style.display="table-row";
        }       
    }
    resetAllInfo();//删除前面的操作痕迹
	var a = $(".eachaudit").index($(obj));
	var b = $(".eachedit").index($(obj));
	console.log(a+"||||"+b);
	var _index = Math.abs(a)*Math.abs(b);
	console.log(_index);
	_author = $("#page5_table2 .author")[_index].innerHTML;
	$("#myAddModalLabel").attr("num","1");//1-审核、2-编辑、3-恢复
	$("#myAddModalLabel").attr("type",deleteFlag);//(0正常\1修改\2增加\3删除)
	var node = '{"chip":"'+$("#page5_table2 .chip")[_index].innerHTML+'","model":"'+$("#page5_table2 .model")[_index].innerHTML+'"}';
	sendHTTPRequest(coocaaVersion+"/product/queryAllByMachineTemp", node, getPointProductInfo);
}
//编辑
function edit(obj,adminControl,deleteFlag){
//	document.getElementById("loading").style.display = "block";
    $("#changeDescDiv").css("display","none");
    $("#myAddModalLabel").attr("num","2");//1-审核、2-编辑、3-恢复
	$("#myAddModalLabel").attr("type",deleteFlag);//(0正常\1修改\2增加\3删除)
	resetAllInfo();//删除前面的操作痕迹
	var a = $(".eachaudit").index($(obj));
	var b = $(".eachedit").index($(obj));
	console.log(a+"||||"+b);
	var _index = Math.abs(a)*Math.abs(b);
	console.log(_index);
	_author = $("#page5_table2 .author")[_index].innerHTML;
	var node = '{"chip":"'+$("#page5_table2 .chip")[_index].innerHTML+'","model":"'+$("#page5_table2 .model")[_index].innerHTML+'"}';
	sendHTTPRequest(coocaaVersion+"/product/queryAllByMachineTemp", node, getPointProductInfo);
}
//恢复
function recover(obj,deleteFlag){
	var a = $(".eachaudit").index($(obj));
	var b = $(".eachedit").index($(obj));
	var _index = Math.abs(a)*Math.abs(b);
	recoverChip = $("#page5_table2 .chip")[_index].innerHTML;
	recoverModel = $("#page5_table2 .model")[_index].innerHTML;
	_author = $("#page5_table2 .author")[_index].innerHTML;
	$("#reviewDialog2").attr("ochip",recoverChip);
	$("#reviewDialog2").attr("omodel",recoverModel);
	$("#myAddModalLabel2").attr("num","3");//1-审核、2-编辑、3-恢复
	$("#myAddModalLabel2").attr("type",deleteFlag);//(0正常\1修改\2增加\3删除)
    document.getElementById("mydialog2").style.display = "block";
    document.getElementById("myDeleteModalLabel2").innerHTML = "恢复操作";
    document.getElementById("dialogword2").innerHTML = "确认撤销删除吗？";
    
    console.log(level+"---"+loginusername);
    if (_author != loginusername) {
    	getCommitterEmail(_author);
    }
}

//审核的提交
function reviewSure(state){
	var _chip = $("#lable5Chip").val();
	var _model = $("#lable5Model").val();
	var _flag = null;
	if($("#mydialog").attr("buttontype") == 0||$("#mydialog").attr("buttontype") == 1){
		_flag = $("#mydialog").attr("buttontype");
		_flag = parseInt(_flag);
		state = parseInt(state);
		var recoveObj = {
			"chip" : _chip,
			"model" : _model,
			"flag" : _flag,
			"operate": state
		}
		console.log(recoveObj);
		var _recove = JSON.stringify(recoveObj);
		var node = '{"data":' + _recove + '}';
		console.log(node);
		sendHTTPRequest(coocaaVersion+"/product/review", node, setreviewInfo);
	}else if($("#mydialog").attr("buttontype") == 2){
    	$("#mydialog").css("display","none");
    	$("#page5Modal1").modal('hide');
	}
}
//编辑的提交
function editSure(){
	console.log("lxw " + loginusername + "--" + level);
	var _base = getBaseValue();
	var _config = getConfigValue();
	var _sys = getSysValue();
	var _prop = getPropValue();
	_base = JSON.stringify(_base);
	_config = JSON.stringify(_config);
	_sys = JSON.stringify(_sys);
	_prop = JSON.stringify(_prop);
	var node = '{"baseInfo":' + _base + ',"configInfo":' + _config + ',"settingsInfo":' + _sys + ',"propsInfo":' + _prop + '}';
	console.log(node);
	sendHTTPRequest(coocaaVersion+"/product/update", node, setEditInfo);
}
//恢复的提交
function recoverSure(){
	var chip = $("#reviewDialog2").attr("ochip");
	var model = $("#reviewDialog2").attr("omodel");
	console.log(chip+"------"+model);
	var recoveObj = {
		"chip" : chip,
		"model" : model
	}
	var _recove = JSON.stringify(recoveObj);
	var node = '{"data":' + _recove + '}';
	console.log(node);
	sendHTTPRequest(coocaaVersion+"/product/deleteRecovery", node, setRecoverInfo);
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
            	console.log(level+"---"+loginusername+"--"+_author);
			    if (_author != loginusername) {
			    	console.log("111111111111111");
			    	sendEmail();
			    }else{
			    	page5fresh(1);
			    }
            }
		};
	}
}
function setEditInfo(){
	if(this.readyState == 4) {
		if(this.status == 200) {
			var data = JSON.parse(this.responseText);
			console.log(data);
			if(data.resultCode == "0") {
				console.log("数据修改提交成功");
				var _desc = '{"changeDev":"'+changeDev+'","changeAdd":"'+changeAdd+'","changeReduce":"'+changeReduce+'","changeConf":"'+changeConf+'","changeProp":"'+changeProp+'"}';
				var _reason = document.getElementById("changeReason").value;
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
function setRecoverInfo(){
	if(this.readyState == 4) {
        if(this.status == 200) {
            var data = JSON.parse(this.responseText);
            console.log(data);
            if(data.resultCode == 0){
            	console.log("数据返回成功");
            	document.getElementById("mydialog").style.display = "none";
				document.getElementById("myDeleteModalLabel").style.display = "none";
				
				console.log(level+"---"+loginusername+"--"+_author);
			    if (_author != loginusername) {
			    	sendEmail();
			    }else{
			    	page5fresh(2);
			    }
            }
        };
    }
}
function sendEmail(){
	//1-审核、2-编辑、3-恢复
	var _num = $("#myAddModalLabel").attr("num");
	//(0正常\1修改\2增加\3删除)
	var _type = $("#myAddModalLabel").attr("type");
	console.log(_num);
	if (_num == 1) {
		var _chip = $("#lable5Chip").val();
		var _model = $("#lable5Model").val();
		console.log(_chip+"--------"+_model);
		var _buttontype = $("#mydialog").attr("buttontype");
		if (_type == 1) {
			if (_buttontype == 1) {
				//修改操作审核不通过
				console.log(emailReason);
				var maildata = "您修改的机芯："+_chip+",机型："+_model+" 的配置文档暂未通过审核，原因是："+emailReason+"请前往《审核未通过文件》菜单进行修改并再次提交";
			} else if(_buttontype == 0){
				//修改操作审核通过
				var maildata = "您修改的机芯："+_chip+",机型："+_model+" 的配置文档已经通过审核，请确认";
			}
		} else if (_type == 2) {
			if (_buttontype == 1) {
				//增加操作审核不通过
				var maildata = "您增加的机芯："+_chip+",机型："+_model+" 的配置文档暂未通过审核，请前往《审核未通过文件》菜单进行修改并再次提交";
			} else if(_buttontype == 0){
				//增加操作审核通过
				var maildata = "您增加的机芯："+_chip+",机型："+_model+" 的配置文档已经通过审核，请确认";
			}
		} else if(_type == 3){
			if (_buttontype == 1) {
				//删除操作审核不通过
				var maildata = "您删除的机芯："+_chip+",机型："+_model+" 的配置文档暂未通过审核，请前往《审核未通过文件》菜单进行修改并再次提交";
			} else if(_buttontype == 0){
				//删除操作审核通过
				var maildata = "您删除的机芯："+_chip+",机型："+_model+" 的配置文档已经通过审核，请确认";
			}
		}
		
	} else if(_num == 2){
		console.log("编辑");
		var _chip = $("#lable5Chip").val();
		var _model = $("#lable5Model").val();
		var _desc = '{"changeDev":"'+changeDev+'","changeAdd":"'+changeAdd+'","changeReduce":"'+changeReduce+'","changeConf":"'+changeConf+'","changeProp":"'+changeProp+'"}';
		console.log(_desc);
		var maildata = "用户："+loginusername+"<br/>针对机芯："+_chip+",机型："+_model+"做出了如下修改：";
	    if(changeDev.length != 0) {
	    	maildata += "<br/>修改设备信息："+ changeDev;
	    }
	    if(changeAdd.length != 0){
	        maildata += "<br/>新增模块："+ changeAdd;
	    }
	    if (changeReduce.length != 0){
	        maildata += "<br/>删除模块："+ changeReduce;
	    }
	    if (changeConf.length != 0){
	        maildata += "<br/>修改配置："+ changeConf;
	    }
	    if (changeProp.length != 0){
	        maildata += "<br/>修改属性："+ changeProp;
	    }
	}else if(_num == 3){
		console.log("恢复");
		var _chip = recoverChip;
		var _model = recoverModel;
		console.log(_chip+"--------"+_model);
		var maildata = "用户："+loginusername+"<br/>恢复删除机芯："+_chip+",机型："+_model+"的配置文档";
	}
	
	maildata += "<br/> -----<br/>进入配置平台请点击 <a href='http://172.20.132.225:3000/v2/scmplatform/index.html'>scmplatform</a>";
    var emailObj = {
		"desc" : maildata,
		"from" : fromEmail,
		"to" : toEmail,
		"subject" : "软件配置平台通知-自动发送，请勿回复"
	}
	var _email = JSON.stringify(emailObj);
	var node = '{"data":' + _email + '}';
	console.log(node);
    sendHTTPRequest("/sendMail", node, mailfun);
}
//邮件函数回调
function mailfun(){
	console.log("in mailfun");
	if(this.readyState == 4) {
		if(this.status == 200) {
			var data = JSON.parse(this.responseText);
			console.log(data);
		}
		page5fresh(1);
	}
}
//管理员点审核、恢复时的数据请求函数
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
            	PropDataInsert2(_type,data.resultData[3]);
            	MKDataInsert2(_type,data.resultData[4]);
				buttonstyle(_type,_state);
				
				$('#page5Modal1').modal();
				$(".modal-backdrop").addClass("new-backdrop");
				
				var node = '{"chip":"'+$("#lable5Chip").val()+'","model":"'+$("#lable5Model").val()+'"}';
				console.log(node);
				sendHTTPRequest(coocaaVersion+"/product/queryHistory", node, productHistoryQuery2);
            }
        };
    }
}

function productHistoryQuery2(){
	if(this.readyState == 4) {
		if(this.status == 200) {
			var data = JSON.parse(this.responseText);
			console.log(data);
			if(data.resultCode == "0") {
				console.log("数据查询成功");
				if (data.resultData.length == 0) {
					$("#changeDescDiv").css("display","none");
					$("#addDescDiv").css("display","block");
				} else{
					document.getElementById("reviewContent").innerHTML = "";
					document.getElementById("reviewReason").innerHTML = "";
					$("#changeDescDiv").css("display","block");
					$("#addDescDiv").css("display","none");
					var _desc = "";
					var _reason = data.resultData[0].reason;
					var _content = data.resultData[0].content;
					console.log(isJSON_test(_content));
					if (isJSON_test(_content)) {
						_content = JSON.parse(_content);
						_content.deleteObj = "";
					}else{
						_content= {
							changeDev : "",
							changeAdd : "",
							changeReduce: "",
							changeConf : "",
							changeProp: "",
							deleteObj : data.resultData[data.resultData.length-1].content
						};
					}
					console.log(_content);
					var _devArray,_addArray,_deleteArray,_confArray,_propsArray = "";
					
					var _devArray = _content.changeDev;//.splice(",")
					var _addArray = _content.changeAdd;//.splice(",")
					var _deleteArray = _content.changeReduce;//.splice(",")
					var _confArray = _content.changeConf;//.splice(",")
					var _propsArray = _content.changeProp;//.splice(",")
					var _deleteArray2 = _content.deleteObj;
					if (_devArray.length != 0) {
						_desc += "<span>修改了基本项："+_devArray+"</span><br/>";
					}if (_addArray.length != 0) {
						_desc += "<span>新增了设置项："+_addArray+"</span><br/>";
					}if (_deleteArray.length != 0) {
						_desc += "<span>删除了设置项："+_deleteArray+"</span><br/>";
					}if (_confArray.length != 0) {
						_desc += "<span>修改了Config项："+_confArray+"</span><br/>";
					}if (_propsArray.length != 0) {
						_desc += "<span>修改了Config项："+_propsArray+"</span><br/>";
					}
					if (_deleteArray2.length != 0){
						_desc += "<span>"+_deleteArray2+"</span><br/>";
					}
					$("#reviewContent").html(_desc);
					$("#reviewReason").html(_reason);
				}
			}
		}
		console.log(level+"---"+loginusername);
	    if (_author != loginusername) {
	    	getCommitterEmail(_author);
	    }
	}
}

function CommonDataInsert2(type,arr){
	console.log(type);
	console.log(arr);
	$("#lable5Chip").val(arr[0].chip);
	$("#lable5Model").val(arr[0].model);
	$("#lable5TP").val(arr[0].targetProduct);
	$("#lable5AndroidVersion").val(arr[0].androidVersion);
	$("#lable5ChipMode").val(arr[0].soc);
	$("#lable5Emmc").val(arr[0].EMMC);
	$("#lable5Memory").val(arr[0].memorySize);
	$("#lable5GitBranch").val(arr[0].gitBranch);
	$("#lable5Platform").val(arr[0].platform);
	if(type == 2){//编辑
		$("#lable5AndroidVersion").attr("oldvalue",arr[0].androidVersion);
		$("#lable5ChipMode").attr("oldvalue",arr[0].chipModel);
		$("#lable5Emmc").attr("oldvalue",arr[0].EMMC);
		$("#lable5Memory").attr("oldvalue",arr[0].memorySize);
		$("#lable5GitBranch").attr("oldvalue",arr[0].gitBranch);
		$("#lable5Platform").attr("oldvalue",arr[0].platform);
		
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
	for (var j=0; j<$(".mkradio").length; j++) {
		document.getElementsByClassName("mkradio")[j].removeAttribute('checked');
	}
	for (var i=0; i<arr.length; i++) {
		document.getElementById(arr[i].engName).setAttribute('checked', '');
		document.getElementById(arr[i].engName).checked = true;
	}
}
function SysDataInsert2(type, arr){
	for (var i=0; i<arr.length; i++) {
		document.getElementById(arr[i].engName).setAttribute('checked', '');
		document.getElementById(arr[i].engName).checked = true;
	}
	if (type == 2) {
		for (var i=0; i<$(".sysitems").length; i++) {
			$(".sysitems:eq("+i+")").attr("onchange","changeSettings(this)");
		}
	}
}

function PropDataInsert2(type, arr){
	for (var i=0; i<arr.length; i++) {
		document.getElementById(arr[i].engName).value = arr[i].curValue;
	}
	if (type == 2) {
		for (var i=0; i<$(".propitem").length; i++) {
			$(".propitem:eq("+i+")").attr("onchange","changeProps(this)");
			$(".propitem:eq("+i+")").attr("oldvalue",$(".propitem:eq("+i+")").attr("value"));
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
    $("#mydialog").css("display","block");
    $("#changetitle3").css("display","none");
    $("#changeReason3").css("display","none");
    $("#errorChangeInfo2").css("display","none");
    document.getElementById("myDeleteModalLabel").innerHTML = "审核操作";
    document.getElementById("dialogword").innerHTML = "确认通过审核吗？";
}

//编辑提交弹窗
function editIssue(){
    console.log("changeDev"+changeDev);
    console.log("changeAdd"+changeAdd);
    console.log("changeReduce"+changeReduce);
    console.log("changeConf"+changeConf);
    console.log("changeProp"+changeProp);
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
		console.log(isTrueData0);
		var index0 = autoDataArray1.indexOf(isTrueData0);
		console.log(index0);
		if (index0 == "-1") {
			var _curInput = $("#page5Modal1Table .fuzzySearch")[3].getAttribute("name");
			document.getElementById("page5Modal1ErrorInfo").style.display = "block";
			document.getElementById("page5Modal1ErrorInfo").innerHTML = _curInput + "项的值不存在";
			setTimeout("document.getElementById('page5Modal1ErrorInfo').style.display = 'none';", 3000);
		} else{
			//弹出确认框
			console.log(changeAdd);
			console.log(changeReduce);
			console.log(changeConf);
			console.log(changeDev);
			console.log(changeProp);
			if (changeAdd.length+changeReduce.length+changeConf.length+changeDev.length+changeProp.length == 0) {
				console.log("未做任何修改");
				document.getElementById("page2Modal1ErrorInfo").innerHTML = "您未做任何修改。";
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
			    if (changeProp.length != 0) {
			        $("#txt5").css("display", "block");
			        $("#txt55").val(changeProp);
			        document.getElementById("txt55").innerHTML = changeProp;
			    }
			}
		}
	}
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
            	document.getElementById("myPreviewBodyFour").innerHTML = data.resultData.text4;
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
	var _android = $("#page5Modal1Table .inputstyle")[3].value;
	var _soc = $("#page5Modal1Table .inputstyle")[4].value;
	var _emmc = $("#page5Modal1Table .inputstyle")[5].value;
	var _memory = $("#page5Modal1Table .inputstyle")[6].value;
	var _branch = $("#page5Modal1Table .inputstyle")[7].value;
	var _platform = $("#page5Modal1Table .inputstyle")[8].value;
	//auditState(0审核通过\1待审核\2审核未通过)、modifyState(0正常\1修改\2增加\3删除)
	var baseObj = {
		"chip" : _chip,
		"model" : _model,
		"targetProduct" : _tp,
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
function getPropValue(){
	var propData = [];
	console.log($(".propitem").length);
	for (var i=0; i<$(".propitem").length; i++) {
		var oApropInfo = {
			"engName": "",
			"curValue": ""
		};
		oApropInfo.engName = $(".propitem")[i].getAttribute("id");
		oApropInfo.curValue = $(".propitem")[i].value;
		propData.push(oApropInfo);
	}
	return propData;
}
function getSysValue(){
	var sysData = [];
	for (var i=0; i<$(".sysitems").length; i++) {
		var curId = $(".sysitems")[i].id;
		if (document.getElementById(curId).checked) {
			var oAsysInfo = {
				"engName": "",
			};
			oAsysInfo.engName = $(".sysitems")[i].getAttribute("engname");
			sysData.push(oAsysInfo);
		}
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
function changeProps(obj){
	var x = obj.value;
    console.log(x);
    console.log(obj.getAttribute("oldvalue"));
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
        changeProp.remove(obj.getAttribute("id"));
        console.log("changeProp= "+changeProp);
    }
    else{
        if (changeProp.indexOf(obj.getAttribute("id")) == -1){
            changeProp.push(obj.getAttribute("id"));
            console.log("changeProp= "+changeProp);
        }
    }
}
function changeSettings(obj){
	console.log(obj.checked+"--"+obj.getAttribute("oldvalue"));
    if (obj.checked && (obj.getAttribute("oldvalue") == '0')) {
        obj.setAttribute("oldvalue","1");
        changeAdd.push(obj.getAttribute("cnname"));
    }else if(!(obj.checked) && (obj.getAttribute("oldvalue") == '0')){
        obj.setAttribute("oldvalue","2");
        changeReduce.push(obj.getAttribute("cnname"));
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
    }
    console.log("add"+changeAdd);
    console.log("changeReduce"+changeReduce);
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

function productHistoryAdd(){
	if(this.readyState == 4) {
		if(this.status == 200) {
			var data = JSON.parse(this.responseText);
			console.log(data);
			if(data.resultCode == "0") {
				console.log("日志数据提交成功");
				console.log(level+"---"+loginusername+"--"+_author);
			    if (level == 1&&_author != loginusername) {
			    	sendEmail();
			    }else{
			    	page5fresh(1);
			    }
			}
		}
		page5fresh(1);
	}
}
function productHistoryQuery(){
	if(this.readyState == 4) {
		if(this.status == 200) {
			var data = JSON.parse(this.responseText);
			console.log(data);
			if(data.resultCode == "0") {
				console.log("数据查询成功");
				if (data.resultData.length == 0) {
					$("#contenttable").css("display","none");
					$("#noChangeHistory").css("display","block");
					$("#noChangeHistory").html("该产品没有修改历史。");
				} else{
					$("#contenttable").css("display","inline-table");
					$("#noChangeHistory").html(" ");
					$("#noChangeHistory").css("display","none");
					//for (var i<(data.resultData.length-1); i>=0; i--) {
					for (var i=(data.resultData.length-1); i>=0; i--) {
						var _state = "";
						if (data.resultData[i].state == 0) {
							_state = "审核通过";
						} else if(data.resultData[i].state == 1){
							_state = "待审核";
						} else if(data.resultData[i].state == 2){
							_state = "审核不通过";
						}
						var _desc = "";
						var _content = data.resultData[i].content;
						console.log(isJSON_test(_content));
						if (isJSON_test(_content)) {
							_content = JSON.parse(_content);
							_content.deleteObj = "";
						}else{
							_content= {
								changeDev : "",
								changeAdd : "",
								changeReduce: "",
								changeConf : "",
								changeProp : "",
								deleteObj : data.resultData[i].content
							};
						}
						console.log(_content);
						var _devArray,_addArray,_deleteArray,_confArray,_propsArray = "";
						
						var _devArray = _content.changeDev;//.splice(",")
						var _addArray = _content.changeAdd;//.splice(",")
						var _deleteArray = _content.changeReduce;//.splice(",")
						var _confArray = _content.changeConf;//.splice(",")
						var _propsArray = _content.changeProp;//.splice(",")
						var _deleteArray2 = _content.deleteObj;
						if (_devArray.length != 0) {
							_desc += "<span>修改了基本项："+_devArray+"</span><br/>";
						}if (_addArray.length != 0) {
							_desc += "<span>新增了设置项："+_addArray+"</span><br/>";
						}if (_deleteArray.length != 0) {
							_desc += "<span>删除了设置项："+_deleteArray+"</span><br/>";
						}if (_confArray.length != 0) {
							_desc += "<span>修改了Config项："+_confArray+"</span><br/>";
						}if (_propsArray.length != 0) {
							_desc += "<span>修改了Config项："+_propsArray+"</span><br/>";
						}
						if (_deleteArray2.length != 0){
							_desc += "<span>"+_deleteArray2+"</span><br/>";
						}
						var _row = document.getElementById("descriptTbody").insertRow(0);
						var _cell0 = _row.insertCell(0);
						_cell0.innerHTML = _desc;
						_cell0.style.textAlign = "left";
						var _cell1 = _row.insertCell(1);
						_cell1.innerHTML = data.resultData[i].reason;
						var _cell2 = _row.insertCell(2);
						_cell2.style.textAlign = "center";
						_cell2.innerHTML = data.resultData[i].modifyTime;
						var _cell3 = _row.insertCell(3);
						_cell3.style.textAlign = "center";
						_cell3.innerHTML = data.resultData[i].userName;
						var _cell4 = _row.insertCell(4);
						_cell4.style.textAlign = "center";
						_cell4.innerHTML = _state;
					}
				}
			}
		}
	}
}

function resetAllInfo(){
	colorstatus(0);//焦点落在第一个tabs上
	
	document.getElementById("lable5Chip").value = "";
	document.getElementById("lable5Model").value = "";
	document.getElementById("lable5TP").value = "";
	document.getElementById("lable5AndroidVersion").value = "";
	document.getElementById("lable5ChipMode").value = "";
	document.getElementById("lable5Emmc").value = "";
	document.getElementById("lable5Memory").value = "";
	document.getElementById("lable5GitBranch").value = "";
	document.getElementById("lable5Platform").value = "";
	
	for (var i=0; i<$(".configitems").length; i++) {
		if ($(".configitems")[i].getAttribute("typestr") == "enum") {
			$(".configitems")[i].value = $(".configitems")[i].getAttribute("defaultvalue");
		} else{
			$(".configitems")[i].value = $(".configitems")[i].getAttribute("defaultvalue");
		}
	}
	for (var j=0; j<$(".sysitems").length; j++) {
		$(".sysitems")[j].checked = false;
	}
	for (var k=0; k<$(".mkitems").length; k++) {
		if ($(".mkitems")[k].getAttribute("type") == "checkbox") {
			document.getElementsByClassName("mkitems")[k].setAttribute('checked', '');
			document.getElementsByClassName("mkitems")[k].checked = false;
		} else if($(".mkitems")[k].getAttribute("type") == "radio"){
			document.getElementsByClassName("mkitems")[k].setAttribute('checked', '');
			document.getElementsByClassName("mkitems")[k].checked = false;
		}
	}
	document.getElementsByClassName("mkradio")[0].setAttribute('checked', '');
	document.getElementsByClassName("mkradio")[0].checked = true;
}


function isJSON_test(str) {
    if (typeof str == 'string') {
        try {
            var obj=JSON.parse(str);
            console.log('转换成功：'+obj);
            return true;
        } catch(e) {
            console.log('error：'+str+'!!!'+e);
            return false;
        }
    }
    console.log('It is not a string!')
}

function getCommitterEmail(author){
	console.log("in getCommitterEmail");
	var node = '{"userName":"' + author + '"}';
	sendHTTPRequest("/getUserInfo", node, getEmailResult);
}
function getEmailResult(){
	if(this.readyState == 4) {
        if(this.status == 200) {
            var data = JSON.parse(this.responseText);
            console.log(data);
            if(data.resultCode == 0) {
            	console.log(data.resultData[0].email);
//          	toEmail = "linxinwang@skyworth.com";//测试用
            	toEmail = data.resultData[0].email;
            }
        };
	}
}

function instantQuery(arr1) {
	console.log(arr1);
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
	
	/* 点击空白出隐藏临时div */
	_$(document).onclick = function(e) {
		var e = e || window.event; //浏览器兼容性 
		var elem = e.target || e.srcElement;
		var _style = document.getElementById("page5_soc_auto2").getAttribute("class");
		if(_style == "auto_show") {
			document.getElementById("page5_soc_auto2").setAttribute("class", "auto_hidden")
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
function page5fresh(num) {
    var htmlObject = parent.document.getElementById("tab_userMenu5");
    htmlObject.firstChild.src = "page5.html";
    var htmlObject2 = parent.document.getElementById("tab_userMenu4");
    var htmlObject3 = parent.document.getElementById("tab_userMenu2");
    var htmlObject4 = parent.document.getElementById("tab_userMenu1");
    
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