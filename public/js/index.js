document.write("<script language=javascript src='../js/bootstrap.addtabs.js' charset=\"utf-8\"></script>");

var adminFlag = null; //访问session之后存取管理员标志位
var loginusername = null; //访问session之后存取登录用户名
var loginEmail = null; //当前用户的邮箱地址

$(function() {
	sendHTTPRequest("/verify", '{}', loginInResult);
	buttonInit();
});

function buttonInit() {
	var _focusIndex = "";
	$(".everyButton").click(function() {
		_focusIndex = $(".everyButton").index($(this));
		console.log(_focusIndex);
		if(_focusIndex != 0) {
			if($(".everyDiv")[_focusIndex - 1].style.display == "none") {
				$(".everyDiv").slideUp();
			}
			$(".everyDiv:eq(" + (_focusIndex - 1) + ")").slideToggle();
		} else {
			$(".everyDiv").slideUp();
		}
	});
	$("#index_exit").click(function() {
		sendHTTPRequest("/logout", '{}', loginOutResult);
	});
}

function loginInResult() {
	if(this.readyState == 4) {
		if(this.status == 200) {
			var data = JSON.parse(this.responseText);
			console.log(data);
			if(data.resultCode == "0") {
				document.getElementById('homePage').style.display = "block";
				Addtabs.add({
					id: 'userMenu1',
					title: '配置文件管理',
					url: 'page1.html',
					ajax: false
				});
				loginusername = data.resultData.username;
				//loginEmail = data.resultData.email;
				document.getElementById("indexUserName").innerHTML = loginusername;
				if(data.resultData.level == "1") {
					adminFlag = 1; //非管理员标志位                
					$("#adminVisible")[0].style.display = "none";
				} else if(data.resultData.level == "0") {
					adminFlag = 0;
				}
				
			} else {
				console.log("未登录");
				document.location.href = "login.html";
			}
		}
	}
}

function loginOutResult(){
	if(this.readyState == 4) {
		if(this.status == 200)
		{
			var data = JSON.parse(this.responseText);
			console.log(data);
			if(data.resultCode == "0") {
				document.location.href = "login.html";
			}
		}
	}
}
