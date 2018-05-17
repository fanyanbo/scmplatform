document.write("<script language=javascript src='../js/sentHTTP.js' charset=\"utf-8\"></script>");

var autoComplete1,autoComplete2,autoComplete3,autoComplete4,autoComplete5 = "";
var autoComplete12,autoComplete22,autoComplete32,autoComplete42,autoComplete52 = "";
var closePageName = "";
var autoDataArray1 = new Array();
var autoDataArray2 = new Array();
var autoDataArray3 = new Array();
var autoDataArray4 = new Array();
var autogitArray = ["a", "b", "c", "bb", "cb", "bvv", "ca", "bsd", "cfg", "bd", "adfc", "bas", "asc"];

var _twoLevelLinkageArrayOne = [[],[],[],[]];
var _twoLevelLinkageArrayTwo = [[],[],[],[]];
var _twoLevelLinkageArrayThree = [[],[],[],[]];
var _myArray = [];

var changeAdd = [];//保存新增模块信息
var changeReduce = [];//保存删除模块信息
var changeConf = [];//保存修改配置信息
var changeDev = [];//保存修改设备信息
var olrplayerid = null;

var fromEmail = null;
var adminFlag = null;
var loginusername = null;

$(function() {
	fromEmail = parent.loginEmail;
	loginusername = parent.loginusername;
	adminFlag = parent.adminFlag;
	console.log(fromEmail+"--"+loginusername+"--"+adminFlag);
	var node = '{"offset":"-1","rows":"10"}';
	sendHTTPRequest("/product/queryByPage", node, productQuery);
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
				for (var i=0; i<data.resultData.length; i++) {
					if (data.resultData[i].auditState == 0) {
						arr.push(data.resultData[i]);
					}
				}
				handleTableData(arr);
			}
		}
		var node1 = '{}';
		sendHTTPRequest("/device/queryAll", node1 , targetproductQueryResult);
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
				instantQuery(autoDataArray1, autoDataArray2, autoDataArray3, autoDataArray4, autogitArray);
			}
		}
		clearAllInfo();
		sendHTTPRequest("/product/queryAll", '{}', allQueryResult);
	}
}

function handleTableData(arr) {
	var getdataArray2 = new Array();
	for(var i = 0; i < arr.length; i++) {
		var eachItem2 = {
			"checkout": "<input name='checkbox' type='checkbox' value='checkbox'/>",
			"model": arr[i].model,
			"chip": arr[i].chip,
			"target_product": arr[i].targetProduct,
			"coocaaVersion": arr[i].coocaaVersion,
			"AndroidVersion": arr[i].androidVersion,
			"chipmodel": arr[i].soc,
			"EMMC": arr[i].EMMC,
			"memory": arr[i].memorySize,
			"gitbranch": arr[i].gitBranch,
			"history": "<a class='eachcheck' href='#'>查看</a>",
			"operate": "<a class='eachedit' href='#'><span class='glyphicon glyphicon-pencil'></span></a><a class='eachdelete' href='#'><span class='glyphicon glyphicon-remove'></span></a><a class='eachcopy' href='#'><span class='glyphicon glyphicon-copy'></span></a><a class='eachpreview' href='#'><span class='glyphicon glyphicon glyphicon-eye-open'></span></a>"
		};
		getdataArray2.push(eachItem2);
	}
	console.log(getdataArray2);
	pageTableInit(getdataArray2);
}

function pageTableInit(data1) {
	//前台分页的样子
	$('#page2_table').CJJTable({
		'title': ["单选框", "机型", "机芯", "TP", "酷开版本", "安卓版本", "芯片型号", "EMMC", "内存", "git分支", "修改历史", "操作"], //thead中的标题 必填
		'body': ["checkout", "model", "chip", "target_product", "coocaaVersion", "AndroidVersion", "chipmodel", "EMMC", "memory", "gitbranch", "history", "operate"], //tbody td 取值的字段 必填
		'display': [2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1], //隐藏域，1显示，2隐藏 必填
		'pageNUmber': 10, //每页显示的条数 选填
		'pageLength': data1.length, //选填
		'url': data1 //数据源 必填
	});
	buttonInitAfter();
}

