import { Command, Option } from "commander/esm.mjs";

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
        .choices(["local", "remote", "raw-json", "stdin"])
        .default("local")
        .makeOptionMandatory()
    )

    .addOption(new Option("-d, --input-data <data>", "input data"))

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

    .addOption(new Option("-n, --name <name>", "name of output profile"))

    .addOption(new Option("-b, --benchmark", "time benchmarking"))

    .action((profileName, options, command) => {
      output = {
        command: command.name(),
        profileName,
        ...options,
      };
    });

  program
    .command("test")
    .alias("T")
    .description("You can test commands of the cli.")
    .addOption(
      new Option("-c, --command-test <name>", "command name to be tested")
        .choices(["draw"])
        .makeOptionMandatory()
    )
    .action((options, command) => {
      output = {
        command: command.name(),
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
      const draw = require(`./cli-commands/draw${
        options.benchmark ? "_benchmark" : ""
      }`);
      draw(options)
        .then(() => console.log("0 (Success): Profile Successfully Created!"))
        .catch((err) => console.error(err));
      break;
    case "test":
      const test = require('./cli-commands/test');
      test(options)
        .then(() => console.log("0 (Success): Draw Command Tested Completely!"))
        .catch((err) => console.error(err));
      break;
  }
}
