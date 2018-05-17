/**
 * app.js
 * author : fanyanbo@skyworth.com
 */

require('colors');
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
//var logger = require('morgan');
var logger = require('./common/logger');
var session = require('express-session');
var MySQLStore = require('express-mysql-session')(session);
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var passport = require('passport');
var cors = require('cors');
var helmet = require('helmet');
var compress = require('compression');
var requestLog = require('./common/request_log');
var config = require('./config/config');
var index = require('./routes/index');
var signRouter = require('./routes/sign_router');
var apiRouterV6_0 = require('./routes/api_router_v6.0');
var apiRouterV6_5 = require('./routes/api_router_v6.5');

var app = express();

// 静态文件目录
var staticDir = path.join(__dirname, 'public');
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(requestLog);

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
//app.use(logger('dev'));
app.use(require('response-time')()); //http response x-response-time
app.use(helmet.frameguard('sameorigin')); //防止点击劫持
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(compress());
// 静态文件目录
app.use(express.static(staticDir));

var sessionStore = new MySQLStore(config.mysql);
app.use(session({
  name: config.cookie_name,
  secret: config.session_secret,
  store: sessionStore,
  resave: false,
  saveUninitialized: false,
  cookie: {maxAge: config.cookie_maxAge}
}));

// app.use('/', index);
// app.use('/api/v1', cors(), apiRouterV1);

app.use('/', signRouter);
app.use('/', apiRouterV6_0);
app.use('/v6.5', apiRouterV6_5);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

process.on('uncaughtException', function (err) {
  console.error(err.stack);
  console.log("Node NOT Exiting...");
});

module.exports = app;
