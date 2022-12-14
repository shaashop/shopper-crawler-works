const CommonService = require("../../common/common_service");
const ShopGroupModelService = require("../../shop_group/model/shop_group_model_service");
const ShopUploadModelService = require("../../shop_upload/model/shop_upload_model_service");
const ShopUploadService = require("../../shop_upload/shop_upload_service");
const ShopUploadItemModelService = require("../../shop_upload_item/model/shop_upload_item_model_service");
const SiteItemModelService = require("../../siteItem/model/site_item_model_service");
const SeleniumUtilService = require("../util/selenium_util_service");
const SeleniumGroupService = require("./group/selenium_group_service");
const SeleniumPagingService = require("./paging/selenium_paging_service");

const SeleniumAnalysisShopService = {
  crawlShopByAnalysis: async function (params) {
    const { analysis } = params;
    const { kind } = analysis;

    // category-all(전체상품), category-part(카테고리별)
    if (kind === "category-all") {
      await this.crawlCategoryAll(params);
    }
    // if(kind === 'category-part') { // NOTE 미구현
    //     await this.crawlCategoryPart(
    //         params
    //     );
    // }
    return ""; // TODO 리턴값 미확정
  },
  crawlCategoryAll: async function (params) {
    const { driver, analysis, shopUrl, shopInfo } = params;
    const { areaShopAllProductsUrl, areaGroupBox, areaPaging } = analysis;

    await this.openShopUrl(driver, shopUrl, areaShopAllProductsUrl);
    const groupList = await SeleniumGroupService.crawlGroups({
      driver,
      areaGroupBox,
      reqParams: {
        analysis,
        shopUrl,
        shopInfo,
      },
    });

    await SeleniumPagingService.crawlPaging({
      driver,
      areaPaging,
      reqParams: {
        analysis,
        shopUrl,
        shopInfo,
        groupList,
      },
    });
    return ""; // TODO 리턴값 미결정
  },
  crawlCategoryPart: async function (params) {
    console.log("crawlCategoryPart"); // NOTE 미구현
    return ""; // TODO 리턴값 미결정
  },
  refreshShop: async function (params) {
    const { driver, analysis, shopUrl, shopInfo, refreshShopDtl } = params;
    const { refreshShopUpload, refreshShopUploadItemList } = refreshShopDtl;

    //shopUploadId 기반으로 shopUpload, shopUploadItem 등 생성
    await this.crawlShopByAnalysis({
      driver,
      analysis,
      shopUrl,
      shopInfo,
    });

    //생성 후 shopUploadItem, shopUpload get
    const shopUploadItemListResult =
      await ShopUploadItemModelService.getShopUploadItemList({
        shopUploadId: shopInfo.shopUploadId,
      });
    const { shopUploadItemList } = shopUploadItemListResult;

    const shopUploadResult = await ShopUploadModelService.getShopUpload({
      shopUploadId: shopInfo.shopUploadId,
    });
    const { shopUpload } = shopUploadResult;

    const modifyResult = await this.modifyByRefreshShop({
      refreshShopUpload,
      refreshShopUploadItemList,
      shopUpload,
      shopUploadItemList,
    });
    const { isCompleteRefresh } = modifyResult;
    return {
      isCompleteRefresh,
    };
  },
  modifyByRefreshShop: async function (params) {
    const {
      refreshShopUpload,
      refreshShopUploadItemList,
      shopUpload,
      shopUploadItemList,
    } = params;
    let isCompleteRefresh = false;

    const divideResult = this.divideOverlap({
      //기존 list
      asisItemList: refreshShopUploadItemList,
      //새로운 list
      tobeItemList: shopUploadItemList,
    });
    const { asisOnlyArr, overlapObj, tobeOnlyArr } = divideResult;

    await this.removeSiteItemByAsisOnlyArr({ asisOnlyArr });
    await this.updateSiteItemByOverlapObj({ overlapObj });
    await this.removeAsisShopGroup({
      asisShopUpload: refreshShopUpload,
    });

    if (tobeOnlyArr.length === 0) {
      isCompleteRefresh = true;
      await ShopUploadService.toggleIsAvailableRefresh({
        tobeShopUploadId: shopUpload.id,
      });
    }
    return { isCompleteRefresh };
  },
  divideOverlap: function (params) {
    const { asisItemList, tobeItemList } = params;
    const asisOnlyArr = [];
    const overlapObj = {
      asisItemList: [],
      tobeItemList: [],
    };

    let _tobeItemList = [...tobeItemList];
    for (let asisIdx = 0; asisIdx < asisItemList.length; asisIdx++) {
      const asisItem = asisItemList[asisIdx];
      let isMatched = false;

      for (let tobeIdx = 0; tobeIdx < _tobeItemList.length; tobeIdx++) {
        const tobeItem = _tobeItemList[tobeIdx];
        if (asisItem.itemUrl === tobeItem.itemUrl) {
          overlapObj.asisItemList.push(asisItem);
          overlapObj.tobeItemList.push(tobeItem);
          _tobeItemList = _tobeItemList.filter((obj) => obj.id !== tobeItem.id);
          isMatched = true;
          break;
        }
      }
      if (isMatched) continue;
      if (asisIdx === asisItemList.length - 1) {
        asisOnlyArr.push(asisItem);
      }
    }
    const tobeOnlyArr = _tobeItemList;

    return {
      asisOnlyArr,
      overlapObj,
      tobeOnlyArr,
    };
  },
  removeSiteItemByAsisOnlyArr: async function (params) {
    // refreshItem만 있으면, siteItem 삭제
    const { asisOnlyArr } = params;
    const removeSiteItemIdList = [];
    for (const shopUploadItem of asisOnlyArr) {
      const { siteItemId } = shopUploadItem;
      removeSiteItemIdList.push(siteItemId);
    }
    if (removeSiteItemIdList.length > 0) {
      await SiteItemModelService.updateSiteItem(
        {
          isDel: "Y",
        },
        {
          where: {
            id: removeSiteItemIdList,
          },
        }
      );
    }
  },
  updateSiteItemByOverlapObj: async function (params) {
    // refreshItem에도 있고, shopUploadItem에도 있으면, siteItem 수정상품
    const { overlapObj } = params;
    const { asisItemList, tobeItemList } = overlapObj;

    for (const asisItem of asisItemList) {
      const tobeItem = this.findTobeItem({ tobeItemList, asisItem });
      await SiteItemModelService.updateSiteItem(
        {
          shopId: tobeItem.shopId,
          shopGroupId: tobeItem.shopGroupId,
          shopUploadItemId: tobeItem.id,
          name: tobeItem.itemName,
          image: tobeItem.thumbImage,
          price: tobeItem.price,
          originPrice: tobeItem.originPrice,
          currency: tobeItem.currency ? tobeItem.currency : "KRW",
          option: tobeItem.optionObj,
          description: tobeItem.itemDescription,
          isSoldOut: tobeItem.soldoutType,
        },
        {
          where: {
            id: asisItem.siteItemId,
          },
        }
      );
      await ShopUploadItemModelService.updateShopUploadItem(
        {
          isMatchedSiteItem: asisItem.isMatchedSiteItem,
          siteItemId: asisItem.siteItemId,
          grandParentCategoryId: asisItem.grandParentCategoryId,
          parentCategoryId: asisItem.parentCategoryId,
        },
        {
          where: {
            id: tobeItem.id,
          },
        }
      );
    }
  },
  findTobeItem: function (params) {
    const { tobeItemList, asisItem } = params;
    for (const tobeItem of tobeItemList) {
      if (
        CommonService.isEmpty(tobeItem.itemUrl) ||
        CommonService.isEmpty(tobeItem.itemUrl)
      ) {
        continue;
      }
      if (tobeItem.itemUrl === asisItem.itemUrl) {
        return tobeItem;
      }
    }
  },
  removeAsisShopGroup: async function (params) {
    const { asisShopUpload } = params;

    await ShopGroupModelService.updateShopGroup(
      {
        isDel: "Y",
      },
      {
        where: {
          id: asisShopUpload.id,
        },
      }
    );
  },
  openShopUrl: async function (driver, shopUrl, areaShopAllProductsUrl) {
    const { shopAllProductsUrlForm, waitSec } = areaShopAllProductsUrl;
    const shopAllProductsUrl = shopAllProductsUrlForm.replace(
      "${shopUrl}",
      shopUrl
    );

    //전체 상품 페이지
    await SeleniumUtilService.openDriverUrl(driver, shopAllProductsUrl);
    await SeleniumUtilService.waitLoading(driver, waitSec);
  },
};
module.exports = SeleniumAnalysisShopService;
