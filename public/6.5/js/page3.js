document.write("<script language=javascript src='../js/sentHTTP.js' charset=\"utf-8\"></script>");

var autoComplete3 = "";
var CoocaaVersion = "/v6.5";

$(function() {
	var node = '{}';
	sendHTTPRequest(CoocaaVersion+"/targetproduct/query", node , QueryResult);
	
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
						"operate": "<a class='eachedit' href='#'><span class='glyphicon glyphicon-pencil'></span></a><a class='eachdelete' href='#'><span class='glyphicon glyphicon-remove'></span></a><a class='eachcopy' href='#'><span class='glyphicon glyphicon-copy'></span></a><a class='eachpreview' href='#'><span class='glyphicon glyphicon glyphicon-eye-open'></span></a>"
					}
					tpObjItem.number = (i+1);
					tpObjItem.target_product = '<span class="eachtpvalue">'+data.resultData[i].name+'</span>';
					tpObjItem.operate = '<a class="eachedit" href="#"><span class="glyphicon glyphicon-pencil"></span></a><a class="eachdelete" href="#"><span class="glyphicon glyphicon-remove"></span></a><a class="eachcopy" href="#"><span class="glyphicon glyphicon-copy"></span></a><a class="eachpreview" href="#"><span class="glyphicon glyphicon glyphicon-eye-open"></span></a>';
					instantSearch.push(tpObjItem);
				}
				pageTableInit(instantSearch);
			}
		}
		buttonInitAfter();
		var node = '{}';
		sendHTTPRequest(CoocaaVersion+"/module/queryCategory", node, modelQueryResult);
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
	
}

function buttonInitAfter(){
	//编辑
	$(".eachedit").click(function(){
		var _eachtpAIndex = $(".eachedit").index($(this));
		eachOperate(_eachtpAIndex, 0);
	});
	$(".eachcopy").click(function(){
		var _eachtpAIndex = $(".eachcopy").index($(this));
		eachOperate(_eachtpAIndex, 1);
	});
	
	$(".eachpreview").click(function(){
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
		var node = '{"targetproduct":"' + thisEnName + '"}';
		console.log(node);
		//sendHTTPRequest(CoocaaVersion+"/product/queryBytp", node, getMKByTPResult);
	});
}

function eachOperate(index,num){
	$('#page3Modal').modal();
	$(".modal-backdrop").addClass("new-backdrop");
	$('#page3Modal').attr("status","2");
	var thisEnName = $(".eachtpvalue")[index].innerText;
	var thisEnNameCut = "";
	if(thisEnName.length>10){
		thisEnNameCut = thisEnName.substring(0,10)+"...";  
	}else{
		thisEnNameCut = thisEnName;
	}
	console.log(thisEnName);
	document.getElementById("page3_TP").value = thisEnName;
	var node = '{"targetproduct":"' + thisEnName + '"}';
	sendHTTPRequest(CoocaaVersion+"/product/queryBytp", node, getMKByTPResult);
	
	if (num == 0) {
		console.log("编辑");//不能修改tp名称
		$("#page3_title").innerText = "编辑tp的名称";
	} else if(num==1){
		console.log("复制");//相当于新增
		$("#page3_title").innerText = "复制tp的名称";
	} else if(num==1){
		console.log("预览");//不让修改、不让提交
		$("#page3_title").innerText = "预览tp的名称";
	} 
}
//查询功能
function page3Select(){
	var oTargetProduct = document.getElementById('page3_targetProduct').value;
	var node = '{"value":"' + oTargetProduct + '"}';
	console.log(node);
	sendHTTPRequest(CoocaaVersion+"/targetproduct/queryByRegEx", node, searchResource);
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
		sendHTTPRequest(CoocaaVersion+"/module/queryCategory", node, modelQueryResult);
	}else{
		console.log("已经请求过了");
	}
}
function resetAllInfo(){
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
		var node = '{}';
		sendHTTPRequest(CoocaaVersion+"/module/query", node, modelQueryResult2);
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
				for (var i=0; i<$(".mkradio").length; i++) {
					document.getElementsByClassName("mkradio")[0].setAttribute('checked', 'true');
				}
			}
		}
		$('#page3Modal').attr("hasquery","true");
	}
}
function mkDataInsert(kk, obj, data) {
	if (data[kk].category == "PlayerLibrary") {
		obj.innerHTML += "<div class='col-xs-3'><input id='"+data[kk].engName+"' type='radio' class='mkitems mkradio' value='' name='PlayerLibrary'><span category='" + data[kk].category + "' gitPath='" + data[kk].gitPath + "' name='" + data[kk].engName + "' title='" + data[kk].descText + "'>" + data[kk].cnName + "</span></div>";
	} else{
		obj.innerHTML += "<div class='col-xs-3'><input id='"+data[kk].engName+"' type='checkbox' class='mkitems' value=''><span category='" + data[kk].category + "' gitPath='" + data[kk].gitPath + "' name='" + data[kk].engName + "' title='" + data[kk].descText + "'>" + data[kk].cnName + "</span></div>";
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
						"operate": "<a class='eachedit' href='#'><span class='glyphicon glyphicon-pencil'></span></a><a class='eachdelete' href='#'><span class='glyphicon glyphicon-remove'></span></a><a class='eachcopy' href='#'><span class='glyphicon glyphicon-copy'></span></a><a class='eachpreview' href='#'><span class='glyphicon glyphicon glyphicon-eye-open'></span></a>"
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
	console.log($('#page3Modal').attr("status"));
	if ($('#page3Modal').attr("status") == 1) {
		console.log("新增+TP+提交");
		var _tpValue = $("#page3_TP").val();;
		console.log(_tpValue);
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
		console.log(_mkArray);
		if (_tpValue == ""||_tpValue==null) {
			console.log("新增TP名不能为空");
		} else{
			var node = '{"name":"'+_tpValue+'","arr":'+_mkArray+'}';
			console.log(node);
			sendHTTPRequest(CoocaaVersion+"/targetproduct/add", node, addOrChangeResult);
		}
	} else{
		console.log("修改+TP+提交");
		var node = '{"name":"'+_tpValue+'","oldValue":"'+_mkArray+'"}';
		console.log(node);
//		sendHTTPRequest(CoocaaVersion+"/targetproduct/update", node5, addOrChangeResult);
	}
}

function getMKByTPResult() {
	if(this.readyState == 4) {
		if(this.status == 200) {
			var data = JSON.parse(this.responseText);
			console.log(data);
			if(data.resultCode == "0") {
				resetAllInfo();
				for (var i=0; i<data.resultData.length; i++) {
					document.getElementById(data.resultData[i].engName).setAttribute('checked', 'true');
				}
			}
		}
	}
}