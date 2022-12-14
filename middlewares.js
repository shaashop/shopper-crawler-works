const { body, validationResult } = require("express-validator");

const validateParamsErrHandling = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ status: "N", error: errors.errors });
  }
  next();
};

const validationParamsMiddleware = (params) => {
  let middleware = [];
  for (const param of params) {
    // type에 따라서 다르게 줄 수도 있을 듯
    middleware.push(body(param).exists());
  }
  middleware.push(validateParamsErrHandling);

  return middleware;
};

exports.validationParamsMiddleware = validationParamsMiddleware;
