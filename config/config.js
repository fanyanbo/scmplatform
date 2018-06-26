/**
 * config.js
 * author : fanyanbo@skyworth.com
 */

var path = require('path');

var config = {
  // debug 为 true 时，用于本地调试
  debug: true,

  rootPath: path.join(__dirname, '../'),

  get mini_assets() { return !this.debug; }, // 是否启用静态文件的合并压缩，详见视图中的Loader

  name: '软件配置管理平台', // 平台名字
  description: '基于酷开系统的自动化软件产品配置管理平台', // 平台的描述
  keywords: 'nodejs, node, express, connect, socket.io',

  // 域名
  host: 'localhost',

  // 程序运行的端口
  port: 3018,

  // mongodb 配置
  mongodb: 'mongodb://127.0.0.1/scmplatform',

  mysql: {
    user: 'scmplatform', // 用户名
    password: 'scmplatform', // 密码
    database: 'scm', // 数据库
    host: '172.20.5.239', // host
    port: 3306, // 端口
    checkExpirationInterval: 24*60*60*1000, // How frequently expired sessions will be cleared; milliseconds
    connectionLimit: 1, // 连接池的连接个数，默认为 1
  //  prefix: 'scm_', // 数据表前缀，如果一个数据库里有多个项目，那项目之间的数据表可以通过前缀来区分
    dateStrings:true, // 强制timestamp,datetime,data类型以字符串类型返回，默认为false
    multipleStatements: true
  },

  // mysql: {
  //   user: 'root', // 用户名
  //   password: 'root', // 密码
  //   database: 'scm', // 数据库
  //   host: '127.0.0.1', // host
  //   port: 3306, // 端口
  //   checkExpirationInterval: 300*1000, // How frequently expired sessions will be cleared; milliseconds
  //   connectionLimit: 1, // 连接池的连接个数，默认为 1
  //   prefix: 'scm_', // 数据表前缀，如果一个数据库里有多个项目，那项目之间的数据表可以通过前缀来区分
  // },

  session_secret: 'scmp_ladygaga', // 务必修改
  cookie_name: 'scmp_sid',
  cookie_maxAge: 24*60*60*1000,     //60分钟

  log_dir: path.join(__dirname, '../logs'),

  // 设置log输出路径等级:trace,debug,info,warn,error
  log_file_level: 'info',
  log_console_level: 'trace',
  //设置当前输出路径：file,console,default
  log_cur: 'file',

  // 邮箱配置
  mail_opts: {
    host: 'mail.skyworth.com',
    port: 465,
    auth: {
      user: 'fanyanbo@skyworth.com',
      pass: 'fyb.1119'
    },
    tls: {rejectUnauthorized: false},
    debug:true
  //  ignoreTLS: true,
  },

  // oneapm 是个用来监控网站性能的服务
  oneapm_key: '',

  file_limit: '1MB',

};

if (process.env.NODE_ENV === 'test') {
  config.db = 'mongodb://127.0.0.1/scmplatform';
}

module.exports = config;
