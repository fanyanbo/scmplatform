document.write("<script language=javascript src='../js/sentHTTP.js' charset=\"utf-8\"></script>");

var coocaaVersion = "/v6.0";
var autoDataArray1 = new Array();
var autoDataArray2 = new Array();
var autoDataArray3 = new Array();

$(function() {
	$(".page_boxes")[0].style.display = "block";
	$(".page6_tab")[0].style.color = "blue";
	
	var node1 = '{}';
	sendHTTPRequest(coocaaVersion+"/device/queryAll", node1 , QueryResult);
	
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
					page6ChipTd.innerHTML += '<div class="col-xs-4 divitems"><a class="myeachchipa" part="1" name="'+data.resultData[0][i].name+'" title="'+data.resultData[0][i].name+'">'+data.resultData[0][i].name+'</a></div>';
					autoDataArray1.push(data.resultData[0][i].name);
				}
				for (var i=0; i<data.resultData[1].length; i++) {
					page6ModelTd.innerHTML += '<div class="col-xs-4 divitems"><a class="myeachmodela" part="2" name="'+data.resultData[1][i].name+'" title="'+data.resultData[1][i].name+'">'+data.resultData[1][i].name+'</a></div>';
					autoDataArray2.push(data.resultData[1][i].name);
				}
				for (var i=0; i<data.resultData[2].length; i++) {
					page6TpTd.innerHTML += '<div class="col-xs-4 divitems"><a class="myeachtpa" part="4" name="'+data.resultData[2][i].name+'" title="'+data.resultData[2][i].name+'">'+data.resultData[2][i].name+'</a></div>';
				}
				for (var i=0; i<data.resultData[3].length; i++) {
					page6SocTd.innerHTML += '<div class="col-xs-4 divitems"><a class="myeachsoca" part="3" name="'+data.resultData[3][i].name+'" title="'+data.resultData[3][i].name+'">'+data.resultData[3][i].name+'</a></div>';
					autoDataArray3.push(data.resultData[3][i].name);
				}
			}
		}
		page6ButtonInitAfter();
		var node = '{}';
		sendHTTPRequest(coocaaVersion+"/module/queryCategory", node, modelQueryResult);
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
				sendHTTPRequest(coocaaVersion+"/module/queryCategory", node, modelQueryResult);
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
			$("#page6Submit").attr("oldValue","");
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
	$("#page6ModeClose").click(function(){
		document.getElementById("page6Container").value = "";
		$("#page6Modal").modal("hide");
	});
}

