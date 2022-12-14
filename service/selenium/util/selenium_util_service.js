const CommonService = require("../../common/common_service");
const SeleniumWorkService = require("./work/selenium_work_service");
const SeleniumTestService = require("./work/selenium_test_service");
const path = require("path");
const { By, until } = require("selenium-webdriver");

// WORK-TODO 
// 1. 설치한 PC 환경에 맞게 driver 설정
const CHROME_DRIVER_PATH_WIN = path.resolve(
  __dirname,
  "../webdriver/chrome108/chromedriver_win32/chromedriver.exe"
);

const SeleniumUtilService = {
  initDriver: async function (osType) {
    if (osType == "win") {
      const driver = await this.initDriverChrome();
      return driver;
    }
    if (osType == "linux") {
      const driver = await this.initDriverLinux();
      return driver;
    }
  },
  initDriverChrome: async function () {
    const webdriver = require("selenium-webdriver");
    const chrome = require("selenium-webdriver/chrome");

    const chromeOptions = new chrome.Options();
    // chromeOptions.addArguments("--headless");

    chromeOptions.addArguments("window-size=1920x1080");
    chromeOptions.addArguments("disable-gpu");

    const service = new chrome.ServiceBuilder(CHROME_DRIVER_PATH_WIN).build();
    chrome.setDefaultService(service);

    let driver = await new webdriver.Builder()
      .forBrowser("chrome")
      .setChromeOptions(chromeOptions)
      .build();
    return driver;
  },
  initDriverLinux: async function () {
    const { Builder } = require("selenium-webdriver");
    const chrome = require("selenium-webdriver/chrome");
    const options = new chrome.Options();
    options.addArguments("--headless");
    options.addArguments("--no-sandbox");
    options.addArguments("--disable-gpu");
    options.addArguments("--disable-dev-shm-usage");

    const driver = await new Builder()
      .forBrowser("chrome")
      .setChromeOptions(options)
      .withCapabilities({ browserName: "chrome" })
      .build();

    return driver;
  },
  openDriverUrl: async function (driver, url) {
    await driver.get(url);
    await this.waitUntilPageLoaded(driver);
  },
  waitLoading: async function (driver, sec) {
    await driver.sleep(sec * 1000);
  },
  waitUntilItemLoaded: async function (driver, selector) {
    await driver.wait(until.elementLocated(By.css(selector)));
  },
  waitUntilItemsLoaded: async function (driver, selector) {
    const elements = await driver.executeScript(
      `return document.querySelectorAll("${selector}")`
    );

    for (const element of elements) {
      await driver.wait(until.elementIsEnabled(element));
    }
  },
  waitUntilItemsClickable: async function (driver, selector) {
    try {
      const elements = await driver.executeScript(
        `return document.querySelectorAll("${selector}")`
      );

      for (const element of elements) {
        await driver.wait(until.elementIsVisible(element));
        await driver.wait(until.elementIsEnabled(element));
      }

      return true;
    } catch (err) {
      return false;
    }
  },
  //waiting for img visible
  waitUntilItemsVisible: async function (driver, selector) {
    const elements = await driver.findElements(By.css(selector));

    for (const element of elements) {
      await driver.wait(until.elementIsVisible(element));
    }
  },
  waitUntilPageLoaded: async function (driver) {
    await driver.wait(async function () {
      const readyState = await driver.executeScript(
        "return document.readyState"
      );
      if (readyState === "complete") {
        return true;
      }
    }, 12000);
  },
  checkIsDel: function (json) {
    const { isDel } = json;
    if (!isDel || isDel === "N") return false;
    else return true;
  },
  fixThumbImgUrl: function (thumbImgUrl, domain) {
    if (typeof thumbImgUrl != "string") return false;
    if (!thumbImgUrl.startsWith("http"))
      thumbImgUrl = `${domain}${thumbImgUrl}`;
    return thumbImgUrl;
  },
  fixPriceType: function (priceStr, priceCcy) {
    if (typeof priceStr != "string") return false;
    priceStr = priceStr.replace(/[^0-9.]+/g, "");
    return CommonService.trimPriceByCcy(priceStr, priceCcy);
  },
  getDomain: async function (driver) {
    const domain = await driver.executeScript("return location.origin;");
    return domain;
  },
  testAreaQuery: async function (driver, targetEle, workJson) {
    const result = await SeleniumTestService.test(driver, targetEle, workJson);
    return result;
  },
  executeAreaQuery: async function (driver, targetEle, workJson) {
    const result = await SeleniumWorkService.work(driver, targetEle, workJson);
    return result;
  },
};
module.exports = SeleniumUtilService;
