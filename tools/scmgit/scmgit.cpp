﻿#include <stdio.h>
#include <string.h>
#include <stdlib.h>
#include <stdarg.h>
#include <unistd.h>
#include <fcntl.h>
#include <time.h>
#include <sys/types.h>
#include <sys/stat.h>
#include <sys/time.h>
#include <dirent.h>
#include <pthread.h>
#include <errno.h>
#include <string>
#include <vector>
#include <queue>

struct fileinfo_t
{
	std::string					tempName;
	std::string					finalName;
	std::string					chip;
	std::string					model;
	std::string					panel;
	std::string					typeStr;
	unsigned char *				content;
	unsigned int				filesize;
	
	fileinfo_t()
	{
		content = NULL;
		filesize = 0;
	}
	
	~fileinfo_t()
	{
		if (content) 
		{
			free(content);
			content = NULL;
			filesize = 0;
		}
	}
};

struct allinfo_t
{
	std::string					tempdir;
	std::string					gitpath;
	std::string					commit_sn;
	std::string					version;
	std::string					commitText;
	std::string					branch;
	std::vector<fileinfo_t>		fileinfo;
};

char * home;												// HOME目录
const char * logName = "scm_log_for_gerrit.log";
char logFileName[256];
FILE * fplog = NULL;

char * pdata = NULL;
unsigned pdatasize = 0;
extern unsigned char CommitMsgRawData[4328];

static void initLogFile();
static int loadGerritInfoFile(const char * infoFileName);
static int process_cmd(char * str);
static int process_cmd(char * str);
static int parse_cmd(char * str, allinfo_t & allinfo);
static int exec_cmd(const std::string & cmd, int echo);
static void write_commit_msg_file();
static int printlog(const char* format, ...);

int main(int argc, char** argv)
{
	// 打印参数列表
	for (int i = 0; i < argc; i++)
		printf("scmgit arg[%d] = %s\n", i, argv[i]);
	if (argc < 2) {
		printf("scmgit too few parameters. \n");
		return -1;
	}
	
	// 获得HOME目录
	home = getenv("HOME");
	
	// 初始化LOG输出文件
	initLogFile();
	printlog("//==================================================================================\n");
	printlog("\n");
	printlog("\n");
	
	// 加载提交命令文件
	loadGerritInfoFile(argv[1]);
	
	// 执行文件内容
	process_cmd(pdata);
	
	printlog("\n");
	printlog("\n");
	printlog("\n");
	
	fclose(fplog);
	if (pdata) {
		free(pdata);
		pdata = NULL;
	}
	
	return 0;
}

static void initLogFile()
{
	int ret;
	int fdlog;
	
	strcpy(logFileName, home);
	if (logFileName[strlen(logFileName) - 1] != '/')
		strcat(logFileName, "/");
	strcat(logFileName, logName);

	fdlog = open(logFileName, O_CREAT | O_APPEND | O_WRONLY, 0777);
	if (fdlog < 0)
	{
		printf("cannot write log file : %s \n", logFileName);
		exit(-1);
	}

	ret = dup2(fdlog, STDERR_FILENO);
	if (ret < 0)
	{
		printf("redirect standard out error:%m\n");
		exit(-1);
	}

	fplog = fdopen(STDERR_FILENO, "a");
	if (fplog == NULL)
	{
		printf("cannot write log file 2 : %s \n", logFileName);
		exit(-1);
	}
}

static int loadGerritInfoFile(const char * infoFileName)
{
	FILE * srcfp;
	unsigned filesize;
	
	srcfp = fopen(infoFileName, "rb");
	if (srcfp == NULL)
	{
		printlog("cannot open file %s \n", infoFileName);
		return -1;
	}
	fseek(srcfp, 0L, SEEK_END);
	filesize = ftell(srcfp);
	fseek(srcfp, 0L, SEEK_SET);
	
	pdatasize = filesize;
	pdata = (char*)malloc(pdatasize + 16);
	if (pdata == NULL)
	{
		printlog("cannot alloc memory %u bytes. \n", pdatasize);
		fclose(srcfp);
		return -1;
	}
	
	fread(pdata, 1, pdatasize, srcfp);
	pdata[pdatasize] = 0;
	
	fclose(srcfp);
	return 0;
}

static int process_cmd(char * str)
{
	size_t i;
	allinfo_t  allinfo;
	int ret;
	std::string gitCustomDir;
	DIR* dir1;
	std::string cmd;

	parse_cmd(str, allinfo);

	printlog("tempdir : %s\n", allinfo.tempdir.c_str());
	printlog("gitpath : %s\n", allinfo.gitpath.c_str());
	printlog("commit_sn : %s\n", allinfo.commit_sn.c_str());
	printlog("branch : %s\n", allinfo.branch.c_str());
	printlog("version : %s\n", allinfo.version.c_str());
	printlog("commitText : %s\n", allinfo.commitText.c_str());
	//////////////////////////////////////////////////////

	// 仓库存放路径
	gitCustomDir = allinfo.gitpath + "Custom";
	
	// 如果仓库不存在,建立仓库并下载仓库
	dir1 = opendir(gitCustomDir.c_str());
	if (dir1 == NULL) 
	{
		printlog("仓库不存在,先建立仓库 \n");
		cmd = std::string("mkdir -p ") + allinfo.gitpath;
		exec_cmd(cmd, 1);
		
		// 进去
		ret = chdir(allinfo.gitpath.c_str());
		if (ret != 0)
		{
			printlog("cddir error.\n");
			return -1;
		}
		else
		{
			char curdir[256];
			printlog("cddir OK.\n");
			memset(curdir, 0, sizeof(curdir));
			getcwd(curdir, sizeof(curdir) - 1);
			printlog("current dir is : %s\n", curdir);
		}
		
		// 执行git clone
		cmd = "git clone ssh://source.skyworth.com/skyworth/CoocaaOS/Custom -b ";
		cmd += allinfo.branch;
		exec_cmd(cmd, 1);
		
		// 进去
		ret = chdir(gitCustomDir.c_str());
		if (ret != 0)
		{
			printlog("cddir error.\n");
			return -1;
		}
		else
		{
			char curdir[256];
			printlog("cddir OK.\n");
			memset(curdir, 0, sizeof(curdir));
			getcwd(curdir, sizeof(curdir) - 1);
			printlog("current dir is : %s\n", curdir);
		}
		
		// 写入commit-msg文件
		printlog("生成一个commit-msg文件\n");
		write_commit_msg_file();
		cmd = "chmod 777 .git/hooks/commit-msg";
		exec_cmd(cmd, 1);
	}
	else {
		closedir(dir1);
		
		printlog("仓库已经存在,直接使用 \n");
		
		// 进去
		ret = chdir(gitCustomDir.c_str());
		if (ret != 0)
		{
			printlog("cddir error.\n");
			return -1;
		}
		else
		{
			char curdir[256];
			printlog("cddir OK.\n");
			memset(curdir, 0, sizeof(curdir));
			getcwd(curdir, sizeof(curdir) - 1);
			printlog("current dir is : %s\n", curdir);
		}
	}
	
	cmd = std::string("git pull");;
	exec_cmd(cmd, 1);
	
	cmd = "";
	
	// 复制并添加文件
	for (i = 0; i < allinfo.fileinfo.size(); i++)
	{
		std::string dir_relpath;
		std::string file_relpath;
		bool ignore_gitpush;
		
		ignore_gitpush = false;

		if (allinfo.fileinfo[i].typeStr == "prop")
		{
			dir_relpath = "property/";
			file_relpath = dir_relpath + allinfo.fileinfo[i].finalName;
			
			if (allinfo.version == "6.1")
    	        ignore_gitpush = true;
		}
		else if (allinfo.fileinfo[i].typeStr == "mk")
		{
			dir_relpath = "makefile/";
			file_relpath = dir_relpath + allinfo.fileinfo[i].finalName;
		}
		else if (allinfo.fileinfo[i].typeStr == "deviceTab")
		{
			dir_relpath = "";
			file_relpath = dir_relpath + allinfo.fileinfo[i].finalName;
		}
		else
		{
			if (allinfo.fileinfo[i].panel == "0")
				dir_relpath = std::string("pcfg/") + allinfo.fileinfo[i].chip + "_" + allinfo.fileinfo[i].model + "/config/";
			else
				dir_relpath = std::string("pcfg/") + allinfo.fileinfo[i].chip + "_" + allinfo.fileinfo[i].model + "/" + allinfo.fileinfo[i].panel + "/config/";
			file_relpath = dir_relpath + allinfo.fileinfo[i].finalName;
			
			if (allinfo.version == "6.1" && allinfo.fileinfo[i].typeStr != "general_config")
    	        ignore_gitpush = true;
		}

		//commitmsg += "修改了 " + file_relpath + ";\n";

		if (dir_relpath != "")
		{
			cmd = std::string("mkdir -p ") + dir_relpath;
			exec_cmd(cmd, 1);
		}

		cmd = std::string("cp -f ") + allinfo.fileinfo[i].tempName + "  " + file_relpath;
		exec_cmd(cmd, 1);
		if (!ignore_gitpush) 
		{
			cmd = std::string("git add ") + file_relpath;
			exec_cmd(cmd, 1);
		}
	}

	cmd = std::string("git commit -m  \'") + allinfo.commitText + "\'";
	printlog("exec: %s\n", "git commit");
	exec_cmd(cmd, 0);
	cmd = std::string("git push origin HEAD:refs/for/") + allinfo.branch;
	exec_cmd(cmd, 1);

	// 删除临时文件
	//cmd = "rm -rf " + allinfo.tempdir;
	//exec_cmd(cmd, 1);

	return 0;
}

