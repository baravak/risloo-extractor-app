const round = require("../handlebars/helpers/round");
const { Profile, FS } = require("../Profile");

class MMAFD9A extends Profile {
  // Number of pages
  static pages = 1;

  // Labels of the sample
  labels = {
    L1: { eng: "problem_solving_raw", fr: "حل مسأله", CoP: 2.2, max: 24},
    L1_2 : {eng: "problem_solving_avg"},
    L1_3 : {eng: "problem_solving_report"},

    L2: { eng: "roles_raw", fr: "نقش‌ها", CoP: 2.3, max: 44},
    L2_2 : {eng: "roles_avg"},
    L2_3 : {eng: "roles_report"},

    L3: { eng: "affective_responsiveness_raw", fr: "پاسخ‌دهی عاطفی", CoP: 2.2, max: 24},
    L3_2 : {eng: "affective_responsiveness_avg"},
    L3_3 : {eng: "affective_responsiveness_report"},

    L4: { eng: "communication_raw", fr: "ارتباط", CoP: 2.2, max: 36},
    L4_2 : {eng: "communication_avg"},
    L4_3 : {eng: "communication_report"},

    L5: { eng: "affective_involvement_raw", fr: "مشارکت عاطفی", CoP: 2.1, max: 28},
    L5_2 : {eng: "affective_involvement_avg"},
    L5_3 : {eng: "affective_involvement_report"},

    L6: { eng: "behaviour_control_raw", fr: "کنترل رفتار", CoP: 1.9, max: 36},
    L6_2 : {eng: "behaviour_control_avg"},
    L6_3 : {eng: "behaviour_control_report"},

    L7: { eng: "overall_performance_raw", fr: "کارکرد عمومی", CoP: 2, max: 48},
    L7_2 : {eng: "overall_performance_avg"},
    L7_3 : {eng: "overall_performance_report"},
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
    const scores = []
    for (let i = 0; i < 21; i+= 3) {
      const item = {mark: dataset.score[i].mark, label: {...dataset.score[i].label}}
      const avg = dataset.score[i + 1].mark
      item.label.avg = avg

      const elements = [];
      let greenLiene = 12;
      for (let i = 0; i < 31; i++) {
        let color = "";
        let type = "";
        const point = 1 + round(i * 0.1, 1);
        if (point < item.label.CoP) {
          greenLiene += 14;
        }
        if (point === avg) {
          color = avg >= item.label.CoP ? "#DC2626" : "#16A34A";
          type = "selected";
        } else {
          type = Math.round(point) === point ? "z" : "nz";
          if (point === item.label.CoP) {
            color = "#A8A29E";
          } else if (point > item.label.CoP) {
            color = type === "z" ? '#F43F5E33' : "#F43F5E1A";
          } else {
            color = type === 'z' ? '#16A34A33' : "#16A34A1A";
          }
        }
        elements.push({
          point,
          color,
          type,
          isCoP: point === item.label.CoP,
        });
      }
      item.label.CoPText = item.label.CoP.toString().replace(".", "٬");
      scores.push({
        ...item,
        elements,
        greenLiene,
        redLine: 446 - greenLiene,
        avgText: item.label.avg.toString().replace(".", "٬"),
        avgSelected: elements.findIndex((e) => e.type === "selected")
      })
    }
    return [
      {
        scores
      },
    ];
  }
}

module.exports = MMAFD9A;
