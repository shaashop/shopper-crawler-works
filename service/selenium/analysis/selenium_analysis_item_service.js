const SeleniumUtilService = require("../util/selenium_util_service");
const SeleniumExistService = require("./exist/selenium_exist_service");
const SeleniumItemService = require("./item/selenium_item_service");

const SeleniumAnalysisItemService = {
  crawlItem: async function (params) {
    const { driver, analysis, itemUrl, shopInfo } = params;
    const { areaItem } = analysis;

    await this.openItemUrl(driver, itemUrl, areaItem);

    const isExistItem = await SeleniumExistService.checkExistItem(driver, {
      areaItem,
    });

    if (isExistItem) {
      await this.saveItemWithCrawling({
        driver,
        analysis,
      });
    }
  },
  saveItemWithCrawling: async function (params) {
    const { driver, analysis } = params;
    const { areaItem } = analysis;

    const domain = await SeleniumUtilService.getDomain(driver);

    //실제 크롤링 진행(스크롤다운, 옵션 등등)
    const item = await SeleniumItemService.crawlItemView(driver, {
      areaItem,
      domain,
    });
    console.log(item);

    // WORK-TODO 
    // 2. item JSON을 파일로 저장


    const shopUploadItem = item;
    return shopUploadItem;
  },
  openItemUrl: async function (driver, itemUrl, areaItem) {
    const { waitSec } = areaItem;
    await SeleniumUtilService.openDriverUrl(driver, itemUrl);
    await SeleniumUtilService.waitLoading(driver, waitSec);
  },
};
module.exports = SeleniumAnalysisItemService;
