const { Profile } = require("../Profile");

// CBCL9A — سیاههٔ رفتاری کودکان پیش‌دبستانی آخنباخ (CBCL/1½-5).
// Built from the approved brief docs/profiles/CBCL-9A_profile_brief_fa.md, laid out like CBCL93.
// Per score: raw value, T, percentile (text, read from T by the scorer: a number, ">97" or "≤50")
// and class (normal | borderline | clinical). The percentile row sits above the raw row, as in CBCL93.
// Bars use an even T axis (researcher, 2026-10-25), so bar length matches the number:
//   syndromes and DSM scales: 50..100 over 165 px; band edges at 65 and 70
//   internalizing, externalizing, total: 28..100 over 162 px; band edges at 60 and 64
// The layout is CBCL93's.
// Unless scoring/CBCL9A.py returns status "valid", only «نمره تولید نشد» is drawn.

class CBCL9A extends Profile {
  // Number of pages
  static pages = 1;

  // Labels of the sample — order is the brief's display order
  labels = {
    L1: { eng: "emotionally_reactive_value", fa: "واکنش‌پذیری هیجانی" },
    L2: { eng: "emotionally_reactive_t" },
    L3: { eng: "emotionally_reactive_pr" },
    L4: { eng: "emotionally_reactive_status" },

    L5: { eng: "anxious_depressed_value", fa: "اضطراب / افسردگی" },
    L6: { eng: "anxious_depressed_t" },
    L7: { eng: "anxious_depressed_pr" },
    L8: { eng: "anxious_depressed_status" },

    L9: { eng: "somatic_complaints_value", fa: "شکایات جسمانی" },
    L10: { eng: "somatic_complaints_t" },
    L11: { eng: "somatic_complaints_pr" },
    L12: { eng: "somatic_complaints_status" },

    L13: { eng: "withdrawn_value", fa: "کناره‌گیری اجتماعی" },
    L14: { eng: "withdrawn_t" },
    L15: { eng: "withdrawn_pr" },
    L16: { eng: "withdrawn_status" },

    L17: { eng: "sleep_problems_value", fa: "مشکلات خواب" },
    L18: { eng: "sleep_problems_t" },
    L19: { eng: "sleep_problems_pr" },
    L20: { eng: "sleep_problems_status" },

    L21: { eng: "attention_problems_value", fa: "مشکلات توجه" },
    L22: { eng: "attention_problems_t" },
    L23: { eng: "attention_problems_pr" },
    L24: { eng: "attention_problems_status" },

    L25: { eng: "aggressive_behaviour_value", fa: "رفتار پرخاشگرانه" },
    L26: { eng: "aggressive_behaviour_t" },
    L27: { eng: "aggressive_behaviour_pr" },
    L28: { eng: "aggressive_behaviour_status" },

    L29: { eng: "internalizing_value", fa: "درونی‌سازی" },
    L30: { eng: "internalizing_t" },
    L31: { eng: "internalizing_pr" },
    L32: { eng: "internalizing_status" },

    L33: { eng: "externalizing_value", fa: "برونی‌سازی" },
    L34: { eng: "externalizing_t" },
    L35: { eng: "externalizing_pr" },
    L36: { eng: "externalizing_status" },

    L37: { eng: "total_value", fa: "مشکلات کلی" },
    L38: { eng: "total_t" },
    L39: { eng: "total_pr" },
    L40: { eng: "total_status" },

    L41: { eng: "affective_problems_value", fa: ["مشکلات", "عاطفی"] },
    L42: { eng: "affective_problems_t" },
    L43: { eng: "affective_problems_pr" },
    L44: { eng: "affective_problems_status" },

    L45: { eng: "anxiety_problems_value", fa: ["مشکلات", "اضطرابی"] },
    L46: { eng: "anxiety_problems_t" },
    L47: { eng: "anxiety_problems_pr" },
    L48: { eng: "anxiety_problems_status" },

    L49: { eng: "pervasive_developmental_problems_value", fa: ["مشکلات", "رشدی فراگیر"] },
    L50: { eng: "pervasive_developmental_problems_t" },
    L51: { eng: "pervasive_developmental_problems_pr" },
    L52: { eng: "pervasive_developmental_problems_status" },

    L53: { eng: "adhd_value", fa: ["مشکلات", "نقص توجه/بیش‌فعالی"] },
    L54: { eng: "adhd_t" },
    L55: { eng: "adhd_pr" },
    L56: { eng: "adhd_status" },

    L57: { eng: "oppositional_defiant_problems_value", fa: ["مشکلات", "رفتار مقابله‌ای"] },
    L58: { eng: "oppositional_defiant_problems_t" },
    L59: { eng: "oppositional_defiant_problems_pr" },
    L60: { eng: "oppositional_defiant_problems_status" },

    L61: { eng: "status" }, // valid | incomplete | invalid
  };

