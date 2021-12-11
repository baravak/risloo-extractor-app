const path = require("path");
const Executor = require("./Executor");
const { checkAndImport, checkAndLoad } = require("./utilities/BaseOps");
const { PROFILE_STATUS } = require("./utilities/RES_STATUS");
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
      if (err instanceof FileNotFoundError) response.setStatus(PROFILE_STATUS["INVALID_SAMPLE_NAME"]);
      else response.setStatus(PROFILE_STATUS["GENERAL_ERROR"]);
      throw err;
    });
  }

  _addTemplatePromises() {
    const {
      sample,
      profilesTemplatesDir,
      promises,
      response,
      settings: {
        profile: { pagesNum: n },
      },
    } = this;

    const templatePromises = [];

    for (let i = 0; i < n; i++) {
      let templateFileDir = path.join(profilesTemplatesDir, `${sample.name}${n !== 1 ? "_" + (i + 1) : ""}.hbs`);
      templatePromises.push(
        checkAndLoad(templateFileDir).catch((err) => {
          response.setStatus(PROFILE_STATUS["TEMPLATE_NOT_FOUND"]);
          throw err;
        })
      );
    }

    promises["templates"] = templatePromises;
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
    }

    this.settings = settings;
  }

  _extract() {
    const { sample, promises, response, benchmarker, settings } = this;

    const extractPromises = [];

    if (sample.outputs.includes("profile")) {
      let { variants } = settings["profile"];

      extractPromises.push(
        Promise.all(variants.map((variant) => this._createProfile(variant))).then(() => {
          if (benchmarker) {
            benchmarker.end();
            response.setTime(benchmarker.totalTime);
          }
          response.setStatus(PROFILE_STATUS["SUCCESS"]);
        })
      );
    }

    if (sample.outputs.includes("report")) extractPromises.push(this._createReport(options));

    if (sample.outputs.includes("sheet")) extractPromises.push(this._createSheet(options));

    promises["extract"] = Promise.all(extractPromises);
  }

  async _createProfile(variant) {
    const {
      promises,
      response,
      output: { address },
      settings: { profile },
    } = this;

    const outputFileName = this._createProfileOutputName(variant);

    return Promise.all([promises.input, promises.js])
      .then(([dataset, profileClass]) =>
        new profileClass(dataset, { variant, measure: profile.measure }).getTemplateEngineParams()
      )
      .catch((err) => {
        response.setStatus(PROFILE_STATUS["JS_ERROR"]);
        throw err;
      })
      .then((contexts) => {
        profile["pagesNum"] = contexts.length;
        this._addTemplatePromises();
        return this._renderAndCreateOutputs(contexts, promises.templates, { address, outputFileName }, ["SVG", "PNG"]);
      });
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
