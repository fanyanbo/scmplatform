document.write("<script language=javascript src='../js/sentHTTP.js' charset=\"utf-8\"></script>");

var sortCnArray = [];
var sortEnArray = [];
var coocaaVersion = "/v6.0";

$(function() {
	//$(".page9_boxes")[0].style.display = "block";
	$("#tabClickIndex").attr("curId","0");
	
	buttonInitBefore();
	//sendHTTPRequest(coocaaVersion+"/config/queryCategory", '{}', categoryQueryResult);
	sendHTTPRequest(coocaaVersion+"/module/queryCategory", '{}', categoryQueryResult);
});

function buttonInitBefore(){
	//大分类的点击
	$(".page9_tabs").click(function(){
		var _curIndex1 = $(".page9_tabs").index($(this));
		tabsClick(_curIndex1);
	});
	
	//大分类下的新增按钮的点击
	$(".page9_boxes .btn").click(function() {
		_bIndex = $(".page9_boxes .btn").index($(this));
		$('#page9Modal').modal();
		document.getElementById("page9Container").value = "";
		$("#page9Submit").attr("clickid",_bIndex);
		$(".modal-backdrop").addClass("new-backdrop");
	});
	//新增页面确定按钮的点击
	$("#page9Submit").click(function() {
		var _newValue = $("#page9Container").val();
		_newValue = _newValue.replace(/\s*/g,"");
		console.log(_newValue);
		if (_newValue == null ||_newValue.length == 0) {
			console.log("输入项不能为空");
			document.getElementById("chipMangInfo").style.display = "inline";
			document.getElementById("chipMangInfo").innerHTML = "此项不能为空";
			setTimeout("document.getElementById('chipMangInfo').style.display = 'none';", 3000);
		} else{
			addSubmit();
		}
	});
	//修改页面确定按钮的点击
	$("#page9_sortSave").click(function() {
		changeSubmit();
	});
}

function categoryQueryResult(){
	if(this.readyState == 4) {
		if(this.status == 200) {
			var data = JSON.parse(this.responseText);
			console.log(data);
			if(data.resultCode == "0") {
				var _curId = $("#tabClickIndex").attr("curId");
				console.log(_curId);
				editEachPage(_curId,data.resultData);
			}
		}
		buttonInitAfter();
	}
}
function buttonInitAfter(){
	$(".edit_box1").click(function(){
		var _ajaxUrl = "";
		var _node = "{}";
		var _curIndex = $(".edit_box1").index($(this));
		var _thisKey = $(".edit_box1")[_curIndex].getAttribute("tablename");
		var _curId = $("#tabClickIndex").attr("curId");
		console.log(_curIndex + "---" + _thisKey);
		if (_curId == 0) {
			_node = '{"category":"' + _thisKey + '"}';
			_ajaxUrl = coocaaVersion+"/module/queryByCategory";
			console.log(_node);
			sendHTTPRequest(_ajaxUrl, _node, queryByCategoryResult);
		} else if(_curId == 1){
			console.log("不让编辑");
			//_node = '{"category":"' + _thisKey + '"}';
			//_ajaxUrl = coocaaVersion+"/prop/queryByCategory";
		} else if(_curId == 2){
			_node = '{"category":"' + _thisKey + '"}';
			_ajaxUrl = coocaaVersion+"/config/queryByCategory";
			console.log(_node);
			sendHTTPRequest(_ajaxUrl, _node, queryByCategoryResult);
		} else if(_curId == 3||_curId == 4||_curId == 5||_curId == 6){
			var _thisLevel = $(".edit_box1")[_curIndex].getAttribute("level");
			_node = '{"category":"' + _thisKey + '","level":"' + _thisLevel + '"}';
			_ajaxUrl = coocaaVersion+"/settings/queryByCategory";
			console.log(_node);
			sendHTTPRequest(_ajaxUrl, _node, queryByCategoryResult);
		}
	});
}
function queryByCategoryResult(){
	if(this.readyState == 4) {
		if(this.status == 200) {
			var data = JSON.parse(this.responseText);
			console.log(data);
			if(data.resultCode == "0") {
				$(".headtr")[0].innerHTML = " ";
				$(".bodytr")[0].innerHTML = " ";
				sortCnArray = []; 
				sortEnArray = [];
				creatTableByData(data);
				$("#paged9_dialog_box1").modal("toggle");
			}
		}
	}
}

