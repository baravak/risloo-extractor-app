const { Profile, FS } = require("../Profile");

class PMCIEF9A extends Profile {
  // Number of pages
  static pages = 3;

  // Labels of the sample
  labels = {
    L1: { eng: "axis_2_raw", fr: "", max: 45 },
    L2: { eng: "axis_2_percentage", fr: "" },

    L3: { eng: "axis_3_raw", fr: "", max: 20 },
    L4: { eng: "axis_3_percentage", fr: "" },

    L5: { eng: "axis_4_raw", fr: "" },
    L6: { eng: "axis_4_percentage", fr: "" },

    L7: { eng: "axis_4_section_1_raw", fr: null, max: 0 },
    L8: { eng: "axis_4_section_1_percentage", fr: null, max: 0 },

    L9: { eng: "axis_4_section_3_raw", fr: null, max: 0 },
    L10: { eng: "axis_4_section_3_percentage", fr: null, max: 0 },

    L11: { eng: "axis_4_section_3_family", fr: null, max: 0 },
    L12: { eng: "axis_4_section_3_educational", fr: null, max: 0 },

    L13: { eng: "axis_4_section_4_raw", fr: null, max: 0 },
    L14: { eng: "axis_4_section_4_percentage", fr: null, max: 0 },

    L15: { eng: "axis_5_raw", fr: null, max: 0 },
    L16: { eng: "axis_5_percentage", fr: null, max: 0 },

    L17: { eng: "axis_6_raw", fr: null, max: 0 },
    L18: { eng: "axis_6_percentage", fr: null, max: 0 },

    L19: { eng: "axis_6_favorites_raw", fr: null, max: 0 },
    L20: { eng: "axis_6_favorites_percentage", fr: null, max: 0 },

    L21: { eng: "axis_6_worries_raw", fr: null, max: 0 },
    L22: { eng: "axis_6_worries_percentage", fr: null, max: 0 },

    L23: { eng: "axis_7_section_1_options_option_1_raw", fr: null, max: 0 },
    L24: { eng: "axis_7_section_1_options_option_1_percentage", fr: null, max: 0 },

    L25: { eng: "axis_7_section_1_options_option_2_raw", fr: null, max: 0 },
    L26: { eng: "axis_7_section_1_options_option_2_percentage", fr: null, max: 0 },

    L27: { eng: "axis_7_section_1_options_option_3_raw", fr: null, max: 0 },
    L28: { eng: "axis_7_section_1_options_option_3_percentage", fr: null, max: 0 },

    L29: { eng: "axis_7_section_1_options_option_4_raw", fr: null, max: 0 },
    L30: { eng: "axis_7_section_1_options_option_4_percentage", fr: null, max: 0 },

    L31: { eng: "axis_7_section_1_options_option_5_raw", fr: null, max: 0 },
    L32: { eng: "axis_7_section_1_options_option_5_percentage", fr: null, max: 0 },

    L33: { eng: "axis_7_section_1_options_option_6_raw", fr: null, max: 0 },
    L34: { eng: "axis_7_section_1_options_option_6_percentage", fr: null, max: 0 },

    L35: { eng: "axis_7_section_1_againest_raw", fr: null, max: 0 },
    L36: { eng: "axis_7_section_1_againest_percentage", fr: null, max: 0 },

    L37: { eng: "axis_7_section_1_compromise_raw", fr: null, max: 0 },
    L38: { eng: "axis_7_section_1_compromise_percentage", fr: null, max: 0 },

    L39: { eng: "axis_7_section_1_agreement_raw", fr: null, max: 0 },
    L40: { eng: "axis_7_section_1_agreement_percentage", fr: null, max: 0 },

    L41: { eng: "axis_7_section_2_raw", fr: null, max: 0 },
    L42: { eng: "axis_7_section_2_percentage", fr: null, max: 0 },

    L43: { eng: "axis_7_section_2_religion_raw", fr: null, max: 0 },
    L44: { eng: "axis_7_section_2_religion_percentage", fr: null, max: 0 },

    L45: { eng: "axis_7_section_2_sex_raw", fr: null, max: 0 },
    L46: { eng: "axis_7_section_2_sex_percentage", fr: null, max: 0 },

    L47: { eng: "axis_7_section_2_role_raw", fr: null, max: 0 },
    L48: { eng: "axis_7_section_2_role_percentage", fr: null, max: 0 },

    L49: { eng: "axis_7_section_2_financial_raw", fr: null, max: 0 },
    L50: { eng: "axis_7_section_2_financial_percentage", fr: null, max: 0 },

    L51: { eng: "axis_7_section_2_flexibility_raw", fr: null, max: 0 },
    L52: { eng: "axis_7_section_2_flexibility_percentage", fr: null, max: 0 },

    L53: { eng: "axis_7_section_2_proximity_raw", fr: null, max: 0 },
    L54: { eng: "axis_7_section_2_proximity_percentage", fr: null, max: 0 },

    L55: { eng: "axis_7_section_2_sociability_raw", fr: null, max: 0 },
    L56: { eng: "axis_7_section_2_sociability_percentage", fr: null, max: 0 },

    L57: { eng: "axis_7_section_2_conflict_resolution_raw", fr: null, max: 0 },
    L58: { eng: "axis_7_section_2_conflict_resolution_percentage", fr: null, max: 0 },

    L59: { eng: "axis_8_section_1_me_raw", fr: null, max: 0 },
    L60: { eng: "axis_8_section_1_me_percentage", fr: null, max: 0 },

    L61: { eng: "axis_8_section_1_me_social_raw", fr: null, max: 0 },
    L62: { eng: "axis_8_section_1_me_social_percentage", fr: null, max: 0 },

    L63: { eng: "axis_8_section_1_me_administratorship_raw", fr: null, max: 0 },
    L64: { eng: "axis_8_section_1_me_administratorship_percentage", fr: null, max: 0 },

    L65: { eng: "axis_8_section_1_me_moral_raw", fr: null, max: 0 },
    L66: { eng: "axis_8_section_1_me_moral_percentage", fr: null, max: 0 },

    L67: { eng: "axis_8_section_1_me_rationality_raw", fr: null, max: 0 },
    L68: { eng: "axis_8_section_1_me_rationality_percentage", fr: null, max: 0 },

    L69: { eng: "axis_8_section_1_me_anger_raw", fr: null, max: 0 },
    L70: { eng: "axis_8_section_1_me_anger_percentage", fr: null, max: 0 },

    L71: { eng: "axis_8_section_1_partner_raw", fr: null, max: 0 },
    L72: { eng: "axis_8_section_1_partner_percentage", fr: null, max: 0 },

    L73: { eng: "axis_8_section_1_partner_social_raw", fr: null, max: 0 },
    L74: { eng: "axis_8_section_1_partner_social_percentage", fr: null, max: 0 },

    L75: { eng: "axis_8_section_1_partner_administratorship_raw", fr: null, max: 0 },
    L76: { eng: "axis_8_section_1_partner_administratorship_percentage", fr: null, max: 0 },

    L77: { eng: "axis_8_section_1_partner_moral_raw", fr: null, max: 0 },
    L78: { eng: "axis_8_section_1_partner_moral_percentage", fr: null, max: 0 },

    L79: { eng: "axis_8_section_1_partner_rationality_raw", fr: null, max: 0 },
    L80: { eng: "axis_8_section_1_partner_rationality_percentage", fr: null, max: 0 },

    L81: { eng: "axis_8_section_1_partner_anger_raw", fr: null, max: 0 },
    L82: { eng: "axis_8_section_1_partner_anger_percentage", fr: null, max: 0 },

    L83: { eng: "axis_8_section_2_raw", fr: null, max: 0 },
    L84: { eng: "axis_8_section_2_percentage", fr: null, max: 0 },

    L85: { eng: "axis_8_section_2_me_raw", fr: null, max: 0 },
    L86: { eng: "axis_8_section_2_me_percentage", fr: null, max: 0 },

    L87: { eng: "axis_8_section_2_me_c_raw", fr: null, max: 0 },
    L88: { eng: "axis_8_section_2_me_c_percentage", fr: null, max: 0 },

    L89: { eng: "axis_8_section_2_me_a_raw", fr: null, max: 0 },
    L90: { eng: "axis_8_section_2_me_a_percentage", fr: null, max: 0 },

    L91: { eng: "axis_8_section_2_me_o_raw", fr: null, max: 0 },
    L92: { eng: "axis_8_section_2_me_o_percentage", fr: null, max: 0 },

    L93: { eng: "axis_8_section_2_me_e_raw", fr: null, max: 0 },
    L94: { eng: "axis_8_section_2_me_e_percentage", fr: null, max: 0 },

    L95: { eng: "axis_8_section_2_me_n_raw", fr: null, max: 0 },
    L96: { eng: "axis_8_section_2_me_n_percentage", fr: null, max: 0 },

    L97: { eng: "axis_8_section_2_partner_raw", fr: null, max: 0 },
    L98: { eng: "axis_8_section_2_partner_percentage", fr: null, max: 0 },

    L99: { eng: "axis_8_section_2_partner_c_raw", fr: null, max: 0 },
    L101: { eng: "axis_8_section_2_partner_c_percentage", fr: null, max: 0 },

    L102: { eng: "axis_8_section_2_partner_a_raw", fr: null, max: 0 },
    L103: { eng: "axis_8_section_2_partner_a_percentage", fr: null, max: 0 },

    L104: { eng: "axis_8_section_2_partner_o_raw", fr: null, max: 0 },
    L105: { eng: "axis_8_section_2_partner_o_percentage", fr: null, max: 0 },

    L106: { eng: "axis_8_section_2_partner_e_raw", fr: null, max: 0 },
    L107: { eng: "axis_8_section_2_partner_e_percentage", fr: null, max: 0 },

    L108: { eng: "axis_8_section_2_partner_n_raw", fr: null, max: 0 },
    L109: { eng: "axis_8_section_2_partner_n_percentage", fr: null, max: 0 },
  };

