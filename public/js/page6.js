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
		$(".modal-backdrop").addClass("new-backdrop");
		$("#page6Submit").attr("oldValue"," ");
		document.getElementById("page6Container").value = "";
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