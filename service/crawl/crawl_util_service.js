// load Service
const CommonService = require("../common/common_service");

// CrawlUtilService
const CrawlUtilService = {
  shopList: [
    {
      crawlSource: "smartstore",
      domain: "smartstore.naver.com",
    },
  ],
  validateUrlInCrawlSource: async function (req, res, paramJson) {
    let result = { status: "N" };
    const { url, crawlSource } = paramJson;
    let urlObj;

    try {
      urlObj = new URL(url);
    } catch (err) {
      CommonService.execError(req, res, 400, "invalid-url");
      return result;
    }

    const shop = this.shopList.find((obj) => obj.crawlSource == crawlSource);
    if (CommonService.isEmpty(shop)) {
      CommonService.execError(req, res, 400, "unmatched-crawl-source-type");
      return result;
    }

    if (urlObj.hostname !== shop.domain) {
      console.log("url", url);
      console.log("shop.domain", shop.domain);
      CommonService.execError(req, res, 400, "unmatched-domain-type");
      return result;
    }

    //smartstore.naver.com/azh/products/12313
    //이런 url이 들어올 경우 대비, 정규화된 url로 바꿔줘야함
    // const storeName = urlObj.pathname.split("/")[1];
    // const validatedUrl = urlObj.origin.concat(`/${storeName}`);

    result["status"] = "Y";
    // result["url"] = validatedUrl;
    return result;
  },
  extractCrawlSourceName: function (paramJson) {
    const { url, crawlSource } = paramJson;
    const shop = this.shopList.find((obj) => obj.crawlSource == crawlSource);
    const crawlSourceName = url.split(shop.domain)[1];
    return crawlSourceName;
  },
};

module.exports = CrawlUtilService;
