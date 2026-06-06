const { Profile } = require("../Profile");

class BSCT93 extends Profile {
  static pages = 1;

  labels = {
    L0_1: { eng: "total_raw", max: 125, title: "نمره کل" },
    L0_2: { eng: "total_percentage" },

    L1_1: { eng: "intellectual_ability_raw", max: 25, title: "توانایی ذهنی" },
    L1_2: { eng: "intellectual_ability_percentage" },

    L2_1: { eng: "physical_attractiveness_raw", max: 25, title: "جذابیت فیزیکی" },
    L2_2: { eng: "physical_attractiveness_percentage" },

    L3_1: { eng: "virtues_raw", max: 25, title: "مسائل اخلاقی" },
    L3_2: { eng: "virtues_percentage" },

    L4_1: { eng: "work_efficacy_raw", max: 20, title: "کفایت کاری" },
    L4_2: { eng: "work_efficacy_percentage" },

    L5_1: { eng: "social_skills_raw", max: 30, title: "مهارت‌های اجتماعی" },
    L5_2: { eng: "social_skills_percentage" },
  };

  profileSpec = {
    sample: {
      name: "پرسشنامه خودپنداره بک",
      multiProfile: false,
      questions: false,
      defaultFields: true,
      fields: [],
    },
    profile: {
      get dimensions() {
        return {
          width: 736 + 2 * this.padding.x,
          height: 245 + 2 * this.padding.y,
        };
      },
      padding: {
        x: 84,
        y: 235,
      },
    },
    labels: Object.values(this.labels),
  };

  constructor(dataset, options, config = {}) {
    super();
    this._init(dataset, options, config);
  }

  _calcContext() {
    const { dataset } = this;

    const total = packItem(dataset.score[0], dataset.score[1]);
    total.transform = `translate(30, ${4 + 230 - total.p * 230})`;
    // گرادیان لنگرخورده روی کلِ مسیر: روشن (#94A3B8) پایینِ مسیر (abs y=235.5)،
    // تیره (#334155) بالای مسیر (abs y=12.4). در مختصاتِ محلیِ میله بیان می‌شود
    // چون <path> همان total.transform را حمل می‌کند (مطابق paint6 در SVG طراحی).
    total.gradY1 = 230 * total.p + 0.5; // پایینِ مسیر → abs y 235.5
    total.gradY2 = 230 * total.p - 222.6; // بالای مسیر → abs y 12.4

    const factors = [
      packItem(dataset.score[2], dataset.score[3]),
      packItem(dataset.score[4], dataset.score[5]),
      packItem(dataset.score[6], dataset.score[7]),
      packItem(dataset.score[8], dataset.score[9]),
      packItem(dataset.score[10], dataset.score[11]),
    ];

    return [{ factors, total }];
  }
}

function packItem(raw, percentage) {
  return {
    ...raw,
    label: {
      ...raw.label,
      eng: raw.label.eng.replace("_raw", ""),
    },
    mark: raw.mark ?? 0,
    percentage: Math.round((percentage.mark ?? 0) * 100),
    p: percentage.mark ?? 0,
  };
}

module.exports = BSCT93;
