var fs = require('fs');
var writerlog = require("./filelog");

function SettingFiles(){}

////  测试时

SettingFiles.prototype.generate = function(chip, model, panel, obj, tmpdir, genFileCallBack)
{
    let x,y,z;
    
    console.log(chip);
    console.log(model);
    //console.log(obj);
    console.log(tmpdir);
    
    if (obj.type == "system_settings")
    {
        write_setting_main_xml(obj.result, chip, model, panel, tmpdir, genFileCallBack);
        write_setting_guide_xml(obj.result, chip, model, panel, tmpdir, genFileCallBack);
        write_setting_connect_xml(obj.result, chip, model, panel, tmpdir, genFileCallBack);
        write_setting_general_xml(obj.result, chip, model, panel, tmpdir, genFileCallBack);
        write_market_show_configuration_xml(obj.result, chip, model, panel, tmpdir, genFileCallBack);
        write_ssc_item_xml(obj.result, chip, model, panel, tmpdir, genFileCallBack);
        setting_picture_sound(obj.result, chip, model, panel, tmpdir, genFileCallBack);
        write_panel_common_pq_ini(obj.result, chip, model, panel, tmpdir, genFileCallBack);
        write_panel_common_board_ini(obj.result, chip, model, panel, tmpdir, genFileCallBack);
    }
}

// setting_main.xml
function write_setting_main_xml(sqlresult, chip, model, panel, tmpdir, genFileCallBack)
{
    var x;
    var fileinfo = new Array();
    var tmpFileName = tmpdir + chip + "_" + model + "_" + panel + "-setting_main.xml";
    
    writerlog.w("生成临时的 setting_main.xml \n");
    
    x = 0;
    for (let i in sqlresult)
    {
        let item = sqlresult[i];
        
        //console.log(item);
        //console.log("AAAAAAAA : " + item.xmlFileName);
        
        if (item.xmlFileName == "setting_main.xml")
        {
            //console.log(item);
            //console.log("AAAAAAAA : " + item.xmlFileName);
            fileinfo[x] = item;
            x++;
        }
    }
    
    fileinfo.sort(sequence_setting_main_xml);
    
    fs.writeFileSync(tmpFileName, '<?xml version="1.0" encoding="utf-8" ?>\n');
    fs.appendFileSync(tmpFileName, '<!--  setting_main.xml  --> \n');
    fs.appendFileSync(tmpFileName, "<Setting>\n");
    for (let i in fileinfo)
    {
        fs.appendFileSync(tmpFileName, "    ");
        fs.appendFileSync(tmpFileName, "<!-- ");
        fs.appendFileSync(tmpFileName, fileinfo[i].descText);
        fs.appendFileSync(tmpFileName, " -->\n    ");
        fs.appendFileSync(tmpFileName, fileinfo[i].xmlText);
        fs.appendFileSync(tmpFileName, "\n");
    }
    fs.appendFileSync(tmpFileName, "</Setting>\n");
    
    genFileCallBack(tmpFileName, "setting_main.xml", chip, model, panel, "setting_main");
}

function sequence_setting_main_xml(a, b)
{
    if (a.orderId > b.orderId)
        return 1;
    else if (a.orderId < b.orderId)
        return -1;
    else
        return 0;
}