function instantQuery(arr1, arr2, arr3, arr4, arr5) {
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
	autoComplete1 = new AutoComplete('page2_chip', 'page2_chip_auto', arr1);
	autoComplete2 = new AutoComplete('page2_model', 'page2_model_auto', arr2);
	autoComplete3 = new AutoComplete('page2_targetProduct', 'page2_tp_auto', arr3);
	autoComplete4 = new AutoComplete('page2_chipid', 'page2_soc_auto', arr4);
	autoComplete5 = new AutoComplete('page2_gitbranch', 'page2_git_auto', arr5);
	
	autoComplete12 = new AutoComplete('lable2Chip', 'page2_chip_auto2', arr1);
	autoComplete22 = new AutoComplete('lable2Model', 'page2_model_auto2', arr2);
	autoComplete32 = new AutoComplete('lable2TargetProduct', 'page2_tp_auto2', arr3);
	autoComplete42 = new AutoComplete('lable2ChipMode', 'page2_soc_auto2', arr4);
	autoComplete52 = new AutoComplete('lable2GitBranch', 'page2_git_auto2', arr5);
	/* 点击空白出隐藏临时div */
	_$(document).onclick = function(e) {
		var e = e || window.event; //浏览器兼容性 
		var elem = e.target || e.srcElement;
		
		
		var showArray = ["page2_chip_auto","page2_model_auto","page2_tp_auto","page2_soc_auto","page2_git_auto","page2_chip_auto2","page2_model_auto2","page2_tp_auto2","page2_soc_auto2","page2_git_auto2"];
		var showBox = ["page2_chip","page2_model","page2_targetProduct","page2_chipid","page2_gitbranch","lable2Chip","lable2Model","lable2TargetProduct","lable2ChipMode","lable2GitBranch"];
		eachShowObj(showArray,showBox);
	}
	function eachShowObj(arr,arr2){
		for (var i=0; i<arr.length; i++) {
			var _style = document.getElementById(arr[i]).getAttribute("class");
			if(_style == "auto_show") {
				//checkInArray(arr2[i],$("#"+arr2[i])[0].value);
				document.getElementById(arr[i]).setAttribute("class", "auto_hidden")
			}
		}
	}
}

function checkInArray(id,value){}

function changeMKByTP(id, value) {
	console.log(id + "-----" + value);
	var node = '{"targetproduct":"' + value + '"}';
	sendHTTPRequest("/product/queryBytp", node, getMKByTPResult);
}

function getMKByTPResult() {
	if(this.readyState == 4) {
		if(this.status == 200) {
			var data = JSON.parse(this.responseText);
			console.log(data);
			if(data.resultCode == "0") {
				clearMKLastWork();
				
				for (var i=0; i<data.resultData.length; i++) {
					document.getElementById(data.resultData[i].engName).setAttribute('checked', 'true');
				}
			}
		}
	}
}
function clearMKLastWork(){
	console.log($(".mkitems").length);
	for (var i=0; i<$(".mkitems").length; i++) {
		document.getElementsByClassName("mkitems")[i].removeAttribute('checked');
	}
}

