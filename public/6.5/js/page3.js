document.write("<script language=javascript src='../js/sentHTTP.js' charset=\"utf-8\"></script>");

var autoComplete3 = "";
var tpArray = new Array();

var tpName = "";
var MKAddArray = new Array();
var MKDeleteArray = new Array();
var oldRadioName = "";
var radioNameTemp = "";
var coocaaVersion = "/v6.5";

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
				pageTableInit(instantSearch);
			}
		}
		var node = '{}';
		sendHTTPRequest(coocaaVersion+"/module/queryCategory", node, modelQueryResult);
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
//		page3Fresh();
	});
	$("#myEditEnsureX").click(function(){
		$("#myEditEnsureDiv").css("display","none");
//		page3Fresh();
	});
	$("#page3_tp_close").click(function(){
		$("#page3Modal").modal("hide");
		//page3Fresh();
	});
}
function buttonInitAfter(){
	$(".eachedit").click(function(){
		console.log("单项编辑");
		var _eachtpAIndex = $(".eachedit").index($(this));
		eachOperate(_eachtpAIndex, 0);
	});
	$(".eachcopy").click(function(){
		console.log("单项复制");
		var _eachtpAIndex = $(".eachcopy").index($(this));
		eachOperate(_eachtpAIndex, 1);
	});
	
	$(".eachpreview").click(function(){
		console.log("单项预览");
		var _eachtpAIndex = $(".eachpreview").index($(this));
		eachOperate(_eachtpAIndex, 2);
	});
	//删除eachdelete
	$(".eachdelete").click(function(){
		var _eachtpAIndex = $(".eachdelete").index($(this));
		var thisEnName = $(".eachtpvalue")[_eachtpAIndex].innerText;
		var thisEnNameCut = "";
		if(thisEnName.length>10){
			thisEnNameCut = thisEnName.substring(0,10)+"...";  
		}else{
			thisEnNameCut = thisEnName;
		}
		console.log(thisEnName);
		resetAllInfo();
		var node = '{"targetproduct":"' + thisEnName + '"}';
		console.log(node);
		sendHTTPRequest(coocaaVersion+"/product/queryMKByTp", node, getMKByTPResult);
	});
}

