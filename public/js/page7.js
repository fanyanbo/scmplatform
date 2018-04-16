document.write("<script language=javascript src='../js/sentHTTP.js' charset=\"utf-8\"></script>");

$(function() {
	$(".page7_boxes")[0].style.display = "block";
	var _curIndex = "";
	$(".page7_tabs").click(function() {
		_curIndex = $(".page7_tabs").index($(this));
		console.log(_curIndex);
		for(var k = 0; k < $(".page7_tabs").length; k++) {
			$(".page7_boxes")[k].style.display = "none";
			$(".page7_tabs")[k].style.backgroundColor = "buttonface";
		}
		$(".page7_boxes")[_curIndex].style.display = "block";
		$(".page7_tabs")[_curIndex].style.backgroundColor = "red";
	});
	
});
