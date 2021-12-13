const { checkAndLoad, loadStdin, ensureDirExistence, createSVG, createPNG } = require("./utilities/BaseOps");
const Handlebars = require("../handlebars/init");
const path = require("path");
const Benchmarker = require("./utilities/Benchmarker");
const outputJSON = require("./utilities/outputJSON");

class Executor {
  constructor(options) {
    this.command = options.command;
    this.input = {
      type: options.inputType,
      data: options.inputData,
    };
    this.output = {
      type: options.outputType,
      address: options.outputAddress,
    };
    this.response = new outputJSON(0);
    if (options.benchmark) this._initBenchmarker();
    this._initPromises();
  }

  _initBenchmarker() {
    const { command: commandName } = this;

    this.benchmarker = new Benchmarker();
    this.benchmarker.start(`${commandName} Command`);
  }

  _initPromises() {
    this.promises = {};

    this._addInputPromise();
    this._addOutputPromise();
  }

  _addInputPromise() {
    const {
      input: { type, data },
    } = this;

    let jsonPromise;

    switch (type) {
      case "local":
        if (!data) throw new Error("No Input Data Provided");
        jsonPromise = checkAndLoad(data);
        break;
      case "stdin":
        jsonPromise = loadStdin("utf-8");
        break;
      case "raw-json":
        if (!data) throw new Error("No Input Data Provided");
        jsonPromise = Promise.resolve(data);
        break;
      case "remote":
        break;
    }

    this.promises["input"] = jsonPromise.then((json) => Promise.resolve(JSON.parse(json)));
  }

  _addOutputPromise() {
    const {
      output: { type, address },
    } = this;

    switch (type) {
      case "local":
        this.promises["output"] = ensureDirExistence(address);
        break;
      case "raw-json":
        break;
    }
  }

  _renderAndCreateOutputs(contexts, templatePromises, outputFileName, extensions) {
    const {
      promises,
      output: { address },
      response,
    } = this;
    let xml,
      fileName,
      outputPromises = [];

    return Promise.all(
      templatePromises.map((templatePromise, index) =>
        templatePromise
          .then(async (templateBuffer) => {
            const template = (await Handlebars).compile(templateBuffer.toString(), "utf-8");
            xml = template(contexts[index]);
            fileName = `${outputFileName}${index !== 0 ? ".page" + (index + 1) : ""}`;

            return promises.output;
          })
          .then(() => {
            if (extensions.includes("SVG"))
              outputPromises.push(createSVG(xml, path.join(address, `${fileName}.svg`), response));
            if (extensions.includes("PNG"))
              outputPromises.push(createPNG(xml, path.join(address, `${fileName}.png`), response));
            return Promise.all(outputPromises);
          })
      )
    );
  }

  getFinalPromise() {
    const { promises, response } = this;

    return Promise.all(Object.values(promises)).finally(() => response.showOutput());
  }
}

module.exports = Executor;
