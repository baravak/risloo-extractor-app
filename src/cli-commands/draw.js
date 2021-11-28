const fs = require("fs/promises");
const { constants, writeFile } = require("fs");
const path = require("path");
const sharp = require("sharp");
const Handlebars = require("../handlebars/init");
const outputJSON = require("./outputJSON");

const outputJSON1 = new outputJSON(0);

// Profiles JS Files and Template Files Directory
const profilesJSDir = path.join(process.cwd(), "src", "samples");
const profilesTemplatesDir = path.join(process.cwd(), "views", "profiles", "samples");

async function checkAndLoad(dir) {
  return fs
    .access(dir, constants.F_OK)
    .then(() => {
      return fs.readFile(dir);
    })
    .catch((err) => {
      // outputJSON1.setMessage(`1 (Not Found): File in ${dir} Does Not Exist!`);
      throw err;
      // throw new Error(`1 (Not Found): File in ${dir} Does Not Exist!`);
    });
}

async function loadStdin() {
  process.stdin.resume();
  process.stdin.setEncoding("utf8");

  let json = "";

  process.stdin.on("data", function (chunk) {
    json += chunk;
  });

  return new Promise(function (resolve, reject) {
    process.stdin.on("end", function () {
      resolve(json);
    });
    process.stdin.on("error", function () {
      reject(error);
    });
  });
}

async function checkAndImport(dir) {
  return fs
    .access(dir, constants.F_OK)
    .then(() => {
      return require(dir);
    })
    .catch((err) => {
      // throw err;
      // outputJSON1.setMessage(`1 (Not Found): File in ${dir} Does Not Exist!`);
      throw err;
    });
}

async function ensureDirExistence(dir) {
  return fs.access(dir, constants.F_OK).catch(() => {
    return fs.mkdir(dir, { recursive: true });
  });
}

async function createSVG(xml, outputPath) {
  const mapObj = {
    'text-anchor="start"': 'text-anchor="end"',
    'text-anchor="end"': 'text-anchor="start"',
  };

  const svg = xml.replace(/text-anchor="start"|text-anchor="end"/g, (matched) => mapObj[matched]);

  return new Promise((resolve, reject) => {
    writeFile(outputPath, svg, (err) => {
      if (err) reject(err);
      outputJSON1.addOutput(outputPath);
      resolve();
    });
  });
}

async function createPNG(xml, outputPath) {
  xml = xml.replace(/<style.*?>.*?<\/style>/s, "");
  const buf = Buffer.from(xml, "utf8");
  return new Promise((resolve, reject) => {
    sharp(buf, { density: 100 }).toFile(outputPath, (err) => {
      if (err) return reject(err);
      outputJSON1.addOutput(outputPath);
      resolve();
    });
  });
}

// This function creates both SVG & PNG of the profile and returns an array of two promises
async function createOutputFiles(xml, pathObj) {
  const { outputAddress, fileName } = pathObj;
  return Promise.all([
    createSVG(xml, path.join(outputAddress, `${fileName}.svg`)),
    createPNG(xml, path.join(outputAddress, `${fileName}.png`)),
  ]);
}

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
    outputJSON1.setMessage(2, "(Profile JS Error): Error in Instantiating the Profile Object");
    throw err;
  }

  return Promise.all(
    ctxArr.map((ctx, index) => {
      let fileName = `${outputFileName}${index !== 0 ? ".page" + (index + 1) : ""}`;
      let templateFileDir = path.join(
        profilesTemplatesDir,
        `${options.profileName}${ctxArr.length !== 1 ? "_" + (index + 1) : ""}.hbs`
      );
      return checkAndLoad(templateFileDir)
        .then(async (templateBuffer) => {
          const template = (await Handlebars).compile(templateBuffer.toString(), "utf-8");
          xml = template(ctx);

          return ensureDirPromise;
        })
        .then(() => {
          return createOutputFiles(xml, {
            outputAddress: options.outputAddress,
            fileName,
          });
        })
        .catch((err) => {
          outputJSON1.setMessage(4, "(Not Found): Profile Template File Does Not Exist");
          throw err;
        });
    })
  );
}

async function draw(options) {
  // Suppose that both input & output type are "local"

  let benchmarker;

  if (options.benchmark) {
    const Benchmarker = require("./Benchmarker");
    benchmarker = new Benchmarker();
    benchmarker.start("Draw Command");
  }

  // Directory of profile JS file
  const profileJSDir = path.join(profilesJSDir, `${options.profileName}.js`);

  // Creating initial promises
  let datasetPromise;
  const jsPromise = checkAndImport(profileJSDir).catch((err) => {
    outputJSON1.setMessage(3, "(Invalid Name): Profile Name Is Not Valid");
    throw err;
  });
  const ensureDirPromise = ensureDirExistence(options.outputAddress);

  // Check for input type
  if (options.inputType === "local") {
    if (!options.inputData) throw new Error("No Input Data Provided.");
    datasetPromise = checkAndLoad(options.inputData).catch((err) => {
      outputJSON1.setMessage(1, "(Not Found): Input Data File Does Not Exist!");
      throw err;
    });
  } else if (options.inputType === "stdin") {
    if (!options.name) throw new Error("Output File Name Not Provided!");
    datasetPromise = loadStdin();
  }

  return new Promise(function (resolve, reject) {
    Promise.all([datasetPromise, jsPromise])
      .then((results) => {
        const dataset = JSON.parse(results[0]);
        const profileClass = results[1];

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
          outputJSON1.setTime(benchmarker.totalTime);
        }
        outputJSON1.setMessage(0, "(Success): Profiles Successfully Created!");
        resolve(outputJSON1.showOutput());
      })
      .catch((err) => {
        // console.error(err);
        reject(outputJSON1.showOutput());
      });

    ensureDirPromise.catch(() => {
      reject(outputJSON1.showOutput());
    });
  });
}

module.exports = draw;
