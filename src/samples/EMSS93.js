const { Profile, FS } = require("../Profile");

class EMSS93 extends Profile {
  // Number of pages
  static pages = 1;

  profileSpec = {
    /* "test" determines some important info about the test and profile */
    /* Default prerequisites: 1. gender, 2. age, 3. education */
    /* "prerequisites" is synonym to "fields" in our program */
    test: {
      name: "پرسشنامه رضایت زناشویی انریچ ۴۷ سؤالی" /* Name of the test */,
      multiProfile: false /* Whether the test has multiple profiles or not */,
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
        personality_issues: 30,
        religious_orientation: 25,
        family_and_friends: 25,
        children_and_marriage: 25,
        sexual_relationship: 25,
        leisure_activities: 25,
        financial_management: 25,
        Conflict_resolution: 25,
        marital_communication: 30,
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
    labels: {
      raw: "نمره کل",
      t_score: "نمره t",
      t_score_summary: "خلاصه نمره t",
      personality_issues: "موضوعات شخصیتی",
      religious_orientation: "جهت‌گیری مذهبی",
      family_and_friends: "اقوام و دوستان",
      children_and_marriage: "ازدواج و فرزندان",
      sexual_relationship: "روابط جنسی",
      leisure_activities: "فعالیت‌های اوقات فراغت",
      financial_management: "مدیریت مالی",
      Conflict_resolution: "حل تعارض",
      marital_communication: "ارتباط زناشویی",
      personality_issues_interpretation: "تفسیر موضوعات شخصیتی",
      religious_orientation_interpretation: "تفسیر جهت‌گیری مذهبی",
      family_and_friends_interpretation: "تفسیر اقوام و دوستان",
      children_and_marriage_interpretation: "تفسیر ازدواج و فرزندان",
      sexual_relationship_interpretation: "تفسیر روابط جنسی",
      leisure_activities_interpretation: "تفسیر فعالیت‌های اوقات فراغت",
      financial_management_interpretation: "تفسیر مدیریت مالی",
      Conflict_resolution_interpretation: "تفسیر حل تعارض",
      marital_communication_interpretation: "تفسیر ارتباط زناشویی",
    },
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
