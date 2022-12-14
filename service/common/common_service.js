const moment = require("moment");

// load Service
const RouterService = require("./router_service");

// MarketingService
const CommonService = {
  getPagingData: function (page, tot_cnt, BOARD_LINE_LIMIT) {
    //def pagenum
    if (page == null) {
      page = 1;
    }
    const curpage = parseInt(page); //현재페이지
    const page_size = BOARD_LINE_LIMIT; //한 페이지당 게시물 수
    const page_list_size = 10; //전체 페이지 단위
    const page_limit = Math.ceil(page_list_size / 2); //전체 페이지 수
    let no = ""; //limit 변수
    const total_page = Math.ceil(tot_cnt / page_size); //전체 페이지 수
    const start_page = curpage - page_limit < 0 ? 1 : curpage - page_limit;
    const end_page =
      curpage + page_limit > total_page ? total_page : curpage + page_limit;

    //현재 페이지가 0보다 작으면
    if (curpage < 0) {
      no = 0;
    } else {
      //0보다 크면 limit 함수에 들어갈 첫번째 인자 값 구하기
      no = curpage - 1; // * 10
    }

    const result = {
      curPage: curpage,
      page_list_size: page_list_size,
      page_size: page_size,
      totalPage: total_page,
      offset: no,
      startPage: start_page,
      endPage: end_page,
      tot_cnt: tot_cnt,
    };
    return result;
  },
  getBulkJson: async function (type, data) {
    let arr = [];
    if (type === "group") {
      if (typeof data.GROUP_NAMES == "string") {
        arr.push({
          MEMBER_SRL: data.MEMBER_SRL,
          GROUP_NAME: data.GROUP_NAMES,
        });
      } else {
        let MEMBER_SRL = data.MEMBER_SRL;
        let GROUP_NAMES = data.GROUP_NAMES;
        let arrLength = GROUP_NAMES.length;
        for (let i = 0; i < arrLength; i++) {
          arr.push({
            MEMBER_SRL: MEMBER_SRL,
            GROUP_NAME: GROUP_NAMES[i],
          });
        }
      }
    }
    return arr;
  },
  commitTransaction: async function (req) {
    await req.transaction[req.transaction.length - 1].commit();
    req.transaction.pop();
  },
  rollbackTransaction: async function (req) {
    const transaction = req.transaction.pop();
    await transaction.rollback();
  },
  handleError: function (err, req, res, transaction, param) {
    param = param ? param : {};
    const { httpCode } = param;
    if (!httpCode) RouterService.json(err, res);
    else RouterService.jsonErr(err, res, httpCode);
    console.error(err);
    if (this.isEmpty(req.transaction) == false) {
      this.rollbackTransaction(req);
    }
  },
  getTransaction: async function (req) {
    return req.transaction[req.transaction.length - 1];
  },
  execError: function (req, res, httpCode, msg) {
    try {
      throw new Error(msg);
    } catch (err) {
      this.handleError(err, req, res, req.transaction, { httpCode });
    }
  },
  isEmpty: function (value) {
    // js 빈값체크 0, "", undefined, [], {}
    if (
      (typeof value == "number" && isNaN(value)) ||
      value == "" ||
      value == null ||
      value == undefined ||
      (value != null && typeof value == "object" && !Object.keys(value).length)
    ) {
      return true;
    } else {
      return false;
    }
  },
  convertStrToNum: async function (json, name_arr) {
    // json 정보중에서 name_arr에 해당하는 값의 타입을 numeric으로 변경
    for (let i = 0; i < name_arr.length; i++) {
      const orgin_val = json[name_arr[i]];
      if (typeof orgin_val == "string")
        json[name_arr[i]] = parseFloat(orgin_val);
    }
    return json;
  },
  getCurrentTimeAsString: function () {
    const now = moment().format("YYYYMMDDHHmmss");
    return now + "";
  },
  convertDateTimeAsString: function (dateTime) {
    const result = moment(dateTime).format("YYYYMMDDHHmmss");
    return result + "";
  },
  convertStringToDateTime: function (string) {
    const pattern = /(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})/;

    const formatDateStr = string.replace(pattern, "$1-$2-$3 $4:$5:$6");
    const formatDate = new Date(formatDateStr).getTime() / 1000;

    return formatDate;
  },
  getIpaddress: function (req) {
    const ip =
      req.headers["x-forwarded-for"] ||
      req.connection.remoteAddress ||
      req.socket.remoteAddress ||
      req.connection.socket.remoteAddress;
    return ip;
  },
  parsingEscape: function (str) {
    const parsedStr1 = str.replace(/\r\n/g, "<br>");
    const parsedStr2 = parsedStr1.replace(/\n/g, "<br>");

    return parsedStr2;
  },
  getSummarizedText: async function (summarize_length, target_title) {
    let result = target_title;
    if (target_title.length > summarize_length) {
      result = target_title.slice(0, summarize_length) + "…";
    }
    return result;
  },
  getRandomKey: function () {
    let key = "";
    for (let i = 0; i < 3; i++) {
      let random = "" + Math.random();
      const keyNum = random.substr(random.indexOf(".") + 1, random.length);
      key += keyNum;
    }
    return key;
  },
  getHourDiff: function (momentRule, time1, time2) {
    const t1 = moment(time1, momentRule);
    const t2 = time2 == null ? moment() : moment(time2, momentRule);
    const timeDiff = moment.duration(t2.diff(t1)).asHours();

    return timeDiff;
  },
  // 'YYYYMMDDHHmm'
  getDaysDiff: function (momentRule, time1, time2) {
    const t1 = moment(time1, momentRule);
    const t2 = time2 == null ? moment() : moment(time2, momentRule);
    const timeDiff = moment.duration(t2.diff(t1)).asDays();

    return timeDiff;
  },
  getDueDate: function (momentRule, targetDay, fromDay) {
    let daysDiff = this.getDaysDiff(momentRule, targetDay, fromDay);
    let dayDiffNum = Math.floor(daysDiff);
    if (dayDiffNum == 0) dayDiffNum = `-${dayDiffNum}`;
    if (dayDiffNum > 0) dayDiffNum = `+${dayDiffNum}`;
    return dayDiffNum;
  },
  exportPureText: async function (text) {
    text = text.replace(/<a[^>]+\><img[^>]+\><\/a>\n/i, "");
    text = text.replace(/<img[^>]+\>/i, ""); // img
    text = text.replace(/<(?:.|\n)*?>/gm, ""); // tag
    text = text.replace(/(?:\r\n|\r|\n)/g, ""); // line
    return text;
  },
  sleep: function (t) {
    return new Promise((resolve) => setTimeout(resolve, t));
  },
  fomatDate: function (date) {
    const year = date.getFullYear();
    const month = date.getMonth() + 1; // 0 ~ 11
    const day = date.getDate();
    const y = `${year}`;
    const m = CommonService.leadingZeros(`${month}`, 2);
    const d = CommonService.leadingZeros(`${day}`, 2);
    return `${y}-${m}-${d}`;
  },
  getFormatDate: function (date, type, isDelimiter) {
    var s = "";
    const dateDelimiter = isDelimiter ? "-" : "";
    const typeDelimiter = isDelimiter ? " " : "";
    const timeDelimiter = isDelimiter ? ":" : "";

    if (type == "YMD") {
      s =
        CommonService.leadingZeros(date.getFullYear(), 4) +
        dateDelimiter +
        CommonService.leadingZeros(date.getMonth() + 1, 2) +
        dateDelimiter +
        CommonService.leadingZeros(date.getDate(), 2);
    }
    if (type == "YMDhm") {
      s =
        CommonService.leadingZeros(date.getFullYear(), 4) +
        dateDelimiter +
        CommonService.leadingZeros(date.getMonth() + 1, 2) +
        dateDelimiter +
        CommonService.leadingZeros(date.getDate(), 2) +
        typeDelimiter +
        CommonService.leadingZeros(date.getHours(), 2) +
        timeDelimiter +
        CommonService.leadingZeros(date.getMinutes(), 2);
    }
    if (type == "YMDhms") {
      s =
        CommonService.leadingZeros(date.getFullYear(), 4) +
        dateDelimiter +
        CommonService.leadingZeros(date.getMonth() + 1, 2) +
        dateDelimiter +
        CommonService.leadingZeros(date.getDate(), 2) +
        typeDelimiter +
        CommonService.leadingZeros(date.getHours(), 2) +
        timeDelimiter +
        CommonService.leadingZeros(date.getMinutes(), 2) +
        timeDelimiter +
        CommonService.leadingZeros(date.getSeconds(), 2);
    }
    return s;
  },

  leadingZeros: function (n, digits) {
    let zero = "";
    n = n.toString();

    if (n.length < digits) {
      for (let i = 0; i < digits - n.length; i++) zero += "0";
    }
    return zero + n;
  },
  replaceAll: function (str, searchStr, replaceStr) {
    return str.split(searchStr).join(replaceStr);
  },
  asyncForEach: async function (array, callback) {
    for (let index = 0; index < array.length; index++) {
      await callback(array[index], index, array);
    }
  },
  validateParams: async function (req, res, paramJson, requiredArr) {
    const keys = Object.keys(paramJson);
    for (let j = 0; j < keys.length; j++) {
      const key = keys[j];
      for (let i = 0; i < requiredArr.length; i++) {
        let required = requiredArr[i];
        if (required == key && CommonService.isEmpty(paramJson[key])) {
          CommonService.execError(req, res, 400, "undefined-" + key);
          return false;
        }
      }
    }
    return true;
  },
  ellipsisSentence: function (sentence, count) {
    let result = "";
    if (sentence.length > count) {
      result = sentence.substring(0, count) + "…";
    } else {
      result = sentence;
    }
    return result;
  },
  trimPriceByCcy: function (price, ccy) {
    if (ccy === "KRW" || ccy === "JPY" || ccy === "TWD" || ccy === "CNY")
      return Math.ceil(price);
    else {
      return price.toFixed(2);
    }
  },
  getTimestamp: function () {
    return (Math.floor(new Date().getTime() / 1000) - 10).toString(); // Current Unix time.
  },
  convertDateFormat: function (date) {
    const strDate = date.toString();
    return strDate.slice(0, 10);
  },
  parseStrToJson: function (str) {
    let resultJson = {};
    if (CommonService.isEmpty(str)) {
      return resultJson;
    }
    try {
      resultJson = JSON.parse(str);
    } catch (error) {
      console.log(error);
    }
    return resultJson;
  },
  setUserToReq: async function (req, user) {
    if (user) req.user = user;
  },
  setNationToReq: async function (req, nation) {
    if (nation) req.nation = nation;
    else req.nation = "US";
  },
  trimPriceByCcy: function (price, ccy) {
    if (ccy === "KRW" || ccy === "JPY" || ccy === "TWD")
      return Math.ceil(price);
    else {
      return price.toFixed(2);
    }
  },
  numberPriceByCcy: function (price, ccy) {
    if (this.isEmpty(price)) price = 0;
    let priceByCcy = CommonService.trimPriceByCcy(parseFloat(price), ccy);
    return parseFloat(priceByCcy);
  },
  userIdExtractorAtEmail: function (email) {
    const atIndex = email.indexOf("@");
    const result = email.slice(0, atIndex);
    return result;
  },
  siteItemUrlEncoder: function (productList) {
    for (const product of productList) {
      product.siteItemUrl = encodeURI(product.siteItemUrl);
    }
  },
  domainExtractor: function (email) {
    const atIndex = email.indexOf("@");
    const result = email.slice(0, atIndex);
    return result;
  },
  getArrStrFromList(list, prop, delimiter) {
    let str = "";
    for (let i = 0; i < list.length; i++) {
      const item = list[i];
      str += item[prop];
      if (i < list.length - 1) {
        str += delimiter;
      }
    }
    return str;
  },
  getDistinctPropArr(list, prop) {
    const distinctPropArr = [];
    for (const item of list) {
      if (!distinctPropArr.includes(item[prop]))
        distinctPropArr.push(item[prop]);
    }
    return distinctPropArr;
  },
  num2str(num) {
    if (typeof num === "number") return `${num}`;
    else return num;
  },
  makeJsonByMergeArr: function (keyArr, valArrJson) {
    const resultJson = {};
    for (let i = 0; i < keyArr.length; i++) {
      const key = keyArr[i];

      let valJson = {};
      let valArrKeys = Object.keys(valArrJson);
      for (const valArrKey of valArrKeys) {
        let valArr = valArrJson[valArrKey];
        const val = valArr[i];
        valJson[valArrKey] = val;
      }
      resultJson[key] = valJson;
    }
    return resultJson;
  },
};

module.exports = CommonService;
