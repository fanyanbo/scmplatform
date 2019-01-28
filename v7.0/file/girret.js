var fs = require('fs');

var net = require('net');
var writerlog = require("./filelog");

////// 中文注释
var alldata;
var HOST = '127.0.0.1';
var PORT = 10241;

function GirritCommit(){}

GirritCommit.prototype.commit = function(tempdir, commit_sn, version, commitText, branch, filelist, callback)
{
    alldata = "";
    
    alldata += "commit_sn=" + commit_sn + "\n";
	alldata += "tempdir=" + tempdir + "\n";
    alldata += "version=" + version + "\n";
    alldata += "branch=" + branch + "\n";
    
    for (var i in filelist)
    {
        var chip_str;
        var model_str;
        var panel_str;
        
        if (filelist[i].chip == null)
            chip_str = "/";
        else
            chip_str = filelist[i].chip;
            
        if (filelist[i].model == null)
            model_str = "/";
        else
            model_str = filelist[i].model;
            
        if (filelist[i].panel == null)
            panel_str = "/";
        else
            panel_str = filelist[i].panel;
            
        alldata +=  "fileinfo=" + 
                    chip_str + " " + 
                    model_str + " " + 
                    panel_str + " " + 
                    filelist[i].typeStr + " " + 
                    filelist[i].finalName + " " + 
                    filelist[i].tempName + "\n";
    }
	
	alldata += "commitText=" + commitText + "\n";

	var actionFileName = tempdir + "girret_info_" + commit_sn + ".txt";
	fs.writeFileSync(actionFileName, alldata);

	/*
    var length = alldata.length;
    var FLAG = "WXYZ";
    var lenstr = PrefixInteger(length, 12);
    var all = FLAG + lenstr + alldata;
    
    //console.log(all);
    console.log("send data to tcp, size = " + length);
    
    var client = new net.Socket();
    
    client.setEncoding('binary');
    client.connect(PORT, HOST, function() {

        console.log('connect to : ' + HOST + ' : ' + PORT);
        // 建立连接后立即向服务器发送数据，服务器将收到这些数据 
        client.write(all);
        
        if (callback != null)
            callback(0, "");
    });
    
    // 为客户端添加“data”事件处理函数
    // data是服务器发回的数据
    
    client.on('data', function(data) {
    
        console.log('DATA: ' + data);
        // 完全关闭连接
        client.destroy();
    });

    // 为客户端添加“close”事件处理函数
    client.on('close', function() {
        console.log('Connection closed');
        writerlog.w('Connection closed\n');
    });

    client.on('error', function(errortext) {
        console.log('Connection error: ' + errortext);
        writerlog.w('Connection error: ' + errortext + '\n');
    });
	*/
}

// 整数转换为字符串, 12位,前面置0 
function PrefixInteger(num, n)
{
    return (Array(n).join(0) + num).slice(-n);
}

var girritcommit = new GirritCommit();

module.exports = girritcommit;

