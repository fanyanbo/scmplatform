var mailer = require('../common/mail');

let data = {
  from:"fanyanbo@skyworth.com",
  to:"linxinwang@skyworth.com",
  subject:"配置平台3.0邮件收发测试",
  desc:"hello"
};

console.log(data);
mailer.sendActiveMail(data,function(err,data){
  if (err) return console.log("发送邮件失败!");
  console.log("发送邮件成功!");
});