// setting_guide.xml
function write_setting_guide_xml(sqlresult, chip, model, panel, tmpdir, genFileCallBack)
{
    var x;
    var fileinfo = new Array();
    var tmpFileName = tmpdir + chip + "_" + model + "_" + panel + "-setting_guide.xml";
    
    writerlog.w("生成临时的 setting_guide.xml \n");
    
    x = 0;
    for (let i in sqlresult)
    {
        let item = sqlresult[i];
        
        //console.log(item);
        //console.log("AAAAAAAA : " + item.xmlFileName);
        
        if (item.xmlFileName == "setting_guide.xml")
        {
            //console.log(item);
            //console.log("AAAAAAAA : " + item.xmlFileName);
            fileinfo[x] = item;
            x++;
        }
    }
    
    fileinfo.sort(sequence_setting_guide_xml);

    fs.writeFileSync(tmpFileName, '<?xml version="1.0" encoding="utf-8" ?>\n');
    fs.appendFileSync(tmpFileName, '<!--  setting_guide.xml  --> \n');
    fs.appendFileSync(tmpFileName, '<!--  \n');
    fs.appendFileSync(tmpFileName, '作用描述：酷开6.x系统开机引导配置文件setting_guide.xml \n');
    fs.appendFileSync(tmpFileName, '注意： \n');
    fs.appendFileSync(tmpFileName, '1、根据产品量产有无标配蓝牙遥控器来进行区分 \n');
    fs.appendFileSync(tmpFileName, '1）出厂标配蓝牙遥控器的产品需要放开最后一项BT配置项； \n');
    fs.appendFileSync(tmpFileName, '  另外，需要确认标配蓝牙遥控器是否支持按语音键进行一键配对，如支持，需要增加配置参数isSupportVoiceKeyPair="true"，配置为 \n');
    fs.appendFileSync(tmpFileName, '  <SettingGuide pageName="BT" className = "com.tianci.setting.connectsetting.btonekey.OneKeyActivity" isSupportVoiceKeyPair="true"/> \n');
    fs.appendFileSync(tmpFileName, '   不支持的话不需要配置此参数 \n');
    fs.appendFileSync(tmpFileName, '2）其它产品默认用前4项配置即可 \n');
    fs.appendFileSync(tmpFileName, '3）如此产品无网络，需要单独和项目经理沟通，看是否拿掉开机引导功能 \n');
    fs.appendFileSync(tmpFileName, '2、支持定制机拓展项 \n');
    fs.appendFileSync(tmpFileName, '1)二维码可以替换/system/pcfg/机芯_机型/尺寸/config/guide_qr.png来定制开机引导最后一幅二维码图片； \n');
    fs.appendFileSync(tmpFileName, '2）支持开机引导会员页酷开会员文案替换，配置 \n');
    fs.appendFileSync(tmpFileName, ' /system/pcfg/机芯_机型/尺寸/config/addon/chinese.xml \n');
    fs.appendFileSync(tmpFileName, ' <string name="guide_coocaa_member">会员</string> \n');
    fs.appendFileSync(tmpFileName, ' /system/pcfg/机芯_机型/尺寸/config/addon/english.xml \n');
    fs.appendFileSync(tmpFileName, ' <string name="guide_coocaa_member">Member</string> \n');
    fs.appendFileSync(tmpFileName, '3、文件放置位置 \n');
    fs.appendFileSync(tmpFileName, ' /system/pcfg/机芯_机型/尺寸/config目录 \n');
    fs.appendFileSync(tmpFileName, '--> \n');
    
    fs.appendFileSync(tmpFileName, "<Setting>\n");
    for (let i in fileinfo)
    {
        fs.appendFileSync(tmpFileName, "    ");
        fs.appendFileSync(tmpFileName, "<!-- ");
        fs.appendFileSync(tmpFileName, fileinfo[i].descText);
        fs.appendFileSync(tmpFileName, " -->\n    ");
        fs.appendFileSync(tmpFileName, fileinfo[i].xmlText);
        fs.appendFileSync(tmpFileName, "\n");
    }
    fs.appendFileSync(tmpFileName, "</Setting>\n\n\n");
    
    fs.appendFileSync(tmpFileName, '<!-- pageName="BT" 只有产品标配蓝牙遥控器才配置此项，此项配置的前提是内置蓝牙--> \n');
    fs.appendFileSync(tmpFileName, '<!--在需要配置此项的时候，需要确认标配蓝牙遥控器是否支持按语音键进行一键配对，如支持需要增加配置参数isSupportVoiceKeyPair="true"，不支持的话不需要配置此参数--> \n');
    fs.appendFileSync(tmpFileName, '<!--注意同机芯-机型不同尺寸标配蓝牙遥控器可能有所不同，如不清楚请找项目经理进行详细确认--> \n');
    
    genFileCallBack(tmpFileName, "setting_guide.xml", chip, model, panel, "setting_guide");
}

function sequence_setting_guide_xml(a, b)
{
    if (a.orderId > b.orderId)
        return 1;
    else if (a.orderId < b.orderId)
        return -1;
    else
        return 0;
}

