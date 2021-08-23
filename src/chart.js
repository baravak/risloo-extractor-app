const dataset = [
  {
    label: "نزدیک بودن",
    subLabel: "(دلبستگی ایمن)",
    data: 4,
  },
  {
    label: "اضطراب",
    subLabel: "(دلبستگی اضطرابی - دوسوگرا)",
    data: 9,
  },
  {
    label: "وابستگی",
    subLabel: "(دلبستگی اجتنابی)",
    data: 15,
  },
];

// Constants

const WIDTH = 500;
const HEIGHT = 500;
const PADDING = 40;

const PI = Math.PI;
const sqrt = Math.sqrt;
const pow = Math.pow;
const round = Math.round;
const sin = Math.sin;
const cos = Math.cos;
const tan = Math.tan;

// Functions

function calcDistance(pt1, pt2) {
  return sqrt(pow(pt2.x - pt1.x, 2) + pow(pt2.y - pt1.y, 2));
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
    x: round(pt.x * cos(theta) - pt.y * sin(theta)),
    y: round(pt.x * sin(theta) + pt.y * cos(theta)),
  };
}

// Translate Axes of 2D Coordinate System for a Point

function translateAxes(pt, d) {
  return { x: round(pt.x - d.x), y: round(pt.y - d.y) };
}

// Transform Axes of 2D Coordinate System for a Point

function transformAxes(pt, d, theta) {
  return rotateAxes(translateAxes(pt, d), theta);
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
  static drawPath(points, fill, stroke) {
    // let n = points.length;
    // let output = '<path d="M';
    // output = points.reduce((accumulator, point, index) => accumulator + ` ${point.x} ${point.y} ${index == (n-1) ? : }`, output);
  }

  _createTag(name, attributes, selfClosing = true) {
    let begin = `<${name} `;
    let attributeString = Object.entries(attributes).reduce(
      (accumulator, item) => accumulator + `${item[0]}="${item[1]}" `,
      ""
    );
    let end = selfClosing ? "/>" : ``;
  }

  _appendChild(parent, child) {}

  static toXML(tagObj, space = 2) {
    const { name, attributes, selfClosing, children } = tagObj;
    let spaceString = "".padEnd(space, " ");

    let objXML = `<${name}`;

    let attributeString = Object.entries(attributes).reduce(
      (accumulator, item) => accumulator + ` ${item[0]}="${item[1]}"`,
      ""
    );

    objXML += attributeString;

    if (selfClosing) {
      objXML += " />\n";
      return objXML;
    }

    objXML += ">\n";

    for (const item of children) {
      let child = SVG.toXML(item)
        .split("\n")
        .map(
          (member) => (member ? spaceString + member : member)
        )
        .join("\n");
      objXML += child;
    }

    objXML += `</${name}>\n`;

    return objXML;
  }
}

class Chart {
  constructor() {
    this.canvas = new Canvas(WIDTH, HEIGHT, PADDING);
  }
}

class PolygonChart extends Chart {
  constructor(
    dataset,
    max_value = 20,
    innerPolygonNum = 10,
    centerOffset = 20,
    textOffset = 20
  ) {
    super();
    const me = this;
    dataset = new Dataset(max_value, dataset);
    this.dataValues = dataset.dataPoints.map(
      (item) => item.data / dataset.max_value
    );
    this.n = dataValues.length;
    this.consecutiveDistance = round((radius - centerOffset) / innerPolygonNum);
    this.innerPolygonNum = innerPolygonNum;
    this.textOffset = textOffset;
    this.center = me.canvas.center;
    this.radius = me.canvas.height / 2 - me.canvas.padding;
    this.angles = createArithmeticSequence(0, (2 * PI) / n, n);
    this.mainPoints = me._calcMainPolygonPoints();
    this.innerPoints = me._calcInnerPolygonPoints();
    this.dataPoints = me._calcDataPoints();
    this.textPoints = me._calcTextPoints();
  }

  _calcMainPolygonPoints() {
    const { radius, angles, n } = this;
    const radiuses = Array(n).fill(radius);

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
    const radiuses = Array(n).fill(radius);

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
    const { radius, angles, textOffset } = this;
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
      x: round(radius * sin(angle)),
      y: round(radius * cos(angle)),
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
  SVG,
  PolygonChart,
};

export default chart;
