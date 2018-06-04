document.write("<script language=javascript src='../js/sentHTTP.js' charset=\"utf-8\"></script>");

var coocaaVersion = "/v6.0";
var autoDataArray1 = new Array();
var autoDataArray2 = new Array();
var autoDataArray3 = new Array();
var freshNumber = "-1";

$(function() {
	sendHTTPRequest(coocaaVersion+"/device/queryAll", '{}' , QueryResult);
	
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
				var page6SocTd = document.getElementById("page6_soc_td");
				console.log(freshNumber);
				if (freshNumber == -1) {
					page6ChipTd .innerHTML = "";
					page6ModelTd .innerHTML = "";
					page6SocTd .innerHTML = "";
					
					for (var i=0; i<data.resultData[0].length; i++) {
						page6ChipTd.innerHTML += '<div class="col-xs-4 divitems"><a class="myeachchipa" part="1" name="'+data.resultData[0][i].name+'" title="'+data.resultData[0][i].name+'">'+data.resultData[0][i].name+'</a></div>';
						autoDataArray1.push(data.resultData[0][i].name);
					}
					for (var i=0; i<data.resultData[1].length; i++) {
						page6ModelTd.innerHTML += '<div class="col-xs-4 divitems"><a class="myeachmodela" part="2" name="'+data.resultData[1][i].name+'" title="'+data.resultData[1][i].name+'">'+data.resultData[1][i].name+'</a></div>';
						autoDataArray2.push(data.resultData[1][i].name);
					}
					for (var i=0; i<data.resultData[3].length; i++) {
						page6SocTd.innerHTML += '<div class="col-xs-4 divitems"><a class="myeachsoca" part="3" name="'+data.resultData[3][i].name+'" title="'+data.resultData[3][i].name+'">'+data.resultData[3][i].name+'</a></div>';
						autoDataArray3.push(data.resultData[3][i].name);
					}
				} else if (freshNumber == 0) {
					page6ChipTd .innerHTML = "";
					for (var i=0; i<data.resultData[0].length; i++) {
						page6ChipTd.innerHTML += '<div class="col-xs-4 divitems"><a class="myeachchipa" part="1" name="'+data.resultData[0][i].name+'" title="'+data.resultData[0][i].name+'">'+data.resultData[0][i].name+'</a></div>';
						autoDataArray1.push(data.resultData[0][i].name);
					}
				} else if (freshNumber == 1) {
					page6ModelTd .innerHTML = "";
					for (var i=0; i<data.resultData[1].length; i++) {
						page6ModelTd.innerHTML += '<div class="col-xs-4 divitems"><a class="myeachmodela" part="2" name="'+data.resultData[1][i].name+'" title="'+data.resultData[1][i].name+'">'+data.resultData[1][i].name+'</a></div>';
						autoDataArray2.push(data.resultData[1][i].name);
					}
				} else if (freshNumber == 2) {
					page6SocTd .innerHTML = "";
					for (var i=0; i<data.resultData[3].length; i++) {
						page6SocTd.innerHTML += '<div class="col-xs-4 divitems"><a class="myeachsoca" part="3" name="'+data.resultData[3][i].name+'" title="'+data.resultData[3][i].name+'">'+data.resultData[3][i].name+'</a></div>';
						autoDataArray3.push(data.resultData[3][i].name);
					}
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
		}
		$('#page6Modal').modal();
		$("#page6Submit").attr("oldValue","");
		$("#myPreviewModalLabel").html("新增");
		document.getElementById("page6Container").value = "";
		$(".modal-backdrop").addClass("new-backdrop");
	});
	
	var _curIndex = "";
	$("legend .page6_tab").click(function(){
		_curIndex = $(".page6_tab").index($(this));
		console.log(_curIndex);
		$("#page6Submit").attr("part1",(_curIndex+1));
		for (var k=0;k<$(".page6_tab").length; k++) {
			$(".page_boxes")[k].style.display = "none";
			$(".page6_tab")[k].style.backgroundColor = "buttonface";
		}
		$(".page_boxes")[_curIndex].style.display = "block";
		$(".page6_tab")[_curIndex].style.backgroundColor = "darkturquoise";
	});
	$("#page6ModeClose").click(function(){
		document.getElementById("page6Container").value = "";
		$("#page6Modal").modal("hide");
	});
	
	$("#myEditEnsure").click(function(){
		console.log("点击了修改后弹出确认框的提交");
		changeEnsureFuc();
	});
	$("#myEditCancle").click(function(){
		$("#myEditEnsureDiv").css("display","none");
	});
	$("#myEditEnsureX").click(function(){
		$("#myEditEnsureDiv").css("display","none");
	});
}

