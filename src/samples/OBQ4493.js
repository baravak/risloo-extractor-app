const { Profile } = require("../Profile");

class OBQ4493 extends Profile {
  // Number of pages
  static pages = 1;

  // Labels of the sample
  labels = {
    L1: { eng: "complete_performance", fr: "عملکرد کامل", abbr: "CP" },
    L2: { eng: "importance_and_control_of_thought", fr: "اهمیت و کنترل فکر", abbr: "ICT" },
    L3: { eng: "responsibility_and_threat_estimation", fr: "مسئولیت و تخمین تهدید", abbr: "RT" },
    L4: { eng: "perfectionism_certainty", fr: "کمال‌گرایی / یقین", abbr: "PC" },
    L5: { eng: "general", fr: "عمومی", abbr: "G" },
    L6: { eng: "raw", fr: "مجموع", abbr: "T" },
  };

  profileSpec = {
    /* "sample" determines some important info about the sample and profile */
    /* Default prerequisites: 1. gender, 2. age, 3. education */
    /* "prerequisites" is synonym to "fields" in our program */
    sample: {
      name: "پرسشنامه باورهای احساسی" /* Name of the sample */,
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
          width: 903 + 2 * this.padding.x,
          height: 708 + 2 * this.padding.y,
        }
      },
      padding: {
        x: 0,
        y: 0,
      },
    },
    /* "raw" is the general term used for total data element in the profile */
    raw: {
      labels: {
        offsetY: 18,
      },
      maxValuesOffsetX: 10,
      maxValue: 132,
      rect: {
        width: 800,
        height: 48,
        br: 5,
        offsetY: 100,
      },
    },
    /* "items" is the general term used for independent data elements to be drawn in the profile */
    items: {
      labels: {
        offsetY: 18,
      },
      maxValuesOffsetX: 10,
      maxValues: {
        [this.labels.L1.eng]: 15,
        [this.labels.L2.eng]: 16,
        [this.labels.L3.eng]: 21,
        [this.labels.L4.eng]: 30,
        [this.labels.L5.eng]: 48,
      },
      rect: {
        width: 800,
        height: 30,
        br: 5,
        offsetY: 70,
        get distanceY() {
          return this.height + this.offsetY;
        },
      },
    },
    separator: {
      line: {
        width: 903,
        offsetY: 72.5,
      },
      desc: {
        offsetY: 17.5,
      },
    },
    /* "labels" part which has to be provided for each profile */
    labels: Object.values(this.labels),
    desc: "این آزمون هر چقدر به سمت مثبت برود، نشان‌دهنده باورهای وسواس بالاست و در صورت منفی بودن، باورهای وسواس پایین است.",
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

    // Separate Raw Data from the Dataset
    const rawData = dataset.score.pop();

    const raw = {
      label: rawData.label,
      mark: rawData.mark,
      maxValue: rawSpec.maxValue,
      width: Math.abs((rawData.mark / rawSpec.maxValue) * (rawSpec.rect.width / 2)),
    };

    const items = dataset.score.map((data) => ({
      label: data.label,
      mark: data.mark,
      maxValue: itemsSpec.maxValues[data.label.eng],
      width: Math.abs((data.mark / itemsSpec.maxValues[data.label.eng]) * (itemsSpec.rect.width / 2)),
    }));

    return [
      {
        raw,
        items,
      },
    ];
  }
}

module.exports = OBQ4493;