function addCategoryResult(){
	if(this.readyState == 4) {
		if(this.status == 200) {
			var data = JSON.parse(this.responseText);
			console.log(data);
			var _curId = $("#tabClickIndex").attr("curId");
			if(data.resultCode == "0") {
				console.log("数据添加成功。");
				$('#page9Modal').modal('hide');
				console.log("数据添加成功");
				if (_curId ==0||_curId==1||_curId==2) {
					$(".page9_tabs:eq("+_curId+")").attr("hasvalue","false");
				} else{
					$(".page9_tabs:eq(3)").attr("hasvalue","false");
					$(".page9_tabs:eq(4)").attr("hasvalue","false");
					$(".page9_tabs:eq(5)").attr("hasvalue","false");
					$(".page9_tabs:eq(6)").attr("hasvalue","false");
				}
				tabsClick(_curId);
				freshModuleAddHtml(1);
			}else{
				console.log(data.resultDesc);
				$("#chipMangInfo")[0].innerHTML = "数据添加失败！";
				setTimeout('$("#chipMangInfo")[0].innerHTML = "　"',3000);
			}
		}
	}
}

function editEachPage(num,array){
	console.log(num+"--------"+array);
	$(".page9_tabs:eq(" + (num) + ")").attr("hasvalue","true");
	if(num==0||num==2){
		$(".page9_tables")[num].innerHTML = "";
		var _eachTableItem = "";
		_eachTableItem = "<thead><tr><td class='col-xs-4'>序号</td><td class='col-xs-4'>分类名称</td><td class='col-xs-4'>操作</td></tr></thead><tbody>";
		for (var i=0; i<array.length; i++) {
			_eachTableItem += "<tr><td class='col-xs-4'>"+(i+1)+"</td><td class='col-xs-4'>"+array[i].category+"</td><td class='col-xs-4'><a class='edit_box1' tablename = "+array[i].category+">编辑</a></td></tr>";
		}
		$(".page9_tables")[num].innerHTML = _eachTableItem + "</tbody>";
	}else if(num == 1){
		var _eachTableItem = "";
		_eachTableItem = "<thead><tr><td class='col-xs-4'>序号</td><td class='col-xs-4'>分类名称</td><td class='col-xs-4'>操作</td></tr></thead><tbody>";
		for (var i=0; i<array.length; i++) {
			_eachTableItem += "<tr><td class='col-xs-4'>"+(i+1)+"</td><td class='col-xs-4'>"+array[i].category+"</td><td class='col-xs-4'><a href='javacript:void(0);' disabled='disabled' class='edit_box1' tablename = "+array[i].category+">编辑</a></td></tr>";
		}
		$(".page9_tables")[num].innerHTML = _eachTableItem + "</tbody>";
	}else if(num==3||num==4||num==5||num==6){
		var sysSettingArray = ["系统设置","信号源工具箱","卖场演示","中间件"];
		var _eachTableItem = "";
		$(".page9_tables")[num].innerHTML = "";
		var kk = 0;
		_eachTableItem = "<thead><tr><td class='col-xs-4'>序号</td><td class='col-xs-4'>分类名称</td><td class='col-xs-4'>操作</td></tr></thead><tbody>";
		for (var i=0; i<array.length; i++) {
			if (array[i].level1 == sysSettingArray[num-3]) {
				kk++;
				console.log(array[i].level3 == "");
				if (array[i].level3 == "") {
					console.log("level3为空。" + array[i].level2 +"---"+array[i].level3);
					_eachTableItem += "<tr><td class='col-xs-4'>"+kk+"</td><td class='col-xs-4'>"+array[i].level2+"</td><td class='col-xs-4'><a class='edit_box1' level = 'level2' tablename = "+array[i].level2+">编辑</a></td></tr>";
				} else{
					console.log("level3不为空。" + array[i].level2 +"---"+array[i].level3);
					_eachTableItem += "<tr><td class='col-xs-4'>"+kk+"</td><td class='col-xs-4'>"+array[i].level2+"-"+array[i].level3+"</td><td class='col-xs-4'><a class='edit_box1' level = 'level3' tablename = "+array[i].level3+">编辑</a></td></tr>";
				}
			}
		}
		$(".page9_tables")[num].innerHTML = _eachTableItem + "</tbody>";
	}
}

