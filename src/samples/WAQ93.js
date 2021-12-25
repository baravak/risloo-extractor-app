const { Profile, FS } = require("../Profile");

class WAQ93 extends Profile {
  // Number of pages
  static pages = 1;

  // Labels of the sample
  labels = {
    L1: { eng: "raw", fr: "نمره کل" },
    L2: { eng: "relationship_with_god", fr: "خدا" },
    L3: { eng: "relationship_with_self", fr: "خود" },
    L4: { eng: "relationship_with_others", fr: "دیگران" },
    L5: { eng: "relationship_with_wisdom", fr: "دانش و حکمت" },
    L6: { eng: "relationship_with_religion", fr: "دین و مذهب" },
    L7: { eng: "relationship_with_right_and_wrong", fr: "حق و باطل" },
    L8: { eng: "relationship_with_hereafter", fr: "دین و آخرت" },
  };

  profileSpec = {
    /* "sample" determines some important info about the sample and profile */
    /* Default prerequisites: 1. gender, 2. age, 3. education */
    /* "prerequisites" is synonym to "fields" in our program */
    sample: {
      name: "پرسشنامه سنجش عقل میردریکوندی" /* Name of the sample */,
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
          width: 701 + 2 * this.padding.x,
          height: 646 + 2 * this.padding.y,
        }
      },
      padding: {
        x: 0,
        y: 34,
      },
    },
    /* "raw" is the general term used for total data element in the profile */
    raw: {
      maxValue: 900 /* Maximum value of raw mark provided by the dataset */,
      fill: "#334155" /* Color used in the raw element */,
      circle: {
        R: 104.5 /* Radius of the outer circle of the raw element */,
        r: 64.5 /* Radius of the inner circle of the raw element */,
        brs: {
          tl: 8.5 /* Top left border radius */,
          bl: 8.5 /* Bottom left border radius */,
          tr: 8.5 /* Top right border radius */,
          br: 8.5 /* Bottom right border radius */,
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
          offset: 15 /* Offset from the line */,
        },
      },
      label: {
        offsetY: 30,
      },
    },
    /* "items" is the general term used for independent data elements to be drawn in the profile */
    items: {
      offsetX1: 63 /* Horizontal offset between two top items */,
      offsetX2: 70 /* Horizontal offset between two bottom items */,
      offsetY1: 88 /* Vertical offset between items and raw */,
      offsetY2: 70 /* Vertical offset between top and bottom items */,
      get distanceX1() {
        return this.offsetX1 + this.circle.R * 2;
      } /* Horizontal distance between two top items */,
      get distanceX2() {
        return this.offsetX2 + this.circle.R * 2;
      } /* Horizontal distance between two top items */,
      maxValues: {
        [this.labels.L2.eng]: 90,
        [this.labels.L3.eng]: 335,
        [this.labels.L4.eng]: 305,
        [this.labels.L5.eng]: 55,
        [this.labels.L6.eng]: 50,
        [this.labels.L7.eng]: 25,
        [this.labels.L8.eng]: 40,
      } /* Maximum value of items */,
      fills: {
        [this.labels.L2.eng]: "#16A34A",
        [this.labels.L3.eng]: "#F59E0B",
        [this.labels.L4.eng]: "#E11D48",
        [this.labels.L5.eng]: "#C026D3",
        [this.labels.L6.eng]: "#7C3AED",
        [this.labels.L7.eng]: "#14B8A6",
        [this.labels.L8.eng]: "#0EA5E9",
      } /* Color used in items */,
      circle: {
        R: 61.5 /* Radius of the outer circle of the items element */,
        r: 36.5 /* Radius of the inner circle of the items element */,
        brs: {
          tl: 5 /* Top left border radius */,
          bl: 5 /* Bottom left border radius */,
          tr: 5 /* Top right border radius */,
          br: 5 /* Bottom right border radius */,
        } /* Border radiuses at each end of the gauge of the items element */,
        angles: {
          start: FS.toRadians(-90),
          end: FS.toRadians(180),
        } /* Angles of each end of the items element */,
        direction: false /* Clockwise direction for the items gauge element */,
        get totalAngle() {
          return this.direction
            ? 2 * Math.PI - (this.angles.end - this.angles.start)
            : this.angles.end - this.angles.start;
        },
      },
      ticks: {
        num: 2 /* Number of ticks */,
        number: {
          offset: 12 /* Offset from the line */,
        },
      },
      label: {
        offsetY: 20,
      },
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
    const { raw: rawSpec, items: itemsSpec } = spec;

    // Separate Raw Data from the Dataset
    const rawData = dataset.score.shift();

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

    // Calculate Ticks Numbers Object for Items
    const itemsTicksNumbers = Object.fromEntries(
      Object.entries(itemsSpec.maxValues).map((entry) => [
        entry[0],
        FS.createArithmeticSequence(entry[1], -entry[1] / (itemsSpec.ticks.num - 1), itemsSpec.ticks.num).reverse(),
      ])
    );

    // Gather Required Info for Items
    let items = dataset.score.map((data) => ({
      label: data.label,
      mark: data.mark,
      zeta:
        (data.mark / itemsSpec.maxValues[data.label.eng]) * itemsSpec.circle.totalAngle + itemsSpec.circle.angles.start,
      fill: itemsSpec.fills[data.label.eng],
      opacity: FS.roundTo2(0.5 * (1 + data.mark / itemsSpec.maxValues[data.label.eng])),
      ticks: itemsTicksNumbers[data.label.eng].map((tick) => ({
        number: tick,
        angle:
          (tick / itemsSpec.maxValues[data.label.eng]) * itemsSpec.circle.totalAngle + itemsSpec.circle.angles.start,
      })),
    }));

    items = [items.slice(0, 4), items.slice(4)];

    return [{ raw, items }];
  }
}

module.exports = WAQ93;
