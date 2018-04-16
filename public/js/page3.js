document.write("<script language=javascript src='../js/sentHTTP.js' charset=\"utf-8\"></script>");

var autoComplete3 = "";
var instantSearch = "";
$(function() {
	instantSearch = [{
		"checkout": "<input name='checkbox' type='checkbox' value='checkbox'/>",
		"number": "1",
		"target_product": "123123",
		"operate": "<a href='#'>编辑</a><a href='#'>删除</a><a href='#'>复制</a><a href='#'>预览</a>"
	}, {
		"checkout": "<input name='checkbox' type='checkbox' value='checkbox'/>",
		"number": "2",
		"target_product": "123123",
		"operate": "<a href='#'>编辑</a><a href='#'>删除</a><a href='#'>复制</a><a href='#'>预览</a>"
	}, {
		"checkout": "<input name='checkbox' type='checkbox' value='checkbox'/>",
		"number": "3",
		"target_product": "123123",
		"operate": "<a href='#'>编辑</a><a href='#'>删除</a><a href='#'>复制</a><a href='#'>预览</a>"
	}, {
		"checkout": "<input name='checkbox' type='checkbox' value='checkbox'/>",
		"number": "4",
		"target_product": "123123",
		"operate": "<a href='#'>编辑</a><a href='#'>删除</a><a href='#'>复制</a><a href='#'>预览</a>"
	}, {
		"checkout": "<input name='checkbox' type='checkbox' value='checkbox'/>",
		"number": "5",
		"target_product": "123123",
		"operate": "<a href='#'>编辑</a><a href='#'>删除</a><a href='#'>复制</a><a href='#'>预览</a>"
	}, {
		"checkout": "<input name='checkbox' type='checkbox' value='checkbox'/>",
		"number": "6",
		"target_product": "123123",
		"operate": "<a href='#'>编辑</a><a href='#'>删除</a><a href='#'>复制</a><a href='#'>预览</a>"
	}, {
		"checkout": "<input name='checkbox' type='checkbox' value='checkbox'/>",
		"number": "7",
		"target_product": "123123",
		"operate": "<a href='#'>编辑</a><a href='#'>删除</a><a href='#'>复制</a><a href='#'>预览</a>"
	}, {
		"checkout": "<input name='checkbox' type='checkbox' value='checkbox'/>",
		"number": "8",
		"target_product": "123123",
		"operate": "<a href='#'>编辑</a><a href='#'>删除</a><a href='#'>复制</a><a href='#'>预览</a>"
	}, {
		"checkout": "<input name='checkbox' type='checkbox' value='checkbox'/>",
		"number": "9",
		"target_product": "123123",
		"operate": "<a href='#'>编辑</a><a href='#'>删除</a><a href='#'>复制</a><a href='#'>预览</a>"
	}, {
		"checkout": "<input name='checkbox' type='checkbox' value='checkbox'/>",
		"number": "10",
		"target_product": "123123",
		"operate": "<a href='#'>编辑</a><a href='#'>删除</a><a href='#'>复制</a><a href='#'>预览</a>"
	}, {
		"checkout": "<input name='checkbox' type='checkbox' value='checkbox'/>",
		"number": "11",
		"target_product": "123123",
		"operate": "<a href='#'>编辑</a><a href='#'>删除</a><a href='#'>复制</a><a href='#'>预览</a>"
	}];
	
	pageTableInit();
	instantQuery();
	buttonInit();
});

