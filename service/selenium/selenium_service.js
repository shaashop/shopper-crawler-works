const path = require("path");
const { Worker } = require("worker_threads");
const CrawlUtilService = require("../crawl/crawl_util_service");

const SeleniumService = {
  sleep: async function (ms) {
    return new Promise((r) => setTimeout(r, ms));
  },
  startCrawlWorker: async function (req, res, paramJson) {
    const { osType, url, shopInfo, shopAnalysis, crawlType } = paramJson;
    const { analysis } = shopAnalysis;

    const workerFilePath = path.resolve(
      __dirname,
      `./crawl_${crawlType}_worker.js`
    );
    console.log(workerFilePath);
    const worker = new Worker(workerFilePath, {
      workerData: { osType, analysis, shopInfo, url },
    });

    let isWorkerFinished = false;

    worker.on("error", async (error) => {
      console.log(error);
      isWorkerFinished = true;
    });

    worker.on("exit", async (code) => {
      console.log(code);
      isWorkerFinished = true;
    });

    worker.postMessage("START");

    while (true) {
      if (isWorkerFinished === true) {
        return;
      }
      await this.sleep(2000);
    }
  },
  crawlItem: async function (req, res, paramJson) {
    const { osType, url, shopInfo, shopAnalysis } = paramJson;
    const { analysis } = shopAnalysis;

    // selenium 자체적으로 thread-safe 하지 않은 코드
    // 하나의 thread는 한 개의 selenium instance를 가질 수 밖에 없기에
    // 메인 스레드에서 처리하지 않고 워커 스레드 이용

    const workerFilePath = path.resolve(__dirname, "./crawlItem_worker.js");
    const worker = new Worker(workerFilePath, {
      workerData: { osType, analysis, shopInfo, url },
    });

    let isWorkerFinished = false;

    worker.on("error", async (error) => {
      isWorkerFinished = true;
    });

    worker.on("exit", async (code) => {
      isWorkerFinished = true;
    });

    worker.postMessage("START");

    //node js의 multi-thread -> cpu-intensive job
    //blocking을 의도하는 것 자체가 아님
    //그런 이유로 아마 child thread를 기다리는 걸 deprecated 하지 않았을까 싶음
    //즉 어쩔 수 없는 이슈 때문에 worker thread를 사용중이므로, 추후 다른 대책을 강구해야함
    //node js는 모든 프로세스가 non-blocking

    //use Wrapper, Getter Setter, when set, return immediately
    //parent thread wait until the child thread ends
    //prevent ending api before the child ends
    while (true) {
      if (isWorkerFinished === true) {
        return;
      }
      await this.sleep(2000);
    }
  },
};

module.exports = SeleniumService;
