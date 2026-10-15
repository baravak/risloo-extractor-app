const { Profile } = require("../Profile");

// ESS93: Figma 5405:146150, exact 250 × 187 semicircle component.
// The designer selected this presentation and title on 2026-10-15.
// Fill = raw / 24; the displayed percentage rounds halves up. No score bands.
// All questions are required; the designer removed the no-score presentation.
const TITLE = "خواب‌آلودگی اپوورث";
const THEME = { accent: "#818CF8", primary: "#4338CA", value: "#4F46E5", track: "#F1F5F9", secondary: "#64748B" };

class ESS93 extends Profile {
  static pages = 1;

  labels = { L1: { eng: "total", title: "نمرهٔ کل", max: 24 } };

  profileSpec = {
    sample: {
      name: TITLE,
      multiProfile: false,
      questions: false,
      defaultFields: true,
      fields: [],
    },
    profile: {
      // Measured Main insets: left 346/right 347; top 284/bottom 283.
      // Layout owns 20 px per side. Keep its 903 × 714 inner canvas at scale 1.
      dimensions: { width: 903, height: 714 },
      padding: { x: 346 - 20, y: 284 - 20 },
    },
    labels: Object.values(this.labels),
  };

  constructor(dataset, options, config = {}) {
    super();
    this._init(dataset, options, config);
  }

  _calcContext() {
    const mark = Number(this.dataset.score[0].mark ?? 0);
    const max = this.dataset.score[0].label.max;
    const p = Math.min(Math.max(mark / max, 0), 1);
    const end = Math.PI * (1 + p);
    const point = [125 + 125 * Math.cos(end), 167 + 125 * Math.sin(end)]
      .map(n => Number(n.toFixed(6))).join(" ");
    return [{
      title: TITLE,
      theme: THEME,
      total: { mark, max, p, pct: Math.round(p * 100),
        // Exact Figma track owns the rounded base corners. A sector clips only
        // the moving radial edge, preserving the source vector at every fill.
        fillClip: p > 0 ? `M 125 167 L 0 167 A 125 125 0 0 1 ${point} Z` : "",
      },
    }];
  }
}

module.exports = ESS93;
