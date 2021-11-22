const { Profile, FS } = require("../profile");

class SDCAQ93 extends Profile {
  profileSpec = {
    /* "test" determines some important info about the test and profile */
    /* Default prerequisites: 1. gender, 2. age, 3. education */
    /* "prerequisites" is synonym to "fields" in our program */
    test: {
      name: "پرسشنامه اجتناب شناختی سکستون وداگاس" /* Name of the test */,
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
            spec.items.offsetX +
            spec.items.maxValue * spec.items.widthCoeff +
            spec.raw.offsetX +
            spec.raw.rect.width +
            spec.raw.ticks.line.offsetX +
            spec.raw.ticks.line.width +
            spec.raw.ticks.number.offsetX +
            23 +
            spec.profile.padding.x * 2,
          height: spec.items.totalHeight + 2 * spec.items.ticks.heightOffset + spec.profile.padding.y * 2,
        };
      },
      padding: {
        x: 35,
        y: 15,
      },
    },
    /* "raw" is the general term used for total data element in the profile */
    raw: {
      minValue: 25 /* Minimum values of raw marks provided by the dataset */,
      maxValue: 125 /* Maximum values of raw marks provided by the dataset */,
      offsetX: 110 /* Horizontal offset from items */,
      ticks: {
        num: 5 /* Number of ticks */,
        line: {
          width: 10 /* Width of the tick line */,
          offsetX: 7 /* Horizontal offset from the rectangle */,
        },
        number: {
          offsetX: 4 /* Horizontal Offset from the line */,
        },
      },
      rect: {
        width: 50 /* Width of the raw rectangle */,
        get borderRadius() {
          return this.width / 2;
        } /* Border radius of the raw rectangle */,
      },
      heightCoeff: 4 /* Used for converting mark to the height */,
    },
    /* "items" is the general term used for independent data elements to be drawn in the profile */
    items: {
      minValue: 5 /* Minimum value of items mark provided by the dataset */,
      maxValue: 25 /* Maximum value of items mark provided by the dataset */,
      offsetX: 228 /* Horizontal offset between items and left side of profile */,
      offsetY: 40 /* Vertical offset between two consecutive item in the profile */,
      get distanceY() {
        return this.offsetY + this.rect.height;
      } /* Distance between two consecutive item in the profile */,
      totalHeight: "" /* To be calculated in the class with the function provided */,
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
        height: 50 /* Height of the items rectangle */,
        get borderRadius() {
          return this.height / 2;
        } /* Border Radius of the items rectangle */,
        colors: ["#A78BFA", "#10B981", "#EC4899", "#F59E0B", "#007BA4"] /* Colors used for theming items body parts */,
      },
      widthCoeff: 16 /* Used for converting mark to the width */,
      label: {
        offsetX: 10 /* Horizontal offset of label from item */,
        offsetY: 13 /* Half vertical offset between two lines of label */,
      },
    },
    /* "labels" part which has to be provided for each profile */
    labels: {
      thought_suppression: { fr: "واپس زنی\nافکار نگران‌کننده" },
      thought_substitution: {
        fr: "جانشینی افکار مثبت\nبه جای افکار نگران‌کننده",
      },
      distraction_subscale: {
        fr: "استفاده از توجه برگردانی\nبرای قطع روند نگرانی (حواس‌پرتی)",
      },
      avoidance_of_threatening_stimuli: {
        fr: "اجتناب از موقعیت‌ها و فعالیت‌های\nفعال‌ساز افکار نگران‌کننده",
      },
      transformation_of_images_into_thoughts: {
        fr: "تغییر تصاویر ذهنی\nبه افکار کلامی",
      },
      raw: { fr: "نمره کل" },
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

    const { raw: rawSpec, items: itemsSpec } = spec;

    // Separate Raw Data from the Dataset
    const rawData = dataset.score.pop();

    // ّInit Spec
    spec.items.totalHeight = spec.items.calcTotalHeight(dataset.score.length);
    spec.profile.dimensions = spec.profile.calcDim(spec, dataset.score.length);

    // Gather Required Info for Raw
    const raw = {
      label: rawData.label,
      mark: rawData.mark,
      height: rawData.mark * rawSpec.heightCoeff,
    };

    // Gather Required Info for Items
    const items = dataset.score.map((data, index) => ({
      label: data.label,
      mark: data.mark,
      width: data.mark * itemsSpec.widthCoeff,
      fill: itemsSpec.rect.colors[index],
    }));

    // Calculate Ticks Numbers Array for Raw
    const rawTicksNumbers = FS.createArithmeticSequence(
      rawSpec.minValue,
      (rawSpec.maxValue - rawSpec.minValue) / (rawSpec.ticks.num - 1),
      rawSpec.ticks.num
    );

    // Gather Required Info for Raw Ticks
    const rawTicks = rawTicksNumbers.map((tick) => ({
      number: tick,
      bottomPos: tick * rawSpec.heightCoeff,
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
        raw,
        items,
        rawTicks,
        itemsTicks,
      },
    ];
  }
}

module.exports = SDCAQ93;