// setting_connect.xml
function write_setting_connect_xml(sqlresult, chip, model, panel, tmpdir, genFileCallBack)
{
    var x;
    var fileinfo = new Array();
    var tmpFileName = tmpdir + chip + "_" + model + "_" + panel + "-setting_connect.xml";
    
    writerlog.w("生成临时的 setting_connect.xml \n");
    
    x = 0;
    for (let i in sqlresult)
    {
        let item = sqlresult[i];
        
        //console.log(item);
        //console.log("AAAAAAAA : " + item.xmlFileName);
        
        if (item.xmlFileName == "setting_connect.xml")
        {
            //console.log(item);
            //console.log("AAAAAAAA : " + item.xmlFileName);
            fileinfo[x] = item;
            x++;
        }
    }
    
    fileinfo.sort(sequence_setting_connect_xml);
    
    fs.writeFileSync(tmpFileName, '<?xml version="1.0" encoding="utf-8" ?>\n');
    fs.appendFileSync(tmpFileName, '<!--  setting_connect.xml  --> \n');
    fs.appendFileSync(tmpFileName, "<Setting>\n");
    for (let i in fileinfo)
    {
        fs.appendFileSync(tmpFileName, "    ");
        fs.appendFileSync(tmpFileName, "<!-- ");
        fs.appendFileSync(tmpFileName, fileinfo[i].descText);
        fs.appendFileSync(tmpFileName, " -->\n    ");
        fs.appendFileSync(tmpFileName, fileinfo[i].xmlText);
        fs.appendFileSync(tmpFileName, "\n");
    }
    fs.appendFileSync(tmpFileName, "</Setting>\n");
    
    genFileCallBack(tmpFileName, "setting_connect.xml", chip, model, panel, "setting_connect");
}

function sequence_setting_connect_xml(a, b)
{
    if (a.orderId > b.orderId)
        return 1;
    else if (a.orderId < b.orderId)
        return -1;
    else
        return 0;
}

// setting_general.xml
function write_setting_general_xml(sqlresult, chip, model, panel, tmpdir, genFileCallBack)
{
    var x;
    var curClass = "";
    var fileinfo = new Array();
    var tmpFileName = tmpdir + chip + "_" + model + "_" + panel + "-setting_general.xml";
    
    writerlog.w("生成临时的 setting_general.xml \n");
    
    x = 0;
    for (let i in sqlresult)
    {
        let item = sqlresult[i];
        
        //console.log(item);
        //console.log("AAAAAAAA : " + item.xmlFileName);
        
        if (item.xmlFileName == "setting_general.xml")
        {
            //console.log(item);
            //console.log("AAAAAAAA : " + item.xmlFileName);
            fileinfo[x] = item;
            x++;
        }
    }
    
    fileinfo.sort(sequence_setting_general_xml);
    
    fs.writeFileSync(tmpFileName, '<?xml version="1.0" encoding="utf-8" ?>\n');
    fs.appendFileSync(tmpFileName, '<!--  setting_general.xml  --> \n');
    fs.appendFileSync(tmpFileName, '<SettingItem name="SKY_CFG_TV_GENERAL_SETTING" type="TYPE_ROOT"> \n\n');
    for (let i in fileinfo)
    {
        if (curClass != fileinfo[i].xmlNode1)
        {
            if (i != 0)
            {
                fs.appendFileSync(tmpFileName, '    </SettingItem>\n\n');
            }
            fs.appendFileSync(tmpFileName, '    <SettingItem name="' + fileinfo[i].xmlNode1 + '" type="TYPE_TITLE">  \n');
            curClass = fileinfo[i].xmlNode1;
        }
        fs.appendFileSync(tmpFileName, "        ");
        fs.appendFileSync(tmpFileName, "<!-- ");
        fs.appendFileSync(tmpFileName, fileinfo[i].descText);
        fs.appendFileSync(tmpFileName, " -->\n        ");
        fs.appendFileSync(tmpFileName, fileinfo[i].xmlText);
        fs.appendFileSync(tmpFileName, "\n");
    }
    fs.appendFileSync(tmpFileName, "    </SettingItem>\n");
    fs.appendFileSync(tmpFileName, "</SettingItem>  \n\n\n\n\n");
    
    genFileCallBack(tmpFileName, "setting_general.xml", chip, model, panel, "setting_general");
}


