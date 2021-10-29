import fs from "fs/promises";
import { constants } from "fs";
import path from "path";
import { Buffer } from "buffer";
import sharp from "sharp";
const Handlebars = require("../handlebars/init");

// Profiles JS Files and Template Files Directory
const profilesJSDir = path.join(__dirname, "..", "profiles");
const profilesTemplatesDir = path.join(
  __dirname,
  "..",
  "..",
  "views",
  "profiles"
);

async function loadInputDataFile(inputData) {
  // Check Whether Input Data File Exists or Not
  try {
    await fs.access(inputData, constants.F_OK);
  } catch (err) {
    throw new Error("1 (Not Found): Input Data File Does Not Exist!");
  }

  return JSON.parse(await fs.readFile(inputData));
}

async function prepareProfileCTX(
  profileName,
  dataset,
  profileVariant,
  measure
) {
  const profileClass = await loadProfileJSFile(profileName);

  try {
    const profileObj = new profileClass(dataset, profileVariant);
    const ctx = {
      ...profileObj.getTemplateEngineParams(),
      variant: profileVariant,
      measure: measure,
    };

    return ctx;
  } catch (err) {
    // throw err
    throw new Error(
      "2 (Profile JS Error): Error in Instantiating the Profile Object"
    );
  }
}

async function loadProfileJSFile(profileName) {
  const jsFileDir = path.join(profilesJSDir, `${profileName}.js`);

  // Check Whether JS File Exists or Not
  try {
    await fs.access(jsFileDir, constants.F_OK);
  } catch (err) {
    throw new Error("3 (Invalid Name): Profile Name Is Not Valid");
  }

  return require(jsFileDir);
}

async function loadProfileTemplateFile(profileName) {
  const templateFileDir = path.join(profilesTemplatesDir, `${profileName}.hbs`);

  // Check Whether Template File Exists or Not
  try {
    await fs.access(templateFileDir, constants.F_OK);
  } catch (err) {
    throw new Error("4 (Not Found): Profile Template File Does Not Exist");
  }

  const data = await fs.readFile(templateFileDir);
  return data.toString();
}

async function renderTemplate(profileName, ctx) {
  const templateFile = await loadProfileTemplateFile(profileName);
  const template = Handlebars.compile(templateFile, "utf-8");
  try {
    const xml = template(ctx);

    return xml;
  } catch (err) {
    throw err;
  }
}

async function ensureDirExistence(dir) {
  try {
    await fs.access(dir, constants.F_OK);
  } catch (err) {
    try {
      await fs.mkdir(dir, { recursive: true });
    } catch (err) {
      if (err) throw err;
    }
  }
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

  try {
    await fs.writeFile(outputPath, svg);
  } catch (err) {
    if (err) throw err;
  }
}

async function createPNG(xml, outputPath) {
  xml = xml.replace(/<style.*>.*<\/style>/s, "");
  const buf = Buffer.from(xml, "utf8");
  return new Promise((resolve, reject) => {
    sharp(buf, { density: 100 }).toFile(outputPath, (err, info) => {
      if (err) return reject(err);
      resolve(info);
    });
  });
}

function createOutputName(options) {
  const fileName = path.basename(
    options.inputData,
    path.extname(options.inputData)
  );
  const outputFileName = `${options.name || fileName}${
    options.profileVariant === "with-sidebar" ? "" : ".raw"
  }${options.measure ? "-m" : ""}`;
  return outputFileName;
}

async function createProfile(options, dataset) {
  const ctx = await prepareProfileCTX(
    options.profileName,
    dataset,
    options.profileVariant,
    options.measure
  );

  const xml = await renderTemplate(options.profileName, ctx);

  const outputFileName = createOutputName(options);

  await ensureDirExistence(options.outputAddress);

  await createSVG(
    xml,
    path.join(options.outputAddress, `${outputFileName}.svg`)
  );
  await createPNG(
    xml,
    path.join(options.outputAddress, `${outputFileName}.png`)
  );
}

export default async function draw(options) {
  // Suppose that both input & output type are "local"

  const dataset = await loadInputDataFile(options.inputData);

  if (options.profileVariant === "both") {
    await createProfile({ ...options, profileVariant: "raw" }, dataset);
    await createProfile(
      { ...options, profileVariant: "with-sidebar" },
      dataset
    );
  } else {
    await createProfile(options, dataset);
  }
}
