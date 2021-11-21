const { Profile, FS } = require("../profile");

class MMAFD93 extends Profile {
  profileSpec = {
    /* "test" determines some important info about the test and profile */
    /* Default prerequisites: 1. gender, 2. age, 3. education */
    /* "prerequisites" is synonym to "fields" in our program */
    test: {
      name: "پرسشنامه عملکرد خانواده ۵۳ سؤالی" /* Name of the test */,
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
          width: 705 + spec.profile.padding.x * 2,
          height: 653 + spec.profile.padding.y * 2,
        };
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
        problem_solving: 20,
        roles: 40,
        affective_responsiveness: 35,
        communication: 30,
        affective_involvement: 40,
        behaviour_control: 40,
        overall_performance: 60,
      } /* Maximum value of marks provided by the dataset */,
      labels: {
        offset: 50 /* Offset of the label from the vertice of the polygon */,
        paddingY: 12 /* Half distance between two parts of the label */,
      },
      dataPoints: {
        radius: 12 /* Radius of the circle of the data point */,
        fills: {
          problem_solving: "#F59E0B",
          roles: "#71717A",
          affective_responsiveness: "#DC2626",
          communication: "#059669",
          affective_involvement: "#2563EB",
          behaviour_control: "#9333EA",
          overall_performance: "#DB2777",
        } /* Colors used for theming data points */,
      },
    },
    /* "labels" part which has to be provided for each profile */
    labels: {
      raw: {
        fr: "نمره کل",
      },
      problem_solving: {
        fr: "حل مشکل",
      },
      overall_performance: {
        fr: "عملکرد کلی",
      },
      behaviour_control: {
        fr: "کنترل رفتار",
      },
      affective_involvement: {
        fr: "آمیزش عاطفی",
      },
      communication: {
        fr: "ارتباط",
      },
      affective_responsiveness: {
        fr: "همراهی عاطفی",
      },
      roles: {
        fr: "نقش‌ها",
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
    let { polygons: polygonsSpec, items: itemsSpec } = spec;

    // ّInit Spec
    spec.profile.dimensions = spec.profile.calcDim(spec, 7);

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
