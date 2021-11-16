const { Profile, FS } = require("../profile");

class CSI4 extends Profile {
  profileSpec = {
    /* "test" determines some important info about the test and profile */
    /* Default prerequisites: 1. gender, 2. age, 3. education */
    /* "prerequisites" is synonym to "fields" in our program */
    test: {
      name: "پرسشنامه ارزیابی سلامت روانی کودکان" /* Name of the test */,
      multiProfile: true /* Whether the test has multiple profiles or not */,
      pages: 2, /* Number of pages of the profile */
      answers: false /* Determines whether to get answers from inital dataset or not */,
      defaultFields: true /* Determines whether to have default prerequisites in the profile or not */,
      fields: [
        "marital_status",
      ] /* In case you want to get some additional fields and show in the profile */,
    },
    /* "profile" determines the dimensions of the drawn profile (to be used in svg tag viewbox) */
    /* calculating its dimensions carefully is of great importance */
    profile: {
      dimensions:
        {} /* To be calculated in the class with the function provided */,
      calcDim: function (spec, n) {
        return {
          width: 903 + spec.profile.padding.x * 2,
          height: 704 + spec.profile.padding.y * 2,
        };
      },
      padding: {
        x: 0,
        y: 0,
      },
    },
    /* "items" is the general term used for independent data elements to be drawn in the profile */
    items: {
      minValue: 0,
      maxValues: {
        attention_deficity_and_hyper_activity_disorder_total: 18,
        attention_deficity_and_hyper_activity_disorder_type_a: 9,
        attention_deficity_and_hyper_activity_disorder_type_b: 9,
        oppositional_defant_disorder: 8,
        conduct_disorder: 15,
        generalized_anxiety_disorder_total: 7,
        generalized_anxiety_disorder_type_a: 1,
        generalized_anxiety_disorder_type_b: 1,
        generalized_anxiety_disorder_type_c: 5,
        special_phobia: 1,
        obssesive: 1,
        compulsive: 1,
        post_terumatic_stress_disorder: 1,
        motor_tics: 1,
        vocal_tics: 1,
        schizophernia: 5,
        major_depression_total: 10,
        major_depression_type_a: 3,
        major_depression_type_b: 7,
        dysthymia_total: 8,
        dysthymia_type_a: 2,
        dysthymia_type_b: 6,
        autistic_disorder_total: 12,
        autistic_disorder_type_a: 4,
        autistic_disorder_type_b: 4,
        autistic_disorder_type_c: 4,
        asperger_disorder_total: 8,
        asperger_disorder_type_a: 4,
        asperger_disorder_type_b: 4,
        social_phobia: 4,
        seperation_anxiety_disorder: 8,
        enuresis: 1,
        encopresis: 1,
      },
      relatedGroups: {
        A: "D تا J",
        B: ["C", "F", "G"],
        C: "-",
        D: ["E52", "F", "G", "I", "J", "D", "E50", "E51"],
        E049: ["E50", "E51", "E52", "F", "J"],
        E050: ["D", "E49", "E53", "E54", "F", "I", "G"],
        E051: ["D", "E49", "E53", "E54", "F", "I", "G"],
        E052: ["E50", "E51", "F"],
        E053: "-",
        E054: "-",
        F: ["A", "G", "H"],
        G_1: ["A", "F", "دستایمی (اختلال خلقی خفیف)"],
        G_2: ["F", "اختلال افسردگی شدید"],
        H_1: ["F"],
        H_2: ["F", "E51", "E50", "آتیسم"],
        I: ["J", "H", "G", "F", "E49", "D"],
        J: ["H", "F", "D"],
        "-": "-",
      },
      rightPosArr: [
        10, 92, 399, 759, 893,
      ] /* Right position array of items table cells */,
      rect: {
        width: 903,
        height: 30,
        br: 4,
        offsetY: 10,
        get distanceY() {
          return this.height + this.offsetY;
        },
        colors: ["#F4F4F5", "#F1F5F9"],
        itemBar: {
          width: 75,
          height: 6,
          br: 3,
          defaultFill: "#D4D4D8",
          fill: "#BE185D",
        },
      },
    },
    /* "labels" part which has to be provided for each profile */
    labels: {
      attention_deficity_and_hyper_activity_disorder_total: {
        group: "A",
        fr: "بیش فعالی / اختلال توجه نوع مرکب",
      },
      attention_deficity_and_hyper_activity_disorder_type_a: {
        group: "A",
        fr: "سؤالات 1 تا 9",
      },
      attention_deficity_and_hyper_activity_disorder_type_b: {
        group: "A",
        fr: "سؤالات 10 تا 18",
      },
      oppositional_defant_disorder: {
        group: "B",
        fr: "اختلال نافرمانی مقابله‌ای",
      },
      conduct_disorder: {
        group: "C",
        fr: "اختلال سلوک",
      },
      generalized_anxiety_disorder_total: {
        group: "D",
        fr: "اختلال اضطراب تعمیم‌یافته",
      },
      generalized_anxiety_disorder_type_a: {
        group: "D",
        fr: "سؤال 42",
      },
      generalized_anxiety_disorder_type_b: {
        group: "D",
        fr: "سؤال 43",
      },
      generalized_anxiety_disorder_type_c: {
        group: "D",
        fr: "سؤال 62، 2، 46، 45، 44",
      },
      special_phobia: {
        group: "E049",
        fr: "ترس‌های مرضی خاص",
      },
      obssesive: {
        group: "E050",
        fr: "افکار وسواسی",
      },
      compulsive: {
        group: "E051",
        fr: "اعمال وسواسی",
      },
      post_terumatic_stress_disorder: {
        group: "E052",
        fr: "اختلال استرس پس از حادثه",
      },
      motor_tics: {
        group: "E053",
        fr: "تیک‌های حرکتی",
      },
      vocal_tics: {
        group: "E054",
        fr: "تیک‌های صورتی",
      },
      schizophernia: {
        group: "F",
        fr: "اسکیزوفرنیا",
      },
      major_depression_total: {
        group: "G_1",
        fr: "اختلال افسردگی شدید",
      },
      major_depression_type_a: {
        group: "G_1",
        fr: "الف",
      },
      major_depression_type_b: {
        group: "G_1",
        fr: "ب",
      },
      dysthymia_total: {
        group: "G_2",
        fr: "اختلال افسردگی خویی",
      },
      dysthymia_type_a: {
        group: "G_2",
        fr: "الف",
      },
      dysthymia_type_b: {
        group: "G_2",
        fr: "سؤالات 62 تا 66 و 68",
      },
      autistic_disorder_total: {
        group: "H_1",
        fr: "اختلال آتیستیک",
      },
      autistic_disorder_type_a: {
        group: "H_1",
        fr: "سؤالات 70 تا 73",
      },
      autistic_disorder_type_b: {
        group: "H_1",
        fr: "سؤالات 74 تا 77",
      },
      autistic_disorder_type_c: {
        group: "H_1",
        fr: "سؤالات 78 تا 81",
      },
      asperger_disorder_total: {
        group: "H_2",
        fr: "اختلال اسپرگر",
      },
      asperger_disorder_type_a: {
        group: "H_2",
        fr: "سؤالات 70 تا 73",
      },
      asperger_disorder_type_b: {
        group: "H_2",
        fr: "سؤالات 78 تا 81",
      },
      social_phobia: {
        group: "I",
        fr: "ترس مرضی اجتماعی",
      },
      seperation_anxiety_disorder: {
        group: "J",
        fr: "اختلال اضطراب جدایی",
      },
      enuresis: {
        group: "-",
        fr: "شب ادراری",
      },
      encopresis: {
        group: "-",
        fr: "ادرار یا دفع بی‌موقع در حالت بیداری",
      },
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

    const { items: itemsSpec } = spec;

    // Init Spec
    spec.profile.dimensions = spec.profile.calcDim(spec, dataset.score.length);

    const datasetGroups = dataset.groupBy("group");

    const itemsGroups = datasetGroups.map((dataset) =>
      dataset.map((data) => ({
        label: data.label,
        mark: data.mark,
        width:
          (data.mark / itemsSpec.maxValues[data.label.eng]) *
          itemsSpec.rect.itemBar.width,
        relatedGroups: itemsSpec.relatedGroups[data.label.group],
      }))
    );

    return [
      { itemsGroups: itemsGroups.slice(0, 10) },
      { itemsGroups: itemsGroups.slice(10) },
    ];
  }
}

module.exports = CSI4;
