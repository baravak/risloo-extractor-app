const { Profile } = require("../Profile");

class CBCL93 extends Profile {
  // Number of pages
  static pages = 1;

  // Labels of the sample
  labels = {
    L1: { eng: "anxious_depressed_value", fa: 'اضطراب / افسردگی' },
    L2: { eng: "anxious_depressed_t" },
    L3: { eng: "anxious_depressed_pr" },
    L03: { eng: "anxious_depressed_status" },

    L4: { eng: "depressed_value", fa: 'گوشه‌گیری / افسردگی' },
    L5: { eng: "depressed_t" },
    L6: { eng: "depressed_pr" },
    L06: { eng: "depressed_status" },

    L7: { eng: "somatic_complaints_value", fa: 'شکایات جسمانی' },
    L8: { eng: "somatic_complaints_t" },
    L9: { eng: "somatic_complaints_pr" },
    L09: { eng: "somatic_complaints_status" },

    L10: { eng: "social_problems_value", fa: 'مشکلات اجتماعی' },
    L11: { eng: "social_problems_t" },
    L12: { eng: "social_problems_pr" },
    L012: { eng: "social_problems_status" },
    
    L13: { eng: "thought_problems_value", fa: 'مشکلات تفکر' },
    L14: { eng: "thought_problems_t" },
    L15: { eng: "thought_problems_pr" },
    L015: { eng: "thought_problems_status" },
    
    L16: { eng: "attention_problems_value", fa: 'مشکلات توجه' },
    L17: { eng: "attention_problems_t" },
    L18: { eng: "attention_problems_pr" },
    L018: { eng: "attention_problems_status" },
    
    L19: { eng: "rule_breaking_behaviour_value", fa: 'رفتار قانون‌شکنی' },
    L20: { eng: "rule_breaking_behaviour_t" },
    L21: { eng: "rule_breaking_behaviour_pr" },
    L021: { eng: "rule_breaking_behaviour_status" },
    
    L22: { eng: "aggressive_behaviour_value", fa: 'رفتار پرخاشگرانه' },
    L23: { eng: "aggressive_behaviour_t" },
    L24: { eng: "aggressive_behaviour_pr" },
    L024: { eng: "aggressive_behaviour_status" },
    
    L25: { eng: "internalizing_value", fa: 'درونی‌سازی' },
    L26: { eng: "internalizing_t" },
    L27: { eng: "internalizing_pr" },
    L027: { eng: "internalizing_status" },
    
    L28: { eng: "externalizing_value", fa: 'برونی سازی' },
    L29: { eng: "externalizing_t" },
    L30: { eng: "externalizing_pr" },
    L030: { eng: "externalizing_status" },
    
    L31: { eng: "total_value", fa: 'مشکلات کلی (نمره کل)' },
    L32: { eng: "total_t" },
    L33: { eng: "total_pr" },
    L033: { eng: "total_status" },
    
    L34: { eng: "affective_problems_value", fa: ['مشکلات','عاطفی'] },
    L35: { eng: "affective_problems_t" },
    L36: { eng: "affective_problems_pr" },
    L036: { eng: "affective_problems_status" },
    
    L37: { eng: "anxiety_problems_value", fa: ['مشکلات','اضطرابی'] },
    L38: { eng: "anxiety_problems_t" },
    L39: { eng: "anxiety_problems_pr" },
    L039: { eng: "anxiety_problems_status" },
    
    L40: { eng: "somatic_problems_value", fa: ['مشکلات','جسمانی (تنی)'] },
    L41: { eng: "somatic_problems_t" },
    L42: { eng: "somatic_problems_pr" },
    L042: { eng: "somatic_problems_status" },
    
    L43: { eng: "adhd_value", fa: ['مشکلات','ADHD'] },
    L44: { eng: "adhd_t" },
    L45: { eng: "adhd_pr" },
    L045: { eng: "adhd_status" },
    
    L46: { eng: "oppositional_defiant_problems_value", fa: ['مشکلات','رفتار مقابله‌ای'] },
    L47: { eng: "oppositional_defiant_problems_t" },
    L48: { eng: "oppositional_defiant_problems_pr" },
    L048: { eng: "oppositional_defiant_problems_status" },
    
    L49: { eng: "conduct_problems_value", fa: ['مشکلات','سلوک'] },
    L50: { eng: "conduct_problems_t" },
    L51: { eng: "conduct_problems_pr" },
    L051: { eng: "conduct_problems_status" },

    L52: {eng: "other_problems", fa: 'سایر مشکلات'}
  };

