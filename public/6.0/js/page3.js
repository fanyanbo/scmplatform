document.write("<script language=javascript src='../js/sentHTTP.js' charset=\"utf-8\"></script>");

var autoComplete3 = "";
var tpArray = new Array();

var tpName = "";
var MKAddArray = new Array();
var MKDeleteArray = new Array();
var changeProp = new Array();

var oldRadioName = "";
var radioNameTemp = "";
var coocaaVersion = "/v6.0";

$(function() {
	var node = '{}';
	sendHTTPRequest(coocaaVersion+"/targetproduct/query", node , QueryResult);
	
	buttonInitBefore()
});

function QueryResult(){
	if(this.readyState == 4) {
		if(this.status == 200) {
			var data = JSON.parse(this.responseText);
			console.log(data);
			if(data.resultCode == "0") {
				var instantSearch = new Array();
				for (var i=0; i<data.resultData.length; i++) {
					var tpObjItem = {
						"number": "",
						"target_product": "",
						"operate": ""
					}
					tpObjItem.number = (i+1);
					tpObjItem.target_product = '<span class="eachtpvalue">'+data.resultData[i].name+'</span>';
					tpObjItem.operate = '<button class="btn-success eachedit">编辑</button><button class="btn-success eachcopy">复制</button><button class="btn-success eachpreview">预览</button>';
					instantSearch.push(tpObjItem);
					tpArray.push(data.resultData[i].name);
				}
				instantQuery(tpArray);
				pageTableInit(instantSearch);
			}
		}
		sendHTTPRequest(coocaaVersion+"/product/queryAll", '{}', allQueryResult);
	}
}

function pageTableInit(data){
	//前台分页的样子
	document.getElementById('page3_table').innerHTML = "";
	$('#page3_table').CJJTable({
		'title': ["序号", "TARGET_PRODUCT", "操作"], //thead中的标题 必填
		'body': ["number", "target_product", "operate"], //tbody td 取值的字段 必填
		'display': [2, 1, 1], //隐藏域，1显示，2隐藏 必填
		'pageNUmber': 10, //每页显示的条数 选填
		'pageLength': data.length, //选填
		'url': data //数据源 必填
	});
}
function reloadClick(){
	console.log("in reloadClick");
	buttonInitAfter();
}

function buttonInitBefore(){
	document.getElementById("page3_searchInfo").onclick = page3Select;
	document.getElementById("page3_reset").onclick = page3Reset;
	document.getElementById("page3_add").onclick = page3Add;
	
	$("#page3_tp_submit").click(function(){
		console.log("点击了TP的提交");
		tpsubmit();
	});
	$("#page3_tp_submit2").click(function(){
		console.log("点击了TP的提交");
		tpsubmit();
	});
	$("#myEditEnsure").click(function(){
		console.log("点击了TP的提交");
		tpsubmit2();
	});
	$("#myEditCancle").click(function(){
		$("#myEditEnsureDiv").css("display","none");
	});
	$("#myEditEnsureX").click(function(){
		$("#myEditEnsureDiv").css("display","none");
	});
	$("#page3_tp_close").click(function(){
		resetAllInfo();
		$("#page3Modal").modal("hide");
	});
	$("#page3_targetProduct").keyup(function(event) {
		autoComplete1.start(event);
	});
}
function buttonInitAfter(){
	$(".eachedit").click(function(){
		console.log("单项编辑");
		//0-编辑、1-复制、2-预览、3-新增
		$("#page3_tp_submit").css("display","block");
		$("#page3_tp_submit2").css("display","inline-block");
		var _eachtpAIndex = $(".eachedit").index($(this));
		eachOperate(_eachtpAIndex, 0);
	});
	$(".eachcopy").click(function(){
		console.log("单项复制");
		//0-新增、1-编辑、2-复制、3-预览
		$("#page3_tp_submit").css("display","block");
		$("#page3_tp_submit2").css("display","inline-block");
		var _eachtpAIndex = $(".eachcopy").index($(this));
		eachOperate(_eachtpAIndex, 1);
	});
	
	$(".eachpreview").click(function(){
		console.log("单项预览");
		$("#page3_tp_submit").css("display","none");
		$("#page3_tp_submit2").css("display","none");
		var _eachtpAIndex = $(".eachpreview").index($(this));
		eachOperate(_eachtpAIndex, 2);
	});
}

