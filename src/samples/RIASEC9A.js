const { Profile, Mappings } = require("../Profile");

class RIASEC9A extends Profile {
  // Number of pages
  static pages = 3;

  // Labels of the sample
  labels = {
    L1_0: { eng: "realistic_raw", fr: "واقع‌گرا", short: "و", enShort:"R" },
    L1_1: { eng: "realistic_percentage" },
    L1_2: { eng: "realistic_rank" },
    L1_3: { eng: "realistic_congruence" },
    L1_4: { eng: "realistic_calibrated" },
    L2_0: { eng: "investigative_raw", fr: "جستجوگر", short: "ج", enShort:"I" },
    L2_1: { eng: "investigative_percentage" },
    L2_2: { eng: "investigative_rank" },
    L2_3: { eng: "investigative_congruence" },
    L2_4: { eng: "investigative_calibrated" },
    L3_0: { eng: "artistic_raw", fr: "هنری", short: "هـ", enShort:"A" },
    L3_1: { eng: "artistic_percentage" },
    L3_2: { eng: "artistic_rank" },
    L3_3: { eng: "artistic_congruence" },
    L3_4: { eng: "artistic_calibrated" },
    L4_0: { eng: "social_raw", fr: "اجتماعی", short: "الف", enShort:"S" },
    L4_1: { eng: "social_percentage" },
    L4_2: { eng: "social_rank" },
    L4_3: { eng: "social_congruence" },
    L4_4: { eng: "social_calibrated" },
    L5_0: { eng: "enterprising_raw", fr: "متهور", short: "م", enShort:"E" },
    L5_1: { eng: "enterprising_percentage" },
    L5_2: { eng: "enterprising_rank" },
    L5_3: { eng: "enterprising_congruence" },
    L5_4: { eng: "enterprising_calibrated" },
    L6_0: { eng: "conventional_raw", fr: "قراردادی", short: "ق", enShort:"C" },
    L6_1: { eng: "conventional_percentage" },
    L6_2: { eng: "conventional_rank" },
    L6_3: { eng: "conventional_congruence" },
    L6_4: { eng: "conventional_calibrated" },
    Llt: { eng: "code_letters_abbr" },
    
  };

  profileSpec = {
    /* "sample" determines some important info about the sample and profile */
    /* Default prerequisites: 1. gender, 2. age, 3. education */
    /* "prerequisites" is synonym to "fields" in our program */
    sample: {
      name: "پرسشنامه رغبت‌سنج تحصیلی - شغلی هالند - ویرایش حوزه" /* Name of the sample */,
      multiProfile: false /* Whether the sample has multiple profiles or not */,
      questions: true /* Determines whether to get questions from inital dataset or not */,
      defaultFields: true /* Determines whether to have default prerequisites in the profile or not */,
      fields: ["marital_status"] /* In case you want to get some additional fields and show in the profile */,
    },
    /* "profile" determines the dimensions of the drawn profile (to be used in svg tag viewbox) */
    /* calculating its dimensions carefully is of great importance */
    profile: {
      get dimensions() {
        return [
          {
            width: 602 + 2 * this.padding[0].x,
            height: 595 + 2 * this.padding[0].y,
          },
          {
            width: 592 + 2 * this.padding[1].x,
            height: 523 + 2 * this.padding[1].y,
          },
          {
            width: 686 + 2 * this.padding[2].x,
            height: 404 + 2 * this.padding[2].y,
          },
        ];
      },
      padding: [
        {
          x: 0,
          y: 51,
        },
        {
          x: 147,
          y: 96,
        },
        {
          x: 109,
          y: 155,
        },
      ],
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
        widthCoeff: 500 / 56,
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
    const Items = [];
    for (let i = 0; i < 30; i += 5) {
      const item = dataset.score[i];
      item.percentage = dataset.score[i + 1].mark ?? 0;
      item.rank = dataset.score[i + 2].mark ?? 0;
      item.congruence = dataset.score[i + 3].mark ?? 0;
      item.calibrated = dataset.score[i + 4].mark ?? 0;
      Items.push(item);
    }
    const map = new Map(Items.map(i => [i.label.enShort, i.label.short]))
    const reportMap = dataset.score[30].mark.split('-').map(r => {
      return r.split(',').map(key => map.get(key)).join(' - ')
    })
    // Gathering required info for page 1 items
    const items = Items.map((data) => ({
      label: data.label,
      mark: data.mark,
      width: data.mark * itemsSpec.rect.widthCoeff,
      opacity: itemsSpec.rect.opacityMappings.map(data.mark),
      percentage: data.percentage,
      rank: data.rank,
      congruence: data.congruence,
      calibrated: data.calibrated,
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
    const itemObject = {};
    let last = undefined;
    const list = items
      .map((item) => item.mark)
      .sort((a, b) => b - a)
      .filter((mark, i) => {
        if (i <= 2) {
          last = mark;
          return true;
        }
        if (mark === last) {
          return true;
        } else {
          return false;
        }
      });
    items.forEach((item) => (itemObject[item.label.eng.slice(0, -4)] = item));
    const itemRadians = [
      itemObject.artistic,
      itemObject.social,
      itemObject.enterprising,
      itemObject.conventional,
      itemObject.realistic,
      itemObject.investigative,
    ].map((item, i) => {
      const mark = ((item.mark ?? 0) * 207) / 56;
      item.rad = pointsToCoordinates(mark - 14, i * 60);
      item.bold = list.includes(item.mark);
      item.percentageText = Math.floor(item.percentage * 100);
      return item;
    });

    return [
      {
        items: [...items].sort((item1, item2) => item2.mark - item1.mark),
        questionItems,
        titleAppend: " - ۱",
      },
      {
        itemRadians,
        titleAppend: " - ۲",
      },
      {
        items: [...items].reverse(),
        reportMap,
        titleAppend: " - ۳",
      },
    ];
  }
}

function pointsToCoordinates(mark, angle) {
  angle = (angle * Math.PI) / 180;
  const start = [296 + 31 * Math.cos(angle), 261.5 + 31 * Math.sin(angle)];
  const end = [start[0] + mark * Math.cos(angle), start[1] + mark * Math.sin(angle)];
  const value = [end[0] + 12 * Math.cos(angle), end[1] + 12 * Math.sin(angle)];
  return { start, end, value };
}

module.exports = RIASEC9A;
