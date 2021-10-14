import { Command, Option } from "commander/esm.mjs";
import fs from "fs/promises";
import { access, constants, mkdir } from "fs";
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
        .choices(["both", "raw", "with-sidebar"])
        .default("both")
        .makeOptionMandatory()
    )
    .addOption(
      new Option("-i, --input-type <type>", "input type")
        .choices(["local", "remote", "raw-json"])
        .default("local")
        .makeOptionMandatory()
    )

    .addOption(
      new Option("-d, --input-data <data>", "input data").makeOptionMandatory()
    )

    .addOption(
      new Option("-o, --output-type <type>", "output type")
        .choices(["local", "remote"])
        .default("local")
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

  console.log('start');

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

    console.log('before dataset');

    const dataset = JSON.parse(await fs.readFile(options.inputData, "utf8"));

    console.log('after dataset');

    access(profilePath, constants.F_OK, async (err) => {
      if (err) {
        console.log("Profile Name Is Not Valid!");
        return;
      }

      let profileObj;
      let ctx = {};

      console.log('before profile obj');

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

      const test = "";

      console.log('after profile obj');

      let xml = "";

      console.log('before eta rendering');

      try {
        xml = await eta.renderFile(options.profileName, ctx);
      } catch (err) {
        if (err) throw err;
      }

      console.log('after eta rendering');

      const mapObj = {
        'text-anchor="start"': 'text-anchor="end"',
        'text-anchor="end"': 'text-anchor="start"',
      };

      console.log('before xml replace');

      const svg = xml.replace(
        /text-anchor="start"|text-anchor="end"/g,
        (matched) => mapObj[matched]
      );

      console.log('after xml replace');

      console.log('before sharp conversion');

      const buf = Buffer.from(xml, "utf8");
      let png;
      try {
        png = await sharp(buf, { density: 500 });
      } catch (err) {
        if (err) throw err;
      }

      console.log('after sharp conversion');

      const outputFileName = `${ctx.dataset.info.id}${
        options.profileVariant === "with-sidebar" ? "" : ".raw"
      }${options.measure ? "-m" : ""}`;

      const outputPath = `${options.outputAddress}/${ctx.dataset.info.id}`;

      access(outputPath, constants.F_OK, async (err) => {
        if (err) {
          mkdir(outputPath, (err) => {
            if (err) throw err;
          });
        }

        console.log('before svg creation');

        try {
          await fs.writeFile(`${outputPath}/${outputFileName}.svg`, svg);
        } catch (err) {
          if (err) console.log(err.message);
        }

        console.log('after svg creation');

        console.log('before png creation');
        
        await png.toFile(`${outputPath}/${outputFileName}.png`, (err) => {
          if (err) console.log(err.message);
        });

        console.log('after png creation');
      });
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
