const moment = require("moment-jalaali");
const qrCodeGenerator = require("./qrcode/qrCodeGenerator");

moment.locale("fa");
moment.loadPersian({ dialect: "persian-modern" });

// Implement String.prototype.format
String.prototype.format = function () {
  var args = arguments;
  return this.replace(/{(\d+)}/g, function (match, number) {
    return typeof args[number] != "undefined" ? args[number] : match;
  });
};

class FS {
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

  // Get the Corresponding Result from Value Acc. to Mapping Object
  static mapInRange(value, mappingObj) {
    for (let range in mappingObj) {
      let split = range.split("-");

      if (split.length === 1) {
        if (value === +split[0]) return mappingObj[range];
      } else {
        if (value <= +split[1] && value >= +split[0]) return mappingObj[range];
      }
    }
  }
}

// Classes

class Canvas {
  constructor(canvas, profileVariant) {
    this.width = canvas.width;
    this.height = canvas.height;
    this._init(canvas, profileVariant);
  }

  _init(canvas, profileVariant) {
    this.profile = { width: this.width, height: this.height };
    if (profileVariant === "with-sidebar") {
      this.header = canvas["sidebar-variant"].header;
      this.sidebar = canvas["sidebar-variant"].sidebar;
      this.profile = {
        width: this.width - this.sidebar.width,
        height: this.height - this.header.height,
      };
    }
    this.profile["padding"] = canvas.profile.padding;
  }
}

class Dataset {
  // Default Test Info for the Profile
  defaultTest = {
    answers: false,
    defaultFields: true,
    fields: [],
  };

  // Default Prerequisites to Be Shown in the Sidebar
  defaultFields = ["gender", "age", "education"];

  constructor(dataset, spec) {
    // Getting Class Fields
    const { defaultTest, defaultFields } = this;

    // Destructure Required Info from Spec of the Profile
    const { labels, test = defaultTest } = spec;

    // Specifying Prerequisites that are Going to Be Extracted
    // *** Remember That You Should Get The Copy of Arrays Taken from Spec of the Profile
    const requiredPreqs = test.defaultFields
      ? [...defaultFields, ...test.fields]
      : [...test.fields];

    this.info = {
      id: dataset.id || "-",
      title: dataset.scale?.title || "-",
      clientName: dataset.client?.name || "-",
      managerName: dataset.room?.manager?.name || "-",
      centerTitle: dataset.center?.detail?.title || "-",
      started_at:
        (dataset.started_at && this._formatDate(dataset.started_at)) || "-",
      closed_at:
        (dataset.closed_at && this._formatDate(dataset.closed_at)) || "-",
      scored_at:
        (dataset.scored_at && this._formatDate(dataset.scored_at)) || "-",
      time: (dataset.cornometer && this._formatTime(dataset.cornometer)) || "-",
      fields: this._extractFields(dataset.prerequisites, requiredPreqs),
    };

    // Extract Answers if test.answers === true
    // *** Remember That You Should Get The Copy of Arrays Taken from Dataset
    this.answers = test.answers && [...dataset.items];

    this.score = this._extractData(dataset.score, labels);
  }

  // Convert Given Timestamp to Proper Format for Profile
  _formatDate(timeStamp) {
    return moment(timeStamp * 1000).format("jYYYY.jMM.jD  -  HH:mm");
  }

  // Convert Given Time to Proper Format for Profile
  _formatTime(sec) {
    return {
      hour: Math.floor(sec / 60),
      minute: sec % 60,
    };
  }

  // Extract Fields Using the Prerequisities Array
  _extractFields(preqs, requiredPreqs) {
    // "Fields" is the Output of the Method
    const fields = [];

    let field, preq;

    requiredPreqs.forEach((reqPreq) => {
      preq = preqs.find((item) => item.label === reqPreq);
      field = { eng: reqPreq, fr: preq?.text || "-", value: "-" };
      if (preq)
        if (preq.answer.type !== "select")
          field.value = preq.user_answered || "-";
        else field.value = preq.answer.options[preq.user_answered - 1] || "-";
      fields.push(field);
    });

    return fields;
  }