function page6ButtonInitAfter(){
	var _eachAIndex = "";
	var _curPart = "";
	$(".myeachtpa").click(function(){
		var _index = $(".myeachtpa").index($(this));
		editTPmodal(_index);
	});
	$(".myeachchipa").click(function(){
		var _index = $(".myeachchipa").index($(this));
		editpage4Modal(1,_index,$(".myeachchipa"),"机芯");
	});
	$(".myeachmodela").click(function(){
		var _index = $(".myeachmodela").index($(this));
		editpage4Modal(2,_index,$(".myeachmodela"),"机型");
	});
	$(".myeachsoca").click(function(){
		var _index = $(".myeachsoca").index($(this));
		editpage4Modal(3,_index,$(".myeachsoca"),"芯片型号");
	});
	$("#page6Submit").click(function(){
		var _oldValue = $("#page6Submit").attr("oldValue");
		var _newValue = $("#page6Container").val();
		var _curPart1 = $("#page6Submit").attr("part1");
		var _curPart2 = _oldValue.length;
		page6SubmitState(_oldValue,_newValue,_curPart1,_curPart2);
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
		sendHTTPRequest(coocaaVersion+"/module/query", node, modelQueryResult2);
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
		sendHTTPRequest(coocaaVersion+"/targetproduct/add", node, addOrChangeResult);
	} else{
		console.log("修改+TP+提交");
		var node = '{"name":"'+_tpValue+'","oldValue":"'+_mkArray+'"}';
		console.log(node);
//		sendHTTPRequest(coocaaVersion+"/targetproduct/update", node5, addOrChangeResult);
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


function editTPmodal(num){
	$('#page6Modal2').modal(); //显示新建与编辑机芯机型时的弹框
	$(".modal-backdrop").addClass("new-backdrop");
	$('#page6Container').html("");
	$('#page6Modal2').attr("status","2");
	var thisEnName = $(".myeachtpa")[num].title;
	var thisEnNameCut = "";
	if(thisEnName.length>10){
		thisEnNameCut = thisEnName.substring(0,10)+"...";  
	}else{
		thisEnNameCut = thisEnName;
	}
	console.log(thisEnName);
	document.getElementById("page6_TP").value = thisEnName;
	var node = '{"targetproduct":"' + thisEnName + '"}';
	sendHTTPRequest(coocaaVersion+"/product/queryMKByTp", node, getMKByTPResult);
}

function editpage4Modal(type,num,obj,name){
	$('#page6Modal').modal(); //显示新建与编辑机芯机型时的弹框
	$(".modal-backdrop").addClass("new-backdrop");
	$("#page6Submit").attr("oldValue",obj[num].title);
	var thisEnName = obj[num].title;
	var thisEnNameCut = "";
	if(thisEnName.length>10){
		thisEnNameCut = thisEnName.substring(0,10)+"...";  
	}else{
		thisEnNameCut = thisEnName;
	}
	$("#lableText").html("将"+name+"<span title='"+thisEnName+"'>"+thisEnNameCut+"</span> 的名称改为：");
	$("#lableText").html("将"+name+"<span title='"+thisEnName+"'>"+thisEnNameCut+"</span> 的名称改为：");
	$("#lableText").html("将"+name+"<span title='"+thisEnName+"'>"+thisEnNameCut+"</span> 的名称改为：");
}

function page6SubmitState(oValue,nValue,part1,part2){
	var _index1 = autoDataArray1.indexOf(nValue);
	var _index2 = autoDataArray2.indexOf(nValue);
	var _index3 = autoDataArray3.indexOf(nValue);
	console.log(_index1+"|||"+_index2+"|||"+_index3);
	if (part2>0) {
		if (oValue == nValue) {
			$("#chipMangInfo").css("display","block");
			$("#chipMangInfo").html("该名称前后未做更改。");
			setTimeout("document.getElementById('chipMangInfo').style.display = 'none';", 3000);
		}else{
			if (_index1!=-1||_index2!=-1||_index3!=-1) {
				$("#chipMangInfo").css("display","block");
				$("#chipMangInfo").html("该名称已经存在。");
				setTimeout("document.getElementById('chipMangInfo').style.display = 'none';", 3000);
			} else{
				var node = '{"newValue":"'+nValue+'","oldValue":"'+oValue+'"}';
				if (part1 == 1) {
					console.log("修改+机芯+提交");
					sendHTTPRequest(coocaaVersion+"/chip/update", node, addOrChangeResult);
				} else if(part1 == 2) {
					console.log("修改+机型+提交");
					sendHTTPRequest(coocaaVersion+"/model/update", node, addOrChangeResult);
				} else if(part1 == 3){
					console.log("修改+芯片型号+提交");
					sendHTTPRequest(coocaaVersion+"/soc/update", node, addOrChangeResult);
				}
			}
		}
	} else{
		var node = '{"name":"'+nValue+'"}';
		if (part1 == 1) {
			console.log("新增+机芯+提交");
			sendHTTPRequest(coocaaVersion+"/chip/add", node, addOrChangeResult);
		} else if(part1 == 2) {
			console.log("新增+机型+提交");
			sendHTTPRequest(coocaaVersion+"/model/add", node, addOrChangeResult);
		} else if(part1 == 3){
			console.log("新增+芯片型号+提交");
			sendHTTPRequest(coocaaVersion+"/soc/add", node, addOrChangeResult);
		}
	}
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