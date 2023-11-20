const { Profile } = require("../Profile");

class JSIQ93 extends Profile {
  // Number of pages
  static pages = 1;

  // Labels of the sample
  labels = {
    L0 : {eng: "total", fa: "", max: 0},
    L1 : {eng: "section_1_total", fa: "", max: 0},
    L2 : {eng: "section_1_anger", fa: "عصبانیت", max: 0},
    L3 : {eng: "section_1_tasteful", fa: "با سلیقه‌گی", max: 0},
    L4 : {eng: "section_1_homemaker", fa: "کدبانوگری", max: 0},
    L5 : {eng: "section_1_caring", fa: "مراقبت‌کنندگی", max: 0},
    L6 : {eng: "section_1_jealousy", fa: "حسادت", max: 0},
    L7 : {eng: "section_1_bighearted", fa: "دست و دلبازی", max: 0},
    L8 : {eng: "section_1_grudge", fa: "کینه‌ای بودن", max: 0},
    L9 : {eng: "section_1_courage", fa: "شجاعت", max: 0},
    L10 : {eng: "section_1_irritable", fa: "زود رنجی", max: 0},
    L11 : {eng: "section_1_sensitivity", fa: "حساسیت", max: 0},
    L12 : {eng: "section_1_incuriosity", fa: "بی تفاوتی", max: 0},
    L13 : {eng: "section_1_lack_of_understanding_of_the_spouse", fa: "عدم درک همسر", max: 0},
    L14 : {eng: "section_1_reassure", fa: "دلگرمی دادن", max: 0},
    L15 : {eng: "section_1_chaste", fa: "عفیف", max: 0},
    L16 : {eng: "section_1_genial", fa: "خونگرم", max: 0},
    L17 : {eng: "section_1_being_alarming", fa: "تشویق‌گر بودن", max: 0},
    L18 : {eng: "section_1_being_persuasive", fa: "ترغیب‌گر بودن", max: 0},
    L19 : {eng: "section_1_respectable", fa: "اهل احترام", max: 0},
    L20 : {eng: "section_1_blamer", fa: "سرزنش‌گر", max: 0},
    L21 : {eng: "section_1_others_influens", fa: "تأثیرپذیری از دیگران", max: 0},
    L22 : {eng: "section_1_resistant_to_me", fa: "مقاوم بودن در برابر من", max: 0},
    L23 : {eng: "section_1_flexibility", fa: "انعطاف", max: 0},
    L24 : {eng: "section_1_secrecy", fa: "رازداری", max: 0},
    L25 : {eng: "section_1_good_motherhood", fa: "مادرگری خوب", max: 0},
    L26 : {eng: "section_1_hurry", fa: "عجول بودن", max: 0},
    L27 : {eng: "section_1_faithful", fa: "با وفا", max: 0},
    L28 : {eng: "section_1_stable", fa: "با ثبات", max: 0},
    L29 : {eng: "section_1_capricious", fa: "دمدمی‌مزاج", max: 0},
    L30 : {eng: "section_1_starnger_permeability", fa: "نفوذپذیری از غریبه‌ها", max: 0},
    L31 : {eng: "section_1_wisdom", fa: "عاقل", max: 0},
    L32 : {eng: "section_2_total", fa: "", max: 425},
    L33 : {eng: "section_2_awareness_of_the_family_system", fa: "هشیاری نسبت به سیستم خانواده", max: 25},
    L34 : {eng: "section_2_give_love", fa: "مهردهی", max: 140},
    L35 : {eng: "section_2_perception_of_power", fa: "ادراک قدرت", max: 185},
    L36 : {eng: "section_2_attention_sexual_safety", fa: "توجه ایمنی جنسی", max: 75},
  };

  profileSpec = {
    /* "sample" determines some important info about the sample and profile */
    /* Default prerequisites: 1. gender, 2. age, 3. education */
    /* "prerequisites" is synonym to "fields" in our program */
    sample: {
      name: "پرسشنامه تعامل همسران - ویرایش فرم آقایان" /* Name of the sample */,
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
          width: 863 + (2 * this.padding.x),
          height: 643 + (2 * this.padding.y),
        };
      },
      padding: {
        x: 20,
        y: 33.5,
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
        total: {...dataset.score[32], percentage: Math.round((dataset.score[32].mark / dataset.score[32].label.max) * 100)},
        items: dataset.score.slice(33, 37).map(r => {
            r.percentage = Math.round((r.mark / r.label.max) * 100)
            return r
        })
      }
      const items = dataset.score.slice(2, 32).map((r, i) => {
        r.col = Math.floor(i /10)
        r.row = i % 10
        r.fill = r.row % 2 == 1 ? '#FAF5FF' : '#F5F3FF'
        r.color = r.row % 2 == 1 ? '#6B21A8' : '#5B21B6'
        return r
      })
    return [{ top, items }];
  }
}

module.exports = JSIQ93;
