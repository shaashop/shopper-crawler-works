const SeleniumUtilService = require("../../util/selenium_util_service");
const ShopGroupService = require("../../../shop_group/shop_group_service");
const ShopGroupModelService = require("../../../shop_group/model/shop_group_model_service");

const SeleniumGroupService = {
  crawlGroups: async function (params) {
    const { driver, areaGroupBox, reqParams } = params;
    const { analysis, shopUrl, shopInfo } = reqParams;
    const groups = [];

    await this.expandGroupBox(driver, areaGroupBox);
    await this.preprocessExtractGroup(driver, areaGroupBox);
    let groupBtnEles = await this.crawlGroupBtnEles(driver, areaGroupBox);

    for (let groupIdx = 0; groupIdx < groupBtnEles.length; groupIdx++) {
      const { areaGroup } = areaGroupBox;
      const groupBtnEle = groupBtnEles[groupIdx];
      const group = {};
      const title = await this.crawlGroupName(driver, groupBtnEle, areaGroup);

      group["title"] = title;
      groups.push(group);
    }

    await ShopGroupService.upsertGroupsByGroupName({ groups, shopInfo });
    const groupListResult = await ShopGroupModelService.getShopGroupList({
      shopId: shopInfo.shopId,
    });
    const { shopGroupList } = groupListResult;

    return shopGroupList;
  },
  crawlGroupBtnEles: async function (driver, areaGroupBox) {
    const groupBtnEles = await this.extractGroupBtnEles(driver, areaGroupBox);
    const { areaGroup } = areaGroupBox;
    const excludedGroupBtnEles = await this.removeExcludeGroup(
      driver,
      groupBtnEles,
      { areaGroup }
    );
    return excludedGroupBtnEles;
  },
  crawlGroupName: async function (driver, groupBtnEle, areaGroup) {
    const groupName = await this.extractGroupName(
      driver,
      groupBtnEle,
      areaGroup
    );
    return groupName;
  },
  expandGroupBox: async function (driver, areaGroupBox) {
    const { testAreaGroupBoxExpand } = areaGroupBox;
    if (SeleniumUtilService.checkIsDel(testAreaGroupBoxExpand)) return true;
    const result = await SeleniumUtilService.testAreaQuery(
      driver,
      driver,
      testAreaGroupBoxExpand
    );
    if (testAreaGroupBoxExpand.waitSec)
      await SeleniumUtilService.waitLoading(
        driver,
        testAreaGroupBoxExpand.waitSec
      );
    return result;
  },
  removeExcludeGroup: async function (driver, groupBtnEles, params) {
    const { areaGroup } = params;
    let j = 0;
    for (let i = 0; i < groupBtnEles.length; i++) {
      const groupBtnEle = groupBtnEles[i];
      const isEcludeGroup = await this.testIsEcludeGroup(
        driver,
        groupBtnEle,
        areaGroup
      );
      if (isEcludeGroup) {
        const k = i - j;
        groupBtnEles.splice(k, 1);
        j = j - 1;
      }
    }
    return groupBtnEles;
  },
  extractGroupBtnEles: async function (driver, areaGroupBox) {
    const { areaGroupBoxExtractGroupBtnEles } = areaGroupBox;
    if (SeleniumUtilService.checkIsDel(areaGroupBoxExtractGroupBtnEles))
      return true;
    const result = await SeleniumUtilService.executeAreaQuery(
      driver,
      driver,
      areaGroupBoxExtractGroupBtnEles
    );
    if (areaGroupBoxExtractGroupBtnEles.waitSec)
      await SeleniumUtilService.waitLoading(
        driver,
        areaGroupBoxExtractGroupBtnEles.waitSec
      );
    return result;
  },
  extractGroupName: async function (driver, groupBtnEle, areaGroup) {
    const { areaGroupExtractName } = areaGroup;
    if (SeleniumUtilService.checkIsDel(areaGroupExtractName)) return true;
    const result = await SeleniumUtilService.executeAreaQuery(
      driver,
      groupBtnEle,
      areaGroupExtractName
    );
    if (areaGroupExtractName.waitSec)
      await SeleniumUtilService.waitLoading(
        driver,
        areaGroupExtractName.waitSec
      );
    return result;
  },
  preprocessExtractGroup: async function (driver, areaGroup) {
    const { areaGroupBoxExtractPreprocess } = areaGroup;
    if (SeleniumUtilService.checkIsDel(areaGroupBoxExtractPreprocess))
      return true;
    const result = await SeleniumUtilService.executeAreaQuery(
      driver,
      null,
      areaGroupBoxExtractPreprocess
    );
    if (areaGroupBoxExtractPreprocess.waitSec)
      await SeleniumUtilService.waitLoading(
        driver,
        areaGroupBoxExtractPreprocess.waitSec
      );
    return result;
  },
  testIsEcludeGroup: async function (driver, groupBtnEle, areaGroup) {
    const { testGroupIsExcludeGroup } = areaGroup;
    if (SeleniumUtilService.checkIsDel(testGroupIsExcludeGroup)) return true;
    const result = await SeleniumUtilService.testAreaQuery(
      driver,
      groupBtnEle,
      testGroupIsExcludeGroup
    );
    if (testGroupIsExcludeGroup.waitSec)
      await SeleniumUtilService.waitLoading(
        driver,
        testGroupIsExcludeGroup.waitSec
      );
    return result;
  },
};
module.exports = SeleniumGroupService;
