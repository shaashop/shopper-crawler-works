const SeleniumUtilService = require("../../util/selenium_util_service");

const SeleniumOptionService = {
  findOptionContainers: async function (driver, params) {
    const { areaOptions } = params;
    let rootOptionContainers = [];

    for (const areaOption of areaOptions) {
      const isExist = await SeleniumUtilService.waitUntilItemsClickable(
        driver,
        areaOption.area
      );

      //no Element
      if (!isExist) {
        continue;
      }

      const optionEles = await this.extractOptions(driver, areaOption);

      for (const optionEle of optionEles) {
        const optionEleJson = {
          optionEle,
          areaOption,
        };

        rootOptionContainers.push(optionEleJson);
      }
    }

    return rootOptionContainers;
  },
  navigateOptions: async function (driver, params) {
    let {
      containers,
      containerIdx,
      selectedOptionIdxArr,
      itemPrice,
      areaItemOption,
    } = params;
    const option = {};

    let container = containers[containerIdx];
    let extractResult = await this.extractOptionContainer(driver, container);
    let { optionTitle, optionItemEles, areaOption } = extractResult;
    const { optionKind } = areaOption;

    option["optionTitle"] = optionTitle;
    option["optionKind"] = optionKind;

    await this.navigateOptionItems(driver, option, {
      optionKind,
      containerIdx,
      optionItemEles,
      areaItemOption,
      selectedOptionIdxArr,
      itemPrice,
    });
    return option;
  },
  navigateOptionItems: async function (driver, option, params) {
    const {
      optionKind,
      containerIdx,
      optionItemEles,
      areaItemOption,
      selectedOptionIdxArr,
      itemPrice,
    } = params;

    option["optionItems"] = [];
    if (optionKind === "direct") {
      await this.navigateDirectOptionItem(driver, {
        option,
        containerIdx,
        areaItemOption,
        selectedOptionIdxArr,
        itemPrice,
      });
    } else if (optionKind === "choice" || !optionKind) {
      await this.navigateChoiceOptionItems(driver, {
        option,
        containerIdx,
        optionItemEles,
        areaItemOption,
        selectedOptionIdxArr,
        itemPrice,
      });
    }
    // NOTE 해당 단계에서 선택했던 옵션 지우기
    selectedOptionIdxArr.pop();

    return option;
  },
  navigateDirectOptionItem: async function (driver, params) {
    const {
      option,
      containerIdx,
      areaItemOption,
      selectedOptionIdxArr,
      itemPrice,
    } = params;
    const { areaOptions, scripts } = areaItemOption;

    console.log("containerIdx :", containerIdx);
    console.log("optionItemIdx : direct");
    const optionItem = {};

    await this.resetPickBySeletedOption(driver, selectedOptionIdxArr, {
      areaOptions,
      scripts,
    });
    const dummyOptionItemIdx = 0;
    const pickResult = await this.pickOptionItem(
      driver,
      containerIdx,
      dummyOptionItemIdx,
      {
        areaOptions,
        scripts,
      }
    );
    const { optionItemEle, areaOptionItem, optionItemName } = pickResult;
    optionItem["optionItemName"] = optionItemName;

    selectedOptionIdxArr.push(dummyOptionItemIdx);
    await this.checkPriceAndDecideToNavigate(driver, {
      option,
      optionItem,
      areaOptionItem,
      paramsCrawlPrice: { optionItemEle, itemPrice, areaOptions, scripts },
      paramsNavigateOption: {
        areaOptions,
        containerIdx,
        selectedOptionIdxArr,
        itemPrice,
        areaItemOption,
      },
    });
    return option;
  },
  navigateChoiceOptionItems: async function (driver, params) {
    const {
      option,
      containerIdx,
      optionItemEles,
      areaItemOption,
      selectedOptionIdxArr,
      itemPrice,
    } = params;
    const { areaOptions, scripts } = areaItemOption;

    for (
      let optionItemIdx = 0;
      optionItemIdx < optionItemEles.length;
      optionItemIdx++
    ) {
      const optionItem = {};

      await this.resetPickBySeletedOption(driver, selectedOptionIdxArr, {
        areaOptions,
        scripts,
      });
      const pickResult = await this.pickOptionItem(
        driver,
        containerIdx,
        optionItemIdx,
        {
          areaOptions,
          scripts,
        }
      );
      const { optionItemEle, areaOptionItem, optionItemName, isOptionSoldOut } =
        pickResult;
      optionItem["optionItemName"] = optionItemName;
      optionItem["isOptionSoldOut"] = isOptionSoldOut;

      await this.checkPriceAndDecideToNavigate(driver, {
        option,
        optionItem,
        areaOptionItem,
        paramsCrawlPrice: { optionItemEle, itemPrice, areaOptions, scripts },
        paramsNavigateOption: {
          areaOptions,
          containerIdx,
          selectedOptionIdxArr,
          itemPrice,
          areaItemOption,
          optionItemIdx,
        },
      });
    }
    return option;
  },
  checkPriceAndDecideToNavigate: async function (driver, params) {
    const {
      option,
      optionItem,
      areaOptionItem,
      paramsCrawlPrice,
      paramsNavigateOption,
    } = params;
    const { isOptionSoldOut } = optionItem;
    const isValidatedOptionItemPrice = await this.validateOptionItemPrice(
      driver,
      areaOptionItem
    );

    if (isOptionSoldOut) {
      option["optionItems"].push(optionItem);
    } else if (isValidatedOptionItemPrice) {
      const { optionItemEle, itemPrice, areaOptions, scripts } =
        paramsCrawlPrice;
      const { areaDoAfterCrawlOptionItemPrice } = scripts;

      const optionItemPriceResult = await this.crawlOptionItemPrice(driver, {
        optionItemEle,
        areaOptionItem,
        itemPrice,
        areaOptions,
      });
      const { optionItemPrice, optionItemDiffPrice } = optionItemPriceResult;

      await this.doAfterCrawlOptionItemPrice(
        driver,
        areaDoAfterCrawlOptionItemPrice
      );

      optionItem["optionItemPrice"] = optionItemPrice;
      optionItem["optionItemDiffPrice"] = optionItemDiffPrice;
      option["optionItems"].push(optionItem);
    } else {
      const {
        areaOptions,
        containerIdx,
        selectedOptionIdxArr,
        itemPrice,
        areaItemOption,
        optionItemIdx,
      } = paramsNavigateOption;
      let containers = await this.findOptionContainers(driver, { areaOptions });

      selectedOptionIdxArr.push(optionItemIdx);

      const subOption = await this.navigateOptions(driver, {
        containers,
        containerIdx: containerIdx + 1,
        selectedOptionIdxArr,
        itemPrice,
        areaItemOption,
      });
      optionItem["subOption"] = subOption;
      option["optionItems"].push(optionItem);
    }
  },
  extractOptionContainer: async function (driver, container) {
    const { optionEle, areaOption } = container;
    const {
      areaOptionExtractTitle,
      areaOptionOpenItems,
      areaOptionExtractItemEles,
    } = areaOption;

    const optionTitle = await this.extractOptionTitle(
      driver,
      optionEle,
      areaOptionExtractTitle
    );
    await this.openOptionItems(driver, optionEle, areaOptionOpenItems);
    const optionItemEles = await this.extractOptionItemEles(
      driver,
      optionEle,
      areaOptionExtractItemEles
    );

    return { optionTitle, optionItemEles, areaOption };
  },
  extractOptions: async function (driver, areaOption) {
    const options = await SeleniumUtilService.executeAreaQuery(
      driver,
      driver,
      areaOption
    );
    if (areaOption.waitSec)
      await SeleniumUtilService.waitLoading(driver, areaOption.waitSec);
    return options;
  },
  resetPickBySeletedOption: async function (
    driver,
    selectedOptionIdxArr,
    params
  ) {
    const { areaOptions, scripts } = params;
    const { areaOptionFocusOut } = scripts;
    let containers = await this.findOptionContainers(driver, { areaOptions });

    await this.focusOutOption(driver, areaOptionFocusOut);

    for (let i = 0; i < containers.length; i++) {
      const selectedOptionIdx = selectedOptionIdxArr[i];
      if (selectedOptionIdx === undefined) break;

      await this.chooseItemOpeningOptionItems(driver, {
        optionIdx: i,
        selectedOptionIdx,
        areaOptions,
      });
      // const chooseResult = await this.chooseItemOpeningOptionItems(driver, {
      //     optionIdx : i,
      //     selectedOptionIdx,
      //     areaOptions,
      // });
      // if(!chooseResult) break;
    }
  },
  chooseItemOpeningOptionItems: async function (driver, params) {
    const { optionIdx, selectedOptionIdx, areaOptions } = params;
    const containers = await this.findOptionContainers(driver, { areaOptions });
    const container = containers[optionIdx];
    const { optionEle, areaOption } = container;
    const { areaOptionOpenItems, areaOptionExtractItemEles, areaOptionItem } =
      areaOption;

    await this.openOptionItems(driver, optionEle, areaOptionOpenItems);
    const optionItemEles = await this.extractOptionItemEles(
      driver,
      optionEle,
      areaOptionExtractItemEles
    );
    let optionItemEle = optionItemEles[selectedOptionIdx];

    const chooseResult = await this.chooseOptionItem(
      driver,
      optionItemEle,
      areaOptionItem
    );
    return chooseResult;
  },
  pickOptionItem: async function (driver, containerIdx, optionItemIdx, params) {
    const { areaOptions, scripts } = params;
    const { areaDoAfterChooseOptionItem } = scripts;

    // NOTE 옵션선택, 포커스아웃등이 동작되면 Selenium의 이전 webElement객체를 인식할 수 없어서 Option부터 다시 선택함
    let containers = await this.findOptionContainers(driver, { areaOptions });
    let container = containers[containerIdx];
    let { optionEle, areaOption } = container;
    const { areaOptionOpenItems, areaOptionExtractItemEles, areaOptionItem } =
      areaOption;

    await this.openOptionItems(driver, optionEle, areaOptionOpenItems);
    const optionItemEles = await this.extractOptionItemEles(
      driver,
      optionEle,
      areaOptionExtractItemEles
    );
    let optionItemEle = optionItemEles[optionItemIdx];

    let optionItemName = await this.extractOptionItemName(
      driver,
      optionItemEle,
      areaOptionItem
    );
    if (optionItemName === "") {
      optionItemName = await this.extractOptionItemNameAlts(
        driver,
        optionItemEle,
        areaOptionItem
      );
    }
    let isOptionSoldOut;
    try {
      await this.chooseOptionItem(driver, optionItemEle, areaOptionItem);
      isOptionSoldOut = await this.checkisOptionItemSoldOut(
        driver,
        optionItemEle,
        areaOptionItem
      );
    } catch (error) {
      isOptionSoldOut = true;
    }
    await this.doAfterChooseOptionItem(
      driver,
      optionItemEle,
      areaDoAfterChooseOptionItem
    );

    return { optionItemEle, areaOptionItem, optionItemName, isOptionSoldOut };
  },
  crawlOptionItemPrice: async function (driver, params) {
    const { optionItemEle, itemPrice, areaOptionItem } = params;

    const optionItemPriceStr = await this.extractOptionItemPrice(
      driver,
      optionItemEle,
      areaOptionItem
    );
    const calcResult = this.calcOptionItemDiffPrice({
      priceStr: optionItemPriceStr,
      priceCcy: "KRW",
      itemPrice,
    });
    const { optionItemPrice, optionItemDiffPrice } = calcResult;
    await this.closeOptionItemPrice(driver, optionItemEle, areaOptionItem);

    return { optionItemPrice, optionItemDiffPrice };
  },
  calcOptionItemDiffPrice: function (params) {
    const { priceStr, priceCcy, itemPrice } = params;
    const optionItemPrice = SeleniumUtilService.fixPriceType(
      priceStr,
      priceCcy
    );
    const optionItemDiffPrice = optionItemPrice - itemPrice;
    return { optionItemPrice, optionItemDiffPrice };
  },

  validateOptionItemPrice: async function (driver, areaOptionItem) {
    const { testOptionItemPriceValidated } = areaOptionItem;
    if (SeleniumUtilService.checkIsDel(testOptionItemPriceValidated))
      return true;
    const isValidatedOptionItemPrice = await SeleniumUtilService.testAreaQuery(
      driver,
      driver,
      testOptionItemPriceValidated
    );
    if (testOptionItemPriceValidated.waitSec)
      await SeleniumUtilService.waitLoading(
        driver,
        testOptionItemPriceValidated.waitSec
      );
    return isValidatedOptionItemPrice;
  },

  extractOptionTitle: async function (
    driver,
    optionEle,
    areaOptionExtractTitle
  ) {
    if (SeleniumUtilService.checkIsDel(areaOptionExtractTitle)) return true;
    const optionTitle = await SeleniumUtilService.executeAreaQuery(
      driver,
      optionEle,
      areaOptionExtractTitle
    );
    if (areaOptionExtractTitle.waitSec)
      await SeleniumUtilService.waitLoading(
        driver,
        areaOptionExtractTitle.waitSec
      );
    return optionTitle;
  },
  extractOptionItemEle: async function (
    driver,
    optionEle,
    areaOptionExtractItemEles
  ) {
    if (SeleniumUtilService.checkIsDel(areaOptionExtractItemEles)) return true;
    const optionItemEles = await SeleniumUtilService.executeAreaQuery(
      driver,
      optionEle,
      areaOptionExtractItemEles
    );
    if (areaOptionExtractItemEles.waitSec)
      await SeleniumUtilService.waitLoading(
        driver,
        areaOptionExtractItemEles.waitSec
      );
    return optionItemEles;
  },
  extractOptionItemEles: async function (
    driver,
    optionEle,
    areaOptionExtractItemEles
  ) {
    if (SeleniumUtilService.checkIsDel(areaOptionExtractItemEles)) return true;
    const optionItemEles = await SeleniumUtilService.executeAreaQuery(
      driver,
      optionEle,
      areaOptionExtractItemEles
    );
    if (areaOptionExtractItemEles.waitSec)
      await SeleniumUtilService.waitLoading(
        driver,
        areaOptionExtractItemEles.waitSec
      );
    return optionItemEles;
  },
  openOptionItems: async function (driver, optionEle, areaOptionOpenItems) {
    if (SeleniumUtilService.checkIsDel(areaOptionOpenItems)) return true;
    const openReult = await SeleniumUtilService.executeAreaQuery(
      driver,
      optionEle,
      areaOptionOpenItems
    );
    if (areaOptionOpenItems.waitSec)
      await SeleniumUtilService.waitLoading(
        driver,
        areaOptionOpenItems.waitSec
      );
    return openReult;
  },
  chooseOptionItem: async function (driver, optionItemEle, areaOptionItem) {
    const { areaOptionItemChoose } = areaOptionItem;
    if (SeleniumUtilService.checkIsDel(areaOptionItemChoose)) return true;
    const result = await SeleniumUtilService.executeAreaQuery(
      driver,
      optionItemEle,
      areaOptionItemChoose
    );
    if (areaOptionItemChoose.waitSec)
      await SeleniumUtilService.waitLoading(
        driver,
        areaOptionItemChoose.waitSec
      );
    return result;
  },
  checkisOptionItemSoldOut: async function (
    driver,
    optionItemEle,
    areaOptionItem
  ) {
    const { testOptionItemSoldOut } = areaOptionItem;
    if (SeleniumUtilService.checkIsDel(testOptionItemSoldOut)) return true;
    const result = await SeleniumUtilService.testAreaQuery(
      driver,
      optionItemEle,
      testOptionItemSoldOut
    );
    if (testOptionItemSoldOut.waitSec)
      await SeleniumUtilService.waitLoading(
        driver,
        testOptionItemSoldOut.waitSec
      );
    return result;
  },
  extractOptionItemName: async function (
    driver,
    optionItemEle,
    areaOptionItem
  ) {
    const { areaOptionItemExtractName } = areaOptionItem;
    if (SeleniumUtilService.checkIsDel(areaOptionItemExtractName)) return true;
    const optionItemName = await SeleniumUtilService.executeAreaQuery(
      driver,
      optionItemEle,
      areaOptionItemExtractName
    );
    if (areaOptionItemExtractName.waitSec)
      await SeleniumUtilService.waitLoading(
        driver,
        areaOptionItemExtractName.waitSec
      );
    return optionItemName;
  },
  extractOptionItemNameAlts: async function (
    driver,
    optionItemEle,
    areaOptionItem
  ) {
    const { areaOptionItemExtractNameAlts } = areaOptionItem;
    let optionItemName = "";
    for (const areaOptionItemExtractNameAlt of areaOptionItemExtractNameAlts) {
      optionItemName = await this.extractOptionItemNameAlt(
        driver,
        optionItemEle,
        areaOptionItemExtractNameAlt
      );
      if (optionItemName !== "") break;
    }
    return optionItemName;
  },
  extractOptionItemNameAlt: async function (
    driver,
    optionItemEle,
    areaOptionItemExtractNameAlt
  ) {
    if (SeleniumUtilService.checkIsDel(areaOptionItemExtractNameAlt))
      return true;
    const optionItemName = await SeleniumUtilService.executeAreaQuery(
      driver,
      optionItemEle,
      areaOptionItemExtractNameAlt
    );
    if (areaOptionItemExtractNameAlt.waitSec)
      await SeleniumUtilService.waitLoading(
        driver,
        areaOptionItemExtractNameAlt.waitSec
      );
    return optionItemName;
  },
  extractOptionItemPrice: async function (
    driver,
    optionItemEle,
    areaOptionItem
  ) {
    const { areaOptionItemExtractPrice } = areaOptionItem;
    if (SeleniumUtilService.checkIsDel(areaOptionItemExtractPrice)) return true;
    const optionItemPrice = await SeleniumUtilService.executeAreaQuery(
      driver,
      optionItemEle,
      areaOptionItemExtractPrice
    );
    if (areaOptionItemExtractPrice.waitSec)
      await SeleniumUtilService.waitLoading(
        driver,
        areaOptionItemExtractPrice.waitSec
      );
    return optionItemPrice;
  },
  closeOptionItemPrice: async function (driver, optionItemEle, areaOptionItem) {
    const { areaOptionItemPriceClose } = areaOptionItem;
    if (SeleniumUtilService.checkIsDel(areaOptionItemPriceClose)) return true;
    const optionItemPrice = await SeleniumUtilService.executeAreaQuery(
      driver,
      optionItemEle,
      areaOptionItemPriceClose
    );
    if (areaOptionItemPriceClose.waitSec)
      await SeleniumUtilService.waitLoading(
        driver,
        areaOptionItemPriceClose.waitSec
      );
    return optionItemPrice;
  },
  focusOutOption: async function (driver, areaOptionFocusOut) {
    if (SeleniumUtilService.checkIsDel(areaOptionFocusOut)) return true;
    const result = await SeleniumUtilService.executeAreaQuery(
      driver,
      driver,
      areaOptionFocusOut
    );
    if (areaOptionFocusOut.waitSec)
      await SeleniumUtilService.waitLoading(driver, areaOptionFocusOut.waitSec);
    return result;
  },
  doAfterChooseOptionItem: async function (
    driver,
    optionItemEle,
    areaDoAfterChooseOptionItem
  ) {
    if (SeleniumUtilService.checkIsDel(areaDoAfterChooseOptionItem))
      return true;
    const result = await SeleniumUtilService.executeAreaQuery(
      driver,
      optionItemEle,
      areaDoAfterChooseOptionItem
    );
    if (areaDoAfterChooseOptionItem.waitSec)
      await SeleniumUtilService.waitLoading(
        driver,
        areaDoAfterChooseOptionItem.waitSec
      );
    return result;
  },
  doAfterCrawlOptionItemPrice: async function (
    driver,
    areaDoAfterCrawlOptionItemPrice
  ) {
    if (SeleniumUtilService.checkIsDel(areaDoAfterCrawlOptionItemPrice))
      return true;
    const result = await SeleniumUtilService.executeAreaQuery(
      driver,
      driver,
      areaDoAfterCrawlOptionItemPrice
    );
    if (areaDoAfterCrawlOptionItemPrice.waitSec)
      await SeleniumUtilService.waitLoading(
        driver,
        areaDoAfterCrawlOptionItemPrice.waitSec
      );
    return result;
  },
};
module.exports = SeleniumOptionService;
