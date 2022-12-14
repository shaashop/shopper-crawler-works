const areaOptions = [
    {
        areaCode: 'area',
        areaExtract : 'findElements',
        areaType : 'css',
        area : '._10hph879os .bd_3hLoi',
        resultKind : 'list',
        waitSec : 0,
        isDel: 'N',
        name : '기본',
        optionKind : 'choice',
        areaOptionExtractTitle : {
            areaCode : 'area',
            areaExtract : 'text',
            areaType : 'css',
            area : 'itself',
            resultKind : 'obj',
            waitSec : 0,
            isDel: 'N',
        },
        areaOptionOpenItems : {
            areaCode : 'area',
            areaExtract : 'sendKeysEnter',
            areaType : 'css',
            area : 'child',
            childArea : 'a',
            resultKind : 'obj',
            waitSec : 0.5,
            isDel: 'N',
        },
        areaOptionExtractItemEles : {
            areaCode : 'area',
            areaExtract : 'findElements',
            areaType : 'css',
            area : '._10hph879os .bd_1y1pd a',
            resultKind : 'list',
            waitSec : 0,
            isDel: 'N',
        },
        areaOptionItem : {
            areaOptionItemChoose : {
                areaCode : 'area',
                areaExtract : 'sendKeysEnter',
                areaType : 'css',
                area : 'itself',
                resultKind : 'obj',
                waitSec : 0.5,
                isDel: 'N',
            },
            areaOptionItemExtractName : {
                areaCode : 'area',
                areaExtract : 'text',
                areaType : 'css',
                area : 'itself',
                resultKind : 'obj',
                waitSec : 0,
                isDel: 'N',
            },
            areaOptionItemExtractPrice : {
                areaCode : 'area',
                areaExtract : 'text',
                areaType : 'css',
                area : '._10hph879os .bd_w1biV',
                resultKind : 'obj',
                waitSec : 0,
                isDel: 'N',
            },
            areaOptionItemPriceClose : {
                areaCode : 'area',
                areaExtract : 'sendKeysEnter',
                areaType : 'css',
                area : '._10hph879os .bd_2I3cR',
                resultKind : 'obj',
                waitSec : 0.5,
                isDel: 'N',
            },
            testOptionItemPriceValidated : {
                testType : 'try',
                areaCode : 'area',
                areaExtract : 'findElement',
                areaType : 'css',
                area : '._10hph879os .bd_w1biV',
                resultKind : 'obj',
                waitSec : 0,
                isDel: 'N',
            },
            testOptionItemSoldOut : {
                testType : 'alertPr',
                waitSec : 0,
                isDel: 'N',
            },
        }
    },
    {
        areaCode: 'area',
        areaExtract : 'findElements',
        areaType : 'css',
        area : '._10hph879os .bd_jcROt',
        resultKind : 'list',
        waitSec : 0,
        isDel: 'N',
        name : '기본2',
        optionKind : 'choice',
        areaOptionExtractTitle : {
            areaCode : 'area',
            areaExtract : 'text',
            areaType : 'css',
            area : 'itself',
            resultKind : 'obj',
            waitSec : 0,
            isDel: 'N',
        },
        areaOptionOpenItems : {
            areaCode : 'area',
            areaExtract : 'sendKeysEnter',
            areaType : 'css',
            area : 'child',
            childArea : 'a',
            resultKind : 'obj',
            waitSec : 0.5,
            isDel: 'N',
        },
        areaOptionExtractItemEles : {
            areaCode : 'area',
            areaExtract : 'findElements',
            areaType : 'css',
            area : '._10hph879os .bd_2mqfD a',
            resultKind : 'list',
            waitSec : 0,
            isDel: 'N',
        },
        areaOptionItem : {
            areaOptionItemChoose : {
                areaCode : 'area',
                areaExtract : 'sendKeysEnter',
                areaType : 'css',
                area : 'itself',
                resultKind : 'obj',
                waitSec : 0.5,
                isDel: 'N',
            },
            areaOptionItemExtractName : {
                areaCode : 'area',
                areaExtract : 'text',
                areaType : 'css',
                area : 'itself',
                resultKind : 'obj',
                waitSec : 0,
                isDel: 'N',
            },
            areaOptionItemExtractPrice : {
                areaCode : 'area',
                areaExtract : 'text',
                areaType : 'css',
                area : '._10hph879os .bd_w1biV',
                resultKind : 'obj',
                waitSec : 0,
                isDel: 'N',
            },
            areaOptionItemPriceClose : {
                areaCode : 'area',
                areaExtract : 'sendKeysEnter',
                areaType : 'css',
                area : '._10hph879os .bd_2I3cR',
                resultKind : 'obj',
                waitSec : 0.5,
                isDel: 'N',
            },
            testOptionItemPriceValidated : {
                testType : 'try',
                areaCode : 'area',
                areaExtract : 'findElement',
                areaType : 'css',
                area : '._10hph879os .bd_w1biV',
                resultKind : 'obj',
                waitSec : 0,
                isDel: 'N',
            },
            testOptionItemSoldOut : {
                testType : 'alertPr',
                waitSec : 0,
                isDel: 'N',
            },
        }
    },
    {
        areaCode : 'area',
        areaExtract : 'findElements',
        areaType : 'css',
        area : '._10hph879os .bd_3vPl2',
        resultKind : 'list',
        waitSec : 0,
        isDel: 'N',
        name : '색상선택',
        optionKind : 'choice',
        areaOptionExtractTitle : {
            areaCode : 'area',
            areaExtract : 'text',
            areaType : 'css',
            area : 'child',
            childArea : '.bd_3Rh4d',
            resultKind : 'obj',
            waitSec : 0,
            isDel: 'N',
        },
        areaOptionOpenItems : {
            // areaExtract : 'sendKeysEnter',
            // areaType : 'css',
            // area : 'child',
            // childArea : 'button',
            // resultKind : 'obj',
            // waitSec : 0.5,
            isDel: 'Y',
        },
        areaOptionExtractItemEles : {
            areaCode : 'area',
            areaExtract : 'findElements',
            areaType : 'css',
            area : 'child',
            childArea : 'button',
            resultKind : 'list',
            waitSec : 0,
            isDel: 'N',
        },
        areaOptionItem : {
            areaOptionItemChoose : {
                areaCode : 'area',
                areaExtract : 'sendKeysEnter',
                areaType : 'css',
                area : 'itself',
                resultKind : 'obj',
                waitSec : 0.5,
                isDel: 'N',
            },
            areaOptionItemExtractName : {
                areaCode : 'area',
                areaExtract : 'text',
                areaType : 'css',
                area : 'itself',
                resultKind : 'obj',
                waitSec : 0,
                isDel: 'N',
            },
            areaOptionItemExtractNameAlts : [
                {
                    areaCode : 'area',
                    areaExtract : 'attrCustomTarget',
                    areaType : 'css',
                    area : 'child',
                    childArea: '.bd_38zhf',
                    attrTarget: 'alt',
                    resultKind : 'obj',
                    waitSec : 0,
                    isDel: 'N',
                }
            ],
            areaOptionItemExtractPrice : {
                areaCode : 'area',
                areaExtract : 'text',
                areaType : 'css',
                area : '._10hph879os .bd_w1biV',
                resultKind : 'obj',
                waitSec : 0,
                isDel: 'N',
            },
            areaOptionItemPriceClose : {
                areaCode : 'area',
                areaExtract : 'sendKeysEnter',
                areaType : 'css',
                area : '._10hph879os .bd_2I3cR',
                resultKind : 'obj',
                waitSec : 0.5,
                isDel: 'N',
            },
            testOptionItemPriceValidated : {
                areaCode : 'area',
                testType : 'try',
                areaExtract : 'findElement',
                areaType : 'css',
                area : '._10hph879os .bd_w1biV',
                resultKind : 'obj',
                waitSec : 0,
                isDel: 'N',
            },
            testOptionItemSoldOut : {
                testType : 'alertPr',
                waitSec : 0,
                isDel: 'N',
            },
        }
    },
    {
        areaCode : 'area',
        areaExtract : 'findElements',
        areaType : 'css',
        area : '._10hph879os .bd_zelQ-',
        resultKind : 'list',
        waitSec : 0,
        isDel: 'N',
        name : '사이즈선택',
        optionKind : 'choice',
        areaOptionExtractTitle : {
            areaCode : 'area',
            areaExtract : 'text',
            areaType : 'css',
            area : 'child',
            childArea : '.bd_c0i7t',
            resultKind : 'obj',
            waitSec : 0,
            isDel: 'N',
        },
        areaOptionOpenItems : {
            // areaExtract : 'sendKeysEnter',
            // areaType : 'css',
            // area : 'child',
            // childArea : 'button',
            // resultKind : 'obj',
            // waitSec : 0.5,
            isDel: 'Y',
        },
        areaOptionExtractItemEles : {
            areaCode : 'area',
            areaExtract : 'findElements',
            areaType : 'css',
            area : 'child',
            childArea : 'button',
            resultKind : 'list',
            waitSec : 0,
            isDel: 'N',
        },
        areaOptionItem : {
            areaOptionItemChoose : {
                areaCode : 'area',
                areaExtract : 'sendKeysEnter',
                areaType : 'css',
                area : 'itself',
                resultKind : 'obj',
                waitSec : 0.5,
                isDel: 'N',
            },
            areaOptionItemExtractName : {
                areaCode : 'area',
                areaExtract : 'text',
                areaType : 'css',
                area : 'itself',
                resultKind : 'obj',
                waitSec : 0,
                isDel: 'N',
            },
            areaOptionItemExtractPrice : {
                areaCode : 'area',
                areaExtract : 'text',
                areaType : 'css',
                area : '._10hph879os .bd_w1biV',
                resultKind : 'obj',
                waitSec : 0,
                isDel: 'N',
            },
            areaOptionItemPriceClose : {
                areaCode : 'area',
                areaExtract : 'sendKeysEnter',
                areaType : 'css',
                area : '._10hph879os .bd_2I3cR',
                resultKind : 'obj',
                waitSec : 0.5,
                isDel: 'N',
            },
            testOptionItemPriceValidated : {
                areaCode : 'area',
                testType : 'try',
                areaExtract : 'findElement',
                areaType : 'css',
                area : '._10hph879os .bd_w1biV',
                resultKind : 'obj',
                waitSec : 0,
                isDel: 'N',
            },
            testOptionItemSoldOut : {
                testType : 'compareEq',
                areaCode : 'area',
                areaExtract : 'attrCustomTarget',
                areaType : 'css',
                area : 'itself',
                attrTarget: 'disabled',
                compareTarget : 'true',
                resultKind : 'obj',
                waitSec : 0,
                isDel: 'N',
            },
        }
    },
    {
        areaCode : 'area',
        areaExtract : 'findElements',
        areaType : 'css',
        area : '._10hph879os .bd_38mf4',
        resultKind : 'list',
        waitSec : 0,
        isDel: 'N',
        name : '직접입력',
        optionKind : 'direct',
        areaOptionExtractTitle : {
            areaCode : 'area',
            areaExtract : 'text',
            areaType : 'css',
            area : 'itself',
            resultKind : 'obj',
            waitSec : 0,
            isDel: 'N',
        },
        areaOptionOpenItems : {
            areaCode : 'area',
            areaExtract : 'sendKeysEnter',
            areaType : 'css',
            area : 'child',
            childArea : 'input',
            resultKind : 'obj',
            waitSec : 0.5,
            isDel: 'N',
        },
        areaOptionExtractItemEles : {
            areaCode : 'area',
            areaExtract : 'findElements',
            areaType : 'css',
            area : 'child',
            childArea : 'input',
            resultKind : 'list',
            waitSec : 0.5,
            isDel: 'N',
        },
        areaOptionItem : {
            areaOptionItemChoose : {
                areaCode : 'area',
                areaExtract : 'sendKeysWord',
                sendKeysWord : '11',
                areaType : 'css',
                area : 'itself',
                resultKind : 'obj',
                waitSec : 0.5,
                isDel: 'N',
            },
            areaOptionItemExtractName : {
                // areaExtract : 'text',
                // areaType : 'css',
                // area : 'itself',
                // resultKind : 'obj',
                // waitSec : 0,
                isDel: 'Y',
            },
            areaOptionItemExtractPrice : {
                areaCode : 'area',
                areaExtract : 'text',
                areaType : 'css',
                area : '._10hph879os .bd_w1biV',
                resultKind : 'obj',
                waitSec : 0,
                isDel: 'N',
            },
            areaOptionItemPriceClose : {
                areaCode : 'area',
                areaExtract : 'sendKeysEnter',
                areaType : 'css',
                area : '._10hph879os .bd_2I3cR',
                resultKind : 'obj',
                waitSec : 0.5,
                isDel: 'N',
            },
            testOptionItemPriceValidated : {
                areaCode : 'area',
                testType : 'try',
                areaExtract : 'findElement',
                areaType : 'css',
                area : '._10hph879os .bd_w1biV',
                resultKind : 'obj',
                waitSec : 0,
                isDel: 'N',
            },
            testOptionItemSoldOut : {
                testType : 'alertPr',
                waitSec : 0,
                isDel: 'N',
            },
        }
    },
]

module.exports = areaOptions;