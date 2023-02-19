const { Profile, FS } = require("../Profile");
const JPFQ93 = require("./JPFQ93");
const FACES93 = require("./FACES93");
const Handlebars = require("handlebars");

class PMCIEF93 extends Profile {
  // Number of pages
  static pages = 1;

  // Labels of the sample
  labels = {
    L1 : {"eng" : "axis_2_raw", "fr" : ""},
    L2 : {"eng" : "axis_2_percentage", "fr" : ""},

    L3 : {"eng" : "axis_3_raw", "fr" : ""},
    L4 : {"eng" : "axis_3_percentage", "fr" : ""},
    
    L5 : {"eng" : "axis_3_selection_raw", "fr" : "", max:76},
    L6 : {"eng" : "axis_3_selection_percentage", "fr" : ""},
  
    L7 : {"eng" : "axis_3_selection_demographic_raw", "fr" : "جمعیت‌شناختی", max:14},
    L8 : {"eng" : "axis_3_selection_demographic_percentage", "fr" : ""},
    L9 : {"eng" : "axis_3_selection_partner_family_raw", "fr" : "خانواده مقابل", max:8},
    L10 : {"eng" : "axis_3_selection_partner_family_percentage", "fr" : ""},
    L11 : {"eng" : "axis_3_selection_belief_raw", "fr" : "شناختی - اعتقادی", max:8},
    L12 : {"eng" : "axis_3_selection_belief_percentage", "fr" : ""},
    L13 : {"eng" : "axis_3_selection_personality_raw", "fr" : "شخصیتی - اخلاقی", max:34},
    L14 : {"eng" : "axis_3_selection_personality_percentage", "fr" : ""},
    L15 : {"eng" : "axis_3_selection_negative_raw", "fr" : "سلبی", max:16},
    L16 : {"eng" : "axis_3_selection_negative_percentage", "fr" : ""},

    L17 : {"eng" : "axis_3_intention_raw", "fr" : ""},
    L18 : {"eng" : "axis_3_intention_percentage", "fr" : ""},

    L19 : {"eng" : "mibq_raw", "fr" : "", max:216},
    L20 : {"eng" : "mibq_percentage", "fr" : ""},
    L21 : {"eng" : "mibq_unrealistic_expectations", "fr" : "توقعات\nنامعقول", max:76, bg:'#EAB308', color: '#A16207'},
    L22 : {"eng" : "mibq_negativity", "fr" : "منفی‌بافی", max:35, bg:'#6366F1', color: '#4F46E5'},
    L23 : {"eng" : "mibq_extreme_optimism", "fr" : "خوش‌بینی\nافراطی", max:52, bg:'#14B8A6', color: '#0D9488'},
    L24 : {"eng" : "mibq_perfectionism", "fr" : "کامل\nخواهی", max:36, bg:'#A855F7', color: '#9333EA'},
    L25 : {"eng" : "mibq_negative_self_belief", "fr" : "خودباوری\nمنفی", max:20, bg:'#F43F5E', color: '#E11D48'},

    L26 : {"eng" : "axis_5_raw", "fr" : ""},
    L27 : {"eng" : "axis_5_percentage", "fr" : ""},
    L28 : {"eng" : "axis_5_spirituality", "fr" : "معنویت", color:"#007BA4"},
    L29 : {"eng" : "axis_5_control", "fr" : "کنترل", color:"#F59E0B"},
    L30 : {"eng" : "axis_5_pleasure", "fr" : "لذت", color:"#EC4899"},
    L31 : {"eng" : "axis_5_safety", "fr" : "امنیت", color:"#10B981"},
    L32 : {"eng" : "axis_5_social_status", "fr" : "منزلت اجتماعی", color:"#A78BFA"},

    L33 : {"eng" : "faces_a", "fr" : ""},
    L34 : {"eng" : "faces_b", "fr" : ""},
    L35 : {"eng" : "faces_c", "fr" : ""},
    L36 : {"eng" : "faces_d", "fr" : ""},
    L37 : {"eng" : "faces_e", "fr" : ""},
    L38 : {"eng" : "faces_f", "fr" : ""},
    L39 : {"eng" : "faces_communication", "fr" : ""},
    L40 : {"eng" : "faces_satisfaction", "fr" : ""},
    L41 : {"eng" : "faces_cohesion", "fr" : ""},
    L42 : {"eng" : "faces_flexibility", "fr" : ""},
    L43 : {"eng" : "faces_interpretation", "fr" : ""},

    L44 : {"eng" : "pastq_raw", "fr" : "", max:140},
    L45 : {"eng" : "pastq_authoritarian_family", "fr" : "خانواده سخت‌گیر", max:32},
    L46 : {"eng" : "pastq_authoritative_family", "fr" : "خانواده مقتدر", max:44},
    L47 : {"eng" : "pastq_permissive_family", "fr" : "سهل‌گیر", max:12},
    L48 : {"eng" : "pastq_neglectful_family", "fr" : "بی‌تفاوت", max:12},
    L49 : {"eng" : "pastq_family_structure", "fr" : "شاخص ساخت خانوادگی", max:28},

    L50 : {"eng" : "jpfq_identity", "fr" : ""},
    L51 : {"eng" : "jpfq_self_direction", "fr" : ""},
    L52 : {"eng" : "jpfq_empathy", "fr" : ""},
    L53 : {"eng" : "jpfq_intimacy", "fr" : ""},
    L54 : {"eng" : "jpfq_psychoticism", "fr" : ""},
    L55 : {"eng" : "jpfq_detachment", "fr" : ""},
    L56 : {"eng" : "jpfq_disinhibition", "fr" : ""},
    L57 : {"eng" : "jpfq_negative_affectivity", "fr" : ""},
    L58 : {"eng" : "jpfq_antagonism", "fr" : ""},

    L59 : {"eng" : "axis_7_axis7_2_raw", "fr" : ""},
    L60 : {"eng" : "axis_7_axis7_2_percentage", "fr" : ""},
    L61 : {"eng" : "axis_7_axis7_2_hope", "fr" : "امید", max:24},
    L62 : {"eng" : "axis_7_axis7_2_foresight", "fr" : "آینده‌نگری", max:16},
    L63 : {"eng" : "axis_7_axis7_2_proposing", "fr" : "نقشه زندگی", max:28},
    L64 : {"eng" : "axis_7_axis7_2_competency", "fr" : "شایستگی", max:24},
    L65 : {"eng" : "axis_7_axis7_2_identity", "fr" : "هویت", max: 48},
    L66 : {"eng" : "axis_7_axis7_2_intimacy", "fr" : "صمیمت", max: 36},

    L67 : {"eng" : "dswls_raw", "fr" : ""},
    L68 : {"eng" : "dswls_percentage", "fr" : ""},

    L69 : {"eng" : "axis_8_axis8_1_raw", "fr" : ""},
    L70 : {"eng" : "axis_8_axis8_1_percentage", "fr" : ""},
    L71 : {"eng" : "axis_8_axis8_1_physical_problem", "fr" : "مشکل جسمانی", max:28},
    L72 : {"eng" : "axis_8_axis8_1_neurotic_problem", "fr" : "مشکل نوروتیک", max:28},
    L73 : {"eng" : "axis_8_axis8_1_personality_disorder", "fr" : "اختلال شخصیت", max:24},

    L74 : {"eng" : "alvvct_raw", "fr" : ""},
    L75 : {"eng" : "alvvct_percentage", "fr" : ""},
    L76 : {"eng" : "alvvct_theoretical", "fr" : "نظری"},
    L77 : {"eng" : "alvvct_economic", "fr" : "اقتصادی"},
    L78 : {"eng" : "alvvct_aesthetic", "fr" : "هنری"},
    L79 : {"eng" : "alvvct_social", "fr" : "اجتماعی"},
    L80 : {"eng" : "alvvct_political", "fr" : "سیاسی"},
    L81 : {"eng" : "alvvct_religious", "fr" : "مذهبی"},
  };

