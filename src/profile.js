import moment from 'moment-jalaali';
import fa from "moment/src/locale/fa";

moment.locale("fa", fa);
moment.loadPersian({dialect: 'persian-modern'})

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

  static isOdd(n) {
    return !!(n % 2);
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
    this.height = height;
    this.padding = padding;
    this.header = header;
    this.footer = footer;
    this.center = { x: this.width / 2, y: this.height / 2 };
    this._computeWidthAndHeight();
  }

  _computeWidthAndHeight() {
    const { width, height, header, footer } = this;

    let headerHeight = header.heights.reduce(
      (sum, current) => sum + current,
      0
    );

    let tempWidth = width;
    let tempHeight = height + headerHeight + footer.height;

    let computedLength = Math.max(tempWidth, tempHeight);

    this.computedWidth = computedLength;
    this.computedHeight = computedLength;
    this.headerHeight = headerHeight;
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
    let date = moment(started_at * 1000).format('dddd، jD jMMMM jYYYY');

    return { info: { id, title, name, centerTitle, time, date, ...fields }, score: { keys, values } };
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

class Spec {
  constructor(config) {
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
      // CRAAS93 == radar chart
      CRAAS93: {
        maxValue: 20,
        textOffset: 35,
        centerOffset: 35,
        ticks: 5,
        ticksLength: 12,
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
      OBQ4493: {
        maxValues: {
          CP: 15,
          ICT: 16,
          RT: 21,
          PC: 30,
          G: 48,
          Total: 132,
        },
        length: 5,
        labels: {
          complete_performance: "CP",
          important_and_control_of_thought: "ICT",
          responsibility_and_threat_estimation: "RT",
          perfectionism_certainty: "PC",
          general: "G",
          raw: "Total",
        },
      },
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
  constructor(dataset, config) {
    this.spec = new Spec(config);
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
