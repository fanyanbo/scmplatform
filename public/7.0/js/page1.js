document.write("<script language=javascript src='../js/sentHTTP.js' charset=\"utf-8\"></script>");

var getdataArray = new Array();
var coocaaVersion = "/v7.0";

$(function() {
	console.log("hello");
	sendHTTPRequest(coocaaVersion+"/home/getSummary", '{"data":""}', homePageInfoResult);
});

function homePageInfoResult() {
	if(this.readyState == 4) {
		if(this.status == 200) {
			var data = JSON.parse(this.responseText);
			console.log(data);
			if(data.resultCode == "0") {
				console.log(data.resultData);
				console.log(data.resultDesc);
				$(".infoitems span")[0].innerHTML = data.resultData.productTotalNum;
				$(".infoitems span")[1].innerHTML = data.resultData.chipTotalNum;
				$(".infoitems span")[2].innerHTML = data.resultData.modelTotalNum;
				$(".infoitems span")[3].innerHTML = data.resultData.hisiTotalNum;
				$(".infoitems span")[4].innerHTML = data.resultData.mstarTotalNum;
				$(".infoitems span")[5].innerHTML = data.resultData.rtkTotalNum;
				$(".infoitems span")[6].innerHTML = data.resultData.amlogicTotalNum;
				$(".infoitems span")[7].innerHTML = data.resultData.novaTotalNum;
			}
		}
		sendHTTPRequest(coocaaVersion+"/syslog/queryTotalNum", '{"data":""}', pageTableInit);
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
					'pageNUmber': 10, //每页显示的条数 选填
					'pageLength': _data.length, //选填
					'url': _data, //数据源 必填
					dbTrclick: function(e) { //双击tr事件
					}
				});
			}
		}
		getEachPagedata(1,10);
	}
}

function getEachPagedata(offset,rows){
	var startNum = (offset-1)*rows;
	var numLength = rows;
	var node = '{"offset":"' + startNum + '","rows":"' + numLength + '"}';
	sendHTTPRequest(coocaaVersion+"/syslog/queryByPage", node, syslogQuery);
}

function syslogQuery(){
	if(this.readyState == 4) {
		if(this.status == 200) {
			var eachItem = "";
			var data = JSON.parse(this.responseText);
			console.log(data);
			if(data.resultCode == "0") {
				console.log(data.resultData);
				getdataArray.splice(0,getdataArray.length);
				for (var i=0; i<data.resultData.length; i++) {
					eachItem = '{"number": "'+ (i+1)+'","userName": "'+data.resultData[i].userName+'","action": "'+data.resultData[i].action+'","time": "'+data.resultData[i].time+'","detail": "'+data.resultData[i].detail+'"}';
					eachItem = JSON.parse(eachItem);
					getdataArray.push(eachItem);
				}
				insetTable(getdataArray);
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
		getEachPagedata(number,10);
	}
}
function gotoFirstPage(obj){
	var firstnumber = $(".eachli")[0].innerText;
	console.log("点击了首页,即第"+firstnumber+"页");
	getEachPagedata(firstnumber,10);
}
function gotoEndPage(obj){
	var endnumber = $(".eachli")[$(".eachli").length-1].innerText;
	console.log("点击了尾页,即第"+endnumber+"页");
	getEachPagedata(endnumber,10);
}
function gotoNextPage(nextnumber,obj){
	console.log("点击了下一页,即第"+nextnumber+"页");
	getEachPagedata(nextnumber,10);
}
function gotoLastPage(lastnumber,obj){
	console.log("点击了下一页,即第"+lastnumber+"页");
	getEachPagedata(lastnumber,10);
}

function insetTable(data){
	var _curValue = "";
	console.log(data.length);
	for (var i=0; i<data.length; i++) {
		_curValue = data[i];
		for(key in _curValue) {
//			console.log(key+"----"+i);
//			console.log($('.'+key)[i]);
			$('.'+key)[i].innerHTML = data[i][key];
        }
	}
}
