const round = require("../handlebars/helpers/round");
const { Profile, FS } = require("../Profile");

class MMAFD9A extends Profile {
  // Number of pages
  static pages = 1;

  // Labels of the sample
  labels = {
    L1: { eng: "problem_solving", fr: "حل مسأله", CoP: 2.2, max: 24},
    L2: { eng: "roles", fr: "نقش‌ها", CoP: 2.3, max: 44},
    L3: { eng: "affective_responsiveness", fr: "پاسخ‌دهی عاطفی", CoP: 2.2, max: 24},
    L4: { eng: "communication", fr: "ارتباط", CoP: 2.2, max: 36},
    L5: { eng: "affective_involvement", fr: "مشارکت عاطفی", CoP: 2.1, max: 28},
    L6: { eng: "behaviour_control", fr: "کنترل رفتار", CoP: 1.9, max: 36},
    L7: { eng: "overall_performance", fr: "کارکرد عمومی", CoP: 2, max: 48},
  };

  profileSpec = {
    /* "prerequisites" is synonym to "fields" in our program */
    sample: {
      name: "پرسشنامه عملکرد خانواده ۶۰ سؤالی" /* Name of the sample */,
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
          width: 634 + 2 * this.padding.x,
          height: 668 + 2 * this.padding.y,
        };
      },
      padding: {
        x: 135,
        y: 23,
      },
    },
    /* "labels" part which has to be provided for each profile */
    labels: Object.values(this.labels),
  };

  constructor(dataset, options, config = {}) {
    super();
    this._init(dataset, options, config);
  }

  _calcContext() {
    const {
      spec: { parameters: spec },
      dataset,
    } = this;

    return [
      {
        scores: dataset.score.map((score) => {
          const elements = [];
          score.label.avg = round(score.mark / (score.label.max/4), 1);
          const avg = round(score.label.avg, 1);
          let greenLiene = 12;
          for (let i = 0; i < 31; i++) {
            let color = "";
            let type = "";
            const point = 1 + round(i * 0.1, 1);
            if (point < score.label.CoP) {
              greenLiene += 14;
            }
            if (point === avg) {
              color = avg >= score.label.CoP ? "#DC2626" : "#16A34A";
              type = "selected";
            } else {
              type = Math.round(point) === point ? "z" : "nz";
              if (point === score.label.CoP) {
                color = "#A8A29E";
              } else if (point > avg) {
                color = type === "z" ? '#F43F5E33' : "#F43F5E1A";
              } else {
                color = type === 'z' ? '#16A34A33' : "#16A34A1A";
              }
            }
            elements.push({
              point,
              color,
              type,
              isCoP: point === score.label.CoP,
            });
          }
          score.label.CoPText = score.label.CoP.toString().replace(".", "٬");
          return {
            ...score,
            elements,
            greenLiene,
            redLine: 446 - greenLiene,
            avgText: score.label.avg.toString().replace(".", "٬"),
            avgSelected: elements.findIndex((e) => e.type === "selected")
          };
        }),
      },
    ];
  }
}

module.exports = MMAFD9A;
