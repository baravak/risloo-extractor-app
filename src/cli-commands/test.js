const extract = require("./extract");
const { readdir } = require("fs/promises");
const path = require("path");
const chalk = require("chalk");

const jsonDir = path.join(process.cwd(), "src", "json");
const profilesJSDir = path.join(process.cwd(), "src", "samples");
const outputDir = path.join(process.cwd(), "src", "output", "test");

async function loadProfileNames() {
  return readdir(profilesJSDir).then((sampleNames) =>
    sampleNames.map((name) => name.split(".")[0]).filter((name) => name !== "empty")
  );
}

async function test(options) {
  // Number of profiles resulted in error
  let erroneousProfiles = 0;

  // Profile variants different choices
  const profileVariants = ["raw", "with-sidebar"];

  // Input data
  let inputData = "";

  // Initial Draw Command Options
  let drawOptions = {
    sampleName: "",
    profileVariant: "",
    inputType: "local",
    outputType: "local",
    inputData: "",
    measure: false,
    benchmark: true,
    outputAddress: outputDir,
  };

  return loadProfileNames().then(async (sampleNames) => {
    const numProfiles = sampleNames.length * profileVariants.length;
    for (let sampleName of sampleNames) {
      for (let profileVariant of profileVariants) {
        inputData = path.join(jsonDir, `${sampleName}.json`);
        drawOptions = {
          ...drawOptions,
          sampleName,
          profileVariant,
          inputData,
        };

        await extract(drawOptions)
          .then(() =>
            console.log(
              chalk`{green.bold ${sampleName}} Profile of {italic ${profileVariant}} Variant Created With {green.bold Success}!`
            )
          )
          .catch(() => {
            erroneousProfiles++;
            console.log(
              chalk`{red.bold ${sampleName}} Profile of {italic ${profileVariant}} Variant Created With {red.bold Error}!`
            );
          });
      }
    }
    console.log(
      chalk`*** {green.bgGrey.bold  ${
        numProfiles - erroneousProfiles
      } } Profiles Created With {green.bold Success} Out of {blue.bgGrey.bold  ${numProfiles} } Profiles! ***`
    );
  });
}

module.exports = test;
