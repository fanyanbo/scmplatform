document.write("<script language=javascript src='../js/sentHTTP.js' charset=\"utf-8\"></script>");

var level = 0;//等级权限，0为管理员，1为一般用户
function loginfun() {
	var loginmsg = document.getElementById("logintxt");
    loginmsg.innerHTML = "　";
    
    var username = document.getElementById('username').value;
    var pwd = document.getElementById('password').value;
    
    var node = '{"data":{"username":"' + username + '","password":"' + pwd + '"}}';
    console.log(node);
    if (username != "" && pwd != "") {
    	document.location.href="index.html";
        //sendHTTPRequest("/fybv2_api/login", node, loginresult);
    }
    else if(username == ""){
        loginmsg.innerHTML += "请输入用户名！";
    }
    else{
        loginmsg.innerHTML += "请输入密码！";
    }
}

function loginresult() {
    if (this.readyState == 4) {
        console.log("this.responseText = " + this.responseText);
        if (this.status == 200)
        {
            var data = JSON.parse(this.responseText);
            if (data.msg == "success") {
                document.location.href="index.html";
            }
            else if (data.msg == "failure") {
                if (data.code == "-1") {
                	console.log("请输入正确用户名或密码");
        	    	var loginmsg = document.getElementById("logintxt");
                    loginmsg.innerText = "请输入正确用户名或密码！";
                    setTimeout("document.getElementById('logintxt').innerHTML='　'",3000);
                }else{
                	console.log("登录失败");
                    var loginmsg = document.getElementById("logintxt");
                    loginmsg.innerText = "登录失败";
                }
	    	};
        }
    }
}
function keyLogin(){
    if (event.keyCode==13)   //回车键的键值为13
     document.getElementById("loginbutton").click();  //调用登录按钮的登录事件
}