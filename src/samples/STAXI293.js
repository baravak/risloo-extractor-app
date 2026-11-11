const { Profile } = require("../Profile");

// ---------------------------------------------------------------------------
// STAXI293 — سیاههٔ بیان خشم حالت–صفت، ویرایش دوم (STAXI-2)، فرم بزرگسال ۵۷ گویه‌ای.
// Built from the approved brief docs/profiles/STAXI-2_profile_brief_fa.md
// (approved 2026-11-07, sha256 1a8faaf0…1515e895): the scores are shown in
// three groups, each with its main score as a ring beside the bars of its
// sub-scores. No Figma design exists: this is an agent
// layout for the designer to review, in the existing language of
//   - JRAQ93: a group of sub-score bars with a 270° ring for the group's score;
//   - PRPS93 / CAARS93: the same ring (R70 / r49, 270°), its centre text and
//     its 0 / 100 % labels, built from approved briefs;
//   - RSI93 (Khosravi, CIR-05): rings on the left of horizontal bars, names on
//     the left of each bar, raw score after the bar's end;
//   - OHQ93: the horizontal bar, its percent, axis and raw-score column.
//
// Three groups, in the brief's order:
//   1. حالت خشم — احساس خشم، احساس تمایل به بیان کلامی، … جسمی
//   2. صفت خشم — خوی خشمناک، واکنش خشمناک
//   3. شاخص بیان خشم — بیان خشم به طرف بیرون / درون، کنترل خشم به طرف بیرون / درون
// Every bar and every ring is filled from 0 by the score's own stored percent
// of its maximum. A ring is not the sum of its bars and shares no axis with
// them. Sub-scores never fall below 25 %; only the index ring can be empty (0).
// One colour family for every bar and ring; no total, level label, band,
// boundary line, score-dependent colour, code or explanatory text.
// Unless status is exactly "valid", the page shows only «نمره تولید نشد».
// ---------------------------------------------------------------------------
const CHART = { width: 810, height: 632 };
const RING = { radius: 70, inner: 49, corner: 6, frame: 141, overhang: 3 }; // PRPS93 / CAARS93
const RING_X = RING.overhang; // the 100 % label reaches 3 px left of the 141 px frame
const RING_CENTRE = { x: 70.5, y: 70 }; // inside the frame
const RING_TITLE_Y = 172.06; // title baseline inside the frame (PRPS93)
const BLOCK = { top: 30, height: 177, gap: 36 }; // ring + title; groups 213 px apart top to top
// Names end 32 px after the ring frame plus the longest name (about 151 px,
// «احساس تمایل به بیان جسمی»). The two «… خشم» names were shortened at the
// researcher's request (2026-11-11) so the rings sit closer to the bars and the
// narrower chart leaves wider margins on both sides of the page.
const TITLE_RIGHT = RING_X + RING.frame + 32 + 152; // 328
const BAR = { x: TITLE_RIGHT + 8, width: 400, height: 16 }; // 100 % = 400 px; 336 → 736
const RAW = { left: BAR.x + BAR.width + 10, width: 64 }; // 746 → 810
const ROW_PITCH = 40; // 16 / 40 rows (BAR-02)
const GRID_MARGIN = 14; // gridlines and the zero line reach this far past the group's bars
const TICKS = [0, 25, 50, 75, 100];
// A bar's percent stays inside it (white, 4 px before the end) when the bar is at
// least this wide, otherwise 6 px after the end in the dark colour (BAR-05 / 06,
// VIS-30). Sub-scores never go below 25 % (100 px), so with scoring-valid data
// the percent is always inside; the outside branch only guards odd input.
const INSIDE_MIN = 40;
const COLOR = { light: "#BAE6FD", accent: "#7DD3FC", dark: "#0369A1", track: "#E2E8F0", ringTrack: "#F1F5F9" };

// Group structure: main score (ring) + sub-scores (bars), keys of `labels`.
const GROUPS = [
  { main: "state_anger", subs: ["state_feeling", "state_verbal", "state_physical"] },
  { main: "trait_anger", subs: ["trait_temperament", "trait_reaction"] },
  { main: "expression_index", subs: ["expression_out", "expression_in", "control_out", "control_in"] },
];

const pctWidth = (p) => (Math.min(Math.max(p, 0), 100) * BAR.width) / 100;

class STAXI293 extends Profile {
  static pages = 1;

  // Names and maxima from the brief's table; keys from scoring/STAXI293.py:
  // `<score>_raw`, and `<score>_percent` = raw ÷ the score's maximum, rounded to a
  // whole percent with halves up and stored as a fraction 0..1.
  labels = {
    L1: { eng: "state_anger_raw", title: "حالت خشم", max: 60 },
    L2: { eng: "state_anger_percent" },
    L3: { eng: "state_feeling_raw", title: "احساس خشم", max: 20 },
    L4: { eng: "state_feeling_percent" },
    L5: { eng: "state_verbal_raw", title: "احساس تمایل به بیان کلامی", max: 20 },
    L6: { eng: "state_verbal_percent" },
    L7: { eng: "state_physical_raw", title: "احساس تمایل به بیان جسمی", max: 20 },
    L8: { eng: "state_physical_percent" },
    L9: { eng: "trait_anger_raw", title: "صفت خشم", max: 40 },
    L10: { eng: "trait_anger_percent" },
    L11: { eng: "trait_temperament_raw", title: "خوی خشمناک", max: 16 },
    L12: { eng: "trait_temperament_percent" },
    L13: { eng: "trait_reaction_raw", title: "واکنش خشمناک", max: 16 },
    L14: { eng: "trait_reaction_percent" },
    L15: { eng: "expression_out_raw", title: "بیان خشم به طرف بیرون", max: 32 },
    L16: { eng: "expression_out_percent" },
    L17: { eng: "expression_in_raw", title: "بیان خشم به طرف درون", max: 32 },
    L18: { eng: "expression_in_percent" },
    L19: { eng: "control_out_raw", title: "کنترل خشم به طرف بیرون", max: 32 },
    L20: { eng: "control_out_percent" },
    L21: { eng: "control_in_raw", title: "کنترل خشم به طرف درون", max: 32 },
    L22: { eng: "control_in_percent" },
    L23: { eng: "expression_index_raw", title: "شاخص بیان خشم", max: 96 },
    L24: { eng: "expression_index_percent" },
    L25: { eng: "status" }, // valid | incomplete | invalid
  };

