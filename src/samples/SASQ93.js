const { Profile, FS } = require("../Profile");

class SASQ93 extends Profile {
  // Number of pages
  static pages = 1;

  // Labels of the sample
  labels = {
    L1: { eng: "raw", fr: "نمره کل" },
    L2: { eng: "interpretation", fr: "تفسیر" },
  };

  profileSpec = {
    /* "sample" determines some important info about the sample and profile */
    /* Default prerequisites: 1. gender, 2. age, 3. education */
    /* "prerequisites" is synonym to "fields" in our program */
    sample: {
      name: "پرسشنامه ارزیابی اضطراب شینان" /* Name of the sample */,
      multiProfile: false /* Whether the sample has multiple profiles or not */,
      questions: false /* Determines whether to get questions from inital dataset or not */,
      defaultFields: true /* Determines whether to have default prerequisites in the profile or not */,
      fields: ["marital_status"] /* In case you want to get some additional fields and show in the profile */,
    },
    /* "profile" determines the dimensions of the drawn profile (to be used in svg tag viewbox) */
    /* calculating its dimensions carefully is of great importance */
    profile: {
      dimensions: {} /* To be calculated in the class with the function provided */,
      calcDim: function (spec, n) {
        return {
          width: 723 + spec.profile.padding.x * 2,
          height: 350 + spec.profile.padding.y * 2,
        };
      },
      padding: {
        x: 70,
        y: 0,
      },
    },
    /* "raw" is the general term used for total data element in the profile */
    raw: {
      minValue: 34 /* Minimum value of items data element */,
      maxValue: 175 /* Maximum value of items data element */,
      get range() {
        return this.maxValue - this.minValue;
      },
      stops: [34, 69, 105, 175],
      fill: "#BE185D",
      circle: {
        R: 307 /* Radius of the outer circle of the items element */,
        r: 230 /* Radius of the inner circle of the items element */,
        brs: {
          tl: 0 /* Top left border radius */,
          bl: 0 /* Bottom left border radius */,
          tr: 0 /* Top right border radius */,
          br: 0 /* Bottom right border radius */,
        } /* Border radiuses at each end of the gauge of the items element */,
        angles: {
          start: FS.toRadians(-180),
          end: FS.toRadians(0),
        } /* Angles of each end of the items element */,
        direction: false /* Clockwise direction for the items gauge element */,
      },
      interprets: [
        { opacity: 0.6, eng: "mild", fr: "سطح پایین" },
        { opacity: 0.8, eng: "moderate", fr: "سطح متوسط" },
        { opacity: 1, eng: "severe", fr: "سطح شدید" },
      ],
    },
    /* "labels" part which has to be provided for each profile */
    labels: Object.values(this.labels),
  };

  constructor(dataset, options, config = {}) {
    super();
    this._init(dataset, options, config);
  }

  _calcContext() {
    const {
      spec: { parameters: spec },
      dataset,
    } = this;

    // Deconstructing the Spec of the Profile
    const { raw: rawSpec } = spec;

    // ّInit Spec
    spec.profile.dimensions = spec.profile.calcDim(spec, dataset.score.length);

    const rawData = dataset.score[0];
    const interpretData = dataset.score[1];

    const raw = {
      label: rawData.label,
      mark: rawData.mark,
      interpretation: interpretData.mark,
      angle: this._markToAngle(
        rawData.mark,
        rawSpec.minValue,
        rawSpec.maxValue,
        rawSpec.circle.angles,
        rawSpec.circle.direction
      ),
      stops: rawSpec.stops.map((stop) => ({
        mark: stop,
        angle: this._markToAngle(
          stop,
          rawSpec.minValue,
          rawSpec.maxValue,
          rawSpec.circle.angles,
          rawSpec.circle.direction
        ),
      })),
    };

    return [{ raw }];
  }

  _markToAngle(mark, min, max, angles, direction) {
    const totalAngle = this._calcDiffAngle(angles.end, angles.start, direction);
    const deltaTheta = ((mark - min) / (max - min)) * totalAngle;
    return this._calcDistAngle(deltaTheta, angles.start, direction);
  }

  _calcDiffAngle(theta, theta0, direction) {
    return direction ? 2 * Math.PI - (theta - theta0) : theta - theta0;
  }

  _calcDistAngle(deltaTheta, theta0, direction) {
    return direction ? 2 * Math.PI - deltaTheta + theta0 : deltaTheta + theta0;
  }
}

module.exports = SASQ93;
