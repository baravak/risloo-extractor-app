const { loadStdin, ensureDirExistence, createPNG, createOutputFiles, checkAndLoad } = require("./utilities/BaseOps");
const path = require("path");
const fs = require("fs/promises");
const Handlebars = require("../handlebars/init");
const { GIFTS_STATUS } = require("./utilities/STATUS");
const Gift = require("../Gift");
const outputJSON = require("./utilities/outputJSON");

const json = new outputJSON(2);

const giftTemplateFile = path.join(__dirname, "..", "..", "views", "gift.hbs");
const outputDir = path.join(__dirname, "..", "output", "gift");

const createOutputName = (regionId, code) => `${regionId}-${code}`;

async function createGift(dataset, options, { templatePromise, ensureDirPromise }) {
  let xml;

  const ctx = new Gift(dataset);

  const fileName = createOutputName(ctx.region.id, ctx.code);

  return (
    templatePromise
      .then(async (templateBuffer) => {
        const template = (await Handlebars).compile(templateBuffer.toString(), "utf-8");

        xml = template(ctx);

        return ensureDirPromise;
      })
      // .then(() => createOutputFiles(xml, { outputAddress: options.outputAddress, fileName }, json));
      .then(() => createPNG(xml, path.join(options.outputAddress, `${fileName}.png`), json))
  );
}

async function gift(options) {
  let benchmarker;

  if (options.benchmark) {
    const Benchmarker = require("./utilities/Benchmarker");
    benchmarker = new Benchmarker();
    benchmarker.start("Extract Command");
  }

  let datasetPromise;

  const ensureDirPromise = ensureDirExistence(outputDir);
  const templatePromise = fs.readFile(giftTemplateFile);
  const avatarPromise = loadStdin("binary");

  if (options.inputType === "local") datasetPromise = checkAndLoad(options.inputData);
  else if (options.inputType === "raw-json") datasetPromise = Promise.resolve(options.inputData);

  return new Promise(function (resolve, reject) {
    Promise.all([datasetPromise, avatarPromise])
      .then(([json, avatar]) => {
        const dataset = JSON.parse(json);
        const avatarBase64 = avatar && Buffer.from(avatar, "binary").toString("base64");

        dataset.region.detail["avatarBase64"] = avatarBase64;

        return createGift(dataset, options, { templatePromise, ensureDirPromise });
      })
      .then(() => {
        if (options.benchmark) {
          benchmarker.end();
          json.setTime(benchmarker.totalTime);
        }
        json.setStatus(GIFTS_STATUS["0"]);

        resolve();
      })
      .catch((err) => {
        reject(err);
      })
      .finally(() => json.showOutput());

    Promise.all([templatePromise, ensureDirPromise]).catch((err) => reject(err));
  });
}

module.exports = gift;
