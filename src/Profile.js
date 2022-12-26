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

  static isObject(item) {
    return item && typeof item === "object" && !Array.isArray(item);
  }

  static deepMerge(target, source) {
    if (FS.isObject(target) && FS.isObject(source)) {
      for (const key in source) {
        const descriptor = Object.getOwnPropertyDescriptor(source, key);
        if (FS.isObject(source[key]) && !(descriptor["get"] || descriptor["set"])) {
          if (!target[key]) Object.assign(target, { [key]: {} });
          FS.deepMerge(target[key], source[key]);
        } else {
          Object.defineProperties(target, {
            [key]: descriptor,
          });
        }
      }
    }
  }
}

// Classes

class Canvas {
  constructor(canvas, variant) {
    this.width = canvas.width;
    this.height = canvas.height;
    this._init(canvas, variant);
  }

  _init(canvas, variant) {
    this.profile = { width: this.width, height: this.height };
    if (variant === "with-sidebar") {
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
  // Default Sample Info for the Profile
  defaultSample = {
    questions: false,
    defaultFields: true,
    fields: [],
  };

  // Default Prerequisites to Be Shown in the Sidebar
  defaultFields = ["gender", "age", "education"];

  constructor(dataset, spec) {
    // Getting Class Fields
    const { defaultSample, defaultFields } = this;

    // Destructure Required Info from Spec of the Profile
    const { labels, sample = defaultSample } = spec;

    // Specifying Prerequisites that are Going to Be Extracted
    // *** Remember That You Should Get The Copy of Arrays Taken from Spec of the Profile
    const requiredPreqs = sample.defaultFields ? [...defaultFields, ...sample.fields] : [...sample.fields];

    this.info = {
      id: dataset.id || "-",
      title: dataset.scale?.title || "-",
      clientName: dataset.client?.name || "-",
      managerName: dataset.room?.manager?.name || "-",
      centerTitle: dataset.room?.center?.detail?.title || "-",
      started_at: (dataset.started_at && this._formatDate(dataset.started_at)) || "-",
      closed_at: (dataset.closed_at && this._formatDate(dataset.closed_at)) || "-",
      scored_at: (dataset.scored_at && this._formatDate(dataset.scored_at)) || "-",
      time: this._formatTime(dataset.cornometer) || "-",
      fields: this._extractFields(dataset.prerequisites, requiredPreqs),
    };

    // Extract Questions if sample.questions === true
    // *** Remember That You Should Get The Copy of Arrays Taken from Dataset
    this.questions = sample.questions && [...dataset.items];

    this.score = this._extractData(dataset.score, labels);
  }

  // Convert Given Timestamp to Proper Format for Profile
  _formatDate(timeStamp) {
    return moment(timeStamp * 1000).format("jYYYY.jMM.jDD  -  HH:mm");
  }

  // Convert Given Time to Proper Format for Profile
  _formatTime(sec) {
    const time = {
      hour: Math.floor(sec / 60),
      minute: sec % 60,
    };

    return (
      (time.hour ? `${time.hour} ساعت` : "") +
      (time.hour && time.minute ? " و " : "") +
      (time.minute ? `${time.minute} دقیقه` : "")
    );
  }

  // Extract Fields Using the Prerequisities Array
  _extractFields(preqs, requiredPreqs) {
    // "Fields" is the Output of the Method
    const fields = [];

    let field;

    requiredPreqs.forEach((reqPreq) => {
      if ((FS.isObject(reqPreq) && reqPreq["eng"]) || !FS.isObject(reqPreq)) field = this._extractField(preqs, reqPreq);
      else field = this._mergeFields(preqs, reqPreq);
      fields.push(field);
    });

    return fields;
  }

  _extractField(preqs, reqPreq) {
    let engLabel = reqPreq.eng || reqPreq;
    let preq = preqs?.find((item) => item.label === engLabel);
    return { eng: engLabel, fr: reqPreq.fr || preq?.text || "-", value: this._extractValue(preq) };
  }

  _mergeFields(preqs, reqPreq) {
    let values = reqPreq["merge"].map((label) => {
      let preq = preqs.find((item) => item.label === label);
      return this._extractValue(preq);
    });
    return { eng: reqPreq["merge"].join("+"), fr: reqPreq.fr, value: reqPreq.valueFormat.format(...values) };
  }

  _extractValue(preq) {
    let val;

    if (preq?.answer.type !== "select") val = preq?.user_answered || "-";
    else val = preq?.answer.options[preq.user_answered - 1] || "-";

    return val;
  }

  // Create Data Array with Label and Mark Taken from Dataset
  _extractData(score, labels) {
    return labels.map((label) => ({ label, mark: score[label.eng] }));
  }

  // Group By Special Property of the Label of the Dataset Score
  groupBy(prop) {
    const { score } = this;

    const scoreGroups = score.reduce((groups, data, index) => {
      const group = groups.find((group) => group[0].label[prop] === data.label[prop] && data.label[prop] !== "-");
      if (group) group.push(data);
      else groups.push([data]);
      return groups;
    }, []);

    return scoreGroups;
  }
}

class Mappings extends Array {
  addMapping(range, value) {
    this.push({ range, value });
    return this;
  }

  map(val) {
    const me = this;
    for (let mapping of me) {
      const splitted = mapping.range.split("-");
      if (splitted.length === 1) {
        if (+splitted[0] === val) return mapping.value;
      } else if (+splitted[0] <= val && val <= +splitted[1]) {
        return mapping.value;
      }
    }
  }
}

class Ticks {
  constructor(min, max, n) {
    this.numbers = this._calcNumbers(min, max, n);
  }

  _calcNumbers(min, max, n) {
    let output = [min];
    const commonDiff = FS.roundTo2((max - min) / (n - 1));
    output.push(...FS.createArithmeticSequence(min + commonDiff, commonDiff, n - 2), max);
    return output;
  }
}

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

  _setConfig(config) {
    const { parameters } = this;

    FS.deepMerge(parameters, config);
  }
}

class Profile {
  constructor() {
    if (this.constructor.name === "Profile") throw new Error("Can't Instantiate Abstract Class");
  }

  _init(dataset, options, config) {
    const { variant, measure } = options;
    this.variant = variant;
    this.measure = measure;

    this.spec = new Spec(config, this.profileSpec);
    const { canvas } = this.spec.parameters;
    this.canvas = new Canvas(canvas, variant);

    this.dataset = new Dataset(dataset, this.spec.parameters);

    if (this.variant === "with-sidebar") this._generateQRCode();

    this.contextArr = this._calcContext();
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
      variant,
      measure,
      canvas,
      dataset,
      spec: { parameters: spec },
      qrcode,
      contextArr,
    } = this;

    return contextArr.map((context, index) => ({
      page: index + 1,
      canvas,
      dataset,
      spec,
      qrcode,
      ...context,
      variant,
      measure,
    }));
  }
}

module.exports = { Profile, Dataset, FS, Ticks, Mappings };