function pageTableInit(){
	//前台分页的样子
	$('#page3_table').CJJTable({
		'title': ["单选框", "序号", "TARGET_PRODUCT", "操作"], //thead中的标题 必填
		'body': ["checkout", "number", "target_product", "operate"], //tbody td 取值的字段 必填
		'display': [2, 1, 1, 1], //隐藏域，1显示，2隐藏 必填
		'pageNUmber': 10, //每页显示的条数 选填
		'pageLength': instantSearch.length, //选填
		'url': instantSearch, //数据源 必填
		dbTrclick: function(e) { //双击tr事件
			alert(e.find('.taskCode').html())
		}
	});
}
function instantQuery(){
	var _$ = function(id) {
		return "string" == typeof id ? document.getElementById(id) : id;
	}
	var Bind = function(object, fun) {
		return function() {
			return fun.apply(object, arguments);
		}
	}

	function AutoComplete(obj, autoObj, arr) {
		this.obj = _$(obj); //输入框
		this.autoObj = _$(autoObj); //DIV的根节点
		this.value_arr = arr; //不要包含重复值
		this.index = -1; //当前选中的DIV的索引
		this.search_value = ""; //保存当前搜索的字符
	}
	AutoComplete.prototype = {
		//初始化DIV的位置
		init: function() {
			this.autoObj.style.left = this.obj.offsetLeft + "px";
			this.autoObj.style.top = this.obj.offsetTop + this.obj.offsetHeight + "px";
			this.autoObj.style.width = this.obj.offsetWidth - 2 + "px"; //减去边框的长度2px
		},
		//删除自动完成需要的所有DIV
		deleteDIV: function() {
			while(this.autoObj.hasChildNodes()) {
				this.autoObj.removeChild(this.autoObj.firstChild);
			}
			this.autoObj.className = "auto_hidden";
		},
		//设置值
		setValue: function(_this) {
			return function() {
				_this.obj.value = this.seq;
				_this.autoObj.className = "auto_hidden";
			}
		},
		//模拟鼠标移动至DIV时，DIV高亮
		autoOnmouseover: function(_this, _div_index) {
			return function() {
				_this.index = _div_index;
				var length = _this.autoObj.children.length;
				for(var j = 0; j < length; j++) {
					if(j != _this.index) {
						_this.autoObj.childNodes[j].className = 'auto_onmouseout';
					} else {
						_this.autoObj.childNodes[j].className = 'auto_onmouseover';
					}
				}
			}
		},
		//更改classname
		changeClassname: function(length) {
			for(var i = 0; i < length; i++) {
				if(i != this.index) {
					this.autoObj.childNodes[i].className = 'auto_onmouseout';
				} else {
					this.autoObj.childNodes[i].className = 'auto_onmouseover';
					this.obj.value = this.autoObj.childNodes[i].seq;
				}
			}
		},

		//响应键盘
		pressKey: function(event) {
			var length = this.autoObj.children.length;
			//光标键"↓"
			if(event.keyCode == 40) {
				++this.index;
				if(this.index > length) {
					this.index = 0;
				} else if(this.index == length) {
					this.obj.value = this.search_value;
				}
				this.changeClassname(length);
			}
			//光标键"↑"
			else if(event.keyCode == 38) {
				this.index--;
				if(this.index < -1) {
					this.index = length - 1;
				} else if(this.index == -1) {
					this.obj.value = this.search_value;
				}
				this.changeClassname(length);
			}
			//回车键
			else if(event.keyCode == 13) {
				this.autoObj.className = "auto_hidden";
				this.index = -1;
			} else {
				this.index = -1;
			}
		},
		//程序入口
		start: function(event) {
			if(event.keyCode != 13 && event.keyCode != 38 && event.keyCode != 40) {
				this.init();
				this.deleteDIV();
				this.search_value = this.obj.value;
				var valueArr = this.value_arr;
				valueArr.sort();
				if(this.obj.value.replace(/(^\s*)|(\s*$)/g, '') == "") {
					return;
				} //值为空，退出
				try {
					var reg = new RegExp("(" + this.obj.value + ")", "i");
				} catch(e) {
					return;
				}
				var div_index = 0; //记录创建的DIV的索引
				for(var i = 0; i < valueArr.length; i++) {
					if(reg.test(valueArr[i])) {
						var div = document.createElement("div");
						div.className = "auto_onmouseout";
						div.seq = valueArr[i];
						div.onclick = this.setValue(this);
						div.onmouseover = this.autoOnmouseover(this, div_index);
						div.innerHTML = valueArr[i].replace(reg, "<strong>$1</strong>"); //搜索到的字符粗体显示
						this.autoObj.appendChild(div);
						this.autoObj.className = "auto_show";
						div_index++;
					}
				}
			}
			this.pressKey(event);
			window.onresize = Bind(this, function() {
				this.init();
			});
		}
	}
	autoComplete3 = new AutoComplete('page3_targetProduct', 'page3_auto', ['b0', 'b12', 'b22', 'b3', 'b4', 'b5', 'b6', 'b7', 'b8', 'b2', 'abd', 'ab', 'acd', 'accd', 'b1', 'cd', 'ccd', 'cbcv', 'cxf', 'abd', 'ab1', 'acd2', 'accd3']);

	/* 点击空白出隐藏临时div */
	_$(document).onclick = function(e) {
		var e = e || window.event; //浏览器兼容性 
		var elem = e.target || e.srcElement;
		var _style = document.getElementById("page3_auto").getAttribute("class");
		if(_style == "auto_show") {
			document.getElementById("page3_auto").setAttribute("class", "auto_hidden")
		}
	}
}

function buttonInit(){
	$("#page3_targetProduct").keyup(function(event){
		autoComplete3.start(event);
	});
	
	document.getElementById("page3_searchInfo").onclick = page3Select;
	document.getElementById("page3_reset").onclick = page3Reset;
}
//查询功能
function page3Select(){
	var oTargetProduct = document.getElementById('page3_targetProduct').value;
	var node = null;
	var myNeedObj = {};
	console.log(oTargetProduct);
	if(oTargetProduct == "") {
		node = '{"data":{"condition":{},"option":{"chip":1,"model":1,"androidVersion":1,"memorySize":1,"chipModel":1,"operateType":1,"gerritState":1,"operateTime":1,"targetProduct":1},"sort":{"operateTime":1 }}}';
	} else {
		if(oTargetProduct != "") {
			myNeedObj['targetProduct'] = oTargetProduct;
		}
		//console.log("lxw --->" + JSON.stringify(myNeedObj));
		var myNeedString = JSON.stringify(myNeedObj);
		node = '{"data":{"condition":' + myNeedString + ',"option":{"chip":1,"model":1,"androidVersion":1,"memorySize":1,"chipModel":1,"operateType":1,"gerritState":1,"operateTime":1,"targetProduct":1},"sort":{"operateTime":1  }}}';
	}
	console.log("查询条件为：" + node);
	//sendHTTPRequest("/fybv2_api/productRegexQuery", node, searchResource);
}

//重置功能
function page3Reset() {
	console.log("点击了重置");
	document.getElementById("page3_targetProduct").value = "";
	//page3Select(); //重置时是否需要重新查询，这个需要分析
}