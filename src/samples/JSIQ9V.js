const { Profile, FS } = require("../Profile");

const firstItemCats = ["negative", "positive", "positive", "positive", "negative", "positive", "negative", "negative", "positive", "negative", "negative", "negative", "negative", "negative", "negative", "positive", "negative", "negative", "negative", "positive", "positive", "positive", "positive", "positive", "positive", "positive", "negative", "positive", "negative", "negative"]

class JSIQ9V extends Profile {
  // Number of pages
  static pages = 2;

  // Labels of the sample
  labels = {
    L0: { eng: "section_1_positive_total",  },
    L1: { eng: "section_1_positive_average",  },

    L2: { eng: "section_1_negative_total",  },
    L3: { eng: "section_1_negative_average",  },

    L4 : {eng: "section_2_total", fr: "", max:400},
    L5 : {eng: "section_2_percentage", fr: "", max:0},
    L6 : {eng: "section_2_family_system_consciousness_total", fr: "", max:25},
    L7 : {eng: "section_2_family_system_consciousness_percentage", fr: "", max:0},
    L8 : {eng: "section_2_power_giving_total", fr: "", max:140},
    L9 : {eng: "section_2_power_giving_percentage", fr: "", max:0},
    L10 : {eng: "section_2_perception_of_love_total", fr: "", max:150},
    L12 : {eng: "section_2_perception_of_love_percentage", fr: "", max:0},
    L13 : {eng: "section_2_sexual_safety_awareness_total", fr: "", max:85},
    L14 : {eng: "section_2_sexual_safety_awareness_percentage", fr: "", max:0},

    L15 : {eng: "section_2_female_safety_awareness_total", fr: "", max:30},
    L16 : {eng: "section_2_female_safety_awareness_percentage", fr: "", max:0},
    L17 : {eng: "section_2_perceived_spousal_safety_total", fr: "", max:70},
    L18 : {eng: "section_2_perceived_spousal_safety_percentage", fr: "", max:0},

  };

  profileSpec = {
    /* "sample" determines some important info about the sample and profile */
    /* Default prerequisites: 1. gender, 2. age, 3. education */
    /* "prerequisites" is synonym to "fields" in our program */
    sample: {
      name: "پرسشنامه تعامل همسران - فرم خانم‌ها" /* Name of the sample */,
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
          width: 851 + 2 * this.padding.x,
          height: 676 + 2 * this.padding.y,
        };
      },
      padding: {
        x: 26,
        y: 20,
      },
    },
    /* "labels" part which has to be provided for each profile */
    labels: Object.values(this.labels),
  };

  constructor(dataset, options, config = {}) {
    super();
    this._init(dataset, options, config);
  }
  f4 (data){
    const {
      spec: { parameters: spec },
      dataset,
    } = this;
    const rawSpec = {
      maxValue: data.label.max,
      circle: {
        R: 55,
        r: 55 * .65,
        angles: {
          start: FS.toRadians(-90),
          end: FS.toRadians(180),
        },
        direction: false,
        get totalAngle() {
          return this.direction
            ? 2 * Math.PI - (this.angles.end - this.angles.start)
            : this.angles.end - this.angles.start;
        },
      }
    }
    return {
      rawSpec,
      mark: data.mark,
      percentage: Math.round(data.percentage * 100),
      zeta: (data.mark / rawSpec.maxValue) * rawSpec.circle.totalAngle + rawSpec.circle.angles.start,
    };
  }
  firstPage(){
    const {
      spec: { parameters: spec },
      dataset,
    } = this;

    const raw = {'negative': [[], [], [], [], []], 'positive': [[], [], [], [], []]};
    const itemOptions = {
        negative: [
            {
                color : "#737373",
                bg : "#FAFAFA",
                opacity : 1
            },
            {
                color : "#991B1B",
                bg : "#DC2626",
                opacity : 0.03
            },
            {
                color : "#991B1B",
                bg : "#DC2626",
                opacity : 0.06
            },
            {
                color : "#991B1B",
                bg : "#DC2626",
                opacity : 0.1
            },
            {
                color : "#991B1B",
                bg : "#DC2626",
                opacity : 0.15
            }
        ],
        positive: [
            {
                color : "#78716C",
                bg : "#FAFAF9",
                opacity : 1
            },
            {
                color : "#166534",
                bg : "#16A34A",
                opacity : 0.03
            },
            {
                color : "#166534",
                bg : "#16A34A",
                opacity : 0.06
            },
            {
                color : "#166534",
                bg : "#16A34A",
                opacity : 0.1
            },
            {
                color : "#166534",
                bg : "#16A34A",
                opacity : 0.15
            }
        ]
    }
        
    dataset.questions.slice(0, 30).forEach((row, i) => {
        const answered = parseInt(row.user_answered)
        const cat = firstItemCats[i]

        const newRow = {
            option: itemOptions[cat][answered],
            value: answered,
            label: i === 7 ? 'بی‌تفاوتی به مسئولیت‌های خانواده' :row.text
        }
        raw[cat][answered].push(newRow)
    });
    const positive = {
        average: dataset.score[1].mark,
        items: [...raw.positive[4],...raw.positive[3],...raw.positive[2],...raw.positive[1],...raw.positive[0]],
        breakpoint: null
    }
    positive.items.forEach((item, i) => {
        if (item.value < positive.average && !positive.breakpoint) {
            positive.breakpoint = i
        }
    })
    const negative = {
        average: dataset.score[3].mark,
        items: [...raw.negative[4],...raw.negative[3],...raw.negative[2],...raw.negative[1],...raw.negative[0]],
        breakpoint: null
    }
    negative.items.forEach((item, i) => {
        if (item.value < negative.average && !negative.breakpoint) {
            negative.breakpoint = i
        }
    })
    const items = dataset.score.slice(5, 14).filter((r, i) => i %2 !== 0).map((r, i) => {
      r.percentage = Math.round(dataset.score[7 + (i*2)].mark * 100)
      r.percentagex = dataset.score[7 + (i*2)].mark
      return r
    })
    const total = dataset.score[4]
    total.percentage = Math.round(dataset.score[5].mark * 100)
    const f4_1 = dataset.score[14]
    f4_1.percentage = dataset.score[15].mark

    const f4_2 = dataset.score[16]
    f4_2.percentage = dataset.score[17].mark
    return { positive, negative, items : {
      family: items[0],
      love: items[1],
      power: items[2],
      sexual: items[3],
    }, total, f4_1: this.f4(f4_1), f4_2: this.f4(f4_2),
    titleAppend: ' - بانوان'
    }
  }
  _calcContext() {
    const firstPageData = this.firstPage()
    return [firstPageData, {
      love: {
        percentage: 1 - firstPageData.items.love.percentagex,
        mark: firstPageData.items.love.mark
      },
      power: {
        percentage: 1 - firstPageData.items.power.percentagex,
        mark: firstPageData.items.power.mark
      },
      titleAppend: firstPageData.titleAppend
    }];
  }
}



module.exports = JSIQ9V;
