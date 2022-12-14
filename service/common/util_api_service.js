const request = require('request');
const CommonService = require('./common_service');

const UtilApiService = {
  reqPredictWeight: async function (req, res, paramJson) {
    const { itemUrl, itemCategory, itemCategoryId } = paramJson;
    return new Promise((resolve, reject) => {
      const option = {
        url:
          // 'http://localhost:3002/ai/weight/predict',
          'https://util-api-dot-shaashop-seoul.du.r.appspot.com​/ai/weight/predict',
        form: {
          itemUrl, itemCategory, itemCategoryId 
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
            'reqPredictWeight Error : ' + error,
          );
          resolve(false);
        }
      });
    });
  },
};

module.exports = UtilApiService;