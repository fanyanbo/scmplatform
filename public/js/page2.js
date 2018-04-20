document.write("<script language=javascript src='../js/sentHTTP.js' charset=\"utf-8\"></script>");

var autoComplete = "";
var autoComplete2 = "";
var closePageName = "";
var autoDataArray2 = ["a","b","c","bb","cb","bvv","ca","bsd","cfg","bd","adfc","bas","asc"];

$(function() {
	getTableData();
	buttonInit();
	editPageButtonsOnclick();
});

function getTableData() {
	var node = '{"offset":"-1","rows":"10"}';
	sendHTTPRequest("/product/queryByPage", node, productQuery);
}

function productQuery() {
	if(this.readyState == 4) {
		if(this.status == 200) {
			var data = JSON.parse(this.responseText);
			console.log(data);
			if(data.resultCode == "0") {
				handleTableData(data);
			}
		}
		var node4 = '{}';
		sendHTTPRequest("/targetproduct/query", node4, targetproductQueryResult);
	}
}
function targetproductQueryResult(){
	if(this.readyState == 4) {
		if(this.status == 200) {
			var data = JSON.parse(this.responseText);
			console.log(data);
			var autoDataArray = new Array();
			if(data.resultCode == "0") {
				for (var i=0; i<data.resultData.length; i++) {
					autoDataArray.push(data.resultData[i].name)
				}
				instantQuery(autoDataArray,autoDataArray2);
			}
		}
	}
}

function handleTableData(data) {
	var getdataArray2 = new Array();
	var _resultData = data.resultData;
	for(var i = 0; i < _resultData.length; i++) {
		var eachItem2 = {
			"checkout": "<input name='checkbox' type='checkbox' value='checkbox'/>",
			"model": _resultData[i].model,
			"chip": _resultData[i].chip,
			"target_product": _resultData[i].targetProduct,
			"coocaaVersion": _resultData[i].coocaaVersion,
			"AndroidVersion": _resultData[i].androidVersion,
			"chipmodel": _resultData[i].soc,
			"EMMC": _resultData[i].EMMC,
			"memory": _resultData[i].memorySize,
			"gitbranch": _resultData[i].gitBranch,
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
		'url': data1, //数据源 必填
		dbTrclick: function(e) { //双击tr事件
		}
	});
	buttonInitAfter();
}


function instantQuery(array1,array2) {
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
				this.changeClassname(length);
			}
			//光标键"↑"
			else if(event.keyCode == 38) {
				this.index--;
				if(this.index < -1) {
					this.index = length - 1;
				} else if(this.index == -1) {
					this.obj.value = this.search_value;
				}
				this.changeClassname(length);
			}
			//回车键
			else if(event.keyCode == 13) {
				this.autoObj.className = "auto_hidden";
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
	
	console.log(array1);
	console.log(array2);
	autoComplete = new AutoComplete('page2_targetProduct', 'page2_auto', array1);
	autoComplete2 = new AutoComplete('page2_gitbranch', 'page2_auto2', array2);

	/* 点击空白出隐藏临时div */
	_$(document).onclick = function(e) {
		var e = e || window.event; //浏览器兼容性 
		var elem = e.target || e.srcElement;
		var _style = document.getElementById("page2_auto").getAttribute("class");
		var _style2 = document.getElementById("page2_auto2").getAttribute("class");
		if(_style == "auto_show") {
			document.getElementById("page2_auto").setAttribute("class", "auto_hidden")
		}
		if(_style2 == "auto_show") {
			document.getElementById("page2_auto2").setAttribute("class", "auto_hidden")
		}
	}
}