  profileSpec = {
    /* "sample" determines some important info about the sample and profile */
    /* Default prerequisites: 1. gender, 2. age, 3. education */
    /* "prerequisites" is synonym to "fields" in our program */
    sample: {
      name: "پرسشنامه ارزیابی مشاوره پیش از ازدواج فرم ب" /* Name of the sample */,
      multiProfile: false /* Whether the sample has multiple profiles or not */,
      questions: true /* Determines whether to get questions from inital dataset or not */,
      defaultFields: false /* Determines whether to have default prerequisites in the profile or not */,
      fields: ["name", "p_name"] /* In case you want to get some additional fields and show in the profile */,
    },
    /* "profile" determines the dimensions of the drawn profile (to be used in svg tag viewbox) */
    /* calculating its dimensions carefully is of great importance */
    profile: {
      get dimensions() {
        return [
          {
            width: 828 + 2 * this.padding.x,
            height: 634 + 2 * this.padding.y,
          },
        ];
      },
      padding: {
        x: 37.5,
        y: 40,
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

    const section2 = section2circle(dataset);
    const section3 = {
      total: Object.assign({}, dataset.score[2], { ml: dataset.score[2].mark * 9 - 9 }),
      percentage: dataset.score[3],
    };
    //  {
    //   raw: dataset.score[0],
    //   percentage: dataset.score[1],
    //   circle_raw:
    // };
    return [{ section2, section3 }];
  }
}

function section2circle(dataset) {
  const raw = dataset.score[0];
  const percentage = dataset.score[1];
  const circle = {
    maxValue: 45 /* Maximum value of raw mark provided by the dataset */,
    fill: "#4F46E5" /* Color used in the raw element */,
    circle: {
      R: 60 /* Radius of the outer circle of the raw element */,
      r: 42 /* Radius of the inner circle of the raw element */,
      brs: {
        tl: 5 /* Top left border radius */,
        bl: 5 /* Bottom left border radius */,
        tr: 5 /* Top right border radius */,
        br: 5 /* Bottom right border radius */,
      } /* Border radiuses at each end of the gauge of the raw element */,
      angles: {
        start: FS.toRadians(-90),
        end: FS.toRadians(180),
      } /* Angles of each end of the raw element */,
      direction: false /* Clockwise direction for the raw gauge element */,
      get totalAngle() {
        return this.direction
          ? 2 * Math.PI - (this.angles.end - this.angles.start)
          : this.angles.end - this.angles.start;
      },
    },
    ticks: {
      num: 2 /* Number of ticks */,
      number: {
        offset: 25 /* Offset from the line */,
      },
    },
  };

  // Calculate Ticks Numbers Array for Raw
  const rawTicksNumbers = FS.createArithmeticSequence(
    circle.maxValue,
    -circle.maxValue / (circle.ticks.num - 1),
    circle.ticks.num
  ).reverse();

  // Gather Required Info for Raw
  return {
    circle: circle,
    percentage: percentage,
    label: raw.label,
    mark: raw.mark,
    zeta: (raw.mark / circle.maxValue) * circle.circle.totalAngle + circle.circle.angles.start,
    fill: circle.fill,
    opacity: FS.roundTo2(0.5 * (1 + raw.mark / circle.maxValue)),
    start: {
      number: rawTicksNumbers[0],
      angle: (rawTicksNumbers[0] / circle.maxValue) * circle.circle.totalAngle + circle.circle.angles.start,
    },
    end: {
      number: rawTicksNumbers[1],
      angle: (rawTicksNumbers[1] / circle.maxValue) * circle.circle.totalAngle + circle.circle.angles.start,
    },
  };
}

module.exports = PMCIEF9A;
