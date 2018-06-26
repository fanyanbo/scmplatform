#include <stdio.h>
#include <string.h>
#include <stdlib.h>
#include <stdarg.h>
#include <unistd.h>
#include <fcntl.h>
#include <time.h>
#include <sys/types.h>
#include <sys/stat.h>
#include <sys/socket.h>
#include <arpa/inet.h>
#include <netinet/in.h>
#include <sys/time.h>
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
};

struct allinfo_t
{
	std::string					commit_sn;
	std::string					version;
	std::string					gitpath;
	std::string					branch;
	std::vector<fileinfo_t>		fileinfo;
};

void * process_thread(void * args);
int add_data(char * data);
int get_data(char ** pdata);
int process_cmd(char * str);
int parse_cmd(char * str, allinfo_t & allinfo);
int exec_cmd(const std::string & cmd, int echo);
int printlog(const char* format, ...);

const unsigned FLAG = 0x5A595857;
const short PORT = 10241;
const char * logName = "scm_git_full_log.log";
char logFileName[256];
FILE * fplog = NULL;
unsigned datahead[4] = { 0 };
char * pdata = NULL;
unsigned maxsize = 64 * 1024;

std::queue<char*>	qdata;
pthread_mutex_t		mutex;
pthread_cond_t		condvar;

int main(int argc, char** argv)
{
	int ret;
	int fdlog;
	char * home = getenv("HOME");

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

	pthread_t tid;
	ret = pthread_create(&tid, NULL, process_thread, NULL);
	if (ret == -1)
	{
		printf("cannot create thread. \n");
		exit(-1);
	}

	int server_sockfd, client_sockfd;
	int server_len, client_len;
	struct  sockaddr_in server_address, client_address;

	server_sockfd = socket(AF_INET, SOCK_STREAM, 0);    //创建SOCKET
	server_address.sin_family = AF_INET;                //指定通讯协议
	server_address.sin_addr.s_addr = htonl(INADDR_ANY); //相当于0.0.0.0
	server_address.sin_port = htons(PORT);
	server_len = sizeof(server_address);

	ret = bind(server_sockfd, (struct sockaddr *)&server_address, server_len);	//绑定SOCKET对象
	if (ret < 0)
	{
		printf("bind() error, %s\n", strerror(errno));
		exit(-1);
	}
	printf("bind() ok.\n");

	ret = listen(server_sockfd, 50);
	if (ret < 0)
	{
		printf("listen() error, %s\n", strerror(errno));
		exit(-1);
	}
	printf("listen() ok.\n");

	pdata = (char*)malloc(maxsize);

	while (1)
	{
		client_len = sizeof(client_address);
		client_sockfd = accept(server_sockfd, (struct sockaddr *)&client_address, (socklen_t *)&client_len);

		printlog("======================================================================================================\n");
		printlog("accept a new connection, socket id = %d \n", client_sockfd);

		if (client_sockfd >= 0)
		{
			unsigned flag, datasize;
			int n, readsize, cnt;

			memset(datahead, 0, sizeof(datahead));
			read(client_sockfd, datahead, sizeof(datahead));
			flag = datahead[0];
			//datasize = datahead[1];

			if (flag == FLAG)
			{
				char sizestr[16];

				printlog("tcp data flag is OK. \n");

				memset(sizestr, 0, sizeof(sizestr));
				memcpy(sizestr, &datahead[1], 12);

				datasize = atoi(sizestr);

				printlog("tcp datasize = %d \n", datasize);

				if (datasize > maxsize)
				{
					maxsize = datasize + 64 * 1024;
					pdata = (char*)realloc(pdata, maxsize);
				}

				readsize = (int)datasize;
				cnt = 0;
				while (readsize > 0)
				{
					n = read(client_sockfd, &pdata[cnt], readsize);
					if (n > 0)
					{
						cnt += n;
						readsize -= n;
					}
				}
				pdata[cnt] = 0;

				write(client_sockfd, "OK", 2);
				close(client_sockfd);

				add_data(pdata);

			}
			else
			{
				write(client_sockfd, "ERR", 3);
				close(client_sockfd);
			}
		}
		else
		{
			printlog("accept a new connection fail! \n");
			break;
		}
	}

	free(pdata);
	close(server_sockfd);
	fclose(fplog);

	printlog("exit service process ! \n");
	return 0;
}

int add_data(char * data)
{
	size_t len;
	char * nbuf;

	len = strlen(data);
	nbuf = (char*) malloc(len + 1);
	strcpy(nbuf, data);

	pthread_mutex_lock(&mutex);
	qdata.push(nbuf);
	pthread_mutex_unlock(&mutex);
	pthread_cond_signal(&condvar);
	return 0;
}

