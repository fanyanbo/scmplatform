

var sendSuccessToFront = function (req, res, resultDesc, resultData) {

  let url = req.url;
  let desc = (resultDesc !== undefined) ? resultDesc : `${url} [Call Succeed]`;
  res.send({
    resultCode: 0,
    resultDesc: desc,
    resultData: resultData
  });
};

var sendErrorToFront = function (req, res, errorDesc, errorCode) {

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
