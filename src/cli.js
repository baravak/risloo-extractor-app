const { Argument, Command, Option } = require("commander");

const program = new Command();

function parseArgumentsIntoOptions(rawArgs) {
  let output = {};

  program
    .command("extract")
    .alias("E")
    .argument("<sampleName>", "sample name")
    .addArgument(
      new Argument("[sampleOutputs...]", "sample outputs").choices(["profile", "report", "sheet"]).default(["profile"])
    )
    .description("Extract outputs of a sample")
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

    .addOption(new Option("-a, --output-address <address>", "output address").makeOptionMandatory())

    .addOption(new Option("-m, --measure", "measure feature in SVG").default(false))

    .addOption(new Option("-n, --name <name>", "name of output profile"))

    .addOption(new Option("-b, --benchmark", "time benchmarking").default(false))

    .action((sampleName, sampleOutputs, options, command) => {
      output = {
        command: command.name(),
        sampleName,
        sampleOutputs,
        ...options,
      };
    });

  program
    .command("test")
    .alias("T")
    .description("Test Commands of CLI")
    .addOption(
      new Option("-c, --command-test <name>", "command name to be tested").choices(["extract"]).makeOptionMandatory()
    )
    .action((options, command) => {
      output = {
        command: command.name(),
        ...options,
      };
    });

  program
    .command("gift")
    .alias("G")
    .description("Create Gift Card")
    .addOption(
      new Option("-i, --input-type <type>", "input type")
        .choices(["raw-json", "local"])
        .default("raw-json")
        .makeOptionMandatory()
    )
    .addOption(new Option("-d, --input-data <data>", "input data"))
    .addOption(new Option("-a, --output-address <address>", "output address").makeOptionMandatory())
    .addOption(new Option("-b, --benchmark", "time benchmarking").default(false))
    .action((options, command) => {
      output = {
        command: command.name(),
        ...options,
      };
    });

  program.showHelpAfterError();

  program.showSuggestionAfterError();

  program.parse(rawArgs);

  return output;
}

async function cli(args) {
  let options = parseArgumentsIntoOptions(args);

  switch (options.command) {
    case "extract":
      const extract = require("./cli-commands/extract");
      return extract(options);
    case "gift":
      const gift = require("./cli-commands/gift");
      return gift(options);
    case "test":
      const test = require("./cli-commands/test");
      test(options)
        .then(() => console.log("0 (Success): Draw Command Tested Completely!"))
        .catch((err) => console.error(err));
      break;
  }
}

module.exports = { cli };
