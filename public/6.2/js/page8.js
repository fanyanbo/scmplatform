document.write("<script language=javascript src='../js/sentHTTP.js' charset=\"utf-8\"></script>");

var sortCnArray = [];
var sortEnArray = [];

$(function() {
	$(".page8_boxes")[0].style.display = "block";
	$("#tabClickIndex").attr("curId");
	
	buttonInitBefore();
	var node1 = '{}';
	sendHTTPRequest("/config/queryCategory", node1, categoryQueryResult);
});

function buttonInitBefore(){
	//大分类的点击
	$(".page8_tabs").click(function(){
		var _curIndex1 = "";
		_curIndex1 = $(".page8_tabs").index($(this));
		tabsClick(_curIndex1);
	});
	
	//大分类下的新增按钮的点击
	$(".page8_boxes .btn").click(function() {
		_bIndex = $(".page8_boxes .btn").index($(this));
		$('#page8Modal').modal();
		document.getElementById("page8Container").innerHTML = "";
		$("#page8Submit").attr("clickid",_bIndex);
		$(".modal-backdrop").addClass("new-backdrop");
	});
	//新增页面确定按钮的点击
	$("#page8Submit").click(function() {
		addSubmit();
	});
	//修改页面确定按钮的点击
	$("#page8_sortSave").click(function() {
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
		var _curIndex = "";
		var _thisKey = "";
		var _thisLevel= "";
		var _curId = "";
		var _ajaxUrl = "";
		var _node = "{}";
		_curIndex = $(".edit_box1").index($(this));
		_thisKey = $(".edit_box1")[_curIndex].getAttribute("tablename");
		_curId = $("#tabClickIndex").attr("curId");
		console.log(_curIndex + "---" + _thisKey);
		if (_curId == 0) {
			_node = '{"category":"' + _thisKey + '"}';
			_ajaxUrl = "/config/queryByCategory";
		} else if(_curId == 1||_curId == 2||_curId == 3||_curId == 4){
			_thisLevel = $(".edit_box1")[_curIndex].getAttribute("level");
			_node = '{"category":"' + _thisKey + '","level":"' + _thisLevel + '"}';
			_ajaxUrl = "/settings/queryByCategory";
		} else if(_curId == 5){
			_node = '{"category":"' + _thisKey + '"}';
			_ajaxUrl = "/module/queryByCategory";
		}
		console.log(_node);
		sendHTTPRequest(_ajaxUrl, _node, queryByCategoryResult);
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
				$("#paged8_dialog_box1").modal("toggle");
			}
		}
	}
}

