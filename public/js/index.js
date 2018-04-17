document.write("<script language=javascript src='../js/bootstrap.addtabs.js' charset=\"utf-8\"></script>");

var adminFlag = null;   //访问session之后存取管理员标志位
var loginusername = null;  //访问session之后存取登录用户名
var loginEmail = null;   //当前用户的邮箱地址

$(function() {
	forsession();
	homePageInfo();
	buttonInit();
});

function buttonInit(){
	var _focusIndex = "";
	$(".everyButton").click(function() {
		_focusIndex = $(".everyButton").index($(this));
		console.log(_focusIndex);
		if(_focusIndex != 0) {
			if($(".everyDiv")[_focusIndex - 1].style.display == "none") {
				$(".everyDiv").slideUp();
				$(".everyDiv:eq("+(_focusIndex - 1)+")").slideToggle();
			}
		} else {
			$(".everyDiv").slideUp();
		}
	});
	$("#index_exit").click(function() {
		document.location.href = "login.html";
	});
}
//访问session接口
function forsession(){
    wrongData();
    //sendHTTPRequest("/fybv2_api/session", '{"data":""}', sessionresult);
}

function homePageInfo(){
	sendHTTPRequest("/api/v1/home/getSummary", '{"data":""}', homePageInfoResult);    
}

//session返回数据
function sessionresult(){
    console.log("this.readyState = " + this.readyState);
    if (this.readyState == 4) {
        console.log("this.status = " + this.status);
        console.log("this.responseText = " + this.responseText);
        if (this.status == 200)
        {
            var data = JSON.parse(this.responseText);
            if (data.msg == "success") {
                document.getElementById('homePage').style.display="block";
                Addtabs.add({
                    id: 'userMenu1',
                    title: '配置文件管理',
                    // content: 'content',
                    url: 'wait.html',
                    ajax: false
                });
                loginusername = data.data.data.author;
                document.getElementById("indexUserName").innerHTML = loginusername;
                if (data.data.data.adminFlag == "1") {
                    adminFlag = 1;   //非管理员标志位                
                    // console.log(loginusername);
                    for (var i = 1; i < 5; i++) {//隐藏左边管理员的部分
                        document.getElementById("_hidden"+i).style.display="block";
                    };
                }
                else if (data.data.data.adminFlag == "0") {
                    adminFlag = 0;
                }
            }
            else {
                console.log("未登录");
                document.location.href="login.html" ;  
            }            
        }
        sendHTTPRequest("/fybv2_api/userQuery", '{"data":{"condition":{"userName":"' + loginusername + '"}}}', userInfoResult);    
    }
}

function userInfoResult(){
    if (this.readyState == 4) {
        if (this.status == 200) //TODO
        {
            var data = JSON.parse(this.responseText);
            if (data.msg == "success") {
                // console.log(data);
                loginEmail = data.data[0].email;
                // console.log("邮箱地址："+loginEmail);
            }
        }
    }
}

function wrongData(){
	document.getElementById('homePage').style.display="block";
    Addtabs.add({
        id: 'userMenu1',
        title: '首页',
        // content: 'content',
        url: 'page1.html',
        ajax: false
    });
    loginusername = "linxinwang";
    document.getElementById("indexUserName").innerHTML = loginusername;
    adminFlag = "0";
    if (adminFlag == "1") {
      	adminFlag = 1;   //非管理员标志位
    	document.getElementById("adminVisible").style.display = "none";
    }else if (adminFlag == "0") {
      	adminFlag = 0;
    }
}

function homePageInfoResult(){
	if (this.readyState == 4) {
        if (this.status == 200)
        {
            var data = JSON.parse(this.responseText);
            console.log(data);
            if (data.msg == "success") {
                // console.log(data);
            }
        }
    }
}
