const draw = require("./draw");
const { readdir } = require("fs/promises");
const path = require("path");
const chalk = require("chalk");

const jsonDir = path.join(__dirname, "..", "json");
const profilesJSDir = path.join(__dirname, "..", "profiles");
const outputDir = path.join(__dirname, "..", "output", "test");

async function loadProfileNames() {
  return readdir(profilesJSDir).then((profileNames) =>
    profileNames
      .map((name) => name.split(".")[0])
      .filter((name) => name !== "empty")
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
    profileName: "",
    profileVariant: "",
    inputType: "local",
    outputType: "local",
    inputData: "",
    measure: false,
    outputAddress: outputDir,
  };

  return loadProfileNames().then(async (profileNames) => {
    const numProfiles = profileNames.length * profileVariants.length;
    for (let profileName of profileNames) {
      for (let profileVariant of profileVariants) {
        inputData = path.join(jsonDir, `${profileName}.json`);
        drawOptions = {
          ...drawOptions,
          profileName,
          profileVariant,
          inputData,
        };

        await draw(drawOptions)
          .then(() =>
            console.log(
              chalk`{green.bold ${profileName}} Profile of {italic ${profileVariant}} Variant Created With {green.bold Success}!`
            )
          )
          .catch(() => {
            erroneousProfiles++;
            console.log(
              chalk`{red.bold ${profileName}} Profile of {italic ${profileVariant}} Variant Created With {red.bold Error}!`
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
