const { Profile, FS } = require("../Profile");

class RAS93 extends Profile {
  // Number of pages
  static pages = 1;

  // Labels of the sample
  labels = {
    L1: { eng: "raw", fr: "کل" },
  };

  profileSpec = {
    /* "sample" determines some important info about the sample and profile */
    /* Default prerequisites: 1. gender, 2. age, 3. education */
    /* "prerequisites" is synonym to "fields" in our program */
    sample: {
      name: "مقیاس نگرش مسئولیت‌پذیری" /* Name of the sample */,
      multiProfile: false /* Whether the sample has multiple profiles or not */,
      questions: false /* Determines whether to get questions from inital dataset or not */,
      defaultFields: true /* Determines whether to have default prerequisites in the profile or not */,
      fields: [] /* In case you want to get some additional fields and show in the profile */,
    },
    /* "profile" determines the dimensions of the drawn profile (to be used in svg tag viewbox) */
    /* calculating its dimensions carefully is of great importance */
    profile: {
      get dimensions() {
        return {
          width: 730 + 2 * this.padding.x,
          height: 404.5 + 2 * this.padding.y,
        }
      },
      padding: {
        x: 80,
        y: 0,
      },
    },
    /* "item" is the general term used for independent data element to be drawn in the profile */
    item: {
      minValue: 0 /* Minimum value of the item mark */,
      maxValue: 182 /* Maximum value of the item mark */,
      stops: [0, 182] /* Stops array of the item mark */,
      circle: {
        center: {
          radius: 42.5 /* Radius of the central circle */,
        },
        main: {
          R: 340 /* Radius of the outer circle of the item element */,
          r: 290 /* Radius of the inner circle of the item element */,
          brs: {
            tl: 0 /* Top left border radius */,
            bl: 0 /* Bottom left border radius */,
            tr: 0 /* Top right border radius */,
            br: 0 /* Bottom right border radius */,
          } /* Border radiuses at each end of the gauge of the item element */,
          angles: {
            start: FS.toRadians(-180),
            end: FS.toRadians(0),
          } /* Angles of each end of the item element */,
          direction: false /* Clockwise direction for the item gauge element */,
          base: {
            fill: "#F4F4F5" /* Fill of the base part of the item gauge */,
            stroke: "#E4E4E7" /* Stroke of the base part of the item gauge */,
          },
          body: {
            fill: "#DB2777" /* Fill of the body part of the item gauge */,
            stroke: "#9D174D" /* Stroke of the base part of the item gauge */,
          },
        },
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

    const { item: itemSpec } = spec;

    const itemData = dataset.score[0];
    const item = {
      label: itemData.label,
      mark: itemData.mark,
      angle: this._markToAngle(
        itemData.mark,
        itemSpec.minValue,
        itemSpec.maxValue,
        itemSpec.circle.main.angles,
        itemSpec.circle.main.direction
      ),
      stops: itemSpec.stops.map((stop) => ({
        mark: stop,
        angle: this._markToAngle(
          stop,
          itemSpec.minValue,
          itemSpec.maxValue,
          itemSpec.circle.main.angles,
          itemSpec.circle.main.direction
        ),
      })),
    };

    return [{ item }];
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

module.exports = RAS93;
