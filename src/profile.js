import moment from "moment-jalaali";
import fa from "moment/src/locale/fa";

moment.locale("fa", fa);
moment.loadPersian({ dialect: "persian-modern" });

export class FS {
  static calcDistance(pt1, pt2) {
    return Math.sqrt(Math.pow(pt2.x - pt1.x, 2) + Math.pow(pt2.y - pt1.y, 2));
  }

  static toDegrees(rad) {
    return rad * (180 / Math.PI);
  }

  static toRadians(deg) {
    return deg * (Math.PI / 180);
  }

  static isOdd(n) {
    return !!(n % 2);
  }

  // Create a Line Using the Two Points and Return It As A Function
  static createLine(pt1, pt2) {
    let m = (pt2.y - pt1.y) / (pt2.x - pt1.x);
    let intercept = -m * pt1.x + pt1.y;

    return function (point) {
      return m * point + intercept;
    };
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

  // Round to 2 Decimal Places
  static roundTo2(n) {
    return +n.toFixed(2);
  }

  // Rotate Axes of 2D Coordinate System for a Point (Counterclockwise)

  static rotateAxes(pt, theta) {
    return {
      x: FS.roundTo2(pt.x * Math.cos(theta) - pt.y * Math.sin(theta)),
      y: FS.roundTo2(pt.x * Math.sin(theta) + pt.y * Math.cos(theta)),
    };
  }

  // Translate Axes of 2D Coordinate System for a Point

  static translateAxes(pt, d) {
    return { x: FS.roundTo2(pt.x - d.x), y: FS.roundTo2(pt.y - d.y) };
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
  constructor(width, height, padding, header, footer) {
    this.width = width;
    this._height = height;
    this.padding = padding;
    this.header = header;
    this.footer = footer;
    this.center = this._computeCenter();
    this._computeHeaderHeight();
    this._computeWidthAndHeight();
  }

  get height() {
    return this._height;
  }

  set height(value) {
    this._height = value;
    this.center = this._computeCenter();
    this._computeWidthAndHeight();
  }

  _computeHeaderHeight() {
    const { header } = this;

    let headerHeight = header.heights.reduce(
      (sum, current) => sum + current,
      0
    );

    this.headerHeight = headerHeight;
  }

  _computeCenter() {
    const { width, _height } = this;

    return { x: width / 2, y: _height / 2 };
  }

  _computeWidthAndHeight() {
    const { width, _height, footer, headerHeight } = this;

    let computedWidth = width;
    let computedHeight = _height + headerHeight + footer.height;

    // let computedLength = Math.max(tempWidth, tempHeight);

    this.computedWidth = computedWidth;
    this.computedHeight = computedHeight;
  }
}

class Dataset {
  static clean(dataset, labels) {
    // Destructure Data that is Needed
    const {
      id,
      scale: { title },
      client: { name },
      center: {
        detail: { title: centerTitle },
      },
      started_at,
      cornometer: time,
      prerequisites,
      score,
    } = dataset;

    // Specifying Fields that are Going to Be Extracted (gender, age, education, marital status)
    let fields = { gender: "", age: "", education: "", marital_status: "" };
    let keys = Object.values(labels);
    let values = [];

    // Extract Fields
    for (let elem in fields) {
      let temp = prerequisites.find((item) => item.label === elem);
      if (elem === "age") fields[elem] = temp.user_answered;
      else fields[elem] = temp.answer.options[temp.user_answered - 1];
    }

    // Assign Score Values Acc. to Labels Order
    for (let index in labels) {
      values.push(score[index]);
    }

    // Change Timestamp to Proper Date Format
    let date = moment(started_at * 1000).format("dddd، jD jMMMM jYYYY");

    return {
      info: { id, title, name, centerTitle, time, date, ...fields },
      score: { keys, values },
    };
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
    red: "#DC2626",
    green: "#047857",
    yellow: "#D97706",
  };

  static getRandomColorArr(n) {
    const colors = Object.entries(this.colors);
    let len = colors.length;

    const output = [];
    while (output.length < n) {
      let ran = Math.floor(Math.random() * len);
      let color = colors[ran][1];
      if (!output.includes(color)) {
        output.push(color);
      }
    }

    return output;
  }
}

class Spec {
  constructor(config, profileSpec) {
    this.parameters = {
      canvas: {
        width: 1024,
        height: 844,
        padding: 80,
        header: {
          heights: [40, 70, 40],
          paddingX: 20,
          iconPadding: 10,
          textYPadding: 11,
        },
        footer: {
          height: 30,
        },
      },
      ...profileSpec,
    };
    this._setConfig(config);
  }

  // Deep Merge (Not Implemented Yet)
  _setConfig(config) {
    const { parameters } = this;

    Object.assign(parameters, config);
  }
}

export class Profile {
  constructor(dataset, config = {}, profileSpec) {
    if (this.constructor.name === "Profile")
      throw new Error("Can't Instantiate Abstract Class");
    this.spec = new Spec(config, profileSpec);
    const { width, height, padding, header, footer } =
      this.spec.parameters.canvas;
    this.canvas = new Canvas(width, height, padding, header, footer);
    this.dataset = Dataset.clean(
      dataset,
      this.spec.parameters[this.constructor.name].labels
    );
    this.context = this._calcContext();
  }

  getTemplateEngineParams() {
    const {
      canvas,
      dataset,
      spec: {
        parameters: { [this.constructor.name]: spec },
      },
      context,
    } = this;

    return {
      canvas,
      dataset,
      spec,
      ...context,
    };
  }
}
