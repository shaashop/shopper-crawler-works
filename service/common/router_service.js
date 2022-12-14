const request = require('request');
const CommonService = require('./common_service');

const RouterService = {
  json: function (err, res) {
    RouterService.jsonErr(err, res, 500);
  },
  jsonErr: function (err, res, httpCode) {
    res.status(httpCode);
    console.error(err);
    if (err.errors == null) {
      if (!res.headersSent) {
        res.json({ err_name: err.name, msg: err.message, status: 'N' });
      }
    } else {
      if (!res.headersSent) {
        res.json({
          err_name: err.errors[0].name,
          msg: err.errors[0].message,
          status: 'N',
        });
      }
    }
  },
  send: function (res, respJson) {
    if (!res.headersSent) {
      res.json(respJson);
    }
  },
  reqExchangeRate: async function (req, res, paramJson) {
    return new Promise(function (resolve, reject) {
      let paramForm = {};
      if (paramJson.currency) paramForm['currSgn'] = paramJson.currency;
      const options = {
        url:
          'https://util-api-dot-shaashop-seoul.du.r.appspot.com​/unipass/notice-exchange-rate',
        form: paramForm,
      };
      request.post(options, function (error, response, body) {
        const CommonService = require('./common_service');
        if (!error && response.statusCode == 200) {
          let resJson = JSON.parse(body);
          resolve(resJson.noticeExchangeRate);
        } else {
          reject(false);
          CommonService.execError(
            req,
            res,
            500,
            'reqExchangeRate Error : ' + error,
          );
        }
      });
    });
  },
  reqExchangeRateAll: async function (req, res, paramJson) {
    console.log(paramJson);
    return new Promise(function (resolve, reject) {
      const options = {
        url:
          'https://util-api-dot-shaashop-seoul.du.r.appspot.com​/unipass/notice-exchange-rate/all',
      };
      request.get(options, function (error, response, body) {
        if (!error && response.statusCode == 200) {
          let resJson = JSON.parse(body);
          resolve(resJson);
        } else {
          CommonService.execError(
            req,
            res,
            500,
            'reqExchangeRateAll Error : ' + error,
          );
          resolve(false);
        }
      });
    });
  },
  reqTranslateText: async function (req, res, paramJson) {
    const { text } = paramJson;
    return new Promise((resolve, reject) => {
      const option = {
        url:
          'https://util-api-dot-shaashop-seoul.du.r.appspot.com​/papago/translate',
        form: {
          source: 'ko',
          target: 'en',
          text,
        },
      };
      request.post(option, function (error, response, body) {
        if (!error && response.statusCode == 200) {
          let resJson = JSON.parse(body);
          resolve(resJson);
        } else {
          CommonService.execError(
            req,
            res,
            500,
            'reqTranslateText Error : ' + error,
          );
          resolve(false);
        }
      });
    });
  },
  reqTranslateTextJp2En: async function (req, res, paramJson) {
    const { text } = paramJson;
    return new Promise((resolve, reject) => {
      const option = {
        url:
          'https://util-api-dot-shaashop-seoul.du.r.appspot.com​/papago/translate',
        form: {
          source: 'ja',
          target: 'en',
          text,
        },
      };
      request.post(option, function (error, response, body) {
        if (!error && response.statusCode == 200) {
          let resJson = JSON.parse(body);
          resolve(resJson);
        } else {
          CommonService.execError(
            req,
            res,
            500,
            'reqTranslateTextJp2En Error : ' + error,
          );
          resolve(false);
        }
      });
    });
  },
};

module.exports = RouterService;
