import arg from "arg";
import main from "./main";
import fs from "fs/promises";
import inquirer from "inquirer";
import pug from "pug";

function parseArgumentsIntoOptions(rawArgs) {
  const args = arg(
    {},
    {
      argv: rawArgs.slice(2),
    }
  );
  return {
    chartType: args._[0],
    jsonFile: args._[1],
    saveDir: args._[2],
  };
}

async function promptForMissingOptions(options) {
  const questions = [];
  if (!options.chartType) {
    questions.push({
      type: "input",
      name: "chartType",
      message: "Please specify the type of chart you want?\n",
    });
  }

  if (!options.jsonFile) {
    questions.push({
      type: "input",
      name: "jsonFile",
      message: "Please determine the address of input json file!\n",
    });
  }

  if (!options.saveDir) {
    questions.push({
      type: "input",
      name: "saveDir",
      message: "You missed to specify the save directory...\n",
    });
  }

  const answers = await inquirer.prompt(questions);
  return {
    chartType: options.chartType || answers.chartType,
    jsonFile: options.jsonFile || answers.jsonFile,
    saveDir: options.saveDir || answers.saveDir,
  };
}

async function promptForIncorrectInput(options, incorrectInput) {
  const questions = [];
  if (incorrectInput.chartType) {
    questions.push({
      type: "input",
      name: "chartType",
      message: `${options.chartType} chart doesn't exist.\nPlease enter a correct chart type!\n`,
    });
  }

  if (incorrectInput.jsonFile) {
    questions.push({
      type: "input",
      name: "jsonFile",
      message: `${options.jsonFile} doesn't exist.\nPlease enter a correct JSON file path...\n`,
    });
  }

  const answers = await inquirer.prompt(questions);

  return {
    chartType: answers.chartType || options.chartType,
    jsonFile: answers.jsonFile || options.jsonFile,
    saveDir: answers.saveDir || options.saveDir,
  };
}

export async function cli(args) {
  let options = parseArgumentsIntoOptions(args);
  options = await promptForMissingOptions(options);
  let incorrectInput;
  let dataset = [];
  let ctx = {};

  while (true) {
    incorrectInput = {};
    try {
      dataset = JSON.parse(await fs.readFile(options.jsonFile, "utf8"));
    } catch (err) {
      incorrectInput["jsonFile"] = true;
    }

    switch (options.chartType) {
      case "radar":
        ctx = main.radar(dataset);
        break;
      default:
        incorrectInput["chartType"] = true;
    }

    if (!Object.keys(incorrectInput).length) break;
    options = await promptForIncorrectInput(options, incorrectInput);
  }

  const SVGContent = pug.renderFile(`./views/${options.chartType}.pug`, ctx);

  fs.writeFile(options.saveDir, SVGContent);
}
