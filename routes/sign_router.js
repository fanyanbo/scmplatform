var express = require('express');
var router = express.Router();
var sign = require('../user/sign');

/* GET users listing. */
router.get('/', function(req, res, next) {
//  res.send('respond with a resource');
  res.redirect('http://172.20.5.239:3018/html/login.html');
});

router.post('/login', sign.login);
router.post('/verify', sign.verify);
router.post('/logout', sign.logout);
router.post('/sendMail', sign.sendMail);
router.post('/getUserInfo', sign.getUserInfo);

module.exports = router;
