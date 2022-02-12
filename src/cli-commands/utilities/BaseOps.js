const { FileNotFoundError } = require("./CustomErrors");
const fs = require("fs/promises");
const { writeFile, constants } = require("fs");
const sharp = require("sharp");

const checkAndLoad = async (dir) =>
  fs
    .access(dir, constants.F_OK)
    .catch(() => {
      throw new FileNotFoundError(dir);
    })
    .then(() => fs.readFile(dir));

function requireUncached(dir) {
  delete require.cache[require.resolve(dir)];
  return require(dir);
}

const checkAndImport = async (dir) =>
  fs
    .access(dir, constants.F_OK)
    .catch(() => {
      throw new FileNotFoundError(dir);
    })
    .then(() => requireUncached(dir));

const loadStdin = async (encoding) => {
  process.stdin.setEncoding(encoding);

  let data = "";

  if (!process.stdin.isTTY) process.stdin.on("data", (chunk) => (data += chunk));

  return new Promise(function (resolve, reject) {
    if (!process.stdin.readableFlowing) resolve(data);
    process.stdin.on("end", () => resolve(data));
    process.stdin.on("error", (err) => reject(err));
  });
};

const ensureDirExistence = async (dir) =>
  fs.access(dir, constants.F_OK).catch(() => fs.mkdir(dir, { recursive: true }));

async function createSVG(xml, dir) {
  return new Promise((resolve, reject) => {
    writeFile(dir, xml, (err) => {
      if (err) reject(err);
      resolve(dir);
    });
  });
}

async function createPNG(xml, dir) {
  xml = xml.replace(/<style.*?>.*?<\/style>/s, "");
  const buf = Buffer.from(xml, "utf8");
  return new Promise((resolve, reject) => {
    sharp(buf, { density: 100 }).toFile(dir, (err) => {
      if (err) return reject(err);
      resolve(dir);
    });
  });
}

module.exports = {
  checkAndLoad,
  checkAndImport,
  loadStdin,
  ensureDirExistence,
  createSVG,
  createPNG,
};
