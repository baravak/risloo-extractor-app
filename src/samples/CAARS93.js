const { Profile } = require("../Profile");

// ---------------------------------------------------------------------------
// CAARS93 — مقیاس درجه‌بندی ADHD بزرگسالان کانرز، نسخهٔ غربالگری خودگزارشی.
// Built from the approved brief docs/profiles/CAARS_profile_brief_fa.md
// (CAARS-FA30-C1, 2026-10-19; header name and no interpretation text, same day). No Figma source; the gauges reuse the PRPS93
// geometry (Figma 5405:143530, 140px, R70/r49, 270° sweep; layout 2941:103565).
//   - three separate gauges in fixed RTL order IN, HI, IDX, each filled by its
//     own percent of maximum; never one shared axis, never sorted or highlighted;
//   - one neutral palette for all three: no levels, zones, thresholds, labels
//     or score-dependent colour;
//   - on-page text is exactly the brief's: four limitations and the reference
//     cut-off as text only, no interpretation text — no score is ever
//     compared with 55 or 65;
//   - all-or-nothing: unless scoring/CAARS93.py returns status "valid", only
//     the alert «نمره تولید نشد» is drawn — never a partial or zero score.
// `percent` arrives as a 3-decimal fraction; the page shows it × 100 rounded to
// a whole number, halves up, using integer arithmetic so 0.815 reads 82, not 81.
// ---------------------------------------------------------------------------
const CHART = { width: 863, height: 533 };
const GAUGE = { radius: 70, inner: 49, corner: 6, pitch: 229, overhang: 3, width: 602 };
const GAUGES_X = (CHART.width - GAUGE.width) / 2; // 130.5
const TEXT_TOP = 219;
const THEME = { accent: "#A5B4FC", primary: "#4338CA", track: "#F1F5F9" };

class CAARS93 extends Profile {
  static pages = 1;

  labels = {
    L1_1: { eng: "inattention_raw", title: "کمبود توجه", max: 27 },
    L1_2: { eng: "inattention_percent" },
    L2_1: { eng: "hyperactivity_raw", title: "پرتحرکی–کنترل تکانه", max: 27 },
    L2_2: { eng: "hyperactivity_percent" },
    L3_1: { eng: "adhd_index_raw", title: "شاخص ADHD", max: 36 },
    L3_2: { eng: "adhd_index_percent" },
    L4: { eng: "status" }, // valid | incomplete | invalid
  };

  profileSpec = {
    sample: {
      name: "مقیاس درجه‌بندی اختلال کمبود توجه/بیش‌فعالی بزرگسالان کانرز",
      multiProfile: false,
      questions: false,
      defaultFields: true,
      fields: [],
    },
    profile: {
      get dimensions() {
        return {
          width: CHART.width + 2 * this.padding.x, // 863 → 903
          height: CHART.height + 2 * this.padding.y, // 533 → 714
        };
      },
      // Chart inset inside the 943 × 754 design page minus the 20 px the layout
      // owns on every side, so the with-sidebar page renders at scale 1.
      padding: {
        x: (943 - CHART.width) / 2 - 20, // 20
        y: (754 - CHART.height) / 2 - 20, // 90.5
      },
    },
    labels: Object.values(this.labels),
  };

  constructor(dataset, options, config = {}) {
    super();
    this._init(dataset, options, config);
  }

  _calcContext() {
    const s = this.dataset.score; // [raw, percent] × 3 scales, then status

    // Anything but an explicit "valid" is no result: a missing status must not
    // let `?? 0` zeros read as the lowest valid score.
    if (s[6].mark !== "valid") return [{ valid: false }];

    // Fixed order from `labels`; never sorted by score.
    const scales = [0, 1, 2].map((i) => {
      const { eng, title, max } = s[2 * i].label;
      const mark = Number(s[2 * i].mark ?? 0);
      const p = Math.min(Math.max(Number(s[2 * i + 1].mark ?? 0), 0), 1);
      const thousandths = Math.round(p * 1000);
      return {
        key: eng,
        title,
        mark,
        max,
        pct: Math.floor((thousandths + 5) / 10),
        x: GAUGES_X + GAUGE.overhang + (2 - i) * GAUGE.pitch,
        fillPath: ringPath(p),
      };
    });

    return [{ valid: true, scales, theme: THEME, trackPath: ringPath(1), textTop: TEXT_TOP }];
  }
}

module.exports = CAARS93;

// Same rounded 270° ring as PRPS93: Figma's rounded ellipse trims each circular
// edge by the corner's arc length and joins it to the radial edge with cubic
// quarter-circle handles. Kept local, as in PRPS93: the shared gauge helper has
// different corner geometry. Coordinates are relative to the centre.
function ringPath(p) {
  if (p <= 0) return "";
  const { radius: R, inner: r } = GAUGE;
  const start = -Math.PI / 2;
  const sweep = (3 * Math.PI * p) / 2;
  const end = start + sweep;
  const f = Math.min(GAUGE.corner, (sweep * r) / 2);
  const handle = (4 * (Math.SQRT2 - 1) * f) / 3;
  const point = (radius, angle) => [radius * Math.cos(angle), radius * Math.sin(angle)];
  const tangent = (a, angle, distance) => [a[0] - Math.sin(angle) * distance, a[1] + Math.cos(angle) * distance];
  const xy = (a) => a.map((n) => Number(n.toFixed(6))).join(" ");
  const os = point(R, start + f / R);
  const oe = point(R, end - f / R);
  const is = point(r, start + f / r);
  const ie = point(r, end - f / r);
  return [
    `M ${xy(point(R - f, start))}`,
    `C ${xy(point(R - f + handle, start))} ${xy(tangent(os, start + f / R, -handle))} ${xy(os)}`,
    `A ${R} ${R} 0 ${sweep - (2 * f) / R > Math.PI ? 1 : 0} 1 ${xy(oe)}`,
    `C ${xy(tangent(oe, end - f / R, handle))} ${xy(point(R - f + handle, end))} ${xy(point(R - f, end))}`,
    `L ${xy(point(r + f, end))}`,
    `C ${xy(point(r + f - handle, end))} ${xy(tangent(ie, end - f / r, handle))} ${xy(ie)}`,
    `A ${r} ${r} 0 ${sweep - (2 * f) / r > Math.PI ? 1 : 0} 0 ${xy(is)}`,
    `C ${xy(tangent(is, start + f / r, -handle))} ${xy(point(r + f - handle, start))} ${xy(point(r + f, start))} Z`,
  ].join(" ");
}