function creatTableByData(data){
	var tableCnArray = new Array();
	var tableEnArray = new Array();
	var tableOrderId = new Array();
	var _thisHeadTh = "";
	var _thisbody = "";
	var _thisbodyTr = "<tr>";
	var _optionItem = "";
	
	for (var i=0; i<data.resultData.length; i++) {
		_optionItem += "<option value="+(i+1)+">"+(i+1)+"</option>";
		tableOrderId.push(data.resultData[i].orderId);
		tableCnArray.push(data.resultData[i].cnName);
		tableEnArray.push(data.resultData[i].engName);
	}
	console.log(tableOrderId);
	for (var ii=0; ii<data.resultData.length; ii++) {
		if((ii != 0 && (ii + 1) % 3 == 0) || ii == data.resultData.length - 1) {
			_thisbodyTr += "<td class='sequence'><select class='sequence_select'>"+_optionItem+"</select></td><td class='sequence_value' engName= "+data.resultData[ii].engName+"></td>" + "</tr><tr>";
		} else{
			_thisbodyTr += "<td class='sequence'><select class='sequence_select'>"+_optionItem+"</select></td><td class='sequence_value' engName= "+data.resultData[ii].engName+"></td>";
		}
	}
	for(var k=0; k<data.resultData.length; k++){
		if(k<3){
			_thisHeadTh += "<th type='number' class=''>序号</th><th type='string' class=''>配置项</th>";
		}
	}
	$(".headtr")[0].innerHTML = _thisHeadTh;
	$(".bodytr")[0].innerHTML = _thisbodyTr;
	dataSort(tableCnArray,tableEnArray);
}

function dataSort(CnData,EnData){
	var _inputLength = $(".sequence_select").length;
	console.log(_inputLength);
	for (var i=0; i<_inputLength; i++) {
		$(".sequence_select")[i].options[i].selected = true;
		$(".sequence_select")[i].setAttribute("oldvalue",(i+1));
		$(".sequence_value")[i].innerText = CnData[i];
		$(".sequence_value")[i].setAttribute("engName",EnData[i]);
		$(".sequence_select")[i].onchange = function(){
			var _oIndex = $(".sequence_select").index($(this));
			var _oldkey = $(".sequence_select")[_oIndex].getAttribute("oldvalue");
			var _oldvalue1 = CnData[_oldkey-1];
			var _oldvalue2 = EnData[_oldkey-1];
			var _newkey = $(".sequence_select")[_oIndex].value;
			CnData.splice(_oldkey-1,1);//删除指定对象
			EnData.splice(_oldkey-1,1);//删除指定对象
			CnData.splice(_newkey-1,0,_oldvalue1);//插入指定对象
			EnData.splice(_newkey-1,0,_oldvalue2);//插入指定对象
			$(".sequence_select")[_oIndex].setAttribute("oldvalue",_newkey);
			dataSort(CnData,EnData);
		}
	}
}

function addSubmit(){
	var ajaxUrl3 = "";
	var _curIndex3 = $("#page9Submit").attr("clickid");
	if (_curIndex3 == 0) {
		ajaxUrl3 = coocaaVersion+"/module/addCategory";
		var _category = $("#page9Container").val();
		var node33 = '{"category":"' + _category + '"}';
		console.log(node33);
		sendHTTPRequest(ajaxUrl3, node33, addCategoryResult);
	} else if(_curIndex3 == 1){
		ajaxUrl3 = coocaaVersion+"/prop/addCategory";
		var _category = $("#page9Container").val();
		var node33 = '{"category":"' + _category + '"}';
		console.log(node33);
		sendHTTPRequest(ajaxUrl3, node33, addCategoryResult);
	} else if(_curIndex3 == 2){
		ajaxUrl3 = coocaaVersion+"/config/addCategory";
		var _category = $("#page9Container").val();
		var node33 = '{"category":"' + _category + '"}';
		console.log(node33);
		sendHTTPRequest(ajaxUrl3, node33, addCategoryResult);
	} else if(_curIndex3 == 3||_curIndex3 == 4||_curIndex3 == 5||_curIndex3 == 6){
		ajaxUrl3 = coocaaVersion+"/sys/addCategory";
	}
}

