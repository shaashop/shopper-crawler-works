class RoutesSetterClass {
  setRoutes(app) {
    // interceptor
    app.use(async function (req, res, next) {
      console.log("############# INTERCEPTOR #############");
      const CommonService = require("../service/common/common_service");
      CommonService.setNationToReq(req, req.query.nation);
      next();
    });

    RoutesSetter.setApiRoutes(app);

    // catch 404 and forward to error handler
    app.use(function (req, res) {
      const CommonService = require("../service/common/common_service");
      CommonService.execError(req, res, 404, "Not-Found");
      return false;
    });
  }

  setApiRoutes(app) {
    const IndexRouter = require("./index");
    const CrawlShopController = require("./api/crawl/crawl_controller");

    app.use("/", IndexRouter);
    app.use("/api", IndexRouter);
    app.use("/api/crawl", CrawlShopController);
  }
}

const RoutesSetter = new RoutesSetterClass();
module.exports = RoutesSetter;
