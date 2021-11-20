const { Profile, FS } = require("../profile");

class JCSI93 extends Profile {
  profileSpec = {
    /* "test" determines some important info about the test and profile */
    /* Default prerequisites: 1. gender, 2. age, 3. education */
    /* "prerequisites" is synonym to "fields" in our program */
    test: {
      name: "پرسشنامه مهارت‌های ارتباطی جرابک" /* Name of the test */,
      multiProfile: false /* Whether the test has multiple profiles or not */,
      questions: false /* Determines whether to get questions from inital dataset or not */,
      defaultFields: true /* Determines whether to have default prerequisites in the profile or not */,
      fields:
        ["marital_status"] /* In case you want to get some additional fields and show in the profile */,
    },
    /* "profile" determines the dimensions of the drawn profile (to be used in svg tag viewbox) */
    /* calculating its dimensions carefully is of great importance */
    profile: {
      dimensions:
        {} /* To be calculated in the class with the function provided */,
      calcDim: function (spec, n) {
        return {
          width: spec.items.baseline.width + 10 + spec.profile.padding.x * 2,
          height:
            spec.items.topPos +
            spec.raw.offsetY +
            spec.raw.rect.body.height +
            spec.raw.label.stops.line.offsetY +
            spec.raw.label.stops.line.length +
            spec.raw.label.stops.number.offsetY +
            20 +
            +spec.profile.padding.y * 2,
        };
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
        listening: 35,
        emotion_regulation: 40,
        understanding_message: 45,
        awareness: 25,
        assertiveness: 25,
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
    labels: {
      raw: {
        fr: "نمره کل",
      },
      listening: {
        fr: "گوش دادن",
      },
      emotion_regulation: {
        fr: "تنظیم عواطف",
      },
      understanding_message: {
        fr: "درک پیام",
      },
      awareness: {
        fr: "بینش",
      },
      assertiveness: {
        fr: "قاطعیت",
      },
      interpretation: { fr: "تفسیر" },
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

    // Init Spec
    spec.profile.dimensions = spec.profile.calcDim(spec, dataset.score.length);

    // Separate Raw Data from the Dataset
    let rawData = dataset.score.shift();

    // Separate Interpretation from the Dataset
    let interpret = dataset.score.pop().mark;

    // Gather Required Info for Raw
    const raw = {
      mark: rawData.mark,
      label: rawData.label,
      width: rawData.mark * rawSpec.widthCoeff,
      interpret: rawSpec.interprets.find(
        (interpretation) => interpretation.eng === interpret
      ),
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
