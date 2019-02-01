var fs = require('fs');
var writerlog = require("./filelog");

var infoText = "";
var alldata = "";

function GerritCommit(){}

GerritCommit.prototype.commit = function(tempdir, gitpath, commit_sn, version, commitText, branch, filelist, callback)
{
	infoText = "";
    alldata = "";
    
    alldata += "commit_sn=" + commit_sn + "\n";
	alldata += "tempdir=" + tempdir + "\n";
    alldata += "version=" + version + "\n";
    alldata += "branch=" + branch + "\n";
	alldata += "gitpath=" + gitpath + "\n";
    
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

	var actionFileName = tempdir + "gerrit_info_" + commit_sn + ".txt";
	fs.writeFileSync(actionFileName, alldata);
	
	// 执行提交gerrit命令	
	var spawn = require('child_process').spawn;
    var free = spawn('scmgit', [actionFileName]);
    
    // 捕获标准输出并将其打印到控制台 
    free.stdout.on('data', function (data) {
		console.log("" + data);
    }); 
    
    // 捕获标准错误输出并将其打印到控制台 
    free.stderr.on('data', function (data) { 
		console.log('stderr output:\n' + data); 
		infoText += data;
    }); 
    
    // 注册子进程关闭事件 
    free.on('exit', function (code, signal) { 
		console.log('child process eixt ,exit:' + code); 
		//if (callback != null) 
		//{
		//	callback(code, infoText);
		//}
		//deleteTempFiles();
    });

	console.log('execute scmgit command\n'); 
	if (callback != null)
		callback(0, "");
}

// 整数转换为字符串, 12位,前面置0 
function PrefixInteger(num, n)
{
    return (Array(n).join(0) + num).slice(-n);
}

var gerritcommit = new GerritCommit();

module.exports = gerritcommit;

