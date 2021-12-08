const { checkAndLoad, loadStdin, ensureDirExistence } = require("./utilities/BaseOps");
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
    if (options.benchmark) this._initBenchmarker();
    this.response = new outputJSON(0);
    this._initPromises();
  }

  _initBenchmarker() {
    const { command: commandName } = this;

    this.benchmarker = new Benchmarker();
    this.benchmarker.start(`${commandName} Command`);
  }

  _initPromises() {
    this.promises = {};

    this._createInputPromise();
    this._createOutputPromise();
  }


  _createInputPromise() {
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

    this.promises["input"] = jsonPromise.then(json => Promise.resolve(JSON.parse(json)))
  }

  _createOutputPromise() {
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
}

module.exports = Executor;