function sequence_setting_general_xml(a, b)
{
    if (a.xmlNode1 == b.xmlNode1)
    {
        if (a.orderId > b.orderId)
            return 1;
        else if (a.orderId < b.orderId)
            return -1;
        else
            return 0;
    }
    
    ////////////////////////////////////////////
    var a_level = 0, b_level = 0;
    if (a.xmlNode1 == "SKY_CFG_TV_PERSONALIZE_SETTING")
        a_level = 1;
    else if (a.xmlNode1 == "SKY_CFG_TV_SYSTEM_SETTING")
        a_level = 2;
    else if (a.xmlNode1 == "SKY_CFG_TV_LOCATION_SECURITY")
        a_level = 3;
    
    if (b.xmlNode1 == "SKY_CFG_TV_PERSONALIZE_SETTING")
        b_level = 1;
    else if (b.xmlNode1 == "SKY_CFG_TV_SYSTEM_SETTING")
        b_level = 2;
    else if (b.xmlNode1 == "SKY_CFG_TV_LOCATION_SECURITY")
        b_level = 3;
        
    if (a_level > b_level)
        return 1;
    else if (a_level < b_level)
        return -1;
    else
        return 0;
}


// market_show_configuration.xml
function write_market_show_configuration_xml(sqlresult, chip, model, panel, tmpdir, genFileCallBack)
{
    var x;
    var fileinfo = new Array();
    var tmpFileName = tmpdir + chip + "_" + model + "_" + panel + "-market_show_configuration.xml";
    
    writerlog.w("生成临时的 market_show_configuration.xml \n");
    
    x = 0;
    for (let i in sqlresult)
    {
        let item = sqlresult[i];
        
        //console.log(item);
        //console.log("AAAAAAAA : " + item.xmlFileName);
        
        if (item.xmlFileName == "market_show_configuration.xml")
        {
            //console.log(item);
            //console.log("AAAAAAAA : " + item.xmlFileName);
            fileinfo[x] = item;
            x++;
        }
    }
    
    fs.writeFileSync(tmpFileName, '<?xml version="1.0" encoding="utf-8" ?>\n');
    fs.appendFileSync(tmpFileName, '<!--  market_show_configuration.xml  --> \n');
    fs.appendFileSync(tmpFileName, "<Config>\n");
    for (let i in fileinfo)
    {
        fs.appendFileSync(tmpFileName, "    ");
        fs.appendFileSync(tmpFileName, "<!-- ");
        fs.appendFileSync(tmpFileName, fileinfo[i].descText);
        fs.appendFileSync(tmpFileName, " -->\n    ");
        fs.appendFileSync(tmpFileName, fileinfo[i].xmlText);
        fs.appendFileSync(tmpFileName, "\n");
    }
    fs.appendFileSync(tmpFileName, "</Config>\n");
    
    genFileCallBack(tmpFileName, "market_show_configuration.xml", chip, model, panel, "market_show_configuration");
}



// ssc_item.xml
function write_ssc_item_xml(sqlresult, chip, model, panel, tmpdir, genFileCallBack)
{
    var x;
    var curClass = "";
    var fileinfo = new Array();
    var tmpFileName = tmpdir + chip + "_" + model + "_" + panel + "-ssc_item.xml";
    
    writerlog.w("生成临时的 ssc_item.xml \n");
    
    x = 0;
    for (let i in sqlresult)
    {
        let item = sqlresult[i];
        
        //console.log(item);
        //console.log("AAAAAAAA : " + item.xmlFileName);
        
        if (item.xmlFileName == "ssc_item.xml")
        {
            //console.log(item);
            //console.log("AAAAAAAA : " + item.xmlFileName);
            fileinfo[x] = item;
            x++;
        }
    }
        
    
    fs.writeFileSync(tmpFileName, '<?xml version="1.0" encoding="utf-8" ?>\n');
    fs.appendFileSync(tmpFileName, '<!--  ssc_item.xml  --> \n');
    fs.appendFileSync(tmpFileName, '<Source> \n\n');
    fs.appendFileSync(tmpFileName, '  <SourceHeader version="1.00" />\n\n');
    for (let i in fileinfo)
    {
        if (curClass != fileinfo[i].xmlNode1)
        {
            if (i != 0)
            {
                fs.appendFileSync(tmpFileName, '    </' + curClass + '>\n\n');
            }
            fs.appendFileSync(tmpFileName, '    <' + fileinfo[i].xmlNode1 + '>\n');
            curClass = fileinfo[i].xmlNode1;
        }
        fs.appendFileSync(tmpFileName, "        ");
        fs.appendFileSync(tmpFileName, "<!-- ");
        fs.appendFileSync(tmpFileName, fileinfo[i].descText);
        fs.appendFileSync(tmpFileName, " -->\n        ");
        fs.appendFileSync(tmpFileName, fileinfo[i].xmlText);
        fs.appendFileSync(tmpFileName, "\n");
    }
    fs.appendFileSync(tmpFileName, '    </' + curClass + '>\n\n');
    fs.appendFileSync(tmpFileName, "</Source>  \n\n\n\n\n");
    
    genFileCallBack(tmpFileName, "ssc_item.xml", chip, model, panel, "ssc_item");
}

