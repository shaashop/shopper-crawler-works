const SeleniumWorker = require('./selenium_worker');
const SeleniumWorkService = require('./selenium_work_service');

const SeleniumTestService = {
    test: async function(driver, targetEle, testJson){
        const { testType } = testJson;
        // console.log(testJson)
        // console.log(1)
        let result;
        if(testType === 'compareEq'){
            const { compareTarget } = testJson;
            const workResult = await SeleniumWorkService.work(driver, targetEle, testJson)
            result = ( workResult === compareTarget);
        } else if(testType === 'alertPr'){
            const isAlertPresent = await this.checkIsAlertPresent(driver);
            if(isAlertPresent){
                await driver.switchTo().alert().accept();
                result = true;
            } else {
                result = false;
            }
        } else if(testType === 'try'){
            const { areaExtract, area } = testJson;
            result = await this.tryWork(driver, {
                action : areaExtract, 
                key: area,
                testJson
            })
            
        } else if(testType === 'tryWork'){
            try {
                result = await SeleniumWorkService.work(driver, targetEle, testJson)
            } catch (error) {
                return false;
            }
        } else {
            throw new Error("not-defined-testType");
        }
        return result;
    },
    tryWork: async function (driver, params) {
        const { action, key, testJson} = params
        // console.log(params)
        try {
            if(action === 'findElement'){
                await SeleniumWorker.parseElFromArea(driver, testJson)
            } else if(action === 'getText'){
                await driver.getText();
            } else if(action === 'sendKeys'){
                await driver.sendKeys(key);
            }
            return true;
        } catch (error) {
            return false;
        }
    },
    checkIsAlertPresent: async function(driver){
        try {
            await driver.switchTo().alert(); 
            return true;
        } catch (error) {
            return false;
        }
    },



    // testWork: async function(driver, targetEle, testJson){
    //     const { areaCode } = testJson;
    //     let result;
    //     if(areaCode === 'area'){
    //         result = await this.testWorkArea(driver, targetEle, testJson)
    //     } else if(areaCode === 'script'){
    //         result = await this.workScript(driver, targetEle, testJson)
    //     } else {
    //         throw new Error("not-defined-areacode");
    //     }
    //     return result;
    // },
    // testWorkArea: async function(driver, targetEle, testJson){
    //     const { area } = testJson;
    //     let result;
    //     if(SeleniumWorker.isRegistedArea(area)){
    //         result = await this.testWorkAreaRegisted(driver, targetEle, testJson);
    //     } else {
    //         result = await this.testWorkAreaDefault(driver, testJson);
    //     }
    //     return result;
    // },
    // testWorkAreaRegisted: async function(driver, targetEle, testJson){
    //     let result;
    //     const { area } = testJson;
    //     if(area === 'itself'){
    //         result = await this.testWorkAreaItSelf(targetEle, testJson);
    //     } else if(area === 'child'){
    //         result = await this.testWorkAreaChild(driver, targetEle, testJson);
    //     }
    //     return result;
    // },
    // testWorkAreaItSelf: async function (targetEle, testJson){
    //     let result = await SeleniumWorker.extractVal(targetEle, testJson);
    //     return result;
    // },
    // testWorkAreaChild: async function (driver, testJson){
    //     const _testJson = { ...testJson };
    //     _testJson.area = _testJson.childArea;
    //     let result = await this.workAreaDefault(driver, testJson)
    //     return result;
    // },
    // testWorkAreaDefault: async function(driver, testJson){
    //     const elResult = await SeleniumWorker.parseElFromArea(driver, testJson);
    //     let result = await SeleniumWorker.extractVal(elResult, testJson);
    //     return result;
    // },
};
module.exports = SeleniumTestService;
