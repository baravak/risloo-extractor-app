import { Profile, Color, SVG, FS } from "../profile";

const defaultSpec = {
  CRAAS93: {
    maxValue: 20,
    textOffset: 35,
    centerOffset: 35,
    ticks: 5,
    ticksLength: 12,
    ticksSide: 2,
    ticksDisplacement: {
      initial_term: 30,
      common_diff: 10,
    },
    dataPointsRadius: 15,
    textYPadding: 10,
    labels: {
      closeness: {
        name: "نزدیک بودن",
        type: "دلبستگی ایمن",
      },
      anxiety: {
        name: "اضطراب",
        type: "دلبستگی اضطرابی-دوسوگرا",
      },
      dependance: {
        name: "وابستگی",
        type: "دلبستگی اجتنابی",
      },
    },
  },
};

export class CRAAS93 extends Profile {
  constructor(dataset, config = {}) {
    super(dataset, config, defaultSpec);
  }

  _calcContext() {
    const { spec, dataset, canvas } = this;

    let {
      maxValue,
      textOffset,
      centerOffset,
      ticks,
      ticksSide,
      ticksDisplacement: { initial_term, common_diff },
    } = spec.parameters["CRAAS93"];

    // Calculate Number of Vertices
    const n = dataset.score.keys.length;

    // In Case Ticks Side is Greater than n
    ticksSide = ((ticksSide - 1) % n) + 1;

    // Calculate Polygon Points Angles & theta == Angle of Polygon
    const angles = FS.createArithmeticSequence(0, (2 * Math.PI) / n, n);
    const theta = angles[1];

    // Radius of Main Polygon
    let radius =
      Math.min(canvas.height, canvas.width) / 2 - canvas.padding - centerOffset;

    // Change Position of Center and Radius if n is Odd
    if (FS.isOdd(n)) {
      let change = (2 / 3) * radius * (1 - Math.cos(theta / 2));
      canvas.center.y += change;
      radius += change;
    }

    // Calculate Radius for Data Points
    const dataRadiuses = dataset.score.values.map(
      (value) => (value / maxValue) * radius + centerOffset
    );

    // Calculate Ticks Array and Angle to Place On
    const ticksNumbers = FS.createArithmeticSequence(
      0,
      maxValue / (ticks - 1),
      ticks
    );
    const ticksAngles = Array(ticks).fill(angles[ticksSide - 1]);
    const ticksRadiuses = FS.createArithmeticSequence(
      centerOffset,
      radius / (ticks - 1),
      ticks
    );

    // Consecutive Distance
    const dist = FS.roundTo2(radius / maxValue);

    // Calculate Radiuses Array for Main Points
    let radiuses = Array(n).fill(radius + centerOffset);

    // Calculate Polygons Points
    let i;
    const points = [];
    for (i = 0; i <= maxValue; i++) {
      points.push(this._calcPolygonPoints(radiuses, angles));
      radiuses = radiuses.map((radius) => radius - dist);
    }

    // Calculate Data Points
    const dataPoints = this._calcPolygonPoints(dataRadiuses, angles);

    // Get "d" Attribute of Path for Polygons and Data Points
    let pointsAttr = points.map((item) => SVG.pathDGenerator(item));
    let dataAttr = SVG.pathDGenerator(dataPoints);

    // Calculate Text Points
    radiuses = Array(n).fill(radius + textOffset + centerOffset);
    const textPoints = this._calcPolygonPoints(radiuses, angles);

    //Calculate Ticks Points
    let ticksPoints = this._calcPolygonPoints(ticksRadiuses, ticksAngles);

    // Displace Ticks Points (Defining Displacement Vector and Value)
    const alpha = Math.PI - ((2 * ticksSide - 1) * theta) / 2;
    const disVector = { x: Math.cos(alpha), y: Math.sin(alpha) };
    const disValue = FS.createArithmeticSequence(
      initial_term,
      common_diff,
      ticks
    );
    ticksPoints = ticksPoints.map((point, index) =>
      this._displacePoint(point, disVector, disValue[index])
    );

    // Get n Random Colors (One of Return Values of Method)
    const colors = Color.getRandomColorArr(n);

    return {
      colors,
      pointsAttr,
      dataAttr,
      dataPoints,
      textPoints,
      ticksPoints,
      ticksNumbers,
    };
  }

  _calcPolygonPoints(radiuses, angles) {
    const center = this.canvas.center;
    let points = angles.map((angle, index) =>
      this._polarToCartesian(radiuses[index], angle)
    );

    return this._transformAxes(points, center, Math.PI);
  }

  // Polar Initial Coordinate System
  //             y
  //             ^
  //             |
  //             |
  //             |
  // x <---------|

  _polarToCartesian(radius, angle) {
    return {
      x: FS.roundTo2(radius * Math.sin(angle)),
      y: FS.roundTo2(radius * Math.cos(angle)),
    };
  }

  _transformAxes(points, d, theta) {
    let transformedPoints = points.map((point) =>
      FS.transformAxes(point, d, theta)
    );
    return transformedPoints;
  }

  _displacePoint(pt, u, d) {
    return {
      x: pt.x + d * u.x,
      y: pt.y + d * u.y,
    };
  }
}

module.exports = CRAAS93;