function buttonInit() {

	document.getElementById("page2_searchInfo").onclick = page2Select;
	document.getElementById("page2_reset").onclick = page2Reset;
	document.getElementById("page2_editMore").onclick = page2EditMore;
	document.getElementById("page2_deleteMore").onclick = page2DeleteMore;
	document.getElementById("page2_export").onclick = page2Export;
	document.getElementById("page2_fresh").onclick = page2Fresh;
	document.getElementById("myEditEnsureModalEnsure").onclick = closeparentpage;
	document.getElementById("myEnsureCancle").onclick = function() {
		closePage2Model("myAddCloseDiv");
	};
	document.getElementById("myEnsureX").onclick = function() {
		closePage2Model("myAddCloseDiv");
	}
	document.getElementById("page2_add").onclick = function() {
		page2Add("1", "-1");
	};

	/*单项编辑*/
	var oClassButtonEdit = new Array();
	oClassButtonEdit = document.getElementsByClassName("eachedit");
	for(var i = 0; i < oClassButtonEdit.length; i++) {
		oClassButtonEdit[i].index = i;
		oClassButtonEdit[i].onclick = function() {
			var thisIndex = this.index;
			page2Add("2", thisIndex);
			//document.getElementById("loading").style.display = "block";
		}
	}
	/*单项删除*/
	var oClassButtonDelete = new Array();
	oClassButtonDelete = document.getElementsByClassName("eachdelete");
	for(var i = 0; i < oClassButtonDelete.length; i++) {
		oClassButtonDelete[i].index = i;
		oClassButtonDelete[i].onclick = function() {
			console.log("in delete");
			console.log(this.index); //点击的是第几个
			//var thisIndex = this.index;
			//TwiceTransferChip = oClassButtonDelete[thisIndex].getAttribute("chip");
			//TwiceTransferModel = oClassButtonDelete[thisIndex].getAttribute("model");
			//TwiceTransferTargetProduct = oClassButtonDelete[thisIndex].getAttribute("targetProduct");
			//校验机芯机型
			//sendHTTPRequest("/fybv2_api/chipQuery", '{"data":""}', checkChipInfoInDel);
			$("#myDeleteModalLabel").text("单项删除");
			$('#myDeleteModal').modal();
			$(".modal-backdrop").addClass("new-backdrop");
		}

	}
	/*单项复制*/
	var oClassButtonCopy = new Array();
	oClassButtonCopy = document.getElementsByClassName("eachcopy");
	for(var i = 0; i < oClassButtonCopy.length; i++) {
		oClassButtonCopy[i].index = i;
		oClassButtonCopy[i].onclick = function() {
			var thisIndex = this.index;
			page2Add("3", thisIndex);
			//document.getElementById("loading").style.display = "block";
		}
	}
	//单项预览
	var oClassButtonPreview = new Array();
	oClassButtonPreview = document.getElementsByClassName("eachpreview");
	for(var i = 0; i < oClassButtonPreview.length; i++) {
		oClassButtonPreview[i].index = i;
		oClassButtonPreview[i].onclick = function() {
			var thisIndex = this.index;
			page2Add("4", thisIndex);
			//document.getElementById("loading").style.display = "block";
		}
	}

	$("#page2_targetProduct").keyup(function(event) {
		autoComplete.start(event);
	});
	$("#page2_gitbranch").keyup(function(event) {
		autoComplete2.start(event);
	});
	$(".page2_tabs").click(function() {
		var _curIndex = $(".page2_tabs").index($(this));
		console.log(_curIndex);
		for(var k = 0; k < $(".page2_tabs").length; k++) {
			$(".page2_boxes")[k].style.display = "none";
			$(".page2_tabs")[k].style.backgroundColor = "buttonface";
		}
		$(".page2_boxes")[_curIndex].style.display = "block";
		$(".page2_tabs")[_curIndex].style.backgroundColor = "red";
	});
}