function page6ButtonInitAfter(){
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
		_newValue = _newValue.replace(/\s*/g,"");
		console.log(_newValue);
		if (_newValue == null ||_newValue.length == 0) {
			console.log("输入项不能为空");
			document.getElementById("editErrorInfo").style.display = "inline-block";
			setTimeout("document.getElementById('editErrorInfo').style.display = 'none';", 3000);
		} else{
			page6SubmitState(_oldValue,_newValue,_curPart1,_curPart2);
		}
	});
}

function editpage4Modal(type,num,obj,name){
	$("#myPreviewModalLabel").html("编辑");
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
				$("#myEditEnsureDiv").css("display","block");
				var searchObj = {
					"chip" : "",
					"model" : "",
					"targetProduct" : "",
					"memory" : "",
					"version" : "",
					"soc" : "",
					"EMMC" : "",
					"gitBranch" : "",
				}
				if (part1 == 1) {
					searchObj.chip = oValue;
				}else if(part1 == 2) {
					searchObj.model = oValue;
				}else if(part1 == 3) {
					searchObj.soc = oValue;
				}
				var _search = JSON.stringify(searchObj);
				var node = '{"data":' + _search + '}';
				console.log(node);
				sendHTTPRequest(coocaaVersion+"/product/queryByRegEx", node, searchResource);
			}
		}
	} else{
		if (_index1!=-1||_index2!=-1||_index3!=-1) {
			$("#chipMangInfo").css("display","block");
			$("#chipMangInfo").html("该名称已经存在。");
			setTimeout("document.getElementById('chipMangInfo').style.display = 'none';", 3000);
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
}

function searchResource() {
	if(this.readyState == 4) {
		if(this.status == 200) {
			var data = JSON.parse(this.responseText);
			console.log(data);
			if(data.resultCode == "0") {
				$("#myEditEnsureDiv").css("display","block");
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

function changeEnsureFuc(){
	console.log("in changeEnsureFuc。");
	var _oldValue = $("#page6Submit").attr("oldValue");
	var _newValue = $("#page6Container").val();
	var _curPart1 = $("#page6Submit").attr("part1");
	console.log(_oldValue);
	console.log(_newValue);
	console.log(_curPart1);
	var node = '{"newValue":"'+_newValue+'","oldValue":"'+_oldValue+'"}';
	if (_curPart1 == 1) {
		console.log("修改+机芯+提交");
		sendHTTPRequest(coocaaVersion+"/chip/update", node, addOrChangeResult);
	} else if(_curPart1 == 2) {
		console.log("修改+机型+提交");
		sendHTTPRequest(coocaaVersion+"/model/update", node, addOrChangeResult);
	} else if(_curPart1 == 3){
		console.log("修改+芯片型号+提交");
		sendHTTPRequest(coocaaVersion+"/soc/update", node, addOrChangeResult);
	}
}

function addOrChangeResult(){
	if(this.readyState == 4) {
		if(this.status == 200) {
			var data = JSON.parse(this.responseText);
			console.log(data);
			if(data.resultCode == "0") {
				console.log("数据提交成功");
				$("#myEditEnsureDiv").css("display","none");
				$("#page6Modal").modal('hide');
				var _curPart1 = $("#page6Submit").attr("part1");
				freshNumber == _curPart1;
				sendHTTPRequest(coocaaVersion+"/device/queryAll", '{}' , QueryResult);
				page6freshHtml(1);
			}else{
				document.getElementById("chipMangInfo").innerHTML = "修改失败！该机型或已存在。";
				setTimeout("document.getElementById('chipMangInfo').innerHTML='　'",3000);
			}
		}
	}
}

/*刷新页面*/
function page6freshHtml(num) {
	if (num == 0) {
		var htmlObject = parent.document.getElementById("tab_userMenu6");
		htmlObject.firstChild.src = "page6.html";
	}else{
		var htmlObject1 = parent.document.getElementById("tab_userMenu1");
	    var htmlObject2 = parent.document.getElementById("tab_userMenu2");
	    var htmlObject4 = parent.document.getElementById("tab_userMenu4");
	    var htmlObject5 = parent.document.getElementById("tab_userMenu5");
	    if (htmlObject1) {
	        htmlObject1.firstChild.src = "page1.html";
	    }
	    if (htmlObject2) {
	    	htmlObject2.firstChild.src = "page2.html";
	    }
	    if (htmlObject4) {
	    	htmlObject4.firstChild.src = "page4.html";
	    }
	     if (htmlObject5) {
	    	htmlObject5.firstChild.src = "page5.html";
	    }
	}
}