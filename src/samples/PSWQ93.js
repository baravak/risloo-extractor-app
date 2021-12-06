const { Profile, FS } = require("../Profile");

class PSWQ93 extends Profile {
  profileSpec = {
    /* "test" determines some important info about the test and profile */
    /* Default prerequisites: 1. gender, 2. age, 3. education */
    /* "prerequisites" is synonym to "fields" in our program */
    test: {
      name: "پرسشنامه نگرانی پن" /* Name of the test */,
      multiProfile: false /* Whether the test has multiple profiles or not */,
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
          width: 656 + spec.profile.padding.x * 2,
          height: 587 + spec.profile.padding.y * 2,
        };
      },
      padding: {
        x: 0,
        y: 70,
      },
    },
    /* "raw" is the general term used for total data element in the profile */
    raw: {
      minValue: 0 /* Minimum value of the item mark */,
      maxValue: 80 /* Maximum value of the item mark */,
      stops: [15, 32, 48, 80] /* Stops array of the item mark */,
      circle: {
        R: 230 /* Radius of the outer circle of the item element */,
        r: 40 /* Radius of the inner circle of the item element */,
        brs: {
          tl: 0 /* Top left border radius */,
          bl: 0 /* Bottom left border radius */,
          tr: 0 /* Top right border radius */,
          br: 0 /* Bottom right border radius */,
        } /* Border radiuses at each end of the gauge of the item element */,
        angles: {
          start: FS.toRadians(-90),
          end: FS.toRadians(270),
        } /* Angles of each end of the item element */,
        direction: false /* Clockwise direction for the item gauge element */,
      },
      interprets: [
        { fill: "#FBBF24", eng: "mild", fr: "نگرانی کم" },
        { fill: "#EA580C", eng: "moderate", fr: "نگرانی متوسط" },
        { fill: "#DC2626", eng: "severe", fr: "نگرانی زیاد" },
      ],
    },
    /* "labels" part which has to be provided for each profile */
    labels: {
      raw: "نمره کل",
      interpretation: "تفسیر",
    },
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
    const interpret = dataset.score[1].mark;

    const raw = {
      label: rawData.label,
      mark: rawData.mark,
      interpret: rawSpec.interprets.find((interpretation) => interpretation.eng === interpret),
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

module.exports = PSWQ93;
