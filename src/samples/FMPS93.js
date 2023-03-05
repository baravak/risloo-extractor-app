const { Profile, FS, Mappings } = require("../Profile");

class FMPS93 extends Profile {
  // Number of pages
  static pages = 1;

  // Labels of the sample
  labels = {
    L1: { eng: "raw", fr: "نمره کل", max: 145},

    L2: { eng: "concern_over_mistakes", fr: "نگرانی درباره اشتباهات", fill: "#DB2777", bg:"#FDF2F8", max: 45},
    L3: { eng: "parental_criticism", fr: "انتقادگری والدین", fill: "#DB2777", bg:"#FDF2F8", max: 20},
    L4: { eng: "parental_expectations", fr: "انتظارات والدینی", fill: "#DB2777", bg:"#FDF2F8", max: 25},
    L5: { eng: "doubt_about_actions", fr: "تردید درباره کارها", fill: "#DB2777", bg:"#FDF2F8", max: 20},
    L6: { eng: "organization", fr: "نظم و سازماندهی", fill: "#16A34A", bg: "#F0FDF4", max: 30},
    L7: { eng: "personal_standards", fr: "معیارهای شخصی", fill: "#16A34A", bg: "#F0FDF4", max: 35},

    L8: { eng: "positive_perfectionism", fr: "کمال‌گرایی مثبت" , desc : "نظم و سازماندهی، معیارهای شخصی"},
    L9: { eng: "negative_perfectionism", fr: "کمال‌گرایی منفی" , desc : "نگرانی درباره اشتباهات، انتقادگری والدینی،\nانتظارات والدینی، تردید درباره کارها"},
  };

  profileSpec = {
    /* "sample" determines some important info about the sample and profile */
    /* Default prerequisites: 1. gender, 2. age, 3. education */
    /* "prerequisites" is synonym to "fields" in our program */
    sample: {
      name: "پرسشنامه هوش هیجانی بار-آن" /* Name of the sample */,
      multiProfile: false /* Whether the sample has multiple profiles or not */,
      questions: false /* Determines whether to get questions from inital dataset or not */,
      defaultFields: true /* Determines whether to have default prerequisites in the profile or not */,
      fields: [] /* In case you want to get some additional fields and show in the profile */,
    },
    /* "profile" determines the dimensions of the drawn profile (to be used in svg tag viewbox) */
    /* calculating its dimensions carefully is of great importance */
    profile: {
      get dimensions() {
        return {
          width: 761 + 2 * this.padding.x,
          height: 556 + 2 * this.padding.y,
        };
      },
      padding: {
        x: 79,
        y: 71,
      },
    },
    gaugeItems: {
      offsetX: 40.5 /* Horizontal offset between two top items */,
      get distanceX() {
        return this.offsetX + this.circle.R * 2;
      } /* Horizontal distance between two top items */,
      maxValues: {
          [this.labels.L8.eng]: 65,
          [this.labels.L9.eng]: 110,
      } /* Maximum value of items */,
      fills: {
          [this.labels.L8.eng]: "#16A34A",
          [this.labels.L9.eng]: "#DB2777",
      } /* Color used in items */,
      circle: {
        R: 60 /* Radius of the outer circle of the items element */,
        r: 36 /* Radius of the inner circle of the items element */,
        brs: {
          tl: 4 /* Top left border radius */,
          bl: 4 /* Bottom left border radius */,
          tr: 4 /* Top right border radius */,
          br: 4 /* Bottom right border radius */,
        } /* Border radiuses at each end of the gauge of the items element */,
        angles: {
          start: FS.toRadians(-90),
          end: FS.toRadians(180),
        } /* Angles of each end of the items element */,
        direction: false /* Clockwise direction for the items gauge element */,
        get totalAngle() {
          return this.direction
            ? 2 * Math.PI - (this.angles.end - this.angles.start)
            : this.angles.end - this.angles.start;
        },
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
    const { raw: rawSpec, gaugeItems: gaugeItemsSpec } = spec;


    let gaugeItems = dataset.score.slice(7,9).map((data) => ({
      label: data.label,
      mark: data.mark,
      zeta:
        (data.mark / gaugeItemsSpec.maxValues[data.label.eng]) * gaugeItemsSpec.circle.totalAngle +
        gaugeItemsSpec.circle.angles.start,
      fill: gaugeItemsSpec.fills[data.label.eng],
    }));

    const raw = dataset.score[0]
    const items = dataset.score.slice(1, 7)
    return [{ raw, items, gaugeItems }];
  }
}

module.exports = FMPS93;
