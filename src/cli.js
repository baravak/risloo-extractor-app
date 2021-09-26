import { Command, Option } from "commander/esm.mjs";
import fs from "fs/promises";
import { access, constants } from "fs";
import path from "path";
import sharp from "sharp";
import { Buffer } from "buffer";
const eta = require("eta");

const program = new Command();

eta.configure({
  views: path.join(__dirname, "..", "views", "profiles"),
});

function parseArgumentsIntoOptions(rawArgs) {
  let output = {};

  program
    .command("draw")
    .alias("D")
    .argument("<profileName>")
    .description("You can draw a profile using this command!")
    .addOption(
      new Option("-i, --input-type <type>", "input type")
        .choices(["local", "remote", "raw_json"])
        .makeOptionMandatory()
    )

    .addOption(
      new Option("-d, --input-data <data>", "input data").makeOptionMandatory()
    )

    .addOption(
      new Option("-o, --output-type <type>", "output type")
        .choices(["local", "remote"])
        .makeOptionMandatory()
    )

    .addOption(
      new Option(
        "-a, --output-address <address>",
        "output address"
      ).makeOptionMandatory()
    )

    .addOption(
      new Option("-m, --measure", "measure feature in SVG").default(false)
    )

    .action((profileName, options, command) => {
      output = {
        command: command.name(),
        profileName,
        ...options,
      };
    });

  program.name("risloo").usage("draw <profileName> [options]");

  program.showHelpAfterError();

  program.showSuggestionAfterError();

  program.parse(rawArgs);

  return output;
}

async function draw(options) {
  // Suppose that both input & output type are "local"

  let profilePath = path.join(
    __dirname,
    "profiles",
    `${options.profileName}.js`
  );

  access(options.inputData, constants.F_OK, async (err) => {
    if (err) {
      console.log("Input Data File Does Not Exist!");
      return;
    }

    const dataset = JSON.parse(await fs.readFile(options.inputData, "utf8"));

    access(profilePath, constants.F_OK, async (err) => {
      if (err) {
        console.log("Profile Name Is Not Valid!");
        return;
      }

      const profileClass = require(profilePath);
      const profileObj = new profileClass(dataset);
      const ctx = {
        ...profileObj.getTemplateEngineParams(),
        measure: options.measure,
      };

      const xml = await eta.renderFile(options.profileName, ctx);

      const mapObj = {
        'text-anchor="start"': 'text-anchor="end"',
        'text-anchor="end"': 'text-anchor="start"',
      };

      const svg = xml.replace(
        /text-anchor="start"|text-anchor="end"/g,
        (matched) => mapObj[matched]
      );

      const buf = Buffer.from(xml, "utf8");
      const png = await sharp(buf, { density: 500 });

      await fs.writeFile(
        `${options.outputAddress}/${options.profileName}.svg`,
        svg
      );
      await png.toFile(`${options.outputAddress}/${options.profileName}.png`);
    });
  });
}

export async function cli(args) {
  let options = parseArgumentsIntoOptions(args);

  switch (options.command) {
    case "draw":
      draw(options);
      break;
  }
}
