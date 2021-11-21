const { Profile, FS } = require("../profile");

class OBQ4493 extends Profile {
  profileSpec = {
    /* "test" determines some important info about the test and profile */
    /* Default prerequisites: 1. gender, 2. age, 3. education */
    /* "prerequisites" is synonym to "fields" in our program */
    test: {
      name: "پرسشنامه باورهای احساسی" /* Name of the test */,
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
          width: spec.separator.line.width + spec.profile.padding.x * 2,
          height:
            spec.items.rect.distanceY * 4 +
            spec.items.rect.height +
            spec.raw.rect.offsetY +
            spec.raw.rect.height +
            spec.separator.line.offsetY +
            spec.separator.desc.offsetY +
            40 +
            spec.profile.padding.y * 2,
        };
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
        complete_performance: 15,
        importance_and_control_of_thought: 16,
        responsibility_and_threat_estimation: 21,
        perfectionism_certainty: 30,
        general: 48,
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
    labels: {
      complete_performance: {
        abbr: "CP",
        fr: "عملکرد کامل",
      },
      importance_and_control_of_thought: {
        abbr: "ICT",
        fr: "اهمیت و کنترل فکر",
      },
      responsibility_and_threat_estimation: {
        abbr: "RT",
        fr: "مسئولیت و تخمین تهدید",
      },
      perfectionism_certainty: {
        abbr: "PC",
        fr: "کمال‌گرایی / یقین",
      },
      general: {
        abbr: "G",
        fr: "عمومی",
      },
      raw: {
        abbr: "T",
        fr: "مجموع",
      },
    },
    desc: "این آزمون هر چقدر به سمت مثبت برود، نشان‌دهنده باورهای وسواس بالاست و در صورت منفی بودن، باورهای وسواس پایین است.",
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

    const { items: itemsSpec, raw: rawSpec } = spec;

    // ّInit Spec (Do Not Forget To Separate Raw)
    spec.profile.dimensions = spec.profile.calcDim(spec, dataset.score.length);

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

    // console.log(items);

    return [
      {
        raw,
        items,
      },
    ];
  }
}

module.exports = OBQ4493;
