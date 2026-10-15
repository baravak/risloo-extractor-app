const { Profile } = require("../Profile");

// ---------------------------------------------------------------------------
// PRPS93 — مقیاس حل مساله دینی (فرم فارسی ۳۶ گویه‌ای، PRPS-FA36-C1).
// Designer's scientifically approved revision, 2026-10-15:
// percent = raw / 60 * 100 (not (raw - 12) / 48). Raw scoring is unchanged.
// Three independent gauges, in fixed RTL order: همکاری، خودجهت‌دهی، تأخیری.
// Gauge geometry: Figma 5405:143530 (140px, R70/r49, 270° sweep).
// Fixed factor hues requested by the designer, 2026-10-15; no score levels.
// Layout: Figma 2941:103565, 141px components separated by 88px.
// The 100% label extends 3px left of the first component's 141px frame:
// include that measured overhang in the content envelope, without scaling.
// No total, interpretation levels, score-dependent themes or no-score alert.
// ---------------------------------------------------------------------------
const CHART = { width: 602, height: 179 };
const GAUGE = { radius: 70, inner: 49, corner: 6, pitch: 229, overhang: 3 };
const THEMES = {
  collaborative: { accent: "#5EEAD4", primary: "#0F766E", track: "#F1F5F9" },
  self_directing: { accent: "#A5B4FC", primary: "#4338CA", track: "#F1F5F9" },
  deferring: { accent: "#C4B5FD", primary: "#7C3AED", track: "#F1F5F9" },
};

class PRPS93 extends Profile {
  static pages = 1;

  labels = {
    L1: { eng: "collaborative", title: "همکاری", min: 12, max: 60 },
    L2: { eng: "self_directing", title: "خودجهت‌دهی", min: 12, max: 60 },
    L3: { eng: "deferring", title: "تأخیری", min: 12, max: 60 },
  };

  profileSpec = {
    sample: {
      name: "مقیاس حل مساله دینی",
      multiProfile: false,
      questions: false,
      defaultFields: true,
      fields: [],
    },
    profile: {
      get dimensions() {
        return {
          width: CHART.width + 2 * this.padding.x, // 602 → 903
          height: CHART.height + 2 * this.padding.y, // 179 → 714
        };
      },
      // Chart inset inside the 943 × 754 design page minus the 20 px the layout
      // owns on every side, so the with-sidebar page renders at scale 1.
      padding: {
        x: (943 - CHART.width) / 2 - 20,
        y: (754 - CHART.height) / 2 - 20,
      },
    },
    labels: Object.values(this.labels),
  };

  constructor(dataset, options, config = {}) {
    super();
    this._init(dataset, options, config);
  }

  _calcContext() {
    const s = this.dataset.score;

    // Fixed order from `labels`; never sorted by score.
    const styles = s.slice(0, 3).map((data, i) => {
      const { eng, title, max } = data.label;
      const mark = Number(data.mark ?? 0);
      const p = Math.min(Math.max(mark / max, 0), 1);
      return {
        key: eng,
        theme: THEMES[eng],
        title,
        mark,
        max,
        p,
        pct: Math.round(p * 100),
        x: GAUGE.overhang + (2 - i) * GAUGE.pitch,
        fillPath: ringPath(p),
      };
    });

    return [{ styles, trackPath: ringPath(1) }];
  }
}

module.exports = PRPS93;

// Figma's rounded ellipse trims each circular edge by the corner's arc length
// and joins it to the radial edge with cubic quarter-circle handles. Keep this
// local: the shared gauge helper uses different corner geometry, and changing
// it would affect other assessments. Coordinates are relative to the centre.
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
