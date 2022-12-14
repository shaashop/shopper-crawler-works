const SeleniumUtilService = require("../../util/selenium_util_service");
const SeleniumOptionService = require("./selenium_option_service");
const ShopUploadItemCategoryService = require("../../../shop_upload_item/shop_upload_item_category_service");
const CommonService = require("../../../common/common_service");
const CATEGORY_DELIMITER = ShopUploadItemCategoryService.getCategoryDelimiter();

const SeleniumItemService = {
  crawlItemView: async function (driver, params) {
    const { areaItem, domain } = params;

    const item = await this.crawlItemViewInfo(driver, {
      areaItem,
      domain,
    });

    return item;
  },
  //코드 개선 필요
  scrollDownFullPage: async function (driver) {
    let isLast = false;
    let page_height = 0;
    let y_point = 500;
    const Y_RECOGNIZE_LAST = 1000;
    const SCROLL_POINT = 100;
    const SCROLL_WAIT_SEC = 0.03;

    while (!isLast) {
      page_height = await driver.executeScript(
        "return document.body.scrollHeight"
      );
      await driver.executeScript(`window.scrollTo(0, ${y_point});`);
      await SeleniumUtilService.waitLoading(driver, SCROLL_WAIT_SEC);
      if (y_point > page_height - Y_RECOGNIZE_LAST) isLast = true;
      y_point = y_point + SCROLL_POINT;
    }
  },
  crawlItemViewInfo: async function (driver, params) {
    const { areaItem, domain } = params;
    const { currency } = areaItem;
    let item = {};
    const itemUrl = await driver.getCurrentUrl();
    const itemName = await this.crawlItemName(driver, areaItem);
    const itemThumbImg = await this.crawlItemThumbImg(driver, areaItem, {
      domain,
    });
    const itemShopCategory = await this.crawlItemShopCategory(driver, areaItem);
    const itemPrice = await this.crawlItemPrice(driver, areaItem, { currency });
    const itemOriginPrice = await this.crawlItemOriginPrice(driver, areaItem, {
      itemPrice,
      currency,
    });
    let itemSoldOutType = await this.crawlItemSoldOutType(driver, areaItem);
    let itemOptions = [];
    try {
      itemOptions = await this.crawlItemOptions(driver, areaItem, {
        itemPrice,
      });
    } catch (error) {
      console.log(error);
    }
    const itemDetailImgs = await this.crawlItemDetailImgs(driver, areaItem);

    item["itemUrl"] = itemUrl;
    item["itemName"] = itemName;
    item["itemThumbImg"] = itemThumbImg;
    item["itemPrice"] = itemPrice;
    item["itemOriginPrice"] = itemOriginPrice;
    item["itemShopCategory"] = itemShopCategory;
    item["itemOptions"] = itemOptions;
    item["itemSoldOutType"] = itemSoldOutType;
    item["itemDetailImgs"] = itemDetailImgs;

    return item;
  },
  crawlItemName: async function (driver, areaItem) {
    const itemName = await this.extractItemName(driver, areaItem);
    return itemName;
  },
  crawlItemThumbImg: async function (driver, areaItem, params) {
    const { domain } = params;
    const itemThumbImgParsed = await this.extractItemThumbImg(driver, areaItem);
    const itemThumbImg = SeleniumUtilService.fixThumbImgUrl(
      itemThumbImgParsed,
      domain
    );
    return itemThumbImg;
  },
  crawlItemPrice: async function (driver, areaItem, params) {
    const { currency } = params;
    const itemPriceStr = await this.extractItemPrice(driver, areaItem);
    const itemPrice = SeleniumUtilService.fixPriceType(itemPriceStr, currency);
    return itemPrice;
  },
  crawlItemOriginPrice: async function (driver, areaItem, params) {
    const { itemPrice, currency } = params;
    try {
      const itemOriginPriceStr = await this.extractItemOriginPrice(
        driver,
        areaItem
      );
      const itemOriginPrice = SeleniumUtilService.fixPriceType(
        itemOriginPriceStr,
        currency
      );
      return itemOriginPrice;
    } catch (error) {
      return itemPrice;
    }
  },
  crawlItemSoldOutType: async function (driver, areaItem) {
    const isItemSoldOut = await this.crawlItemSoldOut(driver, areaItem);
    if (isItemSoldOut) return "Y";
    else return "N";
  },
  crawlItemSoldOut: async function (driver, areaItem) {
    const isItemSoldOut = await this.testItemSoldOut(driver, areaItem);
    return isItemSoldOut;
  },
  crawlItemShopCategory: async function (driver, areaItem) {
    const itemShopCategoryEles = await this.extractItemShopCategoryEles(
      driver,
      areaItem
    );

    let itemShopCategory = "";
    for (const [i, itemShopCategoryEle] of itemShopCategoryEles.entries()) {
      const itemShopCategoryStr = await itemShopCategoryEle.getText();
      itemShopCategory += itemShopCategoryStr;
      if (i < itemShopCategoryEles.length - 1)
        itemShopCategory += CATEGORY_DELIMITER;
    }
    return itemShopCategory;
  },
  crawlItemOptions: async function (driver, areaItem, params) {
    const { areaItemOption } = areaItem;
    const { areaOptions } = areaItemOption;
    let { itemPrice } = params;
    let options = [];

    let containers = await SeleniumOptionService.findOptionContainers(driver, {
      areaOptions,
    });
    if (containers.length === 0) return options;
    options = await SeleniumOptionService.navigateOptions(driver, {
      containers,
      containerIdx: 0,
      selectedOptionIdxArr: [],
      itemPrice,
      areaItemOption,
    });

    return options;
  },
  crawlItemDetailImgs: async function (driver, areaItem) {
    const itemDetailImgEles = await this.extractItemDetailImgEles(
      driver,
      areaItem
    );

    let resultTag = "";
    for (let i = 0; i < itemDetailImgEles.length; i++) {
      let itemDetailImgEle = itemDetailImgEles[i];
      let imgSrc = await itemDetailImgEle.getAttribute("src");
      let dataImgSrc = await itemDetailImgEle.getAttribute("data-src");

      if (CommonService.isEmpty(imgSrc) && CommonService.isEmpty(dataImgSrc))
        continue;

      const imgSrcVal =
        CommonService.isEmpty(imgSrc) || imgSrc.includes("data:image")
          ? dataImgSrc
          : imgSrc;

      let imgTag = `<img src="${imgSrcVal}" alt="item-detail-image">`;

      resultTag += imgTag;
    }
    resultTag = `<div class="detail_info">${resultTag}</div>`;

    return resultTag;
  },
  extractItemName: async function (driver, areaItem) {
    const { areaItemExtractName } = areaItem;
    if (SeleniumUtilService.checkIsDel(areaItemExtractName)) return true;

    await SeleniumUtilService.waitUntilItemLoaded(
      driver,
      areaItemExtractName.area
    );

    if (areaItemExtractName.waitSec)
      await SeleniumUtilService.waitLoading(
        driver,
        areaItemExtractName.waitSec
      );

    const itemName = await SeleniumUtilService.executeAreaQuery(
      driver,
      driver,
      areaItemExtractName
    );
    return itemName;
  },
  extractItemThumbImg: async function (driver, areaItem) {
    const { areaItemExtractThumbImg } = areaItem;
    if (SeleniumUtilService.checkIsDel(areaItemExtractThumbImg)) return true;

    await SeleniumUtilService.waitUntilItemsVisible(
      driver,
      areaItemExtractThumbImg.area
    );

    const itemThumbImg = await SeleniumUtilService.executeAreaQuery(
      driver,
      driver,
      areaItemExtractThumbImg
    );
    if (areaItemExtractThumbImg.waitSec)
      await SeleniumUtilService.waitLoading(
        driver,
        areaItemExtractThumbImg.waitSec
      );
    return itemThumbImg;
  },
  extractItemPrice: async function (driver, areaItem) {
    const { areaItemExtractPrice } = areaItem;
    if (SeleniumUtilService.checkIsDel(areaItemExtractPrice)) return true;
    const itemPrice = await SeleniumUtilService.executeAreaQuery(
      driver,
      driver,
      areaItemExtractPrice
    );
    if (areaItemExtractPrice.waitSec)
      await SeleniumUtilService.waitLoading(
        driver,
        areaItemExtractPrice.waitSec
      );
    return itemPrice;
  },
  extractItemOriginPrice: async function (driver, areaItem) {
    const { areaItemExtractOriginPrice } = areaItem;
    if (SeleniumUtilService.checkIsDel(areaItemExtractOriginPrice)) return true;
    const itemOriginPrice = await SeleniumUtilService.executeAreaQuery(
      driver,
      driver,
      areaItemExtractOriginPrice
    );
    if (areaItemExtractOriginPrice.waitSec)
      await SeleniumUtilService.waitLoading(
        driver,
        areaItemExtractOriginPrice.waitSec
      );
    return itemOriginPrice;
  },
  testItemSoldOut: async function (driver, areaItem) {
    const { testAreaItemSoldOut } = areaItem;
    if (SeleniumUtilService.checkIsDel(testAreaItemSoldOut)) return true;
    const isItemSoldOut = await SeleniumUtilService.testAreaQuery(
      driver,
      driver,
      testAreaItemSoldOut
    );
    if (testAreaItemSoldOut.waitSec)
      await SeleniumUtilService.waitLoading(
        driver,
        testAreaItemSoldOut.waitSec
      );
    return isItemSoldOut;
  },
  extractItemShopCategoryEles: async function (driver, areaItem) {
    const { areaItemExtractShopCategoryEles } = areaItem;
    if (SeleniumUtilService.checkIsDel(areaItemExtractShopCategoryEles))
      return true;
    const itemShopCategoryEles = await SeleniumUtilService.executeAreaQuery(
      driver,
      driver,
      areaItemExtractShopCategoryEles
    );
    if (areaItemExtractShopCategoryEles.waitSec)
      await SeleniumUtilService.waitLoading(
        driver,
        areaItemExtractShopCategoryEles.waitSec
      );
    return itemShopCategoryEles;
  },
  extractItemDetailImgEles: async function (driver, areaItem) {
    const { areaItemMainContainer } = areaItem;
    const { areaItemDetailImgEles } = areaItemMainContainer;

    const mainContainerEles = await this.extractMainContainer(
      driver,
      areaItemMainContainer
    );

    if (SeleniumUtilService.checkIsDel(areaItemDetailImgEles)) return true;

    await SeleniumUtilService.waitUntilItemsVisible(
      driver,
      areaItemDetailImgEles.childArea
    );

    let resultItemDetailImgEles = [];

    for (const mainContainerEl of mainContainerEles) {
      const itemDetailImgEles = await SeleniumUtilService.executeAreaQuery(
        driver,
        mainContainerEl,
        areaItemDetailImgEles
      );

      resultItemDetailImgEles =
        resultItemDetailImgEles.concat(itemDetailImgEles);
    }

    return resultItemDetailImgEles;
  },
  extractMainContainer: async function (driver, areaItemMainContainer) {
    if (SeleniumUtilService.checkIsDel(areaItemMainContainer)) return true;

    const mainContainerEles = await SeleniumUtilService.executeAreaQuery(
      driver,
      driver,
      areaItemMainContainer
    );

    if (areaItemMainContainer.waitSec) {
      await SeleniumUtilService.waitLoading(
        driver,
        areaItemMainContainer.waitSec
      );
    }

    return mainContainerEles;
  },
};
module.exports = SeleniumItemService;
