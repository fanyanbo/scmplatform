;
(function($, window, document, undefined) {
	var cjjTable = function(ele, opt) {
		this.$element = ele,
			this.defaults = {
				title: null,
				body: null,
				display: null,
				pageNUmber: 8,
				pageLength: 0,
				url: null,
				dbTrclick: function(that) {}
			}
		this.options = $.extend({}, this.defaults, opt)
	}
	cjjTable.prototype = {
		start: function() {
			var _this = this;
			var titlelistBox = "";
			var titlesmall = "";
			for(var i = 0; i < _this.options.title.length; i++) {
				titlesmall += "<th>" + _this.options.title[i] + "</th>";
				titlelistBox = titlesmall;
			}
			var json = "";
			var maxpagenumberBox = 7; //选择项最多的数量
			var json = this.options.url;
			var histroy_DDBox = "";
			var histroy_DD = "";
			var firstPageNumber = _this.options.pageLength > _this.options.pageNUmber ? _this.options.pageNUmber : _this.options.pageLength;
			for(var i = 0; i < firstPageNumber; i++) {
				var bodyBigBox = "";
				var bodyBox = "";
				for(var x = 0; x < _this.options.body.length; x++) {
					var type = _this.options.body[x];
					var display = "table-cell";
					if(_this.options.body.length > _this.options.title.length && _this.options.display[x] != undefined) {
						display = _this.options.display[x] * 1 == 1 ? "table-cell" : "none";
					}
					//bodyBox+="<td class='"+type+"' style='display:"+display+"'>"+json[i][type]+"</td>";
					bodyBox += "<td class='" + type + "' style='display:" + display + "'></td>";
					bodyBigBox = bodyBox;
				}
				histroy_DD += "<tr class='new_productBox'>" + bodyBigBox + "</tr>";
				histroy_DDBox = histroy_DD;
			}
			$(_this.$element.selector + " table tfoot").html("");
			if(Math.ceil(_this.options.pageLength / _this.options.pageNUmber) == 1) {
				$(_this.$element.selector + " .nextPage").css("display", "none");
				$(_this.$element.selector + " .endPage").css("display", "none");
			}
			var maxpagenumberBoxBigbox = "";
			var maxpagenumberBoxBig = "";
			if(Math.ceil(_this.options.pageLength / _this.options.pageNUmber) < maxpagenumberBox) {
				for(var i = 0; i < Math.ceil(_this.options.pageLength / _this.options.pageNUmber); i++) {
					var className = "";
					if(i == 0) {
						className = "pagenumberBoxLi";
					}
					maxpagenumberBoxBig += '<li class="eachli ' + className + '">' + (i * 1 + 1) + '</li>';
					maxpagenumberBoxBigbox = maxpagenumberBoxBig;
				}
			} else {
				for(var i = 0; i < maxpagenumberBox; i++) {
					var className = "";
					if(i == 0) {
						className = "pagenumberBoxLi";
					}
					maxpagenumberBoxBig += '<li class="eachli ' + className + '">' + (i * 1 + 1) + '</li>';
					maxpagenumberBoxBigbox = maxpagenumberBoxBig;
				}
			}
			var buttonTfoot = "<tr>" +
				"<td  colspan='" + _this.options.title.length + "'>" +
				"<div style='float:right;margin-left:10px;' class='tfootRight'>" +
				"<input  placeholder='输入页码' type='text'>" +
				"<button>确定</button>" +
				"</div>" +
				"<div style='float:right'>" +
				"<span class='firstPage' style='margin-right:10px;cursor: pointer;float:left;display: none;margin-left:10px;'>首页</span>" +
				"<span class='lastPage' style='margin-right:10px;cursor: pointer;float:left;display: none;'>上一页</span>" +
				"<ul class='pagenumberBox'>" + maxpagenumberBoxBigbox + "</ul>" +
				"<input class='typeNumber' type='text' value='1' onfocus='this.blur()' style='display:none;width:20px;height:20px;text-align:center;line-height:20px;border:1px solid #666;margin-right:5px;float:left;margin-top:2.5px;'>" +
				"<span class='nextPage' style='margin-right:10px;float:left;cursor: pointer;'>下一页</span>" +
				"<span class='endPage' style='cursor: pointer;float:left;'>尾页</span>" +
				"</div>" +
				"</div>" +
				"<td>" +
				"<tr>";
			//注释掉可以选择每页数。
			//          "<div style='float:right'>"+
			//                "<select><option value='5'>5</option><option value='10'>10</option><option value='20'>20</option><option value='50'>50</option><option value='100'>100</option><option value='200'>200</option><option value='500'>500</option></select>"
			//          "</div>"+
			_this.$element.html("<table class='CJJ-Table'><thead>" + titlelistBox + "</thead><tbody>" + histroy_DDBox + "</tbody><tfoot>" + buttonTfoot + "</tfoot></table>");
			//初始化首页
			var getdata="";
			gotoFirstPage(_this.options);
			
			$(_this.$element.selector + ' select').val(_this.options.pageNUmber);
			if(Math.ceil(_this.options.pageLength / _this.options.pageNUmber) < 2) {
				$(_this.$element.selector + ' .endPage').hide();
				$(_this.$element.selector + ' .nextPage').hide();
			}
			$(_this.$element.selector + ' .tfootRight input').unbind('keyup').keyup(function() {
				_this.inputKeyup(_this, maxpagenumberBox, json);
			})
			$(_this.$element.selector + ' .tfootRight button').unbind('click').click(function() {
				_this.button(_this, maxpagenumberBox, json);
				gotoDesignPage($(".tfootRight input")[0].value,_this.options);
			});
			$(_this.$element.selector + ' .firstPage').unbind('click').click(function() {
				_this.firstPage(_this, maxpagenumberBox, json);
				gotoFirstPage(_this.options);
			});
			$(_this.$element.selector + ' .endPage').unbind('click').click(function() {
				_this.endPage(_this, maxpagenumberBox, json);
				var mmm = _this.options;
				gotoEndPage(mmm);
			});
			$(_this.$element.selector + ' .nextPage').unbind('click').click(function() {
				_this.nextPage(_this, maxpagenumberBox, json);
				gotoNextPage($(_this.$element.selector + " .typeNumber").val(),_this.options);
			});
			$(_this.$element.selector + ' table tfoot ul li').unbind('click').click(function() {
				_this.nextTableLi(_this, maxpagenumberBox, json, $(this));
				gotoDesignPage($(this)[0].innerHTML,_this.options);
			});
			$(_this.$element.selector + ' .lastPage').unbind('click').click(function() {
				_this.lastPage(_this, maxpagenumberBox, json);
				gotoLastPage($(_this.$element.selector + " .typeNumber").val(),_this.options);
			});
			$(_this.$element.selector + ' select').unbind('change').change(function() {
				_this.select(_this, maxpagenumberBox, json, $(this));
			});
			$(_this.$element.selector + ' tbody tr').unbind('dblclick').dblclick(function() {
				_this.options.dbTrclick($(this));
			});
		},
		inputKeyup: function(e, maxpagenumberBox, json) {
			var val = $(e.$element.selector + " .tfootRight input").val();
			if(val == 0) {
				var val2 = val.replace(0, "");
			} else if(val > 0 && val <= Math.ceil(e.options.pageLength / 10)) {
				var val2 = val.replace(/[^0-9]/g, "");
			} else if(val > Math.ceil(e.options.pageLength / 10)) {
				var val2 = Math.ceil(e.options.pageLength / 10);
			}
			$(e.$element.selector + ' .tfootRight input').val(val2);
		},
		button: function(e, maxpagenumberBox, json) {
			var val = $(e.$element.selector + ' .tfootRight input').val();
			$(e.$element.selector + " .typeNumber").val(val);
			if(val != "") {
				e.page($(e.$element.selector + " .typeNumber").val(), 10, maxpagenumberBox, json, e.$element, e);
			}
		},
		firstPage: function(e, maxpagenumberBox, json) {
			$(e.$element.selector + " .typeNumber").val(1);
			console.log(JSON.stringify(e));
			e.page($(e.$element.selector + " .typeNumber").val(), 10, maxpagenumberBox, json, e.$element, e);
		},
		endPage: function(e, maxpagenumberBox, json) {
			
			$(e.$element.selector + " .typeNumber").val(Math.ceil(e.options.pageLength / 10));
			e.page($(e.$element.selector + " .typeNumber").val(), 10, maxpagenumberBox, json, e.$element, e);
			
		},
		nextPage: function(e, maxpagenumberBox, json) {
			var number = $(e.$element.selector + " .typeNumber").val();
			$(e.$element.selector + " .typeNumber").val(number * 1 + 1);
			e.page($(e.$element.selector + " .typeNumber").val(), 10, maxpagenumberBox, json, e.$element, e);
		},
		nextTableLi: function(e, maxpagenumberBox, json, that) {
			var val = that.html();
			$(e.$element.selector + " .typeNumber").val(val);
			e.page($(e.$element.selector + " .typeNumber").val(), 10, maxpagenumberBox, json, e.$element, e);
		},
		lastPage: function(e, maxpagenumberBox, json) {
			var number = $(e.$element.selector + " .typeNumber").val();
			console.log("------------"+number+"------------");
			if(number > 1) {
				$(e.$element.selector + " .typeNumber").val(number * 1 - 1);
				e.page($(e.$element.selector + " .typeNumber").val(), 10, maxpagenumberBox, json, e.$element, e);
			}
		},
		select: function(e, maxpagenumberBox, json, that) {
			var select = that.find("option:selected").val();
			$(e.$element.selector + " .typeNumber").val(1);
			e.options.pageNUmber = select;
			e.page($(e.$element.selector + " .typeNumber").val(), e.options.pageNUmber, maxpagenumberBox, json, e.$element, e);
		},
		page: function(Pagenumber, pageNUmber, maxpagenumberBox, json, that, e) {
			var histroy_DDBox = "";
			var histroy_DD = "";
			pageNUmber = 10;
			$(that.selector + " table tbody").html(histroy_DD);
			console.log("------------"+Pagenumber+"------------");
			console.log("------------"+e.options.pageLength+"------------");
			console.log("------------"+pageNUmber+"------------");
			console.log("------------"+Math.ceil(e.options.pageLength / pageNUmber)+"------------");
			
			
			var lastPage = Pagenumber < Math.ceil(e.options.pageLength / pageNUmber) ? Pagenumber * pageNUmber : e.options.pageLength;
			console.log("------------"+lastPage+"------------");
			
			
			for(var i = (Pagenumber - 1) * pageNUmber; i < lastPage; i++) {
				var bodyBigBox = "";
				var bodyBox = "";
				console.log(e.options.body.length);
				for(var x = 0; x < e.options.body.length; x++) {
					var type = e.options.body[x];
					var display = "table-cell";
					if(e.options.body.length > e.options.title.length && e.options.display[x] != undefined) {
						display = e.options.display[x] * 1 == 1 ? "table-cell" : "none";
					}
					//bodyBox+="<td class='"+type+"'  style='display:"+display+"'>"+json[i][type]+"</td>";
					bodyBox += "<td class='" + type + "'  style='display:" + display + "'></td>";
					bodyBigBox = bodyBox;
				}
				histroy_DD += "<tr class='new_productBox'>" + bodyBigBox + "</tr>";
				histroy_DDBox = histroy_DD;
			}
//			console.log(histroy_DD);
			$(that.selector + " table tbody").html(histroy_DD);
			var maxpagenumberBoxBigbox = "";
			var maxpagenumberBoxBig = "";
			if(Math.ceil(e.options.pageLength / 10) < maxpagenumberBox) {
				for(var i = 0; i < Math.ceil(e.options.pageLength / 10); i++) {
					var className = "";
					if(i == 0) {
						className = "pagenumberBoxLi";
					}
					maxpagenumberBoxBig += '<li class="eachli ' + className + '">' + (i * 1 + 1) + '</li>';
					maxpagenumberBoxBigbox = maxpagenumberBoxBig;
				}
			} else {
				for(var i = 0; i < maxpagenumberBox; i++) {
					var className = "";
					if(i == 0) {
						className = "pagenumberBoxLi";
					}
					maxpagenumberBoxBig += '<li class="eachli ' + className + '">' + (i * 1 + 1) + '</li>';
					maxpagenumberBoxBigbox = maxpagenumberBoxBig;
				}
			}
			$(that.selector + " table tfoot ul").html(maxpagenumberBoxBigbox);
			if(Pagenumber == 1) {
				$(that.selector + " .firstPage," + that.selector + " .lastPage").hide();
			} else {
				$(that.selector + " .firstPage," + that.selector + " .lastPage").show();
			}
			if(Pagenumber == Math.ceil(e.options.pageLength / pageNUmber)) {
				$(that.selector + " .endPage," + that.selector + " .nextPage").hide();
			} else {
				$(that.selector + " .endPage," + that.selector + " .nextPage").show();
			}
			if(Math.ceil(e.options.pageLength / pageNUmber) > maxpagenumberBox) {
				if(Pagenumber > 0 && Pagenumber < Math.ceil(maxpagenumberBox / 2) * 1 + 1) {
					maxpagenumberBoxBigbox = "";
					maxpagenumberBoxBig = "";
					for(var i = 0; i < maxpagenumberBox; i++) {
						maxpagenumberBoxBig += '<li class="eachli">' + (i * 1 + 1) + '</li>';
						maxpagenumberBoxBigbox = maxpagenumberBoxBig;
					}
					$(that.selector + " .pagenumberBox").html(maxpagenumberBoxBigbox);
					$(that.selector + ' .pagenumberBox li').eq(Pagenumber - 1).addClass('pagenumberBoxLi');
				} else if(Pagenumber >= Math.ceil(maxpagenumberBox / 2) * 1 + 1 && Pagenumber < Math.ceil(e.options.pageLength / pageNUmber) - Math.ceil(maxpagenumberBox / 2) + 2) {
					maxpagenumberBoxBigbox = "";
					maxpagenumberBoxBig = "";
					for(var i = Pagenumber - Math.ceil(maxpagenumberBox / 2) + 1; i < Pagenumber * 1 + Math.ceil(maxpagenumberBox / 2) * 1; i++) {
						maxpagenumberBoxBig += '<li class="eachli">' + (i) + '</li>';
						maxpagenumberBoxBigbox = maxpagenumberBoxBig;
					}
					$(that.selector + " .pagenumberBox").html(maxpagenumberBoxBigbox);
					$(that.selector + ' .pagenumberBox li').eq(Math.ceil(maxpagenumberBox / 2) - 1).addClass('pagenumberBoxLi');
				} else if(Pagenumber >= Math.ceil(e.options.pageLength / pageNUmber) - Math.ceil(maxpagenumberBox / 2) + 2 && Pagenumber <= Math.ceil(e.options.pageLength / pageNUmber)) {
					maxpagenumberBoxBigbox = "";
					maxpagenumberBoxBig = "";
					for(var i = Math.ceil(e.options.pageLength / pageNUmber) - maxpagenumberBox; i < Math.ceil(e.options.pageLength / pageNUmber); i++) {
						maxpagenumberBoxBig += '<li class="eachli">' + (i * 1 + 1) + '</li>';
						maxpagenumberBoxBigbox = maxpagenumberBoxBig;
					}
					$(that.selector + " .pagenumberBox").html(maxpagenumberBoxBigbox);
					$(that.selector + ' .pagenumberBox li').eq(Pagenumber - Math.ceil(e.options.pageLength / pageNUmber) + maxpagenumberBox * 1 - 1).addClass('pagenumberBoxLi');
				}
			} else {
				if(Pagenumber <= Math.ceil(e.options.pageLength / pageNUmber)) {
					$(that.selector + ' .pagenumberBox li').removeClass('pagenumberBoxLi');
					$(that.selector + ' .pagenumberBox li').eq(Pagenumber - 1).addClass('pagenumberBoxLi');
				}
			}
			$(that.selector + ' table tfoot ul li').unbind('click').click(function() {
				e.nextTableLi(e, maxpagenumberBox, json, $(this));
				gotoDesignPage($(this)[0].innerHTML,e.options);
			});
			$(that.selector + ' tbody tr').unbind('dblclick').dblclick(function() {
				e.options.dbTrclick($(this));
			});
		}

	}
	$.fn.CJJTable = function(options) {
		var cjj = new cjjTable(this, options);
		return cjj.start();
	}
})(jQuery, window, document);

