var config = require('../config/config');
var logger = require('../common/logger');
var Statistics = require('../models/statistics');
var output = require('../common/output');

var statistics = new Statistics();

/**
 * @param {HttpRequest} req
 * @param {HttpResponse} res
 * @param {Function} next
 */
exports.getSummary = function (req, res, next) {

    statistics.getSummaryByQuery(null, function(err,results) {
      if(err) {
        return output.error(req,res);
      }
      let resultData = {};
      resultData.productTotalNum = results[0];
      resultData.chipTotalNum = results[1];
      resultData.modelTotalNum = results[2];
      resultData.mstarTotalNum = results[3];
      resultData.hisiTotalNum = results[4];
      resultData.rtkTotalNum = results[5];
      resultData.amlogicTotalNum = results[6];
      resultData.novaTotalNum = results[7];

      output.success(req,res,resultData);
    });
};
