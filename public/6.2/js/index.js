document.write("<script language=javascript src='../js/bootstrap.addtabs.js' charset=\"utf-8\"></script>");

var loginusername = null; //访问session之后存取登录用户名
var loginlevel = null;
var loginEmail = null; //当前用户的邮箱地址
var loginStatus = null;
var coocaaVersion = "/v6.5";

$(function() {
	sendHTTPRequest("/verify", '{}', loginResult);
	buttonInit();
});

function buttonInit() {
	$(".everyButton").click(function() {
		var _focusIndex = $(".everyButton").index($(this));
		console.log(_focusIndex);
		if(_focusIndex != 0) {
			//if($(".everyDiv")[_focusIndex - 1].style.display == "none") {
				//$(".everyDiv").slideUp();
			//}
			$(".everyDiv:eq(" + (_focusIndex - 1) + ")").slideToggle();
		} else {
			//$(".everyDiv").slideUp();
		}
	});
	$("#index_exit").click(function() {
		var node2 = '{"userName":"' + loginusername + '","action":"退出","detail":"0"}';
        sendHTTPRequest("/logout", node2, logOutResult);
	});
	$(".eachpage").click(function() {
		var _focusIndex = $(".eachpage").index($(this));
		console.log(_focusIndex);
		for (var i=0; i<$(".glyphiconss").length; i++) {
			$(".glyphiconss:eq(" + i + ")").css("color", "#0FB3D6");
		}
		$(".glyphiconss:eq(" + _focusIndex + ")").css("color", "orangered");
	});
	$("#index_branch").hover(function(){
	    $("#CoocaaVersionFlag").css("color","red");
	    $("#CoocaaVersion").css("color","red");
	    },function(){
	    $("#CoocaaVersionFlag").css("color","white");
	    $("#CoocaaVersion").css("color","white");
	});
}

function loginResult() {
	if(this.readyState == 4) {
		console.log("this.responseText = " + this.responseText);
		if(this.status == 200) {
			var data = JSON.parse(this.responseText);
			console.log(data);
			loginStatus = data.resultCode;
			resultCodeState(data.resultCode,data.resultDesc);
			if(data.resultCode == "0") {
				document.getElementById('homePage').style.display = "block";
				Addtabs.add({
					id: 'userMenu1',
					title: '配置文件管理',
					url: 'page1.html',
					ajax: false
				});
				loginusername = data.resultData.username;
				loginEmail = data.resultData.email;
				loginlevel = data.resultData.level;
				document.getElementById("indexUserName").innerHTML = loginusername;
				if(loginlevel == "0") {
					$("#adminVisible1").css("display","none");
					$("#adminVisible2").css("display","none");
				} else if(loginlevel == "1") {
					$("#adminVisible1").css("display","inline");
					$("#adminVisible2").css("display","block");
				}
			} else {
				console.log("未登录");
				document.location.href="../../html/login.html";
			}
		}
		if(loginStatus == 0){
			var node2 = '{"userName":"' + loginusername + '","action":"登录","detail":"1"}';
        	sendHTTPRequest(coocaaVersion+"/syslog/add", node2, loginLogresult);
		}
	}
}

function logOutResult(){
	if(this.readyState == 4) {
		if(this.status == 200)
		{
			var data = JSON.parse(this.responseText);
			console.log(data);
			if(data.resultCode == "0") {
				document.location.href="../../html/login.html";
			}
			resultCodeState(data.resultCode,data.resultDesc);
		}
	}
}
function loginLogresult(){
	if (this.readyState == 4) {
        console.log("this.responseText = " + this.responseText);
        if (this.status == 200){
            var data = JSON.parse(this.responseText);
            console.log(data);
            if (data.resultCode == "0") {
            	console.log("push 111 success.");
            }else{
                console.log("push 111 failure.");
	    	};
	    	resultCodeState(data.resultCode,data.resultDesc);
        }
        var statusObj = {
			"userName" : loginusername,
			"level" : loginlevel
		}
		var _status = JSON.stringify(statusObj);
		var node = '{"data":' + _status + '}';
		console.log(node);
        sendHTTPRequest(coocaaVersion+"/product/queryAuditByUser", node, audioDataRresult);
    }
}
function audioDataRresult(){
	if (this.readyState == 4) {
        if (this.status == 200){
            var data = JSON.parse(this.responseText);
            console.log(data);
            resultCodeState(data.resultCode,data.resultDesc);
            if (data.resultCode == "0") {
            	console.log(data.resultData[0].length);
            	console.log(data.resultData[1].length);
        		if (data.resultData[0].length == 0) {
            		document.getElementsByClassName("email")[1].style.display = "none";
            	}else{
            		document.getElementsByClassName("email")[1].style.display = "inline-block";
            	}
            	if (data.resultData[1].length == 0) {
            		document.getElementsByClassName("email")[2].style.display = "none";
            	}else{
            		document.getElementsByClassName("email")[2].style.display = "inline-block";
            	}
            	if (data.resultData[0].length == 0&&data.resultData[1].length == 0) {
            		console.log("1111");
            		document.getElementsByClassName("email")[0].style.display = "none";
            	}else{
            		console.log("2222");
            		document.getElementsByClassName("email")[0].style.display = "block";
            	}
            }
        }
    }
}

function resultCodeState(num,str){
	var _str = str.substr(str.length-4);
	console.log(num == -1 && _str == "拒绝访问");
	if (num == -1 && _str == "拒绝访问") {
		console.log("session失效");
	}
}
	
