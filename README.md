# 软件配置管理平台V3.0 [dev_0323分支]
- 基于master拉取的dev_0323分支，可以提交代码
- 再次强调请不要提交代码到master分支


- 单独启动www服务:
- nodejs /home/scmplatform/scmplatform_v3/bin/www

- 启动www服务并监听（允许终端关闭退出并保持永久运行）
- nodejs /usr/lib/node_modules/forever/bin/monitor  /home/scmplatform/scmplatform_v3/bin/www