// setting_picture_sound.xml
function setting_picture_sound(sqlresult, chip, model, panel, tmpdir, genFileCallBack)
{
    var x;
    var fileinfo = new Array();
    var tmpFileName = tmpdir + chip + "_" + model + "_" + panel + "-setting_picture_sound.xml";
    var curClass1 = "";
    var curClass2 = "";
    var curMainClass = "";
    var add_SKY_CFG_TV_PICTURE_MODE = false;
    var add_SKY_CFG_TV_SOUND_MODE = false;
    
    writerlog.w("生成临时的 setting_picture_sound.xml \n");
    
    x = 0;
    for (let i in sqlresult)
    {
        let item = sqlresult[i];
        
        //console.log(item);
        //console.log("AAAAAAAA : " + item.xmlFileName);
        
        if (item.xmlFileName == "setting_picture_sound.xml")
        {
            //console.log(item);
            //console.log("AAAAAAAA : " + item.xmlFileName);
            fileinfo[x] = item;
            x++;
        }
    }
    
    fs.writeFileSync(tmpFileName, '<?xml version="1.0" encoding="utf-8"?>\n');
    fs.appendFileSync(tmpFileName, '<!--  setting_picture_sound.xml  --> \n');
    fs.appendFileSync(tmpFileName, '<!-- 20171208 新版音画设置 -->  \n');
    fs.appendFileSync(tmpFileName, '<SettingItem name="SKY_CFG_TV_PICTURE_SOUND_SETTING" type="TYPE_ROOT" transparent="true"> \n');
    fs.appendFileSync(tmpFileName, '    <!-- 音画设置 --> \n');
	fs.appendFileSync(tmpFileName, '    <SettingItem name="SKY_CFG_TV_PIC_SOUND_SETTING" type="TYPE_TITLE" transparent="true">\n');
    
    
    let j = 0;
    let class1_cnt = 0;
    let picture_reset_done = false;                             // 图像设置恢复出厂设置,是否已经写入
    for (let i in fileinfo)
    {
        if (curClass1 != fileinfo[i].xmlNode1)
        {
            if (i != 0)
            {
                if (j != 0)
                {
                    fs.appendFileSync(tmpFileName, '            </SettingItem>\n');
                }
                
                if (!picture_reset_done)
                {
                    fs.appendFileSync(tmpFileName, '            <!-- 图像恢复默认 -->\n');
			        fs.appendFileSync(tmpFileName, '            <SettingItem name="SKY_CFG_TV_PICTURE_RESET" type="TYPE_DIALOG"></SettingItem>\n');
			        picture_reset_done = true;
                }
                else
                {
                    fs.appendFileSync(tmpFileName, '            <!-- 声音恢复默认 -->\n');
			        fs.appendFileSync(tmpFileName, '            <SettingItem name="SKY_CFG_TV_SOUND_RESET" type="TYPE_DIALOG"></SettingItem>\n');
                }
                
                fs.appendFileSync(tmpFileName, '        </SettingItem>\n\n');
                
            }
            
            if (fileinfo[i].xmlNode1 == "SKY_CFG_TV_PICTURE_SETTING")
                fs.appendFileSync(tmpFileName, '        <!-- 图像设置 -->\n');
            else if (fileinfo[i].xmlNode1 == "SKY_CFG_TV_SOUND_SETTING")
                fs.appendFileSync(tmpFileName, '        <!--声音设置-->\n');
            //==================================================================================
            fs.appendFileSync(tmpFileName, '        <SettingItem name="' + fileinfo[i].xmlNode1 + '" type="TYPE_GROUP_ROOT" transparent="true">\n');
            curClass1 = fileinfo[i].xmlNode1;
            j = 0;
            
            if (class1_cnt == 0)
                add_SKY_CFG_TV_PICTURE_MODE = true;
            else
                add_SKY_CFG_TV_SOUND_MODE = true;
            class1_cnt++;
        }
            
        if (curClass2 != fileinfo[i].xmlNode2)
        {
            if (add_SKY_CFG_TV_PICTURE_MODE)
            {
                fs.appendFileSync(tmpFileName, '            <!-- 图像模式 -->\n');
                fs.appendFileSync(tmpFileName, '            <SettingItem name="SKY_CFG_TV_PICTURE_MODE"></SettingItem>\n');
                add_SKY_CFG_TV_PICTURE_MODE = false;
            }
            if (add_SKY_CFG_TV_SOUND_MODE)
            {
                fs.appendFileSync(tmpFileName, '            <!-- 声音模式-->\n');
                fs.appendFileSync(tmpFileName, '            <SettingItem name="SKY_CFG_TV_SOUND_MODE"></SettingItem>\n');
                add_SKY_CFG_TV_SOUND_MODE = false;
            }
            
            
            if (j != 0)
            {
                fs.appendFileSync(tmpFileName, '            </SettingItem>\n');
            }
            
            //==================================================================================
            if (fileinfo[i].xmlNode2 == "SKY_CFG_TV_PICTURE_ADJUST")
                fs.appendFileSync(tmpFileName, '            <SettingItem name="SKY_CFG_TV_PICTURE_ADJUST" type="TYPE_GROUP" transparent="true">\n');
            else if (fileinfo[i].xmlNode2 == "SKY_CFG_TV_BRIGHT_SETTING")
                fs.appendFileSync(tmpFileName, '            <SettingItem name="SKY_CFG_TV_BRIGHT_SETTING" type="TYPE_GROUP" transparent="true">\n');
            else if (fileinfo[i].xmlNode2 == "SKY_CFG_TV_COLOR_SETTING")
                fs.appendFileSync(tmpFileName, '            <SettingItem name="SKY_CFG_TV_COLOR_SETTING" type="TYPE_GROUP" transparent="true">\n');
            else if (fileinfo[i].xmlNode2 == "SKY_CFG_TV_SHARPNESS_SETTING")
                fs.appendFileSync(tmpFileName, '            <SettingItem name="SKY_CFG_TV_SHARPNESS_SETTING" type="TYPE_GROUP" transparent="true">\n');
            else if (fileinfo[i].xmlNode2 == "SKY_CFG_TV_MOTION_SETTING")
                fs.appendFileSync(tmpFileName, '            <SettingItem name="SKY_CFG_TV_MOTION_SETTING" type="TYPE_GROUP" transparent="true">\n');
            else if (fileinfo[i].xmlNode2 == "SKY_CFG_TV_PICTURE_RESET")
                fs.appendFileSync(tmpFileName, '            <SettingItem name="SKY_CFG_TV_PICTURE_RESET" type="TYPE_DIALOG"></SettingItem>\n');
                
            else if (fileinfo[i].xmlNode2 == "SKY_CFG_TV_SOUND_ADJUST_SETTINGS")
                fs.appendFileSync(tmpFileName, '            <SettingItem name="SKY_CFG_TV_SOUND_ADJUST_SETTINGS" type="TYPE_GROUP" transparent="true">\n');
            else if (fileinfo[i].xmlNode2 == "SKY_CFG_TV_SOUND_OUTPUT_SETTINGS")
                fs.appendFileSync(tmpFileName, '            <SettingItem name="SKY_CFG_TV_SOUND_OUTPUT_SETTINGS" type="TYPE_GROUP" transparent="true">\n');
            else if (fileinfo[i].xmlNode2 == "SKY_CFG_TV_ATMOS_PROFESSIONAL_SETTINGS")
                fs.appendFileSync(tmpFileName, '            <SettingItem name="SKY_CFG_TV_ATMOS_PROFESSIONAL_SETTINGS" type="TYPE_GROUP" transparent="true">\n');
            else
                fs.appendFileSync(tmpFileName, '            <SettingItem name="' + fileinfo[i].xmlNode2 + '" type="TYPE_GROUP_ROOT" transparent="true">\n');
            curClass2 = fileinfo[i].xmlNode2;
        }
        
        j++;
        
        fs.appendFileSync(tmpFileName, "                ");
        fs.appendFileSync(tmpFileName, "<!-- ");
        fs.appendFileSync(tmpFileName, fileinfo[i].descText);
        fs.appendFileSync(tmpFileName, " -->\n                ");
        fs.appendFileSync(tmpFileName, fileinfo[i].xmlText);
        fs.appendFileSync(tmpFileName, "\n");
    }
    
    fs.appendFileSync(tmpFileName, '            </SettingItem>   \n');
    
    if (!picture_reset_done)
    {
        fs.appendFileSync(tmpFileName, '            <!-- 图像恢复默认 -->\n');
        fs.appendFileSync(tmpFileName, '            <SettingItem name="SKY_CFG_TV_PICTURE_RESET" type="TYPE_DIALOG"></SettingItem>\n');
        picture_reset_done = true;
    }
    else
    {
        fs.appendFileSync(tmpFileName, '            <!-- 声音恢复默认 -->\n');
        fs.appendFileSync(tmpFileName, '            <SettingItem name="SKY_CFG_TV_SOUND_RESET" type="TYPE_DIALOG"></SettingItem>\n');
    }
                
    fs.appendFileSync(tmpFileName, '        </SettingItem>   \n');
    fs.appendFileSync(tmpFileName, '    </SettingItem>  \n');
    fs.appendFileSync(tmpFileName, "</SettingItem>  \n\n\n\n\n");
    
    genFileCallBack(tmpFileName, "setting_picture_sound.xml", chip, model, panel, "setting_picture_sound");
}