function instantQuery(arr1) {
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
	autoComplete1 = new AutoComplete('page3_targetProduct', 'page3_auto', arr1);
	/* 点击空白出隐藏临时div */
	_$(document).onclick = function(e) {
		var e = e || window.event; //浏览器兼容性 
		var elem = e.target || e.srcElement;
		var _style = document.getElementById("page3_auto").getAttribute("class");
		if(_style == "auto_show") {
			document.getElementById("page3_auto").setAttribute("class", "auto_hidden")
		}
	}
}

function eachOperate(index,num){
	$('#page3Modal').attr("status",num);
	var thisEnName = $(".eachtpvalue")[index].innerText;
	var thisEnNameCut = "";
	if(thisEnName.length>10){
		thisEnNameCut = thisEnName.substring(0,10)+"...";  
	}else{
		thisEnNameCut = thisEnName;
	}
	console.log(thisEnName);
	document.getElementById("page3_TP").value = thisEnName;
	
	$('#page3Modal').modal();
	if (num == 0) {
		$("#page3_title").html("编辑tp的名称");
		$("#page3_TP").attr("disabled","disabled");
	} else if(num==1){
		$("#page3_title").html("复制tp的名称");
		$("#page3_TP").removeAttr("disabled");
	}else if(num==2){
		$("#page3_title").html("预览tp的名称");
		$("#page3_TP").attr("disabled","disabled");
	}
	resetAllInfo();
	var node = '{"targetproduct":"' + thisEnName + '"}';
	sendHTTPRequest(coocaaVersion+"/product/queryMKByTp", node, getMKByTPResult);
}
//查询功能
function page3Select(){
	var oTargetProduct = document.getElementById('page3_targetProduct').value;
	var node = '{"value":"' + oTargetProduct + '"}';
	console.log(node);
	sendHTTPRequest(coocaaVersion+"/targetproduct/queryByRegEx", node, searchResource);
}

//重置功能
function page3Reset() {
	console.log("点击了重置");
	document.getElementById("page3_targetProduct").value = "";
	page3Select(); //重置时是否需要重新查询，这个需要分析
}
//新增功能
function page3Add(){
	$("#page3_tp_submit").css("display","block");
	$("#page3_tp_submit2").css("display","inline-block");
	$('#page3Modal').modal();
	$('#page3Modal').attr("status","1");
	//0-编辑、1-复制、2-预览、3-新增
	$("#page3Modal").attr("part","3");
	document.getElementById("page3_TP").value = "";
	$("#page3_TP").removeAttr("disabled");
	resetAllInfo();
	console.log($('#page3Modal').attr("hasquery"));
	if ($('#page3Modal').attr("hasquery") == "false") {
		sendHTTPRequest(coocaaVersion+"/product/queryAll", '{}', allQueryResult);
	}else{
		console.log("已经请求过了");
		for (var i=0; i<$(".mkitems").length; i++) {
			document.getElementsByClassName("mkitems")[i].removeAttribute('disabled');
		}
		for (var i=0; i<$(".propitem").length; i++) {
			document.getElementsByClassName("propitem")[i].removeAttribute('disabled');
		}
	}
}
function resetAllInfo(){
	for (var k=0; k<$(".mkitems").length; k++) {
		document.getElementsByClassName("mkitems")[k].setAttribute("checked","");
		document.getElementsByClassName("mkitems")[k].checked = false;
	}
	document.getElementsByClassName("mkradio")[0].setAttribute('checked', '');
	document.getElementsByClassName("mkradio")[0].checked = true;
	
	for (var k=0; k<$(".propitem").length; k++) {
		$(".propitem:eq("+k+")").val($(".propitem:eq("+k+")").attr("defaultvalue"));
	}
	
	$("#page3Modal").find("li")[0].className = "presentation active";
	$("#page3Modal").find("li")[1].className = "presentation";
	$("#myPreviewBodyOne").attr("class", "tab-pane active");
	$("#myPreviewBodyTwo").attr("class", "tab-pane");
}

//页面加载时新增页的查询功能
function allQueryResult() {
	if(this.readyState == 4) {
		if(this.status == 200) {
			var data = JSON.parse(this.responseText);
            console.log(data);
            if(data.resultCode == 0){
				moduleQueryData1(data.resultData[5],data.resultData[1]);
				propQueryData1(data.resultData[6],data.resultData[3]);
				$('#page3Modal').attr("hasquery","true");
            }
		};
	}
}

