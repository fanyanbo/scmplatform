var config = require('../config/config');
var pathLib = require('path')

var env = process.env.NODE_ENV || "development"
console.log('logger.js env ' + env);

var log4js = require('log4js');
log4js.configure({
    appenders: {
      fileLogs: { type: 'file', filename: pathLib.join(config.log_dir, 'cheese.log') },
      console: { type: 'console' }
    },
    categories: {
       file: { appenders: ['fileLogs'], level: config.log_file_level },
       console: { appenders: ['console'], level: config.log_console_level },
       default: { appenders: ['console', 'fileLogs'], level: 'trace' }
   }
});

var logger = log4js.getLogger(config.log_cur);
//logger.setLevel(config.debug && env !== 'test' ? 'DEBUG' : 'ERROR')

//add by fanyanbo
// Object.defineProperty(global, '__stack', {
//   get: function(){
//     var orig = Error.prepareStackTrace;
//     Error.prepareStackTrace = function(_, stack){ return stack; };
//     var err = new Error;
//     Error.captureStackTrace(err, arguments.callee);
//     var stack = err.stack;
//     Error.prepareStackTrace = orig;
//     return stack;
//   }
// });
//
// Object.defineProperty(global, '__line', {
//   get: function(){
//     return __stack[1].getLineNumber();
//   }
// });
//
// console.log(__line);

module.exports = logger;
