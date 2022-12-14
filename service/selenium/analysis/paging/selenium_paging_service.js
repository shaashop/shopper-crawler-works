const SeleniumPagingNumberSectionService = require("./selenium_paging_number_section_service");

const SeleniumPagingService = {
  crawlPaging: async function (params) {
    const { driver, areaPaging, reqParams } = params;
    const { kind } = areaPaging;

    //number-section(섹션별 숫자), number-current(현재페이지 중심 숫자), scroll-down(스크롤 다운), click-load(클릭으로 불러오기)
    if (kind === "number-section") {
      await SeleniumPagingNumberSectionService.crawlNumberSection({
        driver,
        areaPaging,
        reqParams,
      });
    }
    // if(kind === 'number-current') { // NOTE 미구현
    //     await this.crawlPagingNumberCurrent(req, res, {
    //         driver,
    //         areaPaging,
    //         reqParams
    //     })
    // }
    // if(kind === 'scroll-down') { // NOTE 미구현
    //     await this.crawlPagingScrollDown(req, res, {
    //         driver,
    //         areaPaging,
    //         reqParams
    //     })
    // }
    // if(kind === 'click-load') { // NOTE 미구현
    //     await this.crawlPagingClickLoad(req, res, {
    //         driver,
    //         areaPaging,
    //         reqParams
    //     })
    // }
    return ""; // TODO 리턴값 미확정
  },
  crawlPagingNumberCurrent: async function (req, res, params) {
    console.log("crawlPagingNumberCurrent"); // NOTE 미구현
    return ""; // TODO 리턴값 미결정
  },
  crawlPagingScrollDown: async function (req, res, params) {
    console.log("crawlPagingScrollDown"); // NOTE 미구현
    return ""; // TODO 리턴값 미결정
  },
  crawlPagingClickLoad: async function (req, res, params) {
    console.log("crawlPagingClickLoad"); // NOTE 미구현
    return ""; // TODO 리턴값 미결정
  },
};
module.exports = SeleniumPagingService;
