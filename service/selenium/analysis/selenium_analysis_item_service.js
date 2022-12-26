const { count } = require("console");
const { json } = require("../../common/router_service");
const SeleniumUtilService = require("../util/selenium_util_service");
const SeleniumExistService = require("./exist/selenium_exist_service");
const SeleniumItemService = require("./item/selenium_item_service");
// let arrCount = new Array();
var filecount = 1;


const SeleniumAnalysisItemService = {
  crawlItem: async function (params) {
    const { driver, analysis, itemUrl, shopInfo } = params;
    const { areaItem } = analysis;
    
    // console.log(areaItem);

    await this.openItemUrl(driver, itemUrl, areaItem);
    // console.log(areaItem)

    const isExistItem = await SeleniumExistService.checkExistItem(driver, {
      areaItem,
    });
    
    console.log(isExistItem)

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

    //json형식으로 리턴된거 item 안에 저장
    console.log(item);
   
    // WORK-TODO 
    // 2. item JSON을 파일로 저장
    var filecount = Math.floor(Math.random() * 100 + 1);


    var fs = require('fs');
    var fileFormat = JSON.stringify(item);
    // 디렉토리 위치설정하는 것이 매우 중요했음
    fs.writeFileSync('../CrawlFile'+ filecount + '.json', fileFormat, 'utf8', function(err){
      console.log(err)
    });

    filecount += 1;
    

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
