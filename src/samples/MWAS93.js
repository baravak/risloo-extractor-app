const { Profile } = require("../Profile");

// ---------------------------------------------------------------------------
// No Figma design: agent design from the approved brief
// (docs/profiles/MWAS_profile_brief_fa.md), in the bar language of TMPS93 /
// CDRISC93. Eight equal-length horizontal bars for the eight factors in the
// brief's order; each runs from 0 to its own maximum and is filled by its
// stored percent. The total sits beside them as a 270° ring (STAXI293 /
// CAARS93 geometry), centred on the bars, at the researcher's request
// (2026-11-11; the brief leaves size and layout to the designer). One solid
// colour for the factors, another for the total, one track colour, exactly as
// the brief gives them; no levels, zones, boundary lines or score-dependent
// colour, never sorted or highlighted.
// ---------------------------------------------------------------------------
const RING = { radius: 70, inner: 49, corner: 6, frame: 141, overhang: 3 }; // STAXI293 / CAARS93
const RING_X = RING.overhang; // the 100 % label reaches 3 px left of the 141 px frame
const RING_CENTRE = { x: 70.5, y: 70 }; // inside the frame
const RING_TITLE_Y = 172.06; // title baseline inside the frame
const ROW = { top: 54, pitch: 40 }; // first bar row, row pitch
const FACTORS = 8;
// Names end 32 px after the ring frame plus the longest name (about 92 px).
const TITLE_RIGHT = RING_X + RING.frame + 32 + 92; // 268
const BAR = { x: TITLE_RIGHT + 9, length: 400, height: 16, gap: 4, outsideGap: 6 }; // 277 → 677
const RAW_X = BAR.x + BAR.length + 14; // 691
const BASELINE = 12.06; // 13 px text baseline, measured from the row top (JSS93 / TMPS93)
const BARS_BOTTOM = ROW.top + (FACTORS - 1) * ROW.pitch + BAR.height; // 350
const CHART = { width: RAW_X + 60, height: BARS_BOTTOM + 24 }; // 751 × 374
// Brief palette (سطح‌بندی و رنگ): factors, total, unfilled part of every bar.
const COLOR = { factor: "#4F46E5", total: "#334155", track: "#E2E8F0" };
// The percentage moves outside the bar below 10 %, where "٪ NN" plus the 4 px
// tip gap would no longer fit (agent rule; placement is the designer's per the
// brief). The lowest valid MWAS percent is 20 %, so it never fires on valid data.
const INSIDE_MIN_PCT = 10;

class MWAS93 extends Profile {
  static pages = 1;

  // MWAS93 — پرسشنامه سنجش خردمندی دانش‌آموزان. Eight factors of 3–7 items
  // scored 1–5, and their total. Names, order and maxima come from the approved
  // brief; keys from scoring/MWAS93.py (`<factor>_raw`, `<factor>_percent`).
  // `percent` is the share of the row's own maximum as a 3-decimal fraction; it
  // drives both the bar or ring length and the "٪ NN" readout so they never disagree.
  labels = {
    L1_1: { eng: "general_raw", title: "خردمندی عمومی", max: 35 },
    L1_2: { eng: "general_percent" },

    L2_1: { eng: "religious_raw", title: "خردمندی دینی", max: 25 },
    L2_2: { eng: "religious_percent" },

    L3_1: { eng: "emotional_raw", title: "خردمندی عاطفی", max: 25 },
    L3_2: { eng: "emotional_percent" },

    L4_1: { eng: "human_raw", title: "خردمندی انسانی", max: 25 },
    L4_2: { eng: "human_percent" },

    L5_1: { eng: "spiritual_raw", title: "خردمندی معنوی", max: 20 },
    L5_2: { eng: "spiritual_percent" },

    L6_1: { eng: "moral_raw", title: "خردمندی اخلاقی", max: 20 },
    L6_2: { eng: "moral_percent" },

    L7_1: { eng: "social_raw", title: "خردمندی اجتماعی", max: 15 },
    L7_2: { eng: "social_percent" },

    L8_1: { eng: "scientific_raw", title: "خردمندی علمی", max: 15 },
    L8_2: { eng: "scientific_percent" },

    // The total is the ring beside the eight bars.
    L9_1: { eng: "total_raw", title: "نمرهٔ کل", max: 180, total: true },
    L9_2: { eng: "total_percent" },
  };

