const path = require("path");
const chokidar = require("chokidar");
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

    this.dirs = {};

    this._addJSPromise();
    this._initSettings(options);

    this._extract();

    if (options.watch) this._watch();
  }

  _addJSPromise() {
    const { sample, dirs, samplesJSDir, response, promises } = this;

    const sampleJSDir = path.join(samplesJSDir, `${sample.name}.js`);

    dirs["sampleJS"] = sampleJSDir;

    promises["js"] = checkAndImport(sampleJSDir).catch((err) => {
      if (err instanceof FileNotFoundError) response.setStatus(EXTRACT_STATUS["INVALID_SAMPLE_NAME"], err);
      else response.setStatus(EXTRACT_STATUS["GENERAL_ERROR"], err);
    });
  }

  _addProfilesTemplatePromises() {
    const { sample, dirs, profilesTemplatesDir, promises, response } = this;

    promises["templates"] = [];

    dirs["templates"] = [];

    promises["miscellaneous_1"] = promises["js"].then((Profile) => {
      let n = Profile.pages;
      for (let i = 0; i < n; i++) {
        let templateFileDir = path.join(profilesTemplatesDir, `${sample.name}${n !== 1 ? "_" + (i + 1) : ""}.hbs`);
        dirs["templates"].push(templateFileDir);
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

      extractPromises.push(Promise.all(variants.map((variant) => this._createProfile(variant))));
    }

    if (sample.outputs.includes("report")) extractPromises.push(this._createReport(options));

    if (sample.outputs.includes("sheet")) extractPromises.push(this._createSheet(options));

    promises["extract"] = Promise.all(extractPromises).then(() => {
      benchmarker?.end();
      response.setTime(benchmarker?.totalTime);
      response.setStatus(EXTRACT_STATUS["SUCCESS"]);
    });
  }

  async _createProfile(variant, exts = ["svg", "png"]) {
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
      .then((contexts) => this._renderAndCreateOutputs(contexts, promises.templates, outputFileName, exts))
      .then((pages) => pages.map((dirs) => dirs.map((dir) => response.addOutput(dir, "profiles"))));
  }

  _watch() {
    const { command, dirs, input, response, benchmarker, promises } = this;

    const opts = {
      awaitWriteFinish: {
        stabilityThreshold: 500,
        pollInterval: 100,
      },
    };

    promises["js"].then(() => {
      dirs.templates.map((templateFileDir, index) => {
        chokidar.watch(templateFileDir, opts).on("change", () => {
          promises["templates"][index] = checkAndLoad(templateFileDir);
          benchmarker?.restart(command);
          this._createProfile("with-sidebar", ["svg"]).then(() => {
            benchmarker?.end();
            response.setTime(benchmarker?.totalTime);
            response.showOutput();
          });
        });
      });
    });

    chokidar.watch(dirs.sampleJS, opts).on("change", () => {
      promises["js"] = checkAndImport(dirs.sampleJS);
      benchmarker?.restart(command);
      this._createProfile("with-sidebar", ["svg"]).then(() => {
        benchmarker?.end();
        response.setTime(benchmarker?.totalTime);
        response.showOutput();
      });
    });
    
    if(input.type === 'local') chokidar.watch(input.data, opts).on('change', () => {
      promises["input"] = checkAndLoad(input.data).then((json) => Promise.resolve(JSON.parse(json)));
      benchmarker?.restart(command);
      this._createProfile("with-sidebar", ["svg"]).then(() => {
        benchmarker?.end();
        response.setTime(benchmarker?.totalTime);
        response.showOutput();
      });

    })
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