function buttonInitAfter() {
	$(".eachcheck").click(function() {
		var _cIndex = $(".eachcheck").index($(this));
		console.log("点击的是第" + _cIndex + "个 eachcheck class");
		$("#page1_check_chip").html($(".new_productBox .chip")[_cIndex].innerHTML);
		$("#page1_check_model").html($(".new_productBox .model")[_cIndex].innerHTML);
		$("#page1_check_targetProduct").html($(".new_productBox .target_product")[_cIndex].innerHTML);
		$('#page1_examine').modal();
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
	if (oKeyWord==null||oKeyWord=="") {
		node = '{"chip":"' + oChip + '","model":"' + oModel + '","version":"' + oCoocaaVersion + '","soc":"' + oChipid + '","memory":"' + oMemory + '"}';
		console.log(node);
		sendHTTPRequest("/product/queryByRegEx", node, searchResource);
	} else{
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
				console.log(data.resultData);
				$("#page2_table").innerHTML = "";
				handleTableData(data);
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
function page2Add(type, number) {
	$("#page2Modal1").modal();
	$(".modal-backdrop").addClass("new-backdrop");
	$(".page2_boxes")[0].style.display = "block";

	var _chip, _model, _target = "";
	if(type == 1) {
		console.log("点击了新增");
		clearPageInfo();
		//sendHTTPRequest("/fybv2_api/moduleQuery", '{"data":""}', getAddInfoInfOne);
	} else if(type == 2) {
		console.log("点击了编辑");
		_chip = document.getElementsByClassName("eachedit")[number].getAttribute("chip");
		_model = document.getElementsByClassName("eachedit")[number].getAttribute("model");
		_target = document.getElementsByClassName("eachedit")[number].getAttribute("targetProduct");
		//sendHTTPRequest("/fybv2_api/moduleQuery", '{"data":""}', getEditInfo);
	} else if(type == 3) {
		console.log("点击了复制");
		_chip = document.getElementsByClassName("eachcopy")[number].getAttribute("chip");
		_model = document.getElementsByClassName("eachcopy")[number].getAttribute("model");
		_target = document.getElementsByClassName("eachcopy")[number].getAttribute("targetProduct");
		//sendHTTPRequest("/fybv2_api/moduleQuery", '{"data":""}', getCopyInfoInfOne);
	} else if(type == 4) {
		console.log("点击了预览");
		_chip = document.getElementsByClassName("eachpreview")[number].getAttribute("chip");
		_model = document.getElementsByClassName("eachpreview")[number].getAttribute("model");
		_target = document.getElementsByClassName("eachpreview")[number].getAttribute("targetProduct");
		//sendHTTPRequest("/fybv2_api/preview", '{"data":{"targetProduct":"'+TwiceTransferTargetProduct+'","chip":"'+TwiceTransferChip+'","model":"'+TwiceTransferModel+'"}}', getPreviewInfo);
	}

}
//点击新增时清空数据
function clearPageInfo() {
	document.getElementById("lable2Chip").value = "";
	document.getElementById("lable2Model").value = "";
	document.getElementById("lable2TargetProduct").value = "";
	document.getElementById("lable2CoocaaVersion").value = "";
	document.getElementById("lable2AndroidVersion").value = "";
	document.getElementById("lable2ChipMode").value = "";
	document.getElementById("lable2AndroidVersion").value = "";
	document.getElementById("lable2ChipMode").value = "";
	document.getElementById("lable2Memory").value = "";

	document.getElementById("myAddModalMkTableApp").innerHTML = "";
	document.getElementById("myAddModalMkTableService").innerHTML = "";
	document.getElementById("myAddModalMkTableAppStore").innerHTML = "";
	document.getElementById("myAddModalMkTableHomePage").innerHTML = "";
	document.getElementById("myAddModalMkTableIME").innerHTML = "";
	document.getElementById("myAddModalMkTableSysApp").innerHTML = "";
	document.getElementById("myAddModalMkTableTV").innerHTML = "";
	document.getElementById("myAddModalMkTableOther").innerHTML = "";
}
//批量编辑
function page2EditMore() {
	$("#myMoreEditModal").modal("toggle");
	$(".modal-backdrop").addClass("new-backdrop");

}
//批量删除
function page2DeleteMore() {
	//1、判断是否勾选
	var checkedLength = 0;
	if(checkedLength == 0) {
		//如果没勾选
		$("#myDeleteDialogModal").modal("toggle");

	} else {
		//如果勾选了
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
//刷新功能
function page2Fresh() {}

/*点击单项编辑-弹框里的各个按钮*/
function editPageButtonsOnclick() {
	var oButtonEditEnsure = document.getElementById("page2Modal1Submit");
	oButtonEditEnsure.onclick = function() {
		console.log("单项编辑页-提交按钮一");
		//传参：1-新增页 2-复制页 3-编辑页
		//chipModeldataCheck(3);
	}
	var oButtonEditEnsure = document.getElementById("lable1SubmitTwo");
	oButtonEditEnsure.onclick = function() {
		console.log("单项编辑页-提交按钮二");
		scrollTopStyle("myEditModal");
		//传参：1-新增页 2-复制页 3-编辑页
		//chipModeldataCheck(3);
	}
	var oButtonAdd = document.getElementById("page2Modal1Close");
	oButtonAdd.onclick = function() {
			console.log("单项编辑页-关闭按钮");
			$("#myAddCloseDiv").modal('show');
			$(".modal-backdrop").addClass("new-backdrop");
			document.getElementById("myAddCloseDiv").style.display = "block";
			document.getElementById("infoEdit").innerHTML = "确认要关闭吗？";
			//传参-关闭父页  
			//$("#page2Modal1").modal('hide');
		}
		//编辑页mk-config button的点击
		//functionMkConfigTable("myEditModalMkButton", "myEditModalMkTable", "myEditModalConfigButton", "myEditModalConfigTable");
		//changListen("videoEChange");
}

function closePage2Model(objname) {

	document.getElementById(objname).style.display = "none";
}

function closeparentpage() {
	document.getElementById("myAddCloseDiv").style.display = "none";
	$("#page2Modal1").modal('hide');
}