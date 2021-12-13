const path = require("path");
const Executor = require("./Executor");
const { checkAndImport, checkAndLoad } = require("./utilities/BaseOps");
const { EXTRACT_STATUS } = require("./utilities/STATUSES");
const { FileNotFoundError } = require("./utilities/CustomErrors");

class ExtractExecutor extends Executor {
  samplesJSDir = path.join(__dirname, "..", "samples");
  profilesTemplatesDir = path.join(__dirname, "..", "..", "views", "profiles", "samples");

  constructor(options) {
    super(options);
    this.sample = {
      name: options.sampleName,
      outputs: options.sampleOutputs,
    };

    this._addJSPromise();
    this._initSettings(options);

    this._extract();
  }

  _addJSPromise() {
    const { sample, samplesJSDir, response, promises } = this;

    const sampleJSDir = path.join(samplesJSDir, `${sample.name}.js`);

    promises["js"] = checkAndImport(sampleJSDir).catch((err) => {
      if (err instanceof FileNotFoundError) response.setStatus(EXTRACT_STATUS["INVALID_SAMPLE_NAME"], err);
      else response.setStatus(EXTRACT_STATUS["GENERAL_ERROR"], err);
    });
  }

  _addProfilesTemplatePromises() {
    const { sample, profilesTemplatesDir, promises, response } = this;

    promises["templates"] = [];

    promises["miscellaneous_1"] = promises["js"].then((Profile) => {
      let n = Profile.pages;
      for (let i = 0; i < n; i++) {
        let templateFileDir = path.join(profilesTemplatesDir, `${sample.name}${n !== 1 ? "_" + (i + 1) : ""}.hbs`);
        promises["templates"].push(
          checkAndLoad(templateFileDir).catch((err) => response.setStatus(EXTRACT_STATUS["TEMPLATE_NOT_FOUND"], err))
        );
      }
      return Promise.all(promises.templates);
    });
  }

  _initSettings(options) {
    const { sample } = this;

    let settings = {};

    if (sample.outputs.includes("profile")) {
      let variants = {
        both: ["raw", "with-sidebar"],
        raw: ["raw"],
        "with-sidebar": ["with-sidebar"],
      }[options.profileVariant];

      settings["profile"] = {
        measure: options.measure,
        variants,
        name: options.name,
      };

      this._addProfilesTemplatePromises();
    }

    this.settings = settings;
  }

  _extract() {
    const { sample, promises, response, benchmarker, settings } = this;

    const extractPromises = [];

    if (sample.outputs.includes("profile")) {
      let { variants } = settings["profile"];
      response.addBranch("profiles");

      extractPromises.push(Promise.all(variants.map((variant) => this._createProfile(variant))));
    }

    if (sample.outputs.includes("report")) extractPromises.push(this._createReport(options));

    if (sample.outputs.includes("sheet")) extractPromises.push(this._createSheet(options));

    promises["extract"] = Promise.all(extractPromises).then(() => {
      if (benchmarker) {
        benchmarker.end();
        response.setTime(benchmarker.totalTime);
      }
      response.setStatus(EXTRACT_STATUS["SUCCESS"]);
    });
  }

  async _createProfile(variant) {
    const {
      promises,
      response,
      settings: {
        profile: { measure },
      },
    } = this;

    const outputFileName = this._createProfileOutputName(variant);

    return Promise.all([promises.input, promises.js])
      .then(([dataset, Profile]) => new Profile(dataset, { variant, measure }).getTemplateEngineParams())
      .catch((err) => response.setStatus(EXTRACT_STATUS["JS_ERROR"], err))
      .then((contexts) => this._renderAndCreateOutputs(contexts, promises.templates, outputFileName, ["svg", "png"]))
      .then((pages) => pages.map((dirs) => dirs.map((dir) => response.addOutput(dir, "profiles"))));
  }

  _createProfileOutputName(variant) {
    const {
      settings: {
        profile: { measure, name },
      },
      input,
    } = this;

    let variantSuffix = {
      raw: ".raw",
      "with-sidebar": "",
    }[variant];
    let measureSuffix = measure ? "-m" : "";

    const fileName = input.type === "local" ? path.parse(input.data).name : "";

    if (!(name || fileName)) throw new Error("No Name Provided for Profile Output Files!");

    return `${name || fileName}${variantSuffix}${measureSuffix}`;
  }
}

module.exports = ExtractExecutor;
