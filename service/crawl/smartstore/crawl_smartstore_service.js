// load Service
const SeleniumService = require("../../selenium/selenium_service");
const OS_TYPE = require("../../../config/secret_key").get("OS");
const SHOP_ANALYSIS = require("./analysis/shop_analysis");
const AREA_OPTIONS = require("./analysis/area_options");
SHOP_ANALYSIS.analysis.areaItem.areaItemOption.areaOptions = AREA_OPTIONS;

// CrawlShopSmartstoreService
const CrawlShopSmartstoreService = {
  crawlItem: async function (req, res, paramJson) {
    console.log("#### crawlItem ####");
    const { url, shopInfo, crawlType } = paramJson;
    const shopAnalysis = SHOP_ANALYSIS;

    await SeleniumService.startCrawlWorker(req, res, {
      osType: OS_TYPE,
      url,
      shopInfo,
      shopAnalysis,
      crawlType,
    });
  },
};

module.exports = CrawlShopSmartstoreService;
