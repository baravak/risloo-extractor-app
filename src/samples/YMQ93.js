const { Profile } = require("../Profile");

const colors = {
  baseline: ['#2DD4BF', '#0D9488', '#CCFBF1','#F0FDFA'],
  clinical: ['#C084FC', '#9333EA', '#F3E8FF', '#FAF5FF'],
  personality: ['#818CF8', '#4F46E5', '#E0E7FF', '#EEF2FF']
}


class YMQ93 extends Profile {
  // Number of pages
  static pages = 3;

  // Labels of the sample
  labels = {
    L1: {
      eng: "vulnerable_child_raw",
      short: "VC",
      fa: "کودک آسیب‌پذیر",
      max: 60,
      norms: {
        baseline: { mean: 1.47, sd: 0.51 },
        clinical: { mean: 2.66, sd: 0.94 },
        personality: { mean: 3.36, sd: 1.11 },
      },
    },
    L1_2 : {eng: "vulnerable_child_mean"},
    L2: {
      eng: "angry_child_raw",
      short: "AC",
      fa: "کودک عصبانی",
      max: 60,
      norms: {
        baseline: { mean: 1.81, sd: 0.48 },
        clinical: { mean: 2.56, sd: 0.9 },
        personality: { mean: 3.09, sd: 0.94 },
      },
    },
    L2_2 : {eng: "angry_child_mean"},
    L3: {
      eng: "engraed_child_raw",
      short: "EC",
      fa: "کودک غضبناک",
      max: 60,
      norms: {
        baseline: { mean: 1.2, sd: 0.29 },
        clinical: { mean: 1.55, sd: 0.67 },
        personality: { mean: 2.05, sd: 0.92 },
      },
    },
    L3_2 : {eng: "engraed_child_mean"},
    L4: {
      eng: "impulsive_child_raw",
      short: "IC",
      fa: "کودک تکانشی",
      max: 54,
      norms: {
        baseline: { mean: 2.15, sd: 0.53 },
        clinical: { mean: 2.46, sd: 0.72 },
        personality: { mean: 3.05, sd: 0.97 },
      },
    },
    L4_2 : {eng: "impulsive_child_mean"},
    L5: {
      eng: "undisciplined_child_raw",
      short: "UC",
      fa: "کودک بی‌انضباط",
      max: 36,
      norms: {
        baseline: { mean: 2.27, sd: 0.6 },
        clinical: { mean: 2.57, sd: 0.85 },
        personality: { mean: 2.95, sd: 0.94 },
      },
    },
    L5_2 : {eng: "undisciplined_child_mean"},
    L6: {
      eng: "happy_child_raw",
      short: "HC",
      fa: "کودک شاد",
      max: 60,
      norms: {
        baseline: { mean: 4.52, sd: 0.54 },
        clinical: { mean: 3.39, sd: 0.87 },
        personality: { mean: 2.88, sd: 0.77 },
      },
    },
    L6_2 : {eng: "happy_child_mean"},
  
    L7: {
      eng: "compliant_surrender_raw",
      short: "CS",
      fa: "تسلیم‌شده مطیع",
      max: 42,
      norms: {
        baseline: { mean: 2.51, sd: 0.56 },
        clinical: { mean: 3, sd: 0.88 },
        personality: { mean: 3.32, sd: 0.95 },
      },
    },
    L7_2 : {eng: "compliant_surrender_mean"},
    L8: {
      eng: "detached_protector_raw",
      short: "DP",
      fa: "محافظ بی‌تفاوت",
      max: 54,
      norms: {
        baseline: { mean: 1.59, sd: 0.52 },
        clinical: { mean: 2.35, sd: 0.94 },
        personality: { mean: 2.95, sd: 0.94 },
      },
    },
    L8_2 : {eng: "detached_protector_mean"},
    L9: {
      eng: "detached_self_soother_raw",
      short: "DS",
      fa: "خود آرام‌بخش بی‌تفاوت",
      max: 24,
      norms: {
        baseline: { mean: 1.93, sd: 0.65 },
        clinical: { mean: 3, sd: 0.91 },
        personality: { mean: 3.32, sd: 0.98 },
      },
    },
    L9_2 : {eng: "detached_self_soother_mean"},
    L10: {
      eng: "self_aggrandizer_raw",
      short: "SA",
      fa: "خود بزرگ‌منش",
      max: 60,
      norms: {
        baseline: { mean: 2.31, sd: 0.59 },
        clinical: { mean: 2.47, sd: 0.76 },
        personality: { mean: 2.63, sd: 0.87 },
      },
    },
    L10_2 : {eng: "self_aggrandizer_mean"},
    L11: {
      eng: "bully_and_attack_raw",
      short: "BA",
      fa: "زورگو و تهاجمی",
      max: 54,
      norms: {
        baseline: { mean: 1.72, sd: 0.51 },
        clinical: { mean: 1.91, sd: 0.68 },
        personality: { mean: 2.21, sd: 0.77 },
      },
    },
    L11_2 : {eng: "bully_and_attack_mean"},
  
    L12: {
      eng: "punishing_parent_raw",
      short: "PP",
      fa: "والد تنبیه‌گر",
      max: 60,
      norms: {
        baseline: { mean: 1.47, sd: 0.39 },
        clinical: { mean: 2.16, sd: 0.9 },
        personality: { mean: 2.75, sd: 0.97 },
      },
    },
    L12_2 : {eng: "punishing_parent_mean"},
    L13: {
      eng: "demanding_parent_raw",
      short: "DP",
      fa: "والد پرتوقع",
      max: 60,
      norms: {
        baseline: { mean: 3.06, sd: 0.6 },
        clinical: { mean: 3.5, sd: 0.85 },
        personality: { mean: 3.71, sd: 0.9 },
      },
    },
    L13_2 : {eng: "demanding_parent_mean"},
    L14: {
      eng: "healthy_adult_raw",
      short: "HA",
      fa: "بزرگسال سالم",
      max: 60,
      norms: {
        baseline: { mean: 4.6, sd: 0.56 },
        clinical: { mean: 3.99, sd: 0.8 },
        personality: { mean: 3.6, sd: 0.83 },
      },
    },
    L14_2 : {eng: "healthy_adult_mean"},
  };

