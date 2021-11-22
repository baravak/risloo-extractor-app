const { Profile, FS } = require("../profile");

class FTEPT93 extends Profile {
  profileSpec = {
    /* "test" determines some important info about the test and profile */
    /* Default prerequisites: 1. gender, 2. age, 3. education */
    /* "prerequisites" is synonym to "fields" in our program */
    test: {
      name: "پرسشنامه عملکرد تحصیلی فام و تیلر (درتاج)" /* Name of the test */,
      multiProfile: false /* Whether the test has multiple profiles or not */,
      questions: false /* Determines whether to get questions from inital dataset or not */,
      defaultFields: true /* Determines whether to have default prerequisites in the profile or not */,
      fields: [
        "study_field",
        "marital_status",
      ] /* In case you want to get some additional fields and show in the profile */,
    },
    /* "profile" determines the dimensions of the drawn profile (to be used in svg tag viewbox) */
    /* calculating its dimensions carefully is of great importance */
    profile: {
      dimensions: {} /* To be calculated in the class with the function provided */,
      calcDim: function (spec, n) {
        return {
          width: spec.items.baseline.width + spec.profile.padding.x * 2,
          height:
            spec.items.topPos +
            spec.raw.offsetY +
            spec.raw.label.stops.line.length +
            spec.raw.label.stops.number.offsetY +
            10 +
            spec.profile.padding.y * 2,
        };
      },
      padding: {
        x: 0,
        y: 40,
      },
    },
    /* "raw" is the general term used for total data element in the profile */
    raw: {
      maxValue: 240 /* Maximum value of raw mark provided by the dataset */,
      leftPos: 10 /* Left position of the raw rectangle */,
      offsetY: 150 /* Vertical offset from items */,
      rect: {
        width: 720 /* Width of the raw rectangle */,
        height: 20 /* Height of the raw rectangle */,
        br: 5 /* Border radius of the raw rectangle */,
      },
      widthCoeff: 3 /* Used for converting mark to the width */,
      stops: [48, 95, 143, 240] /* Stops array for the raw mark */,
      interprets: [
        { fill: "#EF4444", eng: "weak", fr: "ضعیف" },
        { fill: "#FBBF24", eng: "mild", fr: "متوسط" },
        { fill: "#22C55E", eng: "very_good", fr: "بسیار خوب" },
      ] /* Interprets array for the raw mark */,
      label: {
        stops: {
          line: {
            length: 32,
          },
          number: {
            offsetY: 15,
          },
        },
        shape: {
          width: 50,
          height: 41.5,
          offsetY: 35,
        },
      },
    },
    /* "items" is the general term used for independent data elements to be drawn in the profile */
    items: {
      baseline: {
        width: 740 /* Width of the baseline below items */,
      },
      maxValues: {
        efficacy: 40,
        emotional_effects: 40,
        planning: 70,
        lack_of_consequence_control: 25,
        motivation: 65,
      } /* Maximum values of items marks provided by the dataset */,
      topPos: 425 /* Top position of the baseline of items */,
      offsetX: 100 /* Horizontal offset between two consecutive item */,
      get distanceX() {
        return this.offsetX + this.rect.body.width;
      } /* Horizontal distance between two consecutive item */,
      rect: {
        base: {
          width: 10 /* Width of the base rectangle of items */,
          br: 2 /* Border radius of the base rectangle of items */,
          color: "#F4F4F5" /* Fill of the base rectangle */,
        },
        body: {
          width: 35 /* Width of the body rectangle of items */,
          br: 6 /* Border radius of the body rectangle of items */,
          colors: [
            "#C026D3",
            "#EC4899",
            "#3B82F6",
            "#14B8A6",
            "#65A30D",
          ] /* Colors used for theming items body parts */,
        },
        heightCoeff: 6 /* Used for converting mark to the height */,
      },
    },
    /* "labels" part which has to be provided for each profile */
    labels: {
      raw: {
        fr: "نمره کل",
      },
      efficacy: {
        fr: "خودکارآمدی",
      },
      emotional_effects: {
        fr: "تأثیرات\nهیجانی",
      },
      planning: {
        fr: "برنامه‌ریزی",
      },
      lack_of_consequence_control: {
        fr: "فقدان\nکنترل پیامد",
      },
      motivation: {
        fr: "انگیزش",
      },
      interpretation: { fr: "تفسیر" },
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
        base: itemsSpec.maxValues[data.label.eng] * itemsSpec.rect.heightCoeff,
        body: data.mark * itemsSpec.rect.heightCoeff,
      },
      fill: itemsSpec.rect.body.colors[index],
    }));

    return [{ raw, items }];
  }
}

module.exports = FTEPT93;
