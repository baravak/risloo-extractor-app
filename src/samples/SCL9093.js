const { Profile, FS, Mappings } = require("../Profile");

const colorLevel = [
    '#65A30D',
    '#EAB308',
    '#EA580C',
    '#E11D48',
]

const colorSubLevel = [
    '#BEF264',
    '#FEF08A',
    '#FDBA74',
    '#FDA4AF',
]

class SCL9093 extends Profile {
  // Number of pages
  static pages = 1;

  // Labels of the sample
  labels = {
    L1: { eng: "som_raw", en : "SOM", fr: "شکایت جسمانی"},
    L2: { eng: "som_mean", en : "", fr: ""},
    L3: { eng: "som_report", en : "", fr: ""},
    L4: { eng: "som_status", en : "", fr: ""},

    L5: { eng: "oc_raw", en : "O-C", fr: "وسواسی - اجباری"},
    L6: { eng: "oc_mean", en : "", fr: ""},
    L7: { eng: "oc_report", en : "", fr: ""},
    L8: { eng: "oc_status", en : "", fr: ""},

    L9: { eng: "int_raw", en : "INT", fr: "حساسیت در روابط متقابل"},
    L10: { eng: "int_mean", en : "", fr: ""},
    L11: { eng: "int_report", en : "", fr: ""},
    L12: { eng: "int_status", en : "", fr: ""},

    L13: { eng: "dep_raw", en : "DEP", fr: "افسردگی"},
    L14: { eng: "dep_mean", en : "", fr: ""},
    L15: { eng: "dep_report", en : "", fr: ""},
    L16: { eng: "dep_status", en : "", fr: ""},

    L17: { eng: "anx_raw", en : "ANX", fr: "اضطراب"},
    L18: { eng: "anx_mean", en : "", fr: ""},
    L19: { eng: "anx_report", en : "", fr: ""},
    L20: { eng: "anx_status", en : "", fr: ""},

    L21: { eng: "hos_raw", en : "HOS", fr: "پرخاشگری (خصومت)"},
    L22: { eng: "hos_mean", en : "", fr: ""},
    L23: { eng: "hos_report", en : "", fr: ""},
    L24: { eng: "hos_status", en : "", fr: ""},

    L25: { eng: "phob_raw", en : "PHOB", fr: "ترس مرضی"},
    L26: { eng: "phob_mean", en : "", fr: ""},
    L27: { eng: "phob_report", en : "", fr: ""},
    L28: { eng: "phob_status", en : "", fr: ""},

    L29: { eng: "par_raw", en : "PAR", fr: "افکار پارانوئیدی"},
    L30: { eng: "par_mean", en : "", fr: ""},
    L31: { eng: "par_report", en : "", fr: ""},
    L32: { eng: "par_status", en : "", fr: ""},

    L33: { eng: "psy_raw", en : "PSY", fr: "روان‌گسستگی"},
    L34: { eng: "psy_mean", en : "", fr: ""},
    L35: { eng: "psy_report", en : "", fr: ""},
    L36: { eng: "psy_status", en : "", fr: ""},

    L37: { eng: "ext_raw", en : "EXT", fr: "سوال‌های اضافی"},
    L38: { eng: "ext_mean", en : "", fr: ""},
    L39: { eng: "ext_report", en : "", fr: ""},
    L40: { eng: "ext_status", en : "", fr: ""},

    L41: { eng: "total", en : "", fr: ""},
    L42: { eng: "pst", en : "", fr: ""},
    L43: { eng: "gsi", en : "", fr: ""},
    L44: { eng: "psdi", en : "", fr: ""},
  };

  profileSpec = {
    /* "sample" determines some important info about the sample and profile */
    /* Default prerequisites: 1. gender, 2. age, 3. education */
    /* "prerequisites" is synonym to "fields" in our program */
    sample: {
      name: "چک‌لیست نشانه‌های اختلالات روانی " /* Name of the sample */,
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
          width: 780 + 2 * this.padding.x,
          height: 506 + 2 * this.padding.y,
        };
      },
      padding: {
        x: 61.5,
        y: 104,
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
        dataset,
      } = this;
    const items = [];
    for(let i = 0; i < 40; i+=4){
        const item = {
            raw:dataset.score[i].mark || 0,
            title: dataset.score[i].label.fr,
            en: dataset.score[i].label.en,
            mean: toFixed(dataset.score[i+1].mark || 0),
        };
        item.params = setByPr(item, dataset.score[i+3].mark || 0)
        
        items.push(item);
    }
    const colors = colorLevel.map((c, i) => ({start: colorSubLevel[i], end: c}))
    const total = dataset.score[40].mark || 0;
    const pst = dataset.score[41].mark || 0;
    const gsi = toFixed(dataset.score[42].mark || 0);
    const psdi = toFixed(dataset.score[43].mark || 0);
    return [{ colors, items, total, pst, gsi, psdi }];
  }
}

function setByPr(item, level){
    const colors = [
        {
            col: colorLevel[0],
            gr: `url(#barx0)`,
            background:'#F9FAFB',
            bar_start: colorSubLevel[0],
        },
        {
            col: colorLevel[1],
            gr: `url(#barx1)`,
            background:'#FEFCE8',
            bar_start: colorSubLevel[1],
        },
        {
            col: colorLevel[2],
            gr: `url(#barx2)`,
            background:'#FFF7ED',
            bar_start: colorSubLevel[2],
        },
        {
            col: colorLevel[3],
            gr: `url(#barx3)`,
            background:'#FFF1F2',
            bar_start: colorSubLevel[3],
        }
    ]
    return Object.assign({}, {level:level}, colors[level])
}

function toFixed(number){
    if(Math.round(number) == number){
        return number;
    }
    if(number.toFixed(1) == number){
        return number;
    }
    return number.toFixed(2);
}
module.exports = SCL9093;
