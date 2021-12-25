const { Profile, FS } = require("../Profile");

class MMAFD93 extends Profile {
  // Number of pages
  static pages = 1;

  // Labels of the sample
  labels = {
    L1: { eng: "raw", fr: "نمره کل" },
    L2: { eng: "problem_solving", fr: "حل مشکل" },
    L3: { eng: "overall_performance", fr: "عملکرد کلی" },
    L4: { eng: "behaviour_control", fr: "کنترل رفتار" },
    L5: { eng: "affective_involvement", fr: "آمیزش عاطفی" },
    L6: { eng: "communication", fr: "ارتباط" },
    L7: { eng: "affective_responsiveness", fr: "همراهی عاطفی" },
    L8: { eng: "roles", fr: "نقش‌ها" },
  };

  profileSpec = {
    /* "sample" determines some important info about the sample and profile */
    /* Default prerequisites: 1. gender, 2. age, 3. education */
    /* "prerequisites" is synonym to "fields" in our program */
    sample: {
      name: "پرسشنامه عملکرد خانواده ۵۳ سؤالی" /* Name of the sample */,
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
          width: 705 + 2 * this.padding.x,
          height: 653 + 2 * this.padding.y,
        }
      },
      padding: {
        x: 0,
        y: 40,
      },
    },
    /* Spec for the polygons drawn in the profile */
    polygons: {
      n: 7 /* Number of vertices of the polygons */,
      get theta() {
        return (2 * Math.PI) / this.n;
      },
      startAngle: FS.toRadians(-90) /* Start angle of the polygon */,
      radius: 270 /* Radius of the peripheral circle of the main polygon */,
      centerOffset: 67 /* Radius of the peropheral circle of the smallest polygon */,
    },
    /* "raw" is the general term used for total data element in the profile */
    raw: {
      maxValue: 256,
      mark: {
        paddingY: 18,
      },
    },
    /* "items" is the general term used for independent data elements to be drawn in the profile */
    items: {
      maxValues: {
        [this.labels.L2.eng]: 20,
        [this.labels.L3.eng]: 60,
        [this.labels.L4.eng]: 40,
        [this.labels.L5.eng]: 40,
        [this.labels.L6.eng]: 30,
        [this.labels.L7.eng]: 35,
        [this.labels.L8.eng]: 40,
      } /* Maximum value of marks provided by the dataset */,
      labels: {
        offset: 50 /* Offset of the label from the vertice of the polygon */,
        paddingY: 12 /* Half distance between two parts of the label */,
      },
      dataPoints: {
        radius: 12 /* Radius of the circle of the data point */,
        fills: {
          [this.labels.L2.eng]: "#F59E0B",
          [this.labels.L3.eng]: "#DB2777",
          [this.labels.L4.eng]: "#9333EA",
          [this.labels.L5.eng]: "#2563EB",
          [this.labels.L6.eng]: "#059669",
          [this.labels.L7.eng]: "#DC2626",
          [this.labels.L8.eng]: "#71717A",
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

module.exports = MMAFD93;
