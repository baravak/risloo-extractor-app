const { Profile, FS, Mappings } = require("../Profile");

class LMIQ93 extends Profile {
  // Number of pages
  static pages = 1;

  // Labels of the sample
  labels = {
    L1: { eng: "1", fr: "عمل کردن مبتنی بر اصول، ارزش‌ها و باورها" },
    L2: { eng: "2", fr: "راستگویی" },
    L3: { eng: "3", fr: "استقامت و پافشاری برای حق" },
    L4: { eng: "4", fr: "وفای به عهد" },
    L5: { eng: "5", fr: "مسئولیت‌پذیری برای تصمیمات شخصی" },
    L6: { eng: "6", fr: "اقرار به اشتباهات و شکست‌ها" },
    L7: { eng: "7", fr: "قبول مسئولیت برای خدمت به دیگران" },
    L8: { eng: "8", fr: "فعالانه علاقه‌مند بودن به دیگران" },
    L9: { eng: "9", fr: "توانایی در بخشش اشتباهات خود" },
    L10: { eng: "10", fr: "توانایی در بخشش اشتباهات دیگران" },
    L11: { eng: "normalized_honesty", fr: "درستکاری" },
    L12: { eng: "normalized_responsibility", fr: "مسئولیت‌پذیری" },
    L13: { eng: "normalized_forgiveness", fr: "بخشش" },
    L14: { eng: "normalized_emphaty", fr: "همدلی" },
    L15: { eng: "honesty", fr: "درستکاری" },
    L16: { eng: "responsibility", fr: "مسئولیت‌پذیری" },
    L17: { eng: "forgiveness", fr: "بخشش" },
    L18: { eng: "emphaty", fr: "همدلی" },
    L19: { eng: "raw", fr: "توانایی در بخشش اشتباهات دیگران" },
  };

  profileSpec = {
    /* "sample" determines some important info about the sample and profile */
    /* Default prerequisites: 1. gender, 2. age, 3. education */
    /* "prerequisites" is synonym to "fields" in our program */
    sample: {
      name: "پرسشنامه هوش اخلاقی" /* Name of the sample */,
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
          width: 835 + 2 * this.padding.x,
          height: 597 + 2 * this.padding.y,
        };
      },
      padding: {
        x: 35,
        y: 0,
      },
    },
    /* "raw" is the general term used for total data element in the profile */
    raw: {
      minValue: 40 /* Minimum values of raw marks provided by the dataset */,
      maxValue: 200 /* Maximum values of raw marks provided by the dataset */,
      offsetX: 120 /* Horizontal offset from items */,
      ticks: {
        arr: [40, 200],
        line: {
          width: 10 /* Width of the tick line */,
          offsetX: 7 /* Horizontal offset from the rectangle */,
        },
        number: {
          offsetX: 3 /* Horizontal Offset from the line */,
        },
      },
      rect: {
        width: 35 /* Width of the raw rectangle */,
        get borderRadius() {
          return this.width / 2;
        } /* Border radius of the raw rectangle */,
      },
      heightCoeff: 2 /* Used for converting mark to the height */,
    },
    /* "items" is the general term used for independent data elements to be drawn in the profile */
    items: {
      minValue: 4 /* Minimum value of items mark provided by the dataset */,
      maxValue: 20 /* Maximum value of items mark provided by the dataset */,
      overallMarksMaxValues: [80, 60, 40, 20],
      offsetX: 240 /* Horizontal offset between items and left side of profile */,
      offsetY1: 8 /* Vertical offset between two consecutive item in the profile */,
      offsetY2: 32 /* Vertical offset between two categories of items */,
      get distanceY() {
        return this.offsetY1 + this.rect.height;
      } /* Distance between two consecutive item in the profile */,
      totalHeights: [] /* To be calculated in the class with the function provided */,
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
        height: 30 /* Height of the items rectangle */,
        get borderRadius() {
          return this.height / 2;
        } /* Border Radius of the items rectangle */,
        colors: ["#8B5CF6", "#EC4899"] /* Colors used for theming items body parts */,
        opacityMappings: new Mappings()
          .addMapping("4-7", 0.7)
          .addMapping("8-11", 0.8)
          .addMapping("12-15", 0.9)
          .addMapping("16-20", 1) /* Opacity mapping for marks */,
      },
      widthCoeff: 20 /* Used for converting mark to the width */,
      label: {
        offsetX: 9 /* Horizontal offset of label from item */,
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

    const { items: itemsSpec, raw: rawSpec } = spec;

    // Remove Last Element to Separate Raw Data
    const rawData = dataset.score.pop();

    // Categorize Items Dataset
    const itemsDatasets = [dataset.score.slice(0, 10), dataset.score.slice(10, 14)];
    const overallData = dataset.score.slice(14);

    // ّInit Spec
    spec.items.totalHeights = itemsDatasets.map((dataset) => spec.items.calcTotalHeight(dataset.length));

    // Gather Required Info for Items
    const items = itemsDatasets.map((dataset, datasetIndex) =>
      dataset.map((data, index) => ({
        label: data.label,
        mark: data.mark,
        ...(datasetIndex === 1 && {
          overallMark: { mark: overallData[index].mark, maxValue: itemsSpec.overallMarksMaxValues[index] },
        }),
        width: data.mark * itemsSpec.widthCoeff,
        fill: itemsSpec.rect.colors[datasetIndex],
        opacity: itemsSpec.rect.opacityMappings.map(data.mark),
      }))
    );

    const raw = {
      label: rawData.label,
      mark: rawData.mark,
      height: rawData.mark * rawSpec.heightCoeff,
    };

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

    // Gather Required Info for Raw Ticks
    const rawTicks = rawSpec.ticks.arr.map((tick) => ({
      number: tick,
      bottomPos: tick * rawSpec.heightCoeff,
    }));

    return [{ items, itemsTicks, raw, rawTicks }];
  }
}

module.exports = LMIQ93;
