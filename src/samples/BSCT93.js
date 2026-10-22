const { Profile } = require("../Profile");

class BSCT93 extends Profile {
  static pages = 1;

  labels = {
    L0_1: { eng: "total_raw", max: 125, title: "نمره کل" },
    L0_2: { eng: "total_percent" },

    L1_1: { eng: "intellectual_ability_raw", max: 25, title: "توانایی ذهنی" },
    L1_2: { eng: "intellectual_ability_percent" },

    L2_1: { eng: "physical_attractiveness_raw", max: 25, title: "جذابیت فیزیکی" },
    L2_2: { eng: "physical_attractiveness_percent" },

    L3_1: { eng: "virtues_raw", max: 25, title: "مسائل اخلاقی" },
    L3_2: { eng: "virtues_percent" },

    L4_1: { eng: "work_efficacy_raw", max: 20, title: "کفایت کاری" },
    L4_2: { eng: "work_efficacy_percent" },

    L5_1: { eng: "social_skills_raw", max: 30, title: "مهارت‌های اجتماعی" },
    L5_2: { eng: "social_skills_percent" },
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

// درصد ذخیره‌شده کسری ۰ تا ۱ با سه رقم است (`<factor>_percent`). عدد نمایشی = درصد × ۱۰۰،
// گردشده به عدد صحیح با نیمه رو به بالا، با حساب صحیح تا خطای ممیز شناور نیمه را جابه‌جا نکند.
// امتیاز هر سؤال دست‌کم ۱ است، پس درصد معتبر صفر نمی‌شود؛ درصدِ نیامده یعنی نمره ساخته نشده:
// میله خالی می‌ماند و عددی نوشته نمی‌شود.
function packItem(raw, percent) {
  const has = percent.mark !== undefined && percent.mark !== null;
  const p = has ? Math.min(Math.max(Number(percent.mark), 0), 1) : 0;
  return {
    ...raw,
    label: {
      ...raw.label,
      eng: raw.label.eng.replace("_raw", ""),
    },
    has,
    mark: raw.mark ?? 0,
    percentage: Math.floor((Math.round(p * 1000) + 5) / 10),
    p,
  };
}

module.exports = BSCT93;
