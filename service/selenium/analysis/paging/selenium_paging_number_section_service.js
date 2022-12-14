const { Key } = require("selenium-webdriver");
const SeleniumUtilService = require("../../util/selenium_util_service");
const SeleniumExistService = require("../exist/selenium_exist_service");
const SeleniumItemService = require("../item/selenium_item_service");

const SeleniumPagingNumberSectionService = {
  crawlNumberSection: async function (params) {
    const { driver, areaPaging, reqParams } = params;

    const domain = await SeleniumUtilService.getDomain(driver);
    reqParams["domain"] = domain;

    const isExistPaging = await SeleniumExistService.checkExistPaging(driver, {
      areaPaging,
    });
    if (!isExistPaging) {
      await this.navigatePageItems({
        driver,
        areaPaging,
        reqParams,
      });
    } else {
      await this.navigateSections({
        driver,
        areaPaging,
        reqParams,
      });
    }

    return ""; // TODO 리턴값 미확정
  },
  navigateSections: async function (params) {
    const { driver, areaPaging, reqParams } = params;
    let pageInfo;
    do {
      await this.navigatePages({ driver, areaPaging, reqParams });
      pageInfo = await this.loadPagingInfo(driver, areaPaging);

      if (!pageInfo.isLastPageSection) {
        await pageInfo.nextBtnEle.sendKeys(`${Key.ENTER}`);
        await SeleniumUtilService.waitLoading(driver, 2);
      }
    } while (!pageInfo.isLastPageSection);

    return ""; // TODO 리턴값 미확정
  },
  navigatePages: async function (params) {
    const { driver, areaPaging, reqParams } = params;
    const { areaPageNum } = areaPaging;

    let pageNumBtnEles = await this.extractPageNumBtnEles(driver, areaPaging);
    const pageMaxNum = pageNumBtnEles.length;
    console.log("pageMaxNum :", pageMaxNum);
    let pageIdx = 0;
    while (pageIdx < pageMaxNum) {
      console.log(`pageIdx : ${pageIdx}`);

      pageNumBtnEles = await this.extractPageNumBtnEles(driver, areaPaging);
      const pageNumBtnEle = pageNumBtnEles[pageIdx];

      await this.movePageNum(driver, pageNumBtnEle, areaPageNum);
      await this.navigatePageItems({ driver, areaPaging, reqParams });

      pageIdx = pageIdx + 1;
    }
    return ""; // TODO 리턴값 미확정
  },
  navigatePageItems: async function (params) {
    const { driver, areaPaging, reqParams } = params;
    const { areaPageNum } = areaPaging;

    let pageNumItemEles = await this.extractPageNumItemEles(
      driver,
      areaPageNum
    );

    const itemMaxNum = pageNumItemEles.length;
    console.log("itemMaxNum :", itemMaxNum);

    for (let itemIdx = 0; itemIdx < itemMaxNum; itemIdx++) {
      console.log(`itemIdx : ${itemIdx}`);

      //Need waiting for all images visible
      pageNumItemEles = await this.extractPageNumItemEles(driver, areaPageNum);

      if (pageNumItemEles.length !== itemMaxNum) {
        throw new Error("pageNumItemEles length is not equal to itemMaxNum");
      }

      //can be undefined.
      const pageNumItemEle = pageNumItemEles[itemIdx];
      if (pageNumItemEle === undefined) {
        console.error(
          `pageNumItemElesLength : ${pageNumItemEles.length}, itemMaxNum:${itemMaxNum}`
        );
        console.error(pageNumItemEle);
      }

      await this.navigatePageItem({
        driver,
        areaPageNum,
        pageNumItemEle,
        reqParams,
      });
    }

    return ""; // TODO 리턴값 미확정
  },
  navigatePageItem: async function (params) {
    const { driver, areaPageNum, pageNumItemEle, reqParams } = params;
    const { areaPageNumItem } = areaPageNum;
    const { domain, shopInfo, analysis, groupList } = reqParams;
    const { areaItem } = analysis;

    await this.openPageNumItem(driver, pageNumItemEle, areaPageNumItem);

    const item = await SeleniumItemService.crawlItemView(driver, {
      areaItem,
      domain,
    });
    console.log(item);
    await this.closePageNumItem(driver, pageNumItemEle, areaPageNumItem);
    return "";
  },
  loadPagingInfo: async function (driver, areaPaging) {
    const prevBtnEle = await this.extractPrevBtnEle(driver, areaPaging);
    const nextBtnEle = await this.extractNextBtnEle(driver, areaPaging);
    const isFirstPageSection = await this.testIsFirstPageSection(
      driver,
      areaPaging
    );
    const isLastPageSection = await this.testIsLastPageSection(
      driver,
      areaPaging
    );
    return {
      prevBtnEle,
      nextBtnEle,
      isFirstPageSection,
      isLastPageSection,
    };
  },
  extractPrevBtnEle: async function (driver, areaPaging) {
    const { areaPagingExtractPrevBtnEle } = areaPaging;
    if (SeleniumUtilService.checkIsDel(areaPagingExtractPrevBtnEle))
      return true;
    const prevBtnEle = await SeleniumUtilService.executeAreaQuery(
      driver,
      driver,
      areaPagingExtractPrevBtnEle
    );
    if (areaPagingExtractPrevBtnEle.waitSec)
      await SeleniumUtilService.waitLoading(
        driver,
        areaPagingExtractPrevBtnEle.waitSec
      );
    return prevBtnEle;
  },
  extractNextBtnEle: async function (driver, areaPaging) {
    const { areaPagingExtractNextBtnEle } = areaPaging;
    if (SeleniumUtilService.checkIsDel(areaPagingExtractNextBtnEle))
      return true;
    const nextBtnEle = await SeleniumUtilService.executeAreaQuery(
      driver,
      driver,
      areaPagingExtractNextBtnEle
    );
    if (areaPagingExtractNextBtnEle.waitSec)
      await SeleniumUtilService.waitLoading(
        driver,
        areaPagingExtractNextBtnEle.waitSec
      );
    return nextBtnEle;
  },
  testIsFirstPageSection: async function (driver, areaPaging) {
    const { testPagingIsFirstPageSection } = areaPaging;
    if (SeleniumUtilService.checkIsDel(testPagingIsFirstPageSection))
      return true;

    const isFirstPageSection = await SeleniumUtilService.testAreaQuery(
      driver,
      driver,
      testPagingIsFirstPageSection
    );

    if (testPagingIsFirstPageSection.waitSec)
      await SeleniumUtilService.waitLoading(
        driver,
        testPagingIsFirstPageSection.waitSec
      );
    return isFirstPageSection;
  },
  testIsLastPageSection: async function (driver, areaPaging) {
    const { testPagingIsLastPageSection } = areaPaging;
    if (SeleniumUtilService.checkIsDel(testPagingIsLastPageSection))
      return true;

    const isLastPageSection = await SeleniumUtilService.testAreaQuery(
      driver,
      driver,
      testPagingIsLastPageSection
    );

    if (testPagingIsLastPageSection.waitSec)
      await SeleniumUtilService.waitLoading(
        driver,
        testPagingIsLastPageSection.waitSec
      );
    return isLastPageSection;
  },
  extractPageNumBtnEles: async function (driver, areaPaging) {
    const { areaPagingExtractPageNumBtnEles } = areaPaging;
    if (SeleniumUtilService.checkIsDel(areaPagingExtractPageNumBtnEles))
      return true;

    await SeleniumUtilService.waitUntilItemsClickable(
      driver,
      areaPagingExtractPageNumBtnEles.area
    );

    const pageNumBtnEles = await SeleniumUtilService.executeAreaQuery(
      driver,
      driver,
      areaPagingExtractPageNumBtnEles
    );
    if (areaPagingExtractPageNumBtnEles.waitSec)
      await SeleniumUtilService.waitLoading(
        driver,
        areaPagingExtractPageNumBtnEles.waitSec
      );
    return pageNumBtnEles;
  },
  movePageNum: async function (driver, pageNumBtnEle, areaPageNum) {
    const { areaPageNumMove } = areaPageNum;
    if (SeleniumUtilService.checkIsDel(areaPageNumMove)) return true;
    const moveResult = await SeleniumUtilService.executeAreaQuery(
      driver,
      pageNumBtnEle,
      areaPageNumMove
    );

    await SeleniumUtilService.waitUntilPageLoaded(driver);

    // if (areaPageNumMove.waitSec)
    //   await SeleniumUtilService.waitLoading(driver, areaPageNumMove.waitSec);
    return moveResult;
  },
  extractPageNumItemEles: async function (driver, areaPaging) {
    const { areaPageNumExtractItemEles } = areaPaging;
    if (SeleniumUtilService.checkIsDel(areaPageNumExtractItemEles)) return true;

    if (areaPageNumExtractItemEles.waitSec)
      await SeleniumUtilService.waitLoading(
        driver,
        areaPageNumExtractItemEles.waitSec
      );

    await SeleniumUtilService.waitUntilItemsLoaded(
      driver,
      areaPageNumExtractItemEles.area
    );

    const pageNumItemEles = await SeleniumUtilService.executeAreaQuery(
      driver,
      driver,
      areaPageNumExtractItemEles
    );

    return pageNumItemEles;
  },
  openPageNumItem: async function (driver, pageNumItemEle, areaPageNumItem) {
    const { areaPageNumItemOpen } = areaPageNumItem;
    if (SeleniumUtilService.checkIsDel(areaPageNumItemOpen)) return true;
    const openReult = await SeleniumUtilService.executeAreaQuery(
      driver,
      pageNumItemEle,
      areaPageNumItemOpen
    );
    if (areaPageNumItemOpen.waitSec)
      await SeleniumUtilService.waitLoading(
        driver,
        areaPageNumItemOpen.waitSec
      );
    return openReult;
  },
  closePageNumItem: async function (driver, pageNumItemEle, areaPageNumItem) {
    const { areaPageNumItemClose } = areaPageNumItem;
    if (SeleniumUtilService.checkIsDel(areaPageNumItemClose)) return true;
    const closeReult = await SeleniumUtilService.executeAreaQuery(
      driver,
      pageNumItemEle,
      areaPageNumItemClose
    );
    if (areaPageNumItemClose.waitSec)
      await SeleniumUtilService.waitLoading(
        driver,
        areaPageNumItemClose.waitSec
      );
    return closeReult;
  },
};
module.exports = SeleniumPagingNumberSectionService;
