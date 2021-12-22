const { Profile } = require("../Profile");

class MOCI93 extends Profile {
  // Number of pages
  static pages = 1;

  // Labels of the sample
  labels = {
    L1: { eng: "washing", fr: "شستشو", abbr: "W" },
    L2: { eng: "control", fr: "وارسی", abbr: "C" },
    L3: { eng: "slowing_repeat", fr: "کندی - تکرار", abbr: "SR" },
    L4: { eng: "doubt", fr: "تردید", abbr: "D" },
    L5: { eng: "total", fr: "نمره کل", abbr: "T" },
  };

  profileSpec = {
    /* "sample" determines some important info about the sample and profile */
    /* Default prerequisites: 1. gender, 2. age, 3. education */
    /* "prerequisites" is synonym to "fields" in our program */
    sample: {
      name: "مقیاس وسواس فکری - علمی مادزلی" /* Name of the sample */,
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
          width: spec.items.distanceX * (n - 2) + spec.raw.distanceX + spec.raw.rect.width + spec.profile.padding.x * 2,
          height:
            (spec.raw.maxValue / spec.raw.step) * spec.raw.rect.distanceY -
            spec.raw.rect.offsetY +
            108 +
            spec.profile.padding.y * 2,
        };
      },
      padding: {
        x: 15,
        y: 50,
      },
    },
    /* "raw" is the general term used for total data element in the profile */
    raw: {
      offsetX: 110 /* Horizontal offset between raw and last item */,
      get distanceX() {
        return this.offsetX + this.rect.width;
      } /* Horizontal distance between raw and last item */,
      rect: {
        width: 60 /* Width of the raw rectangle */,
        height: 30 /* Height of the raw rectangle */,
        offsetY: 2 /* Vertical offset between two consecutive raw rectangles */,
        get distanceY() {
          return this.height + this.offsetY;
        } /* Vertical Distance between two consecutive raw rectangles */,
        defaultColor: "#F3F4F6" /* Default color of the raw rectangle */,
        color: "#831843" /* Focused color of the raw rectangle */,
      },
      maxValue: 30 /* Maximum value of raw mark provided by the dataset */,
      step: 2 /* Step is used to divide the mark in drawing the profile */,
    },
    /* "items" is the general term used for independent data elements to be drawn in the profile */
    items: {
      offsetX: 80 /* Horizontal offset between two consecutive item */,
      get distanceX() {
        return this.offsetX + this.rect.width;
      } /* Horizontal distance between two consecutive item */,
      rect: {
        width: 50 /* Width of the items rectangle */,
        height: 30 /* Height of the items rectangle */,
        offsetY: 2 /* Vertical offset between two consecutive items rectangle */,
        get distanceY() {
          return this.height + this.offsetY;
        } /* Vertical distance between two consecutive items rectangle */,
        defaultColor: "#F3F4F6" /* Default color of the items rectangle */,
        colors: ["#4C1D95", "#1E3A8A", "#374151", "#92400E"] /* Colors used for theming items */,
      },
      maxValues: {
        [this.labels.L1.eng]: 11,
        [this.labels.L2.eng]: 9,
        [this.labels.L3.eng]: 7,
        [this.labels.L4.eng]: 7,
      } /* Maximum values of items marks provided by the dataset */,
      step: 1 /* Step is used to divide the mark in drawing the profile */,
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
    const {
      items: {
        maxValues,
        rect: { colors },
      },
    } = spec;

    // ّInit Spec
    spec.profile.dimensions = spec.profile.calcDim(spec, dataset.score.length);

    // Separate Raw Data from the Dataset
    const rawData = dataset.score.pop();

    // Gather Required Info for Raw
    const raw = {
      label: rawData.label,
      mark: rawData.mark,
    };

    // Gather Required Info for Items
    const items = dataset.score.map((data, index) => ({
      label: data.label,
      mark: data.mark,
      maxValue: maxValues[data.label.eng],
      fill: colors[index],
    }));

    return [{ items, raw }];
  }
}

module.exports = MOCI93;