function changeSubmit(){
	var _curId = $("#tabClickIndex").attr("curId");
	console.log(_curId);
	var _ajaxUrl = "";
	if (_curId == 0) {
		_ajaxUrl = coocaaVersion+"/module/updateItemsOrderId";
	} else if(_curId == 1){
		_ajaxUrl = coocaaVersion+"/prop/updateItemsOrderId";
	} else if(_curId == 2){
		_ajaxUrl = coocaaVersion+"/config/updateItemsOrderId";
	} else if(_curId == 3||_curId == 4||_curId == 5||_curId == 6){
		_ajaxUrl = coocaaVersion+"/settings/updateItemsOrderId";
	}
	var _node = [];
	for (var i=0; i<$(".sequence_value").length; i++) {
		var _objItem = {
			"engName":"",
			"orderId": ""
		};
		_objItem.engName =  $(".sequence_value")[i].getAttribute("engname");
		_objItem.orderId =  $(".sequence_select")[i].value;
		
		_node.push(_objItem);
	}
	_node = JSON.stringify(_node);
	var _node2 = '{"arr":' + _node + '}';
	console.log(_node2);
	sendHTTPRequest(_ajaxUrl, _node2, updateCategoryResult);
}

function updateCategoryResult(){
	if(this.readyState == 4) {
		if(this.status == 200) {
			var data = JSON.parse(this.responseText);
			console.log(data);
			var _curId = $("#tabClickIndex").attr("curId");
			if(data.resultCode == "0") {
				console.log("数据修改成功。");
				$('#paged9_dialog_box1').modal('hide');
				console.log("数据添加成功");
				if (_curId ==0||_curId==1||_curId==2) {
					$(".page9_tabs:eq("+_curId+")").attr("hasvalue","false");
				} else{
					$(".page9_tabs:eq(3)").attr("hasvalue","false");
					$(".page9_tabs:eq(4)").attr("hasvalue","false");
					$(".page9_tabs:eq(5)").attr("hasvalue","false");
					$(".page9_tabs:eq(6)").attr("hasvalue","false");
				}
				tabsClick(_curId);
				freshModuleAddHtml(1);
			}else{
				console.log(data.resultDesc);
				$("#chipMangInfo")[0].innerHTML = "数据添加失败！";
				setTimeout("document.getElementById('chipMangInfo').style.display = 'none';", 3000);
			}
		}
	}
}
function tabsClick(num){
	for (var k=0;k<$(".page9_tabs").length; k++) {
		$(".page9_boxes")[k].style.display = "none";
		$(".page9_tabs")[k].style.backgroundColor = "buttonface";
	}
	$(".page9_boxes")[num].style.display = "block";
	$(".page9_tabs")[num].style.backgroundColor = "darkturquoise";
	$("#tabClickIndex").attr("curId",num);
	
	var _hasValue = $(".page9_tabs:eq(" + (num) + ")").attr("hasvalue");
	console.log(_hasValue);
	if (_hasValue == "false") {
		var ajaxUrl = "";
		if (num == 0) {
			ajaxUrl = coocaaVersion+"/module/queryCategory";
		} else if(num == 1){
			ajaxUrl = coocaaVersion+"/prop/queryCategory";
		} else if(num == 2){
			ajaxUrl = coocaaVersion+"/config/queryCategory";
		} else if(num == 3||num == 4||num == 5||num == 6){
			ajaxUrl = coocaaVersion+"/settings/queryCategory";
		}
		sendHTTPRequest(ajaxUrl, '{}', categoryQueryResult);
	} else{
		console.log("已经获取过了");
	}
}