  profileSpec = {
    /* "sample" determines some important info about the sample and profile */
    /* Default prerequisites: 1. gender, 2. age, 3. education */
    /* "prerequisites" is synonym to "fields" in our program */
    sample: {
      name: "پرسشنامه افسردگی کودکان و نوجوانان - جان‌بزرگی" /* Name of the sample */,
      multiProfile: false /* Whether the sample has multiple profiles or not */,
      questions: true /* Determines whether to get questions from inital dataset or not */,
      defaultFields: false /* Determines whether to have default prerequisites in the profile or not */,
      fields: ['child_name', 'gender', 'age', 'education','filler_name', 'relationship'] /* In case you want to get some additional fields and show in the profile */,
    },
    /* "profile" determines the dimensions of the drawn profile (to be used in svg tag viewbox) */
    /* calculating its dimensions carefully is of great importance */
    profile: {
      get dimensions() {
        return {
          width: 863 + 2 * this.padding.x,
          height: 653 + 2 * this.padding.y,
        };
      },
      padding: {
        x: 28,
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

  _calcContext() {
    const {
      spec: { parameters: spec },
      dataset,
    } = this;

    // Deconstructing the Spec of the Profile

    // Separate Raw Data from the Dataset
    const items = []
    for(let i=0; i < 68; i+=4){
      const value = dataset.score[i]
      const t = dataset.score[i +1]
      const pr = dataset.score[i +2]
      const status = dataset.score[i +3]
      items.push({
        label: value.label.fa,
        value: value.mark ?? 0,
        t: t.mark ?? 0,
        pr: pr.mark ?? 0,
        status: status.mark,
        height: 0
      })
    }
    const group1 = [
      items[0],
      items[1],
      items[2],
      items[3],
      items[4],
      items[5],
      items[6],
      items[7]
    ].map((item, index) => {
      const height = calculateTotalLength(item.t, ...groupRange1)
      return {
        ...item,
        height,
        transform: `translate(0, ${165 - height})`,
        fill: `url(#gradient-${item.status})`,
        rawColor: statusColor[item.status][0],
        clipPath: 'url(#bar24x165)',
      }
    })

    const group2 = [
      items[8],
      items[9],
      items[10],
    ].map(item => {
      const height = calculateTotalLength(item.t, ...groupRange2)
      return {
        ...item,
        height,
        transform: `translate(0, ${162 - height})`,
        fill: `url(#gradient-${item.status})`,
        rawColor: statusColor[item.status][0],
        clipPath: 'url(#bar24x162)',
      }
    })
    const group3 = [
      items[11],
      items[12],
      items[13],
      items[14],
      items[15],
      items[16]
    ].map(item => {
      const height = calculateTotalLength(item.t, ...groupRange1)
      return {
        ...item,
        height,
        transform: `translate(0, ${165 - height})`,
        fill: `url(#gradient-${item.status})`,
        rawColor: statusColor[item.status][0],
        clipPath: 'url(#bar24x165)',
      }
    })
    return [{ group1, group2, group3, statusColor }];
  }
}
function calculateTotalLength(score, ...ranges) {
  let total = 0;
  for(let i = 0; i < ranges.length; i++){
    const [start, weight] = ranges[i]
    if(score < start) break
    const next = ranges[i + 1]?.[0] ?? 90
    const length = Math.min(next - start, score - start)
    total += length * weight
  }
  return total;
}
const statusColor = {
  'normal': ['#059669', '#6EE7B7'],
  'borderline': ['#EAB308', '#FEF08A'],
  'clinical': ['#DC2626', '#FCA5A5'],
}
const groupRange1 = [
  [0, 1],
  [30, 2],
  [64, 5],
  [69, 2]
];
const groupRange2 = [
  [0, 1],
  [30, 2],
  [59, 5],
  [63, 2]
];


module.exports = CBCL93;
