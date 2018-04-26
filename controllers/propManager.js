var validator = require('validator');
var propModel = require('../models/propModel');
var output = require('../common/output');
var logger = require('../common/logger');
/**
 * @param {HttpRequest} req
 * @param {HttpResponse} res
 * @param {Function} next
 */
 exports.query = function (req, res, next) {
   propModel.query(function(err,results) {
     if(err) {
       return output.error(req,res,err);
     }
     output.success(req,res,"查询Prop列表成功",results);
   });
 };