/*刷新页面*/
function freshModuleAddHtml(num) {
	if (num == 0) {
		var htmlObject = parent.document.getElementById("tab_userMenu9");
		htmlObject.firstChild.src = "page9.html";
	}else{
		var htmlObject1 = parent.document.getElementById("tab_userMenu1");
	    var htmlObject2 = parent.document.getElementById("tab_userMenu2");
	    var htmlObject3 = parent.document.getElementById("tab_userMenu3");
	    var htmlObject4 = parent.document.getElementById("tab_userMenu4");
	    var htmlObject5 = parent.document.getElementById("tab_userMenu5");
	    if (htmlObject1) {
	        htmlObject1.firstChild.src = "page1.html";
	    }
	    if (htmlObject2) {
	    	htmlObject2.firstChild.src = "page2.html";
	    }
	    if (htmlObject3) {
	    	htmlObject3.firstChild.src = "page3.html";
	    }
	    if (htmlObject4) {
	    	htmlObject4.firstChild.src = "page4.html";
	    }
	    if (htmlObject5) {
	    	htmlObject5.firstChild.src = "page5.html";
	    }
	}
}

function rebuildResult(){
	if(this.readyState == 4) {
		if(this.status == 200) {
			var data = JSON.parse(this.responseText);
			console.log(data);
			if(data.resultCode == "0") {
				alert("已经重新生成文件并开始提交gerrit.\n过几分钟再上gerrit上面查看提交结果\n如果提交不上去，可以考虑使用\"本地仓库清理复位修复\"");
			}
		}
	}
}

function resetResult(){
	if(this.readyState == 4) {
		if(this.status == 200) {
			var data = JSON.parse(this.responseText);
			console.log(data);
			if(data.resultCode == "0") {
				alert("本地仓库清理复位修复成功");
			}
		}
	}
}

function rebuildGerritByChipModel()
{
	var _ajaxUrl = "";
	var _node = "{}";
	
	var _chip = document.getElementById ("re1_chip").value;
	var _model = document.getElementById ("re1_model").value;
	var _panel = document.getElementById ("re1_panel").value;
	
	console.log("chip=" + _chip + ", model=" + _model + ", panel=" + _panel);
	
	_node = '{"chip":"' + _chip + '", "model":"' + _model + '", "panel":"' + _panel + '"}' ;
	_ajaxUrl = coocaaVersion + "/gerrit/ReGenerateByChipAndModel";
	console.log("call: " + _ajaxUrl);
	console.log(_node);
	sendHTTPRequest(_ajaxUrl, _node, rebuildResult);
}


function rebuildGerritByChip()
{
	var _ajaxUrl = "";
	var _node = "{}";
	
	var param = document.getElementById ("re2_chip").value;
	
	console.log("chip=" + param);
	
	_node = '{"chip":"' + param + '"}';
	_ajaxUrl = coocaaVersion + "/gerrit/ReGenerateByChip";
	console.log("call: " + _ajaxUrl);
	console.log(_node);
	sendHTTPRequest(_ajaxUrl, _node, rebuildResult);
}


function rebuildGerritByModel()
{
	var _ajaxUrl = "";
	var _node = "{}";
	
	var param = document.getElementById ("re3_model").value;
	
	console.log("model=" + param);
	
	_node = '{"model":"' + param + '"}';
	_ajaxUrl = coocaaVersion + "/gerrit/ReGenerateByModel";
	console.log("call: " + _ajaxUrl);
	console.log(_node);
	sendHTTPRequest(_ajaxUrl, _node, rebuildResult);
}

function rebuildGerritTargetProduct()
{
	var _ajaxUrl = "";
	var _node = "{}";
	
	var param = document.getElementById ("re4_tp").value;
	
	console.log("targetProduct=" + param);
	
	_node = '{"targetProduct":"' + param + '"}';
	_ajaxUrl = coocaaVersion + "/gerrit/ReGenerateByTargetProduct";
	console.log("call: " + _ajaxUrl);
	console.log(_node);
	sendHTTPRequest(_ajaxUrl, _node, rebuildResult);
}

function rebuildGerritALL()
{
	var _ajaxUrl = "";
	var _node = "{}";

	_ajaxUrl = coocaaVersion + "/gerrit/ReGenerateAll";
	console.log("call: " + _ajaxUrl);
	console.log(_node);
	sendHTTPRequest(_ajaxUrl, _node, rebuildResult);
}

function rebuildGerritReset()
{
	var _ajaxUrl = "";
	var _node = "{}";

	_ajaxUrl = coocaaVersion + "/gerrit/reset";
	console.log("call: " + _ajaxUrl);
	console.log(_node);
	sendHTTPRequest(_ajaxUrl, _node, resetResult);
}


