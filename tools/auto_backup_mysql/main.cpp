#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <time.h>
#include <sys/time.h>
#include <unistd.h>
#include <sys/types.h>
#include <sys/wait.h>
#include <dirent.h>
#include <vector>
#include <string>

const char * savedir = "scm_mysql_backup";

static void loop_backup();
static void backup_mysql(int year, int month, int mday, int hour, int min, int sec);
static void delete_old_backup_file(int year, int month);

int last_year = 0;
int last_month = 0;
int last_day = 0;
int last_hour = 0;
int last_min = 0;
int last_sec = 0;

char basefname[128];
char command[512];

int main(int argc, char** argv)
{
	char mkdir_cmd[64];

	sprintf(mkdir_cmd, "mkdir ~/%s", savedir);
	system(mkdir_cmd);

	while (1)
	{
		loop_backup();
		sleep(60*60);
		//sleep(2);
	}
    return 0;
}

static void loop_backup()
{
	time_t timep;
	struct tm *p;

	const char *wday[] = { "Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat" };

	//printf("loop_backup \n");
	time(&timep);
	p = localtime(&timep);					//取得当地时间

	int year = 1900 + p->tm_year;
	int month = 1 + p->tm_mon;
	int mday = p->tm_mday;
	int hour = p->tm_hour;
	int min = p->tm_min;
	int sec = p->tm_sec;

	if (year == last_year && month == last_month && mday == last_day)
	{
		//printf("same year, month, mday; skip !  \n");
		printf("current time: %04d-%02d-%02d %02d:%02d:%02d\n", year, month, mday, hour, min, sec);
		return;
	}

	delete_old_backup_file(year, month);
	backup_mysql(year, month, mday, hour, min, sec);

	last_year = year;
	last_month = month;
	last_day = mday;
	last_hour = hour;
	last_min = min;
	last_sec = sec;
}

static void backup_mysql(int year, int month, int mday, int hour, int min, int sec)
{
	int pid;
	int status = 0;
	static const char* argv[4];

	snprintf(basefname, sizeof(basefname) - 1 , "scm_%04d-%02d-%02d_%02d%02d%02d.sql",
		year, month, mday, hour, min, sec);
	basefname[sizeof(basefname) - 1] = 0;

	snprintf(command, sizeof(command) - 1, "mysqldump -uscmplatform -pscmplatform scm > ~/%s/%s", savedir, basefname);
	command[sizeof(command) - 1] = 0;
	
	argv[0] = "sh";
	argv[1] = "-c";
	argv[2] = command;
	argv[3] = NULL;

	pid = fork();
	if (pid == 0)
	{
		execvp(argv[0], (char* const*)argv);
		exit(-1);
	}
	else if (pid > 0)
	{
		wait(&status);
	}
	else if (pid < 0)
	{
		printf("fork()  error. \n");
		return;
	}
}

// 删除前两个月的备份文件
static void delete_old_backup_file(int year, int month)
{
	int year1, month1;
	DIR *dirptr = NULL;
	struct dirent *entry;
	char dirname[256];
	char pre1[64];
	char pre2[64];
	char * home = getenv("HOME");
	std::vector<std::string> cmds;

	strcpy(dirname, home);
	if (dirname[strlen(dirname) - 1] != '/')
		strcat(dirname, "/");
	strcat(dirname, savedir);

	dirptr = opendir(dirname);
	if (dirptr == NULL)
	{
		printf("opendir fail : %s \n", dirname);
		return;
	}

	year1 = year;
	month1 = month;
	if (month1 <= 1)
	{
		month1 = 12;
		year1 = 1;
	}
	else
	{
		month1--;
	}

	sprintf(pre1, "scm_%04d-%02d", year, month);
	sprintf(pre2, "scm_%04d-%02d", year1, month1);
	
	printf("delete old backup files. \n");

	while (entry = readdir(dirptr))
	{
		if (0 == strcmp(entry->d_name, "."))
			continue;
		if (0 == strcmp(entry->d_name, ".."))
			continue;
		if (0 == strncmp(entry->d_name, pre1, strlen(pre1)))
			continue;
		if (0 == strncmp(entry->d_name, pre2, strlen(pre2)))
			continue;

		/////////////////////////
		strcpy(command, "rm -f ");
		strcat(command, dirname);
		if (command[strlen(command) - 1] != '/')
			strcat(command, "/");
		strcat(command, entry->d_name);

		cmds.push_back(command);
	}
	closedir(dirptr);
	
	for (size_t i = 0; i < cmds.size(); i++)
	{
		system(cmds[i].c_str());
		printf("%s\n", cmds[i].c_str());
	}

	return;
}


