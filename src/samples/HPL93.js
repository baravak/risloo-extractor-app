const { Profile, FS } = require("../Profile");

class HPL93 extends Profile {
  // Number of pages
  static pages = 1;

  // Labels of the sample
  labels = {
    L1: { eng: "raw", fr: "نمره کل" },
    L2: { eng: "spritual_growth", fr: "رشد معنوی و شکوفایی" },
    L3: { eng: "nutrition", fr: "تغذیه" },
    L4: { eng: "stress_management", fr: "مدیریت استرس" },
    L5: { eng: "physical_activity", fr: "ورزش و فعالیت بدنی" },
    L6: { eng: "health_self_responsibility", fr: "مسئولیت‌پذیری در مورد سلامت" },
    L7: { eng: "interpersonal_relationships", fr: "روابط بین‌ فردی" },
  };

  profileSpec = {
    /* "sample" determines some important info about the sample and profile */
    /* Default prerequisites: 1. gender, 2. age, 3. education */
    /* "prerequisites" is synonym to "fields" in our program */
    sample: {
      name: "پرسشنامه سبک زندگی ارتقادهنده سلامت" /* Name of the sample */,
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
          width: 770 + 2 * this.padding.x,
          height: 600 + 2 * this.padding.y,
        }
      },
      padding: {
        x: 50,
        y: 0,
      },
    },
    /* Spec for the polygons drawn in the profile */
    polygons: {
      n: 6 /* Number of vertices of the polygons */,
      get theta() {
        return (2 * Math.PI) / this.n;
      },
      startAngle: FS.toRadians(-60) /* Start angle of the polygon */,
      radius: 270 /* Radius of the peripheral circle of the main polygon */,
      centerOffset: 67 /* Radius of the peropheral circle of the smallest polygon */,
    },
    /* "raw" is the general term used for total data element in the profile */
    raw: {
      maxValue: 216,
      mark: {
        paddingY: 18,
      },
    },
    /* "items" is the general term used for independent data elements to be drawn in the profile */
    items: {
      maxValues: {
        [this.labels.L2.eng]: 40,
        [this.labels.L3.eng]: 28,
        [this.labels.L4.eng]: 24,
        [this.labels.L5.eng]: 36,
        [this.labels.L6.eng]: 56,
        [this.labels.L7.eng]: 28,
      } /* Maximum value of marks provided by the dataset */,
      labels: {
        offset: 50 /* Offset of the label from the vertice of the polygon */,
        paddingY: 12 /* Half distance between two parts of the label */,
      },
      dataPoints: {
        radius: 12 /* Radius of the circle of the data point */,
        fills: {
          [this.labels.L2.eng]: "#C026D3",
          [this.labels.L3.eng]: "#EA580C",
          [this.labels.L4.eng]: "#52525B",
          [this.labels.L5.eng]: "#2563EB",
          [this.labels.L6.eng]: "#059669",
          [this.labels.L7.eng]: "#E11D48",
        } /* Colors used for theming data points */,
      },
    },
    /* "labels" part which has to be provided for each profile */
    labels: Object.values(this.labels)
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
    let { polygons: polygonsSpec, items: itemsSpec } = spec;

    const rawData = dataset.score.shift();

    const raw = {
      label: rawData.label,
      mark: rawData.mark,
    };

    // Gather Required Info for Items
    const items = dataset.score.map((data, index) => ({
      label: data.label,
      mark: data.mark,
      maxValue: itemsSpec.maxValues[data.label.eng],
      angle: polygonsSpec.startAngle - index * polygonsSpec.theta,
      radius:
        (data.mark / itemsSpec.maxValues[data.label.eng]) * (polygonsSpec.radius - polygonsSpec.centerOffset) +
        polygonsSpec.centerOffset,
      fill: itemsSpec.dataPoints.fills[data.label.eng],
    }));

    return [
      {
        raw,
        items,
      },
    ];
  }
}

module.exports = HPL93;
