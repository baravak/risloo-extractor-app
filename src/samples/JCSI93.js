const { Profile } = require("../Profile");

class JCSI93 extends Profile {
  // Number of pages
  static pages = 1;

  // Labels of the sample
  labels = {
    L1: { eng: "raw", fr: "نمره کل" },
    L2: { eng: "listening", fr: "گوش دادن" },
    L3: { eng: "emotion_regulation", fr: "تنظیم عواطف" },
    L4: { eng: "understanding_message", fr: "درک پیام" },
    L5: { eng: "awareness", fr: "بینش" },
    L6: { eng: "assertiveness", fr: "قاطعیت" },
    L7: { eng: "interpretation", fr: "تفسیر" },
  };

  profileSpec = {
    /* "sample" determines some important info about the sample and profile */
    /* Default prerequisites: 1. gender, 2. age, 3. education */
    /* "prerequisites" is synonym to "fields" in our program */
    sample: {
      name: "پرسشنامه مهارت‌های ارتباطی جرابک" /* Name of the sample */,
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
          width: 690 + 2 * this.padding.x,
          height: 641.5 + 2 * this.padding.y,
        }
      },
      padding: {
        x: 0,
        y: 37.75,
      },
    },
    /* "raw" is the general term used for total data element in the profile */
    raw: {
      maxValue: 170 /* Maximum value of raw mark provided by the dataset */,
      offsetY: 135 /* Vertical offset from items */,
      rect: {
        base: {
          width: 680 /* Width of the base rectangle of the raw */,
          height: 4 /* Height of the base rectangle of the raw */,
          br: 2 /* Border radius of the base rectangle of the raw */,
        },
        body: {
          height: 20 /* Height of the body rectangle of the raw */,
          br: 8 /* Border radius of the body rectangle of the raw */,
        },
      },
      widthCoeff: 4 /* Used for converting mark to the width */,
      stops: [33, 68, 102, 170] /* Stops array for the raw mark */,
      interprets: [
        { fill: "#EF4444", eng: "mild", fr: "ضعیف" },
        { fill: "#FBBF24", eng: "moderate", fr: "متوسط" },
        { fill: "#22C55E", eng: "severe", fr: "قوی" },
      ] /* Interprets array for the raw mark */,
      label: {
        stops: {
          line: {
            offsetY: 5.5,
            length: 16,
          },
          number: {
            offsetY: 15,
          },
        },
        shape: {
          width: 50,
          height: 42.6,
          offsetY: 35,
        },
      },
    },
    /* "items" is the general term used for independent data elements to be drawn in the profile */
    items: {
      baseline: {
        width: 680 /* Width of the baseline below items */,
      },
      maxValues: {
        [this.labels.L2.eng]: 35,
        [this.labels.L3.eng]: 40,
        [this.labels.L4.eng]: 45,
        [this.labels.L5.eng]: 25,
        [this.labels.L6.eng]: 25,
      } /* Maximum values of items marks provided by the dataset */,
      topPos: 430 /* Top position of the baseline of items */,
      offsetX: 100 /* Horizontal offset between two consecutive item */,
      get distanceX() {
        return this.offsetX + this.rect.body.width;
      } /* Horizontal distance between two consecutive item */,
      rect: {
        base: {
          width: 4 /* Width of the base rectangle of items */,
          br: 2 /* Border radius of the base rectangle of items */,
          color: "#E4E4E7" /* Fill of the base rectangle */,
        },
        body: {
          width: 35 /* Width of the body rectangle of items */,
          height: 8 /* Height of the body rectangle parts of items */,
          offsetY: 1 /* Vertical offset between two parts of body rectangles */,
          get distanceY() {
            return this.height + this.offsetY;
          } /* Vertical distance between two parts of body rectangles */,
          br: 4 /* Border radius of the body rectangle of items */,
          colors: [
            "#C026D3",
            "#EC4899",
            "#3B82F6",
            "#14B8A6",
            "#65A30D",
          ] /* Colors used for theming items body parts */,
        },
        heightCoeff: 9 /* Used to convert mark to height for base rectangle of items */,
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

    const { raw: rawSpec, items: itemsSpec } = spec;

    // Separate Raw Data from the Dataset
    let rawData = dataset.score.shift();

    // Separate Interpretation from the Dataset
    let interpret = dataset.score.pop().mark;

    // Gather Required Info for Raw
    const raw = {
      mark: rawData.mark,
      label: rawData.label,
      width: rawData.mark * rawSpec.widthCoeff,
      interpret: rawSpec.interprets.find((interpretation) => interpretation.eng === interpret),
      stops: rawSpec.stops.map((stop) => ({
        mark: stop,
        width: stop * rawSpec.widthCoeff,
      })),
    };

    // Gather Required Info for Items
    const items = dataset.score.map((data, index) => ({
      label: data.label,
      mark: data.mark,
      maxValue: itemsSpec.maxValues[data.label.eng],
      height: {
        base: itemsSpec.maxValues[data.label.eng] * itemsSpec.rect.heightCoeff + 5,
      },
      fill: itemsSpec.rect.body.colors[index],
    }));

    return [{ raw, items }];
  }
}

module.exports = JCSI93;