  profileSpec = {
    sample: {
      name: "سیاههٔ رفتاری کودکان پیش‌دبستانی آخنباخ" /* Name of the sample */,
      multiProfile: false /* Whether the sample has multiple profiles or not */,
      questions: true /* Determines whether to get questions from inital dataset or not */,
      defaultFields: true /* Determines whether to have default prerequisites in the profile or not */,
      fields: ["child_age"] /* In case you want to get some additional fields and show in the profile */,
    },
    profile: {
      get dimensions() {
        return {
          width: 863 + 2 * this.padding.x,
          height: 653 + 2 * this.padding.y,
        };
      },
      padding: {
        x: 20,
        y: 30.5,
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

    // All-or-nothing: anything but an explicit "valid" shows only «نمره تولید نشد»;
    // a missing status must not let `?? 0` read as the lowest score.
    if (dataset.score[60].mark !== "valid") return [{ valid: false }];

    const items = [];
    for (let i = 0; i < 60; i += 4) {
      const value = dataset.score[i];
      const t = dataset.score[i + 1];
      const pr = dataset.score[i + 2];
      const status = dataset.score[i + 3];
      items.push({
        label: value.label.fa,
        value: value.mark ?? 0,
        t: t.mark ?? 0,
        pr: pr.mark ?? "",
        status: status.mark,
      });
    }

    const bars = (group, ranges, top, base, full) =>
      group.map((item) => {
        const height = barLength(item.t, ranges, top);
        const inside = height >= INSIDE_MIN;
        return {
          ...item,
          height,
          transform: `translate(0, ${full - height})`,
          fill: `url(#gradient-${item.status})`,
          rawColor: (statusColor[item.status] ?? statusColor.normal)[0],
          clipPath: `url(#bar24x${full})`,
          tY: inside ? full - height + 6 : full - height - 16,
          tFill: inside ? "#ffffff" : "#475569",
        };
      });

    const group1 = bars(items.slice(0, 7), rangesScale, 100, 50, 165);
    const group2 = bars(items.slice(7, 10), rangesComposite, 100, 28, 162);
    const group3 = bars(items.slice(10, 15), rangesScale, 100, 50, 165);
    return [{ valid: true, group1, group2, group3, statusColor }];
  }
}

// Bar length on the T axis: [start, pixels per T point] up to the axis top.
function barLength(score, ranges, top) {
  let total = 0;
  for (let i = 0; i < ranges.length; i++) {
    const [start, weight] = ranges[i];
    if (score <= start) break;
    const next = ranges[i + 1]?.[0] ?? top;
    total += (Math.min(next, score) - start) * weight;
  }
  return total;
}

// A T label sits inside the bar when the bar is tall enough, otherwise just above it.
const INSIDE_MIN = 20;

const statusColor = {
  normal: ["#059669", "#6EE7B7"],
  borderline: ["#EAB308", "#FEF08A"],
  clinical: ["#DC2626", "#FCA5A5"],
};
// Syndromes and DSM scales: even 50..100 over 165 px
const rangesScale = [[50, 165 / 50]];
// Internalizing, externalizing, total: even 28..100 over 162 px
const rangesComposite = [[28, 162 / 72]];

module.exports = CBCL9A;
