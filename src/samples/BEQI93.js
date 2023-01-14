const { Profile, FS, Mappings } = require("../Profile");

class BEQI93 extends Profile {
  // Number of pages
  static pages = 1;

  // Labels of the sample
  labels = {
    L1: { eng: "independence", fr: "استقلال" },
    L2: { eng: "self_actualize", fr: "خودشکوفایی" },
    L3: { eng: "assertiveness", fr: "خودابرازی" },
    L4: { eng: "self_regard", fr: "احترام به خود" },
    L5: { eng: "emotional_self_awareness", fr: "خودآگاهی هیجانی" },
    L6: { eng: "responsibility", fr: "مسئولیت‌پذیری اجتماعی" },
    L7: { eng: "interpersonal_relationship", fr: "روابط بین فردی" },
    L8: { eng: "empathy", fr: "همدلی" },
    L9: { eng: "problem_solving", fr: "حل مسئله" },
    L10: { eng: "reality_testing", fr: "واقع‌گرایی" },
    L11: { eng: "flexibility", fr: "انعطاف‌پذیری" },
    L12: { eng: "happiness", fr: "شادمانی" },
    L13: { eng: "optimism", fr: "خوش‌بینی" },
    L14: { eng: "stress_tolerance", fr: "تحمل استرس" },
    L15: { eng: "impulse_control", fr: "کنترل تکانه" },
    L16: {
      eng: "intrapersonal_skills",
      fr: "مهارت درون‌فردی",
      desc: "استقلال، خودشکوفایی، خودابرازی\nاحترام به خود، خودآگاهی هیجانی",
    },
    L17: { eng: "interpersonal_skills", fr: "مهارت بین‌فردی", desc: "مسئولیت‌پذیری اجتماعی،\nروابط بین‌فردی، همدلی" },
    L18: { eng: "adjustment", fr: "سازگاری", desc: "حل مسئله، واقع‌گرایی،\nانعطاف‌پذیری" },
    L19: { eng: "general_mood", fr: "خلق", desc: "شادمانی، خوش‌بینی" },
    L20: { eng: "stress_management", fr: "مدیریت استرس", desc: "تحمل استرس، کنترل تکانه" },
    L21: { eng: "raw", fr: "کل" },
  };