function eachOperate(index,num){
	$('#page3Modal').modal();
	$(".modal-backdrop").addClass("new-backdrop");
	$('#page3Modal').attr("status",num);
	
	if (num == 0) {
		$("#page3_title").html("编辑tp的名称");
	} else if(num==1){
		$("#page3_title").html("复制tp的名称");
	} else if(num==2){
		$("#page3_title").html("预览tp的名称");
	}
	
	var thisEnName = $(".eachtpvalue")[index].innerText;
	var thisEnNameCut = "";
	if(thisEnName.length>10){
		thisEnNameCut = thisEnName.substring(0,10)+"...";  
	}else{
		thisEnNameCut = thisEnName;
	}
	console.log(thisEnName);
	document.getElementById("page3_TP").value = thisEnName;
	
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
	$('#page3Modal').modal();
	$('#page3Modal').attr("status","1");
	document.getElementById("page3_TP").value = "";
	resetAllInfo();
	console.log($('#page3Modal').attr("hasquery"));
	if ($('#page3Modal').attr("hasquery") == "false") {
		var node = '{}';
		sendHTTPRequest(coocaaVersion+"/module/queryCategory", node, modelQueryResult);
	}else{
		console.log("已经请求过了");
		for (var i=0; i<$(".mkitems").length; i++) {
			document.getElementsByClassName("mkitems")[i].removeAttribute('disabled');
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
}
function modelQueryResult(){
	if(this.readyState == 4) {
		if(this.status == 200) {
			var data = JSON.parse(this.responseText);
			console.log(data);
			if(data.resultCode == "0") {
				var _myMKBox = document.getElementById("page3MkTbody");
				for(var i = 0; i < data.resultData.length; i++) {
					_myMKBox.innerHTML += '<div class="moduleitems eachpartbox" category="'+ data.resultData[i].category +'"><div class="grouptitle" title="'+data.resultData[i].category+'">'+data.resultData[i].category+'</div></div>';
				}
			}
		}
		sendHTTPRequest(coocaaVersion+"/module/query", '{}', modelQueryResult2);
	}
}
function modelQueryResult2(){
	if(this.readyState == 4) {
		if(this.status == 200) {
			var data = JSON.parse(this.responseText);
			console.log(data);
			if(data.resultCode == "0") {
				var arr2 = data.resultData;
				var kk = 0;
				for (var j=0; j< $(".moduleitems").length; j++) {
					for(var i = 0; i < arr2.length; i++) {
						if(arr2[i].category == $(".moduleitems:eq(" + (j) + ")").attr("category")) {
							kk = i;
							mkDataInsert(kk, $(".moduleitems")[j], arr2);
						}
					}
				}
//				for (var i=0; i<$(".mkradio").length; i++) {
					document.getElementsByClassName("mkradio")[0].setAttribute('checked', 'true');
//				}
			}
		}
		$('#page3Modal').attr("hasquery","true");
//		sendHTTPRequest(coocaaVersion+"/module/query", node, modelQueryResult2);
	}
}
function mkDataInsert(kk, obj, data) {
	if (data[kk].category == "PlayerLibrary") {
		obj.innerHTML += "<div class='col-xs-3'><input id='"+data[kk].engName+"' cnName='"+data[kk].cnName+"' type='radio' class='mkitems mkradio' value='' name='PlayerLibrary'><span category='" + data[kk].category + "' gitPath='" + data[kk].gitPath + "' name='" + data[kk].engName + "' title='" + data[kk].descText + "'>" + data[kk].cnName + "</span></div>";
	} else{
		obj.innerHTML += "<div class='col-xs-3'><input id='"+data[kk].engName+"' cnName='"+data[kk].cnName+"' type='checkbox' class='mkitems' value=''><span category='" + data[kk].category + "' gitPath='" + data[kk].gitPath + "' name='" + data[kk].engName + "' title='" + data[kk].descText + "'>" + data[kk].cnName + "</span></div>";
	}
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
				var node = '{"name":"'+_tpValue+'","arr":'+_mkArray+'}';
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
		console.log(MKAddArray);
		console.log(MKDeleteArray);
		console.log(radioNameTemp +"---"+ oldRadioName);
		if (radioNameTemp == oldRadioName&&MKAddArray.length==0&&MKDeleteArray==0) {
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
	var node = '{"name":"'+_tpValue+'","arr":'+_mkArray+'}';
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
				//0-编辑、1-复制、2-预览
				for (var i=0; i<$(".mkitems").length; i++) {
					if (type == 0) {
						$(".mkitems:eq("+i+")").removeAttr("disabled");
						$(".mkitems:eq("+i+")").attr("oldvalue","0");
						if($(".mkitems:eq("+i+")").attr("type") == "radio"){
							$(".mkitems:eq("+i+")").attr("onchange","changeRadio(this)");
						}else{
							$(".mkitems:eq("+i+")").attr("onchange","changeMK(this)");
						}
					}else if(type == 1){
						$(".mkitems:eq("+i+")").removeAttr("disabled");
						$(".mkitems:eq("+i+")").removeAttr("onchange");
					}else if (type == 2) {
						$(".mkitems:eq("+i+")").attr("disabled","disabled");
					}
				}
				for (var i=0; i<data.resultData.length; i++) {
					document.getElementById(data.resultData[i].engName).setAttribute("checked","");
					document.getElementById(data.resultData[i].engName).checked = true;
					if ($("#"+data.resultData[i].engName).attr("type") == "radio") {
						oldRadioName = $("#"+data.resultData[i].engName).attr("cnname");
						$("#"+data.resultData[i].engName).attr("oldvalue","1");
						console.log(oldRadioName);
					}
				}
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

//刷新功能
function page3Fresh() {
	var htmlObject = parent.document.getElementById("tab_userMenu3");
	htmlObject.firstChild.src = "page3.html";
	
	var htmlObject2 = parent.document.getElementById("tab_userMenu2");
	if (htmlObject2) {
		htmlObject2.firstChild.src = "page2.html";
	}
}