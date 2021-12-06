const path = require("path");
const Handlebars = require("../handlebars/init");
const { FileNotFoundError } = require("./utilities/CustomErrors");
const { PROFILES_STATUS } = require("./utilities/STATUS");
const {
  checkAndLoad,
  checkAndImport,
  loadStdin,
  ensureDirExistence,
  createOutputFiles,
} = require("./utilities/BaseOps");
const outputJSON = require("./utilities/outputJSON");

const json = new outputJSON(0);

// Profiles JS Files and Template Files Directory
const profilesJSDir = path.join(__dirname, "..", "samples");
const profilesTemplatesDir = path.join(__dirname, "..", "..", "views", "profiles", "samples");

function createOutputName(options) {
  let profileVariantSuffix = {
    raw: ".raw",
    "with-sidebar": "",
  }[options.profileVariant];
  let measureSuffix = options.measure ? "-m" : "";

  const fileName = options.inputData && path.basename(options.inputData, path.extname(options.inputData));

  return `${options.name || fileName}${profileVariantSuffix}${measureSuffix}`;
}

async function createProfile(dataset, profileClass, options, ensureDirPromise) {
  let ctxArr, xml;

  const outputFileName = createOutputName(options);

  try {
    ctxArr = new profileClass(dataset, options).getTemplateEngineParams();
  } catch (err) {
    json.setStatus(PROFILES_STATUS["2"]);
    throw err;
  }

  return Promise.all(
    ctxArr.map((ctx, index) => {
      let fileName = `${outputFileName}${index !== 0 ? ".page" + (index + 1) : ""}`;
      let templateFileDir = path.join(
        profilesTemplatesDir,
        `${options.sampleName}${ctxArr.length !== 1 ? "_" + (index + 1) : ""}.hbs`
      );
      return checkAndLoad(templateFileDir)
        .then(async (templateBuffer) => {
          const template = (await Handlebars).compile(templateBuffer.toString(), "utf-8");
          xml = template(ctx);

          return ensureDirPromise;
        })
        .then(() => {
          return createOutputFiles(
            xml,
            {
              outputAddress: options.outputAddress,
              fileName,
            },
            json
          );
        })
        .catch((err) => {
          json.setStatus(PROFILES_STATUS["4"]);
          throw err;
        });
    })
  );
}

async function extract(options) {
  // Suppose that both input & output type are "local"

  let benchmarker;

  if (options.benchmark) {
    const Benchmarker = require("./utilities/Benchmarker");
    benchmarker = new Benchmarker();
    benchmarker.start("Extract Command");
  }

  // Directory of profile JS file
  const profileJSDir = path.join(profilesJSDir, `${options.sampleName}.js`);

  // Creating initial promises
  let datasetPromise;
  const jsPromise = checkAndImport(profileJSDir).catch((err) => {
    if (err instanceof FileNotFoundError) json.setStatus(PROFILES_STATUS["3"]);
    else json.setStatus(PROFILES_STATUS["6"]);
    throw err;
  });
  const ensureDirPromise = ensureDirExistence(options.outputAddress);

  // Check for input type
  if (options.inputType === "local") {
    if (!options.inputData) throw new Error("No Input Data Provided.");
    datasetPromise = checkAndLoad(options.inputData).catch((err) => {
      if (err instanceof FileNotFoundError) json.setStatus(PROFILES_STATUS["1"]);
      else json.setStatus(PROFILES_STATUS["5"]);
      throw err;
    });
  } else if (options.inputType === "stdin") {
    if (!options.name) throw new Error("Output File Name Not Provided!");
    datasetPromise = loadStdin('utf-8');
  }

  return new Promise(function (resolve, reject) {
    Promise.all([datasetPromise, jsPromise])
      .then(([json, profileClass]) => {
        const dataset = JSON.parse(json);

        let profileVariants = {
          both: ["raw", "with-sidebar"],
          raw: ["raw"],
          "with-sidebar": ["with-sidebar"],
        }[options.profileVariant];

        return Promise.all(
          profileVariants.map((profileVariant) =>
            createProfile(dataset, profileClass, { ...options, profileVariant }, ensureDirPromise)
          )
        );
      })
      .then(() => {
        if (options.benchmark) {
          benchmarker.end();
          json.setTime(benchmarker.totalTime);
        }
        json.setStatus(PROFILES_STATUS["0"]);
        resolve();
      })
      .catch((err) => {
        reject(err);
      })
      .finally(() => json.showOutput());

    ensureDirPromise.catch(() => {
      reject(json.showOutput());
    });
  });
}

module.exports = extract;
