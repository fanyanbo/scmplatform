var config = require('../config/config');
var logger = require('../common/logger');
var Statistics = require('../models/statistics');

var statistics = new Statistics();

/**
 * @param {HttpRequest} req
 * @param {HttpResponse} res
 * @param {Function} next
 */
exports.getSummary = function (req, res, next) {

    statistics.getSummaryByQuery(null, function(err,results) {
      if(err) {
        return res.json("getSummary Error");
      }
      let retObject = {};
      retObject.productTotalNum = results[0];
      retObject.chipTotalNum = results[1];
      retObject.modelTotalNum = results[2];
      retObject.mstarTotalNum = results[3];
      retObject.hisiTotalNum = results[4];
      retObject.rtkTotalNum = results[5];
      retObject.amlogicTotalNum = results[6];
      retObject.novaTotalNum = results[7];

      res.send(retObject);
    });
};
