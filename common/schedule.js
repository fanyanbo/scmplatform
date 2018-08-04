let schedule = require('node-schedule');
let userModel = require('../user/userModel');
let logger = require('./logger');

let _schedule;
// 开启定时查询任务，目的保持连接的活跃，防止8小时断开
exports.startQuerySchedule = function () {
    logger.info('startQuerySchedule...');
    let rule = new schedule.RecurrenceRule();
    let hours = [1,7,13,19];
    let minutes = [30];
    let seconds = [30];
    rule.hour = hours;
    rule.minute = minutes;
    rule.second = seconds;
    _schedule = schedule.scheduleJob(rule,function(){
      userModel.query(null, function(err,result){
        if(err) logger.error('计时器查询发生错误');
        else {
          logger.info('query schedule: ' + new Date());
          logger.info('query result: ' + JSON.stringify(result[0]));
        }
      });
    })
};

exports.cancelSchedule = function() {
  _schedule.cancel();
}
