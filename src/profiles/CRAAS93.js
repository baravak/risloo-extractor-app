const { Profile, FS, SVG } = require("../profile");

class CRAAS93 extends Profile {
  profileSpec = {
    /* "test" determines some important info about the test and profile */
    /* Default prerequisites: 1. gender, 2. age, 3. education */
    /* "prerequisites" is synonym to "fields" in our program */
    test: {
      name: "پرسشنامه دلبستگی کولینز و رید" /* Name of the test */,
      multiProfile: false /* Whether the test has multiple profiles or not */,
      answers: false /* Determines whether to get answers from inital dataset or not */,
      defaultFields: true /* Determines whether to have default prerequisites in the profile or not */,
      fields: [
        "marital_status",
      ] /* In case you want to get some additional fields and show in the profile */,
    },
    /* "profile" determines the dimensions of the drawn profile (to be used in svg tag viewbox) */
    /* calculating its dimensions carefully is of great importance */
    profile: {
      dimensions:
        {} /* To be calculated in the class with the function provided */,
      calcDim: function (spec, n) {
        return {
          width: 800 + spec.profile.padding.x * 2,
          height:
            (spec.polygons.radius + spec.items.labels.offset) *
              (1 + (FS.isOdd(n) ? Math.cos((2 * Math.PI) / n / 2) : 1)) +
            50 +
            spec.profile.padding.y * 2,
        };
      },
      padding: {
        x: 50,
        y: 15,
      },
    },
    /* Spec for the polygons drawn in the profile */
    polygons: {
      radius: 450 /* Radius of the peripheral circle of the main polygon */,
      centerOffset: 40 /* Radius of the peropheral circle of the smallest polygon */,
      /* Spec for the ticks used in the profile */
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
    /* "items" is the general term used for independent data elements to be drawn in the profile */
    items: {
      labels: {
        offset: 50 /* Offset of the label from the vertice of the polygon */,
        paddingY: 12 /* Half distance between two parts of the label */,
      },
      dataPoints: {
        maxValue: 20 /* Maximum value of marks provided by the dataset */,
        radius: 12 /* Radius of the circle of the data point */,
        fills: [
          "#166534",
          "#D97706",
          "#DC2626",
        ] /* Colors used for theming data points */,
      },
    },
    /* "labels" part which has to be provided for each profile */
    labels: {
      closeness: {
        name: "نزدیک بودن",
        type: "دلبستگی ایمن",
      },
      dependance: {
        name: "وابستگی",
        type: "دلبستگی اجتنابی",
      },
      anxiety: {
        name: "اضطراب",
        type: "دلبستگی اضطرابی-دوسوگرا",
      },
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

    // Deconstructing the Spec of the Profile
    let {
      profile,
      polygons: { radius, centerOffset, ticks: ticksSpec },
      items: {
        dataPoints: { maxValue, fills },
        labels: { offset },
      },
    } = spec;

    // Calculate Number of Vertices
    const n = dataset.score.length;

    // ّInit Spec
    spec.profile.dimensions = spec.profile.calcDim(spec, n);

    // Calculate Polygon Angles & theta == Angle of Polygon
    const angles = FS.createArithmeticSequence(0, (2 * Math.PI) / n, n);
    const theta = angles[1];

    // In Case n is Odd, the Center of the Canvas is Moved to the Proper Point
    profile["center"] = {
      x: profile.dimensions.width / 2,
      y: FS.isOdd(n)
        ? profile.dimensions.height / (1 + Math.cos(theta / 2))
        : profile.dimensions.height / 2,
    };

    // Calculate Radius for Data Points
    const dataRadiuses = dataset.score.map(
      (data) => (data.mark / maxValue) * (radius - centerOffset) + centerOffset
    );

    // Consecutive Distance
    const dist = FS.roundTo2((radius - centerOffset) / maxValue);

    // Calculate Radiuses Array for Main Points
    let radiuses = Array(n).fill(radius);

    // Calculate Polygons Points
    let i;
    const polygons = [];
    let points = [];
    for (i = 0; i <= maxValue; i++) {
      points = this._calcPolygonPoints(radiuses, angles);
      polygons.push(SVG.calcPathDAttr(points));
      radiuses = radiuses.map((radius) => radius - dist);
    }

    // Calculate Data Points
    const dataPoints = this._calcPolygonPoints(dataRadiuses, angles);

    // Calculate Text Points
    radiuses = Array(n).fill(radius + offset);
    const textPoints = this._calcPolygonPoints(radiuses, angles);

    // Gather Required Info for Items
    const items = {
      dAttr: SVG.calcPathDAttr(dataPoints),
      points: dataPoints.map((point, index) => ({
        point,
        fill: fills[index],
        mark: dataset.score[index].mark,
      })),
      labels: textPoints.map((point, index) => ({
        point,
        label: dataset.score[index].label,
      })),
    };

    // In Case Ticks Side is Greater than n
    ticksSpec.side = ((ticksSpec.side - 1) % n) + 1;

    // Calculate Ticks Array and Angle to Place On
    const ticksNumbers = FS.createArithmeticSequence(
      0,
      maxValue / (ticksSpec.num - 1),
      ticksSpec.num
    );
    const ticksAngles = Array(ticksSpec.num).fill(angles[ticksSpec.side - 1]);
    const ticksRadiuses = FS.createArithmeticSequence(
      centerOffset,
      (radius - centerOffset) / (ticksSpec.num - 1),
      ticksSpec.num
    );

    //Calculate Ticks Points
    let ticksPoints = this._calcPolygonPoints(ticksRadiuses, ticksAngles);

    // Displace Ticks Points (Defining Displacement Vector and Displacement Value)
    const alpha = Math.PI - ((2 * ticksSpec.side - 1) * theta) / 2;
    const disVector = { x: Math.cos(alpha), y: Math.sin(alpha) };
    const disValue = FS.createArithmeticSequence(
      ticksSpec.displacement.initialTerm,
      ticksSpec.displacement.commonDiff,
      ticksSpec.num
    );
    ticksPoints = ticksPoints.map((point, index) =>
      this._displacePoint(point, disVector, disValue[index])
    );

    // Gather Required Info for Ticks
    const ticks = ticksPoints.map((point, index) => ({
      point,
      number: ticksNumbers[index],
    }));

    return [{
      polygons,
      items,
      ticks,
    }];
  }

  _calcPolygonPoints(radiuses, angles) {
    let points = angles.map((angle, index) =>
      this._polarToCartesian(radiuses[index], angle)
    );

    return points;
  }

  // Polar Initial Coordinate System
  //  ------------ x
  //  |
  //  |
  //  |
  //  |
  //  y

  _polarToCartesian(radius, angle) {
    return {
      x: -FS.roundTo2(radius * Math.sin(angle)),
      y: -FS.roundTo2(radius * Math.cos(angle)),
    };
  }

  _displacePoint(pt, u, d) {
    return {
      x: pt.x + d * u.x,
      y: pt.y + d * u.y,
    };
  }
}

module.exports = CRAAS93;
