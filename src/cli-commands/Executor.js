const { checkAndLoad, loadStdin, ensureDirExistence, createSVG, createPNG } = require("./utilities/BaseOps");
const Handlebars = require("../handlebars/init");
const path = require("path");
const Benchmarker = require("./utilities/Benchmarker");
const Response = require("./utilities/Response");

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
    this.response = new Response();
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

  async _renderTemplate(ctx, templateBuffer) {
    const template = (await Handlebars).compile(templateBuffer.toString(), "utf-8");
    return template(ctx);
  }

  async _createOutput(xml, { address, fileName }, ext) {
    const dir = path.join(address, `${fileName}.${ext}`);
    return ext === "svg" ? createSVG(xml, dir) : ext === "png" ? createPNG(xml, dir) : Promise.resolve();
  }

  async _renderAndCreateOutput(ctx, templatePromise, fileName, extensions) {
    const {
      promises,
      output: { address },
    } = this;
    let xml;

    return templatePromise
      .then(async (templateBuffer) => {
        xml = await this._renderTemplate(ctx, templateBuffer);
        return promises.output;
      })
      .then(() => Promise.all(extensions.map((ext) => this._createOutput(xml, { address, fileName }, ext))));
  }

  async _renderAndCreateOutputs(contexts, templatePromises, outputFileName, extensions) {
    return Promise.all(
      templatePromises.map((templatePromise, index) => {
        let fileName = `${outputFileName}${index !== 0 ? ".page" + (index + 1) : ""}`;
        return this._renderAndCreateOutput(contexts[index], templatePromise, fileName, extensions);
      })
    );
  }

  getFinalPromise() {
    const { promises, response } = this;

    return Promise.all(Object.values(promises)).finally(() => response.showOutput());
  }
}

module.exports = Executor;
