document.write("<script language=javascript src='../js/sentHTTP.js' charset=\"utf-8\"></script>");

var CoocaaVersion = "/v6.5";

$(function() {
	$(".page_boxes")[0].style.display = "block";
	$(".page6_tab")[0].style.color = "blue";
	
	var node1 = '{}';
	sendHTTPRequest(CoocaaVersion+"/device/queryAll", node1 , QueryResult);
	
	page6ButtonInitBefore();
});

function QueryResult(){
	if(this.readyState == 4) {
		if(this.status == 200) {
			var data = JSON.parse(this.responseText);
			console.log(data);
			if(data.resultCode == "0") {
				var page6ChipTd = document.getElementById("page6_chip_td");
				var page6ModelTd = document.getElementById("page6_model_td");
				var page6TpTd = document.getElementById("page6_targetProduct_td");
				var page6SocTd = document.getElementById("page6_soc_td");
				
				for (var i=0; i<data.resultData[0].length; i++) {
					page6ChipTd.innerHTML += '<div class="col-xs-4 divitems"><a class="myeachtpa" part="1" name="'+data.resultData[0][i].name+'" title="'+data.resultData[0][i].name+'">'+data.resultData[0][i].name+'</a></div>';
				}
				for (var i=0; i<data.resultData[1].length; i++) {
					page6ModelTd.innerHTML += '<div class="col-xs-4 divitems"><a class="myeachtpa" part="2" name="'+data.resultData[1][i].name+'" title="'+data.resultData[1][i].name+'">'+data.resultData[1][i].name+'</a></div>';
				}
				for (var i=0; i<data.resultData[2].length; i++) {
					page6TpTd.innerHTML += '<div class="col-xs-4 divitems"><a class="myeachtpa" part="4" name="'+data.resultData[2][i].name+'" title="'+data.resultData[2][i].name+'">'+data.resultData[2][i].name+'</a></div>';
				}
				for (var i=0; i<data.resultData[3].length; i++) {
					page6SocTd.innerHTML += '<div class="col-xs-4 divitems"><a class="myeachtpa" part="3" name="'+data.resultData[3][i].name+'" title="'+data.resultData[3][i].name+'">'+data.resultData[3][i].name+'</a></div>';
				}
			}
		}
		page6ButtonInitAfter();
		var node = '{}';
		sendHTTPRequest(CoocaaVersion+"/module/queryCategory", node, modelQueryResult);
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
			$('#page6Modal2').attr("status","1");
			document.getElementById("page6_TP").value = "";
			resetAllInfo();
			console.log($('#page6Modal2').attr("hasquery"));
			if ($('#page6Modal2').attr("hasquery") == "false") {
				var node = '{}';
				sendHTTPRequest(CoocaaVersion+"/module/queryCategory", node, modelQueryResult);
			}else{
				console.log("已经请求过了");
			}
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
	
	$("#page6_tp_submit").click(function(){
		console.log("点击了TP的提交");
		tpsubmit();
	});
	$("#page6_tp_submit2").click(function(){
		console.log("点击了TP的提交");
		tpsubmit();
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
		}
	});
	
	$(".myeachtpa").click(function(){
		var _eachtpAIndex = $(".myeachtpa").index($(this));
		$('#page6Modal2').modal(); //显示新建与编辑机芯机型时的弹框
		$(".modal-backdrop").addClass("new-backdrop");
		$('#page6Modal2').attr("status","2");
		var thisEnName = $(".myeachtpa")[_eachtpAIndex].title;
		var thisEnNameCut = "";
		if(thisEnName.length>10){
			thisEnNameCut = thisEnName.substring(0,10)+"...";  
		}else{
			thisEnNameCut = thisEnName;
		}
		console.log(thisEnName);
		document.getElementById("page6_TP").value = thisEnName;
		
		var node = '{"targetproduct":"' + thisEnName + '"}';
		sendHTTPRequest(CoocaaVersion+"/product/queryBytp", node, getMKByTPResult);
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
				sendHTTPRequest(CoocaaVersion+"/chip/update", node5, addOrChangeResult);
			} else{
				console.log("新增+机芯+提交"+_newValue);
				node5 = '{"name":"'+_newValue+'"}';
				console.log(node5);
				sendHTTPRequest(CoocaaVersion+"/chip/add", node5, addOrChangeResult);
			}
		}else if(_curPart2 == 2){
			if (_oldValue.length>1) {
				console.log("修改+机型+提交");
				node5 = '{"newValue":"'+_newValue+'","oldValue":"'+_oldValue+'"}';
				console.log(node5);
				sendHTTPRequest(CoocaaVersion+"/model/update", node5, addOrChangeResult);
			} else{
				console.log("新增+机型+提交");
				node5 = '{"name":"'+_newValue+'"}';
				console.log(node5);
				sendHTTPRequest(CoocaaVersion+"/model/add", node5, addOrChangeResult);
			}
		}else if(_curPart2 == 3){
			if (_oldValue.length>1) {
				console.log("修改+芯片型号+提交");
				node5 = '{"newValue":"'+_newValue+'","oldValue":"'+_oldValue+'"}';
				console.log(node5);
				sendHTTPRequest(CoocaaVersion+"/soc/update", node5, addOrChangeResult);
			} else{
				console.log("新增+芯片型号+提交");
				node5 = '{"name":"'+_newValue+'"}';
				console.log(node5);
				sendHTTPRequest(CoocaaVersion+"/soc/add", node5, addOrChangeResult);
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
				page6freshHtml();
			}else{
				document.getElementById("chipMangInfo").innerHTML = "修改失败！该机型或已存在。";
				setTimeout("document.getElementById('chipMangInfo').innerHTML='　'",3000);
			}
		}
	}
}

function modelQueryResult(){
	if(this.readyState == 4) {
		if(this.status == 200) {
			var data = JSON.parse(this.responseText);
			console.log(data);
			if(data.resultCode == "0") {
				var _myMKBox = document.getElementById("page6MkTbody");
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
		$('#page6Modal2').attr("hasquery","true");
	}
}

function mkDataInsert(kk, obj, data) {
	if (data[kk].category == "PlayerLibrary") {
		obj.innerHTML += "<div class='col-xs-3'><input id='"+data[kk].engName+"' type='radio' class='mkitems mkradio' value='' name='PlayerLibrary'><span category='" + data[kk].category + "' gitPath='" + data[kk].gitPath + "' name='" + data[kk].engName + "' title='" + data[kk].descText + "'>" + data[kk].cnName + "</span></div>";
	} else{
		obj.innerHTML += "<div class='col-xs-3'><input id='"+data[kk].engName+"' type='checkbox' class='mkitems' value=''><span category='" + data[kk].category + "' gitPath='" + data[kk].gitPath + "' name='" + data[kk].engName + "' title='" + data[kk].descText + "'>" + data[kk].cnName + "</span></div>";
	}
}

function tpsubmit(){
	console.log($('#page6Modal2').attr("status"));
	if ($('#page6Modal2').attr("status") == 1) {
		console.log("新增+TP+提交");
		var _tpValue = $("#page6_TP").val();;
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
		var node = '{"name":"'+_tpValue+'","arr":'+_mkArray+'}';
		console.log(node);
		sendHTTPRequest(CoocaaVersion+"/targetproduct/add", node, addOrChangeResult);
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


/*刷新页面*/
function page6freshHtml() {
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