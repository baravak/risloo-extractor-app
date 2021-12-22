const { Profile, FS } = require("../Profile");

class EMSS93 extends Profile {
  // Number of pages
  static pages = 1;

  // Labels of the sample
  labels = {
    L1: { eng: "raw", fr: "نمره کل" },
    L2: { eng: "t_score", fr: "نمره t" },
    L3: { eng: "t_score_summary", fr: "خلاصه نمره t" },
    L4: { eng: "personality_issues", fr: "موضوعات شخصیتی" },
    L5: { eng: "religious_orientation", fr: "جهت‌گیری مذهبی" },
    L6: { eng: "family_and_friends", fr: "اقوام و دوستان" },
    L7: { eng: "children_and_marriage", fr: "ازدواج و فرزندان" },
    L8: { eng: "sexual_relationship", fr: "روابط جنسی" },
    L9: { eng: "leisure_activities", fr: "فعالیت‌های اوقات فراغت" },
    L10: { eng: "financial_management", fr: "مدیریت مالی" },
    L11: { eng: "Conflict_resolution", fr: "حل تعارض" },
    L12: { eng: "marital_communication", fr: "ارتباط زناشویی" },
    L13: { eng: "personality_issues_interpretation", fr: "تفسیر موضوعات شخصیتی" },
    L14: { eng: "religious_orientation_interpretation", fr: "تفسیر جهت‌گیری مذهبی" },
    L15: { eng: "family_and_friends_interpretation", fr: "تفسیر اقوام و دوستان" },
    L16: { eng: "children_and_marriage_interpretation", fr: "تفسیر ازدواج و فرزندان" },
    L17: { eng: "sexual_relationship_interpretation", fr: "تفسیر روابط جنسی" },
    L18: { eng: "leisure_activities_interpretation", fr: "تفسیر فعالیت‌های اوقات فراغت" },
    L19: { eng: "financial_management_interpretation", fr: "تفسیر مدیریت مالی" },
    L20: { eng: "Conflict_resolution_interpretation", fr: "تفسیر حل تعارض" },
    L21: { eng: "marital_communication_interpretation", fr: "تفسیر ارتباط زناشویی" },
  };

  profileSpec = {
    /* "sample" determines some important info about the sample and profile */
    /* Default prerequisites: 1. gender, 2. age, 3. education */
    /* "prerequisites" is synonym to "fields" in our program */
    sample: {
      name: "پرسشنامه رضایت زناشویی انریچ ۴۷ سؤالی" /* Name of the sample */,
      multiProfile: false /* Whether the sample has multiple profiles or not */,
      questions: false /* Determines whether to get questions from inital dataset or not */,
      defaultFields: true /* Determines whether to have default prerequisites in the profile or not */,
      fields: ["marital_status"] /* In case you want to get some additional fields and show in the profile */,
    },
    /* "profile" determines the dimensions of the drawn profile (to be used in svg tag viewbox) */
    /* calculating its dimensions carefully is of great importance */
    profile: {
      dimensions: {} /* To be calculated in the class with the function provided */,
      calcDim: function (spec, n) {
        return {
          width: 770 + spec.profile.padding.x * 2,
          height: 662 + spec.profile.padding.y * 2,
        };
      },
      padding: {
        x: 0,
        y: 20,
      },
    },
    raw: {
      stops: [11, 29, 40, 60, 70, 72],
      rect: {
        width: 30,
        brs: {
          tl: 0 /* Top left border radius */,
          bl: 0 /* Bottom left border radius */,
          tr: 4 /* Top right border radius */,
          br: 4 /* Bottom right border radius */,
        },
        opacity: {
          chosen: 0.8,
          default: 0.3,
        },
      },
      heightCoeff: 7.5,
      label: {
        shape: {
          width: 61,
          height: 46,
        },
      },
    },
    circles: {
      n: 9 /* Number of vertices of the polygons */,
      get theta() {
        return (2 * Math.PI) / this.n;
      },
      startAngle: FS.toRadians(-70) /* Start angle of the polygon */,
      radiuses: [50, 90, 130, 170, 210, 250] /* Radiuses array of circles */,
      get wholeRadius() {
        let len = this.radiuses.length;
        return this.radiuses[len - 1] - this.radiuses[0];
      },
    },
    /* "items" is the general term used for independent data elements to be drawn in the profile */
    items: {
      maxValues: {
        [this.labels.L4.eng]: 30,
        [this.labels.L5.eng]: 25,
        [this.labels.L6.eng]: 25,
        [this.labels.L7.eng]: 25,
        [this.labels.L8.eng]: 25,
        [this.labels.L9.eng]: 25,
        [this.labels.L10.eng]: 25,
        [this.labels.L11.eng]: 25,
        [this.labels.L12.eng]: 30,
      } /* Maximum values of marks provided by the dataset */,
      circle: {
        r: 50,
        brs: {
          tl: 4 /* Top left border radius */,
          bl: 0 /* Bottom left border radius */,
          tr: 4 /* Top right border radius */,
          br: 0 /* Bottom right border radius */,
        } /* Border radiuses at each end of the gauge of the items element */,
        direction: false /* Clockwise direction for the items gauge element */,
        totalAngle: FS.toRadians(32),
        opacity: 0.8,
      },
      labels: {
        offset: 50 /* Offset of the label from the vertice of the polygon */,
      },
      interprets: [
        { fill: "#EF4444", eng: "severe_dissatisfaction", fr: "نارضایتی شدید" },
        { fill: "#FBBF24", eng: "dissatisfaction", fr: "عدم رضایت" },
        { fill: "#9CA3AF", eng: "moderate_satisfaction", fr: "رضایت نسبی و متوسط" },
        { fill: "#38BDF8", eng: "severe_satisfaction", fr: "رضایت زیاد" },
        { fill: "#22C55E", eng: "extreme_satisfaction", fr: "رضایت فوق‌العاده" },
      ],
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
    let { circles: circlesSpec, items: itemsSpec } = spec;

    // ّInit Spec
    spec.profile.dimensions = spec.profile.calcDim(spec, 1);

    const rawData = dataset.score.slice(0, 3);
    const itemsData = dataset.score.slice(3, 12);
    const interpretsData = dataset.score.slice(12);

    const raw = {
      label: rawData[0].label,
      mark: rawData[0].mark,
      tScore: rawData[1].mark,
      tScoreIndex: itemsSpec.interprets.findIndex((interpretation) => interpretation.eng === rawData[2].mark) + 1,
      get fill() {
        return itemsSpec.interprets[this.tScoreIndex - 1].fill;
      },
    };

    const items = itemsData.map((data, dataIndex) => ({
      label: data.label,
      mark: data.mark,
      angle: circlesSpec.startAngle - dataIndex * circlesSpec.theta,
      tScore:
        itemsSpec.interprets.findIndex((interpretation) => interpretation.eng === interpretsData[dataIndex].mark) + 1,
      get radius() {
        return circlesSpec.radiuses.slice(1)[this.tScore - 1];
      },
      get fill() {
        return itemsSpec.interprets[this.tScore - 1].fill;
      },
    }));

    return [{ raw, items }];
  }
}

module.exports = EMSS93;
