const { Profile, FS, Ticks } = require("../Profile");

class AEQ93 extends Profile {
  // Number of pages
  static pages = 1;

  // Labels of the sample
  labels = {
    L1: { eng: "raw", fr: "نمره کل" },
  };

  profileSpec = {
    /* "sample" determines some important info about the sample and profile */
    /* Default prerequisites: 1. gender, 2. age, 3. education */
    /* "prerequisites" is synonym to "fields" in our program */
    sample: {
      name: "پرسشنامه ارزیابی سطح کلی اضطراب" /* Name of the sample */,
      multiProfile: false /* Whether the sample has multiple profiles or not */,
      questions: false /* Determines whether to get questions from inital dataset or not */,
      defaultFields: true /* Determines whether to have default prerequisites in the profile or not */,
      fields: ["marital_status"] /* In case you want to get some additional fields and show in the profile */,
    },
    /* "profile" determines the dimensions of the drawn profile (to be used in svg tag viewbox) */
    /* calculating its dimensions carefully is of great importance */
    profile: {
      get dimensions() {
        return {
          width: 728 + 2 * this.padding.x,
          height: 415 + 2 * this.padding.y,
        }
      },
      padding: {
        x: 87,
        y: 0,
      },
    },
    /* "raw" is the general term used for total data element in the profile */
    raw: {
      minValue: 0 /* Minimum value of the raw mark */,
      maxValue: 150 /* Maximum value of the item mark */,
      circle: {
        R: 340 /* Radius of the outer circle of the raw element */,
        r: 325 /* Radius of the inner circle of the raw element */,
        brs: {
          tl: 0 /* Top left border radius */,
          bl: 0 /* Bottom left border radius */,
          tr: 0 /* Top right border radius */,
          br: 0 /* Bottom right border radius */,
        } /* Border radiuses at each end of the gauge of the item element */,
        angles: {
          start: FS.toRadians(-180),
          end: FS.toRadians(0),
        } /* Angles of each end of the raw element */,
        direction: false /* Clockwise direction for the raw gauge element */,
      },
      ticks: {
        num: 6,
      },
    },
    /* "labels" part which has to be provided for each profile */
    labels: Object.values(this.labels)
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

    const { raw: rawSpec } = spec;

    const rawData = dataset.score[0];

    const rawTicks = new Ticks(rawSpec.minValue, rawSpec.maxValue, rawSpec.ticks.num);

    const raw = {
      label: rawData.label,
      mark: rawData.mark,
      angle: this._markToAngle(
        rawData.mark,
        rawSpec.minValue,
        rawSpec.maxValue,
        rawSpec.circle.angles,
        rawSpec.circle.direction
      ),
      ticks: rawTicks.numbers.map((number) => ({
        mark: number,
        angle: this._markToAngle(
          number,
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

module.exports = AEQ93;