  profileSpec = {
    sample: {
      name: "پرسشنامه سنجش خردمندی دانش‌آموزان",
      multiProfile: false,
      questions: false,
      defaultFields: true,
      fields: [],
    },
    profile: {
      get dimensions() {
        return {
          width: CHART.width + 2 * this.padding.x, // 751 → 903
          height: CHART.height + 2 * this.padding.y, // 374 → 714
        };
      },
      // Chart centred on the 943 × 754 design page, minus the 20 px the layout
      // already owns on every side, so the page resolves to 903 × 714.
      padding: {
        x: (943 - CHART.width) / 2 - 20, // 76
        y: (754 - CHART.height) / 2 - 20, // 170
      },
    },
    labels: Object.values(this.labels),
  };

  constructor(dataset, options, config = {}) {
    super();
    this._init(dataset, options, config);
  }

  // One score: produced or not, its percent (halves up, integer arithmetic so
  // 0.815 reads 82, not 81, as CAARS93) and the fraction that draws it.
  _score(i) {
    const s = this.dataset.score;
    const raw = s[2 * i];
    const { max, title } = raw.label;
    // Every valid MWAS raw score is at least 3, so a missing raw mark means the
    // score was not produced: no number is shown (the brief forbids a 0 in place
    // of a score that was not made).
    const produced = raw.mark !== undefined && raw.mark !== null;
    if (!produced) return { title, max, produced };
    const p = Math.min(Math.max(Number(s[2 * i + 1].mark ?? 0), 0), 1);
    const thousandths = Math.round(p * 1000);
    return { title, max, produced, mark: Number(raw.mark), thousandths, p: thousandths / 1000, pct: Math.floor((thousandths + 5) / 10) };
  }

  _calcContext() {
    const items = [];
    for (let i = 0; i < FACTORS; i++) {
      const score = this._score(i);
      const top = ROW.top + i * ROW.pitch;
      if (!score.produced) {
        items.push({ ...score, top, width: 0, baseline: top + BASELINE });
        continue;
      }
      const width = (BAR.length * score.thousandths) / 1000;
      const inside = score.pct >= INSIDE_MIN_PCT;
      const tip = BAR.x + width;
      items.push({
        ...score,
        width,
        top,
        inside,
        labelX: inside ? tip - BAR.gap : tip + BAR.outsideGap,
        baseline: top + BASELINE,
      });
    }

    // The ring is centred on the bars, as STAXI293 centres a group's bars on its ring.
    const total = this._score(FACTORS);
    const ringTop = (ROW.top + BARS_BOTTOM) / 2 - RING_CENTRE.y;

    return [
      {
        items,
        color: COLOR,
        bar: BAR,
        titleRight: TITLE_RIGHT,
        rawX: RAW_X,
        baseline: { x: BAR.x - 0.5, y1: ROW.top - 23.5, y2: BARS_BOTTOM + 23.5 },
        ends: { zero: BAR.x - 0.5, full: BAR.x + BAR.length - 0.5 },
        ring: {
          ...total,
          x: RING_X,
          y: ringTop,
          centre: RING_CENTRE,
          titleY: RING_TITLE_Y,
          trackPath: ringPath(1),
          fillPath: total.produced ? ringPath(total.p) : "",
        },
      },
    ];
  }
}

module.exports = MWAS93;

// Same rounded 270° ring as STAXI293, PRPS93 and CAARS93: it starts at the top
// and runs clockwise; each circular edge is trimmed by the corner's arc length
// and joined to the radial edge with cubic quarter-circle handles. Kept local,
// as in those profiles. Coordinates are relative to the centre. An empty ring
// (0 %) draws no fill path at all, only the track.
function ringPath(p) {
  if (p <= 0) return "";
  const { radius: R, inner: r } = RING;
  const start = -Math.PI / 2;
  const sweep = (3 * Math.PI * Math.min(p, 1)) / 2;
  const end = start + sweep;
  const f = Math.min(RING.corner, (sweep * r) / 2);
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
