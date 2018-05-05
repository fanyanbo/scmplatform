document.write("<script language=javascript src='../js/sentHTTP.js' charset=\"utf-8\"></script>");

$(function() {
	$(".page_boxes")[0].style.display = "block";
	$(".page6_tab")[0].style.color = "blue";
	
	var node1 = '{}';
	sendHTTPRequest("/chip/query", node1 , chipQueryResult);
	
	page6ButtonInitBefore();
});

function chipQueryResult(){
	if(this.readyState == 4) {
		if(this.status == 200) {
			var data = JSON.parse(this.responseText);
			console.log(data);
			var page6ChipTd = document.getElementById("page6_chip_td");
			if(data.resultCode == "0") {
				for (var i=0; i<data.resultData.length; i++) {
					page6ChipTd.innerHTML += '<div class="col-xs-4 divitems"><a class="myeacha" part="1" name="'+data.resultData[i].name+'" title="'+data.resultData[i].name+'">'+data.resultData[i].name+'</a></div>';
				}
			}
		}
		var node2 = '{}';
		sendHTTPRequest("/model/query", node2, modelQueryResult);
	}
}
function modelQueryResult(){
	if(this.readyState == 4) {
		if(this.status == 200) {
			var data = JSON.parse(this.responseText);
			console.log(data);
			var page6ModelTd = document.getElementById("page6_model_td");
			if(data.resultCode == "0") {
				for (var i=0; i<data.resultData.length; i++) {
					page6ModelTd.innerHTML += '<div class="col-xs-4 divitems"><a class="myeacha" part="2" name="'+data.resultData[i].name+'" title="'+data.resultData[i].name+'">'+data.resultData[i].name+'</a></div>';
				}
			}
		}
		var node3 = '{}';
		sendHTTPRequest("/soc/query", node3, socQueryResult);
	}
}
function socQueryResult(){
	if(this.readyState == 4) {
		if(this.status == 200) {
			var data = JSON.parse(this.responseText);
			console.log(data);
			var page6SocTd = document.getElementById("page6_soc_td");
			if(data.resultCode == "0") {
				for (var i=0; i<data.resultData.length; i++) {
					page6SocTd.innerHTML += '<div class="col-xs-4 divitems"><a class="myeacha" part="3" name="'+data.resultData[i].name+'" title="'+data.resultData[i].name+'">'+data.resultData[i].name+'</a></div>';
				}
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
			var page6TpTd = document.getElementById("page6_targetProduct_td");
			if(data.resultCode == "0") {
				for (var i=0; i<data.resultData.length; i++) {
					page6TpTd.innerHTML += '<div class="col-xs-4 divitems"><a class="myeacha" part="4" name="'+data.resultData[i].name+'" title="'+data.resultData[i].name+'">'+data.resultData[i].name+'</a></div>';
				}
			}
		}
		page6ButtonInitAfter();
	}
}

function page6ButtonInitBefore() {
	var _curIndex0 = "";
	$(".page6AddBtns").click(function(){
		_curIndex0 = $(".page6AddBtns").index($(this));
		console.log(_curIndex0);
		var _curPart0 = $(".page6AddBtns:eq(" + _curIndex0 + ")").attr("part");
		console.log(_curPart0);
		if (_curPart0 == 4) {
			console.log("点击了targetProduct的增加按钮");
			$('#page6Modal2').modal();
			var node = '{}';
			sendHTTPRequest("/module/query", node, modelQueryResult2);
		} else{
			if(_curPart0 == 1){
				console.log("点击了机芯的增加按钮");
				document.getElementById("lableText").innerHTML = "输入新增机芯名称：";
			}else if(_curPart0 == 2){
				console.log("点击了机型的增加按钮");
				document.getElementById("lableText").innerHTML = "输入新增机型名称：";
			}else if(_curPart0 == 3){
				console.log("点击了芯片型号的增加按钮");
				document.getElementById("lableText").innerHTML = "输入新增芯片型号名称：";
			}else if(_curPart0 == 4){
				console.log("点击了targetProduct的增加按钮");
				document.getElementById("lableText").innerHTML = "输入新增TargetProduct名称：";
			}
			$('#page6Modal').modal();
			$("#page6Submit").attr("oldValue"," ");
			document.getElementById("page6Container").value = "";
		}
		$(".modal-backdrop").addClass("new-backdrop");
	});
	
	var _curIndex = "";
	$("legend .page6_tab").click(function(){
		_curIndex = $(".page6_tab").index($(this));
		console.log(_curIndex);
		$("#page6Submit").attr("part1",(_curIndex+1));
		for (var k=0;k<$(".page6_tab").length; k++) {
			$(".page_boxes")[k].style.display = "none";
			$(".page6_tab")[k].style.color = "black";
		}
		$(".page_boxes")[_curIndex].style.display = "block";
		$(".page6_tab")[_curIndex].style.color = "blue";
	});
}

function page6ButtonInitAfter(){
	var _eachAIndex = "";
	var _curPart = "";
	$(".myeacha").click(function(){
		_eachAIndex = $(".myeacha").index($(this));
		_curPart = $(".myeacha:eq(" + _eachAIndex + ")").attr("part");
		console.log(_curPart);
		$('#page6Modal').modal(); //显示新建与编辑机芯机型时的弹框
		$(".modal-backdrop").addClass("new-backdrop");
		$("#page6Submit").attr("oldValue",$(".myeacha:eq(" + _eachAIndex + ")").attr("name"));
		var thisEnName = $(".myeacha")[_eachAIndex].title;
		var thisEnNameCut = "";
		if(thisEnName.length>10){
			thisEnNameCut = thisEnName.substring(0,10)+"...";  
		}else{
			thisEnNameCut = thisEnName;
		}
		if(_curPart == 1){
			$("#lableText").html("将机芯 <span title='"+thisEnName+"'>"+thisEnNameCut+"</span> 的名称改为：");
		}else if(_curPart == 2){
			$("#lableText").html("将机型 <span title='"+thisEnName+"'>"+thisEnNameCut+"</span> 的名称改为：");
		}else if(_curPart == 3){
			$("#lableText").html("将芯片型号 <span title='"+thisEnName+"'>"+thisEnNameCut+"</span> 的名称改为：");
		}else if(_curPart == 4){
			$("#lableText").html("将TP<span title='"+thisEnName+"'>"+thisEnNameCut+"</span> 的名称改为：");
		}
	});
	
	$("#page6Submit").click(function(){
		var _curPart2 = $("#page6Submit").attr("part1");
		var _oldValue = $("#page6Submit").attr("oldValue");
		var _newValue = $("#page6Container").val();
		console.log(_oldValue+"-------------"+_newValue);
		console.log(_curPart2+"-------------"+_oldValue.length);
		var node5 = '';
		if(_curPart2 == 1){
			if (_oldValue.length>1) {
				console.log("修改+机芯+提交");
				node5 = '{"newValue":"'+_newValue+'","oldValue":"'+_oldValue+'"}';
				console.log(node5);
				sendHTTPRequest("/chip/update", node5, addOrChangeResult);
			} else{
				console.log("新增+机芯+提交"+_newValue);
				node5 = '{"name":"'+_newValue+'"}';
				console.log(node5);
				sendHTTPRequest("/chip/add", node5, addOrChangeResult);
			}
		}else if(_curPart2 == 2){
			if (_oldValue.length>1) {
				console.log("修改+机型+提交");
				node5 = '{"newValue":"'+_newValue+'","oldValue":"'+_oldValue+'"}';
				console.log(node5);
				sendHTTPRequest("/model/update", node5, addOrChangeResult);
			} else{
				console.log("新增+机型+提交");
				node5 = '{"name":"'+_newValue+'"}';
				console.log(node5);
				sendHTTPRequest("/model/add", node5, addOrChangeResult);
			}
		}else if(_curPart2 == 3){
			if (_oldValue.length>1) {
				console.log("修改+芯片型号+提交");
				node5 = '{"newValue":"'+_newValue+'","oldValue":"'+_oldValue+'"}';
				console.log(node5);
				sendHTTPRequest("/soc/update", node5, addOrChangeResult);
			} else{
				console.log("新增+芯片型号+提交");
				node5 = '{"name":"'+_newValue+'"}';
				console.log(node5);
				sendHTTPRequest("/soc/add", node5, addOrChangeResult);
			}
		}else if(_curPart2 == 4){
			if (_oldValue.length>1) {
				console.log("修改+TP+提交");
				node5 = '{"newValue":"'+_newValue+'","oldValue":"'+_oldValue+'"}';
				console.log(node5);
				sendHTTPRequest("/targetproduct/update", node5, addOrChangeResult);
			} else{
				console.log("新增+TP+提交");
				node5 = '{"name":"'+_newValue+'"}';
				console.log(node5);
				sendHTTPRequest("/targetproduct/add", node5, addOrChangeResult);
			}
		}
	});
}

function addOrChangeResult(){
	if(this.readyState == 4) {
		if(this.status == 200) {
			var data = JSON.parse(this.responseText);
			console.log(data);
			if(data.resultCode == "0") {
				console.log("数据提交成功");
				console.log("关闭弹窗，刷新父页面");
				$("#myConfigAddChangeModal").modal('hide');
				freshHtml();
			}else{
				document.getElementById("chipMangInfo").innerHTML = "修改失败！该机型或已存在。";
				setTimeout("document.getElementById('chipMangInfo').innerHTML='　'",3000);
			}
		}
	}
}

function modelQueryResult2(){
	if(this.readyState == 4) {
		if(this.status == 200) {
			var data = JSON.parse(this.responseText);
			console.log(data);
			if(data.resultCode == "0") {
				moduleQueryData(data.resultData);
			}
		}
	}
}
function moduleQueryData(data) {
	console.log(data);
	var kk = 0;
	var checkId = 0;
	var firstChecked = "";
	var _rowAddPageApp = document.getElementById("page6MkApp");
	var _rowAddPageService = document.getElementById("page6MkService");
	var _rowAddPageAppStore = document.getElementById("page6MkAppStore");
	var _rowAddPageHomePage = document.getElementById("page6MkHomePage");
	var _rowAddPageIME = document.getElementById("page6MkIME");
	var _rowAddPageSysApp = document.getElementById("page6MkSysApp");
	var _rowAddPageTV = document.getElementById("page6MkTV");
	var _rowAddPageOther = document.getElementById("page6MkOther");
	var _rowAddPagePlayerLibrary = document.getElementById("page6MkPlayerLibrary");
	_rowAddPageApp.innerHTML = "<div title='App'>App:</div>";
	_rowAddPageService.innerHTML = "<div title='Service'>Service:</div>";
	_rowAddPageAppStore.innerHTML = "<div title='AppStore'>AppStore:</div>";
	_rowAddPageHomePage.innerHTML = "<div title='HomePage'>HomePage:</div>";
	_rowAddPageIME.innerHTML = "<div title='IME'>IME:</div>";
	_rowAddPageSysApp.innerHTML = "<div title='SysApp'>SysApp:</div>";
	_rowAddPageTV.innerHTML = "<div title='TV'>TV:</div>";
	_rowAddPageOther.innerHTML = "<div title='Other'>Other:</div>";
	_rowAddPagePlayerLibrary.innerHTML = "<div title='PlayerLibrary'>PlayerLibrary:</div>";

	for(var i = 0; i < data.length; i++) {
		console.log("lxw " + data[i].category);
		if(data[i].category == "App") {
			kk = i;
			mkDataInsert(kk, _rowAddPageApp, data);
		} else if(data[i].category == "Service") {
			kk = i;
			mkDataInsert(kk, _rowAddPageService, data);
		} else if(data[i].category == "AppStore") {
			kk = i;
			mkDataInsert(kk, _rowAddPageAppStore, data);
		} else if(data[i].category == "HomePage") {
			kk = i;
			mkDataInsert(kk, _rowAddPageHomePage, data);
		} else if(data[i].category == "IME") {
			kk = i;
			mkDataInsert(kk, _rowAddPageIME, data);
		} else if(data[i].category == "SysApp") {
			kk = i;
			if(data[i].engName == "SkyMirrorPlayer") {
				_rowAddPageSysApp.innerHTML += "<div class='col-xs-3'><input type='checkbox' value='' disabled><span category='" + data[kk].category + "' gitPath='" + data[kk].gitPath + "' name='" + data[kk].engName + "' title='" + data[kk].descText + "'>" + data[kk].cnName + "</span></div>";
			} else {
				mkDataInsert(kk, _rowAddPageSysApp, data);
			}
		} else if(data[i].category == "TV") {
			kk = i;
			mkDataInsert(kk, _rowAddPageTV, data);
		} else if(data[i].category == "Other") {
			kk = i;
			mkDataInsert(kk, _rowAddPageOther, data);
		} else if(data[i].category == "PlayerLibrary") {
			checkId++;
			kk = i;
			if(checkId == 1) {
				firstChecked = "page2Checked" + data[kk].id;
			}
			_rowAddPagePlayerLibrary.innerHTML += "<div class='col-xs-3'><input type='radio' name='PlayerLibrary' id='page2Checked" + data[kk].id + "' value=''><span category='" + data[kk].category + "' gitPath='" + data[kk].gitPath + "' name='" + data[kk].engName + "' title='" + data[kk].descText + "'>" + data[kk].cnName + "</span></div>";
			document.getElementById(firstChecked).setAttribute('checked', '');
		}
	}
}
function mkDataInsert(kk, obj, data) {
	obj.innerHTML += "<div class='col-xs-3'><input type='checkbox' value=''><span category='" + data[kk].category + "' gitPath='" + data[kk].gitPath + "' name='" + data[kk].engName + "' title='" + data[kk].descText + "'>" + data[kk].cnName + "</span></div>";
}
/*刷新页面*/
function freshHtml() {
	var htmlObject = parent.document.getElementById("tab_userMenu6");
	console.log("lxw " + htmlObject.firstChild.src);
	htmlObject.firstChild.src = "page6.html";
	
//  var indexObject = parent.document.getElementById("home");
//  var iframe = indexObject.getElementsByTagName("iframe");
//  iframe[0].src = "wait.html";
//  if(parent.document.getElementById("tab_userMenu2")){
//	    var htmlObject1 = parent.document.getElementById("tab_userMenu2");
//	    htmlObject1.firstChild.src = "review.html";
//	}    
}