const { Profile, FS } = require("../profile");

class PIES93 extends Profile {
  profileSpec = {
    /* "test" determines some important info about the test and profile */
    /* Default prerequisites: 1. gender, 2. age, 3. education */
    /* "prerequisites" is synonym to "fields" in our program */
    test: {
      name: "پرسشنامه سیاهه روانی - اجتماعی نیرومندی من ۳۲ سؤالی" /* Name of the test */,
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
            spec.items.base.rect.width +
            spec.items.body.rect.maxWidth +
            spec.raw.offsetX +
            spec.raw.rect.width +
            spec.raw.ticks.line.offsetX +
            spec.raw.ticks.line.width +
            spec.raw.ticks.number.offsetX +
            12 +
            spec.profile.padding.x * 2,
          height: spec.items.calcTotalHeight(n) + spec.items.ticks.heightOffset * 2 + spec.profile.padding.y * 2,
        };
      },
      padding: {
        x: 40,
        y: 0,
      },
    },
    /* "raw" is the general term used for total data element in the profile */
    raw: {
      maxValue: 160 /* Maximum value of raw mark provided by the dataset */,
      offsetX: 120 /* Horizontal offset from items */,
      ticks: {
        num: 4 /* Number of ticks */,
        line: {
          width: 9 /* Width of the tick line */,
          offsetX: 5 /* Horizontal offset from the rectangle */,
        },
        number: {
          offsetX: 15 /* Horizontal Offset from the line */,
        },
      },
      rect: {
        width: 40 /* Width of the raw rectangle */,
        height: 610 /* Height of the raw rectangle */,
        get borderRadius() {
          return this.width / 2;
        } /* Border radius of the raw rectangle */,
      },
      label: {
        circle: {
          radius: 18 /* Radius of the circle in the label part */,
        },
        offsetY: 40 /* Vertical offset of the label from the circle */,
      },
      heightCoeff: 3.81 /* Used for converting mark to the height */,
    },
    /* "items" is the general term used for independent data elements to be drawn in the profile */
    items: {
      maxValue: 20 /* Maximum value of items mark provided by the dataset */,
      offsetY: 30 /* Offset between two consecutive item in the profile */,
      get distanceY() {
        return this.offsetY + this.base.rect.height;
      } /* Distance between two consecutive item in the profile */,
      totalHeight: "" /* To be calculated in the class with the function provided */,
      calcTotalHeight: function (n) {
        return this.distanceY * (n - 1) + this.base.rect.height;
      } /* Method for calculating the total height of items */,
      ticks: {
        num: 4 /* Number of ticks */,
        heightOffset: 40 /* Half length that the ticks lines of items is greater than items total heigth */,
        numberOffset: {
          x: 15 /* Horizontal distance from the line */,
          y: 10 /* Vertical distance from the line */,
        },
      },
      body: {
        rect: {
          maxWidth: 400 /* Max width of the body part of items */,
          brs: {
            tl: 0 /* Top left border radius */,
            bl: 0 /* Bottom left border radius */,
            tr: 20 /* Top right border radius */,
            br: 20 /* Bottom right border radius */,
          } /* Border radiuses of the base rectangle */,
        },
        colors: [
          "#8B5CF6",
          "#EC4899",
          "#10B981",
          "#F59E0B",
          "#007BA4",
          "#EF4444",
          "#6B7280",
          "#047857",
        ] /* Colors used for theming items body parts */,
        opacityMapping: {
          20: 1,
          "16-19": 0.9,
          "11-15": 0.8,
          "6-10": 0.7,
          "1-5": 0.6,
        } /* Opacity mapping for marks */,
      },
      base: {
        rect: {
          width: 220 /* Width of the items rectangle (base part) */,
          height: 40 /* Height of the items rectangle (base part) */,
          brs: {
            tl: 20 /* Top left border radius */,
            bl: 20 /* Bottom left border radius */,
            tr: 0 /* Top right border radius */,
            br: 0 /* Bottom right border radius */,
          } /* Border radiuses of the base rectangle */,
        },
        label: {
          circle: {
            radius: 18 /* Radius of the circle in the label part */,
          },
          offsetX: 40 /* Horizontal offset of the label from the circle */,
        },
        colors: [
          "#A27DF8",
          "#F06DAD",
          "#40C79A",
          "#F7B13C",
          "#3395B6",
          "#F26969",
          "#898E99",
          "#369379",
        ] /* Colors used for theming items base parts */,
      },
    },
    /* "labels" part which has to be provided for each profile */
    labels: {
      hope: {
        abbr: "HO",
        fr: "امید",
      },
      will: {
        abbr: "W",
        fr: "اراده (خواسته)",
      },
      purpose: {
        abbr: "PU",
        fr: "هدف‌مندی",
      },
      competence: {
        abbr: "CO",
        fr: "شایستگی",
      },
      fidelity: {
        abbr: "FI",
        fr: "صداقت (وفاداری)",
      },
      love: {
        abbr: "LO",
        fr: "عشق",
      },
      care: {
        abbr: "CA",
        fr: "مراقبت",
      },
      wisdom: {
        abbr: "WI",
        fr: "خرد (فرزانگی)",
      },
      raw: {
        abbr: "#",
        fr: "نمره کل",
      },
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

    // Deconstructing the Spec of the Profile
    const { raw: rawSpec, items: itemsSpec } = spec;

    // Separate Raw Data from the Dataset
    const rawData = dataset.score.pop();

    // ّInit Spec (Do Not Forget To Separate Raw)
    spec.profile.dimensions = spec.profile.calcDim(spec, dataset.score.length);
    spec.items.totalHeight = spec.items.calcTotalHeight(dataset.score.length);

    // Gather Required Info for Raw
    const raw = {
      label: rawData.label,
      mark: rawData.mark,
      height: (rawData.mark / rawSpec.maxValue) * rawSpec.rect.height,
    };

    // Gather Required Info for Items
    const items = dataset.score.map((data, index) => ({
      label: data.label,
      width: (data.mark / itemsSpec.maxValue) * itemsSpec.body.rect.maxWidth,
      mark: data.mark,
      baseColor: itemsSpec.base.colors[index],
      body: {
        color: itemsSpec.body.colors[index],
        opacity: FS.mapInRange(data.mark, itemsSpec.body.opacityMapping),
      },
    }));

    // Calculate Ticks Numbers Array for Raw
    const rawTicksNumbers = FS.createArithmeticSequence(
      rawSpec.maxValue,
      -rawSpec.maxValue / rawSpec.ticks.num,
      rawSpec.ticks.num
    ).reverse();

    // Gather Required Info for Raw Ticks
    const rawTicks = rawTicksNumbers.map((tick) => ({
      number: tick,
      bottomPos: (tick / rawSpec.maxValue) * rawSpec.rect.height,
    }));

    // Calculate Ticks Numbers Array for Items
    const itemsTicksNumbers = FS.createArithmeticSequence(
      itemsSpec.maxValue,
      -itemsSpec.maxValue / itemsSpec.ticks.num,
      itemsSpec.ticks.num
    ).reverse();

    // Gather Required Info for Items Ticks
    const itemsTicks = itemsTicksNumbers.map((tick) => ({
      number: tick,
      leftPos: (tick / itemsSpec.maxValue) * itemsSpec.body.rect.maxWidth,
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

module.exports = PIES93;