  profileSpec = {
    sample: {
      name: "سیاههٔ بیان خشم حالت–صفت، ویرایش دوم",
      multiProfile: false,
      questions: false,
      defaultFields: true,
      fields: [],
    },
    profile: {
      get dimensions() {
        return {
          width: CHART.width + 2 * this.padding.x, // 810 → 903
          height: CHART.height + 2 * this.padding.y, // 632 → 714
        };
      },
      // Chart centred on the 943 × 754 design page, minus the 20 px the layout owns.
      padding: {
        x: (943 - CHART.width) / 2 - 20, // 46.5
        y: (754 - CHART.height) / 2 - 20, // 41
      },
    },
    labels: Object.values(this.labels),
  };

  constructor(dataset, options, config = {}) {
    super();
    // `_extractData` turns a stored 0 into undefined (`score[key] || …`); keep the
    // scoring output itself so the index's real 0 reads as 0, not as missing.
    this.storedScore = (dataset && dataset.score) || {};
    this._init(dataset, options, config);
  }

  _stored(key) {
    const v = this.storedScore[key];
    if (v === undefined || v === null || v === "") return null;
    const n = Number(v);
    return Number.isFinite(n) ? n : null;
  }

  // One score: its label, raw score and whole percent (halves up, integer arithmetic).
  _score(name) {
    const label = Object.values(this.labels).find((l) => l.eng === `${name}_raw`);
    const raw = this._stored(`${name}_raw`);
    const percent = this._stored(`${name}_percent`);
    if (raw === null || percent === null) return null;
    const p = Math.min(Math.max(percent, 0), 1);
    const thousandths = Math.round(p * 1000);
    return { name, title: label.title, max: label.max, raw, p, pct: Math.floor((thousandths + 5) / 10) };
  }

  _calcContext() {
    // All-or-nothing: the status is read first, so `?? 0` can never turn the
    // None scores of an incomplete or invalid sheet into lowest scores.
    const scored = GROUPS.map((g) => ({ main: this._score(g.main), subs: g.subs.map((s) => this._score(s)) }));
    const complete = scored.every((g) => g.main && g.subs.every(Boolean));
    if (this.storedScore.status !== "valid" || !complete) return [{ valid: false, box: { x: CHART.width / 2 } }];

    const groups = scored.map(({ main, subs }, g) => {
      const top = BLOCK.top + g * (BLOCK.height + BLOCK.gap);
      const ringCentreY = top + RING_CENTRE.y;
      // The group's bars are centred on its ring's centre.
      const barsHeight = (subs.length - 1) * ROW_PITCH + BAR.height;
      const barsTop = ringCentreY - barsHeight / 2;
      const items = subs.map((s, i) => {
        const width = pctWidth(s.pct);
        const inside = width >= INSIDE_MIN;
        const rowTop = barsTop + i * ROW_PITCH;
        return {
          title: s.title,
          raw: s.raw,
          max: s.max,
          pct: s.pct,
          width,
          radius: Math.min(2, width),
          top: rowTop,
          titleBaseline: rowTop + 11.505,
          scoreBaseline: rowTop + 12.55,
          rawBaseline: rowTop + 13.36,
          slashShift: 0.66,
          maxShift: -0.165,
          percentX: inside ? BAR.x + width - 4 : BAR.x + width + 6,
          percentAnchor: inside ? "end" : "start",
          percentFill: inside ? "white" : COLOR.dark,
        };
      });
      const gridTop = barsTop - GRID_MARGIN;
      const gridBottom = barsTop + barsHeight + GRID_MARGIN;
      return {
        key: main.name,
        ring: {
          x: RING_X,
          y: top,
          title: main.title,
          raw: main.raw,
          max: main.max,
          pct: main.pct,
          fillPath: ringPath(main.p),
        },
        items,
        gridTop,
        gridBottom,
        gridHeight: gridBottom - gridTop,
      };
    });

    return [
      {
        valid: true,
        groups,
        bar: BAR,
        color: COLOR,
        ringCentre: RING_CENTRE,
        ringTitleX: RING_CENTRE.x,
        ringTitleY: RING_TITLE_Y,
        trackPath: ringPath(1),
        titleRight: TITLE_RIGHT,
        rawX: RAW.left,
        rawHeadingX: RAW.left + RAW.width / 2 - 26 - 6,
        baselineX: BAR.x - 0.5,
        ticks: TICKS.map((value) => ({
          value,
          x: BAR.x + pctWidth(value),
          labelX: value === 100 ? BAR.x + BAR.width + 1 : BAR.x + pctWidth(value),
          anchor: value === 100 ? "end" : "middle",
          dashed: value > 0,
        })),
      },
    ];
  }
}

module.exports = STAXI293;

// Same rounded 270° ring as PRPS93 and CAARS93: it starts at the top and runs
// clockwise; Figma's rounded ellipse trims each circular edge by the corner's
// arc length and joins it to the radial edge with cubic quarter-circle handles.
// Kept local, as in those two: the shared gauge helper has different corner
// geometry. Coordinates are relative to the centre. An empty ring (0 %) draws
// no fill path at all, only the track.
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
