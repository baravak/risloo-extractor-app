const { Profile } = require("../Profile");
const list = ["intrusion", "avoidance", "negative_mood", "arousal_reactivity", "emotional_numbing"];
const segments = [
  { limit: 19, multiplier: 5 }, // 95
  { limit: 27, multiplier: 12 }, // 191
  { limit: 32, multiplier: 20 }, // 291
  { limit: 80, multiplier: 3 }, // 435
];
const alerts = {
  minimal: {
    colors: ["#475569", "#CBD5E1", "#475569", "#475569", "#F8FAFC"],
    title: "علائم ناچیز",
    description: "نیازی به مداخله نیست. توصیه به آموزش‌های عمومی تاب‌آوری.",
  },
  mild: {
    colors: ["#EAB308", "#FDE047", "#EAB308", "#FEF9C3", "#FEFCE8"],
    title: "علائم خفیف",
    description: "مانیتورینگ یا مشاوره اولیه گروهی یا فردی.",
  },
  moderate: {
    colors: ["#EA580C", "#FDBA74", "#EA580C", "#FFEDD5", "#FFF7ED"],
    title: "علائم متوسط",
    description: "نیازمند ارزیابی تخصصی؛ ارجاع به روان‌شناس بالینی.",
  },
  severe: {
    colors: ["#E11D48", "#E11D48", "#E11D48", "#FFE4E6", "#FFF1F2"],
    title: "علائم شدید",
    description: "احتمال بالای بالینی؛ ارجاع فوری به درمان تخصصی.",
  },
};
class PCL593 extends Profile {
  // Number of pages
  static pages = 2;

  // Labels of the sample
  labels = {
    L1_1: { eng: "intrusion_raw", short: "B", title: ["تجربه‌های", "مزاحم"], max: 20, dsm_count: 5 },
    L1_2: { eng: "intrusion_percentage" },
    L1_3: { eng: "intrusion_dsm_mode" },

    L2_1: { eng: "avoidance_raw", short: "C", title: ["اجتناب"], max: 8, dsm_count: 2 },
    L2_2: { eng: "avoidance_percentage" },
    L2_3: { eng: "avoidance_dsm_mode" },

    L3_1: { eng: "negative_mood_raw", short: "D", title: ["تغییرات منفی", "خلقی"], max: 16, dsm_count: 7 },
    L3_2: { eng: "negative_mood_percentage" },
    L3_3: { eng: "negative_mood_dsm_mode" },

    L4_1: { eng: "arousal_reactivity_raw", short: "E", title: ["برانگیختگی", "و بی‌قراری"], max: 16, dsm_count: 6 },
    L4_2: { eng: "arousal_reactivity_percentage" },
    L4_3: { eng: "arousal_reactivity_dsm_mode" },

    L5_1: { eng: "emotional_numbing_raw", short: "F", title: ["بی‌حسی", "عاطفی"], max: 20 },
    L5_2: { eng: "emotional_numbing_percentage" },

    L6_1: { eng: "total_raw", short: "", title: "", max: 80 },
    L6_2: { eng: "total_percentage" },

    L7: { eng: "status" },
  };

  profileSpec = {
    /* "sample" determines some important info about the sample and profile */
    /* Default prerequisites: 1. gender, 2. age, 3. education */
    /* "prerequisites" is synonym to "fields" in our program */
    sample: {
      name: "چک لیست نشانه‌های استرس پس از سانحه (PCL-5)" /* Name of the sample */,
      multiProfile: false /* Whether the sample has multiple profiles or not */,
      questions: true /* Determines whether to get questions from inital dataset or not */,
      defaultFields: true /* Determines whether to have default prerequisites in the profile or not */,
      fields: [] /* In case you want to get some additional fields and show in the profile */,
    },
    /* "profile" determines the dimensions of the drawn profile (to be used in svg tag viewbox) */
    /* calculating its dimensions carefully is of great importance */
    profile: {
      get dimensions() {
        return [
          {
            width: 526 + 2 * this.padding.x,
            height: 559 + 2 * this.padding.y,
          },
          {
            width: 760 + 2 * this.padding.x,
            height: 706 + 2 * this.padding.y,
          },
        ];
      },
      padding: [
        {
          x: 189,
          y: 78,
        },
        {
          x: 19,
          y: 4,
        },
      ],
    },
    /* "labels" part which has to be provided for each profile */
    labels: Object.values(this.labels),
  };

  constructor(dataset, options, config = {}) {
    super();
    this._init(dataset, options, config);
  }

  _calcContext() {
    const { dataset } = this;

    const factors = {};
    for (const item of dataset.score) {
      const group = list.find((i) => item.label.eng.startsWith(i));
      if (group === undefined) continue;
      const type = item.label.eng.substring(group.length + 1);
      if (type === "raw") {
        factors[group] = {
          mark: item.mark ?? 0,
          label: {
            ...item.label,
            eng: group,
          },
        };
      } else if (type === "percentage") {
        factors[group].label[type] = item.mark ?? 0;
        factors[group].label.percentageT = Math.round((item.mark ?? 0) * 100);
      } else {
        factors[group].label[type] = item.mark ?? 0;
      }
    }

    const total = {
      mark: dataset.score[14].mark ?? 0,
      len: calculateSegmentedLength(dataset.score[14].mark ?? 0),
      label: {
        ...dataset.score[14],
        percentage: Math.round((dataset.score[15].mark ?? 0) * 100),
      },
    };

    const status = {
      mark: dataset.score[16].mark,
      style: alerts[dataset.score[16].mark],
    };
    let lastItem = 0
    let top = 0
    const factorWithQuestions = Object.values(factors).map((factor, i) => {
        if(i === 4) return factor
        const itemCount = factor.label.dsm_count
        factor.items = dataset.questions.slice(lastItem, itemCount + lastItem).map(item => ({
            ...item,
            text: item.text.replace(/\([^\(\)]*\)/, '')
        }))
        const height = (itemCount * 29) - 3 + 16
        factor.itemOption = {
            height,
            startItem: lastItem + 1,
            top
        }
        top += height
        lastItem += itemCount
        return factor
    })
    return [{ factors: factorWithQuestions, total, status }, {
        factors: factorWithQuestions.filter(item => item.items !== undefined),
        questions: dataset.questions,
        titleAppend: ' - براساس DSM-5'
    }];
  }
}

function calculateSegmentedLength(n) {
  n = Math.max(Math.min(0, n), n);
  let total = 0;
  let current = 1;

  for (const { limit, multiplier } of segments) {
    if (n < current) break;
    const upper = Math.min(n, limit);
    const count = upper - current + 1;
    total += count * multiplier;
    current = limit + 1;
  }

  return total;
}
module.exports = PCL593;
