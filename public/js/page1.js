document.write("<script language=javascript src='../js/sentHTTP.js' charset=\"utf-8\"></script>");

var getdataArray = new Array();
$(function() {
	sendHTTPRequest("/home/getSummary", '{"data":""}', homePageInfoResult);
	buttonInit();
});

function buttonInit(){
	$(".examine").click(function(){
		var _cIndex = $(".examine").index($(this));
		console.log("点击的是第"+_cIndex+"个 examine class");
		$("#page1_check_chip").html($(".new_productBox .chip")[_cIndex].innerHTML);
		$("#page1_check_model").html($(".new_productBox .model")[_cIndex].innerHTML);
		$("#page1_check_targetProduct").html($(".new_productBox .target_product")[_cIndex].innerHTML);
		$('#page1_examine').modal();
	});
	$("#page1_close1").click(function(){
		$("#page1_examine").modal('hide');
	});
	$("#page1_close2").click(function(){
		$("#page1_examine").modal('hide');
	});
}

function homePageInfoResult() {
	if(this.readyState == 4) {
		if(this.status == 200) {
			var data = JSON.parse(this.responseText);
			console.log(data);
			if(data.resultCode == "0") {
				console.log(data.resultDesc);
				$(".infoitems span")[0].innerHTML = data.resultDesc.productTotalNum;
				$(".infoitems span")[1].innerHTML = data.resultDesc.chipTotalNum;
				$(".infoitems span")[2].innerHTML = data.resultDesc.modelTotalNum;
				$(".infoitems span")[3].innerHTML = data.resultDesc.hisiTotalNum;
				$(".infoitems span")[4].innerHTML = data.resultDesc.mstarTotalNum;
				$(".infoitems span")[5].innerHTML = data.resultDesc.rtkTotalNum;
				$(".infoitems span")[6].innerHTML = data.resultDesc.amlogicTotalNum;
				$(".infoitems span")[7].innerHTML = data.resultDesc.novaTotalNum;
			}
		}
		sendHTTPRequest("/syslog/queryTotalNum", '{"data":""}', pageTableInit);
	}
}

function pageTableInit(){
	if(this.readyState == 4) {
		if(this.status == 200) {
			var data = JSON.parse(this.responseText);
			console.log(data);
			if(data.resultCode == "0") {
				console.log(data.resultData[0].count);
				var _data = new Array(data.resultData[0].count);
				//前台分页的样子
				$('#page1_table').CJJTable({
					'title': ["序号", "用户名", "行为", "时间", "详细信息"], //thead中的标题 必填
					'body': ["number", "userName", "action", "time", "detail"], //tbody td 取值的字段 必填
					'display': [2, 1, 1, 1, 1], //隐藏域，1显示，2隐藏 必填
					'pageNUmber': 15, //每页显示的条数 选填
					'pageLength': _data.length, //选填
					'url': _data, //数据源 必填
					dbTrclick: function(e) { //双击tr事件
					}
				});
			}
		}
		getEachPagedata(0,10);
		//var _username = "";
		//var _action = "";
		//var _detail = "";
		//var node = '{"userName":"' + _username + '","action":"' + _action + '","detail":"' + _detail + '"}';
		//sendHTTPRequest("/syslog/add", node, syslogAdd);
	}
}

function getEachPagedata(offset,rows){
	var node = '{"offset":"' + offset + '","rows":"' + rows + '"}';
	sendHTTPRequest("/syslog/queryByPage", node, syslogQuery);
}

function syslogQuery(){
	if(this.readyState == 4) {
		if(this.status == 200) {
			var eachItem = "";
			var data = JSON.parse(this.responseText);
			console.log(data);
			if(data.resultCode == "0") {
				console.log(data.resultData);
				for (var i=0; i<data.resultData.length; i++) {
					eachItem = '{"number": "'+ (i+1)+'","userName": "'+data.resultData[i].userName+'","action": "'+data.resultData[i].action+'","time": "'+data.resultData[i].time+'","detail": "'+data.resultData[i].detail+'"}';
					eachItem = JSON.parse(eachItem);
					getdataArray.push(eachItem);
				}
				insetTable2(getdataArray);
			}
		}
	}
}