function moduleQueryData1(arr1,arr2) {
	var _myMKBox = document.getElementById("page3MkTbody");
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
	document.getElementsByClassName("mkradio")[0].setAttribute('checked', '');
	document.getElementsByClassName("mkradio")[0].checked = true;
}

function propQueryData1(arr1,arr2) {
	var _myPropBox = document.getElementById("page3PropTbody");
	for(var i = 0; i < arr1.length; i++) {
		_myPropBox.innerHTML += '<div class="propitems eachpartbox" category="'+ arr1[i].category +'"><div class="grouptitle" title="'+arr1[i].category+'">'+arr1[i].category+'</div></div>';
	}
	var kk = 0;
	for (var j=0; j< $(".propitems").length; j++) {
		for(var i = 0; i < arr2.length; i++) {
			if(arr2[i].category == $(".propitems:eq(" + (j) + ")").attr("category")) {
				kk = i;
				propDataInsert(kk, $(".propitems")[j], arr2);
			}
		}
	}
}
//function modelQueryResult(){
function mkDataInsert(kk, obj, data) {
	if (data[kk].category == "PlayerLibrary") {
		obj.innerHTML += "<div class='col-xs-3'><input id='"+data[kk].engName+"' cnName='"+data[kk].cnName+"' type='radio' class='mkitems mkradio' value='' name='PlayerLibrary'><span category='" + data[kk].category + "' gitPath='" + data[kk].gitPath + "' name='" + data[kk].engName + "' title='" + data[kk].descText + "'>" + data[kk].cnName + "</span></div>";
	} else{
		obj.innerHTML += "<div class='col-xs-3'><input id='"+data[kk].engName+"' cnName='"+data[kk].cnName+"' type='checkbox' class='mkitems' value=''><span category='" + data[kk].category + "' gitPath='" + data[kk].gitPath + "' name='" + data[kk].engName + "' title='" + data[kk].descText + "'>" + data[kk].cnName + "</span></div>";
	}
}
function propDataInsert(kk, obj, data) {
	obj.innerHTML += "<div class='col-xs-6' style='margin-bottom:2px;'><span class='col-xs-6' title='"+data[kk].descText+"'>"+data[kk].engName+":</span><input class='col-xs-6 propitem' type='text' category='"+data[kk].category+"' descText='"+data[kk].descText+"' id='"+data[kk].engName+"' value='"+data[kk].defaultValue+"' defaultValue='"+data[kk].defaultValue+"' disabled></div>";
}
//模糊查询
function searchResource(){
	if(this.readyState == 4) {
		if(this.status == 200) {
			var data = JSON.parse(this.responseText);
			console.log(data);
			if(data.resultCode == "0") {
				var instantSearch2 = new Array();
				for (var i=0; i<data.resultData.length; i++) {
					var tpObjItem = {
						"number": "",
						"target_product": "",
						"operate": ""
					}
					tpObjItem.number = (i+1);
					tpObjItem.target_product = '<span class="eachtpvalue">'+data.resultData[i].name+'</span>';
					tpObjItem.operate = '<a class="eachedit" href="#"><span class="glyphicon glyphicon-pencil"></span></a><a class="eachdelete" href="#"><span class="glyphicon glyphicon-remove"></span></a><a class="eachcopy" href="#"><span class="glyphicon glyphicon-copy"></span></a><a class="eachpreview" href="#"><span class="glyphicon glyphicon glyphicon-eye-open"></span></a>';
					instantSearch2.push(tpObjItem);
				}
				pageTableInit(instantSearch2);
			}
		}
		buttonInitAfter();
	}
}

