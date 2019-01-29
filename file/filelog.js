var fs = require('fs');
var os = require('os');
var path = require('path');
// 写LOG

function WriterLog(){}

WriterLog.prototype.w = function(text1)
{
    var timestamp = Date.parse(new Date());
    var newDate = new Date();
    newDate.setTime(timestamp);
    var str = newDate.toLocaleString();
    
    fs.exists(getLogFileName(), function(exists) {  
        if (!exists)
            fs.writeFileSync(getLogFileName(), "\n");
    });
    
    fs.appendFileSync(getLogFileName(), str + " : ");
    fs.appendFileSync(getLogFileName(), text1);
}

WriterLog.prototype.checkLogFile = function()
{
    var fileName = getLogFileName();
    
    fs.exists(fileName, function(exists){
        if(exists){
            //console.log("文件存在")
        }
        if(!exists){
            fs.writeFileSync(fileName, "\n");
        }
    });
}

function getLogFileName()
{
    if (os.platform() == "win32")
    {
        return "D:\\scm_log_for_generate.log";
    }
    else
    {
        var dir = os.homedir();
        //console.log("########################################################  " + dir);
        return dir + "/scm_log_for_generate.log";
    }
}



var writerlog = new WriterLog();


module.exports = writerlog;
