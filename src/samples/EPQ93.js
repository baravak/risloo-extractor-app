const { Profile, FS } = require("../Profile");

class EPQ93 extends Profile {
  // Number of pages
  static pages = 1;

  // Labels of the sample
  labels = {
    L1: { eng: "psychoticism", fr: "روان‌گسسته‌گرایی", code: "P", maxValue: 25, fill: "#CA8A04" },
    L2: { eng: "extraversion", fr: "برون‌گرایی", code: "E", maxValue: 21, fill: "#0891B2" },
    L3: { eng: "neuroticism", fr: "روان‌آزرده‌گرایی", code: "N", maxValue: 23, fill: "#4F46E5" },
    L4: { eng: "lie", fr: "دروغ", code: "L", maxValue: 21, fill: "#E11D48" },
  };

  profileSpec = {
    /* "sample" determines some important info about the sample and profile */
    /* Default prerequisites: 1. gender, 2. age, 3. education */
    /* "prerequisites" is synonym to "fields" in our program */
    sample: {
      name: "پرسشنامه شخصیت آیسنک بزرگسالان" /* Name of the sample */,
      multiProfile: false /* Whether the sample has multiple profiles or not */,
      questions: false /* Determines whether to get questions from inital dataset or not */,
      defaultFields: true /* Determines whether to have default prerequisites in the profile or not */,
      fields: [] /* In case you want to get some additional fields and show in the profile */,
    },
    /* "profile" determines the dimensions of the drawn profile (to be used in svg tag viewbox) */
    /* calculating its dimensions carefully is of great importance */
    profile: {
      get dimensions() {
        return {
          width: 792 + 2 * this.padding.x,
          height: 633 + 2 * this.padding.y,
        };
      },
      padding: {
        x: 55.5,
        y: 40.5,
      },
    },
    item: {
      circle: {
        R: 70 /* Radius of the outer circle of the raw element */,
        r: 49 /* Radius of the inner circle of the raw element */,
        brs: {
          tl: 6 /* Top left border radius */,
          bl: 6 /* Bottom left border radius */,
          tr: 6 /* Top right border radius */,
          br: 6 /* Bottom right border radius */,
        } /* Border radiuses at each end of the gauge of the raw element */,
        angles: {
          start: FS.toRadians(-90),
          end: FS.toRadians(180),
        } /* Angles of each end of the raw element */,
        direction: false /* Clockwise direction for the raw gauge element */,
        get totalAngle() {
          return this.direction
            ? 2 * Math.PI - (this.angles.end - this.angles.start)
            : this.angles.end - this.angles.start;
        },
      },
      ticks: {
        num: 2 /* Number of ticks */,
        number: {
          offset: 12 /* Offset from the line */,
        },
      },
    },
    /* "labels" part which has to be provided for each profile */
    labels: Object.values(this.labels),
  };

  col9 = false;

  constructor(dataset, options, config = {}) {
    super();
    let gender = "2";
    for (let i = 0; i < dataset.prerequisites.length; i++) {
      if (dataset.prerequisites[i].label == "gender") {
        gender = dataset.prerequisites[i].user_answered;
        break;
      }
    }
    if (this.constructor.name == "EPQ9A") {
      this.labels.L1.maxValue = 17;
      this.labels.L2.maxValue = 24;
      this.labels.L3.maxValue = 20;
      this.labels.L4.maxValue = 20;
      this.profileSpec.sample.name = "پرسشنامه شخصیت آیسنک کودکان";
      if (gender == "2") {
        this.col9 = true;
        this.profileSpec.profile = {
          get dimensions() {
            return {
              width: 792 + 2 * this.padding.x,
              height: 673 + 2 * this.padding.y,
            };
          },
          padding: {
            x: 55.5,
            y: 20.5,
          },
        };
      }
    }

    this._init(dataset, options, config);
  }