  profileSpec = {
    /* "sample" determines some important info about the sample and profile */
    /* Default prerequisites: 1. gender, 2. age, 3. education */
    /* "prerequisites" is synonym to "fields" in our program */
    sample: {
      name: "پرسشنامه هوش هیجانی بار-آن" /* Name of the sample */,
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
          width: 843 + 2 * this.padding.x,
          height: 690 + 2 * this.padding.y,
        };
      },
      padding: {
        x: 0,
        y: 20,
      },
    },
    /* "raw" is the general term used for total data element in the profile */
    raw: {
      maxValue: 450 /* Maximum value of raw mark provided by the dataset */,
      ticks: {
        arr: [450, 90],
        line: {
          width: 10 /* Width of the tick line */,
          offsetX: 4 /* Horizontal offset from the rectangle */,
        },
        number: {
          offsetX: 5 /* Horizontal Offset from the line */,
        },
      },
      rect: {
        width: 28 /* Width of the raw rectangle */,
        height: 450 /* Height of the raw rectangle */,
        borderRadius: 14,
      },
      heightCoeff: 1 /* Used for converting mark to the height */,
    },
    /* "items" is the general term used for independent data elements to be drawn in the profile */
    items: {
      maxValue: 30 /* Maximum value of items mark provided by the dataset */,
      offsetY: 12 /* Offset between two consecutive item in the profile */,
      get distanceY() {
        return this.offsetY + this.rect.height;
      } /* Distance between two consecutive item in the profile */,
      totalHeight: "" /* To be calculated in the class with the function provided */,
      calcTotalHeight: function (n) {
        return this.distanceY * (n - 1) + this.base.rect.height;
      } /* Method for calculating the total height of items */,
      ticks: {
        num: 5 /* Number of ticks */,
        heightOffset: 25 /* Half length that the ticks lines of items is greater than items total heigth */,
        numberOffset: {
          x: 5 /* Horizontal distance from the line */,
          y: 0 /* Vertical distance from the line */,
        },
      },
      rect: {
        borderRadius: 8,
        height: 16 /* Height of the items rectangle (base part) */,
      },
      widthCoeff: 10,
      label: {
        offsetX: 8 /* Horizontal offset of the label from the circle */,
      },
      colors: [
        "#C026D3",
        "#C026D3",
        "#C026D3",
        "#C026D3",
        "#C026D3",
        "#E11D48",
        "#E11D48",
        "#E11D48",
        "#F59E0B",
        "#F59E0B",
        "#F59E0B",
        "#16A34A",
        "#16A34A",
        "#0EA5E9",
        "#0EA5E9",
      ] /* Colors used for theming items base parts */,
      opacityMappings: new Mappings()
        .addMapping("6-12", 0.7)
        .addMapping("13-18", 0.8)
        .addMapping("19-24", 0.9)
        .addMapping("25-30", 1) /* Opacity mapping for marks */,
    },
    gaugeItems: {
      offsetX: 40.5 /* Horizontal offset between two top items */,
      get distanceX() {
        return this.offsetX + this.circle.R * 2;
      } /* Horizontal distance between two top items */,
      maxValues: {
        [this.labels.L16.eng]: 150,
        [this.labels.L17.eng]: 90,
        [this.labels.L18.eng]: 90,
        [this.labels.L19.eng]: 60,
        [this.labels.L20.eng]: 60,
      } /* Maximum value of items */,
      fills: {
        [this.labels.L16.eng]: "#C026D3",
        [this.labels.L17.eng]: "#E11D48",
        [this.labels.L18.eng]: "#F59E0B",
        [this.labels.L19.eng]: "#16A34A",
        [this.labels.L20.eng]: "#0EA5E9",
      } /* Color used in items */,
      circle: {
        R: 50 /* Radius of the outer circle of the items element */,
        r: 34 /* Radius of the inner circle of the items element */,
        brs: {
          tl: 4 /* Top left border radius */,
          bl: 4 /* Bottom left border radius */,
          tr: 4 /* Top right border radius */,
          br: 4 /* Bottom right border radius */,
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
    },
    tableItems: [
      { label: this.labels.L1.fr, avg: 19.1, dev: 3.1 },
      { label: this.labels.L2.fr, avg: 21.7, dev: 4.04 },
      { label: this.labels.L3.fr, avg: 18.7, dev: 4.1 },
      { label: this.labels.L4.fr, avg: 21.05, dev: 4.03 },
      { label: this.labels.L5.fr, avg: 20.6, dev: 3.8 },
      { label: this.labels.L6.fr, avg: 25.3, dev: 2.7 },
      { label: this.labels.L7.fr, avg: 23.9, dev: 3.8 },
      { label: this.labels.L8.fr, avg: 25.2, dev: 2.7 },
      { label: this.labels.L9.fr, avg: 22.3, dev: 3.7 },
      { label: this.labels.L10.fr, avg: 19.2, dev: 4.2 },
      { label: this.labels.L11.fr, avg: 18.6, dev: 3.4 },
      { label: this.labels.L12.fr, avg: 22.5, dev: 4.4 },
      { label: this.labels.L13.fr, avg: 20.9, dev: 3.1 },
      { label: this.labels.L14.fr, avg: 17.38, dev: 4.06 },
      { label: this.labels.L15.fr, avg: 16.7, dev: 4.9 },
      { label: this.labels.L21.fr, avg: 313.6, dev: 37.1 },
    ],
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
    const { raw: rawSpec, items: itemsSpec, gaugeItems: gaugeItemsSpec } = spec;

    const rawData = dataset.score.pop();

    const items = dataset.score.slice(0, 15).map((data, index) => ({
      label: data.label,
      mark: data.mark,
      width: data.mark * itemsSpec.widthCoeff,
      fill: itemsSpec.colors[index],
      opacity: itemsSpec.opacityMappings.map(data.mark),
    }));

    const raw = {
      label: rawData.label,
      mark: rawData.mark,
      height: rawData.mark * rawSpec.heightCoeff,
    };

    // Gather Required Info for Raw Ticks
    const rawTicks = rawSpec.ticks.arr.map((tick) => ({
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
      leftPos: tick * itemsSpec.widthCoeff,
    }));

    let gaugeItems = dataset.score.slice(15).map((data) => ({
      label: data.label,
      mark: data.mark,
      zeta:
        (data.mark / gaugeItemsSpec.maxValues[data.label.eng]) * gaugeItemsSpec.circle.totalAngle +
        gaugeItemsSpec.circle.angles.start,
      fill: gaugeItemsSpec.fills[data.label.eng],
    }));

    return [{ items, raw, itemsTicks, rawTicks, gaugeItems }];
  }
}

module.exports = BEQI93;
