const { By, Key } = require('selenium-webdriver');
const CommonService = require('../../../common/common_service');

const SeleniumWorker = {
    parseElFromArea: async function (driver, workJson){
        let result;
        const { area, resultKind, areaType }  = workJson;
        if (areaType == 'val')
            return area;
        if (areaType == 'css') { 
            if(resultKind === 'list')
                result = await this.crawlElesByCss(driver, area);
            if(resultKind === 'obj' || CommonService.isEmpty(resultKind))
                result = await this.crawlElByCss(driver, area);
        }
        return result;
    },
    workScript: async function(driver, targetEle, workJson){
        const result = await this.executeScript(driver, targetEle, workJson);
        return result;
    },
    crawlElByCss: async function (driver, area) { 
        const el = await driver.findElement(By.css(area));	
        return el;
    },
    crawlElesByCss: async function (driver, area) { 
        const eles = await driver.findElements(By.css(area));	
        return eles;
    },
    extractVal: async function (el, workJson){
        let result;
        const { areaExtract, resultKind } = workJson;
        if(resultKind === 'list')
            result = await this.extractValFromEles(el, areaExtract, workJson);
        else if(resultKind === 'obj') {
            result = await this.extractValFromEl(el, areaExtract, workJson);
        } else {
            throw new Error("not-defined-resultKind");
        }
        return result;
    },
    extractValFromEl: async function (el, areaExtract, params) { 
        let val = "";
        if(areaExtract == 'text')
            val = await el.getText();
        if(areaExtract == 'attrSrc')
            val = await el.getAttribute('src');
        if(areaExtract == 'attrAlt')
            val = await el.getAttribute('alt');
        if(areaExtract == 'attrContent')
            val = await el.getAttribute('content');
        if(areaExtract == 'attrValue')
            val = await el.getAttribute('value');
        if(areaExtract == 'attrCustomTarget'){
            const { attrTarget } = params;
            val = await el.getAttribute(attrTarget);
        }
        if(areaExtract == 'cssBackgroundImage'){
            val = await el.getCssValue("background-image");
            val = val.replace('url("','');
            val = val.slice(0,-2);  // remove last '")'
        }
        if(areaExtract == 'sendKeysEnter')
            val = await el.sendKeys(`${Key.ENTER}`);
        if(areaExtract == 'sendKeysWord'){
            const { sendKeysWord } = params;
            val = await el.sendKeys(sendKeysWord);
        }
        if(areaExtract == 'findElements')
            val = el;
        if(areaExtract == 'findElement')
            val = el;

        return val;
    },
    extractValFromEles: async function (eles, areaExtract, params) { 
        let vals = [];
        for (let i = 0; i < eles.length; i++) {
            const el = eles[i];
            const val = await this.extractValFromEl(el, areaExtract, params);
            vals.push(val)
        }
        return vals;
    },
    executeScript: async function (driver, targetEle, workJson) {
        let result;
        const { scriptCommand } = workJson;
        result = await driver.executeScript(scriptCommand)
        return result;
    },
    isRegistedArea: function(area){
        const registedArea = ['itself','child'];
        return registedArea.includes(area);
    },

};
module.exports = SeleniumWorker;
