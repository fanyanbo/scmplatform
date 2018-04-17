

var sendSuccessToFront = function (req, res, resultData, resultDesc) {

  let url = req.url;
  let desc = (resultDesc !== undefined) ? resultDesc : `${url} [Call Succeed]`;
  res.send({
    resultCode: 0,
    resultData: resultData,
    resultDesc: desc
  });
};

var sendErrorToFront = function (req, res, errorCode, errorDesc) {

  let url = req.url;
  let code = (errorCode !== undefined) ? errorCode : -1;
  let desc = (errorDesc !== undefined) ? errorDesc : `${url} [Call Failed]`;
  res.send({
    resultCode: code,
    resultDesc: desc
  });
};

exports.success = sendSuccessToFront;
exports.error = sendErrorToFront;
