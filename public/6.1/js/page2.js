document.write("<script language=javascript src='../js/sentHTTP.js' charset=\"utf-8\"></script>");

var autoComplete1,autoComplete2,autoComplete3,autoComplete4,autoComplete5 = "";
var autoComplete12,autoComplete22,autoComplete32,autoComplete42,autoComplete52 = "";
var closePageName = "";
var autoDataArray1 = new Array();
var autoDataArray2 = new Array();
var autoDataArray3 = new Array();
var autoDataArray4 = new Array();

var _twoLevelLinkageArrayOne = [[],[],[],[]];
var _twoLevelLinkageArrayTwo = [[],[],[],[]];
var _twoLevelLinkageArrayThree = [[],[],[],[]];

var _myArray = [];//保存查询到的产品的信息

var changeAdd = [];//保存新增模块信息
var changeReduce = [];//保存删除模块信息
var changeConf = [];//保存修改配置信息
var changeDev = [];//保存修改设备信息
var changeProp = [];//保存修改属性信息
var olrplayerid = null;

var deleteChip = null;
var deleteModel = null;
var deletePanel = null;

var fromEmail = null;
var toEmail = "SKY058689@skyworth.com";
var level = null;
var loginusername = null;

var coocaaVersion = "/v6.1";

$(function() {
	fromEmail = parent.loginEmail;
	loginusername = parent.loginusername;
	level = parent.loginlevel;
	console.log(fromEmail+"--"+loginusername+"--"+level);
	var node = '{"offset":"-1","rows":"10"}';
	sendHTTPRequest(coocaaVersion+"/product/queryByPage", node, productQuery);
	buttonInit();
});

function productQuery() {
	if(this.readyState == 4) {
		if(this.status == 200) {
			var data = JSON.parse(this.responseText);
			console.log(data);
			//auditState(0审核通过\1待审核\2审核未通过)、modifyState(0正常\1修改\2增加\3删除)
			if(data.resultCode == "0") {
				var arr = new Array();
				parent.document.getElementsByClassName("email")[0].style.display = "none";
				parent.document.getElementsByClassName("email")[1].style.display = "none";
				parent.document.getElementsByClassName("email")[2].style.display = "none";
				for (var i=0; i<data.resultData.length; i++) {
					if (data.resultData[i].auditState == 0) {
						arr.push(data.resultData[i]);
					}
				}
				_myArray = arr;
				handleTableData(arr);
			}
		}
		sendHTTPRequest(coocaaVersion+"/device/queryAll", '{}' , targetproductQueryResult);
	}
}

function targetproductQueryResult() {
	if(this.readyState == 4) {
		if(this.status == 200) {
			var data = JSON.parse(this.responseText);
			console.log(data);
			if(data.resultCode == "0") {
				for(var i = 0; i < data.resultData[0].length; i++) {
					autoDataArray1.push(data.resultData[0][i].name);
				}
				for(var i = 0; i < data.resultData[1].length; i++) {
					autoDataArray2.push(data.resultData[1][i].name);
				}
				for(var i = 0; i < data.resultData[2].length; i++) {
					autoDataArray3.push(data.resultData[2][i].name);
				}
				for(var i = 0; i < data.resultData[3].length; i++) {
					autoDataArray4.push(data.resultData[3][i].name);
				}
				instantQuery(autoDataArray1, autoDataArray2, autoDataArray3, autoDataArray4);
			}
		}
		clearAllInfo();
		sendHTTPRequest(coocaaVersion+"/product/queryAll", '{}', allQueryResult);
	}
}

function handleTableData(arr) {
	var getdataArray2 = new Array();
	for(var i = 0; i < arr.length; i++) {
		if (arr[i].panel == 0) {
			var _panel = "默认";
		}else{
			var _panel = arr[i].panel;
		}
		var eachItem2 = {
			"number" : (i+1),
			"model": arr[i].model,
			"chip": arr[i].chip,
			"size": _panel,
			"target_product": arr[i].targetProduct,
			"AndroidVersion": arr[i].androidVersion,
			"chipmodel": arr[i].soc,
			"EMMC": arr[i].EMMC,
			"memory": arr[i].memorySize,
			"gitbranch": arr[i].gitBranch,
			"history": "<button class='eachcheck btn-success' href='#'>查看</button>",
			"operate": "<a class='eachedit' href='#'><span class='glyphicon glyphicon-pencil' title='修改'></span></a><a class='eachdelete' href='#'><span class='glyphicon glyphicon-remove' title='删除'></span></a><a class='eachcopy' href='#'><span class='glyphicon glyphicon-copy' title='复制'></span></a><a class='eachpreview' href='#'><span class='glyphicon glyphicon glyphicon-eye-open' title='预览'></span></a><a class='eachsize' href='#'><span class='glyphicon glyphicon glyphicon-plus' title='增加尺寸'></span></a>"
		};
		getdataArray2.push(eachItem2);
	}
	console.log(getdataArray2);
	pageTableInit(getdataArray2);
}

