var jwt     = require('jsonwebtoken');
var config  = require('../config/config');
var logger  = require('../common/logger');

/**
 * @param {HttpRequest} req
 * @param {HttpResponse} res
 * @param {Function} next
 */
exports.gen = function (req, res, next) {
    var content = { "msg" : "today is a good day"};
    var secretOrPrivateKey = "I am a goog man!";// 这是加密的key（密钥）
    var token = jwt.sign(content, secretOrPrivateKey, {
                      expiresIn: 60*2  // 2分钟过期
                  });
    logger.debug("token ：" +token );
    res.json("gen:" + req.url);
};

exports.verify = function (req, res, next) {

    var token = req.body.token || req.query.token || req.headers["x-access-token"];
    logger.debug("token ：" + token);
    var secretOrPrivateKey = "I am a goog man!";// 这是加密的key（密钥）
    jwt.verify(token, secretOrPrivateKey, function (err, decode) {
        if (err) {
            res.json({err:err})
        } else {
            logger.debug(decode.msg);
            res.json("verify:" + req.url);
        }
    });
    //res.json("verify:" + req.url);
};
