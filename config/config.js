/**
 * config
 * author : fanyanbo@skyworth.com
 */

var path = require('path');

var config = {
  // debug 为 true 时，用于本地调试
  debug: true,

  get mini_assets() { return !this.debug; }, // 是否启用静态文件的合并压缩，详见视图中的Loader

  name: 'Scmplatform', // 平台名字
  description: '酷开系统配置管理平台', // 平台的描述
  keywords: 'nodejs, node, express, connect, socket.io',

  // 域名
  host: 'localhost',

  // mongodb 配置
  db: 'mongodb://127.0.0.1/node_club_test',

  session_secret: 'scmplatform_secret', // 务必修改
  auth_cookie_name: 'scmplatform',

  // 程序运行的端口
  port: 3018,

  log_dir: path.join(__dirname, '../logs'),

  // 设置log输出路径等级:trace,debug,info,warn,error
  log_file_level: 'error',
  log_console_level: 'trace',
  //设置当前输出路径：log_file,log_console,default
  log_cur: 'log_console',

  // 邮箱配置
  mail_opts: {
    host: 'smtp.126.com',
    port: 25,
    auth: {
      user: 'club@126.com',
      pass: 'club'
    },
    ignoreTLS: true,
  },

  // oneapm 是个用来监控网站性能的服务
  oneapm_key: '',

  file_limit: '1MB',

};

if (process.env.NODE_ENV === 'test') {
  config.db = 'mongodb://127.0.0.1/node_club_test';
}

module.exports = config;