  profileSpec = {
    /* "sample" determines some important info about the sample and profile */
    /* Default prerequisites: 1. gender, 2. age, 3. education */
    /* "prerequisites" is synonym to "fields" in our program */
    sample: {
      name: "پرسشنامه ارزیابی مشاوره پیش از ازدواج فرم الف"      /* Name of the sample */,
      multiProfile: false /* Whether the sample has multiple profiles or not */,
      questions: true /* Determines whether to get questions from inital dataset or not */,
      defaultFields: true /* Determines whether to have default prerequisites in the profile or not */,
      fields: ["family_role"] /* In case you want to get some additional fields and show in the profile */,
    },
    /* "profile" determines the dimensions of the drawn profile (to be used in svg tag viewbox) */
    /* calculating its dimensions carefully is of great importance */
    profile: {
      get dimensions() {
        return {
          width: 903 + 2 * this.padding.x,
          height: 714 + 2 * this.padding.y,
        };
      },
      padding: {
        x: 0,
        y: 0,
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
    const { dataset } = this;
    const [JPFQ93_Context] = new JPFQ93(
      {
        score: Object.fromEntries(dataset.score.slice(49, 58).map((s) =>[s.label.eng, s.mark])),
        fields: dataset.info.fields,
      },
      {},
      {
        items: {
          offsetY: 19,
          widthCoeff: 9,
          label: {
            offsetX: 9,
          },
        },
        gaugeItems: {
          offsetX: 46,
          circle: {
            R: 16.5,
            r: 12,
          },
        },
        labelsPrefix: "jpfq",
      }
    ).getTemplateEngineParams();
    const axis_7_2_items = dataset.score.slice(58, 66)
    const axis_7_2 = {
      raw: axis_7_2_items[0],
      percentage: axis_7_2_items[1],
      items: axis_7_2_items.slice(2).map(i => {i.mark = i.mark || 0; return i})
    }

    const axis_8_1_items = dataset.score.slice(68, 73)
    const axis_8_1 = {
      raw: axis_8_1_items[0],
      percentage: axis_8_1_items[1],
      items: axis_8_1_items.slice(2).map(i => {i.mark = i.mark || 0; return i}),
      rStart:FS.toRadians(-90),
      rEnd:FS.toRadians(-90)
    }
    const dswls= {
      raw: dataset.score[66],
      percentage: dataset.score[67]
    }

    const alvvct_items = dataset.score.slice(73, 81)
    const alvvct = {
      raw: alvvct_items[0],
      percentage: alvvct_items[1],
      items:alvvct_items.slice(2)
    }

    const axis_3= {
      raw:dataset.score[2],
      percentage:dataset.score[3],

      selection: {
        raw:dataset.score[4],
        percentage:dataset.score[5],
        items: [dataset.score[6], dataset.score[8], dataset.score[10], dataset.score[12], dataset.score[14]]
      }
    }
    dataset.questions.slice(26, 30).map(q => {
      if(q.user_answered != '' && q.user_answered){
        axis_3.selection.items[1].label.max += 2
        axis_3.selection.raw.label.max += 2
      }
    })
    const axis_3_intention = {
      raw:dataset.score[16],
      percentage:dataset.score[17],
    }

    const mibq_items = dataset.score.slice(18, 25)
    const mibq = {
      raw: mibq_items[0],
      percentage: mibq_items[1],
      items:mibq_items.slice(2)
    }
    const axis_5_items = dataset.score.slice(25, 32)
    const axis_5 = {
      raw: axis_5_items[0],
      percentage: axis_5_items[1],
      items:axis_5_items.slice(2)
    }

    const pastq_items = dataset.score.slice(43, 49)
    const pastq = {
      raw: pastq_items[0],
      items:pastq_items.slice(1)
    }


    const [FACES93_Context_page1, FACES93_Context_page2] = new FACES93(
      {
        score: Object.fromEntries(dataset.score.slice(32, 43).map((s) =>[s.label.eng, s.mark])),
        fields: dataset.info.fields,
      },
      {},
      {
        items: {
          offsetY: 19,
          widthCoeff: 9,
          label: {
            offsetX: 9,
          },
        },
        gaugeItems: {
          offsetX: 46,
          circle: {
            R: 16.5,
            r: 12,
          },
        },
        labelsPrefix: "faces",
      }
    ).getTemplateEngineParams();
    const axis_2 = {
      raw: dataset.score[0],
      percentage: dataset.score[1]
    }
    return [{ axis_2, pastq, FACES93_Context_page2, FACES93_Context_page1, axis_5, mibq, axis_3_intention, axis_3, alvvct, dswls, axis_8_1, axis_7_2, JPFQ93_Context }];
  }
}

module.exports = PMCIEF93;
