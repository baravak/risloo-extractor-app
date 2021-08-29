export class FS {
  static calcDistance(pt1, pt2) {
    return Math.sqrt(Math.pow(pt2.x - pt1.x, 2) + Math.pow(pt2.y - pt1.y, 2));
  }

  static toDegrees(rad) {
    return rad * (180 / PI);
  }

  static toRadians(deg) {
    return deg * (PI / 180);
  }

  // Create Arithmetic Sequence for Angles of Polygon

  static createArithmeticSequence(a_0, d, n) {
    let i;
    let arr = [];
    for (i = 0; i < n; i++) {
      arr.push(a_0 + i * d);
    }
    return arr;
  }

  // Rotate Axes of 2D Coordinate System for a Point (Counterclockwise)

  static rotateAxes(pt, theta) {
    return {
      x: Math.round(pt.x * Math.cos(theta) - pt.y * Math.sin(theta)),
      y: Math.round(pt.x * Math.sin(theta) + pt.y * Math.cos(theta)),
    };
  }

  // Translate Axes of 2D Coordinate System for a Point

  static translateAxes(pt, d) {
    return { x: Math.round(pt.x - d.x), y: Math.round(pt.y - d.y) };
  }

  // Transform Axes of 2D Coordinate System for a Point

  static transformAxes(pt, d, theta) {
    return FS.rotateAxes(FS.translateAxes(pt, d), theta);
  }

  // Check Whether an Object is Empty
  static isEmpty(obj) {
    return Object.keys(obj).length === 0;
  }
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

export class Dataset {
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

export class SVG {
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

export class Color {
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

class Defaults {
  constructor(config) {
    this.parameters = {
      canvas: {
        width: 800,
        height: 800,
        padding: 100,
      },
      polygonChart: {
        global: {
          maxValue: 20,
          textOffset: 40,
          centerOffset: 50,
          innerPolygonNum: 20,
        },
      },
    };
    this._setConfig(config);
  }

  _setConfig(config) {
    const { parameters } = this;

    Object.assign(parameters, config);
  }
}

export class Chart {
  constructor(config) {
    this.defaults = new Defaults(config);
    const { width, height, padding } = this.defaults.parameters.canvas;
    this.canvas = new Canvas(width, height, padding);
  }
}
