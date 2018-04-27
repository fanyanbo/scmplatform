document.write("<script language=javascript src='../js/sentHTTP.js' charset=\"utf-8\"></script>");

$(function() {
	$(".page8_boxes")[0].style.display = "block";
	$("#tabClickIndex").attr("curId");
	
	buttonInitBefore();
	var node1 = '{}';
	sendHTTPRequest("/config/queryCategory", node1, categoryQueryResult);
	
	var _pageData = {
		"config":["基础功能","服务器IP配置","广告配置","TV通道","本地媒体","其他功能"],
		"systemsetting":["开机引导","设置入口页","网络与接口","音画设置","通用设置"],
		"sourcetools":["快捷功能","常用设置"],
		"marketmode":["声音演示","图像演示","功能配置选项"],
		"middleware":["输入信号源","支持纵横比","与config关联生成项"],
		"MK":["Playerlibrary","APP","Service","App Store","HomePage","IME","TV","Others"],
		"property":["设置","语音","CoocaaSDK","在线影视","与Config关联生成项"]
	};
});

function buttonInitBefore(){
	var _curIndex1 = "";
	var ajaxUrl = "";
	var node31 = '{}';
	$(".page8_tabs").click(function(){
		_curIndex1 = $(".page8_tabs").index($(this));
		console.log(_curIndex1);
		for (var k=0;k<$(".page8_tabs").length; k++) {
			$(".page8_boxes")[k].style.display = "none";
			$(".page8_tabs")[k].style.backgroundColor = "buttonface";
		}
		$(".page8_boxes")[_curIndex1].style.display = "block";
		$(".page8_tabs")[_curIndex1].style.backgroundColor = "red";
		$("#tabClickIndex").attr("curId",_curIndex1);
		
		if (_curIndex1 == 0) {
			ajaxUrl = "/config/queryCategory";
		} else if(_curIndex1 == 1||_curIndex1 == 2||_curIndex1 == 3||_curIndex1 == 4){
			ajaxUrl = "/sys/queryCategory";
		} else if(_curIndex1 == 5){
			ajaxUrl = "/module/queryCategory";
		}
		var _hasValue = $(".page8_tabs:eq(" + (_curIndex1) + ")").attr("hasvalue");
		console.log(_hasValue);
		if (_hasValue == "false") {
			sendHTTPRequest(ajaxUrl, node31, categoryQueryResult);
		} else{
			console.log("已经获取过了");
		}
	});
	
	$(".page8_boxes .btn").click(function() {
		_bIndex = $(".page8_boxes .btn").index($(this));
		console.log(_bIndex);
		$('#page8Modal').modal();
		document.getElementById("page8Container").innerHTML = "";
		$("#page8Submit").attr("clickid",_bIndex);
		$(".modal-backdrop").addClass("new-backdrop");
	});
	$("#page8Submit").click(function() {
		console.log($("#page8Submit").attr("clickid"));
		var ajaxUrl3 = "";
		if (_curIndex1 == 0) {
			ajaxUrl3 = "/config/addCategory";
		} else if(_curIndex1 == 1||_curIndex1 == 2||_curIndex1 == 3||_curIndex1 == 4){
			ajaxUrl3 = "/sys/addCategory";
		} else if(_curIndex1 == 5){
			ajaxUrl3 = "/module/addCategory";
		}
		var _category = $("#page8Container").val();
		var node33 = '{"category":"' + _category + '"}';
		console.log(node33);
		sendHTTPRequest(ajaxUrl3, node33, addCategoryResult);
		
	});
}

