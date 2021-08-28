// Constants

const WIDTH = 800;
const HEIGHT = 800;
const PADDING = 100;

const PI = Math.PI;

// Functions

function calcDistance(pt1, pt2) {
  return Math.sqrt(Math.pow(pt2.x - pt1.x, 2) + Math.pow(pt2.y - pt1.y, 2));
}

function toDegrees(rad) {
  return rad * (180 / PI);
}

function toRadians(deg) {
  return deg * (PI / 180);
}

// Create Arithmetic Sequence for Angles of Polygon

function createArithmeticSequence(a_0, d, n) {
  let i;
  let arr = [];
  for (i = 0; i < n; i++) {
    arr.push(a_0 + i * d);
  }
  return arr;
}

// Rotate Axes of 2D Coordinate System for a Point (Counterclockwise)

function rotateAxes(pt, theta) {
  return {
    x: Math.round(pt.x * Math.cos(theta) - pt.y * Math.sin(theta)),
    y: Math.round(pt.x * Math.sin(theta) + pt.y * Math.cos(theta)),
  };
}

// Translate Axes of 2D Coordinate System for a Point

function translateAxes(pt, d) {
  return { x: Math.round(pt.x - d.x), y: Math.round(pt.y - d.y) };
}

// Transform Axes of 2D Coordinate System for a Point

function transformAxes(pt, d, theta) {
  return rotateAxes(translateAxes(pt, d), theta);
}

// Check Whether an Object is Empty
function isEmpty(obj) {
  return Object.keys(obj).length === 0;
}

// Classes

class Canvas {
  constructor(width, height, padding) {
    const me = this;
    this.width = width;
    this.height = height;
    this.padding = padding;
    this.center = { x: me.width / 2, y: me.height / 2 };
  }
}

class Dataset {
  constructor(max_value, dataPoints = []) {
    this.max_value = max_value;
    this.dataPoints = dataPoints;
  }

  addData(label, subLabel, value) {
    let data = {
      label,
      subLabel,
      value,
    };
    this.dataPoints.push(data);
  }
}

class SVG {
  static pathDGenerator(points) {
    const reducer = (accumulator, point, index) => {
      if (index === 0) return accumulator + `M ${point.x} ${point.y}`;
      else return accumulator + ` L ${point.x} ${point.y}`;
    };
    let d = points.reduce(reducer, "");
    d += " Z";

    return d;
  }
}

class Color {
  static colors = {
    red: "#f44336",
    pink: "#e91e63",
    purple: "#9c27b0",
    indigo: "#3f51b5",
    blue: "#2196f3",
    lightBlue: "#03a9f4",
    cyan: "#009688",
    green: "#4caf50",
    lime: "#cddc39",
    yellow: "#ffeb3b",
    orange: "#ff9800",
    brown: "#795548",
  };

  static getRandomColorArr(n) {
    const colors = Object.entries(this.colors);
    let len = colors.length;

    const output = [];
    while (output.length < n) {
      let ran = Math.floor(Math.random() * len);
      let color = colors[ran][0];
      if (!output.includes(color)) {
        output.push(color);
      }
    }

    return output;
  }
}

class Chart {
  constructor() {
    this.canvas = new Canvas(WIDTH, HEIGHT, PADDING);
  }
}

class RadarChart extends Chart {
  constructor(dataset) {
    super();
    const me = this;
    this.defaults = me.defaults.parameters.polygonChart;
    this.dataset = new Dataset(me.defaults.global.maxValue, dataset);
    this.innerPolygonNum = me.defaults.global.innerPolygonNum;
    this.textOffset = me.defaults.global.textOffset;
    this.centerOffset = me.defaults.global.centerOffset;
    this.center = me.canvas.center;
    this.radius = me.canvas.height / 2 - me.canvas.padding;
    this.dataValues = me.dataset.dataPoints.map(
      (item) => (item.data / me.dataset.max_value) * me.radius
    );
    this.n = me.dataValues.length;
    this.consecutiveDistance = Math.round(
      (me.radius - me.centerOffset) / me.innerPolygonNum
    );
    this.angles = createArithmeticSequence(0, (2 * PI) / me.n, me.n);
    this.colors = Color.getRandomColorArr(me.n);
    this.mainPoints = me._calcMainPolygonPoints();
    this.innerPoints = me._calcInnerPolygonPoints();
    this.dataPoints = me._calcDataPoints();
    this.textPoints = me._calcTextPoints();
  }

  _calcMainPolygonPoints() {
    const { radius, angles, n } = this;
    let radiuses = Array(n).fill(radius);

    return this._calcPolygonPoints(radiuses, angles);
  }

  _calcInnerPolygonPoints() {
    const {
      radius,
      angles,
      n,
      consecutiveDistance: dist,
      innerPolygonNum: num,
    } = this;
    let radiuses = Array(n).fill(radius);

    let i;
    let arr = [];
    for (i = 0; i <= num; i++) {
      radiuses = radiuses.map((radius) => radius - dist);
      arr.push(this._calcPolygonPoints(radiuses, angles));
    }

    return arr;
  }

  _calcDataPoints() {
    const { dataValues, angles } = this;

    return this._calcPolygonPoints(dataValues, angles);
  }

  _calcTextPoints() {
    const { radius, angles, textOffset, n } = this;
    const radiuses = Array(n).fill(radius + textOffset);

    return this._calcPolygonPoints(radiuses, angles);
  }

  _calcPolygonPoints(radiuses, angles) {
    let points = angles.map((angle, index) =>
      this._polarToCartesian(radiuses[index], angle)
    );

    points = this._transformAxes(points, this.center, PI);

    return points;
  }

  _polarToCartesian(radius, angle) {
    return {
      x: Math.round(radius * Math.sin(angle)),
      y: Math.round(radius * Math.cos(angle)),
    };
  }

  _transformAxes(points, d, theta) {
    let transformedPoints = points.map((point) =>
      transformAxes(point, d, theta)
    );
    return transformedPoints;
  }
}

const chart = {
  RadarChart,
  SVG,
  Color,
};

module.exports = chart;
