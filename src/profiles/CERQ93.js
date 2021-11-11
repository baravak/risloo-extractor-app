import { Profile, FS } from "../profile";

export default class CERQ93 extends Profile {
  profileSpec = {
    /* "test" determines some important info about the test and profile */
    /* Default prerequisites: 1. gender, 2. age, 3. education, 4. marital_status */
    /* "prerequisites" is synonym to "fields" in our program */
    test: {
      name: "پرسشنامه نظم‌جویی شناختی - هیجانی (فرم کوتاه)" /* Name of the test */,
      multiProfile: false /* Whether the test has multiple profiles or not */,
      answers: false /* Determines whether to get answers from inital dataset or not */,
      defaultFields: true /* Determines whether to have default prerequisites in the profile or not */,
      fields:
        [] /* In case you want to get some additional fields and show in the profile */,
    },
    /* "profile" determines the dimensions of the drawn profile (to be used in svg tag viewbox) */
    /* calculating its dimensions carefully is of great importance */
    profile: {
      dimensions:
        {} /* To be calculated in the class with the function provided */,
      calcDim: function (spec, n) {
        return {
          width:
            spec.items.label.rect.width +
            spec.items.offsetX +
            spec.items.maxValue * spec.items.widthCoeff +
            spec.raw.offsetX +
            spec.raw.rect.width +
            spec.raw.ticks.line.offsetX +
            spec.raw.ticks.line.width +
            spec.raw.ticks.number.offsetX +
            20 +
            spec.profile.padding.x * 2,
          height:
            2 * spec.items.ticks.heightOffset +
            spec.items.totalHeights[0] +
            spec.items.offsetY2 +
            spec.items.totalHeights[1] +
            spec.profile.padding.y * 2,
        };
      },
      padding: {
        x: 38,
        y: 0,
      },
    },
    /* "raw" is the general term used for total data element in the profile */
    raw: {
      minValues: [
        10, 8,
      ] /* Minimum values of raw marks provided by the dataset */,
      maxValues: [
        50, 40,
      ] /* Maximum values of raw marks provided by the dataset */,
      offsetX: 110 /* Horizontal offset from items */,
      ticks: {
        num: 2 /* Number of ticks */,
        line: {
          width: 10 /* Width of the tick line */,
          offsetX: 7 /* Horizontal offset from the rectangle */,
        },
        number: {
          offsetX: 4 /* Horizontal Offset from the line */,
        },
      },
      rect: {
        width: 35 /* Width of the raw rectangle */,
        get borderRadius() {
          return this.width / 2;
        } /* Border radius of the raw rectangle */,
      },
      heightCoeff: 5 /* Used for converting mark to the height */,
    },
    /* "items" is the general term used for independent data elements to be drawn in the profile */
    items: {
      minValue: 2 /* Minimum value of items mark provided by the dataset */,
      maxValue: 10 /* Maximum value of items mark provided by the dataset */,
      offsetX: 200 /* Horizontal offset between items and category label rectangle */,
      offsetY1: 10 /* Vertical offset between two consecutive item in the profile */,
      offsetY2: 105 /* Vertical offset between two categories of items */,
      get distanceY() {
        return this.offsetY1 + this.rect.height;
      } /* Distance between two consecutive item in the profile */,
      totalHeights:
        [] /* To be calculated in the class with the function provided */,
      calcTotalHeight: function (n) {
        return this.distanceY * (n - 1) + this.rect.height;
      } /* Method for calculating the total height of items */,
      ticks: {
        num: 5 /* Number of ticks */,
        heightOffset: 45 /* Half length that the ticks lines of items is greater than items total heigth */,
        numberOffset: {
          x: 10 /* Horizontal distance from the line */,
          y: 10 /* Vertical distance from the line */,
        },
      },
      rect: {
        height: 35 /* Height of the items rectangle */,
        get borderRadius() {
          return this.height / 2;
        } /* Border Radius of the items rectangle */,
        colors: [
          "#047857",
          "#EF4444",
        ] /* Colors used for theming items body parts */,
        opacityMapping: {
          "9-10": 1,
          "7-8": 0.9,
          "5-6": 0.8,
          "3-4": 0.7,
          2: 0.6,
        } /* Opacity mapping for marks */,
      },
      widthCoeff: 40 /* Used for converting mark to the width */,
      label: {
        offsetX: 10 /* Horizontal offset of label from item */,
        rect: {
          width: 42 /* Width of the category label rectangle of the items */,
          borderRadius: 5 /* Border radius of the category label rectangle of the items */,
        },
        colors: [
          "#369379",
          "#F26969",
        ] /* Colors used for theming items label rectangle */,
      },
    },
    /* "labels" part which has to be provided for each profile */
    labels: {
      acceptance: { fr: "پذیرش" },
      positive_refocusing: { fr: "تمرکز مجدد مثبت" },
      refocusing_on_planing: { fr: "تمرکز مجدد برنامه‌ریزی" },
      positive_reappraisal: { fr: "ارزیابی مجدد مثبت" },
      putting_to_perspective: { fr: "دیدگاه‌گیری" },
      self_blame: { fr: "ملامت خویش" },
      rumination: { fr: "نشخوارگی" },
      catastrophizing: { fr: "فاجعه‌سازی" },
      other_blame: { fr: "ملامت دیگران" },
      adaptive_regulation: { fr: "نظم‌جویی انطباقی" },
      unadaptive_regulation: { fr: "نظم‌جویی غیرانطباقی" },
    },
  };

  constructor(dataset, profileVariant, config = {}) {
    super();
    this._init(dataset, profileVariant, config);
  }

  _calcContext() {
    const {
      spec: { parameters: spec },
      dataset,
    } = this;

    const { raw: rawSpec, items: itemsSpec } = spec;

    // Remove Last Two Element to Separate Raw Dataset
    const rawDataset = dataset.score.splice(-2, 2);

    // Categorize Items Dataset
    const itemsDatasets = [dataset.score.slice(0, 5), dataset.score.slice(5)];

    // ّInit Spec
    spec.items.totalHeights = itemsDatasets.map((dataset) =>
      spec.items.calcTotalHeight(dataset.length)
    );
    spec.profile.dimensions = spec.profile.calcDim(spec, dataset.score.length);

    // Gather Required Info for Raw
    const raw = rawDataset.map((data) => ({
      label: data.label,
      mark: data.mark,
      height: data.mark * rawSpec.heightCoeff,
    }));

    // Calculate Ticks Numbers Array for Raw
    const rawTicksNumbers = [];
    for (let i = 0; i < raw.length; i++)
      rawTicksNumbers.push(
        FS.createArithmeticSequence(
          rawSpec.minValues[i],
          (rawSpec.maxValues[i] - rawSpec.minValues[i]) /
            (rawSpec.ticks.num - 1),
          rawSpec.ticks.num
        )
      );

    // Gather Required Info for Raw Ticks
    const rawTicks = rawTicksNumbers.map((ticks) =>
      ticks.map((tick) => ({
        number: tick,
        bottomPos: tick * rawSpec.heightCoeff,
      }))
    );

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

    return { raw, items, rawTicks, itemsTicks };
  }
}
