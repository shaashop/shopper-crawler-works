const SeleniumUtilService = require("./util/selenium_util_service");
const SeleniumAnalysisItemService = require("./analysis/selenium_analysis_item_service");
const { workerData, parentPort } = require("worker_threads");

//크롬드라이버 경로는 맞고, 여기에서 null이 나오는 문 발생
// console.log(workerData)
// console.log(parentPort)

parentPort.on("message", async (message) => {
  console.log("START");
  if (message === "START") {
    let driver;
    try {
      const { osType, analysis, shopInfo, url } = workerData;
      driver = await SeleniumUtilService.initDriver(osType);

      const result = await SeleniumAnalysisItemService.crawlItem({
        driver,
        analysis,
        itemUrl: url,
        shopInfo,
      });
      
      console.log(SeleniumAnalysisItemService);
      if (driver) await driver.quit();

      parentPort.close();
    } catch (err) {
      if (driver) await driver.quit();
      console.log(err);
      throw err;
    }
  }
});
