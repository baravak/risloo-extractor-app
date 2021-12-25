const { Profile } = require("../Profile");

class BAOMEIS93 extends Profile {
  // Number of pages
  static pages = 1;

  // Labels of the sample
  labels = {
    L1: { eng: "diffusion", fr: "آشفته" },
    L2: { eng: "foreclosure", fr: "زود شکل گرفته" },
    L3: { eng: "moratorium", fr: "تعویق افتاده" },
    L4: { eng: "achievement", fr: "پیشرفته" },
  };

  profileSpec = {
    /* "sample" determines some important info about the sample and profile */
    /* Default prerequisites: 1. gender, 2. age, 3. education */
    /* "prerequisites" is synonym to "fields" in our program */
    sample: {
      name: "پرسشنامه حالات هویت بنیون و آدامز" /* Name of the sample */,
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
          width: 696 + 2 * this.padding.x,
          height: 565.44 + 2 * this.padding.y,
        }
      },
      padding: {
        x: 103,
        y: 0,
      },
    },
    /* "items" is the general term used for independent data elements to be drawn in the profile */
    items: {
      minValue: 16 /* Minimum value of items mark provided by the dataset */,
      maxValue: 96 /* Maximum value of items mark provided by the dataset */,
      offsetX1: 35.5 /* Horizontal offset between first item and left side of the profile */,
      offsetX2: 80 /* Horizontal offset between two consecutive items in the profile */,
      get distanceX() {
        return this.offsetX2 + this.rect.width;
      } /* Horizontal distance between two consecutive items in the profile */,
      thresholdsNumber: {
        offsetX: 8,
        offsetY: 18,
      },
      thresholds: {
        [this.labels.L1.eng]: 52,
        [this.labels.L2.eng]: 52,
        [this.labels.L3.eng]: 62,
        [this.labels.L4.eng]: 72,
      } /* Thresholds for the items marks */,
      ticks: {
        line: {
          width: 600,
        },
        label: {
          offsetX: 18,
        },
      },
      rect: {
        width: 60 /* Width of the items rectangle */,
        base: {
          height: 50 /* Start height of the items base rectangle (corresponding minimum value) */,
          maxHeight: 150 /* Height of the base rectangle between minimum value and threshold */,
          get totalHeight() {
            return this.height + this.maxHeight;
          } /* Total height of the base rectangle */,
          borderRadius: 6 /* Border radius of the base rectangle */,
        },
        body: {
          maxHeight: 260 /* Height of the body rectangle between threshold and maximum value */,
          borderRadius: 8 /* Border radius of the body rectangle */,
          colors: {
            [this.labels.L1.eng]: "#F87171",
            [this.labels.L2.eng]: "#FCD34D",
            [this.labels.L3.eng]: "#93C5FD",
            [this.labels.L4.eng]: "#6EE7B7",
          } /* Colors used for theming items body parts */,
        },
      },
      label: {
        title: {
          offsetY: 40,
        },
        shape: {
          width: 50,
          height: 40.88,
          offsetY: 30,
        },
        colors: {
          [this.labels.L1.eng]: "#EF4444",
          [this.labels.L2.eng]: "#FBBF24",
          [this.labels.L3.eng]: "#3B82F6",
          [this.labels.L4.eng]: "#10B981",
        } /* Colors used for theming labels */,
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

    const { items: itemsSpec } = spec;

    const items = dataset.score.map((data) => ({
      label: data.label,
      mark: data.mark,
      height:
        data.mark > itemsSpec.thresholds[data.label.eng]
          ? ((data.mark - itemsSpec.thresholds[data.label.eng]) /
              (itemsSpec.maxValue - itemsSpec.thresholds[data.label.eng])) *
              itemsSpec.rect.body.maxHeight +
            itemsSpec.rect.base.maxHeight +
            itemsSpec.rect.base.height
          : ((data.mark - itemsSpec.minValue) / (itemsSpec.thresholds[data.label.eng] - itemsSpec.minValue)) *
              itemsSpec.rect.base.maxHeight +
            itemsSpec.rect.base.height,
      exceedThreshold: data.mark > itemsSpec.thresholds[data.label.eng],
      fill: {
        body: itemsSpec.rect.body.colors[data.label.eng],
        label: itemsSpec.label.colors[data.label.eng],
      },
    }));

    return [{ items }];
  }
}

module.exports = BAOMEIS93;