void parse_fileinfo_str(char * rdata, fileinfo_t & fileinfo)
{
	static char cdata[10240];
	const char *p, *start;

	// fileinfo=5S02a 15U 0 general_config general_config.xml /tmp/scmplatform_2018622-10858_365/5S02a_15U_0-general_config.xml
	start = rdata;
	p = strchr(start, ' ');
	if (p)
	{
		strncpy(cdata, start, p - start);
		cdata[p - start] = 0;
		fileinfo.chip = cdata;
		start = p + 1;
		p = strchr(start, ' ');
		if (p)
		{
			strncpy(cdata, start, p - start);
			cdata[p - start] = 0;
			fileinfo.model = cdata;
			start = p + 1;
			p = strchr(start, ' ');
			if (p)
			{
				strncpy(cdata, start, p - start);
				cdata[p - start] = 0;
				fileinfo.panel = cdata;
				start = p + 1;
				p = strchr(start, ' ');
				if (p)
				{
					strncpy(cdata, start, p - start);
					cdata[p - start] = 0;
					fileinfo.typeStr = cdata;
					start = p + 1;
					p = strchr(start, ' ');
					if (p)
					{
						strncpy(cdata, start, p - start);
						cdata[p - start] = 0;
						fileinfo.finalName = cdata;
						start = p + 1;
						fileinfo.tempName = start;
					}
				}
			}
		}
	}
}

void parse_line(char * linedata, allinfo_t & allinfo)
{
	static int commitTextFlag = 0;
	static char rdata[10240];
	char * pequ;

	if (commitTextFlag == 0) 
	{
		pequ = strchr(linedata, '=');
		if (pequ)
		{
			*pequ = 0;
			pequ++;
			strncpy(rdata, pequ, sizeof(rdata) - 1);
			rdata[sizeof(rdata) - 1] = 0;

			if (0 == strcmp(linedata, "commit_sn"))
			{
				allinfo.commit_sn = rdata;
			}
			else if (0 == strcmp(linedata, "version"))
			{
				allinfo.version = rdata;
			}
			else if (0 == strcmp(linedata, "tempdir"))
			{
				allinfo.tempdir = rdata;
			}
			else if (0 == strcmp(linedata, "gitpath"))
			{
				allinfo.gitpath = rdata;
			}
			else if (0 == strcmp(linedata, "branch"))
			{
				allinfo.branch = rdata;
			}
			else if (0 == strcmp(linedata, "fileinfo"))
			{
				fileinfo_t  info;
				parse_fileinfo_str(rdata, info);
				allinfo.fileinfo.push_back(info);
			}
			else if (0 == strcmp(linedata, "commitText"))
			{
				allinfo.commitText = rdata;
				commitTextFlag = 1;
			}
		}
	}
	else
	{
		allinfo.commitText += "\n";
		if (linedata[0])
			allinfo.commitText += linedata;
	}
}

int parse_cmd(char * str, allinfo_t & allinfo)
{
	static char linedata[10240];
	size_t i, len, cnt;
	char ch;

	len = strlen(str);
	i = 0;
	cnt = 0;
	while (1)
	{
		ch = str[i];
		if (ch == '\n')
		{
			parse_line(linedata, allinfo);
			linedata[0] = 0;
			cnt = 0;
		}
		else
		{
			linedata[cnt++] = ch;
			linedata[cnt] = 0;

			if (cnt >= sizeof(linedata) - 3)
			{
				parse_line(linedata, allinfo);
				linedata[0] = 0;
				cnt = 0;
			}
		}

		if (ch == 0)
			break;
		i++;
	}
	return 0;
}

int exec_cmd(const std::string & cmd, int echo)
{
	FILE * fp;
	std::string result;
	char * pl;
	static char line[10240];

	if (echo)
		printlog("exec: %s\n", cmd.c_str());

	fp = popen(cmd.c_str(), "r");
	if (fp == NULL)
	{
		///////////////////////
		//  sprintf(buf,"error:%s\n",strerror(errno));
		printlog("error exec_cmd  %s\n", strerror(errno));
		return -1;
	}

	while (1)
	{
		memset(line, 0, sizeof(line));
		pl = fgets(line, sizeof(line) - 1, fp);
		if (pl == NULL)
			break;
		printlog("info : %s\n", line);
		result += line;
	}

	pclose(fp);
	return 0;
}

void write_commit_msg_file()
{
	FILE * fp;
	
	fp = fopen(".git/hooks/commit-msg", "wb");
	if (fp == NULL)
	{
		printlog("error : cannot write .git/hooks/commit-msg \n");
		return ;
	}
	fwrite(CommitMsgRawData, 1, sizeof(CommitMsgRawData), fp);
	
	fclose(fp);
}

int printlog(const char* format, ...)
{
	int ret;
	va_list list;
	char time_s[128];
	std::string newformat;

	time_t time_seconds = time(NULL);
	struct tm now_time;
	localtime_r(&time_seconds, &now_time);

	sprintf(time_s, "[%04d-%02d-%02d %02d:%02d:%02d] ", now_time.tm_year + 1900, now_time.tm_mon + 1,
		now_time.tm_mday, now_time.tm_hour, now_time.tm_min, now_time.tm_sec);

	newformat = std::string(time_s) + format;

	va_start(list, format);
	ret = vfprintf(fplog, newformat.c_str(), list);
	va_end(list);
	fflush(fplog);

	return ret;
}


/* C:\work\e\c6\ccos\config\70\Custom\.git\hooks\commit-msg (2016/10/26 11:13:18)
   起始偏移: 00000000, 尾部偏移: 000010E7, 长度: 000010E8 */

