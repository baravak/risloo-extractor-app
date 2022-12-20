const { Profile, Mappings } = require("../Profile");

class RIASEC93 extends Profile {
  // Number of pages
  static pages = 1;

  // Labels of the sample
  labels = {
    L1: { eng: "realistic", fr: "واقع‌گرا (و)" },
    L2: { eng: "investigative", fr: "جستجوگر (ج)" },
    L3: { eng: "artistic", fr: "هنری (ه)" },
    L4: { eng: "social", fr: "اجتماعی (الف)" },
    L5: { eng: "enterprising", fr: "متهور (م)" },
    L6: { eng: "conventional", fr: "قراردادی (ق)" },
  };

  profileSpec = {
    /* "sample" determines some important info about the sample and profile */
    /* Default prerequisites: 1. gender, 2. age, 3. education */
    /* "prerequisites" is synonym to "fields" in our program */
    sample: {
      name: "پرسشنامه رغبت‌سنج تحصیلی - شغلی" /* Name of the sample */,
      multiProfile: false /* Whether the sample has multiple profiles or not */,
      questions: true /* Determines whether to get questions from inital dataset or not */,
      defaultFields: true /* Determines whether to have default prerequisites in the profile or not */,
      fields: ["marital_status"] /* In case you want to get some additional fields and show in the profile */,
    },
    /* "profile" determines the dimensions of the drawn profile (to be used in svg tag viewbox) */
    /* calculating its dimensions carefully is of great importance */
    profile: {
      get dimensions() {
        return {
          width: 602 + 2 * this.padding.x,
          height: 595 + 2 * this.padding.y,
        };
      },
      padding: {
        x: 0,
        y: 51,
      },
    },
    /* "items" is the general term used for independent data elements to be drawn in the profile */
    items: {
      offsetY: 32 /* Horizontal offset between two top items */,
      get distanceY() {
        return this.offsetY + this.rect.body.height;
      } /* Horizontal distance between two top items */,
      maxValue: 50 /* Maximum value of items */,
      rect: {
        base: {
          height: 4,
        },
        body: {
          height: 8,
          brs: {
            tl: 0,
            tr: 4,
            bl: 0,
            br: 0,
          },
        },
        widthCoeff: 10,
        opacityMappings: new Mappings()
          .addMapping("1-10", 0.6)
          .addMapping("11-20", 0.7)
          .addMapping("21-30", 0.8)
          .addMapping("31-40", 0.9)
          .addMapping("41-50", 1) /* Opacity mapping for marks */,
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
    const { items: itemsSpec } = spec;

    dataset.score.sort((item1, item2) => item2.mark - item1.mark);

    // Gathering required info for page 1 items
    const items = dataset.score.map((data) => ({
      label: data.label,
      mark: data.mark,
      width: data.mark * itemsSpec.rect.widthCoeff,
      opacity: itemsSpec.rect.opacityMappings.map(data.mark),
    }));

    const questionItems = [
      {
        label: "فعالیت‌ها",
        marks: Array(6)
          .fill(11)
          .map((n, index) =>
            dataset.questions
              .slice(index * n, (index + 1) * n)
              .reduce((sum, { user_answered }) => sum + (+user_answered !== 2 ? 1 : 0), 0)
          ),
      },
      {
        label: "تجربه‌ها",
        marks: Array(6)
          .fill(11)
          .map((n, index) =>
            dataset.questions
              .slice(66 + index * n, 66 + (index + 1) * n)
              .reduce((sum, { user_answered }) => sum + (+user_answered !== 2 ? 1 : 0), 0)
          ),
      },
      {
        label: "مشاغل",
        marks: Array(6)
          .fill(14)
          .map((n, index) =>
            dataset.questions
              .slice(132 + index * n, 132 + (index + 1) * n)
              .reduce((sum, { user_answered }) => sum + (+user_answered !== 2 ? 1 : 0), 0)
          ),
      },
      {
        label: "خودسنجی ۱",
        marks: dataset.questions.slice(216, 216 + 6).map((q) => +q.user_answered),
      },
      {
        label: "خودسنجی ۲",
        marks: dataset.questions.slice(222, 222 + 6).map((q) => +q.user_answered),
      },
    ];

    return [{ items, questionItems }];
  }
}

module.exports = RIASEC93;
