const { Profile } = require("../Profile");

class CSI93 extends Profile {
  // Number of pages
  static pages = 2;

  // Labels of the sample
  labels = {
    L1: {
      eng: "attention_deficity_and_hyper_activity_disorder_total",
      fr: "بیش فعالی / اختلال توجه نوع مرکب",
      group: "A",
    },
    L2: {
      eng: "attention_deficity_and_hyper_activity_disorder_type_a",
      fr: "سؤالات 1 تا 9",
      group: "A",
    },
    L3: {
      eng: "attention_deficity_and_hyper_activity_disorder_type_b",
      fr: "سؤالات 10 تا 18",
      group: "A",
    },
    L4: {
      eng: "oppositional_defant_disorder",
      fr: "اختلال نافرمانی مقابله‌ای",
      group: "B",
    },
    L5: {
      eng: "conduct_disorder",
      fr: "اختلال سلوک",
      group: "C",
    },
    L6: {
      eng: "generalized_anxiety_disorder_total",
      fr: "اختلال اضطراب تعمیم‌یافته",
      group: "D",
    },
    L7: {
      eng: "generalized_anxiety_disorder_type_a",
      fr: "سؤال 42",
      group: "D",
    },
    L8: {
      eng: "generalized_anxiety_disorder_type_b",
      fr: "سؤال 43",
      group: "D",
    },
    L9: {
      eng: "generalized_anxiety_disorder_type_c",
      fr: "سؤال 62، 2، 46، 45، 44",
      group: "D",
    },
    L10: {
      eng: "special_phobia",
      fr: "ترس‌های مرضی خاص",
      group: "E049",
    },
    L11: {
      eng: "obssesive",
      fr: "افکار وسواسی",
      group: "E050",
    },
    L12: {
      eng: "compulsive",
      fr: "اعمال وسواسی",
      group: "E051",
    },
    L13: {
      eng: "post_terumatic_stress_disorder",
      fr: "اختلال استرس پس از حادثه",
      group: "E052",
    },
    L14: {
      eng: "motor_tics",
      fr: "تیک‌های حرکتی",
      group: "E053",
    },
    L15: {
      eng: "vocal_tics",
      fr: "تیک‌های صورتی",
      group: "E054",
    },
    L16: {
      eng: "schizophernia",
      fr: "اسکیزوفرنیا",
      group: "F",
    },
    L17: {
      eng: "major_depression_total",
      fr: "اختلال افسردگی شدید",
      group: "G_1",
    },
    L18: {
      eng: "major_depression_type_a",
      fr: "الف",
      group: "G_1",
    },
    L19: {
      eng: "major_depression_type_b",
      fr: "ب",
      group: "G_1",
    },
    L20: {
      eng: "dysthymia_total",
      fr: "اختلال افسردگی خویی",
      group: "G_2",
    },
    L21: {
      eng: "dysthymia_type_a",
      fr: "الف",
      group: "G_2",
    },
    L22: {
      eng: "dysthymia_type_b",
      fr: "سؤالات 62 تا 66 و 68",
      group: "G_2",
    },
    L23: {
      eng: "autistic_disorder_total",
      fr: "اختلال آتیستیک",
      group: "H_1",
    },
    L24: {
      eng: "autistic_disorder_type_a",
      fr: "سؤالات 70 تا 73",
      group: "H_1",
    },
    L25: {
      eng: "autistic_disorder_type_b",
      fr: "سؤالات 74 تا 77",
      group: "H_1",
    },
    L26: {
      eng: "autistic_disorder_type_c",
      fr: "سؤالات 78 تا 81",
      group: "H_1",
    },
    L27: {
      eng: "asperger_disorder_total",
      fr: "اختلال اسپرگر",
      group: "H_2",
    },
    L28: {
      eng: "asperger_disorder_type_a",
      fr: "سؤالات 70 تا 73",
      group: "H_2",
    },
    L29: {
      eng: "asperger_disorder_type_b",
      fr: "سؤالات 78 تا 81",
      group: "H_2",
    },
    L30: {
      eng: "social_phobia",
      fr: "ترس مرضی اجتماعی",
      group: "I",
    },
    L31: {
      eng: "seperation_anxiety_disorder",
      fr: "اختلال اضطراب جدایی",
      group: "J",
    },
    L32: {
      eng: "enuresis",
      fr: "شب ادراری",
      group: "-",
    },
    L33: {
      eng: "encopresis",
      fr: "ادرار یا دفع بی‌موقع در حالت بیداری",
      group: "-",
    },
  };

