var fs = require('fs');
var os = require('os');

// 写LOG

function WriterLog(){}

WriterLog.prototype.w = function(text1)
{
    var timestamp = Date.parse(new Date());
    var newDate = new Date();
    newDate.setTime(timestamp);
    var str = newDate.toLocaleString();
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
        return "D:\\scmplatform_file_writer_log.txt";
    }
    else
    {
        return "/home/scmplatform/scmplatform_file_writer_log.txt";
    }
}



var writerlog = new WriterLog();


module.exports = writerlog;
