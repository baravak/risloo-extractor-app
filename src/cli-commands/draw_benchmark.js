import fs from "fs/promises";
import { constants } from "fs";
import path from "path";
import { Buffer } from "buffer";
import sharp from 'sharp';
const Handlebars = require("../handlebars/init");
const Benchmarker = require('./Benchmarker')

// Profiles JS Files and Template Files Directory
const profilesJSDir = path.join(__dirname, "..", "profiles");
const profilesTemplatesDir = path.join(__dirname, "..", "..", "views", "profiles");

const benchmarker = new Benchmarker();

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

  benchmarker.start("Context Creation");

  const profileClass = await loadProfileJSFile(profileName);

  benchmarker.addStep("JS File Loading");

  try {
    const profileObj = new profileClass(dataset, profileVariant);

    benchmarker.addStep("Profile Object Instantiating");

    const ctx = {
      ...profileObj.getTemplateEngineParams(),
      variant: profileVariant,
      measure: measure,
    };

    benchmarker.addStep("CTX calculation");
    benchmarker.end();

    return ctx;
  } catch (err) {
    // throw err
    throw new Error("2 (Profile JS Error): Error in Instantiating the Profile Object");
  }
}

async function loadProfileJSFile(profileName) {

  benchmarker.start("JS File Loading");

  const jsFileDir = path.join(profilesJSDir, `${profileName}.js`);

  benchmarker.addStep("Path Joining");

  // Check Whether JS File Exists or Not
  try {
    await fs.access(jsFileDir, constants.F_OK);

    benchmarker.addStep("JS File Existence Checking");

  } catch (err) {
    throw new Error("3 (Invalid Name): Profile Name Is Not Valid");
  }

  const profile = require(jsFileDir);

  benchmarker.addStep("JS File Require");
  benchmarker.end();

  return profile;
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

  benchmarker.start("SVG Creation");

  const mapObj = {
    'text-anchor="start"': 'text-anchor="end"',
    'text-anchor="end"': 'text-anchor="start"',
  };

  const svg = xml.replace(
    /text-anchor="start"|text-anchor="end"/g,
    (matched) => mapObj[matched]
  );

  benchmarker.addStep("XML Replace");

  try {
    await fs.writeFile(outputPath, svg);

    benchmarker.addStep("Writing SVG File");
    benchmarker.end();

  } catch (err) {
    if (err) throw err;
  }
}

async function createPNG(xml, outputPath) {

  benchmarker.start("PNG Creation");

  xml = xml.replace(/<style.*>.*<\/style>/s, "");

  benchmarker.addStep("XML Removing Style");

  const buf = Buffer.from(xml, "utf8");

  benchmarker.addStep("Buffer From String");

  return new Promise((resolve, reject) => {
    sharp(buf, { density: 100 }).toFile(outputPath, (err, info) => {
      if (err) return reject(err);
      resolve(info);

      benchmarker.addStep("Sharp Resolving");
      benchmarker.end();

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

  benchmarker.addStep("Context Creation");

  const xml = await renderTemplate(options.profileName, ctx);

  benchmarker.addStep("Handlebars Rendering");

  const outputFileName = createOutputName(options);

  benchmarker.addStep("Output Name Creation");

  await ensureDirExistence(options.outputAddress);

  benchmarker.addStep("Ensuring Dir Existence");

  await createSVG(xml, path.join(options.outputAddress, `${outputFileName}.svg`));

  benchmarker.addStep("SVG Creation");

  await createPNG(xml, path.join(options.outputAddress, `${outputFileName}.png`));

  benchmarker.addStep("PNG Creation");

  benchmarker.end();
}

async function draw(options) {
  // Suppose that both input & output type are "local"

  benchmarker.start("Draw Command");

  const dataset = await loadInputDataFile(options.inputData);

  benchmarker.addStep('Dataset Loading');

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

module.exports = draw;