function gotoDesignPage(number,obj) {
	console.log(number+"----"+obj);
	var re = /^[0-9]+.?[0-9]*/;
	if(!re.test(number)) {
		console.log("输入框的值为空");　
	} else {
		console.log("点击了指定页,即第" + number + "页");
		
	}
}
function gotoFirstPage(obj){
	var firstnumber = $(".eachli")[0].innerText;
	console.log("点击了首页,即第"+firstnumber+"页");
	getdata = [{"number": "1","model": "G6200","chip": "8H81","target_product": "a1","modification": "2","reason": "11111","state": "6.0","author": "林心旺","time": "2018/3/12","history": "<a class='examine' href='#'>查看</a>"}, {"number": "2","model": "G7200","chip": "8H81","target_product": "a1","modification": "2","reason": "11111","state": "6.0","author": "林心旺","time": "2018/3/12","history": "<a class='examine' href='#'>查看</a>"},{"number": "3","model": "G9300","chip": "8H81","target_product": "a1","modification": "2","reason": "11111","state": "6.0","author": "林心旺","time": "2018/3/12","history": "<a class='examine' href='#'>查看</a>"},{"number": "4","model": "X6","chip": "8H81","target_product": "a1","modification": "2","reason": "11111","state": "6.0","author": "林心旺","time": "2018/3/12","history": "<a class='examine' href='#'>查看</a>"},{"number": "5","model": "M9","chip": "8H81","target_product": "a1","modification": "2","reason": "11111","state": "6.0","author": "林心旺","time": "2018/3/12","history": "<a class='examine' href='#'>查看</a>"},{"number": "6","model": "Q8","chip": "8H81","target_product": "a1","modification": "2","reason": "11111","state": "6.0","author": "林心旺","time": "2018/3/12","history": "<a class='examine' href='#'>查看</a>"},{"number": "7","model": "M9","chip": "8H81","target_product": "a1","modification": "2","reason": "11111","state": "6.0","author": "林心旺","time": "2018/3/12","history": "<a class='examine' href='#'>查看</a>"},{"number": "8","model": "M8","chip": "8H81","target_product": "a1","modification": "2","reason": "11111","state": "6.0","author": "林心旺","time": "2018/3/12","history": "<a class='examine' href='#'>查看</a>"},{"number": "9","model": "M3","chip": "8H81","target_product": "a1","modification": "2","reason": "11111","state": "6.0","author": "林心旺","time": "2018/3/12","history": "<a class='examine' href='#'>查看</a>"},{"number": "10","model": "A2","chip": "8H81","target_product": "a1","modification": "2","reason": "11111","state": "6.0","author": "林心旺","time": "2018/3/12","history": "<a class='examine' href='#'>查看</a>"}];
	//insetTable(getdata,obj);
}
function gotoEndPage(obj){
	var endnumber = $(".eachli")[$(".eachli").length-1].innerText;
	console.log("点击了尾页,即第"+endnumber+"页");
	getdata = [{"number": "1","model": "G6200","chip": "8H81","target_product": "a2","modification": "2","reason": "11111","state": "6.0","author": "林心旺","time": "2018/3/12","history": "<a class='examine' href='#'>查看</a>"}, {"number": "2","model": "G7200","chip": "8H81","target_product": "a2","modification": "2","reason": "11111","state": "6.0","author": "林心旺","time": "2018/3/12","history": "<a class='examine' href='#'>查看</a>"},{"number": "3","model": "G9300","chip": "8H81","target_product": "a2","modification": "2","reason": "11111","state": "6.0","author": "林心旺","time": "2018/3/12","history": "<a class='examine' href='#'>查看</a>"},{"number": "4","model": "X6","chip": "8H81","target_product": "a2","modification": "2","reason": "11111","state": "6.0","author": "林心旺","time": "2018/3/12","history": "<a class='examine' href='#'>查看</a>"},{"number": "5","model": "M9","chip": "8H81","target_product": "a2","modification": "2","reason": "11111","state": "6.0","author": "林心旺","time": "2018/3/12","history": "<a class='examine' href='#'>查看</a>"},{"number": "6","model": "Q8","chip": "8H81","target_product": "a2","modification": "2","reason": "11111","state": "6.0","author": "林心旺","time": "2018/3/12","history": "<a class='examine' href='#'>查看</a>"},{"number": "7","model": "M9","chip": "8H81","target_product": "a2","modification": "2","reason": "11111","state": "6.0","author": "林心旺","time": "2018/3/12","history": "<a class='examine' href='#'>查看</a>"},{"number": "8","model": "M8","chip": "8H81","target_product": "a2","modification": "2","reason": "11111","state": "6.0","author": "林心旺","time": "2018/3/12","history": "<a class='examine' href='#'>查看</a>"}];
	insetTable(getdata,obj);
}
function gotoNextPage(nextnumber,obj){
	console.log("点击了下一页,即第"+nextnumber+"页");
	getdata = [{"number": "2","model": "G7200","chip": "8H81","target_product": "a1","modification": "2","reason": "11111","state": "6.0","author": "林心旺","time": "2018/3/12","history": "<a class='examine' href='#'>查看</a>"},{"number": "3","model": "G9300","chip": "8H81","target_product": "a1","modification": "2","reason": "11111","state": "6.0","author": "林心旺","time": "2018/3/12","history": "<a class='examine' href='#'>查看</a>"},{"number": "4","model": "X6","chip": "8H81","target_product": "a1","modification": "2","reason": "11111","state": "6.0","author": "林心旺","time": "2018/3/12","history": "<a class='examine' href='#'>查看</a>"},{"number": "5","model": "M9","chip": "8H81","target_product": "a1","modification": "2","reason": "11111","state": "6.0","author": "林心旺","time": "2018/3/12","history": "<a class='examine' href='#'>查看</a>"},{"number": "6","model": "Q8","chip": "8H81","target_product": "a1","modification": "2","reason": "11111","state": "6.0","author": "林心旺","time": "2018/3/12","history": "<a class='examine' href='#'>查看</a>"},{"number": "7","model": "M9","chip": "8H81","target_product": "a1","modification": "2","reason": "11111","state": "6.0","author": "林心旺","time": "2018/3/12","history": "<a class='examine' href='#'>查看</a>"},{"number": "8","model": "M8","chip": "8H81","target_product": "a1","modification": "2","reason": "11111","state": "6.0","author": "林心旺","time": "2018/3/12","history": "<a class='examine' href='#'>查看</a>"},{"number": "9","model": "M3","chip": "8H81","target_product": "a1","modification": "2","reason": "11111","state": "6.0","author": "林心旺","time": "2018/3/12","history": "<a class='examine' href='#'>查看</a>"},{"number": "10","model": "A2","chip": "8H81","target_product": "a1","modification": "2","reason": "11111","state": "6.0","author": "林心旺","time": "2018/3/12","history": "<a class='examine' href='#'>查看</a>"}];
//	insetTable(getdata,obj);
}
function gotoLastPage(lastnumber,obj){
	console.log("点击了下一页,即第"+lastnumber+"页");
}


function insetTable(data,obj){
	var _curLength = "";
	var _curValue = "";
	if (obj.pageNUmber=data.length) {
		_curLength = obj.pageNUmber;
	} else{
		_curLength = data.length;
	}
	for (var i=0; i<obj.body.length; i++) {
		_curValue = obj.body[i];
		for (var j=0; j<_curLength; j++) {
			$('.'+_curValue)[j].innerHTML = data[j][_curValue];
		}
	}
}

function insetTable2(data){
	var _curValue = "";
	for (var i=0; i<data.length; i++) {
		_curValue = data[i];
		for(key in _curValue) {
			console.log(key+"----"+data[i][key]);
			$('.'+key)[i].innerHTML = data[i][key];
        }
	}
}