// panel_common_pq.ini
function write_panel_common_pq_ini(sqlresult, chip, model, panel, tmpdir, genFileCallBack)
{
    var x;
    var curClass = "";
    var fileinfo = new Array();
    var tmpFileName = tmpdir + chip + "_" + model + "_" + panel + "-panel_common_pq.ini";
    
    writerlog.w("生成临时的 panel_common_pq.ini \n");
    
    x = 0;
    for (let i in sqlresult)
    {
        let item = sqlresult[i];
        
        //console.log(item);
        //console.log("AAAAAAAA : " + item.xmlFileName);
        
        if (item.xmlFileName == "panel_common_pq.ini")
        {
            //console.log(item);
            //console.log("AAAAAAAA : " + item.xmlFileName);
            fileinfo[x] = item;
            x++;
        }
    }
        
    fs.writeFileSync(tmpFileName, ' \n');
    
    for (let i in fileinfo)
    {
        if (curClass != fileinfo[i].xmlNode1)
        {
            let iniCollect;
            iniCollect = "PQ";
            fs.appendFileSync(tmpFileName, '[' + iniCollect + ']\n');
            curClass = fileinfo[i].xmlNode1;
        }
        
        fs.appendFileSync(tmpFileName, fileinfo[i].engName + ' = true\n');
    }
    
    genFileCallBack(tmpFileName, "panel_common_pq.ini", chip, model, panel, "panel_common_pq");
}