  // Create Data Array with Label and Mark Taken from Dataset
  _extractData(score, labels) {
    let data = [];
    for (let index in labels) {
      data.push({
        label: { eng: index, ...labels[index] },
        mark: score[index],
      });
    }

    return data;
  }

  static merge(field1, field2, combinedFieldfr, combinedFieldFormat) {
    const newField = {
      eng: `combined_${field1.eng}_${field2.eng}`,
      fr: combinedFieldfr,
      value: combinedFieldFormat.format(field1.value, field2.value),
    };

    return newField;
  }
}

class SVG {
  // Calculate "d" Attribute for a Path Tag using Given Points Array
  static calcPathDAttr(points) {
    let d = points.reduce(
      (accumulator, point, index) =>
        accumulator + `${index === 0 ? "M " : " L "}${point.x} ${point.y}`,
      ""
    );
    d += " Z";

    return d;
  }

  // Calculate "points" Attribute for a Polygon Tag using Given Points Array
  static calcPolygonPointsAttr(points) {
    let pointsAttr = points.reduce(
      (accumulator, point) => accumulator + `${point.x},${point.y} `,
      ""
    );

    // Remove Whitespace from Both Sides of the Output String
    return pointsAttr.trim();
  }
}

// export class Color {
//   static colors = {
//     red: "#DC2626",
//     green: "#047857",
//     yellow: "#D97706",
//   };

//   static getRandomColorArr(n) {
//     const colors = Object.entries(this.colors);
//     let len = colors.length;

//     const output = [];
//     while (output.length < n) {
//       let ran = Math.floor(Math.random() * len);
//       let color = colors[ran][1];
//       if (!output.includes(color)) {
//         output.push(color);
//       }
//     }

//     return output;
//   }
// }

class Spec {
  constructor(config, profileSpec) {
    this.parameters = {
      canvas: {
        width: 1123,
        height: 794,
        profile: {
          padding: 20,
        },
        "sidebar-variant": {
          header: {
            height: 40,
            paddingX: 20,
          },
          sidebar: {
            width: 180,
            height: 754,
            iconPadding: 10,
            padding: {
              x: 20,
              y: 20,
            },
            lineHeight: {
              low: 19,
              medium: 20,
              high: 21,
            },
            icons: {
              offsetY: 27,
              paddingX: 7,
              person: {
                width: 14.22,
                ratio: 16 / 18,
              },
              calender: {
                width: 14.17,
                ratio: 15 / 18,
              },
              clock: {
                width: 14.53,
                ratio: 16 / 16,
              },
            },
            fields: {
              lineHeight: 20,
              offsetY: 46,
              paddingX: 11,
            },
            qrcode: {
              width: 80,
              get height() {
                return this.width;
              },
            },
          },
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

class Profile {
  constructor() {
    if (this.constructor.name === "Profile")
      throw new Error("Can't Instantiate Abstract Class");
  }

  _init(dataset, profileVariant, config) {
    this.spec = new Spec(config, this.profileSpec);
    const { canvas } = this.spec.parameters;
    this.canvas = new Canvas(canvas, profileVariant);
    this.dataset = new Dataset(dataset, this.spec.parameters);
    if (profileVariant === "with-sidebar") this._generateQRCode();
    this.context = this._calcContext();
  }

  _generateQRCode() {
    const { dataset, canvas } = this;
    const width = canvas.sidebar?.qrcode?.width || 120;
    const height = canvas.sidebar?.qrcode?.height || 120;
    const data = `https://r1l.ir/${dataset.info.id}/?utm_source=risloo.ir&utm_medium=profile&utm_campaign=${dataset.info.id}`;
    this.qrcode = { link: data, svg: qrCodeGenerator(data, { width, height }) };
  }

  getTemplateEngineParams() {
    const {
      canvas,
      dataset,
      spec: { parameters: spec },
      qrcode,
      context,
    } = this;

    return {
      canvas,
      dataset,
      spec,
      qrcode,
      ...context,
    };
  }
}

module.exports = { Profile, SVG, Dataset, FS };
