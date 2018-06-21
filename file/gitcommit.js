
////// 中文注释

var alldata;

function GitCommit(){}

GitCommit.prototype.commit = function(version, filelist, callback)
{
    alldata = "";
    
    alldata += version + "\n";
    
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
            
        alldata +=  chip_str + " " + 
                    model_str + " " + 
                    panel_str + " " + 
                    filelist[i].typeStr + " " + 
                    filelist[i].typeStr + " " + 
                    filelist[i].finalName + " " + 
                    filelist[i].tempName + "\n";
    }
    
    console.log(alldata);
    
}



















var gitcommit = new GitCommit();

module.exports = gitcommit;
