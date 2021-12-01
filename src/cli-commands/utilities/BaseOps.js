const { FileNotFoundError } = require("./CustomErrors");
const fs = require("fs/promises");
const path = require("path");
const { writeFile, constants } = require("fs");
const sharp = require("sharp");

const checkAndLoad = async (dir) =>
  fs
    .access(dir, constants.F_OK)
    .catch(() => {
      throw new FileNotFoundError(dir);
    })
    .then(() => fs.readFile(dir));

const checkAndImport = async (dir) =>
  fs
    .access(dir, constants.F_OK)
    .catch(() => {
      throw new FileNotFoundError(dir);
    })
    .then(() => require(dir));

const loadStdin = async () => {
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
};

const ensureDirExistence = async (dir) =>
  fs.access(dir, constants.F_OK).catch(() => fs.mkdir(dir, { recursive: true }));

async function createSVG(xml, outputPath, json = null) {
  const mapObj = {
    'text-anchor="start"': 'text-anchor="end"',
    'text-anchor="end"': 'text-anchor="start"',
  };

  const svg = xml.replace(/text-anchor="start"|text-anchor="end"/g, (matched) => mapObj[matched]);

  return new Promise((resolve, reject) => {
    writeFile(outputPath, svg, (err) => {
      if (err) reject(err);
      json?.addOutput(outputPath);
      resolve();
    });
  });
}

async function createPNG(xml, outputPath, json = null) {
  xml = xml.replace(/<style.*?>.*?<\/style>/s, "");
  const buf = Buffer.from(xml, "utf8");
  return new Promise((resolve, reject) => {
    sharp(buf, { density: 100 }).toFile(outputPath, (err) => {
      if (err) return reject(err);
      json?.addOutput(outputPath);
      resolve();
    });
  });
}

// This function creates both SVG & PNG of the input xml and returns an array of two promises
async function createOutputFiles(xml, pathObj, json) {
  const { outputAddress, fileName } = pathObj;
  return Promise.all([
    createSVG(xml, path.join(outputAddress, `${fileName}.svg`), json),
    createPNG(xml, path.join(outputAddress, `${fileName}.png`), json),
  ]);
}

module.exports = {
  checkAndLoad,
  checkAndImport,
  loadStdin,
  ensureDirExistence,
  createSVG,
  createPNG,
  createOutputFiles,
};