  profileSpec = {
    /* "sample" determines some important info about the sample and profile */
    /* Default prerequisites: 1. gender, 2. age, 3. education */
    /* "prerequisites" is synonym to "fields" in our program */
    sample: {
      name: "پرسشنامه ارزیابی سلامت روانی کودکان" /* Name of the sample */,
      multiProfile: true /* Whether the sample has multiple profiles or not */,
      questions: false /* Determines whether to get questions from inital dataset or not */,
      defaultFields: false /* Determines whether to have default prerequisites in the profile or not */,
      fields: [
        "child_gender",
        "child_age",
        "child_education",
        "parent_role",
      ] /* In case you want to get some additional fields and show in the profile */,
    },
    /* "profile" determines the dimensions of the drawn profile (to be used in svg tag viewbox) */
    /* calculating its dimensions carefully is of great importance */
    profile: {
      get dimensions() {
        return {
          width: 903 + 2 * this.padding.x,
          height: 704 + 2 * this.padding.y,
        }
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
        [this.labels.L1.eng]: 18,
        [this.labels.L2.eng]: 9,
        [this.labels.L3.eng]: 9,
        [this.labels.L4.eng]: 8,
        [this.labels.L5.eng]: 15,
        [this.labels.L6.eng]: 7,
        [this.labels.L7.eng]: 1,
        [this.labels.L8.eng]: 1,
        [this.labels.L9.eng]: 5,
        [this.labels.L10.eng]: 1,
        [this.labels.L11.eng]: 1,
        [this.labels.L12.eng]: 1,
        [this.labels.L13.eng]: 1,
        [this.labels.L14.eng]: 1,
        [this.labels.L15.eng]: 1,
        [this.labels.L16.eng]: 5,
        [this.labels.L17.eng]: 10,
        [this.labels.L18.eng]: 3,
        [this.labels.L19.eng]: 7,
        [this.labels.L20.eng]: 8,
        [this.labels.L21.eng]: 2,
        [this.labels.L22.eng]: 6,
        [this.labels.L23.eng]: 12,
        [this.labels.L24.eng]: 4,
        [this.labels.L25.eng]: 4,
        [this.labels.L26.eng]: 4,
        [this.labels.L27.eng]: 8,
        [this.labels.L28.eng]: 4,
        [this.labels.L29.eng]: 4,
        [this.labels.L30.eng]: 4,
        [this.labels.L31.eng]: 8,
        [this.labels.L32.eng]: 1,
        [this.labels.L33.eng]: 1,
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
      rightPosArr: [10, 92, 399, 759, 893] /* Right position array of items table cells */,
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

    const { items: itemsSpec } = spec;

    // Process Fields
    this._processFields();

    const datasetGroups = dataset.groupBy("group");

    const itemsGroups = datasetGroups.map((dataset) =>
      dataset.map((data) => ({
        label: data.label,
        mark: data.mark,
        width: (data.mark / itemsSpec.maxValues[data.label.eng]) * itemsSpec.rect.itemBar.width,
        relatedGroups: itemsSpec.relatedGroups[data.label.group],
      }))
    );

    return [{ itemsGroups: itemsGroups.slice(0, 10) }, { itemsGroups: itemsGroups.slice(10) }];
  }

  _processFields() {
    const {
      dataset: {
        info: { fields },
      },
    } = this;

    const parentRoleField = fields.find((field) => field.eng === "parent_role");
    parentRoleField.fr = "نسبت پاسخ‌دهنده با کودک";
  }
}

module.exports = CSI93;