// panel_common_board.ini
function write_panel_common_board_ini(sqlresult, chip, model, panel, tmpdir, genFileCallBack)
{
    var x;
    var curClass = "";
    var fileinfo = new Array();
    var tmpFileName = tmpdir + chip + "_" + model + "_" + panel + "-panel_common_board.ini";
    
    writerlog.w("生成临时的 panel_common_board.ini \n");
    
    x = 0;
    for (let i in sqlresult)
    {
        let item = sqlresult[i];
        
        //console.log(item);
        //console.log("AAAAAAAA : " + item.xmlFileName);
        
        if (item.xmlFileName == "panel_common_board.ini")
        {
            //console.log(item);
            //console.log("AAAAAAAA : " + item.xmlFileName);
            fileinfo[x] = item;
            x++;
        }
    }
        
    fs.writeFileSync(tmpFileName, ' \n');
    
    for (let i in fileinfo)
    {
        if (curClass != fileinfo[i].xmlNode1)
        {
            let iniCollect;
            iniCollect = "board";
            fs.appendFileSync(tmpFileName, '[' + iniCollect + ']\n');
            curClass = fileinfo[i].xmlNode1;
        }
        
        fs.appendFileSync(tmpFileName, fileinfo[i].engName + ' = true\n');
    }
    
    genFileCallBack(tmpFileName, "panel_common_board.ini", chip, model, panel, "panel_common_board");
}





var settingfiles = new SettingFiles();
module.exports = settingfiles;