function buttonInitAfter(){
	var _curIndex2 = "";
	var _thisKey = "";
	var _curId = "";
	var ajaxUrl2 = "";
	var node32 = "{}";
	$(".edit_box1").click(function(){
		_curIndex2 = $(".edit_box1").index($(this));
		_thisKey = $(".edit_box1")[_curIndex2].getAttribute("tablename");
		_curId = $("#tabClickIndex").attr("curId");
		console.log(_curIndex2 + "---" + _thisKey);
		if (_curId == 0) {
			ajaxUrl2 = "/config/queryByCategory";
		} else if(_curId == 1||_curId == 2||_curId == 3||_curId == 4){
			ajaxUrl2 = "/sys/queryCategory";
		} else if(_curId == 5){
			ajaxUrl2 = "/module/queryByCategory";
		}
		node32 = '{"category":"' + _thisKey + '"}';
		sendHTTPRequest(ajaxUrl2, node32, queryByCategoryResult);
		
//		var _thisHeadTh = "";
//		var _thisbody = "";
//		var _thisbodyTr = "<tr>";
//		var _optionItem = "";
//		
//		for (var i=0; i<_pageData[_thisKey].length; i++) {
//			_optionItem += "<option value="+(i+1)+">"+(i+1)+"</option>";
//		}
//		for (var ii=0; ii<_pageData[_thisKey].length; ii++) {
//			if((ii != 0 && (ii + 1) % 4 == 0) || ii == _pageData[_thisKey].length - 1) {
//				_thisbodyTr += "<td class='sequence'><select class='inputstyle'>"+_optionItem+"</select></td><td class='sequence_value'></td>" + "<tr/><tr>";
//			} else{
//				_thisbodyTr += "<td class='sequence'><select class='inputstyle'>"+_optionItem+"</select></td><td class='sequence_value'></td>";
//			}
//		}
//		for(var k=0; k<_pageData[_thisKey].length; k++){
//			if(k<4){
//				_thisHeadTh += "<th type='number' class=''>序号</th><th type='string' class=''>配置项</th>";
//			}
//		}
//		$(".headtr")[0].innerHTML = _thisHeadTh;
//		$(".bodytr")[0].innerHTML = _thisbodyTr;
//		dataSort(_pageData[_thisKey]);
//		$("#paged8_dialog_box1").modal("toggle");
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

function queryByCategoryResult(){
	if(this.readyState == 4) {
		if(this.status == 200) {
			var data = JSON.parse(this.responseText);
			console.log(data);
			if(data.resultCode == "0") {
				
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
	var insertTable = "";
	var _eachTableItem = "";
	_eachTableItem = "<tr><td class='col-xs-4'>序号</td><td class='col-xs-4'>分类名称</td><td class='col-xs-4'>操作</td></tr>";
	for (var i=0; i<array.length; i++) {
		for (var j=0; j<array.length; j++) {
			if (array[j].orderId == (i+1)) {
				_eachTableItem += "<tr><td class='col-xs-4'>"+array[j].orderId+"</td><td class='col-xs-4'>"+array[j].category+"</td><td class='col-xs-4'><a class='edit_box1' tablename = "+array[j].category+">编辑</a></td></tr>";
			}
		}
	}
	$(".page8_tables")[num].innerHTML = _eachTableItem;
}

function dataSort(data){
	console.log(data);
	var _inputLength = $(".inputstyle").length;
	for (var i=0; i<_inputLength; i++) {
		$(".inputstyle")[i].options[i].selected = true;
		$(".inputstyle")[i].setAttribute("oldvalue",(i+1));
		$(".sequence_value")[i].innerText = data[i];
		$(".inputstyle")[i].onchange = function(){
			var _oIndex = $(".inputstyle").index($(this));
			var _oldkey = $(".inputstyle")[_oIndex].getAttribute("oldvalue");
			var _oldvalue = data[_oldkey-1];
			var _newkey = $(".inputstyle")[_oIndex].value;
			console.log("hello " + _oldkey+"----"+_newkey+"----"+_oldvalue);
			data.splice(_oldkey-1,1);//删除指定对象
			console.log(data);
			data.splice(_newkey-1,0,_oldvalue);//插入指定对象
			console.log(data);
			$(".inputstyle")[_oIndex].setAttribute("oldvalue",_newkey);
			dataSort(data);
		}
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