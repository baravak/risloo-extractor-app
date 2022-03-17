const chalk = require("chalk");
const { readdir, rm } = require("fs/promises");
const path = require("path");
const ExtractExecutor = require("../cli-commands/ExtractExecutor");
const GiftExecutor = require("../cli-commands/GiftExecutor");

const jsonDir = path.join(__dirname, "json");
const samplesJSDir = path.join(__dirname, "..", "samples");
const outputDir = path.join(__dirname, "output");

let errors = 0;

async function loadSampleNames() {
  return readdir(samplesJSDir).then((sampleNames) =>
    sampleNames.map((name) => name.split(".")[0]).filter((name) => name !== "empty")
  );
}

async function testExtract() {
  // Number of samples resulted in error
  let erroneousSamples = 0;

  // Profile variants different choices
  const profileVariants = ["raw", "with-sidebar"];

  // Input data
  let inputData = "";

  // Initial Extract Command Options
  let extractOptions = {
    sampleName: "",
    sampleOutputs: ["profile"],
    profileVariant: "",
    inputType: "local",
    outputType: "local",
    inputData: "",
    measure: false,
    benchmark: true,
    watch: false,
    outputAddress: outputDir,
  };

  return loadSampleNames().then(async (sampleNames) => {
    const numProfiles = sampleNames.length * profileVariants.length;
    for (let sampleName of sampleNames) {
      for (let profileVariant of profileVariants) {
        inputData = path.join(jsonDir, "profiles", `${sampleName}.json`);
        extractOptions = {
          ...extractOptions,
          sampleName,
          profileVariant,
          inputData,
        };

        await new ExtractExecutor(extractOptions)
          .getFinalPromise()
          .then(() =>
            console.log(
              chalk`{green.bold ${sampleName}} Profile of {italic ${profileVariant}} Variant Created With {green.bold Success}!`
            )
          )
          .catch(() => {
            erroneousSamples++;
            errors++;
            console.log(
              chalk`{red.bold ${sampleName}} Profile of {italic ${profileVariant}} Variant Created With {red.bold Error}!`
            );
          });
      }
    }
    console.log(
      chalk`*** {green.bgGrey.bold  ${
        numProfiles - erroneousSamples
      } } Profiles Created With {green.bold Success} Out of {blue.bgGrey.bold  ${numProfiles} } Profiles! ***`
    );
  });
}

async function testGift() {
  // Initial Gift Command Options
  let giftOptions = {
    inputType: "local",
    outputType: "local",
    inputData: path.join(jsonDir, "gift", "gift.json"),
    benchmark: true,
    outputAddress: outputDir,
  };

  await new GiftExecutor(giftOptions)
    .getFinalPromise()
    .then(() => console.log(chalk`{green.bold Gift} Created With {green.bold Success}!`))
    .catch(() => {
      errors++;
      console.log(chalk`{red.bold Gift} Created With {red.bold Error}!`);
    });
}

const test = async () =>
  testExtract()
    .then(() => testGift())
    .then(() => rm(outputDir, { recursive: true }))
    .then(() => {
      if (errors) return Promise.reject(new Error("Test Failed"));
    });

// Test the Entire App
test().catch((err) => {
  process.exit(1)
});
