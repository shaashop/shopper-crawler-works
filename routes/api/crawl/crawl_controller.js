const EXPRESS = require("express");
const ROUTER = EXPRESS.Router();

const CrawlItemService = require("../../../service/crawl/crawl_item_service");


ROUTER.get("/item", async function (req, res) {
  const { shopId, userId, shopUploadId, crawlSource, crawlSourceUrl } = req.query;
  const uploadType = "crawl";
  const crawlType = "item";
  console.log(req.query);

  CrawlItemService.crawlItem(req, res, {
    url: crawlSourceUrl,
    uploadType,
    crawlType,
    crawlSource,
    shopInfo: {
      shopId,
      userId,
      shopUploadId,
    },
  });

  res.json({});
  // console.log(res);
  }
);

module.exports = ROUTER;
