document.write("<script language=javascript src='../js/sentHTTP.js' charset=\"utf-8\"></script>");

$(function() {
	$(".page8_boxes")[0].style.display = "block";
	var _pageData = {
		"config":["基础功能","服务器IP配置","广告配置","TV通道","本地媒体","其他功能"],
		"systemsetting":["开机引导","设置入口页","网络与接口","音画设置","通用设置"],
		"sourcetools":["快捷功能","常用设置"],
		"skyTV":[""],
		"marketmode":["声音演示","图像演示","功能配置选项"],
		"middleware":["输入信号源","支持纵横比","与config关联生成项"],
		"MK":["Playerlibrary","APP","Service","App Store","HomePage","IME","TV","Others"],
		"property":["设置","语音","CoocaaSDK","在线影视","与Config关联生成项"]
	};
	var _count = 0;
	var _eachTableItem = "";
	var _sortObjPama = new Array();
	var _oldOpionsNum = "";
	
	for(key in _pageData) {
		_count ++;
		_eachTableItem = "<tr><td class='col-xs-4'>序号</td><td class='col-xs-4'>分类名称</td><td class='col-xs-4'>操作</td></tr>";
		for (var i=0; i<_pageData[key].length; i++) {
			_eachTableItem += "<tr><td class='col-xs-4'>"+(i+1)+"</td><td class='col-xs-4'>"+_pageData[key][i]+"</td><td class='col-xs-4'><a class='edit_box1' tablename = "+key+">编辑</a></td></tr>";
		}
		$(".page8_tables")[_count-1].innerHTML = _eachTableItem;
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
	
	var _curIndex1,_curIndex2 = "";
	$(".page8_tabs").click(function(){
		_curIndex1 = $(".page8_tabs").index($(this));
		console.log(_curIndex1);
		for (var k=0;k<$(".page8_tabs").length; k++) {
			$(".page8_boxes")[k].style.display = "none";
			$(".page8_tabs")[k].style.backgroundColor = "buttonface";
		}
		$(".page8_boxes")[_curIndex1].style.display = "block";
		$(".page8_tabs")[_curIndex1].style.backgroundColor = "red";
	});
	
	$(".edit_box1").click(function(){
		_curIndex2 = $(".edit_box1").index($(this));
		var _thisKey = "";
		var _thisHeadTh = "";
		var _thisbody = "";
		var _thisbodyTr = "<tr>";
		var _optionItem = "";
		_thisKey = $(".edit_box1")[_curIndex2].getAttribute("tablename");
		console.log(_curIndex2+"---"+_pageData + _thisKey);
		console.log(_pageData[_thisKey]);
		for (var i=0; i<_pageData[_thisKey].length; i++) {
			_optionItem += "<option value="+(i+1)+">"+(i+1)+"</option>";
		}
		for (var ii=0; ii<_pageData[_thisKey].length; ii++) {
			if((ii != 0 && (ii + 1) % 4 == 0) || ii == _pageData[_thisKey].length - 1) {
				_thisbodyTr += "<td class='sequence'><select class='inputstyle'>"+_optionItem+"</select></td><td class='sequence_value'></td>" + "<tr/><tr>";
			} else{
				_thisbodyTr += "<td class='sequence'><select class='inputstyle'>"+_optionItem+"</select></td><td class='sequence_value'></td>";
			}
		}
		for(var k=0; k<_pageData[_thisKey].length; k++){
			if(k<4){
				_thisHeadTh += "<th type='number' class=''>序号</th><th type='string' class=''>配置项</th>";
			}
		}
		$(".headtr")[0].innerHTML = _thisHeadTh;
		$(".bodytr")[0].innerHTML = _thisbodyTr;
		dataSort(_pageData[_thisKey]);
		$("#paged8_dialog_box1").modal("toggle");
	});
});