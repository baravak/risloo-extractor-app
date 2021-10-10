import { Command, Option } from "commander/esm.mjs";
import fs from "fs/promises";
import { access, constants } from "fs";
import path from "path";
import sharp from "sharp";
import { Buffer } from "buffer";
const prettier = require("prettier");
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
      new Option("-p, --profile-variant <variant>", "profile variant")
        .choices(["raw", "with-sidebar", "with-header"])
        .makeOptionMandatory()
    )
    .addOption(
      new Option("-i, --input-type <type>", "input type")
        .choices(["local", "remote", "raw-json"])
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
        if (err) throw err;
      }

      let profileObj;
      let ctx = {};

      const profileClass = require(profilePath);
      try {
        profileObj = new profileClass(dataset, options.profileVariant);
        ctx = {
          ...profileObj.getTemplateEngineParams(),
          variant: options.profileVariant,
          measure: options.measure,
        };
      } catch (err) {
        if (err) throw err;
      }

      let xml = "";

      try {
        xml = await eta.renderFile(options.profileName, ctx);
      } catch (err) {
        if (err) throw err;
      }

      // xml = prettier.format(xml, {parser: "html"});

      const mapObj = {
        'text-anchor="start"': 'text-anchor="end"',
        'text-anchor="end"': 'text-anchor="start"',
      };

      const svg = xml.replace(
        /text-anchor="start"|text-anchor="end"/g,
        (matched) => mapObj[matched]
      );

      const buf = Buffer.from(xml, "utf8");
      let png;
      try {
        png = await sharp(buf, { density: 500 });
      } catch (err) {
        if (err) throw err;
      }

      const profileName = `${options.profileName}${
        options.profileVariant === "with-header"
          ? "-header"
          : options.profileVariant === "with-sidebar"
          ? "-sidebar"
          : "-raw"
      }${options.measure ? "-m" : ""}`;

      try {
        await fs.writeFile(`${options.outputAddress}/${profileName}.svg`, svg);
      } catch (err) {
        if (err) console.log(err.message);
      }
      png.toFile(
        `${options.outputAddress}/${options.profileName}.png`,
        (err) => {
          if (err) console.log(err.message);
        }
      );
    });
  });
}

export async function cli(args) {
  let options = parseArgumentsIntoOptions(args);

  switch (options.command) {
    case "draw":
      try {
        draw(options);
      } catch (err) {
        if (err) throw err;
      }
      break;
  }
}
