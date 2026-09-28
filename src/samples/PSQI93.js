const { Profile } = require("../Profile");

// ---------------------------------------------------------------------------
// PSQI93 — شاخص کیفیت خواب پیتزبورگ. Layout from the Figma "Chart" layer of
// the JSS93 design (Assessments v3.0.0, node 8071:183989), adapted to seven
// rows on a 0–3 axis with no raw-score column, and a vertical 0–21 total
// column. Rules kept from the approved result specification of the science
// record (catalog/assessments/psqi, «مشخصات نتیجه فردی»):
//   - seven components on one shared 0–3 axis, raw only — no per-component
//     class, colour or label (no evidence for any);
//   - the total 0–21 with the screening cut line at 6: 0–5 neutral, 6–21 red;
//   - revision 2026-09-28: keep available scores even when status is invalid;
//     unavailable values are dashes and reasons appear in a red warning below.
// The original 789 × 334 chart plus 96 px for up to three warning lines.
// ---------------------------------------------------------------------------
const CHART = { width: 789, height: 430 };

// Component rows keep the design's 40 px pitch and row mid-line (top + 8); the
// bar is 22 px, 3 px taller than the design's 16 px on each side.
const ROW = { top: 54, pitch: 40, height: 22, inset: -3 };
const AXIS = { zero: 174, unit: 400 / 3, max: 3, gap: 6 }; // 0 at x=174, 3 at x=574; score 6 px inside the tip
const BASELINE = 12.06; // 13 px text on the row mid-line, from the row top

// Total column: vertical bar filling bottom → up, 0 at y=316, 21 at y=46.
const TOTAL = { bottom: 316, length: 270, max: 21, cutoff: 6 };

const WARNING = { top: 374, pitch: 24, maxCharacters: 76 };

class PSQI93 extends Profile {
  static pages = 1;

  labels = {
    L1: { eng: "subjective_quality", title: "کیفیت ذهنی خواب" },
    L2: { eng: "latency", title: "تأخیر خواب" },
    L3: { eng: "duration", title: "مدت خواب" },
    L4: { eng: "efficiency", title: "کارایی معمول خواب" },
    L5: { eng: "disturbances", title: "اختلال‌های خواب" },
    L6: { eng: "medication", title: "مصرف داروی خواب" },
    L7: { eng: "daytime_dysfunction", title: "اختلال عملکرد روزانه" },
    L8: { eng: "total", title: "نمره کل", max: 21 },
    L9: { eng: "status" }, // valid | invalid
    L10: { eng: "screening" }, // positive | negative — read, never drawn as a label
    L11: { eng: "invalid_reasons" }, // distinct Persian reasons, separated by ؛
  };

  profileSpec = {
    sample: {
      name: "شاخص کیفیت خواب پیتزبورگ",
      multiProfile: false,
      questions: false,
      defaultFields: true,
      fields: [],
    },
    profile: {
      get dimensions() {
        return {
          width: CHART.width + 2 * this.padding.x, // 789 → 903
          height: CHART.height + 2 * this.padding.y, // 430 → 714
        };
      },
      // Chart inset inside the 943 × 754 design page minus the 20 px the layout
      // owns on every side, so the with-sidebar page renders at scale 1.
      padding: {
        x: (943 - CHART.width) / 2 - 20, // 57
        y: (754 - CHART.height) / 2 - 20, // 142
      },
    },
    labels: Object.values(this.labels),
  };

  constructor(dataset, options, config = {}) {
    super();
    // Dataset drops both zero and null marks. Preserve the original values so
    // absent components cannot silently become zero through the ?? 0 fallback.
    this.inputScore = dataset.score || {};
    this._init(dataset, options, config);
  }

  _calcContext() {
    const s = this.dataset.score;
    const status = s[8].mark;

    const readMark = (data, max) => {
      const original = this.inputScore[data.label.eng];
      if (original == null || (typeof original === "string" && original.trim() === "")) return null;
      if (typeof original !== "number" && typeof original !== "string") return null;
      const mark = Number(data.mark ?? 0);
      return Number.isFinite(mark) && mark >= 0 && mark <= max ? mark : null;
    };

    const items = s.slice(0, 7).map((data, i) => {
      const mark = readMark(data, AXIS.max);
      const top = ROW.top + i * ROW.pitch;
      const width = (mark ?? 0) * AXIS.unit;
      return {
        title: data.label.title,
        mark: mark ?? "—",
        available: mark !== null,
        top,
        barTop: top + ROW.inset,
        width,
        x: AXIS.zero,
        labelX: AXIS.zero + width - AXIS.gap,
        baseline: top + BASELINE,
      };
    });

    const totalMark = items.every((item) => item.available) ? readMark(s[7], TOTAL.max) : null;
    const positive = totalMark !== null && totalMark >= TOTAL.cutoff;
    const totalHeight = (TOTAL.length * (totalMark ?? 0)) / TOTAL.max;
    const totalTip = TOTAL.bottom - totalHeight;

    const invalid = status !== "valid" || totalMark === null;
    const reasonText = typeof s[10].mark === "string" ? s[10].mark : "";
    const reasons = [...new Set(reasonText.split("؛").map((text) => text.trim()).filter(Boolean))];
    if (invalid && reasons.length === 0) reasons.push("پاسخ ناقص یا نامعتبر");
    const warningText = [];
    if (invalid) {
      for (const reason of reasons) {
        const last = warningText.length - 1;
        if (last >= 0 && warningText[last].length + reason.length + 2 <= WARNING.maxCharacters) {
          warningText[last] += `؛ ${reason}`;
        } else {
          warningText.push(reason);
        }
      }
    }

    return [
      {
        invalid,
        warnings: warningText.map((text, i) => ({ text, y: WARNING.top + i * WARNING.pitch })),
        warningTop: WARNING.top,
        items,
        ticks: [0, 1, 2, 3].map((v) => ({ v, x: AXIS.zero + v * AXIS.unit })),
        total: {
          mark: totalMark ?? "—",
          max: TOTAL.max,
          height: totalHeight,
          tip: totalTip,
          // 18 px number centred on the tip of the bar, travelling with it.
          baseline: totalTip + 6.5,
          // Screening cut: a total of exactly 6 puts the tip on this line.
          cut: TOTAL.bottom - (TOTAL.length * TOTAL.cutoff) / TOTAL.max,
        },
        screen: {
          positive,
          text: positive ? "نیازمند بررسی بیشتر" : "نشانه‌ای از مشکل قابل‌توجه دیده نشد",
        },
      },
    ];
  }
}

module.exports = PSQI93;
