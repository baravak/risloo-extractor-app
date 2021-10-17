import { Command, Option } from "commander/esm.mjs";
import draw from "./cli-commands/draw";

const program = new Command();

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

    .addOption(new Option("-v, --dev", "dev mode").default(false))

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

export function cli(args) {
  let options = parseArgumentsIntoOptions(args);

  switch (options.command) {
    case "draw":
      draw(options)
        .then(() => console.log("0 (Success): Profile Successfully Created!"))
        .catch((err) => console.error(err));
      break;
  }
}