  profileSpec = {
    /* "sample" determines some important info about the sample and profile */
    /* Default prerequisites: 1. gender, 2. age, 3. education */
    /* "prerequisites" is synonym to "fields" in our program */
    sample: {
      name: "پرسشنامه سلامت عمومی" /* Name of the sample */,
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
          width: 899 + 2 * this.padding.x,
          height: 682 + 2 * this.padding.y,
        };
      },
      padding: {
        x: 2,
        y: 16,
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
      const items = []
      for(let i = 0; i < 28; i+=2){
        const item = dataset.score[i]
        const norms = []
        Object.entries(item.label.norms).forEach(([key, value]) => {
          norms.push(entries(key, value))
        })
        items.push({
          mark: item.mark ?? 0,
          mean: dataset.score[i+1].mark ?? 0,
          meanText: (Math.round((dataset.score[i+1].mark ?? 0) * 10) / 10).toString().replace(".", "٬"),
          label: {
            ...item.label,
            norms 
          }
        })
      }
    return [
      { titleAppend: ' - 1', colors, items: items.slice(0, 6) },
      {
        titleAppend: ' - 2', colors, items: items.slice(6, 11) 
      },
      {
        titleAppend: ' - 3', colors, items: items.slice(11, 14) 
      }
    ];
  }
}
function entries(key, value){
  const mean = value.mean - 1
  const start = ((mean - value.sd) * 100) + 9
  const end = ((value.sd + mean) * 100) + 1
  return {
    mean: value.mean,
    sd: value.sd,
    meanText: value.mean.toString().replace(".", "٬"),
    sdText: value.sd.toString().replace(".", "٬"),
    pixels: {
      start: Math.max(9, start),
      width: end - start
    },
    colors: colors[key],
    key
  }
}
module.exports = YMQ93;