function tpsubmit(){
	var _tpValue = $("#page3_TP").val();;
	var _mkArray = [];
	for (var i=0; i<$(".mkitems").length; i++) {
		var _objItem = {
			"engName":""
		};
		if ($(".mkitems")[i].checked == true) {
			_objItem.engName =  $(".mkitems")[i].getAttribute("id");
			_mkArray.push(_objItem);
		}
	}
	_mkArray = JSON.stringify(_mkArray);
	var _propArray = [];
	for (var i=0; i<$(".propitem").length; i++) {
		var _objItem = {
			"engName": $(".propitem:eq("+i+")").val()
		};
		_propArray.push(_objItem);
	}
	_propArray = JSON.stringify(_propArray);
	
	if ($('#page3Modal').attr("status") == 1) {
		console.log("新增或者复制的提交");
		if (_tpValue == ""||_tpValue==null) {
			console.log("新增TP名不能为空");
			document.getElementById("page3Modal1ErrorInfo").style.display = "block";
			document.getElementById("page3Modal1ErrorInfo").innerHTML = "TargetProduct项不能为空！";
			setTimeout("document.getElementById('page3Modal1ErrorInfo').style.display = 'none';", 3000);
		} else{
			console.log(tpArray.indexOf(_tpValue));
			if (tpArray.indexOf(_tpValue) == "-1") {
				var node = '{"name":"'+_tpValue+'","arr":'+_mkArray+'","arr2":'+_propArray+'}';
				console.log(node);
				sendHTTPRequest(coocaaVersion+"/targetproduct/add", node, addOrChangeResult);
			} else{
				document.getElementById("page3Modal1ErrorInfo").style.display = "block";
				document.getElementById("page3Modal1ErrorInfo").innerHTML = "TargetProduct项已经存在！";
				setTimeout("document.getElementById('page3Modal1ErrorInfo').style.display = 'none';", 3000);
			}
		}
	} else{
		console.log("修改的提交");
		for (var i=0; i<$(".mkradio").length; i++) {
			if ($(".mkradio")[i].getAttribute('oldvalue') == 1) {
				radioNameTemp = $(".mkradio")[i].getAttribute('cnname');
				console.log(radioNameTemp);
			}
		}
		console.log(radioNameTemp +"---"+ oldRadioName +"---" + MKDeleteArray.length +"---" + MKAddArray.length +"---" + changeProp.length);
		if (radioNameTemp == oldRadioName&&MKAddArray.length==0&&MKDeleteArray.length==0&&changeProp.length==0) {
			console.log("未做修改");
			$("#page3Modal1ErrorInfo").css("display","block");
			$("#page3Modal1ErrorInfo").html("未做任何修改");
			setTimeout("document.getElementById('page3Modal1ErrorInfo').style.display = 'none';", 3000);
		} else{
			console.log("做了修改");
			$("#myEditEnsureDiv").css("display","block");
			//通过tp查找相关机芯机型
			var node = '{"targetproduct":"'+_tpValue+'"}';
			console.log(node);
			sendHTTPRequest(coocaaVersion+"/product/queryProductsByTp", node, searchResource2);
		}
	}
}
function searchResource2() {
	if(this.readyState == 4) {
		if(this.status == 200) {
			var data = JSON.parse(this.responseText);
			console.log(data);
			if(data.resultCode == "0") {
				if (data.resultData.length == 0) {
					$("#tptochipmodel").css("display","none");
					document.getElementById("productName").innerHTML = "该TargetProduct还未配置产品。";
				} else{
					var inneritem = "";
					for (var i=0; i<data.resultData.length; i++) {
						inneritem += '<div>机芯：'+data.resultData[i].chip+',机型：'+data.resultData[i].model+'</div>'; 
					}
					$("#tptochipmodel").css("display","block");
					document.getElementById("productName").innerHTML = inneritem;
				}
			}
		}
	}
}

function tpsubmit2(){
	console.log(MKAddArray);
	console.log(MKDeleteArray);
	var _tpValue = $("#page3_TP").val();;
	var _mkArray = [];
	for (var i=0; i<$(".mkitems").length; i++) {
		var _objItem = {
			"engName":""
		};
		if ($(".mkitems")[i].checked == true) {
			_objItem.engName =  $(".mkitems")[i].getAttribute("id");
			_mkArray.push(_objItem);
		}
	}
	_mkArray = JSON.stringify(_mkArray);
	
	var _propArray = [];
	for (var i=0; i<$(".propitem").length; i++) {
		var _objItem = {
			"engName": $(".propitem:eq("+i+")").val()
		};
		_propArray.push(_objItem);
	}
	_propArray = JSON.stringify(_propArray);
	var node = '{"name":"'+_tpValue+'","arr":'+_mkArray+'","arr2":'+_propArray+'}';
	console.log(node);
	sendHTTPRequest(coocaaVersion+"/targetproduct/update", node, addOrChangeResult);
}

