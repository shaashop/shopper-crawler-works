const SeleniumWorker = require('./selenium_worker');

const SeleniumWorkService = {
    work: async function(driver, targetEle, workJson){
        const { areaCode } = workJson;
        let result;
        if(areaCode === 'area'){
            result = await this.workArea(driver, targetEle, workJson)
        } else if(areaCode === 'script'){
            result = await this.workScript(driver, workJson)
        } else {
            throw new Error("not-defined-areacode");
        }
        return result;
    },
    workArea: async function(driver, targetEle, workJson){
        const { area } = workJson;
        let result;
        if(SeleniumWorker.isRegistedArea(area)){
            result = await this.workAreaRegisted(driver, targetEle, workJson);
        } else {
            result = await this.workAreaDefault(driver, workJson);
        }
        return result;
    },
    workAreaRegisted: async function(driver, targetEle, workJson){
        let result;
        const { area } = workJson;
        if(area === 'itself'){
            result = await this.workAreaItSelf(targetEle, workJson);
        } else if(area === 'child'){
            result = await this.workAreaChild(targetEle, workJson);
        }
        return result;
    },
    workAreaItSelf: async function (targetEle, workJson){
        let result = await SeleniumWorker.extractVal(targetEle, workJson);
        return result;
    },
    workAreaChild: async function (driver, workJson){
        const _workJson = { ...workJson };
        _workJson.area = _workJson.childArea;
        let result = await this.workAreaDefault(driver, _workJson)
        return result;
    },
    workAreaDefault: async function(driver, workJson){
        const elResult = await SeleniumWorker.parseElFromArea(driver, workJson);
        let result = await SeleniumWorker.extractVal(elResult, workJson);
        return result;
    },
    workScript: async function(driver, workJson){
        const { scriptCommand } = workJson;
        const result = await driver.executeScript(scriptCommand);
        return result;
    },
};
module.exports = SeleniumWorkService;
