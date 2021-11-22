const { Profile, FS } = require("../profile");

class AMS93 extends Profile {
  profileSpec = {
    /* "test" determines some important info about the test and profile */
    /* Default prerequisites: 1. gender, 2. age, 3. education */
    /* "prerequisites" is synonym to "fields" in our program */
    test: {
      name: "پرسشنامه انگیزش تحصیلی والراند" /* Name of the test */,
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
          width:
            spec.items.label.rect.width +
            spec.items.offsetX +
            spec.items.maxValue * spec.items.widthCoeff +
            spec.profile.padding.x * 2,
          height:
            2 * spec.items.ticks.heightOffset +
            spec.items.totalHeights[0] +
            spec.items.offsetY2 +
            spec.items.totalHeights[1] +
            spec.items.offsetY2 +
            spec.items.totalHeights[2] +
            spec.profile.padding.y * 2,
        };
      },
      padding: {
        x: 0,
        y: 93,
      },
    },
    /* "items" is the general term used for independent data elements to be drawn in the profile */
    items: {
      minValue: 4 /* Minimum value of items mark provided by the dataset */,
      maxValue: 28 /* Maximum value of items mark provided by the dataset */,
      offsetX: 200 /* Horizontal offset between items and category label rectangle */,
      offsetY1: 10 /* Vertical offset between two consecutive item in the profile */,
      offsetY2: 60 /* Vertical offset between two categories of items */,
      get distanceY() {
        return this.offsetY1 + this.rect.height;
      } /* Distance between two consecutive item in the profile */,
      totalHeights: [] /* To be calculated in the class with the function provided */,
      calcTotalHeight: function (n) {
        return this.distanceY * (n - 1) + this.rect.height;
      } /* Method for calculating the total height of items */,
      ticks: {
        num: 4 /* Number of ticks */,
        heightOffset: 45 /* Half length that the ticks lines of items is greater than items total heigth */,
        numberOffset: {
          x: 10 /* Horizontal distance from the line */,
          y: 10 /* Vertical distance from the line */,
        },
      },
      rect: {
        height: 40 /* Height of the items rectangle */,
        get borderRadius() {
          return this.height / 2;
        } /* Border Radius of the items rectangle */,
        colors: ["#8B5CF6", "#EC4899", "#71717A"] /* Colors used for theming items body parts */,
        opacityMapping: {
          28: 1,
          "21-27": 0.9,
          "13-20": 0.8,
          "5-12": 0.7,
          4: 0.6,
        } /* Opacity mapping for marks */,
      },
      widthCoeff: 15 /* Used for converting mark to the width */,
      label: {
        offsetX: 10 /* Horizontal offset of label from item */,
        rect: {
          width: 42 /* Width of the category label rectangle of the items */,
          borderRadius: 5 /* Border radius of the category label rectangle of the items */,
        },
        colors: ["#A27DF8", "#F06DAD", "#898E99"] /* Colors used for theming items label rectangle */,
      },
    },
    /* "labels" part which has to be provided for each profile */
    labels: {
      intrinsic_motivation_to_know: { fr: "برای فهمیدن" },
      intrinsic_motivation_toward_accomplishment: { fr: "پیشرفت" },
      intrinsic_motivation_to_experience_stimulation: {
        fr: "برای تجربه تحریک",
      },
      extrinsic_motivation_identified: { fr: "تنظیم همانند شده" },
      extrinsic_motivation_introjected: { fr: "تنظیم تزریقی" },
      extrinsic_motivation_external_regulation: { fr: "تنظیم بیرونی" },
      unmotivation: { fr: "بی‌انگیزگی" },
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

    const { items: itemsSpec } = spec;

    // Categorize Items Dataset
    const itemsDatasets = [dataset.score.slice(0, 3), dataset.score.slice(3, 6), dataset.score.slice(6)];

    // ّInit Spec
    spec.items.totalHeights = itemsDatasets.map((dataset) => spec.items.calcTotalHeight(dataset.length));
    spec.profile.dimensions = spec.profile.calcDim(spec, dataset.score.length);

    // Gather Required Info for Items
    const items = itemsDatasets.map((dataset, datasetIndex) =>
      dataset.map((data) => ({
        label: data.label,
        mark: data.mark,
        width: data.mark * itemsSpec.widthCoeff,
        fill: itemsSpec.rect.colors[datasetIndex],
        opacity: FS.mapInRange(data.mark, itemsSpec.rect.opacityMapping),
      }))
    );

    // Calculate Ticks Numbers Array for Items
    const itemsTicksNumbers = FS.createArithmeticSequence(
      itemsSpec.minValue,
      (itemsSpec.maxValue - itemsSpec.minValue) / (itemsSpec.ticks.num - 1),
      itemsSpec.ticks.num
    );

    // Gather Required Info for Items Ticks
    const itemsTicks = itemsTicksNumbers.map((tick) => ({
      number: tick,
      leftPos: tick * itemsSpec.widthCoeff,
    }));

    return [{ items, itemsTicks }];
  }
}

module.exports = AMS93;
