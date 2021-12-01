const { loadStdin, ensureDirExistence, createPNG } = require("./BaseOps");
const path = require("path");
const fs = require("fs/promises");
const Handlebars = require("../handlebars/init");
const { GIFTS_STATUS } = require("./STATUS");
const Gift = require("../Gift");
const outputJSON = require("./outputJSON");

const json = new outputJSON(2);

const giftTemplateFile = path.join(process.cwd(), "views", "gift.hbs");
const outputDir = path.join(process.cwd(), "src", "output", "gift");

const createOutputName = (regionId, code, status) => `${regionId}-${code}.${status}`;

async function createGift(dataset, options, { templatePromise, ensureDirPromise }) {
  let xml;

  const ctx = new Gift(dataset, options.giftStatus);

  const fileName = createOutputName(ctx.region.id, ctx.code, ctx.status);

  return templatePromise
    .then(async (templateBuffer) => {
      const template = (await Handlebars).compile(templateBuffer.toString(), "utf-8");

      xml = template(ctx);

      return ensureDirPromise;
    })
    .then(() => createPNG(xml, path.join(options.outputAddress, `${fileName}.png`), json));
}

async function gift(options) {
  let benchmarker;

  if (options.benchmark) {
    const Benchmarker = require("./Benchmarker");
    benchmarker = new Benchmarker();
    benchmarker.start("Extract Command");
  }

  let datasetPromise;

  const ensureDirPromise = ensureDirExistence(outputDir);
  const templatePromise = fs.readFile(giftTemplateFile);

  if (options.inputType === "stdin") datasetPromise = loadStdin();
  else if (options.inputType === "raw-json") datasetPromise = Promise.resolve(options.inputData);

  return datasetPromise
    .then((json) => {
      const dataset = JSON.parse(json);

      let giftStatuses = {
        both: ["open", "expired"],
        open: ["open"],
        expired: ["expired"],
      }[options.giftStatus];

      return Promise.all(
        giftStatuses.map((giftStatus) =>
          createGift(dataset, { ...options, giftStatus }, { templatePromise, ensureDirPromise })
        )
      );
    })
    .then(() => {
      if (options.benchmark) {
        benchmarker.end();
        json.setTime(benchmarker.totalTime);
      }
      json.setStatus(GIFTS_STATUS["0"]);
    })
    .catch((err) => {
      throw err;
    })
    .finally(() => json.showOutput());
}

module.exports = gift;
