var express = require('express');
var router = express.Router();


// 测试

var success = {"code": 1, "msg": "success"};
var failure = {"code": 0, "msg": "failure"};

router.get('/', function (req, res) {
    "use strict";
    res.json("api");
});









module.exports = router;
