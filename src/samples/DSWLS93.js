const { Profile, FS } = require("../Profile");

class DSWLS93 extends Profile {
  // Number of pages
  static pages = 1;

  profileSpec = {
    /* "test" determines some important info about the test and profile */
    /* Default prerequisites: 1. gender, 2. age, 3. education */
    /* "prerequisites" is synonym to "fields" in our program */
    test: {
      name: "پرسشنامه رضایت از زندگی داینر" /* Name of the test */,
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
          width: 460 + spec.profile.padding.x * 2,
          height: 460 + spec.profile.padding.y * 2,
        };
      },
      padding: {
        x: 0,
        y: 127,
      },
    },
    /* "raw" is the general term used for total data element in the profile */
    raw: {
      maxValue: 35 /* Maximum value of raw mark provided by the dataset */,
      fill: "#16A34A" /* Color used in the raw element */,
      circle: {
        R: 230 /* Radius of the outer circle of the raw element */,
        r: 160 /* Radius of the inner circle of the raw element */,
        brs: {
          tl: 20 /* Top left border radius */,
          bl: 20 /* Bottom left border radius */,
          tr: 20 /* Top right border radius */,
          br: 20 /* Bottom right border radius */,
        } /* Border radiuses at each end of the gauge of the raw element */,
        angles: {
          start: FS.toRadians(-90),
          end: FS.toRadians(180),
        } /* Angles of each end of the raw element */,
        direction: false /* Clockwise direction for the raw gauge element */,
        get totalAngle() {
          return this.direction
            ? 2 * Math.PI - (this.angles.end - this.angles.start)
            : this.angles.end - this.angles.start;
        },
      },
      ticks: {
        num: 2 /* Number of ticks */,
        number: {
          offset: 25 /* Offset from the line */,
        },
      },
    },
    /* "labels" part which has to be provided for each profile */
    labels: {
      raw: "نمره کل",
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

    const { raw: rawSpec } = spec;

    // Init Spec
    spec.profile.dimensions = spec.profile.calcDim(spec, dataset.score.length);

    const rawData = dataset.score[0];

    // Calculate Ticks Numbers Array for Raw
    const rawTicksNumbers = FS.createArithmeticSequence(
      rawSpec.maxValue,
      -rawSpec.maxValue / (rawSpec.ticks.num - 1),
      rawSpec.ticks.num
    ).reverse();

    // Gather Required Info for Raw
    const raw = {
      label: rawData.label,
      mark: rawData.mark,
      zeta: (rawData.mark / rawSpec.maxValue) * rawSpec.circle.totalAngle + rawSpec.circle.angles.start,
      fill: rawSpec.fill,
      opacity: FS.roundTo2(0.5 * (1 + rawData.mark / rawSpec.maxValue)),
      ticks: rawTicksNumbers.map((tick) => ({
        number: tick,
        angle: (tick / rawSpec.maxValue) * rawSpec.circle.totalAngle + rawSpec.circle.angles.start,
      })),
    };

    return [{ raw }];
  }
}

module.exports = DSWLS93;
