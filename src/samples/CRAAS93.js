const { Profile, FS } = require("../Profile");

class CRAAS93 extends Profile {
  // Number of pages
  static pages = 1;

  // Labels of the sample
  labels = {
    L1: { eng: "closeness", name: "نزدیک بودن", type: "دلبستگی ایمن" },
    L2: { eng: "dependance", name: "وابستگی", type: "دلبستگی اجتنابی" },
    L3: { eng: "anxiety", name: "اضطراب", type: "دلبستگی اضطرابی-دوسوگرا" },
  };

  profileSpec = {
    /* "sample" determines some important info about the sample and profile */
    /* Default prerequisites: 1. gender, 2. age, 3. education */
    /* "prerequisites" is synonym to "fields" in our program */
    sample: {
      name: "پرسشنامه دلبستگی کولینز و رید" /* Name of the sample */,
      multiProfile: false /* Whether the sample has multiple profiles or not */,
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
          width: 1050 + spec.profile.padding.x * 2,
          height: 798 + spec.profile.padding.y * 2,
        };
      },
      padding: {
        x: 0,
        y: 0,
      },
    },
    /* Spec for the polygons drawn in the profile */
    polygons: {
      n: 3 /* Number of vertices of the polygons */,
      get theta() {
        return (2 * Math.PI) / this.n;
      },
      startAngle: FS.toRadians(-90) /* Start angle of the polygon */,
      radius: 450 /* Radius of the peripheral circle of the main polygon */,
      centerOffset: 40 /* Radius of the peropheral circle of the smallest polygon */,
    },
    /* "items" is the general term used for independent data elements to be drawn in the profile */
    items: {
      maxValue: 20 /* Maximum value of marks provided by the dataset */,
      labels: {
        offset: 50 /* Offset of the label from the vertice of the polygon */,
        paddingY: 12 /* Half distance between two parts of the label */,
      },
      dataPoints: {
        radius: 12 /* Radius of the circle of the data point */,
        fills: ["#166534", "#D97706", "#DC2626"] /* Colors used for theming data points */,
      },
      ticks: {
        num: 5 /* Number of ticks */,
        rectDim: 12 /* The dimension of the rectangle the tick number is placed in */,
        side: 2 /* Which side of the polygon the ticks are going to be placed on */,
        /* The arithmetic sequence used for displacing ticks on the side direction */
        displacement: {
          initialTerm: 30 /* Initial term of the arithmetic sequence */,
          commonDiff: 10 /* Common difference of the arithmetic sequence */,
        },
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

    // ّInit Spec
    spec.profile.dimensions = spec.profile.calcDim(spec, 3);

    // Gather Required Info for Items
    const items = dataset.score.map((data, index) => ({
      label: data.label,
      mark: data.mark,
      angle: polygonsSpec.startAngle - index * polygonsSpec.theta,
      radius:
        (data.mark / itemsSpec.maxValue) * (polygonsSpec.radius - polygonsSpec.centerOffset) +
        polygonsSpec.centerOffset,
      fill: itemsSpec.dataPoints.fills[index],
    }));

    // In Case Ticks Side is Greater than n
    itemsSpec.ticks.side = ((itemsSpec.ticks.side - 1) % polygonsSpec.n) + 1;

    // Calculate Ticks Array and Angle to Place On
    const ticksNumbers = FS.createArithmeticSequence(
      0,
      itemsSpec.maxValue / (itemsSpec.ticks.num - 1),
      itemsSpec.ticks.num
    );
    const ticksRadiuses = FS.createArithmeticSequence(
      polygonsSpec.centerOffset,
      (polygonsSpec.radius - polygonsSpec.centerOffset) / (itemsSpec.ticks.num - 1),
      itemsSpec.ticks.num
    );

    // Displace Ticks Points (Defining Displacement Vector and Displacement Value)
    const alpha = 0;
    const disVector = { x: Math.cos(alpha), y: Math.sin(alpha) };
    const disValue = FS.createArithmeticSequence(
      itemsSpec.ticks.displacement.initialTerm,
      itemsSpec.ticks.displacement.commonDiff,
      itemsSpec.ticks.num
    );

    const ticks = ticksNumbers.map((number, index) => ({
      number,
      angle: polygonsSpec.startAngle - (itemsSpec.ticks.side - 1) * polygonsSpec.theta,
      radius: ticksRadiuses[index],
      disVector,
      disValue: disValue[index],
    }));

    return [
      {
        items,
        ticks,
      },
    ];
  }
}

module.exports = CRAAS93;