unsigned char CommitMsgRawData[4328] = {
	0x23, 0x21, 0x2F, 0x62, 0x69, 0x6E, 0x2F, 0x73, 0x68, 0x0A, 0x23, 0x0A,
	0x23, 0x20, 0x50, 0x61, 0x72, 0x74, 0x20, 0x6F, 0x66, 0x20, 0x47, 0x65,
	0x72, 0x72, 0x69, 0x74, 0x20, 0x43, 0x6F, 0x64, 0x65, 0x20, 0x52, 0x65,
	0x76, 0x69, 0x65, 0x77, 0x20, 0x28, 0x68, 0x74, 0x74, 0x70, 0x3A, 0x2F,
	0x2F, 0x63, 0x6F, 0x64, 0x65, 0x2E, 0x67, 0x6F, 0x6F, 0x67, 0x6C, 0x65,
	0x2E, 0x63, 0x6F, 0x6D, 0x2F, 0x70, 0x2F, 0x67, 0x65, 0x72, 0x72, 0x69,
	0x74, 0x2F, 0x29, 0x0A, 0x23, 0x0A, 0x23, 0x20, 0x43, 0x6F, 0x70, 0x79,
	0x72, 0x69, 0x67, 0x68, 0x74, 0x20, 0x28, 0x43, 0x29, 0x20, 0x32, 0x30,
	0x30, 0x39, 0x20, 0x54, 0x68, 0x65, 0x20, 0x41, 0x6E, 0x64, 0x72, 0x6F,
	0x69, 0x64, 0x20, 0x4F, 0x70, 0x65, 0x6E, 0x20, 0x53, 0x6F, 0x75, 0x72,
	0x63, 0x65, 0x20, 0x50, 0x72, 0x6F, 0x6A, 0x65, 0x63, 0x74, 0x0A, 0x23,
	0x0A, 0x23, 0x20, 0x4C, 0x69, 0x63, 0x65, 0x6E, 0x73, 0x65, 0x64, 0x20,
	0x75, 0x6E, 0x64, 0x65, 0x72, 0x20, 0x74, 0x68, 0x65, 0x20, 0x41, 0x70,
	0x61, 0x63, 0x68, 0x65, 0x20, 0x4C, 0x69, 0x63, 0x65, 0x6E, 0x73, 0x65,
	0x2C, 0x20, 0x56, 0x65, 0x72, 0x73, 0x69, 0x6F, 0x6E, 0x20, 0x32, 0x2E,
	0x30, 0x20, 0x28, 0x74, 0x68, 0x65, 0x20, 0x22, 0x4C, 0x69, 0x63, 0x65,
	0x6E, 0x73, 0x65, 0x22, 0x29, 0x3B, 0x0A, 0x23, 0x20, 0x79, 0x6F, 0x75,
	0x20, 0x6D, 0x61, 0x79, 0x20, 0x6E, 0x6F, 0x74, 0x20, 0x75, 0x73, 0x65,
	0x20, 0x74, 0x68, 0x69, 0x73, 0x20, 0x66, 0x69, 0x6C, 0x65, 0x20, 0x65,
	0x78, 0x63, 0x65, 0x70, 0x74, 0x20, 0x69, 0x6E, 0x20, 0x63, 0x6F, 0x6D,
	0x70, 0x6C, 0x69, 0x61, 0x6E, 0x63, 0x65, 0x20, 0x77, 0x69, 0x74, 0x68,
	0x20, 0x74, 0x68, 0x65, 0x20, 0x4C, 0x69, 0x63, 0x65, 0x6E, 0x73, 0x65,
	0x2E, 0x0A, 0x23, 0x20, 0x59, 0x6F, 0x75, 0x20, 0x6D, 0x61, 0x79, 0x20,
	0x6F, 0x62, 0x74, 0x61, 0x69, 0x6E, 0x20, 0x61, 0x20, 0x63, 0x6F, 0x70,
	0x79, 0x20, 0x6F, 0x66, 0x20, 0x74, 0x68, 0x65, 0x20, 0x4C, 0x69, 0x63,
	0x65, 0x6E, 0x73, 0x65, 0x20, 0x61, 0x74, 0x0A, 0x23, 0x0A, 0x23, 0x20,
	0x68, 0x74, 0x74, 0x70, 0x3A, 0x2F, 0x2F, 0x77, 0x77, 0x77, 0x2E, 0x61,
	0x70, 0x61, 0x63, 0x68, 0x65, 0x2E, 0x6F, 0x72, 0x67, 0x2F, 0x6C, 0x69,
	0x63, 0x65, 0x6E, 0x73, 0x65, 0x73, 0x2F, 0x4C, 0x49, 0x43, 0x45, 0x4E,
	0x53, 0x45, 0x2D, 0x32, 0x2E, 0x30, 0x0A, 0x23, 0x0A, 0x23, 0x20, 0x55,
	0x6E, 0x6C, 0x65, 0x73, 0x73, 0x20, 0x72, 0x65, 0x71, 0x75, 0x69, 0x72,
	0x65, 0x64, 0x20, 0x62, 0x79, 0x20, 0x61, 0x70, 0x70, 0x6C, 0x69, 0x63,
	0x61, 0x62, 0x6C, 0x65, 0x20, 0x6C, 0x61, 0x77, 0x20, 0x6F, 0x72, 0x20,
	0x61, 0x67, 0x72, 0x65, 0x65, 0x64, 0x20, 0x74, 0x6F, 0x20, 0x69, 0x6E,
	0x20, 0x77, 0x72, 0x69, 0x74, 0x69, 0x6E, 0x67, 0x2C, 0x20, 0x73, 0x6F,
	0x66, 0x74, 0x77, 0x61, 0x72, 0x65, 0x0A, 0x23, 0x20, 0x64, 0x69, 0x73,
	0x74, 0x72, 0x69, 0x62, 0x75, 0x74, 0x65, 0x64, 0x20, 0x75, 0x6E, 0x64,
	0x65, 0x72, 0x20, 0x74, 0x68, 0x65, 0x20, 0x4C, 0x69, 0x63, 0x65, 0x6E,
	0x73, 0x65, 0x20, 0x69, 0x73, 0x20, 0x64, 0x69, 0x73, 0x74, 0x72, 0x69,
	0x62, 0x75, 0x74, 0x65, 0x64, 0x20, 0x6F, 0x6E, 0x20, 0x61, 0x6E, 0x20,
	0x22, 0x41, 0x53, 0x20, 0x49, 0x53, 0x22, 0x20, 0x42, 0x41, 0x53, 0x49,
	0x53, 0x2C, 0x0A, 0x23, 0x20, 0x57, 0x49, 0x54, 0x48, 0x4F, 0x55, 0x54,
	0x20, 0x57, 0x41, 0x52, 0x52, 0x41, 0x4E, 0x54, 0x49, 0x45, 0x53, 0x20,
	0x4F, 0x52, 0x20, 0x43, 0x4F, 0x4E, 0x44, 0x49, 0x54, 0x49, 0x4F, 0x4E,
	0x53, 0x20, 0x4F, 0x46, 0x20, 0x41, 0x4E, 0x59, 0x20, 0x4B, 0x49, 0x4E,
	0x44, 0x2C, 0x20, 0x65, 0x69, 0x74, 0x68, 0x65, 0x72, 0x20, 0x65, 0x78,
	0x70, 0x72, 0x65, 0x73, 0x73, 0x20, 0x6F, 0x72, 0x20, 0x69, 0x6D, 0x70,
	0x6C, 0x69, 0x65, 0x64, 0x2E, 0x0A, 0x23, 0x20, 0x53, 0x65, 0x65, 0x20,
	0x74, 0x68, 0x65, 0x20, 0x4C, 0x69, 0x63, 0x65, 0x6E, 0x73, 0x65, 0x20,
	0x66, 0x6F, 0x72, 0x20, 0x74, 0x68, 0x65, 0x20, 0x73, 0x70, 0x65, 0x63,
	0x69, 0x66, 0x69, 0x63, 0x20, 0x6C, 0x61, 0x6E, 0x67, 0x75, 0x61, 0x67,
	0x65, 0x20, 0x67, 0x6F, 0x76, 0x65, 0x72, 0x6E, 0x69, 0x6E, 0x67, 0x20,
	0x70, 0x65, 0x72, 0x6D, 0x69, 0x73, 0x73, 0x69, 0x6F, 0x6E, 0x73, 0x20,
	0x61, 0x6E, 0x64, 0x0A, 0x23, 0x20, 0x6C, 0x69, 0x6D, 0x69, 0x74, 0x61,
	0x74, 0x69, 0x6F, 0x6E, 0x73, 0x20, 0x75, 0x6E, 0x64, 0x65, 0x72, 0x20,
	0x74, 0x68, 0x65, 0x20, 0x4C, 0x69, 0x63, 0x65, 0x6E, 0x73, 0x65, 0x2E,
	0x0A, 0x23, 0x0A, 0x0A, 0x75, 0x6E, 0x73, 0x65, 0x74, 0x20, 0x47, 0x52,
	0x45, 0x50, 0x5F, 0x4F, 0x50, 0x54, 0x49, 0x4F, 0x4E, 0x53, 0x0A, 0x0A,
	0x43, 0x48, 0x41, 0x4E, 0x47, 0x45, 0x5F, 0x49, 0x44, 0x5F, 0x41, 0x46,
	0x54, 0x45, 0x52, 0x3D, 0x22, 0x42, 0x75, 0x67, 0x7C, 0x49, 0x73, 0x73,
	0x75, 0x65, 0x22, 0x0A, 0x4D, 0x53, 0x47, 0x3D, 0x22, 0x24, 0x31, 0x22,
	0x0A, 0x0A, 0x23, 0x20, 0x43, 0x68, 0x65, 0x63, 0x6B, 0x20, 0x66, 0x6F,
	0x72, 0x2C, 0x20, 0x61, 0x6E, 0x64, 0x20, 0x61, 0x64, 0x64, 0x20, 0x69,
	0x66, 0x20, 0x6D, 0x69, 0x73, 0x73, 0x69, 0x6E, 0x67, 0x2C, 0x20, 0x61,
	0x20, 0x75, 0x6E, 0x69, 0x71, 0x75, 0x65, 0x20, 0x43, 0x68, 0x61, 0x6E,
	0x67, 0x65, 0x2D, 0x49, 0x64, 0x0A, 0x23, 0x0A, 0x61, 0x64, 0x64, 0x5F,
	0x43, 0x68, 0x61, 0x6E, 0x67, 0x65, 0x49, 0x64, 0x28, 0x29, 0x20, 0x7B,
	0x0A, 0x09, 0x63, 0x6C, 0x65, 0x61, 0x6E, 0x5F, 0x6D, 0x65, 0x73, 0x73,
	0x61, 0x67, 0x65, 0x3D, 0x60, 0x73, 0x65, 0x64, 0x20, 0x2D, 0x65, 0x20,
	0x27, 0x0A, 0x09, 0x09, 0x2F, 0x5E, 0x64, 0x69, 0x66, 0x66, 0x20, 0x2D,
	0x2D, 0x67, 0x69, 0x74, 0x20, 0x2E, 0x2A, 0x2F, 0x7B, 0x0A, 0x09, 0x09,
	0x09, 0x73, 0x2F, 0x2F, 0x2F, 0x0A, 0x09, 0x09, 0x09, 0x71, 0x0A, 0x09,
	0x09, 0x7D, 0x0A, 0x09, 0x09, 0x2F, 0x5E, 0x53, 0x69, 0x67, 0x6E, 0x65,
	0x64, 0x2D, 0x6F, 0x66, 0x66, 0x2D, 0x62, 0x79, 0x3A, 0x2F, 0x64, 0x0A,
	0x09, 0x09, 0x2F, 0x5E, 0x23, 0x2F, 0x64, 0x0A, 0x09, 0x27, 0x20, 0x22,
	0x24, 0x4D, 0x53, 0x47, 0x22, 0x20, 0x7C, 0x20, 0x67, 0x69, 0x74, 0x20,
	0x73, 0x74, 0x72, 0x69, 0x70, 0x73, 0x70, 0x61, 0x63, 0x65, 0x60, 0x0A,
	0x09, 0x69, 0x66, 0x20, 0x74, 0x65, 0x73, 0x74, 0x20, 0x2D, 0x7A, 0x20,
	0x22, 0x24, 0x63, 0x6C, 0x65, 0x61, 0x6E, 0x5F, 0x6D, 0x65, 0x73, 0x73,
	0x61, 0x67, 0x65, 0x22, 0x0A, 0x09, 0x74, 0x68, 0x65, 0x6E, 0x0A, 0x09,
	0x09, 0x72, 0x65, 0x74, 0x75, 0x72, 0x6E, 0x0A, 0x09, 0x66, 0x69, 0x0A,
	0x0A, 0x09, 0x69, 0x66, 0x20, 0x74, 0x65, 0x73, 0x74, 0x20, 0x22, 0x66,
	0x61, 0x6C, 0x73, 0x65, 0x22, 0x20, 0x3D, 0x20, 0x22, 0x60, 0x67, 0x69,
	0x74, 0x20, 0x63, 0x6F, 0x6E, 0x66, 0x69, 0x67, 0x20, 0x2D, 0x2D, 0x62,
	0x6F, 0x6F, 0x6C, 0x20, 0x2D, 0x2D, 0x67, 0x65, 0x74, 0x20, 0x67, 0x65,
	0x72, 0x72, 0x69, 0x74, 0x2E, 0x63, 0x72, 0x65, 0x61, 0x74, 0x65, 0x43,
	0x68, 0x61, 0x6E, 0x67, 0x65, 0x49, 0x64, 0x60, 0x22, 0x0A, 0x09, 0x74,
	0x68, 0x65, 0x6E, 0x0A, 0x09, 0x09, 0x72, 0x65, 0x74, 0x75, 0x72, 0x6E,
	0x0A, 0x09, 0x66, 0x69, 0x0A, 0x0A, 0x09, 0x23, 0x20, 0x44, 0x6F, 0x65,
	0x73, 0x20, 0x43, 0x68, 0x61, 0x6E, 0x67, 0x65, 0x2D, 0x49, 0x64, 0x3A,
	0x20, 0x61, 0x6C, 0x72, 0x65, 0x61, 0x64, 0x79, 0x20, 0x65, 0x78, 0x69,
	0x73, 0x74, 0x3F, 0x20, 0x69, 0x66, 0x20, 0x73, 0x6F, 0x2C, 0x20, 0x65,
	0x78, 0x69, 0x74, 0x20, 0x28, 0x6E, 0x6F, 0x20, 0x63, 0x68, 0x61, 0x6E,
	0x67, 0x65, 0x29, 0x2E, 0x0A, 0x09, 0x69, 0x66, 0x20, 0x67, 0x72, 0x65,
	0x70, 0x20, 0x2D, 0x69, 0x20, 0x27, 0x5E, 0x43, 0x68, 0x61, 0x6E, 0x67,
	0x65, 0x2D, 0x49, 0x64, 0x3A, 0x27, 0x20, 0x22, 0x24, 0x4D, 0x53, 0x47,
	0x22, 0x20, 0x3E, 0x2F, 0x64, 0x65, 0x76, 0x2F, 0x6E, 0x75, 0x6C, 0x6C,
	0x0A, 0x09, 0x74, 0x68, 0x65, 0x6E, 0x0A, 0x09, 0x09, 0x72, 0x65, 0x74,
	0x75, 0x72, 0x6E, 0x0A, 0x09, 0x66, 0x69, 0x0A, 0x0A, 0x09, 0x69, 0x64,
	0x3D, 0x60, 0x5F, 0x67, 0x65, 0x6E, 0x5F, 0x43, 0x68, 0x61, 0x6E, 0x67,
	0x65, 0x49, 0x64, 0x60, 0x0A, 0x09, 0x54, 0x3D, 0x22, 0x24, 0x4D, 0x53,
	0x47, 0x2E, 0x74, 0x6D, 0x70, 0x2E, 0x24, 0x24, 0x22, 0x0A, 0x09, 0x41,
	0x57, 0x4B, 0x3D, 0x61, 0x77, 0x6B, 0x0A, 0x09, 0x69, 0x66, 0x20, 0x5B,
	0x20, 0x2D, 0x78, 0x20, 0x2F, 0x75, 0x73, 0x72, 0x2F, 0x78, 0x70, 0x67,
	0x34, 0x2F, 0x62, 0x69, 0x6E, 0x2F, 0x61, 0x77, 0x6B, 0x20, 0x5D, 0x3B,
	0x20, 0x74, 0x68, 0x65, 0x6E, 0x0A, 0x09, 0x09, 0x23, 0x20, 0x53, 0x6F,
	0x6C, 0x61, 0x72, 0x69, 0x73, 0x20, 0x41, 0x57, 0x4B, 0x20, 0x69, 0x73,
	0x20, 0x6A, 0x75, 0x73, 0x74, 0x20, 0x74, 0x6F, 0x6F, 0x20, 0x62, 0x72,
	0x6F, 0x6B, 0x65, 0x6E, 0x0A, 0x09, 0x09, 0x41, 0x57, 0x4B, 0x3D, 0x2F,
	0x75, 0x73, 0x72, 0x2F, 0x78, 0x70, 0x67, 0x34, 0x2F, 0x62, 0x69, 0x6E,
	0x2F, 0x61, 0x77, 0x6B, 0x0A, 0x09, 0x66, 0x69, 0x0A, 0x0A, 0x09, 0x23,
	0x20, 0x48, 0x6F, 0x77, 0x20, 0x74, 0x68, 0x69, 0x73, 0x20, 0x77, 0x6F,
	0x72, 0x6B, 0x73, 0x3A, 0x0A, 0x09, 0x23, 0x20, 0x2D, 0x20, 0x70, 0x61,
	0x72, 0x73, 0x65, 0x20, 0x74, 0x68, 0x65, 0x20, 0x63, 0x6F, 0x6D, 0x6D,
	0x69, 0x74, 0x20, 0x6D, 0x65, 0x73, 0x73, 0x61, 0x67, 0x65, 0x20, 0x61,
	0x73, 0x20, 0x28, 0x74, 0x65, 0x78, 0x74, 0x4C, 0x69, 0x6E, 0x65, 0x2B,
	0x20, 0x62, 0x6C, 0x61, 0x6E, 0x6B, 0x4C, 0x69, 0x6E, 0x65, 0x2A, 0x29,
	0x2A, 0x0A, 0x09, 0x23, 0x20, 0x2D, 0x20, 0x61, 0x73, 0x73, 0x75, 0x6D,
	0x65, 0x20, 0x74, 0x65, 0x78, 0x74, 0x4C, 0x69, 0x6E, 0x65, 0x2B, 0x20,
	0x74, 0x6F, 0x20, 0x62, 0x65, 0x20, 0x61, 0x20, 0x66, 0x6F, 0x6F, 0x74,
	0x65, 0x72, 0x20, 0x75, 0x6E, 0x74, 0x69, 0x6C, 0x20, 0x70, 0x72, 0x6F,
	0x76, 0x65, 0x6E, 0x20, 0x6F, 0x74, 0x68, 0x65, 0x72, 0x77, 0x69, 0x73,
	0x65, 0x0A, 0x09, 0x23, 0x20, 0x2D, 0x20, 0x65, 0x78, 0x63, 0x65, 0x70,
	0x74, 0x69, 0x6F, 0x6E, 0x3A, 0x20, 0x74, 0x68, 0x65, 0x20, 0x66, 0x69,
	0x72, 0x73, 0x74, 0x20, 0x62, 0x6C, 0x6F, 0x63, 0x6B, 0x20, 0x69, 0x73,
	0x20, 0x6E, 0x6F, 0x74, 0x20, 0x66, 0x6F, 0x6F, 0x74, 0x65, 0x72, 0x20,
	0x28, 0x61, 0x73, 0x20, 0x69, 0x74, 0x20, 0x69, 0x73, 0x20, 0x74, 0x68,
	0x65, 0x20, 0x74, 0x69, 0x74, 0x6C, 0x65, 0x29, 0x0A, 0x09, 0x23, 0x20,
	0x2D, 0x20, 0x72, 0x65, 0x61, 0x64, 0x20, 0x74, 0x65, 0x78, 0x74, 0x4C,
	0x69, 0x6E, 0x65, 0x2B, 0x20, 0x69, 0x6E, 0x74, 0x6F, 0x20, 0x61, 0x20,
	0x76, 0x61, 0x72, 0x69, 0x61, 0x62, 0x6C, 0x65, 0x0A, 0x09, 0x23, 0x20,
	0x2D, 0x20, 0x74, 0x68, 0x65, 0x6E, 0x20, 0x63, 0x6F, 0x75, 0x6E, 0x74,
	0x20, 0x62, 0x6C, 0x61, 0x6E, 0x6B, 0x4C, 0x69, 0x6E, 0x65, 0x73, 0x0A,
	0x09, 0x23, 0x20, 0x2D, 0x20, 0x6F, 0x6E, 0x63, 0x65, 0x20, 0x74, 0x68,
	0x65, 0x20, 0x6E, 0x65, 0x78, 0x74, 0x20, 0x74, 0x65, 0x78, 0x74, 0x4C,
	0x69, 0x6E, 0x65, 0x20, 0x61, 0x70, 0x70, 0x65, 0x61, 0x72, 0x73, 0x2C,
	0x20, 0x70, 0x72, 0x69, 0x6E, 0x74, 0x20, 0x74, 0x65, 0x78, 0x74, 0x4C,
	0x69, 0x6E, 0x65, 0x2B, 0x20, 0x62, 0x6C, 0x61, 0x6E, 0x6B, 0x4C, 0x69,
	0x6E, 0x65, 0x2A, 0x20, 0x61, 0x73, 0x20, 0x74, 0x68, 0x65, 0x73, 0x65,
	0x0A, 0x09, 0x23, 0x20, 0x20, 0x20, 0x61, 0x72, 0x65, 0x6E, 0x27, 0x74,
	0x20, 0x66, 0x6F, 0x6F, 0x74, 0x65, 0x72, 0x0A, 0x09, 0x23, 0x20, 0x2D,
	0x20, 0x69, 0x6E, 0x20, 0x45, 0x4E, 0x44, 0x2C, 0x20, 0x74, 0x68, 0x65,
	0x20, 0x6C, 0x61, 0x73, 0x74, 0x20, 0x74, 0x65, 0x78, 0x74, 0x4C, 0x69,
	0x6E, 0x65, 0x2B, 0x20, 0x62, 0x6C, 0x6F, 0x63, 0x6B, 0x20, 0x69, 0x73,
	0x20, 0x61, 0x76, 0x61, 0x69, 0x6C, 0x61, 0x62, 0x6C, 0x65, 0x20, 0x66,
	0x6F, 0x72, 0x20, 0x66, 0x6F, 0x6F, 0x74, 0x65, 0x72, 0x20, 0x70, 0x61,
	0x72, 0x73, 0x69, 0x6E, 0x67, 0x0A, 0x09, 0x24, 0x41, 0x57, 0x4B, 0x20,
	0x27, 0x0A, 0x09, 0x42, 0x45, 0x47, 0x49, 0x4E, 0x20, 0x7B, 0x0A, 0x09,
	0x09, 0x23, 0x20, 0x77, 0x68, 0x69, 0x6C, 0x65, 0x20, 0x77, 0x65, 0x20,
	0x73, 0x74, 0x61, 0x72, 0x74, 0x20, 0x77, 0x69, 0x74, 0x68, 0x20, 0x74,
	0x68, 0x65, 0x20, 0x61, 0x73, 0x73, 0x75, 0x6D, 0x70, 0x74, 0x69, 0x6F,
	0x6E, 0x20, 0x74, 0x68, 0x61, 0x74, 0x20, 0x74, 0x65, 0x78, 0x74, 0x4C,
	0x69, 0x6E, 0x65, 0x2B, 0x0A, 0x09, 0x09, 0x23, 0x20, 0x69, 0x73, 0x20,
	0x61, 0x20, 0x66, 0x6F, 0x6F, 0x74, 0x65, 0x72, 0x2C, 0x20, 0x74, 0x68,
	0x65, 0x20, 0x66, 0x69, 0x72, 0x73, 0x74, 0x20, 0x62, 0x6C, 0x6F, 0x63,
	0x6B, 0x20, 0x69, 0x73, 0x20, 0x6E, 0x6F, 0x74, 0x2E, 0x0A, 0x09, 0x09,
	0x69, 0x73, 0x46, 0x6F, 0x6F, 0x74, 0x65, 0x72, 0x20, 0x3D, 0x20, 0x30,
	0x0A, 0x09, 0x09, 0x66, 0x6F, 0x6F, 0x74, 0x65, 0x72, 0x43, 0x6F, 0x6D,
	0x6D, 0x65, 0x6E, 0x74, 0x20, 0x3D, 0x20, 0x30, 0x0A, 0x09, 0x09, 0x62,
	0x6C, 0x61, 0x6E, 0x6B, 0x4C, 0x69, 0x6E, 0x65, 0x73, 0x20, 0x3D, 0x20,
	0x30, 0x0A, 0x09, 0x7D, 0x0A, 0x0A, 0x09, 0x23, 0x20, 0x53, 0x6B, 0x69,
	0x70, 0x20, 0x6C, 0x69, 0x6E, 0x65, 0x73, 0x20, 0x73, 0x74, 0x61, 0x72,
	0x74, 0x69, 0x6E, 0x67, 0x20, 0x77, 0x69, 0x74, 0x68, 0x20, 0x22, 0x23,
	0x22, 0x20, 0x77, 0x69, 0x74, 0x68, 0x6F, 0x75, 0x74, 0x20, 0x61, 0x6E,
	0x79, 0x20, 0x73, 0x70, 0x61, 0x63, 0x65, 0x73, 0x20, 0x62, 0x65, 0x66,
	0x6F, 0x72, 0x65, 0x20, 0x69, 0x74, 0x2E, 0x0A, 0x09, 0x2F, 0x5E, 0x23,
	0x2F, 0x20, 0x7B, 0x20, 0x6E, 0x65, 0x78, 0x74, 0x20, 0x7D, 0x0A, 0x0A,
	0x09, 0x23, 0x20, 0x53, 0x6B, 0x69, 0x70, 0x20, 0x74, 0x68, 0x65, 0x20,
	0x6C, 0x69, 0x6E, 0x65, 0x20, 0x73, 0x74, 0x61, 0x72, 0x74, 0x69, 0x6E,
	0x67, 0x20, 0x77, 0x69, 0x74, 0x68, 0x20, 0x74, 0x68, 0x65, 0x20, 0x64,
	0x69, 0x66, 0x66, 0x20, 0x63, 0x6F, 0x6D, 0x6D, 0x61, 0x6E, 0x64, 0x20,
	0x61, 0x6E, 0x64, 0x20, 0x65, 0x76, 0x65, 0x72, 0x79, 0x74, 0x68, 0x69,
	0x6E, 0x67, 0x20, 0x61, 0x66, 0x74, 0x65, 0x72, 0x20, 0x69, 0x74, 0x2C,
	0x0A, 0x09, 0x23, 0x20, 0x75, 0x70, 0x20, 0x74, 0x6F, 0x20, 0x74, 0x68,
	0x65, 0x20, 0x65, 0x6E, 0x64, 0x20, 0x6F, 0x66, 0x20, 0x74, 0x68, 0x65,
	0x20, 0x66, 0x69, 0x6C, 0x65, 0x2C, 0x20, 0x61, 0x73, 0x73, 0x75, 0x6D,
	0x69, 0x6E, 0x67, 0x20, 0x69, 0x74, 0x20, 0x69, 0x73, 0x20, 0x6F, 0x6E,
	0x6C, 0x79, 0x20, 0x70, 0x61, 0x74, 0x63, 0x68, 0x20, 0x64, 0x61, 0x74,
	0x61, 0x2E, 0x0A, 0x09, 0x23, 0x20, 0x49, 0x66, 0x20, 0x6D, 0x6F, 0x72,
	0x65, 0x20, 0x74, 0x68, 0x61, 0x6E, 0x20, 0x6F, 0x6E, 0x65, 0x20, 0x6C,
	0x69, 0x6E, 0x65, 0x20, 0x62, 0x65, 0x66, 0x6F, 0x72, 0x65, 0x20, 0x74,
	0x68, 0x65, 0x20, 0x64, 0x69, 0x66, 0x66, 0x20, 0x77, 0x61, 0x73, 0x20,
	0x65, 0x6D, 0x70, 0x74, 0x79, 0x2C, 0x20, 0x73, 0x74, 0x72, 0x69, 0x70,
	0x20, 0x61, 0x6C, 0x6C, 0x20, 0x62, 0x75, 0x74, 0x20, 0x6F, 0x6E, 0x65,
	0x2E, 0x0A, 0x09, 0x2F, 0x5E, 0x64, 0x69, 0x66, 0x66, 0x20, 0x2D, 0x2D,
	0x67, 0x69, 0x74, 0x20, 0x2F, 0x20, 0x7B, 0x0A, 0x09, 0x09, 0x62, 0x6C,
	0x61, 0x6E, 0x6B, 0x4C, 0x69, 0x6E, 0x65, 0x73, 0x20, 0x3D, 0x20, 0x30,
	0x0A, 0x09, 0x09, 0x77, 0x68, 0x69, 0x6C, 0x65, 0x20, 0x28, 0x67, 0x65,
	0x74, 0x6C, 0x69, 0x6E, 0x65, 0x29, 0x20, 0x7B, 0x20, 0x7D, 0x0A, 0x09,
	0x09, 0x6E, 0x65, 0x78, 0x74, 0x0A, 0x09, 0x7D, 0x0A, 0x0A, 0x09, 0x23,
	0x20, 0x43, 0x6F, 0x75, 0x6E, 0x74, 0x20, 0x62, 0x6C, 0x61, 0x6E, 0x6B,
	0x20, 0x6C, 0x69, 0x6E, 0x65, 0x73, 0x20, 0x6F, 0x75, 0x74, 0x73, 0x69,
	0x64, 0x65, 0x20, 0x66, 0x6F, 0x6F, 0x74, 0x65, 0x72, 0x20, 0x63, 0x6F,
	0x6D, 0x6D, 0x65, 0x6E, 0x74, 0x73, 0x0A, 0x09, 0x2F, 0x5E, 0x24, 0x2F,
	0x20, 0x26, 0x26, 0x20, 0x28, 0x66, 0x6F, 0x6F, 0x74, 0x65, 0x72, 0x43,
	0x6F, 0x6D, 0x6D, 0x65, 0x6E, 0x74, 0x20, 0x3D, 0x3D, 0x20, 0x30, 0x29,
	0x20, 0x7B, 0x0A, 0x09, 0x09, 0x62, 0x6C, 0x61, 0x6E, 0x6B, 0x4C, 0x69,
	0x6E, 0x65, 0x73, 0x2B, 0x2B, 0x0A, 0x09, 0x09, 0x6E, 0x65, 0x78, 0x74,
	0x0A, 0x09, 0x7D, 0x0A, 0x0A, 0x09, 0x23, 0x20, 0x43, 0x61, 0x74, 0x63,
	0x68, 0x20, 0x66, 0x6F, 0x6F, 0x74, 0x65, 0x72, 0x20, 0x63, 0x6F, 0x6D,
	0x6D, 0x65, 0x6E, 0x74, 0x0A, 0x09, 0x2F, 0x5E, 0x5C, 0x5B, 0x5B, 0x61,
	0x2D, 0x7A, 0x41, 0x2D, 0x5A, 0x30, 0x2D, 0x39, 0x2D, 0x5D, 0x2B, 0x3A,
	0x2F, 0x20, 0x26, 0x26, 0x20, 0x28, 0x69, 0x73, 0x46, 0x6F, 0x6F, 0x74,
	0x65, 0x72, 0x20, 0x3D, 0x3D, 0x20, 0x31, 0x29, 0x20, 0x7B, 0x0A, 0x09,
	0x09, 0x66, 0x6F, 0x6F, 0x74, 0x65, 0x72, 0x43, 0x6F, 0x6D, 0x6D, 0x65,
	0x6E, 0x74, 0x20, 0x3D, 0x20, 0x31, 0x0A, 0x09, 0x7D, 0x0A, 0x0A, 0x09,
	0x2F, 0x5D, 0x24, 0x2F, 0x20, 0x26, 0x26, 0x20, 0x28, 0x66, 0x6F, 0x6F,
	0x74, 0x65, 0x72, 0x43, 0x6F, 0x6D, 0x6D, 0x65, 0x6E, 0x74, 0x20, 0x3D,
	0x3D, 0x20, 0x31, 0x29, 0x20, 0x7B, 0x0A, 0x09, 0x09, 0x66, 0x6F, 0x6F,
	0x74, 0x65, 0x72, 0x43, 0x6F, 0x6D, 0x6D, 0x65, 0x6E, 0x74, 0x20, 0x3D,
	0x20, 0x32, 0x0A, 0x09, 0x7D, 0x0A, 0x0A, 0x09, 0x23, 0x20, 0x57, 0x65,
	0x20, 0x68, 0x61, 0x76, 0x65, 0x20, 0x61, 0x20, 0x6E, 0x6F, 0x6E, 0x2D,
	0x62, 0x6C, 0x61, 0x6E, 0x6B, 0x20, 0x6C, 0x69, 0x6E, 0x65, 0x20, 0x61,
	0x66, 0x74, 0x65, 0x72, 0x20, 0x62, 0x6C, 0x61, 0x6E, 0x6B, 0x20, 0x6C,
	0x69, 0x6E, 0x65, 0x73, 0x2E, 0x20, 0x48, 0x61, 0x6E, 0x64, 0x6C, 0x65,
	0x20, 0x74, 0x68, 0x69, 0x73, 0x2E, 0x0A, 0x09, 0x28, 0x62, 0x6C, 0x61,
	0x6E, 0x6B, 0x4C, 0x69, 0x6E, 0x65, 0x73, 0x20, 0x3E, 0x20, 0x30, 0x29,
	0x20, 0x7B, 0x0A, 0x09, 0x09, 0x70, 0x72, 0x69, 0x6E, 0x74, 0x20, 0x6C,
	0x69, 0x6E, 0x65, 0x73, 0x0A, 0x09, 0x09, 0x66, 0x6F, 0x72, 0x20, 0x28,
	0x69, 0x20, 0x3D, 0x20, 0x30, 0x3B, 0x20, 0x69, 0x20, 0x3C, 0x20, 0x62,
	0x6C, 0x61, 0x6E, 0x6B, 0x4C, 0x69, 0x6E, 0x65, 0x73, 0x3B, 0x20, 0x69,
	0x2B, 0x2B, 0x29, 0x20, 0x7B, 0x0A, 0x09, 0x09, 0x09, 0x70, 0x72, 0x69,
	0x6E, 0x74, 0x20, 0x22, 0x22, 0x0A, 0x09, 0x09, 0x7D, 0x0A, 0x0A, 0x09,
	0x09, 0x6C, 0x69, 0x6E, 0x65, 0x73, 0x20, 0x3D, 0x20, 0x22, 0x22, 0x0A,
	0x09, 0x09, 0x62, 0x6C, 0x61, 0x6E, 0x6B, 0x4C, 0x69, 0x6E, 0x65, 0x73,
	0x20, 0x3D, 0x20, 0x30, 0x0A, 0x09, 0x09, 0x69, 0x73, 0x46, 0x6F, 0x6F,
	0x74, 0x65, 0x72, 0x20, 0x3D, 0x20, 0x31, 0x0A, 0x09, 0x09, 0x66, 0x6F,
	0x6F, 0x74, 0x65, 0x72, 0x43, 0x6F, 0x6D, 0x6D, 0x65, 0x6E, 0x74, 0x20,
	0x3D, 0x20, 0x30, 0x0A, 0x09, 0x7D, 0x0A, 0x0A, 0x09, 0x23, 0x20, 0x44,
	0x65, 0x74, 0x65, 0x63, 0x74, 0x20, 0x74, 0x68, 0x61, 0x74, 0x20, 0x74,
	0x68, 0x65, 0x20, 0x63, 0x75, 0x72, 0x72, 0x65, 0x6E, 0x74, 0x20, 0x62,
	0x6C, 0x6F, 0x63, 0x6B, 0x20, 0x69, 0x73, 0x20, 0x6E, 0x6F, 0x74, 0x20,
	0x74, 0x68, 0x65, 0x20, 0x66, 0x6F, 0x6F, 0x74, 0x65, 0x72, 0x0A, 0x09,
	0x28, 0x66, 0x6F, 0x6F, 0x74, 0x65, 0x72, 0x43, 0x6F, 0x6D, 0x6D, 0x65,
	0x6E, 0x74, 0x20, 0x3D, 0x3D, 0x20, 0x30, 0x29, 0x20, 0x26, 0x26, 0x20,
	0x28, 0x21, 0x2F, 0x5E, 0x5C, 0x5B, 0x3F, 0x5B, 0x61, 0x2D, 0x7A, 0x41,
	0x2D, 0x5A, 0x30, 0x2D, 0x39, 0x2D, 0x5D, 0x2B, 0x3A, 0x2F, 0x20, 0x7C,
	0x7C, 0x20, 0x2F, 0x5E, 0x5B, 0x61, 0x2D, 0x7A, 0x41, 0x2D, 0x5A, 0x30,
	0x2D, 0x39, 0x2D, 0x5D, 0x2B, 0x3A, 0x5C, 0x2F, 0x5C, 0x2F, 0x2F, 0x29,
	0x20, 0x7B, 0x0A, 0x09, 0x09, 0x69, 0x73, 0x46, 0x6F, 0x6F, 0x74, 0x65,
	0x72, 0x20, 0x3D, 0x20, 0x30, 0x0A, 0x09, 0x7D, 0x0A, 0x0A, 0x09, 0x7B,
	0x0A, 0x09, 0x09, 0x23, 0x20, 0x57, 0x65, 0x20, 0x6E, 0x65, 0x65, 0x64,
	0x20, 0x74, 0x68, 0x69, 0x73, 0x20, 0x69, 0x6E, 0x66, 0x6F, 0x72, 0x6D,
	0x61, 0x74, 0x69, 0x6F, 0x6E, 0x20, 0x61, 0x62, 0x6F, 0x75, 0x74, 0x20,
	0x74, 0x68, 0x65, 0x20, 0x63, 0x75, 0x72, 0x72, 0x65, 0x6E, 0x74, 0x20,
	0x6C, 0x61, 0x73, 0x74, 0x20, 0x63, 0x6F, 0x6D, 0x6D, 0x65, 0x6E, 0x74,
	0x20, 0x6C, 0x69, 0x6E, 0x65, 0x0A, 0x09, 0x09, 0x69, 0x66, 0x20, 0x28,
	0x66, 0x6F, 0x6F, 0x74, 0x65, 0x72, 0x43, 0x6F, 0x6D, 0x6D, 0x65, 0x6E,
	0x74, 0x20, 0x3D, 0x3D, 0x20, 0x32, 0x29, 0x20, 0x7B, 0x0A, 0x09, 0x09,
	0x09, 0x66, 0x6F, 0x6F, 0x74, 0x65, 0x72, 0x43, 0x6F, 0x6D, 0x6D, 0x65,
	0x6E, 0x74, 0x20, 0x3D, 0x20, 0x30, 0x0A, 0x09, 0x09, 0x7D, 0x0A, 0x09,
	0x09, 0x69, 0x66, 0x20, 0x28, 0x6C, 0x69, 0x6E, 0x65, 0x73, 0x20, 0x21,
	0x3D, 0x20, 0x22, 0x22, 0x29, 0x20, 0x7B, 0x0A, 0x09, 0x09, 0x09, 0x6C,
	0x69, 0x6E, 0x65, 0x73, 0x20, 0x3D, 0x20, 0x6C, 0x69, 0x6E, 0x65, 0x73,
	0x20, 0x22, 0x5C, 0x6E, 0x22, 0x3B, 0x0A, 0x09, 0x09, 0x7D, 0x0A, 0x09,
	0x09, 0x6C, 0x69, 0x6E, 0x65, 0x73, 0x20, 0x3D, 0x20, 0x6C, 0x69, 0x6E,
	0x65, 0x73, 0x20, 0x24, 0x30, 0x0A, 0x09, 0x7D, 0x0A, 0x0A, 0x09, 0x23,
	0x20, 0x46, 0x6F, 0x6F, 0x74, 0x65, 0x72, 0x20, 0x68, 0x61, 0x6E, 0x64,
	0x6C, 0x69, 0x6E, 0x67, 0x3A, 0x0A, 0x09, 0x23, 0x20, 0x49, 0x66, 0x20,
	0x74, 0x68, 0x65, 0x20, 0x6C, 0x61, 0x73, 0x74, 0x20, 0x62, 0x6C, 0x6F,
	0x63, 0x6B, 0x20, 0x69, 0x73, 0x20, 0x63, 0x6F, 0x6E, 0x73, 0x69, 0x64,
	0x65, 0x72, 0x65, 0x64, 0x20, 0x61, 0x20, 0x66, 0x6F, 0x6F, 0x74, 0x65,
	0x72, 0x2C, 0x20, 0x73, 0x70, 0x6C, 0x69, 0x63, 0x65, 0x20, 0x69, 0x6E,
	0x20, 0x74, 0x68, 0x65, 0x20, 0x43, 0x68, 0x61, 0x6E, 0x67, 0x65, 0x2D,
	0x49, 0x64, 0x20, 0x61, 0x74, 0x20, 0x74, 0x68, 0x65, 0x0A, 0x09, 0x23,
	0x20, 0x72, 0x69, 0x67, 0x68, 0x74, 0x20, 0x70, 0x6C, 0x61, 0x63, 0x65,
	0x2E, 0x0A, 0x09, 0x23, 0x20, 0x4C, 0x6F, 0x6F, 0x6B, 0x20, 0x66, 0x6F,
	0x72, 0x20, 0x74, 0x68, 0x65, 0x20, 0x72, 0x69, 0x67, 0x68, 0x74, 0x20,
	0x70, 0x6C, 0x61, 0x63, 0x65, 0x20, 0x74, 0x6F, 0x20, 0x69, 0x6E, 0x6A,
	0x65, 0x63, 0x74, 0x20, 0x43, 0x68, 0x61, 0x6E, 0x67, 0x65, 0x2D, 0x49,
	0x64, 0x20, 0x62, 0x79, 0x20, 0x63, 0x6F, 0x6E, 0x73, 0x69, 0x64, 0x65,
	0x72, 0x69, 0x6E, 0x67, 0x0A, 0x09, 0x23, 0x20, 0x43, 0x48, 0x41, 0x4E,
	0x47, 0x45, 0x5F, 0x49, 0x44, 0x5F, 0x41, 0x46, 0x54, 0x45, 0x52, 0x2E,
	0x20, 0x4B, 0x65, 0x79, 0x73, 0x20, 0x6C, 0x69, 0x73, 0x74, 0x65, 0x64,
	0x20, 0x69, 0x6E, 0x20, 0x69, 0x74, 0x20, 0x28, 0x63, 0x61, 0x73, 0x65,
	0x20, 0x69, 0x6E, 0x73, 0x65, 0x6E, 0x73, 0x69, 0x74, 0x69, 0x76, 0x65,
	0x29, 0x20, 0x63, 0x6F, 0x6D, 0x65, 0x20, 0x66, 0x69, 0x72, 0x73, 0x74,
	0x2C, 0x0A, 0x09, 0x23, 0x20, 0x74, 0x68, 0x65, 0x6E, 0x20, 0x43, 0x68,
	0x61, 0x6E, 0x67, 0x65, 0x2D, 0x49, 0x64, 0x2C, 0x20, 0x74, 0x68, 0x65,
	0x6E, 0x20, 0x65, 0x76, 0x65, 0x72, 0x79, 0x74, 0x68, 0x69, 0x6E, 0x67,
	0x20, 0x65, 0x6C, 0x73, 0x65, 0x20, 0x28, 0x65, 0x67, 0x2E, 0x20, 0x53,
	0x69, 0x67, 0x6E, 0x65, 0x64, 0x2D, 0x6F, 0x66, 0x66, 0x2D, 0x62, 0x79,
	0x3A, 0x29, 0x2E, 0x0A, 0x09, 0x23, 0x0A, 0x09, 0x23, 0x20, 0x4F, 0x74,
	0x68, 0x65, 0x72, 0x77, 0x69, 0x73, 0x65, 0x20, 0x6A, 0x75, 0x73, 0x74,
	0x20, 0x70, 0x72, 0x69, 0x6E, 0x74, 0x20, 0x74, 0x68, 0x65, 0x20, 0x6C,
	0x61, 0x73, 0x74, 0x20, 0x62, 0x6C, 0x6F, 0x63, 0x6B, 0x2C, 0x20, 0x61,
	0x20, 0x6E, 0x65, 0x77, 0x20, 0x6C, 0x69, 0x6E, 0x65, 0x20, 0x61, 0x6E,
	0x64, 0x20, 0x74, 0x68, 0x65, 0x20, 0x43, 0x68, 0x61, 0x6E, 0x67, 0x65,
	0x2D, 0x49, 0x64, 0x20, 0x61, 0x73, 0x20, 0x61, 0x0A, 0x09, 0x23, 0x20,
	0x62, 0x6C, 0x6F, 0x63, 0x6B, 0x20, 0x6F, 0x66, 0x20, 0x69, 0x74, 0x73,
	0x20, 0x6F, 0x77, 0x6E, 0x2E, 0x0A, 0x09, 0x45, 0x4E, 0x44, 0x20, 0x7B,
	0x0A, 0x09, 0x09, 0x75, 0x6E, 0x70, 0x72, 0x69, 0x6E, 0x74, 0x65, 0x64,
	0x20, 0x3D, 0x20, 0x31, 0x0A, 0x09, 0x09, 0x69, 0x66, 0x20, 0x28, 0x69,
	0x73, 0x46, 0x6F, 0x6F, 0x74, 0x65, 0x72, 0x20, 0x3D, 0x3D, 0x20, 0x30,
	0x29, 0x20, 0x7B, 0x0A, 0x09, 0x09, 0x09, 0x70, 0x72, 0x69, 0x6E, 0x74,
	0x20, 0x6C, 0x69, 0x6E, 0x65, 0x73, 0x20, 0x22, 0x5C, 0x6E, 0x22, 0x0A,
	0x09, 0x09, 0x09, 0x6C, 0x69, 0x6E, 0x65, 0x73, 0x20, 0x3D, 0x20, 0x22,
	0x22, 0x0A, 0x09, 0x09, 0x7D, 0x0A, 0x09, 0x09, 0x63, 0x68, 0x61, 0x6E,
	0x67, 0x65, 0x49, 0x64, 0x41, 0x66, 0x74, 0x65, 0x72, 0x20, 0x3D, 0x20,
	0x22, 0x5E, 0x28, 0x22, 0x20, 0x74, 0x6F, 0x6C, 0x6F, 0x77, 0x65, 0x72,
	0x28, 0x22, 0x27, 0x22, 0x24, 0x43, 0x48, 0x41, 0x4E, 0x47, 0x45, 0x5F,
	0x49, 0x44, 0x5F, 0x41, 0x46, 0x54, 0x45, 0x52, 0x22, 0x27, 0x22, 0x29,
	0x20, 0x22, 0x29, 0x3A, 0x22, 0x0A, 0x09, 0x09, 0x6E, 0x75, 0x6D, 0x6C,
	0x69, 0x6E, 0x65, 0x73, 0x20, 0x3D, 0x20, 0x73, 0x70, 0x6C, 0x69, 0x74,
	0x28, 0x6C, 0x69, 0x6E, 0x65, 0x73, 0x2C, 0x20, 0x66, 0x6F, 0x6F, 0x74,
	0x65, 0x72, 0x2C, 0x20, 0x22, 0x5C, 0x6E, 0x22, 0x29, 0x0A, 0x09, 0x09,
	0x66, 0x6F, 0x72, 0x20, 0x28, 0x6C, 0x69, 0x6E, 0x65, 0x20, 0x3D, 0x20,
	0x31, 0x3B, 0x20, 0x6C, 0x69, 0x6E, 0x65, 0x20, 0x3C, 0x3D, 0x20, 0x6E,
	0x75, 0x6D, 0x6C, 0x69, 0x6E, 0x65, 0x73, 0x3B, 0x20, 0x6C, 0x69, 0x6E,
	0x65, 0x2B, 0x2B, 0x29, 0x20, 0x7B, 0x0A, 0x09, 0x09, 0x09, 0x69, 0x66,
	0x20, 0x28, 0x75, 0x6E, 0x70, 0x72, 0x69, 0x6E, 0x74, 0x65, 0x64, 0x20,
	0x26, 0x26, 0x20, 0x6D, 0x61, 0x74, 0x63, 0x68, 0x28, 0x74, 0x6F, 0x6C,
	0x6F, 0x77, 0x65, 0x72, 0x28, 0x66, 0x6F, 0x6F, 0x74, 0x65, 0x72, 0x5B,
	0x6C, 0x69, 0x6E, 0x65, 0x5D, 0x29, 0x2C, 0x20, 0x63, 0x68, 0x61, 0x6E,
	0x67, 0x65, 0x49, 0x64, 0x41, 0x66, 0x74, 0x65, 0x72, 0x29, 0x20, 0x21,
	0x3D, 0x20, 0x31, 0x29, 0x20, 0x7B, 0x0A, 0x09, 0x09, 0x09, 0x09, 0x75,
	0x6E, 0x70, 0x72, 0x69, 0x6E, 0x74, 0x65, 0x64, 0x20, 0x3D, 0x20, 0x30,
	0x0A, 0x09, 0x09, 0x09, 0x09, 0x70, 0x72, 0x69, 0x6E, 0x74, 0x20, 0x22,
	0x43, 0x68, 0x61, 0x6E, 0x67, 0x65, 0x2D, 0x49, 0x64, 0x3A, 0x20, 0x49,
	0x27, 0x22, 0x24, 0x69, 0x64, 0x22, 0x27, 0x22, 0x0A, 0x09, 0x09, 0x09,
	0x7D, 0x0A, 0x09, 0x09, 0x09, 0x70, 0x72, 0x69, 0x6E, 0x74, 0x20, 0x66,
	0x6F, 0x6F, 0x74, 0x65, 0x72, 0x5B, 0x6C, 0x69, 0x6E, 0x65, 0x5D, 0x0A,
	0x09, 0x09, 0x7D, 0x0A, 0x09, 0x09, 0x69, 0x66, 0x20, 0x28, 0x75, 0x6E,
	0x70, 0x72, 0x69, 0x6E, 0x74, 0x65, 0x64, 0x29, 0x20, 0x7B, 0x0A, 0x09,
	0x09, 0x09, 0x70, 0x72, 0x69, 0x6E, 0x74, 0x20, 0x22, 0x43, 0x68, 0x61,
	0x6E, 0x67, 0x65, 0x2D, 0x49, 0x64, 0x3A, 0x20, 0x49, 0x27, 0x22, 0x24,
	0x69, 0x64, 0x22, 0x27, 0x22, 0x0A, 0x09, 0x09, 0x7D, 0x0A, 0x09, 0x7D,
	0x27, 0x20, 0x22, 0x24, 0x4D, 0x53, 0x47, 0x22, 0x20, 0x3E, 0x20, 0x22,
	0x24, 0x54, 0x22, 0x20, 0x26, 0x26, 0x20, 0x6D, 0x76, 0x20, 0x22, 0x24,
	0x54, 0x22, 0x20, 0x22, 0x24, 0x4D, 0x53, 0x47, 0x22, 0x20, 0x7C, 0x7C,
	0x20, 0x72, 0x6D, 0x20, 0x2D, 0x66, 0x20, 0x22, 0x24, 0x54, 0x22, 0x0A,
	0x7D, 0x0A, 0x5F, 0x67, 0x65, 0x6E, 0x5F, 0x43, 0x68, 0x61, 0x6E, 0x67,
	0x65, 0x49, 0x64, 0x49, 0x6E, 0x70, 0x75, 0x74, 0x28, 0x29, 0x20, 0x7B,
	0x0A, 0x09, 0x65, 0x63, 0x68, 0x6F, 0x20, 0x22, 0x74, 0x72, 0x65, 0x65,
	0x20, 0x60, 0x67, 0x69, 0x74, 0x20, 0x77, 0x72, 0x69, 0x74, 0x65, 0x2D,
	0x74, 0x72, 0x65, 0x65, 0x60, 0x22, 0x0A, 0x09, 0x69, 0x66, 0x20, 0x70,
	0x61, 0x72, 0x65, 0x6E, 0x74, 0x3D, 0x60, 0x67, 0x69, 0x74, 0x20, 0x72,
	0x65, 0x76, 0x2D, 0x70, 0x61, 0x72, 0x73, 0x65, 0x20, 0x22, 0x48, 0x45,
	0x41, 0x44, 0x5E, 0x30, 0x22, 0x20, 0x32, 0x3E, 0x2F, 0x64, 0x65, 0x76,
	0x2F, 0x6E, 0x75, 0x6C, 0x6C, 0x60, 0x0A, 0x09, 0x74, 0x68, 0x65, 0x6E,
	0x0A, 0x09, 0x09, 0x65, 0x63, 0x68, 0x6F, 0x20, 0x22, 0x70, 0x61, 0x72,
	0x65, 0x6E, 0x74, 0x20, 0x24, 0x70, 0x61, 0x72, 0x65, 0x6E, 0x74, 0x22,
	0x0A, 0x09, 0x66, 0x69, 0x0A, 0x09, 0x65, 0x63, 0x68, 0x6F, 0x20, 0x22,
	0x61, 0x75, 0x74, 0x68, 0x6F, 0x72, 0x20, 0x60, 0x67, 0x69, 0x74, 0x20,
	0x76, 0x61, 0x72, 0x20, 0x47, 0x49, 0x54, 0x5F, 0x41, 0x55, 0x54, 0x48,
	0x4F, 0x52, 0x5F, 0x49, 0x44, 0x45, 0x4E, 0x54, 0x60, 0x22, 0x0A, 0x09,
	0x65, 0x63, 0x68, 0x6F, 0x20, 0x22, 0x63, 0x6F, 0x6D, 0x6D, 0x69, 0x74,
	0x74, 0x65, 0x72, 0x20, 0x60, 0x67, 0x69, 0x74, 0x20, 0x76, 0x61, 0x72,
	0x20, 0x47, 0x49, 0x54, 0x5F, 0x43, 0x4F, 0x4D, 0x4D, 0x49, 0x54, 0x54,
	0x45, 0x52, 0x5F, 0x49, 0x44, 0x45, 0x4E, 0x54, 0x60, 0x22, 0x0A, 0x09,
	0x65, 0x63, 0x68, 0x6F, 0x0A, 0x09, 0x70, 0x72, 0x69, 0x6E, 0x74, 0x66,
	0x20, 0x27, 0x25, 0x73, 0x27, 0x20, 0x22, 0x24, 0x63, 0x6C, 0x65, 0x61,
	0x6E, 0x5F, 0x6D, 0x65, 0x73, 0x73, 0x61, 0x67, 0x65, 0x22, 0x0A, 0x7D,
	0x0A, 0x5F, 0x67, 0x65, 0x6E, 0x5F, 0x43, 0x68, 0x61, 0x6E, 0x67, 0x65,
	0x49, 0x64, 0x28, 0x29, 0x20, 0x7B, 0x0A, 0x09, 0x5F, 0x67, 0x65, 0x6E,
	0x5F, 0x43, 0x68, 0x61, 0x6E, 0x67, 0x65, 0x49, 0x64, 0x49, 0x6E, 0x70,
	0x75, 0x74, 0x20, 0x7C, 0x0A, 0x09, 0x67, 0x69, 0x74, 0x20, 0x68, 0x61,
	0x73, 0x68, 0x2D, 0x6F, 0x62, 0x6A, 0x65, 0x63, 0x74, 0x20, 0x2D, 0x74,
	0x20, 0x63, 0x6F, 0x6D, 0x6D, 0x69, 0x74, 0x20, 0x2D, 0x2D, 0x73, 0x74,
	0x64, 0x69, 0x6E, 0x0A, 0x7D, 0x0A, 0x0A, 0x0A, 0x61, 0x64, 0x64, 0x5F,
	0x43, 0x68, 0x61, 0x6E, 0x67, 0x65, 0x49, 0x64
};



