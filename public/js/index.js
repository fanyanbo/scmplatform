document.write("<script language=javascript src='../js/bootstrap.addtabs.js' charset=\"utf-8\"></script>");

var adminFlag = null; //访问session之后存取管理员标志位
var loginusername = null; //访问session之后存取登录用户名
var loginEmail = null; //当前用户的邮箱地址
var loginStatus = null;

$(function() {
	sendHTTPRequest("/verify", '{}', loginResult);
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
		sendHTTPRequest("/logout", '{}', logOutResult);
	});
}

function loginResult() {
	if(this.readyState == 4) {
		console.log("this.responseText = " + this.responseText);
		if(this.status == 200) {
			var data = JSON.parse(this.responseText);
			console.log(data);
			loginStatus = data.resultCode;
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
		if(loginStatus == 0){
			var node2 = '{"userName":"' + loginusername + '","action":"登录","detail":"1"}';
        	sendHTTPRequest("/syslog/add", node2, loginLogresult);
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
				loginStatus = 1;
			}
		}
		if(loginStatus == 1){
			var node2 = '{"userName":"' + loginusername + '","action":"退出","detail":"0"}';
        	sendHTTPRequest("/syslog/add", node2, logoutLogresult);
		}
	}
}
function logoutLogresult(){
	if (this.readyState == 4) {
        console.log("this.responseText = " + this.responseText);
        if (this.status == 200)
        {
            var data = JSON.parse(this.responseText);
            console.log(JSON.stringify(data));
            if (data.resultCode == "0") {
            	console.log("push 222 success.");
            	document.location.href="login.html";
            }
            else{
                console.log("push 222 failure.");
	    	};
        }
    }
}
function loginLogresult(){
	if (this.readyState == 4) {
        console.log("this.responseText = " + this.responseText);
        if (this.status == 200)
        {
            var data = JSON.parse(this.responseText);
            console.log(JSON.stringify(data));
            if (data.resultCode == "0") {
            	console.log("push 111 success.");
            }
            else{
                console.log("push 111 failure.");
	    	};
        }
    }
}