function buttonInit() {
	document.getElementById("page2_searchInfo").onclick = page2Select;
	document.getElementById("page2_reset").onclick = page2Reset;
	document.getElementById("page2_deleteMore").onclick = page2DeleteMore;
	document.getElementById("page2_export").onclick = page2Export;
	document.getElementById("page2_fresh").onclick = page2Fresh;
	document.getElementById("myEditEnsureModalEnsure").onclick = closeparentpage;
	
	$("#myEnsureCancle").click(function() {
		closePage2Model("myAddCloseDiv");
	});
	$("#myEnsureX").click(function() {
		closePage2Model("myAddCloseDiv");
	});
	$("#page2_add").click(function() {
		$("#lable1SubmitTwo").attr("catagory","1");//1-新增、2-修改、3-复制、4-预览
		console.log("点击了新增");
		resetAllInfo();//删除前面的操作痕迹
		$("#page2Modal1").modal();
		$(".modal-backdrop").addClass("new-backdrop");
		$(".page2_boxes")[0].style.display = "block";
	});
	$("#myDeleteModalEnsure").click(function(){
		console.log("点击了确认框的确认按钮");
		var _chip = $("#myDeleteModalEnsure").attr("chip");
		var	_model = $("#myDeleteModalEnsure").attr("model");
		var deleteObj = {
			"chip" : _chip,
			"model" : _model,
			"userName" : loginusername,
		}
		
		var _delete = JSON.stringify(deleteObj);
		var node = '{"data":' + _delete + '}';
		console.log(node);
		sendHTTPRequest("/product/delete", node, getDeleteProductInfo);
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
	$("#page2_gitbranch").keyup(function(event) {
		autoComplete5.start(event);
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
	$("#lable2GitBranch").keyup(function(event) {
		autoComplete52.start(event);
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
		page2Fresh()
	});
	$("#myEditCancle").click(function() {
		console.log("修改提示框的取消按钮");
		document.getElementById("myEditEnsureDiv").style.display = "none";
		page2Fresh()
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
		sendHTTPRequest("/product/update", node, productAddResult);
	});
	$("#myAddEnsure").click(function() {
		console.log("新增提示框的确定按钮");
		var _base = getBaseValue();
		var _config = getConfigValue();
		var _sys = getSysValue();
		_base = JSON.stringify(_base);
		_config = JSON.stringify(_config);
		_sys = JSON.stringify(_sys);
		var node = '{"baseInfo":' + _base + ',"configInfo":' + _config + ',"settingsInfo":' + _sys + '}';
		console.log(node);
		sendHTTPRequest("/product/add", node, productAddResult);
	});
}

function colorstatus(number){
	for(var k = 0; k < $(".page2_tabs").length; k++) {
		$(".page2_boxes")[k].style.display = "none";
		$(".page2_tabs")[k].style.backgroundColor = "buttonface";
	}
	$(".page2_boxes")[number].style.display = "block";
	$(".page2_tabs")[number].style.backgroundColor = "red";
}

function buttonInitAfter() {
	$(".eachcheck").click(function() {
		var _cIndex = $(".eachcheck").index($(this));
		console.log("点击的是第" + _cIndex + "个 eachcheck class");
		$("#page1_check_chip").html($(".new_productBox .chip")[_cIndex].innerHTML);
		$("#page1_check_model").html($(".new_productBox .model")[_cIndex].innerHTML);
		$("#page1_check_targetProduct").html($(".new_productBox .target_product")[_cIndex].innerHTML);
		$('#page1_examine').modal();
		
		var node = '{"chip":"'+$(".new_productBox .chip")[_cIndex].innerHTML+'","model":"'+$(".new_productBox .model")[_cIndex].innerHTML+'"}';
		sendHTTPRequest("/product/queryHistory", node, productHistoryQuery);
	});
	$(".eachedit").click(function() {
		var _aIndex = $(".eachedit").index($(this));
		//1-新增、2-修改、3-复制、4-预览
		$("#lable1SubmitTwo").attr("catagory","2");
		resetAllInfo();//删除前面的操作痕迹
		$("#page2Modal1").modal();
		$(".modal-backdrop").addClass("new-backdrop");
		page2AEC(_aIndex);
		//document.getElementById("loading").style.display = "block";
	});
	$(".eachdelete").click(function() {
		var _aIndex = $(".eachdelete").index($(this));
		$("#myDeleteModalEnsure").attr("chip",$(".chip")[_aIndex].innerText);
		$("#myDeleteModalEnsure").attr("model",$(".model")[_aIndex].innerText);
		$("#myDeleteModalLabel").text("单项删除");
		$('#myDeleteModal').modal();
		$(".modal-backdrop").addClass("new-backdrop");
		
	});
	/*单项复制*/
	$(".eachcopy").click(function() {
		var _aIndex = $(".eachcopy").index($(this));
		//1-新增、2-修改、3-复制、4-预览
		$("#lable1SubmitTwo").attr("catagory","3");
		resetAllInfo();//删除前面的操作痕迹
		page2AEC(_aIndex);
		$("#page2Modal1").modal();
		$(".modal-backdrop").addClass("new-backdrop");
		//document.getElementById("loading").style.display = "block";
	});
	/*单项预览*/
	$(".eachpreview").click(function() {
		var _aIndex = $(".eachpreview").index($(this));
		//1-新增、2-修改、3-复制、4-预览
		$("#lable1SubmitTwo").attr("catagory","4");
		page2AEC(_aIndex);
		//document.getElementById("loading").style.display = "block";
	});
	$("#page1_close1").click(function() {
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
	var oCoocaaVersion = document.getElementById('page2_coocaaVersion').value;
	var oAndroid = document.getElementById('page2_androidVersion').value;
	var oChipid = document.getElementById('page2_chipid').value;
	var oEmmc = document.getElementById('page2_EMMC').value;
	var oMemory = document.getElementById('page2_memory').value;
	var oKeyWord = document.getElementById('page2_keyword').value;
	var oGitBranch = document.getElementById('page2_gitbranch').value;

	var node = "";
	if(oKeyWord == null || oKeyWord == "") {
		node = '{"chip":"' + oChip + '","model":"' + oModel + '","version":"' + oCoocaaVersion + '","soc":"' + oChipid + '","memory":"' + oMemory + '"}';
		console.log(node);
		sendHTTPRequest("/product/queryByRegEx", node, searchResource);
	} else {
		node = '{"name":"' + oKeyWord + '"}';
		console.log(node);
		sendHTTPRequest("/product/queryByModule", node, searchResource);
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
	document.getElementById("page2_coocaaVersion").value = "";
	document.getElementById("page2_androidVersion").value = "";
	document.getElementById("page2_chipid").value = "";
	document.getElementById("page2_EMMC").value = "";
	document.getElementById("page2_memory").value = "";
	document.getElementById("page2_keyword").value = "";
	document.getElementById("page2_gitbranch").value = "";
	//	page2Select(); //重置时是否需要重新查询，这个需要分析
}
//新增、编辑、复制、预览 功能
function page2AEC(number) {
	var _type = $("#lable1SubmitTwo").attr("catagory");//1-新增、2-编辑、3-复制、4-预览
	var _chip = $(".chip")[number].innerText;
	var	_model = $(".model")[number].innerText;
	var	_target = $(".target_product")[number].innerText;
	if(_type == 2 || _type == 3) {
		console.log("点击了编辑 或者是复制" + number);
		var node = '{"chip":"'+_chip+'","model":"'+_model+'"}';
		sendHTTPRequest("/product/queryAllByMachine", node, getPointProductInfo);
	} else if(_type == 4) {
		console.log("点击了预览" + number);
		var node = '{"chip":"'+_chip+'","model":"'+_model+'"}';
		sendHTTPRequest("/product/preview", node, getPreviewInfo);
	}
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

//点击新增时清空所有数据
function clearAllInfo() {
	document.getElementById("lable2Chip").value = "";
	document.getElementById("lable2Model").value = "";
	document.getElementById("lable2TargetProduct").value = "";
	document.getElementById("lable2CoocaaVersion").value = "";
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

function resetAllInfo(){
	colorstatus(0);//焦点落在第一个tabs上
	
	document.getElementById("lable2Chip").value = "";
	document.getElementById("lable2Model").value = "";
	document.getElementById("lable2TargetProduct").value = "";
	document.getElementById("lable2CoocaaVersion").value = "";
	document.getElementById("lable2AndroidVersion").value = "";
	document.getElementById("lable2ChipMode").value = "";
	document.getElementById("lable2Emmc").value = "";
	document.getElementById("lable2Memory").value = "";
	document.getElementById("lable2GitBranch").value = "";
	document.getElementById("lable2Platform").value = "";
	
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
			document.getElementsByClassName("mkitems")[k].removeAttribute('checked');
		} else if($(".mkitems")[k].getAttribute("type") == "radio"){
			document.getElementsByClassName("mkitems")[k].removeAttribute('checked');
		}
	}
	document.getElementsByClassName("mkradio")[0].setAttribute('checked', '');
	document.getElementsByClassName("mkradio")[0].checked = true;
}

//点击复制或者编辑
function getPointProductInfo(){
	if(this.readyState == 4) {
        if(this.status == 200) {
            var data = JSON.parse(this.responseText);
            console.log(data);
            if(data.resultCode == 0){
            	console.log("数据返回成功");
            	var _type = $("#lable1SubmitTwo").attr("catagory");//2-编辑、3-复制
            	
            	CommonDataInsert(_type,data.resultData[0]);
            	ConfigDataInsert(_type,data.resultData[1]);
            	MKDataInsert(_type,data.resultData[2]);
            	SysDataInsert(_type,data.resultData[3]);
            }
        };
    }
}

function getDeleteProductInfo(){
	if(this.readyState == 4) {
        if(this.status == 200) {
            var data = JSON.parse(this.responseText);
            console.log(data);
            if(data.resultCode == 0){
            	console.log("数据返回成功,提交删除日志");
            	var _chip = $("#myDeleteModalEnsure").attr("chip");
				var	_model = $("#myDeleteModalEnsure").attr("model");
				var historyObj = {
					"chip" : _chip,
					"model" : _model,
					"reason" : "删除",
					"state" : 1,
					"userName" : loginusername,
					"content" : "删除该产品"
				}
				
				var _history = JSON.stringify(historyObj);
				var node = '{"data":' + _history + '}';
				$('#myDeleteModal').modal('hide');
				sendHTTPRequest("/product/addHistory", node, productHistoryAdd);
            }
        };
    }
}


function CommonDataInsert(type,arr){
	$("#lable2CoocaaVersion").val(arr[0].coocaaVersion);
	$("#lable2AndroidVersion").val(arr[0].androidVersion);
	$("#lable2ChipMode").val(arr[0].soc);
	$("#lable2Emmc").val(arr[0].EMMC);
	$("#lable2Memory").val(arr[0].memorySize);
	$("#lable2GitBranch").val(arr[0].gitBranch);
	$("#lable2Platform").val(arr[0].platform);
	if (type == 2) {//编辑
		$("#lable2Chip").val(arr[0].chip);
		$("#lable2Chip").css("color","red");
		$("#lable2Chip").attr("disabled","disabled");
		$("#lable2Model").val(arr[0].model);
		$("#lable2Model").css("color","red");
		$("#lable2Model").attr("disabled","disabled");
		$("#lable2TargetProduct").val(arr[0].targetProduct);
		$("#lable2TargetProduct").css("color","red");
		$("#lable2TargetProduct").attr("disabled","disabled");
		
		
		$("#lable2CoocaaVersion").attr("oldvalue",arr[0].coocaaVersion);
		$("#lable2AndroidVersion").attr("oldvalue",arr[0].androidVersion);
		$("#lable2ChipMode").attr("oldvalue",arr[0].chipModel);
		$("#lable2Emmc").attr("oldvalue",arr[0].EMMC);
		$("#lable2Memory").attr("oldvalue",arr[0].memorySize);
		$("#lable2GitBranch").attr("oldvalue",arr[0].gitBranch);
		$("#lable2Platform").attr("oldvalue",arr[0].platform);
		
		$("#lable2CoocaaVersion").attr("onchange","changeDevice(this)");
		$("#lable2AndroidVersion").attr("onchange","changeDevice(this)");
        $("#lable2ChipMode").attr("onchange","changeDevice(this)");
        $("#lable2Memory").attr("onchange","changeDevice(this)");
        $("#lable2Emmc").attr("onchange","changeDevice(this)");
        $("#lable2GitBranch").attr("onchange","changeDevice(this)");
        $("#lable2Platform").attr("onchange","changeDevice(this)");
	}
}
function ConfigDataInsert(type, arr){
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
function MKDataInsert(type, arr){
	for (var j=0; j<$(".mkradio").length; j++) {
		document.getElementsByClassName("mkradio")[j].removeAttribute('checked');
	}
	for (var i=0; i<arr.length; i++) {
		document.getElementById(arr[i].engName).setAttribute('checked', 'true');
	}
//	olrplayerid = arr[i].id;
}
function SysDataInsert(type, arr){
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
				$('#myPreviewModal').modal(); //弹出编辑页（即新增页，只是每项都有数据，这个数据从后台获取）
				$(".modal-backdrop").addClass("new-backdrop");
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

function getAndCheckAndSendAllData(){
	var type = $("#lable1SubmitTwo").attr("catagory");
	console.log(type);
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
	console.log(nullName);
	if (nullName == 0) {
		console.log("没有空项");
		var _errNum = 0;
		var isTrueData0 = $("#page2Modal1Table .fuzzySearch")[0].value;
		var isTrueData1 = $("#page2Modal1Table .fuzzySearch")[1].value;
		var isTrueData2 = $("#page2Modal1Table .fuzzySearch")[2].value;
		var isTrueData3 = $("#page2Modal1Table .fuzzySearch")[3].value;
		var isTrueData4 = $("#page2Modal1Table .fuzzySearch")[4].value;
		console.log(isTrueData0+"-"+isTrueData1+"-"+isTrueData2+"-"+isTrueData3+"-"+isTrueData4);
		var index0 = autoDataArray1.indexOf(isTrueData0);
		var index1 = autoDataArray2.indexOf(isTrueData1);
		var index2 = autoDataArray3.indexOf(isTrueData2);
		var index3 = autoDataArray4.indexOf(isTrueData3);
		var index4 = autogitArray.indexOf(isTrueData4);
		console.log(index0+"-"+index1+"-"+index2+"-"+index3+"-"+index4);
		if (index0 == "-1"||index2 == "-1"||index3 == "-1"||index3 == "-1"||index4 == "-1") {
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
			if (index4 == "-1") {
				_errNum = 4;
			}
			var _curInput = $("#page2Modal1Table .fuzzySearch")[_errNum].getAttribute("name");
			document.getElementById("page2Modal1ErrorInfo").style.display = "block";
			document.getElementById("page2Modal1ErrorInfo").innerHTML = _curInput + "项的值不存在";
			setTimeout("document.getElementById('page2Modal1ErrorInfo').style.display = 'none';", 3000);
		} else{
			if (type == 1|| type == 3) {
				document.getElementById("myAddEnsureDiv").style.display = "block";
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
	for(var k = 0; k < data.length; k++) {
		_newTbodyTr = "<tr><td>" + data[k].model + "</td><td>" + data[k].chip + "</td><td>" + data[k].target_product + "</td><td>" + data[k].chipmodel + "</td><td>" + data[k].coocaaVersion + "</td><td>" + data[k].AndroidVersion + "</td><td>" + data[k].memory + "</td><td>" + data[k].EMMC + "</td><td>" + data[k].author + "</td><td>" + data[k].time + "</td></tr>";
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

function closePage2Model(objname) {
	document.getElementById(objname).style.display = "none";
}

function closeparentpage() {
	document.getElementById("myAddCloseDiv").style.display = "none";
	$("#page2Modal1").modal('hide');
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


function getBaseValue(){
	var _chip = $("#page2Modal1Table .inputstyle")[0].value;
	var _model = $("#page2Modal1Table .inputstyle")[1].value;
	var _tp = $("#page2Modal1Table .inputstyle")[2].value;
	var _coocaa = $("#page2Modal1Table .inputstyle")[3].value;
	var _android = $("#page2Modal1Table .inputstyle")[4].value;
	var _soc = $("#page2Modal1Table .inputstyle")[5].value;
	var _emmc = $("#page2Modal1Table .inputstyle")[6].value;
	var _memory = $("#page2Modal1Table .inputstyle")[7].value;
	var _branch = $("#page2Modal1Table .inputstyle")[8].value;
	var _platform = $("#page2Modal1Table .inputstyle")[9].value;
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
		var oAsysInfo = {
			"engName": "",
		};
		oAsysInfo.engName = $(".sysitems")[i].getAttribute("engname");
		sysData.push(oAsysInfo);
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
				if(type == 1||type == 3){
					console.log("新增或者复制");
					var _desc = "新增该产品";
					var _reason = "新增";
				}else if(type == 2){
					console.log("编辑");
					var _desc = '{"changeDev":"'+changeDev+'","changeAdd":"'+changeAdd+'","changeReduce":"'+changeReduce+'","changeConf":"'+changeConf+'"}';
					var _reason = document.getElementById("changeReason").innerHTML;
				}
				var _chip = $("#lable2Chip").val();
				var _model = $("#lable2Model").val();
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
				$("#page2Modal1").modal('hide');
				var _history = JSON.stringify(historyObj);
				var node = '{"data":' + _history + '}';
				sendHTTPRequest("/product/addHistory", node, productHistoryAdd);
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
				document.getElementById("myEditEnsureDiv").style.display = "none";
				page2Fresh();
			}
		}
	}
}

function productHistoryQuery(){
	if(this.readyState == 4) {
		if(this.status == 200) {
			var data = JSON.parse(this.responseText);
			console.log(data);
			if(data.resultCode == "0") {
				console.log("数据查询成功");
				for (var i=0; i<data.resultData.length; i++) {
					var _row = document.getElementById("descriptTbody").insertRow(0);
					var _cell0 = _row.insertCell(0);
					_cell0.innerHTML = data.resultData[i].content;
					var _cell1 = _row.insertCell(1);
					_cell1.innerHTML = data.resultData[i].reason;
					var _cell2 = _row.insertCell(2);
					_cell2.innerHTML = data.resultData[i].state;
					var _cell3 = _row.insertCell(3);
					_cell3.innerHTML = data.resultData[i].userName;
					var _cell4 = _row.insertCell(4);
					_cell4.innerHTML = data.resultData[i].modifyTime;
				}
			}
		}
	}
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
    if (obj.checked && (obj.getAttribute("oldvalue") == '0')) {
        // obj.oldvalue = '1';
        obj.setAttribute("oldvalue","1");
        changeAdd.push(obj.getAttribute("cvalue"));
        console.log("add"+changeAdd);
        console.log("changeReduce"+changeReduce);
    }else if(!(obj.checked) && (obj.getAttribute("oldvalue") == '0')){
        obj.setAttribute("oldvalue","2");
        changeReduce.push(obj.getAttribute("cvalue"));
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
        changeReduce.remove(obj.getAttribute("name"));
        changeAdd.remove(obj.getAttribute("name"));
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
	
	var htmlObject2 = parent.document.getElementById("tab_userMenu5");
	if (htmlObject2 == null) {
		console.log("待审核页未被点击，不需要刷新。");
	} else{
		htmlObject2.firstChild.src = "page5.html";
	}
}