function pageTableInit(data1) {
	//前台分页的样子
	$('#page2_table').CJJTable({
		'title': ["序号", "机型", "机芯", "尺寸", "TP", "安卓版本", "芯片型号", "EMMC", "内存", "git分支", "修改历史", "操作"], //thead中的标题 必填
		'body': ["number", "model", "chip", "size", "target_product", "AndroidVersion", "chipmodel", "EMMC", "memory", "gitbranch", "history", "operate"], //tbody td 取值的字段 必填
		'display': [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1], //隐藏域，1显示，2隐藏 必填
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
		$('#page2_table').css("display", "none");
		$('#searchNoInfo').css("display", "block");
	} else if (num < 11) {
		console.log("查询结果个数小于11");
		$('#page2_table').css("display", "block");
		$('#searchNoInfo').css("display", "none");
	}else{
		console.log("查询结果个数大于11");
		$('#page2_table').css("display", "block");
		$('#searchNoInfo').css("display", "none");
	}
}

function instantQuery(arr1, arr2, arr3, arr4) {
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
	autoComplete1 = new AutoComplete('page2_chip', 'page2_chip_auto', arr1);
	autoComplete2 = new AutoComplete('page2_model', 'page2_model_auto', arr2);
	autoComplete3 = new AutoComplete('page2_targetProduct', 'page2_tp_auto', arr3);
	autoComplete4 = new AutoComplete('page2_chipid', 'page2_soc_auto', arr4);
	
	autoComplete12 = new AutoComplete('lable2Chip', 'page2_chip_auto2', arr1);
	autoComplete22 = new AutoComplete('lable2Model', 'page2_model_auto2', arr2);
	autoComplete32 = new AutoComplete('lable2TargetProduct', 'page2_tp_auto2', arr3);
	autoComplete42 = new AutoComplete('lable2ChipMode', 'page2_soc_auto2', arr4);
	/* 点击空白出隐藏临时div */
	_$(document).onclick = function(e) {
		var e = e || window.event; //浏览器兼容性 
		var elem = e.target || e.srcElement;
		var showArray = ["page2_chip_auto","page2_model_auto","page2_tp_auto","page2_soc_auto","page2_chip_auto2","page2_model_auto2","page2_tp_auto2","page2_soc_auto2"];
		var showBox = ["page2_chip","page2_model","page2_targetProduct","page2_chipid","lable2Chip","lable2Model","lable2TargetProduct","lable2ChipMode"];
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

function changeMKByTP(id, value) {
	console.log(id + "-----" + value);
	var node = '{"targetproduct":"' + value + '"}';
	sendHTTPRequest(coocaaVersion+"/product/queryMKByTp", node, getMKByTPResult);
}

function getMKByTPResult() {
	if(this.readyState == 4) {
		if(this.status == 200) {
			var data = JSON.parse(this.responseText);
			console.log(data);
			if(data.resultCode == "0") {
				clearMKLastWork();
				
				for (var i=0; i<data.resultData[0].length; i++) {
					document.getElementById(data.resultData[0][i].engName).setAttribute('checked', '');
					document.getElementById(data.resultData[0][i].engName).checked = true;
				}
				for (var i=0; i<data.resultData[1].length; i++) {
					document.getElementById(data.resultData[1][i].engName).value = data.resultData[1][i].curValue;
				}
			}
		}
	}
}
function clearMKLastWork(){
	for (var i=0; i<$(".mkitems").length; i++) {
		document.getElementsByClassName("mkitems")[i].checked = false;
	}
}

function buttonInit() {
	document.getElementById("page2_searchInfo").onclick = page2Select;
	document.getElementById("page2_reset").onclick = page2Reset;
	document.getElementById("page2_export").onclick = page2Export;
	document.getElementById("page2_fresh").onclick = page2Fresh;
	document.getElementById("myEditEnsureModalEnsure").onclick = closeparentpage;
	
	$("#myEnsureCancle").click(function() {
		document.getElementById("myAddCloseDiv").style.display = "none";
	});
	$("#myEnsureX").click(function() {
		document.getElementById("myAddCloseDiv").style.display = "none";
	});
	$("#page2_add").click(function() {
		resetAllInfo(1);//删除前面的操作痕迹
		$("#page2Modal1").modal();
		$(".modal-backdrop").addClass("new-backdrop");
		$(".page2_boxes")[0].style.display = "block";
		$("#page2Modal1Label").html("新增");
	});
	$("#myDeleteModalEnsure").click(function(){
		console.log("点击了确认框的确认按钮");
		var _chip = $("#myDeleteModalEnsure").attr("chip");
		var	_model = $("#myDeleteModalEnsure").attr("model");
		var _panel = $("#myDeleteModalEnsure").attr("panel");
		var content = document.getElementById("changeReason2").value;
		content = content.replace(/\s*/g,"");
		console.log(content +"---"+content.length);
		if(content == null || content.length == 0){
			document.getElementById("errorChangeInfo2").style.display = "inline-block";
			setTimeout("document.getElementById('errorChangeInfo2').style.display = 'none';", 3000);
		} else{
			var deleteObj = {
				"chip" : _chip,
				"model" : _model,
				"panel" : parseInt(_panel),
				"userName" : loginusername,
			}
			var _delete = JSON.stringify(deleteObj);
			var node = '{"data":' + _delete + '}';
			console.log(node);
			sendHTTPRequest(coocaaVersion+"/product/delete", node, productAddResult);
		}
	});
	
	$("#page2_chip").keyup(function(event) {
		autoComplete1.start(event);
	});
	$("#page2_model").keyup(function(event) {
		autoComplete2.start(event);
	});
	$("#page2_targetProduct").keyup(function(event) {
		autoComplete3.start(event);
	});
	$("#page2_chipid").keyup(function(event) {
		autoComplete4.start(event);
	});
	$("#lable2Chip").keyup(function(event) {
		autoComplete12.start(event);
	});
	$("#lable2Model").keyup(function(event) {
		autoComplete22.start(event);
	});
	$("#lable2TargetProduct").keyup(function(event) {
		autoComplete32.start(event);
	});
	$("#lable2ChipMode").keyup(function(event) {
		autoComplete42.start(event);
	});
	
	
	$(".page2_tabs").click(function() {
		var _curIndex = $(".page2_tabs").index($(this));
		colorstatus(_curIndex);
	});
	
	$("#page2Modal1Submit").click(function() {
		getAndCheckAndSendAllData();
	});
	$("#lable1SubmitTwo").click(function() {
		scrollTopStyle("page2Modal1");
		getAndCheckAndSendAllData();
	});
	$("#page2Modal1Close").click(function() {
		console.log("单项编辑页-关闭按钮");
		$("#myAddCloseDiv").modal('show');
		$(".modal-backdrop").addClass("new-backdrop");
		document.getElementById("myAddCloseDiv").style.display = "block";
		document.getElementById("infoEdit").innerHTML = "确认要关闭吗？";
	});
	
	$("#myEditEnsureX").click(function() {
		console.log("修改提示框的X按钮");
		document.getElementById("myEditEnsureDiv").style.display = "none";
	});
	$("#myEditCancle").click(function() {
		console.log("修改提示框的取消按钮");
		document.getElementById("myEditEnsureDiv").style.display = "none";
	});
	$("#myEditEnsure").click(function() {
		console.log("修改配置项或者新增尺寸项的提交");
		var content = document.getElementById("changeReason").value;
		content = content.replace(/\s*/g,"");
		console.log(content +"---"+content.length);
		if(content == null || content.length == 0){
			document.getElementById("errorChangeInfo").style.display = "inline-block";
			setTimeout("document.getElementById('errorChangeInfo').style.display = 'none';", 3000);
		} else{
			var type = $("#lable1SubmitTwo").attr("catagory");
			console.log(type);
			if(type == 6){
				myEditorAddSubmit(2);
			}else{
				myEditorAddSubmit(1);
			}
		}
	});
	$("#myAddEnsure").click(function() {
		console.log("新增配置项的提交");
		myEditorAddSubmit(2);
	});
	
	$("#myAddCancle").click(function(){
		$("#myAddEnsureDiv").css("display","none");
	});
	$("#myAddEnsureX").click(function(){
		$("#myAddEnsureDiv").css("display","none");
	});
}

function colorstatus(number){
	for(var k = 0; k < $(".page2_tabs").length; k++) {
		$(".page2_boxes")[k].style.display = "none";
		$(".page2_tabs")[k].style.backgroundColor = "#337ab7";
		$(".page2_tabs")[k].style.backgroundColor = "#2e6da4";
	}
	$(".page2_boxes")[number].style.display = "block";
	$(".page2_tabs")[number].style.backgroundColor = "#5cb85c";
	$(".page2_tabs")[number].style.backgroundColor = "#4cae4c";
}

function isExistOption(id,value) {  
    var isExist = false;  
    var count = $('#'+id).find('option').length;  
  	for(var i=0;i<count;i++){     
     	if($('#'+id).get(0).options[i].value == value)     {     
            isExist = true;     
   	        break;     
        }     
    }     
    return isExist;  
}
function changeSleect(value){
	console.log(value);
	
}

function buttonInitAfter() {
	$(".eachcheck").click(function() {
		var _cIndex = $(".eachcheck").index($(this));
		console.log("点击的是第" + _cIndex + "个 eachcheck class");
		var _chip = $(".new_productBox .chip")[_cIndex].innerHTML;
		var _model = $(".new_productBox .model")[_cIndex].innerHTML;
		var _panel = $(".new_productBox .size")[_cIndex].innerHTML;
		
		$("#page1_check_chip").html(_chip);
		$("#page1_check_model").html(_model);
		$("#page1_check_panel").html(_panel);
		$('#page1_examine').modal();
		
		var searchObj = {
			"chip" : _chip,
			"model" : _model,
			"panel" : parseInt(_panel)
		}
		var _search = JSON.stringify(searchObj);
		var node = '{"data":' + _search + '}';
		console.log(node);
		sendHTTPRequest(coocaaVersion+"/product/queryHistory", node, productHistoryQuery);
	});
	$(".eachedit").click(function() {
		var _aIndex = $(".eachedit").index($(this));
		resetAllInfo(2);//删除前面的操作痕迹
		$("#page2Modal1").modal();
		$(".modal-backdrop").addClass("new-backdrop");
		$("#page2Modal1Label").html("编辑");
		page2AEC(_aIndex);
	});
	$(".eachdelete").click(function() {
		var _aIndex = $(".eachdelete").index($(this));
		//1-新增、2-修改、3-复制、4-预览、5-删除
		$("#lable1SubmitTwo").attr("catagory","5");
		deleteChip = $(".chip")[_aIndex].innerText;
		deleteModel = $(".model")[_aIndex].innerText;
		deletePanel = $(".size")[_aIndex].innerText;
		$("#myDeleteModalEnsure").attr("chip",deleteChip);
		$("#myDeleteModalEnsure").attr("model",deleteModel);
		$("#myDeleteModalEnsure").attr("panel",deletePanel);
		$("#myDeleteModalLabel").text("单项删除");
		$('#myDeleteModal').modal();
		$(".modal-backdrop").addClass("new-backdrop");
		$("#deleteInfo").html("确定要删除"+deleteChip+"-"+deleteModel+"-"+deletePanel+"的配置表吗？");
	});
	/*单项复制*/
	$(".eachcopy").click(function() {
		var _aIndex = $(".eachcopy").index($(this));
		resetAllInfo(3);//删除前面的操作痕迹
		page2AEC(_aIndex);
		$("#page2Modal1").modal();
		$(".modal-backdrop").addClass("new-backdrop");
		$("#page2Modal1Label").html("复制");
	});
	/*单项预览*/
	$(".eachpreview").click(function() {
		var _aIndex = $(".eachpreview").index($(this));
		resetAllInfo(4);//删除前面的操作痕迹
		page2AEC(_aIndex);
		$("#page2Modal1Label").html("预览");
	});
	
	/*单项增加尺寸*/
	$(".eachsize").click(function() {
		var _aIndex = $(".eachsize").index($(this));
		resetAllInfo(6);//删除前面的操作痕迹
		page2AEC(_aIndex);
		$("#page2Modal1").modal();
		$(".modal-backdrop").addClass("new-backdrop");
		$("#page2Modal1Label").html("增加尺寸");
	});
	
	$("#page1_close1").click(function() {
		document.getElementById("contenttable").innerHTML = "";
		$("#page1_examine").modal('hide');
	});
	$("#page1_close2").click(function() {
		$("#page1_examine").modal('hide');
	});
}

//查询功能
function page2Select() {
	var oChip = document.getElementById('page2_chip').value;
	var oModel = document.getElementById('page2_model').value;
	var oTargetProduct = document.getElementById('page2_targetProduct').value;
	var oAndroid = document.getElementById('page2_androidVersion').value;
	var oChipid = document.getElementById('page2_chipid').value;
	var oEmmc = document.getElementById('page2_EMMC').value;
	var oMemory = document.getElementById('page2_memory').value;
	var oKeyWord = document.getElementById('page2_keyword').value;
	var oGitBranch = document.getElementById('page2_gitbranch').value;

	if(oKeyWord == null || oKeyWord == "") {
		var searchObj = {
			"chip" : oChip,
			"model" : oModel,
			"targetProduct" : oTargetProduct,
			"memory" : oMemory,
			"version" : oAndroid,
			"soc" : oChipid,
			"EMMC" : oEmmc,
			"gitBranch" : oGitBranch,
		}
		var _search = JSON.stringify(searchObj);
		var node = '{"data":' + _search + '}';
		console.log(node);
		sendHTTPRequest(coocaaVersion+"/product/queryByRegEx", node, searchResource);
	} else {
		var node = '{"name":"' + oKeyWord + '"}';
		console.log(node);
		sendHTTPRequest(coocaaVersion+"/product/queryByModule", node, searchResource);
	}
}

function searchResource() {
	if(this.readyState == 4) {
		if(this.status == 200) {
			var data = JSON.parse(this.responseText);
			console.log(data);
			if(data.resultCode == "0") {
				$("#page2_table").innerHTML = "";
				var arr = new Array();
				for (var i=0; i<data.resultData.length; i++) {
					if (data.resultData[i].auditState == 0) {
						arr.push(data.resultData[i]);
					}
				}
				handleTableData(arr);
			}
		}
	}
}

//重置功能
function page2Reset() {
	document.getElementById("page2_chip").value = "";
	document.getElementById("page2_model").value = "";
	document.getElementById("page2_targetProduct").value = "";
	document.getElementById("page2_androidVersion").value = "";
	document.getElementById("page2_chipid").value = "";
	document.getElementById("page2_EMMC").value = "";
	document.getElementById("page2_memory").value = "";
	document.getElementById("page2_keyword").value = "";
	document.getElementById("page2_gitbranch").value = "";
	page2Select(); //重置时是否需要重新查询，这个需要分析
}
//新增、编辑、复制、预览、增加尺寸 功能
function page2AEC(number) {
	var _type = $("#lable1SubmitTwo").attr("catagory");//1-新增、2-编辑、3-复制、4-预览、5-删除、6-增加尺寸
	var _chip = $(".chip")[number].innerText;
	var	_model = $(".model")[number].innerText;
	var	_panel = $(".size")[number].innerText;
	if(_panel == "默认"){
		_panel = 0;
	}
	console.log(_type);
	if (_type == 2||_type == 3||_type == 6) {
		console.log("点击了编辑或者复制或者增加尺寸" + number);
		var editObj = {
			"chip" : _chip,
			"model" : _model,
			"panel" : parseInt(_panel)
		}
		var _edit = JSON.stringify(editObj);
		var node = '{"data":' + _edit + '}';
		console.log(node);
		sendHTTPRequest(coocaaVersion+"/product/queryAllByMachine", node, getPointProductInfo);
	} else if(_type == 4) {
		console.log("点击了预览" + number);
		var reviewObj = {
			"chip" : _chip,
			"model" : _model,
			"panel" : parseInt(_panel),
			"flag" : 0,
		}
		var _review = JSON.stringify(reviewObj);
		var node = '{"data":' + _review + '}';
		console.log(node);
		sendHTTPRequest(coocaaVersion+"/product/preview", node, getPreviewInfo);
	}
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
		var searchObj = {
			"userName" : loginusername,
			"level" : level
		}
		var _search = JSON.stringify(searchObj);
		var node = '{"data":' + _search + '}';
		console.log(node);
		sendHTTPRequest(coocaaVersion+"/product/queryAuditByUser", node, productTempQuery);
	}
}
function productTempQuery() {
	if(this.readyState == 4) {
		if(this.status == 200) {
			var data = JSON.parse(this.responseText);
			console.log(data);
			//auditState(0审核通过\1待审核\2审核未通过)、modifyState(0正常\1修改\2增加\3删除)
			if(data.resultCode == "0") {
				if(data.resultData[0].length > 0){
					parent.document.getElementsByClassName("email")[0].style.display = "block";
					parent.document.getElementsByClassName("email")[1].style.display = "inline-block";
				}
				if(data.resultData[1].length > 0){
					parent.document.getElementsByClassName("email")[0].style.display = "block";
					parent.document.getElementsByClassName("email")[2].style.display = "inline-block";
				}
			}
		}
	}
}

//点击新增时清空所有数据
function clearAllInfo() {
	document.getElementById("lable2Chip").value = "";
	document.getElementById("lable2Model").value = "";
	document.getElementById("lable2TargetProduct").value = "";
	document.getElementById("lable2AndroidVersion").value = "";
	document.getElementById("lable2ChipMode").value = "";
	document.getElementById("lable2Emmc").value = "";
	document.getElementById("lable2Memory").value = "";
	document.getElementById("lable2GitBranch").value = "";
	document.getElementById("lable2Platform").value = "";
	
	document.getElementById("myConfigBox").innerHTML = "";
	document.getElementById("mySysSettingBox").innerHTML = "";
	document.getElementById("mySourceBoxBox").innerHTML = "";
	document.getElementById("myMarketShowBox").innerHTML = "";
	document.getElementById("myMiddlewareBox").innerHTML = "";
	document.getElementById("myMkBox").innerHTML = "";
	document.getElementById("myPropBox").innerHTML = "";
}

function resetAllInfo(num){
	colorstatus(0);//焦点落在第一个tabs上
	//1-新增、2-修改、3-复制、4-预览、5-删除、6-增加尺寸
	$("#lable1SubmitTwo").attr("catagory",num);
	document.getElementById("lable2Chip").value = "";
	document.getElementById("lable2Model").value = "";
	document.getElementById("lable2TargetProduct").value = "";
	document.getElementById("lable2AndroidVersion").value = "";
	document.getElementById("lable2ChipMode").value = "";
	document.getElementById("lable2Emmc").value = "";
	document.getElementById("lable2Memory").value = "";
	document.getElementById("lable2GitBranch").value = "";
	document.getElementById("lable2Platform").value = "";
	document.getElementById("lable2Chip").style.color = "black";
	document.getElementById("lable2Model").removeAttribute('disabled');
	document.getElementById("lable2Model").style.color = "black";
	document.getElementById("lable2TargetProduct").removeAttribute('disabled');
	document.getElementById("lable2TargetProduct").style.color = "black";
	
	for (var i=0; i<$(".configitems").length; i++) {
		if ($(".configitems")[i].getAttribute("typestr") == "enum") {
			$(".configitems")[i].value = $(".configitems")[i].getAttribute("defaultvalue");
		} else{
			$(".configitems")[i].value = $(".configitems")[i].getAttribute("defaultvalue");
		}
	}
	for (var i=0; i<$(".propitem").length; i++) {
		$(".propitem")[i].value = $(".propitem")[i].getAttribute("defaultvalue");
	}
	for (var j=0; j<$(".sysitems").length; j++) {
		if(num==1&&$(".sysitems")[j].getAttribute("defaultSelected")==1){
			$(".sysitems")[j].checked = true;
		}else{
			$(".sysitems")[j].checked = false;
		}
	}
	for (var k=0; k<$(".mkitems").length; k++) {
		if ($(".mkitems")[k].getAttribute("type") == "checkbox") {
			document.getElementsByClassName("mkitems")[k].setAttribute('checked', '');
			document.getElementsByClassName("mkitems")[k].checked = false;
		} else if($(".mkitems")[k].getAttribute("type") == "radio"){
			document.getElementsByClassName("mkitems")[k].setAttribute('checked', '');
			document.getElementsByClassName("mkitems")[k].checked = false;
			document.getElementsByClassName("mkradio")[0].setAttribute('checked', '');
			document.getElementsByClassName("mkradio")[0].checked = true;
		}
	}
	//1-新增、2-修改、3-复制、4-预览、5-删除、6-增加尺寸
	if(num==6){
		$("#addSize").css("display","table-row");
	}else{
		$("#addSize").css("display","none");
	}
}

//点击复制或者编辑或者增加尺寸
function getPointProductInfo(){
	if(this.readyState == 4) {
        if(this.status == 200) {
            var data = JSON.parse(this.responseText);
            console.log(data);
            if(data.resultCode == 0){
            	console.log("数据返回成功");
            	var _type = $("#lable1SubmitTwo").attr("catagory");//2-编辑、3-复制、6-增加尺寸
            	CommonDataInsert2(_type,data.resultData[0]);
            	ConfigDataInsert2(_type,data.resultData[1]);
            	SysDataInsert2(_type,data.resultData[2]);
            	PropDataInsert2(_type,data.resultData[3]);
            	MKDataInsert2(_type,data.resultData[4]);
            }
        };
    }
}

function CommonDataInsert2(type,arr){
	console.log(arr);
	$("#lable2AndroidVersion").val(arr[0].androidVersion);
	$("#lable2ChipMode").val(arr[0].soc);
	$("#lable2Emmc").val(arr[0].EMMC);
	$("#lable2Memory").val(arr[0].memorySize);
	$("#lable2GitBranch").val(arr[0].gitBranch);
	$("#lable2Platform").val(arr[0].platform);
	$("#lable2TargetProduct").val(arr[0].targetProduct);
	
	//2-编辑、3-复制、6-增加尺寸
	if (type == 2||type == 6) {
		$("#lable2Chip").val(arr[0].chip);
		$("#lable2Chip").css("color","red");
		$("#lable2Chip").attr("disabled","disabled");
		$("#lable2Model").val(arr[0].model);
		$("#lable2Model").css("color","red");
		$("#lable2Model").attr("disabled","disabled");
		
		$("#lable2AndroidVersion").attr("oldvalue",arr[0].androidVersion);
		$("#lable2ChipMode").attr("oldvalue",arr[0].chipModel);
		$("#lable2Emmc").attr("oldvalue",arr[0].EMMC);
		$("#lable2Memory").attr("oldvalue",arr[0].memorySize);
		$("#lable2GitBranch").attr("oldvalue",arr[0].gitBranch);
		$("#lable2Platform").attr("oldvalue",arr[0].platform);
		
		$("#lable2AndroidVersion").attr("onchange","changeDevice(this)");
        $("#lable2ChipMode").attr("onchange","changeDevice(this)");
        $("#lable2Memory").attr("onchange","changeDevice(this)");
        $("#lable2Emmc").attr("onchange","changeDevice(this)");
        $("#lable2GitBranch").attr("onchange","changeDevice(this)");
        $("#lable2Platform").attr("onchange","changeDevice(this)");
	}else if(type == 3){
		$("#lable2Chip").css("color","black");
		document.getElementById("lable2Chip").removeAttribute('disabled');
		$("#lable2Model").css("color","black");
		document.getElementById("lable2Model").removeAttribute('disabled');
		$("#lable2TargetProduct").css("color","black");
		document.getElementById("lable2TargetProduct").removeAttribute('disabled');
	}
}
function ConfigDataInsert2(type, arr){
	for (var i=0; i<arr.length; i++) {
		$("#"+arr[i].engName).val(arr[i].curValue);
		$("#"+arr[i].engName).attr("value",arr[i].curValue);
	}
	if (type == 2||type == 6) {
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
	if (type == 2||type == 6) {
		for (var i=0; i<$(".sysitems").length; i++) {
			$(".sysitems:eq("+i+")").attr("onchange","changeSettings(this)");
			$(".sysitems:eq("+i+")").attr("oldvalue","0");
		}
	}
	for (var i=0; i<arr.length; i++) {
		document.getElementById(arr[i].engName).setAttribute('checked', '');
		document.getElementById(arr[i].engName).checked = true;
	}
}
function PropDataInsert2(type, arr){
	for (var i=0; i<arr.length; i++) {
		console.log(arr[i].engName+"---"+arr[i].curValue);
		document.getElementById(arr[i].engName).value = arr[i].curValue;
	}
	if (type == 2||type==6) {
		for (var i=0; i<$(".propitem").length; i++) {
			$(".propitem:eq("+i+")").attr("onchange","changeProps(this)");
			$(".propitem:eq("+i+")").attr("oldvalue",$(".propitem:eq("+i+")").attr("value"));
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
                $("#myPreviewModalLabel").text("预览");
				$('#myPreviewModal').modal();
				$(".modal-backdrop").addClass("new-backdrop");
				$("#myPreviewModal").find("li")[0].className = "presentation active";
				$("#myPreviewModal").find("li")[1].className = "presentation";
				$("#myPreviewModal").find("li")[2].className = "presentation";
				$("#myPreviewModal").find("li")[3].className = "presentation";
               	
               	document.getElementById("myPreviewBodyOne").innerHTML = data.resultData.text1;
                document.getElementById("myPreviewBodyTwo").innerHTML = data.resultData.text2;
                document.getElementById("myPreviewBodyThree").innerHTML = data.resultData.text3;
                document.getElementById("myPreviewBodyFour").innerHTML = data.resultData.text4;
            } else{
                console.log("lxw " + "预览-失败");
                document.getElementById("myPreviewBodyOne").innerHTML = "信息出错，请刷新";
                document.getElementById("myPreviewBodyTwo").innerHTML = "信息出错，请刷新";
                document.getElementById("myPreviewBodyThree").innerHTML = "信息出错，请刷新";
                document.getElementById("myPreviewBodyFour").innerHTML = "信息出错，请刷新";
            };
        };
    }
}

function getAndCheckAndSendAllData(){
	var type = $("#lable1SubmitTwo").attr("catagory");
	console.log(type);
	$("#txt0").css("display", "none");
	document.getElementById("txt00").innerHTML = "";
	//判断基本项是否为空
	var nullName = 0;
	for (var i=0; i<$("#page2Modal1Table .inputstyle").length; i++) {
		var _curValue = $("#page2Modal1Table .inputstyle")[i].value;
		var _curInput = $("#page2Modal1Table .inputstyle")[i].getAttribute("name");
		console.log(_curValue);
		if (_curValue==null||_curValue=="") {
			console.log(_curInput + "项不能为空");
			nullName = i+1;
			i = $("#page2Modal1Table .inputstyle").length;
			document.getElementById("page2Modal1ErrorInfo").style.display = "block";
			document.getElementById("page2Modal1ErrorInfo").innerHTML = _curInput + "项不能为空";
			setTimeout("document.getElementById('page2Modal1ErrorInfo').style.display = 'none';", 3000);
		}
	}
	var _style = document.getElementById("addSize").style.display;
	var _panelvalue = $("#lable2Size1").val();
	console.log(_style+"----"+_panelvalue);
	console.log(_style != "none");
	if(_style != "none"){
		if (_panelvalue==null||_panelvalue=="") {
			nullName = nullName + 1;
			document.getElementById("page2Modal1ErrorInfo").style.display = "block";
			document.getElementById("page2Modal1ErrorInfo").innerHTML = "尺寸项不能为空";
			setTimeout("document.getElementById('page2Modal1ErrorInfo').style.display = 'none';", 3000);
		}
	}
	console.log(nullName);
	if (nullName == 0) {
		console.log("没有空项");
		var _errNum = 0;
		var isTrueData0 = $("#page2Modal1Table .fuzzySearch")[0].value;
		var isTrueData1 = $("#page2Modal1Table .fuzzySearch")[1].value;
		var isTrueData2 = $("#page2Modal1Table .fuzzySearch")[2].value;
		var isTrueData3 = $("#page2Modal1Table .fuzzySearch")[3].value;
		console.log(isTrueData0+"-"+isTrueData1+"-"+isTrueData2+"-"+isTrueData3);
		var index0 = autoDataArray1.indexOf(isTrueData0);
		var index1 = autoDataArray2.indexOf(isTrueData1);
		var index2 = autoDataArray3.indexOf(isTrueData2);
		var index3 = autoDataArray4.indexOf(isTrueData3);
		console.log(index0+"-"+index1+"-"+index2+"-"+index3);
		if (index0 == "-1"||index2 == "-1"||index3 == "-1"||index3 == "-1") {
			if (index0 == "-1") {
				_errNum = 0;
			}
			if (index1 == "-1") {
				_errNum = 1;
			}
			if (index2 == "-1") {
				_errNum = 2;
			}
			if (index3 == "-1") {
				_errNum = 3;
			}
			var _curInput = $("#page2Modal1Table .fuzzySearch")[_errNum].getAttribute("name");
			document.getElementById("page2Modal1ErrorInfo").style.display = "block";
			document.getElementById("page2Modal1ErrorInfo").innerHTML = _curInput + "项的值不存在";
			setTimeout("document.getElementById('page2Modal1ErrorInfo').style.display = 'none';", 3000);
		} else{
			if (type==1||type==3||type==6) {
				if (type == 6) {
					var _panel = $("#lable2Size1").val();
				} else{
					var _panel = 0;
				}
				//判断该 机芯+机型+尺寸的产品是否已存在
				var checkObj = {
					"chip" : $("#lable2Chip").val(),
					"model" : $("#lable2Model").val(),
					"panel" : parseInt(_panel)
				}
				var _check = JSON.stringify(checkObj);
				var node = '{"data":' + _check + '}';
				console.log(node);
				sendHTTPRequest(coocaaVersion+"/product/queryByChipModelPanel", node, checkResultInfo);
			} else{
				//弹出确认框
				if (changeAdd.length+changeReduce.length+changeConf.length+changeDev.length+changeProp.length == 0) {
					console.log("未做任何修改");
					document.getElementById("page2Modal1ErrorInfo").style.display = "block";
					document.getElementById("page2Modal1ErrorInfo").innerHTML = "您未做任何修改。";
					setTimeout("document.getElementById('page2Modal1ErrorInfo').style.display = 'none';", 3000);
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
}
function checkResultInfo(){
	if(this.readyState == 4) {
		if(this.status == 200) {
			var data = JSON.parse(this.responseText);
			console.log(data);
			if(data.resultCode == "0") {
				console.log(data.resultData.length);
				if (data.resultData.length == 1) {
					//已存在
					document.getElementById("page2Modal1ErrorInfo").style.display = "block";
					document.getElementById("page2Modal1ErrorInfo").innerHTML = "该机芯+机型+尺寸的配置项已经存在。";
					setTimeout("document.getElementById('page2Modal1ErrorInfo').style.display = 'none';", 3000);
				} else{
					//不存在
					var type = $("#lable1SubmitTwo").attr("catagory");
					console.log(type);
					if(type==6){//弹出确认框
						console.log("做了修改");
						$("#txt0").css("display", "block");
						document.getElementById("txt00").innerHTML = $("#lable2Size1").val();
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
					}else{
						var _info = "确定增加此项吗？";
						$("#myAddEnsureDiv").css("display","block");
						$("#areYouSure").html(_info);
					}
				}
			}
		}
	}
}

//批量删除
function page2DeleteMore() {
	//1、判断是否勾选 0-没勾选 1-勾选了
	var checkedLength = 0;
	if(checkedLength == 0) {
		$("#myDeleteDialogModal").modal("toggle");
	} else {
		$("#myMoreDeleteModal").modal("toggle");
	}
}
//导出功能
function page2Export() {
	console.log("点击了导出");
	var _theadTh = $("#page2_table2").find("thead").find("th");
	var _newThead = "<thead><tr>";
	var _newTbody = "<tbody style:'text-align:center'>";
	var _newTbodyTr = "";
	for(var i = 1; i < _theadTh.length - 1; i++) {
		_newThead += _theadTh[i].outerHTML;
	}
	_newThead += "</tr></thead>";
	console.log(_newThead);
	for(var k = 0; k < _myArray.length; k++) {
		_newTbodyTr = "<tr><td>" + _myArray[k].model + "</td><td>" + _myArray[k].chip + "</td><td>" + _myArray[k].targetProduct + "</td><td>" + _myArray[k].androidVersion + "</td><td>" + _myArray[k].soc + "</td><td>" + _myArray[k].memorySize + "</td><td>" + _myArray[k].EMMC + "</td><td>" + _myArray[k].userName + "</td><td>" + _myArray[k].operateTime + "</td></tr>";
		_newTbody += _newTbodyTr;
	}
	_newTbody += "</tbody>";
	console.log(_newTbody);
	// 使用outerHTML属性获取整个table元素的HTML代码（包括<table>标签），然后包装成一个完整的HTML文档，设置charset为urf-8以防止中文乱码
	var html = "<html><head><meta charset='utf-8' /></head><body><table>" + _newThead + _newTbody + "</table></body></html>";
	// 实例化一个Blob对象，其构造函数的第一个参数是包含文件内容的数组，第二个参数是包含文件类型属性的对象
	var blob = new Blob([html], {
		type: "application/vnd.ms-excel"
	});
	var a = document.getElementById("dlink");
	// 利用URL.createObjectURL()方法为a元素生成blob URL
	a.href = URL.createObjectURL(blob);
	// 设置文件名，目前只有Chrome和FireFox支持此属性
	a.download = "产品表.xls";
	document.getElementById("dlink").click();
}

function closeparentpage() {
	document.getElementById("myAddCloseDiv").style.display = "none";
	document.getElementById("myEditModalLabel").style.display = "none";
	$("#page2Modal1").modal('hide');
	changeAdd = [];//保存新增模块信息
	changeReduce = [];//保存删除模块信息
	changeConf = [];//保存修改配置信息
	changeDev = [];//保存修改设备信息
	changeProp = [];//保存修改属性信息
}

function configQueryData1(arr1,arr2) {
	//console.log(arr2);
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
					$(".settingsitems")[j].innerHTML += "<div class='col-xs-3'><input id='"+arr2[i].engName+"' type='checkbox' class='sysitems' cnName='"+arr2[i].cnName+"' descText='"+arr2[i].descText+"' defaultSelected='"+arr2[i].defaultSelected+"' engName='"+arr2[i].engName+"' level1='" + arr2[i].level1 + "' level2='" + arr2[i].level2 + "' level3='" + arr2[i].level3 + "' value=''><span title='" + arr2[i].descText + "'>" + arr2[i].cnName + "</span></div>";
				} else{
					if (arr2[i].level3 == $(".settingsitems:eq(" + (j) + ")").attr("level3")) {
						$(".settingsitems")[j].innerHTML += "<div class='col-xs-3'><input id='"+arr2[i].engName+"' type='checkbox' class='sysitems' cnName='"+arr2[i].cnName+"' descText='"+arr2[i].descText+"' defaultSelected='"+arr2[i].defaultSelected+"' engName='"+arr2[i].engName+"' level1='" + arr2[i].level1 + "' level2='" + arr2[i].level2 + "' level3='" + arr2[i].level3 + "' value=''><span title='" + arr2[i].descText + "'>" + arr2[i].cnName + "</span></div>";
					}
				}
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
	document.getElementsByClassName("mkradio")[0].setAttribute('checked', '');
	document.getElementsByClassName("mkradio")[0].checked = true;
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
		obj.innerHTML += "<div class='col-xs-3'><input id='"+data[kk].engName+"' type='checkbox'class='mkitems' category='" + data[kk].category + "' cnName='"+data[kk].cnName+"' descText='"+data[kk].descText+"' engName='"+data[kk].engName+"' gitPath='" + data[kk].gitPath + "' name='" + data[kk].category + "' value='' disabled><span title='" + data[kk].descText + "'>" + data[kk].cnName + "</span></div>";
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
	obj.innerHTML += "<div class='col-xs-6' style='margin-bottom:2px;'><span class='col-xs-6' title='"+data[kk].descText+"'>"+data[kk].engName+":</span><input class='col-xs-6 propitem' type='text' category='"+data[kk].category+"' descText='"+data[kk].descText+"' id='"+data[kk].engName+"' value='"+data[kk].defaultValue+"' defaultValue='"+data[kk].defaultValue+"' disabled></div>";
}

function getBaseValue(){
	var _chip = $("#page2Modal1Table .inputstyle")[0].value;
	var _model = $("#page2Modal1Table .inputstyle")[1].value;
	var _tp = $("#page2Modal1Table .inputstyle")[2].value;
	var _android = $("#page2Modal1Table .inputstyle")[3].value;
	var _soc = $("#page2Modal1Table .inputstyle")[4].value;
	var _emmc = $("#page2Modal1Table .inputstyle")[5].value;
	var _memory = $("#page2Modal1Table .inputstyle")[6].value;
	var _branch = $("#page2Modal1Table .inputstyle")[7].value;
	var _platform = $("#page2Modal1Table .inputstyle")[8].value;
	var _style = document.getElementById("addSize").style.display;
	console.log(_style != "none");
	if(_style != "none"){
		var _panel = $("#lable2Size1").val();
	}else{
		var _panel = 0;
	}
	//auditState(0审核通过\1待审核\2审核未通过)、modifyState(0正常\1修改\2增加\3删除)
	var baseObj = {
		"chip" : _chip,
		"model" : _model,
		"panel" : parseInt(_panel),
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
	console.log($(".configitems").length);
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
	console.log($(".sysitems").length);
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

function productAddResult(){
	if(this.readyState == 4) {
		if(this.status == 200) {
			var data = JSON.parse(this.responseText);
			console.log(data);
			if(data.resultCode == "0") {
				console.log("数据提交成功");
				var type = $("#lable1SubmitTwo").attr("catagory");
				if(type==1||type==3||type==6){
					console.log("新增或者复制数据的日志提交");
					var _desc = "新增该产品";
					var _reason = "新增";
					var _chip = $("#lable2Chip").val();
					var _model = $("#lable2Model").val();
					var _panel = 0;
					if (type==6) {
						_panel = $("#lable2Size1").val();
					}
				}else if(type == 2){
					console.log("编辑数据的日志提交");
					var _desc = '{"changeDev":"'+changeDev+'","changeAdd":"'+changeAdd+'","changeReduce":"'+changeReduce+'","changeConf":"'+changeConf+'","changeProp":"'+changeProp+'"}';
					var _reason = document.getElementById("changeReason").value;
					var _chip = $("#lable2Chip").val();
					var _model = $("#lable2Model").val();
					var _panel = 0;
				}else if(type == 5){
					console.log("删除数据的日志提交");
					var _desc = '删除该机芯机型的配置表';
					var _reason = document.getElementById("changeReason2").value;
					console.log(_reason);
					var _chip = $("#myDeleteModalEnsure").attr("chip");
					var	_model = $("#myDeleteModalEnsure").attr("model");
					var	_panel = $("#myDeleteModalEnsure").attr("panel");
					$('#myDeleteModal').modal('hide');
				}
				//0审核通过\1待审核\2审核未通过
				var _state = "1";
				var _author = loginusername;
				var historyObj = {
					"chip" : _chip,
					"model" : _model,
					"panel" : parseInt(_panel),
					"reason" : _reason,
					"state" : _state,
					"userName" : _author,
					"content" : _desc
				}
				$("#page2Modal1").modal('hide');
				var _history = JSON.stringify(historyObj);
				var node = '{"data":' + _history + '}';
				console.log(node);
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
				console.log("日志数据提交成功,发送邮件");
				document.getElementById("myEditEnsureDiv").style.display = "none";
			}
		}
		sendEmail();
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
					
					var _tableInnerHtml = "<thead><tr><th>修改内容</th><th>修改原因</th><th>提交时间</th><th>提交者</th><th style='min-width: 55px;'>状态</th></tr></thead>"
					//for (var i=(data.resultData.length-1); i>=0; i--) {
					for (var i=0; i<data.resultData.length; i++) {
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
							_desc += "<span>修改了属性项："+_propsArray+"</span><br/>";
						}
						if (_deleteArray2.length != 0){
							_desc += "<span>"+_deleteArray2+"</span><br/>";
						}
						_tableInnerHtml += "<tbody id='descriptTbody'><tr><td>"+_desc+"</td><td>"+data.resultData[i].reason+"</td><td>"+data.resultData[i].modifyTime+"</td><td>"+data.resultData[i].userName+"</td><td>"+_state+"</td></tr></tbody>";
					}
					document.getElementById("contenttable").innerHTML = _tableInnerHtml;
				}
			}
		}
	}
}

function isJSON_test(str) {
    if (typeof str == 'string') {
        try {
            var obj=JSON.parse(str);
            console.log('转换成功：'+obj);
            return true;
        } catch(e) {
            return false;
        }
    }
    console.log('It is not a string!');
}

function changeConfig(obj){
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
    console.log("delete"+changeReduce);
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

function myEditorAddSubmit(num){
	//获取基本项、config、MK、系统设置的值
	var _base = getBaseValue();
	var _config = getConfigValue();
	var _sys = getSysValue();
	_base = JSON.stringify(_base);
	_config = JSON.stringify(_config);
	_sys = JSON.stringify(_sys);
	var node = '{"baseInfo":' + _base + ',"configInfo":' + _config + ',"settingsInfo":' + _sys +'}';
	console.log(node);
	if (num == 1) {
		sendHTTPRequest(coocaaVersion+"/product/update", node, productAddResult);
	} else if(num == 2){
		sendHTTPRequest(coocaaVersion+"/product/add", node, productAddResult);
	}
}

function sendEmail(){
	var type = $("#lable1SubmitTwo").attr("catagory");
	console.log(type);
	if(type == 1||type == 3){
		console.log("新增或者复制了产品");
		var _chip = $("#lable2Chip").val();
		var _model = $("#lable2Model").val();
		console.log(_chip+"--------"+_model);
		maildata = "用户："+loginusername+"<br/>新增了机芯："+_chip+",机型："+_model+"的配置文档，请审核";
	    maildata += "<br/> -----<br/>进入配置平台请点击 <a href='http://172.20.132.225:3000/v2/scmplatform/index.html'>scmplatform</a>"
	}else if(type == 2){
		console.log("编辑了产品");
		var _chip = $("#lable2Chip").val();
		var _model = $("#lable2Model").val();
		console.log(_chip+"--------"+_model);
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
	        maildata += "<br/>修改配置："+ changeProp;
	    }
	    maildata += "<br/>请前往《待审核文件》菜单进行审核处理<br/> -----<br/>进入配置平台请点击 <a href='http://172.20.132.225:3000/v2/scmplatform/index.html'>scmplatform</a>";
	}else if(type == 5){
		console.log("删除了产品");
		var _chip = deleteChip;
		var _model = deleteModel;
		var _panel = deletePanel;
		console.log(_chip+"--------"+_model);
		var maildata = "用户："+loginusername+"<br/>删除了机芯："+_chip+",机型："+_model+",尺寸："+_panel+"的配置文档";
		maildata += "<br/>请前往《待审核文件》菜单进行审核处理<br/> -----<br/>进入配置平台请点击 <a href='http://172.20.132.225:3000/v2/scmplatform/index.html'>scmplatform</a>";
	}
    var emailObj = {
		"desc" : maildata,
		"from" : fromEmail,
		"to" : toEmail,
		"subject" : "软件配置平台通知-自动发送，请勿回复"
	}
	var _email = JSON.stringify(emailObj);
	var node = '{"data":' + _email + '}';
	console.log(node);
	
	if(level == 1){
		console.log("管理员编辑、修改或者删除，不用发邮件。");
		page2Fresh();
	}else{
		sendHTTPRequest("/sendMail", node, mailfun);
	}
}

//邮件函数回调
function mailfun(){
	console.log("in mailfun");
	if(this.readyState == 4) {
		if(this.status == 200) {
			var data = JSON.parse(this.responseText);
			console.log(data);
		}
		page2Fresh();
	}
}
//滚动到最上面
function scrollTopStyle(name){
	var div = document.getElementById(name);
	var body = parent.document.getElementById("homePage");
	console.log(div.scrollTop+"---"+body.scrollTop);
	document.getElementById(name).scrollTop = 0;
	parent.document.getElementById("homePage").scrollTop = 0;
}
//刷新功能
function page2Fresh() {
	var htmlObject = parent.document.getElementById("tab_userMenu2");
	htmlObject.firstChild.src = "page2.html";
	
	var htmlObject1 = parent.document.getElementById("tab_userMenu1");
	var htmlObject4 = parent.document.getElementById("tab_userMenu4");
	var htmlObject5 = parent.document.getElementById("tab_userMenu5");
	if (htmlObject1) {
		htmlObject1.firstChild.src = "page1.html";
	}
	if (htmlObject4) {
		htmlObject4.firstChild.src = "page4.html";
	}
	if (htmlObject5) {
		htmlObject5.firstChild.src = "page5.html";
	}
}


