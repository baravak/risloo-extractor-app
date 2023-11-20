const { Profile } = require("../Profile");

class JSIQ93 extends Profile {
  // Number of pages
  static pages = 1;

  // Labels of the sample
  labels = {
    L0 : {eng: "total", max:0, fa: ""},
    L1 : {eng: "section_1_total", max:0, fa: ""},
    L2 : {eng: "section_1_anger", max:0, fa: "عصبانیت"},
    L3 : {eng: "section_1_courage", max:0, fa: "شجاعت"},
    L4 : {eng: "section_1_compassion", max:0, fa: "عطوفت"},
    L5 : {eng: "section_1_bighearted", max:0, fa: "دست و دل‌ بازی"},
    L6 : {eng: "section_1_grudge", max:0, fa: "کینه‌ورز بودن"},
    L7 : {eng: "section_1_masculinity", max:0, fa: "مردانگی"},
    L8 : {eng: "section_1_pessimism", max:0, fa: "بدبینی"},
    L9 : {eng: "section_1_incuriosity", max:0, fa: "بی‌تفاوتی"},
    L10 : {eng: "section_1_fidelity", max:0, fa: "وفاداری"},
    L11 : {eng: "section_1_selfishness", max:0, fa: "خودخواهی"},
    L12 : {eng: "section_1_intimacy", max:0, fa: "صمیمیت"},
    L13 : {eng: "section_1_talkative", max:0, fa: "پرگویی"},
    L14 : {eng: "section_1_mindlessness", max:0, fa: "بی‌فکری"},
    L15 : {eng: "section_1_sophist", max:0, fa: "زبان‌بازی"},
    L16 : {eng: "section_1_power", max:0, fa: "قدرت"},
    L17 : {eng: "section_1_silence", max:0, fa: "سکوت"},
    L18 : {eng: "section_1_independence", max:0, fa: "استقلال"},
    L19 : {eng: "section_1_patronage", max:0, fa: "حمایت‌گری"},
    L20 : {eng: "section_1_spouse_friendship", max:0, fa: "همسر دوستی"},
    L21 : {eng: "section_1_forgiveness", max:0, fa: "بخشش"},
    L22 : {eng: "section_2_total", max:525, fa: ""},
    L23 : {eng: "section_2_family_structure", max:40, fa: "ساختار خانواده"},
    L24 : {eng: "section_2_give_power", max:135, fa: "قدرت‌دهی"},
    L25 : {eng: "section_2_perception_of_love", max:155, fa: "ادراک مهر"},
    L26 : {eng: "section_2_attention_sexual_safety", max:100, fa: "توجه ایمنی جنسی"},
    L27 : {eng: "section_2_woman_inattention", max:20, fa: "بی‌توجهی زن"},
    L28 : {eng: "section_2_perceived_inattention", max:25, fa: "بی‌توجهی شوهر"},
    L29 : {eng: "section_2_women_give_safety", max:20, fa: "ایمنی بخشی زن"},
    L30 : {eng: "section_2_perceived_safety", max:30, fa: "ایمنی ادراک‌دشده"},
    L31 : {eng: "section_3_q_1", max:0, fa: "همسران باید بتوانند ذهن یکدیگر را بخوانند."},
    L32 : {eng: "section_3_q_2", max:0, fa: "همسر باید یک شریک جنسی عالی باشد."},
    L33 : {eng: "section_3_q_3", max:0, fa: "اختلاف، رابطه را تخریب می‌کند."},
    L34 : {eng: "section_3_q_4", max:0, fa: "همسران نمی‌توانند خود و یا رابطه‌شان را تغییر دهند."},
    L35 : {eng: "section_3_q_5", max:0, fa: "مردان و زنان شخصیت‌ها و نیازهای بسیار متفاوتی دارند."},
  };

  profileSpec = {
    /* "sample" determines some important info about the sample and profile */
    /* Default prerequisites: 1. gender, 2. age, 3. education */
    /* "prerequisites" is synonym to "fields" in our program */
    sample: {
      name: "پرسشنامه تعامل همسران - ویرایش فرم زنان" /* Name of the sample */,
      multiProfile: false /* Whether the sample has multiple profiles or not */,
      questions: true /* Determines whether to get questions from inital dataset or not */,
      defaultFields: true /* Determines whether to have default prerequisites in the profile or not */,
      fields: [] /* In case you want to get some additional fields and show in the profile */,
    },
    /* "profile" determines the dimensions of the drawn profile (to be used in svg tag viewbox) */
    /* calculating its dimensions carefully is of great importance */
    profile: {
      get dimensions() {
        return {
          width: 865 + (2 * this.padding.x),
          height: 691 + (2 * this.padding.y),
        };
      },
      padding: {
        x: 19,
        y: 11.5,
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
      const top = {
        total: {...dataset.score[22], percentage: Math.round((dataset.score[22].mark / dataset.score[22].label.max) * 100)},
        items: dataset.score.slice(23, 31).map(r => {
            r.percentage = Math.round((r.mark / r.label.max) * 100)
            return r
        })
      }
      const items = dataset.score.slice(2, 22).map((r, i) => {
        r.col = Math.floor(i /10)
        r.row = i % 10
        r.fill = r.row % 2 == 1 ? '#FAF5FF' : '#F5F3FF'
        r.color = r.row % 2 == 1 ? '#6B21A8' : '#5B21B6'
        return r
      })

      const aggrees = dataset.score.slice(31, 36).map((r, i) => {
        r.fa = r.mark === 'agreement'? 'موافق' : 'مخالف'
        r.fill = r.mark === 'agreement' ? '#F0FDFA' : '#FDF2F8'
        r.color = r.mark === 'agreement' ? '#115E59' : '#BE185D'
        return r
      })
    return [{ top, items, aggrees }];
  }
}

module.exports = JSIQ93;