int get_data(char ** pdata)
{
	char * data;
	struct timespec waittime;
	struct timeval now;

	bool empty;

	data = NULL;

	pthread_mutex_lock(&mutex);
	if (!(empty = qdata.empty()))
	{
		data = qdata.front();
		qdata.pop();
	}
	pthread_mutex_unlock(&mutex);

	//	VNCLOGD("empty = %d, size = %d", empty, size);

	if (data != NULL)
	{
		*pdata = data;
		return 0;
	}

	gettimeofday(&now, NULL);
	waittime.tv_sec = now.tv_sec;
	waittime.tv_nsec = now.tv_usec * 1000 + 200 * 1000 * 1000;

	pthread_mutex_lock(&mutex);
	pthread_cond_timedwait(&condvar, &mutex, &waittime);
	pthread_mutex_unlock(&mutex);

	return -1;
}

void * process_thread(void * args)
{
	char * data;
	usleep(500 * 1000);

	while (1)
	{
		data = NULL;
		if (0 == get_data(&data))
		{
			if (data)
			{
				//printf("%s", data);
				process_cmd(data);
				free(data);
				data = NULL;
			}
		}
	}
	return NULL;
}

int process_cmd(char * str)
{
	size_t i;
	allinfo_t  allinfo;
	int ret;
	std::string commitmsg;
	std::string cmd;

	parse_cmd(str, allinfo);

	printlog("commit_sn : %s\n", allinfo.commit_sn.c_str());
	printlog("branch : %s\n", allinfo.branch.c_str());
	printlog("gitpath : %s\n", allinfo.gitpath.c_str());
	printlog("version : %s\n", allinfo.version.c_str());

	//////////////////////////////////////////////////////

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

	exec_cmd(std::string("git pull"), 1);

	for (i = 0; i < allinfo.fileinfo.size(); i++)
	{
		std::string dir_relpath;
		std::string file_relpath;

		if (allinfo.fileinfo[i].typeStr == "prop")
		{
			dir_relpath = "property/";
			file_relpath = dir_relpath + allinfo.fileinfo[i].finalName;
		}
		else if (allinfo.fileinfo[i].typeStr == "mk")
		{
			dir_relpath = "makefile/";
			file_relpath = dir_relpath + allinfo.fileinfo[i].finalName;
		}
		else
		{
			if (allinfo.fileinfo[i].panel == "0")
				dir_relpath = std::string("pcfg/") + allinfo.fileinfo[i].chip + "_" + allinfo.fileinfo[i].model + "/config/";
			else
				dir_relpath = std::string("pcfg/") + allinfo.fileinfo[i].chip + "_" + allinfo.fileinfo[i].model + "/" + allinfo.fileinfo[i].panel + "/config/";
			file_relpath = dir_relpath + allinfo.fileinfo[i].finalName;
		}

		commitmsg += "修改了 " + file_relpath + ";\n";

		if (dir_relpath != "")
		{
			cmd = std::string("mkdir -p ") + dir_relpath;
			exec_cmd(cmd, 1);
		}

		cmd = std::string("cp -f ") + allinfo.fileinfo[i].tempName + "  " + file_relpath;
		exec_cmd(cmd, 1);
		cmd = std::string("git add ") + file_relpath;
		exec_cmd(cmd, 1);
	}

	cmd = std::string("git commit -m  \'") + commitmsg + "\'";
	printlog("exec: %s\n", "git commit");
	exec_cmd(cmd, 0);
	cmd = std::string("git push origin HEAD:refs/for/") + allinfo.branch;
	exec_cmd(cmd, 1);

	return 0;
}

void parse_fileinfo_str(char * rdata, fileinfo_t & fileinfo)
{
	char cdata[3072];
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
	char rdata[3072] = { 0 };
	char * pequ;

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
	}
}

int parse_cmd(char * str, allinfo_t & allinfo)
{
	char linedata[3072] = {0};
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
			if (linedata[0])
			{
				parse_line(linedata, allinfo);
				linedata[0] = 0;
				cnt = 0;
			}
		}
		else
		{
			linedata[cnt++] = ch;
			linedata[cnt] = 0;

			if (cnt >= sizeof(linedata) - 3)
			{
				if (linedata[0])
				{
					parse_line(linedata, allinfo);
					linedata[0] = 0;
					cnt = 0;
				}
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
	char line[3072];

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