function getMKByTPResult() {
	if(this.readyState == 4) {
		if(this.status == 200) {
			var data = JSON.parse(this.responseText);
			console.log(data);
			if(data.resultCode == "0") {
				var type = $('#page3Modal').attr("status");
				
				for (var i=0; i<data.resultData[1].length; i++) {
					document.getElementById(data.resultData[1][i].engName).value = data.resultData[1][i].curValue;
				}
				//0-编辑、1-复制、2-预览
				if(type == 2){
					console.log("预览");
					for (var i=0; i<$(".mkitems").length; i++) {
						$(".mkitems:eq("+i+")").attr("disabled","disabled");
						$(".mkitems:eq("+i+")").parent().css("display","none");
					}
					for (var i=0; i<$(".propitem").length; i++) {
						$(".propitem:eq("+i+")").attr("disabled","disabled");
					}
				}else{
					if (type == 0) {
						console.log("编辑");
						for (var i=0; i<$(".mkitems").length; i++) {
							$(".mkitems:eq("+i+")").removeAttr("disabled");
							$(".mkitems:eq("+i+")").attr("oldvalue","0");
							$(".mkitems:eq("+i+")").parent().css("display","block");
							if($(".mkitems:eq("+i+")").attr("type") == "radio"){
								$(".mkitems:eq("+i+")").attr("onchange","changeRadio(this)");
							}else{
								$(".mkitems:eq("+i+")").attr("onchange","changeMK(this)");
							}
						}
						for (var i=0; i<$(".propitem").length; i++) {
							$(".propitem:eq("+i+")").removeAttr("disabled");
							$(".propitem:eq("+i+")").attr("oldvalue",$(".propitem:eq("+i+")").val());
							$(".propitem:eq("+i+")").attr("onchange","changeProps(this)");
						}
					} else if(type == 1){
						console.log("复制");
						for (var i=0; i<$(".mkitems").length; i++) {
							$(".mkitems:eq("+i+")").removeAttr("disabled");
							$(".mkitems:eq("+i+")").removeAttr("onchange");
							$(".mkitems:eq("+i+")").parent().css("display","block");
						}
						for (var i=0; i<$(".propitem").length; i++) {
							$(".propitem:eq("+i+")").removeAttr("disabled");
							$(".propitem:eq("+i+")").removeAttr("onchange");
						}
					}
				}
				for (var i=0; i<data.resultData[0].length; i++) {
					document.getElementById(data.resultData[0][i].engName).setAttribute("checked","");
					document.getElementById(data.resultData[0][i].engName).checked = true;
					$("#"+data.resultData[0][i].engName).parent().css("display","block");
					if ($("#"+data.resultData[0][i].engName).attr("type") == "radio") {
						oldRadioName = $("#"+data.resultData[0][i].engName).attr("cnname");
						radioNameTemp = oldRadioName;
						$("#"+data.resultData[0][i].engName).attr("oldvalue","1");
					}
				}
				console.log(oldRadioName);
			}
		}
	}
}
function addOrChangeResult(){
	if(this.readyState == 4) {
		if(this.status == 200) {
			var data = JSON.parse(this.responseText);
			console.log(data);
			if(data.resultCode == "0") {
				$("#page3Modal").modal("hide");
				page3Fresh();
			}
		}
	}
}

function changeMK(obj){
	console.log(obj.checked+"--"+obj.getAttribute("oldvalue"));
    if (obj.checked && (obj.getAttribute("oldvalue") == '0')) {
    	console.log("增加");
        obj.setAttribute("oldvalue","1");
        MKAddArray.push(obj.getAttribute("cnName"));
    }else if(!(obj.checked) && (obj.getAttribute("oldvalue") == '0')){
    	console.log("删除");
        obj.setAttribute("oldvalue","2");
        MKDeleteArray.push(obj.getAttribute("cnName"));
    }else{
    	console.log("恢复");
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
        MKDeleteArray.remove(obj.getAttribute("cnName"));
        MKAddArray.remove(obj.getAttribute("cnName"));
    }
    console.log("增加"+MKAddArray);
    console.log("删除"+MKDeleteArray);
}
function changeRadio(obj){
	for (var i=0; i<$(".mkradio").length; i++) {
		$(".mkradio")[i].setAttribute('oldvalue', '0');
	}
	obj.setAttribute("oldvalue","1");
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

//刷新功能
function page3Fresh() {
	var htmlObject = parent.document.getElementById("tab_userMenu3");
	htmlObject.firstChild.src = "page3.html";
	
	var htmlObject2 = parent.document.getElementById("tab_userMenu2");
	if (htmlObject2) {
		htmlObject2.firstChild.src = "page2.html";
	}
}