var validator      = require('validator');
var eventproxy     = require('eventproxy');
var config         = require('../config/config');
//var User           = require('../proxy').User;
//var mail           = require('../common/mail');
//var tools          = require('../common/tools');
var utility        = require('utility');
var uuid           = require('node-uuid');
var logger         = require('../common/logger');


exports.signup = function (req, res, next) {
    logger.debug('login');
};

/**
 * Handle user login.
 *
 * @param {HttpRequest} req
 * @param {HttpResponse} res
 * @param {Function} next
 */
exports.login = function (req, res, next) {
    logger.debug('login');
    res.json("login");
};

exports.logout = function (req, res, next) {
    logger.debug('logout');
    res.json("logout");
};
