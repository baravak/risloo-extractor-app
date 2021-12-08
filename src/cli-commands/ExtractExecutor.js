const path = require("path");
const Executor = require("./Executor");
const { checkAndImport } = require("./utilities/BaseOps");
const { PROFILES_STATUS } = require("./utilities/STATUS");

class ExtractExecutor extends Executor {
  samplesJSDir = path.join(__dirname, "..", "samples");
  profilesTemplatesDir = path.join(__dirname, "..", "..", "views", "profiles", "samples");

  constructor(options) {
    super(options);
    this.sample = {
      name: options.sampleName,
      outputs: options.sampleOutputs,
    };
    this.fileName = options.name;

    this._addJSPromise();

    this.finalPromise = this._extract(options);
  }

  _addJSPromise() {
    const { sample, samplesJSDir, response } = this;

    const sampleJSDir = path.join(samplesJSDir, `${sample.name}.js`);

    this.promises["js"] = checkAndImport(sampleJSDir).catch((err) => {
      if (err instanceof FileNotFoundError) response.setStatus(PROFILES_STATUS["3"]);
      else response.setStatus(PROFILES_STATUS["6"]);
      throw err;
    });
  }

  _extract(options) {
    const { sample } = this;

    const extractPromises = [];

    if (sample.outputs.includes("profile")) {
      let profileVariants = {
        both: ["raw", "with-sidebar"],
        raw: ["raw"],
        "with-sidebar": ["with-sidebar"],
      }[options.profileVariant];

      extractPromises.push(
        Promise.all(profileVariants.map((profileVariant) => this._createProfile({ ...options, profileVariant })))
      );
    }

    if (sample.outputs.includes("report")) extractPromises.push(this._createReport(options));

    if (sample.outputs.includes("sheet")) extractPromises.push(this._createSheet(options));

    return Promise.all(extractPromises);
  }

  _createProfile(options) {
    const { sample, fileName, promises, response } = this;

    return Promise.all([promises.input, promises.js]).then(([dataset, profileClass]) => {
      let contexts = new profileClass(dataset, options).getTemplateEngineParams();
    });
  }
}

module.exports = ExtractExecutor;
