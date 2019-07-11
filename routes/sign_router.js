var express = require('express');
var router = express.Router();
var sign = require('../user/sign');
var tools = require('../common/tools');

/* GET users listing. */
router.get('/', function(req, res, next) {
  // res.send(tools.formatDate(new Date(),false));
  res.redirect('http://172.20.217.11:3018/html/login.html');
});

router.post('/login', sign.login);
router.post('/verify', sign.verify);
router.post('/logout', sign.logout);
router.post('/sendMail', sign.sendMail);
router.post('/getUserInfo', sign.getUserInfo);

module.exports = router;