  _calcContext() {
    const {
      spec: { parameters: spec },
      dataset,
    } = this;

    const { item: rawSpec } = spec;

    const items = dataset.score.reverse().map((item) => {
      const rawTicksNumbers = FS.createArithmeticSequence(
        item.label.maxValue,
        -item.label.maxValue / (rawSpec.ticks.num - 1),
        rawSpec.ticks.num
      ).reverse();
      return {
        label: item.label,
        mark: item.mark,
        zeta: (item.mark / item.label.maxValue) * rawSpec.circle.totalAngle + rawSpec.circle.angles.start,
        ticks: rawTicksNumbers.map((tick) => ({
          number: tick,
          angle: (tick / item.label.maxValue) * rawSpec.circle.totalAngle + rawSpec.circle.angles.start,
        })),
      };
    });
    const table = {
      adult: {
        male: [
          {
            age: "16",
            factors: {
              l: { avg: 11.76, sd: 2.04 },
              n: { avg: 13.71, sd: 2.03 },
              e: { avg: 13.49, sd: 1.64 },
              p: { avg: 6.55, sd: 1.75 },
            },
          },
          {
            age: "17",
            factors: {
              l: { avg: 11.7, sd: 2.9 },
              n: { avg: 12.98, sd: 2.31 },
              e: { avg: 12.95, sd: 1.66 },
              p: { avg: 6.43, sd: 1.5 },
            },
          },
          {
            age: "18",
            factors: {
              l: { avg: 12.28, sd: 2.18 },
              n: { avg: 13.41, sd: 2.3 },
              e: { avg: 12.26, sd: 1.6 },
              p: { avg: 6.02, sd: 2.78 },
            },
          },
          {
            age: "19",
            factors: {
              l: { avg: 11.7, sd: 1.95 },
              n: { avg: 13.6, sd: 2.23 },
              e: { avg: 12.21, sd: 1.27 },
              p: { avg: 6, sd: 1.48 },
            },
          },
          {
            age: "20-29",
            factors: {
              l: { avg: 11.68, sd: 1.99 },
              n: { avg: 12.16, sd: 2.15 },
              e: { avg: 11.72, sd: 1.52 },
              p: { avg: 5.61, sd: 1.98 },
            },
          },
          {
            age: "30-39",
            factors: {
              l: { avg: 12.02, sd: 1.87 },
              n: { avg: 11.7, sd: 1.78 },
              e: { avg: 11.94, sd: 1.43 },
              p: { avg: 7.7, sd: 2.13 },
            },
          },
          {
            age: "40-49",
            factors: {
              l: { avg: 11.24, sd: 3.28 },
              n: { avg: 11.4, sd: 1.82 },
              e: { avg: 11, sd: 1.45 },
              p: { avg: 8.9, sd: 2.03 },
            },
          },
          {
            age: "50-59",
            factors: {
              l: { avg: 10.5, sd: 1.58 },
              n: { avg: 12.51, sd: 1.79 },
              e: { avg: 10.11, sd: 0.4 },
              p: { avg: 5.3, sd: 1.77 },
            },
          },
        ],
        female: [
          {
            age: 16,
            factors: {
              l: { avg: 11.02, sd: 2.35 },
              n: { avg: 14.7, sd: 2.2 },
              e: { avg: 11.6, sd: 1.64 },
              p: { avg: 5.15, sd: 1.58 },
            },
          },
          {
            age: 17,
            factors: {
              l: { avg: 11.92, sd: 1.98 },
              n: { avg: 15.17, sd: 2.02 },
              e: { avg: 12.23, sd: 1.81 },
              p: { avg: 5.05, sd: 1.37 },
            },
          },
          {
            age: 18,
            factors: {
              l: { avg: 11.94, sd: 2.14 },
              n: { avg: 15.66, sd: 2 },
              e: { avg: 12.3, sd: 1.81 },
              p: { avg: 5.39, sd: 1.38 },
            },
          },
          {
            age: 19,
            factors: {
              l: { avg: 12, sd: 2.08 },
              n: { avg: 16.13, sd: 2.02 },
              e: { avg: 12.5, sd: 1.82 },
              p: { avg: 5.34, sd: 1.52 },
            },
          },
          {
            age: "20-29",
            factors: {
              l: { avg: 12.97, sd: 1.98 },
              n: { avg: 14.99, sd: 2.35 },
              e: { avg: 9.89, sd: 1.8 },
              p: { avg: 5.04, sd: 1.35 },
            },
          },
          {
            age: "30-39",
            factors: {
              l: { avg: 13.65, sd: 2.81 },
              n: { avg: 13.79, sd: 5.31 },
              e: { avg: 13.74, sd: 1.55 },
              p: { avg: 4.7, sd: 2.65 },
            },
          },
          {
            age: "40-49",
            factors: {
              l: { avg: 13.85, sd: 3.65 },
              n: { avg: 13.85, sd: 4.5 },
              e: { avg: 12.05, sd: 3.37 },
              p: { avg: 4.88, sd: 2.71 },
            },
          },
          {
            age: "50-59",
            factors: {
              l: { avg: 14.7, sd: 3.82 },
              n: { avg: 13.16, sd: 5.7 },
              e: { avg: 11.26, sd: 3.94 },
              p: { avg: 5.13, sd: 3.24 },
            },
          },
        ],
      },
      children: {
        male: [
          {
            age: 7,
            factors: {
              l: { avg: 15.84, sd: 2.8 },
              n: { avg: 8.84, sd: 4.7 },
              e: { avg: 16.8, sd: 3 },
              p: { avg: 4.3, sd: 3.6 },
            },
          },
          {
            age: 8,
            factors: {
              l: { avg: 16.09, sd: 6.4 },
              n: { avg: 7.96, sd: 3.5 },
              e: { avg: 17.16, sd: 2.7 },
              p: { avg: 3.75, sd: 2.4 },
            },
          },
          {
            age: 9,
            factors: {
              l: { avg: 16.9, sd: 3 },
              n: { avg: 6.44, sd: 3 },
              e: { avg: 16.88, sd: 2.7 },
              p: { avg: 4.68, sd: 3.6 },
            },
          },
          {
            age: 10,
            factors: {
              l: { avg: 15.93, sd: 3.4 },
              n: { avg: 8.35, sd: 3.7 },
              e: { avg: 17.19, sd: 2.9 },
              p: { avg: 3.78, sd: 2 },
            },
          },
          {
            age: 11,
            factors: {
              l: { avg: 16.61, sd: 3.6 },
              n: { avg: 8.9, sd: 3.9 },
              e: { avg: 17.82, sd: 3 },
              p: { avg: 4.22, sd: 2.2 },
            },
          },
          {
            age: 12,
            factors: {
              l: { avg: 14.12, sd: 5 },
              n: { avg: 8.92, sd: 3.9 },
              e: { avg: 17.74, sd: 3 },
              p: { avg: 3.69, sd: 2.5 },
            },
          },
          {
            age: 13,
            factors: {
              l: { avg: 14.02, sd: 4.4 },
              n: { avg: 9.37, sd: 4 },
              e: { avg: 17.33, sd: 3.2 },
              p: { avg: 3.65, sd: 2.4 },
            },
          },
          {
            age: 14,
            factors: {
              l: { avg: 13.23, sd: 4.6 },
              n: { avg: 9.34, sd: 3.5 },
              e: { avg: 17.3, sd: 3 },
              p: { avg: 4.5, sd: 3 },
            },
          },
          {
            age: 15,
            factors: {
              l: { avg: 12.87, sd: 5 },
              n: { avg: 10.12, sd: 3.9 },
              e: { avg: 17.25, sd: 3 },
              p: { avg: 4.18, sd: 3 },
            },
          },
        ],
        female: [
          {
            age: 8,
            factors: {
              l: { avg: 17, sd: 2.5 },
              n: { avg: 6.7, sd: 4.4 },
              e: { avg: 16, sd: 2.9 },
              p: { avg: 3, sd: 3.3 },
            },
          },
          {
            age: 9,
            factors: {
              l: { avg: 16.5, sd: 3.5 },
              n: { avg: 7.6, sd: 3.9 },
              e: { avg: 16, sd: 2.9 },
              p: { avg: 2, sd: 2 },
            },
          },
          {
            age: 10,
            factors: {
              l: { avg: 18, sd: 2.65 },
              n: { avg: 6, sd: 3.7 },
              e: { avg: 13, sd: 3.04 },
              p: { avg: 2, sd: 1.86 },
            },
          },
          {
            age: 11,
            factors: {
              l: { avg: 14.82, sd: 3.7 },
              n: { avg: 8.05, sd: 4 },
              e: { avg: 17.39, sd: 3 },
              p: { avg: 2.38, sd: 1.9 },
            },
          },
          {
            age: 12,
            factors: {
              l: { avg: 14.8, sd: 3.7 },
              n: { avg: 9.6, sd: 4.5 },
              e: { avg: 16.66, sd: 3 },
              p: { avg: 2.7, sd: 1.9 },
            },
          },
          {
            age: 13,
            factors: { l: { avg: 14, sd: 4 }, n: { avg: 10, sd: 4 }, e: { avg: 17.5, sd: 3 }, p: { avg: 3, sd: 2 } },
          },
          {
            age: 14,
            factors: {
              l: { avg: 12.45, sd: 4 },
              n: { avg: 11.21, sd: 4 },
              e: { avg: 17.7, sd: 3 },
              p: { avg: 3.7, sd: 2.2 },
            },
          },
          {
            age: 15,
            factors: {
              l: { avg: 13.27, sd: 4 },
              n: { avg: 12, sd: 3.9 },
              e: { avg: 15.18, sd: 3.5 },
              p: { avg: 3.6, sd: 2.3 },
            },
          },
        ],
      },
    };
    const gender = this.dataset.info.fields.filter((p) => p.eng == "gender")[0]?.user_answered;
    const age = parseInt(this.dataset.info.fields.filter((p) => p.eng == "age")[0]?.user_answered);
    let selecedTable = null;
    if (gender == 1) {
      selecedTable = this.constructor.name == "EPQ93" ? table.adult.female : table.children.female;
    } else {
      selecedTable = this.constructor.name == "EPQ93" ? table.adult.male : table.children.male;
    }
    let selecedTableRow = null;
    for (let i = 0; i < selecedTable.length; i++) {
      const ageID = selecedTable[i].age;
      const range = ageID.toString().match(/(\d+)-(\d+)/);
      if (range) {
        range[2] = range[2].replace(59, 1000000000);
      }
      if (age == ageID || (range && age >= range[1] && age <= range[2])) {
        selecedTableRow = ageID;
        break;
      }
    }
    const score = {
      p: this.dataset.score[3],
      e: this.dataset.score[2],
      n: this.dataset.score[1],
      l: this.dataset.score[0],
    };
    const col9 = this.col9;
    return [{ items, selecedTable, selecedTableRow, score, col9 }];
  }
}

module.exports = EPQ93;