function addCategoryResult(){
	if(this.readyState == 4) {
		if(this.status == 200) {
			var data = JSON.parse(this.responseText);
			console.log(data);
			if(data.resultCode == "0") {
				console.log("数据添加成功。");
				$('#page8Modal').modal('hide');
				freshModuleAddHtml();
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
	$(".page8_tabs:eq(" + (num) + ")").attr("hasvalue","true");
	if(num==0||num==5){
		var insertTable = "";
		var _eachTableItem = "";
		_eachTableItem = "<thead><tr><td class='col-xs-4'>序号</td><td class='col-xs-4'>分类名称</td><td class='col-xs-4'>操作</td></tr></thead><tbody>";
		for (var i=0; i<array.length; i++) {
			_eachTableItem += "<tr><td class='col-xs-4'>"+(i+1)+"</td><td class='col-xs-4'>"+array[i].category+"</td><td class='col-xs-4'><a class='edit_box1' tablename = "+array[i].category+">编辑</a></td></tr>";
		}
		$(".page8_tables")[num].innerHTML = _eachTableItem + "</tbody>";
	}else if(num==1||num==2||num==3||num==4){
		
		var sysSettingArray = ["系统设置","信号源工具箱","卖场演示","中间件"];
		var insertTable = "";
		var _eachTableItem = "";
		var kk = 0;
		_eachTableItem = "<thead><tr><td class='col-xs-4'>序号</td><td class='col-xs-4'>分类名称</td><td class='col-xs-4'>操作</td></tr></thead><tbody>";
		for (var i=0; i<array.length; i++) {
			if (array[i].level1 == sysSettingArray[num-1]) {
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
		$(".page8_tables")[num].innerHTML = _eachTableItem + "</tbody>";
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
	//recursive(tableOrderId,tableCnArray,tableEnArray);
}
//递归,将非连续数组按排序读取
function recursive(data1,data2,data3){
	console.log(data1+"--"+data2+"--"+data3);
	var kk = data1.indexOf(Math.max.apply(Math, data1));
	sortCnArray.push(data2[kk]);
	sortEnArray.push(data3[kk]);
	data1.splice(kk, 1);
	data2.splice(kk, 1);
	data3.splice(kk, 1);
	if (data1.length != 0) {
		recursive(data1,data2,data3);
	}else{
		dataSort(sortCnArray,sortEnArray);
	}
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
	var _curIndex3 = $("#page8Submit").attr("clickid");
	if (_curIndex3 == 0) {
		ajaxUrl3 = "/config/addCategory";
	} else if(_curIndex3 == 1||_curIndex3 == 2||_curIndex3 == 3||_curIndex3 == 4){
		ajaxUrl3 = "/sys/addCategory";
	} else if(_curIndex3 == 5){
		ajaxUrl3 = "/module/addCategory";
	}
	var _category = $("#page8Container").val();
	var node33 = '{"category":"' + _category + '"}';
	console.log(node33);
	sendHTTPRequest(ajaxUrl3, node33, addCategoryResult);
}

function changeSubmit(){
	var _curId = $("#tabClickIndex").attr("curId");
	var _ajaxUrl = "";
	if (_curId == 0) {
		_ajaxUrl = "/config/updateItemsOrderId";
	} else if(_curId == 1||_curId == 2||_curId == 3||_curId == 4){
		_ajaxUrl = "/settings/updateItemsOrderId";
	} else if(_curId == 5){
		_ajaxUrl = "/module/updateItemsOrderId";
	}
	
	var _node = [];
	var _node2 = "";
	for (var i=0; i<$(".sequence_value").length; i++) {
		var _objItem = {
			"engName":"",
			"orderId": ""
		};
		_objItem.engName =  $(".sequence_value")[i].getAttribute("engname");
		_objItem.orderId =  $(".sequence_select")[i].value;
		
		_node.push(_objItem);
	}
	console.log(_node);
	_node = JSON.stringify(_node);
	_node2 = '{"arr":' + _node + '}';
	console.log(_node2);
	sendHTTPRequest(_ajaxUrl, _node2, updateCategoryResult);
}

function updateCategoryResult(){
	if(this.readyState == 4) {
		if(this.status == 200) {
			var data = JSON.parse(this.responseText);
			console.log(data);
			if(data.resultCode == "0") {
				console.log("数据修改成功。");
				$('#paged8_dialog_box1').modal('hide');
				freshModuleAddHtml();
			}else{
				console.log(data.resultDesc);
//				$("#chipMangInfo")[0].innerHTML = "数据添加失败！";
//				setTimeout('$("#chipMangInfo")[0].innerHTML = "　"',3000);
			}
		}
	}
}
function tabsClick(num){
	for (var k=0;k<$(".page8_tabs").length; k++) {
		$(".page8_boxes")[k].style.display = "none";
		$(".page8_tabs")[k].style.backgroundColor = "buttonface";
	}
	$(".page8_boxes")[num].style.display = "block";
	$(".page8_tabs")[num].style.backgroundColor = "red";
	$("#tabClickIndex").attr("curId",num);
	
	var _hasValue = $(".page8_tabs:eq(" + (num) + ")").attr("hasvalue");
	console.log(_hasValue);
	if (_hasValue == "false") {
		var node31 = '{}';
		var ajaxUrl = "";
		if (num == 0) {
			ajaxUrl = "/config/queryCategory";
		} else if(num == 1||num == 2||num == 3||num == 4){
			ajaxUrl = "/settings/queryCategory";
		} else if(num == 5){
			ajaxUrl = "/module/queryCategory";
		}
		sendHTTPRequest(ajaxUrl, node31, categoryQueryResult);
	} else{
		console.log("已经获取过了");
	}
}

/*刷新页面*/
function freshModuleAddHtml() {
	var htmlObject = parent.document.getElementById("tab_userMenu8");
	console.log("lxw " + htmlObject.firstChild.src);
	htmlObject.firstChild.src = "page8.html";

//	var indexObject = parent.document.getElementById("home");
//  var iframe = indexObject.getElementsByTagName("iframe");
//  iframe[0].src = "wait.html";
//  if(parent.document.getElementById("tab_userMenu2")){
//	    var htmlObject1 = parent.document.getElementById("tab_userMenu2");
//	    htmlObject1.firstChild.src = "review.html";
//	}  
}