function gotoDesignPage(number,obj) {
	var re = /^[0-9]+.?[0-9]*/;
	if(!re.test(number)) {
		console.log("输入框的值为空");　
	} else {
//		console.log("点击了指定页,即第" + number + "页");
		//console.log("表格数据:"+JSON.stringify(obj));
//		if (number == 10) {
//			gotoEndPage(obj)
//		}
	}
}
function gotoFirstPage(obj){
	getdata = [{"number": "1","model": "G6200","chip": "8H81","target_product": "a1","modification": "2","reason": "11111","state": "6.0","author": "林心旺","time": "2018/3/12","history": "<a class='examine' href='#'>查看</a>"}, {"number": "2","model": "G7200","chip": "8H81","target_product": "a1","modification": "2","reason": "11111","state": "6.0","author": "林心旺","time": "2018/3/12","history": "<a class='examine' href='#'>查看</a>"},{"number": "3","model": "G9300","chip": "8H81","target_product": "a1","modification": "2","reason": "11111","state": "6.0","author": "林心旺","time": "2018/3/12","history": "<a class='examine' href='#'>查看</a>"},{"number": "4","model": "X6","chip": "8H81","target_product": "a1","modification": "2","reason": "11111","state": "6.0","author": "林心旺","time": "2018/3/12","history": "<a class='examine' href='#'>查看</a>"},{"number": "5","model": "M9","chip": "8H81","target_product": "a1","modification": "2","reason": "11111","state": "6.0","author": "林心旺","time": "2018/3/12","history": "<a class='examine' href='#'>查看</a>"},{"number": "6","model": "Q8","chip": "8H81","target_product": "a1","modification": "2","reason": "11111","state": "6.0","author": "林心旺","time": "2018/3/12","history": "<a class='examine' href='#'>查看</a>"},{"number": "7","model": "M9","chip": "8H81","target_product": "a1","modification": "2","reason": "11111","state": "6.0","author": "林心旺","time": "2018/3/12","history": "<a class='examine' href='#'>查看</a>"},{"number": "8","model": "M8","chip": "8H81","target_product": "a1","modification": "2","reason": "11111","state": "6.0","author": "林心旺","time": "2018/3/12","history": "<a class='examine' href='#'>查看</a>"},{"number": "9","model": "M3","chip": "8H81","target_product": "a1","modification": "2","reason": "11111","state": "6.0","author": "林心旺","time": "2018/3/12","history": "<a class='examine' href='#'>查看</a>"},{"number": "10","model": "A2","chip": "8H81","target_product": "a1","modification": "2","reason": "11111","state": "6.0","author": "林心旺","time": "2018/3/12","history": "<a class='examine' href='#'>查看</a>"}];
	insetTable(getdata,obj);
}
function gotoEndPage(obj){
//	console.log(obj);
	var endnumber = Math.ceil(obj.pageLength/obj.pageNUmber);
//	console.log("点击了尾页,即第"+endnumber+"页");
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
//	console.log(data);
//	console.log(_curLength);
	for (var i=0; i<obj.body.length; i++) {
		_curValue = obj.body[i];
		for (var j=0; j<_curLength; j++) {
			$('.'+_curValue)[j].innerHTML = data[j][_curValue];
		}
	}
}
