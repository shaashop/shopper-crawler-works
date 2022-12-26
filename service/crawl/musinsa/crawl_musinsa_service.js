// load Service
const SeleniumService = require("../../selenium/selenium_service");
const OS_TYPE = require("../../../config/secret_key");
const SHOP_ANALYSIS = require("./analysis/shop_analysis");
const AREA_OPTIONS = require("./analysis/area_options");
SHOP_ANALYSIS.analysis.areaItem.areaItemOption.areaOptions = AREA_OPTIONS;

// 맥북은 OS 타입이 Darwin 임
// const os = require('os');
// console.log(os.type())
// console.log(OS_TYPE.get("OS"));

// CrawlShopMusinsaService
const CrawlShopMusinsaService = {
  crawlItem: async function (req, res, paramJson) {
    console.log("#### crawlItem ####");
    const { url, shopInfo, crawlType } = paramJson;
    const shopAnalysis = SHOP_ANALYSIS;

    await SeleniumService.startCrawlWorker(req, res, {
      osType: OS_TYPE.get("OS"),
      url,
      shopInfo,
      shopAnalysis,
      crawlType,
    });
  },
};

module.exports = CrawlShopMusinsaService;
