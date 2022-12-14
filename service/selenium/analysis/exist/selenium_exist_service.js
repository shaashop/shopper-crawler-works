const SeleniumUtilService = require('../../util/selenium_util_service');

const SeleniumExistService = {
    checkExistPaging: async function (driver, params) {
        const { areaPaging } = params
        const isExistPaging = await this.testIsExistPaging(driver, areaPaging);
        return isExistPaging;
    },
    testIsExistPaging: async function(driver, areaPaging){
        const { testAreaPagingExist } = areaPaging
        if(SeleniumUtilService.checkIsDel(testAreaPagingExist)) return true;
        const isExistPaging = await SeleniumUtilService.testAreaQuery(
            driver, 
            driver, 
            testAreaPagingExist
        );
        if(testAreaPagingExist.waitSec) 
            await SeleniumUtilService.waitLoading(driver, testAreaPagingExist.waitSec);
        return isExistPaging;
    },
    checkExistItem: async function (driver, params) {
        const { areaItem } = params
        const isExistItem = await this.testIsExistItem(driver, areaItem);
        return isExistItem;
    },
    testIsExistItem: async function(driver, areaItem){
        const { testAreaItemExist } = areaItem
        if(SeleniumUtilService.checkIsDel(testAreaItemExist)) return true;
        const isExistItem = await SeleniumUtilService.testAreaQuery(
            driver, 
            driver, 
            testAreaItemExist
        );
        if(testAreaItemExist.waitSec) 
            await SeleniumUtilService.waitLoading(driver, testAreaItemExist.waitSec);
        return isExistItem;
    },
};
module.exports = SeleniumExistService;
