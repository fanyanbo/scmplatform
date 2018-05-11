var express = require('express');
var router = express.Router();
var sign = require('../controllers/sign');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/login', sign.login);
router.post('/verify', sign.verify);
router.post('/logout', sign.logout);

module.exports = router;
