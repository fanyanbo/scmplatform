var validator      = require('validator');
var eventproxy     = require('eventproxy');
var config         = require('../config/config');
var logger         = require('../common/logger');

/**
 * @param {HttpRequest} req
 * @param {HttpResponse} res
 * @param {Function} next
 */
exports.add = function (req, res, next) {
    res.json("add:" + req.url);
};

exports.delete = function (req, res, next) {
    res.json("delete:" + req.url);
};

exports.query = function (req, res, next) {

};

exports.update = function (req, res, next) {

};
