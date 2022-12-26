// load Service
const CrawlSmartstoreService = require("./smartstore/crawl_smartstore_service");
const CrawlShopMusinsaService = require("./musinsa/crawl_musinsa_service");
const CrawlUtilService = require("./crawl_util_service");


// CrawlItemService
const CrawlItemService = {
  crawlItem: async function (req, res, paramJson) {
    const { url, crawlSource, shopInfo, crawlType } = paramJson;
    try {
      console.log("#### START CrawlItemService crawlItem ####");

      await this.crawlItemByCrawlSource(req, res, {
        url,
        crawlSource,
        shopInfo,
        crawlType,
      });
    } catch (err) {
      console.error(err);
    }
  },
  crawlItemByCrawlSource: async function (req, res, paramJson) {
    console.log("#### START crawlItemByCrawlSource ####");
    console.log(paramJson)
    const { url, crawlSource, shopInfo, crawlType } = paramJson;
    // shopInfo.crawlSourceName = CrawlUtilService.extractCrawlSourceName({
    //   url,
    //   crawlSource,
    // });
    // WORK-TODO 
    // 3. crawlSource가 musinsa인 크롤러 제작
    if (crawlSource == "smartstore") {
      await CrawlSmartstoreService.crawlItem(req, res, {
        url,
        shopInfo,
        crawlType,
      });
    
    }
    else if (crawlSource == 'musinsa'){
      await CrawlShopMusinsaService.crawlItem(req, res, {
        url,
        shopInfo,
        crawlType,
      });
    }
    
    console.log("#### END crawlItemByCrawlSource ####");
  },
};

module.exports = CrawlItemService;
