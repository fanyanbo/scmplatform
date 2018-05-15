document.write("<script language=javascript src='../js/sentHTTP.js' charset=\"utf-8\"></script>");
$(function() {
	var node = '{"offset":"-1","rows":"10"}';
	sendHTTPRequest("/product/queryByPage", node, productQuery);
});

function productQuery() {
	if(this.readyState == 4) {
		if(this.status == 200) {
			var data = JSON.parse(this.responseText);
			console.log(data);
			//auditState(0审核通过\1待审核\2审核未通过)、modifyState(0正常\1修改\2增加\3删除)
			if(data.resultCode == "0") {
				var arr = new Array();
				for (var i=0; i<data.resultData.length; i++) {
					if (data.resultData[i].auditState == 1) {
						arr.push(data.resultData[i]);
					}
				}
				handleTableData(arr);
			}
		}
	}
}
function handleTableData(arr) {
	var getdataArray2 = new Array();
	
	for(var i = 0; i < arr.length; i++) {
		var eachItem2 = {
			"number": "0",
			"model": "G7200",
			"chip": "8H81",
			"target_product": "123123",
			"chipmodel": "123",
			"coocaaVersion": "1",
			"AndroidVersion": "6.0",
			"memory": "1.5G",
			"type": "1",
			"author": "林心旺",
			"reason": "<span class='eachlook'>查看</a>",
			"operate": "<span class='eachedit'>编辑</span><span class='eachaudit'>审核</a>"
		};
		eachItem2.number = (i+1);
		eachItem2.model = arr[i].model;
		eachItem2.chip = arr[i].chip;
		eachItem2.target_product = arr[i].targetProduct;
		eachItem2.chipmodel = arr[i].soc;
		eachItem2.coocaaVersion = arr[i].coocaaVersion;
		eachItem2.AndroidVersion = arr[i].androidVersion;
		eachItem2.memory = arr[i].memorySize;
		eachItem2.type = arr[i].modifyState;
		getdataArray2.push(eachItem2);
	}
	console.log(getdataArray2);
	pageTableInit(getdataArray2);
}
function pageTableInit(data1) {
	//前台分页
	$('#page4_table').CJJTable({
		'title': ["序号", "机型", "机芯", "TP", "芯片型号", "酷开版本", "安卓版本", "内存", "类型", "提交者", "跟新原因", "操作"],
		'body': ["number", "model", "chip", "target_product", "chipmodel", "coocaaVersion", "AndroidVersion", "memory", "type", "author", "reason", "operate"], //tbody td 取值的字段 必填
		'display': [2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1], //隐藏域，1显示，2隐藏 必填
		'pageNUmber': 10, //每页显示的条数 选填
		'pageLength': data1.length, //选填
		'url': data1 //数据源 必填
	});
	editStatusByLength(data1.length);
	buttonInitAfter();
}
function editStatusByLength(num){
	if (num == 0) {
		console.log("查询结果为空");
		$('#page5_table').css("display", "none");
		$('#noList').css("display", "block");
	} else if (num < 11) {
		console.log("查询结果个数小于11");
		
	}else{
		console.log("查询结果个数大于11");
		
	}
}
function buttonInitAfter(){
	$(".eachlook").click(function() {
		var _Index = $(".eachlook").index($(this));
		console.log("点击的是第" + _Index + "个 查看项。");
		console.log($("#page4_table2 .chip")[_Index].innerHTML);
		console.log($("#page4_table2 .model")[_Index].innerHTML);
		
	});
	$(".eachedit").click(function() {
		var _Index = $(".eachedit").index($(this));
		console.log("点击的是第" + _Index + "个编辑项 。");
		console.log($("#page4_table2 .chip")[_Index].innerHTML);
		console.log($("#page4_table2 .model")[_Index].innerHTML);
		
		$('#myCheckModal').modal();
    	$(".modal-backdrop").addClass("new-backdrop");
	});
	$(".eachaudit").click(function() {
		var _Index = $(".eachaudit").index($(this));
		console.log("点击的是第" + _Index + "个审核项。");
		console.log($("#page4_table2 .chip")[_Index].innerHTML);
		console.log($("#page4_table2 .model")[_Index].innerHTML);
		
		$('#myCheckModal').modal();
    	$(".modal-backdrop").addClass("new-backdrop");
	});
	
}
