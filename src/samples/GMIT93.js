const { Profile, FS, Mappings } = require("../Profile");

class GMIT93 extends Profile {
  // Number of pages
  static pages = 1;

  // Labels of the sample
  labels = {
    L1: { eng: "linguistic", fr: "زبانی - کلامی" },
    L2: { eng: "logical_mathematical", fr: "منطقی - ریاضی" },
    L3: { eng: "visual_spatial", fr: "دیداری - فضایی" },
    L4: { eng: "bodily_kinesthetic", fr: "بدنی - جنبشی" },
    L5: { eng: "interpersonal", fr: "میان‌فردی" },
    L6: { eng: "intrapersonal", fr: "درون‌فردی" },
    L7: { eng: "musical", fr: "موسیقیایی" },
    L8: { eng: "naturalist", fr: "طبیعت‌گرا" },
  };

  profileSpec = {
    /* "sample" determines some important info about the sample and profile */
    /* Default prerequisites: 1. gender, 2. age, 3. education */
    /* "prerequisites" is synonym to "fields" in our program */
    sample: {
      name: "پرسشنامه هوش‌های چندگانه گاردنر" /* Name of the sample */,
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
          width: 634 + 2 * this.padding.x,
          height: 610 + 2 * this.padding.y,
        };
      },
      padding: {
        x: 0,
        y: 52,
      },
    },
    /* "items" is the general term used for independent data elements to be drawn in the profile */
    items: {
      minValue: 10 /* Minimum value of items mark provided by the dataset */,
      maxValue: 50 /* Maximum value of items mark provided by the dataset */,
      offsetX: 134 /* Horizontal offset between items and left side of profile */,
      offsetY: 30 /* Vertical offset between two consecutive item in the profile */,
      get distanceY() {
        return this.offsetY + this.rect.height;
      } /* Distance between two consecutive item in the profile */,
      totalHeight: "" /* To be calculated in the class with the function provided */,
      calcTotalHeight: function (n) {
        return this.distanceY * (n - 1) + this.rect.height;
      } /* Method for calculating the total height of items */,
      ticks: {
        num: 5 /* Number of ticks */,
        heightOffset: 40 /* Half length that the ticks lines of items is greater than items total heigth */,
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
        colors: [
          "#8B5CF6",
          "#EC4899",
          "#10B981",
          "#F59E0B",
          "#007BA4",
          "#F43F5E",
          "#71717A",
          "#047857",
        ] /* Colors used for theming items body parts */,
        opacityMappings: new Mappings()
          .addMapping("10-19", 0.7)
          .addMapping("20-29", 0.8)
          .addMapping("30-39", 0.9)
          .addMapping("40-50", 1) /* Opacity mapping for marks */,
      },
      widthCoeff: 10 /* Used for converting mark to the width */,
      label: {
        offsetX: 20 /* Horizontal offset of label from item */,
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

    const { items: itemsSpec } = spec;

    // ّInit Spec
    spec.items.totalHeight = spec.items.calcTotalHeight(dataset.score.length);

    // Gather Required Info for Items
    const items = dataset.score.map((data, index) => ({
      label: data.label,
      mark: data.mark,
      width: data.mark * itemsSpec.widthCoeff,
      fill: itemsSpec.rect.colors[index],
      opacity: itemsSpec.rect.opacityMappings.map(data.mark),
    }));

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

    return [
      {
        items,
        itemsTicks,
      },
    ];
  }
}

module.exports = GMIT93;
