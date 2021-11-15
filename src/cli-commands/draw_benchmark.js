const fs = require("fs/promises");
const { constants } = require("fs");
const path = require("path");
const sharp = require("sharp");
const Handlebars = require("../handlebars/init");
const Benchmarker = require("./Benchmarker");

const benchmarker = new Benchmarker();

// Profiles JS Files and Template Files Directory
const profilesJSDir = path.join(__dirname, "..", "profiles");
const profilesTemplatesDir = path.join(
  __dirname,
  "..",
  "..",
  "views",
  "profiles"
);

async function checkAndLoad(dir) {
  return fs
    .access(dir, constants.F_OK)
    .then(() => {
      return fs.readFile(dir);
    })
    .catch((err) => {
      throw new Error(`1 (Not Found): File in ${dir} Does Not Exist!`);
    });
}

async function checkAndImport(dir) {
  return fs
    .access(dir, constants.F_OK)
    .then(() => {
      return require(dir);
    })
    .catch((err) => {
      // throw err
      throw new Error(`1 (Not Found): File in ${dir} Does Not Exist!`);
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

  const svg = xml.replace(
    /text-anchor="start"|text-anchor="end"/g,
    (matched) => mapObj[matched]
  );

  return fs.writeFile(outputPath, svg);
}

async function createPNG(xml, outputPath) {
  xml = xml.replace(/<style.*?>.*?<\/style>/s, "");
  const buf = Buffer.from(xml, "utf8");
  return new Promise((resolve, reject) => {
    sharp(buf, { density: 100 }).toFile(outputPath, (err) => {
      if (err) return reject(err);
      resolve(true);
    });
  });
}

function createOutputName(options) {
  const fileName =
    options.inputData &&
    path.basename(options.inputData, path.extname(options.inputData));
  const outputFileName = `${options.name || fileName}${
    options.profileVariant === "with-sidebar" ? "" : ".raw"
  }${options.measure ? "-m" : ""}`;
  return outputFileName;
}

async function createProfile(dataset, profileClass, options, promises) {
  let ctx, xml;

  const outputFileName = createOutputName(options);

  try {
    const profileObj = new profileClass(dataset, options.profileVariant);
    ctx = {
      ...profileObj.getTemplateEngineParams(),
      variant: options.profileVariant,
      measure: options.measure,
    };
  } catch (err) {
    // throw err;
    throw new Error(
      "2 (Profile JS Error): Error in Instantiating the Profile Object"
    );
  }

  return promises[0]
    .then(async (templateBuffer) => {
      const template = (await Handlebars).compile(
        templateBuffer.toString(),
        "utf-8"
      );
      xml = template(ctx);

      return promises[1];
    })
    .then(() => {
      return Promise.all([
        createSVG(
          xml,
          path.join(options.outputAddress, `${outputFileName}.svg`)
        ),
        createPNG(
          xml,
          path.join(options.outputAddress, `${outputFileName}.png`)
        ),
      ]);
    })
    .catch((err) => {
      throw err;
    });
}

async function draw(options) {
  // Suppose that both input & output type are "local"

  benchmarker.start("Draw Command");

  // Directory of profile JS file
  const profileJSDir = path.join(profilesJSDir, `${options.profileName}.js`);

  // Directory of profile template file
  const templateFileDir = path.join(
    profilesTemplatesDir,
    `${options.profileName}.hbs`
  );

  // Creating initial promises
  let datasetPromise;
  const jsPromise = checkAndImport(profileJSDir).catch((err) => {
    // throw err;
    throw new Error("3 (Invalid Name): Profile Name Is Not Valid");
  });
  const templatePromise = checkAndLoad(templateFileDir).catch(() => {
    throw new Error("4 (Not Found): Profile Template File Does Not Exist");
  });
  const ensureDirPromise = ensureDirExistence(options.outputAddress);

  // Check for input type
  if (options.inputType === "local") {
    if (!options.inputData) throw new Error("No Input Data Provided.");
    datasetPromise = checkAndLoad(options.inputData).catch(() => {
      throw new Error("1 (Not Found): Input Data File Does Not Exist!");
    });
  } else if (options.inputType === "stdin") {
    if (!options.name) throw new Error("Output File Name Not Provided!");
    datasetPromise = loadStdin();
  }

  const promisesGroup1 = [datasetPromise, jsPromise];
  const promisesGroup2 = [templatePromise, ensureDirPromise];

  return new Promise(function (resolve, reject) {
    Promise.all(promisesGroup1)
      .then((results) => {
        const dataset = JSON.parse(results[0]);
        const profileClass = results[1];

        if (options.profileVariant === "both") {
          return Promise.all([
            createProfile(
              dataset,
              profileClass,
              { ...options, profileVariant: "with-sidebar" },
              promisesGroup2
            ),
            createProfile(
              dataset,
              profileClass,
              { ...options, profileVariant: "raw" },
              promisesGroup2
            ),
          ]);
        } else {
          return createProfile(dataset, profileClass, options, promisesGroup2);
        }
      })
      .then(() => {
        benchmarker.end();
        resolve(true);
      })
      .catch((err) => reject(err));

    Promise.all(promisesGroup2).catch((err) => {
      reject(err);
    });
  });
}

module.exports = draw;
