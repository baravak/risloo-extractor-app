const { Profile, FS, Dataset } = require("../profile");

class SCASP93 extends Profile {
  profileSpec = {
    /* "test" determines some important info about the test and profile */
    /* Default prerequisites: 1. gender, 2. age, 3. education */
    /* "prerequisites" is synonym to "fields" in our program */
    test: {
      name: "پرسشنامه اضطراب کودکان اسپنس - نسخه والدین" /* Name of the test */,
      multiProfile: false /* Whether the test has multiple profiles or not */,
      answers: true /* Determines whether to get answers from inital dataset or not */,
      defaultFields: false /* Determines whether to have default prerequisites in the profile or not */,
      fields: [
        "child_name",
        "child_age",
        "child_gender",
        "birth_order",
        "sons",
        "daughters",
        "father_education",
        "father_job",
        "mother_education",
        "mother_job",
      ] /* In case you want to get some additional fields and show in the profile */,
    },
    /* "profile" determines the dimensions of the drawn profile (to be used in svg tag viewbox) */
    /* calculating its dimensions carefully is of great importance */
    profile: {
      dimensions:
        {} /* To be calculated in the class with the function provided */,
      calcDim: function (spec, n) {
        return {
          width: spec.descAnswer.rect.width + spec.profile.padding.x * 2,
          height:
            spec.items.header.height +
            spec.items.offsetY * 6 +
            spec.raw.offsetY +
            spec.raw.rect.height +
            spec.descAnswer.offsetY +
            spec.descAnswer.rect.height +
            spec.profile.padding.y * 2,
        };
      },
      padding: {
        x: 0,
        y: 13,
      },
    },
    /* "raw" is the general term used for total data element in the profile */
    raw: {
      maxValue: 114 /* Maximum value of raw */,
      offsetY: 80 /* Vertical offset between last item and raw */,
      leftPos: 73 /* Left position of the raw rectangle */,
      rect: {
        width: 740 /* Width of the raw rectangle */,
        height: 40 /* Height of the raw rectangle */,
        br: 5 /* Border radius of the raw rectangle */,
      },
      label: {
        offsetX: 23 /* Horizontal offset between label and raw rectangle */,
      },
      mark: {
        maxValueOffsetX: 10 /* Horizontal offset between maximum value and raw rectangle */,
        line: {
          offsetY: 5 /* Vertical offset between mark line and raw rectangle */,
          length: 10 /* Length of mark line */,
        },
        number: {
          offsetY: 13 /* Vertical offset between mark line and mark number */,
        },
      },
    },
    /* "descAnswer" determines the geometrical properties for the descriptive answer part */
    descAnswer: {
      offsetY: 40 /* Vertical offset between raw and descriptive answer rectangle */,
      rect: {
        width: 840 /* Width of the descriptive answer rectangle */,
        height: 100 /* Height of the descriptive answer rectangle */,
        br: 8 /* Border radius of the descriptive answer rectangle */,
        padding: 20 /* Padding of the descriptive answer rectangle */,
      },
      content: {
        lineHeight: 25 /* Line height of the descriptive answer */,
      },
    },
    /* "items" is the general term used for independent data elements to be drawn in the profile */
    items: {
      header: {
        offsetY1: 17,
        offsetY2: 42,
        get height() {
          return this.offsetY1 + this.offsetY2;
        } /* Height of header row */,
        legend: {
          leftPos: 756 /* Left position of legend part of header */,
          rect: {
            width: 12 /* Width of legend rectangle */,
            height: 12 /* Height of legend rectangle */,
            br: 2 /* Border radius of legend rectangle */,
            offsetX: 10 /* Horizontal offset between legend rectangles */,
            get distanceX() {
              return this.width + this.offsetX;
            } /* Horizontal distance between legend rectangles */,
          },
        },
      } /* Header part of the items table */,
      separatorLine: {
        length: 840 /* Length of separator line between each row of the items table */,
      },
      maxValues: {
        panic_attack_and_agorophobia: 27,
        separation_anxiety: 18,
        physical_injury_fears: 15,
        social_phobia: 18,
        obsessive_compulsive: 18,
        generalized_anxiety_disorder: 18,
      } /* Maximum value of items */,
      questionNumbers: {
        panic_attack_and_agorophobia: [12, 19, 25, 27, 28, 30, 32, 33, 34],
        separation_anxiety: [5, 8, 11, 14, 15, 38],
        physical_injury_fears: [2, 16, 21, 23, 29],
        social_phobia: [6, 7, 9, 10, 26, 31],
        obsessive_compulsive: [13, 17, 24, 35, 36, 37],
        generalized_anxiety_disorder: [1, 3, 4, 18, 20, 22],
      } /* Questions numbers array of each item */,
      offsetY: 60 /* Vertical offset between two items */,
      leftPosArr: [50, 282, 312] /* Left position array of items table cells */,
      paddingY: 10 /* Vertical padding inside items table cell */,
      rect: {
        width: 50 /* Width of the items rectangle */,
        height: 40 /* Height of the items rectangle */,
        br: 4 /* Border radius of the items rectangle */,
        offsetX: 9 /* Horizontal offset between two items rectangles */,
        get distanceX() {
          return this.width + this.offsetX;
        } /* Horizontal distance between two items rectangles */,
        intensities: {
          0: {
            fill: "white",
            stroke: "#D6D3D1",
            textFill: "#A8A29E",
          },
          1: {
            fill: "#FCA5A5",
            stroke: "none",
            textFill: "white",
          },
          2: {
            fill: "#EF4444",
            stroke: "none",
            textFill: "white",
          },
          3: {
            fill: "#B91C1C",  
            stroke: "none",
            textFill: "white",
          } /* Fill and stroke of different intensities of items rectangles */,
        },
      },
    },
    /* "labels" part which has to be provided for each profile */
    labels: {
      total: {
        fr: "نمره کل",
      },
      panic_attack_and_agorophobia: {
        fr: "اختلال هراس و ترس از فضای باز",
      },
      separation_anxiety: {
        fr: "اضطراب جدایی",
      },
      physical_injury_fears: {
        fr: "ترس از آسیب فیزیکی",
      },
      social_phobia: {
        fr: "ترس اجتماعی",
      },
      obsessive_compulsive: {
        fr: "وسواس فکری - عملی",
      },
      generalized_anxiety_disorder: {
        fr: "اضطراب عمومی (فراگیر)",
      },
    },
  };

  constructor(dataset, profileVariant, config = {}) {
    super();
    this._init(dataset, profileVariant, config);
  }

  _calcContext() {
    const {
      spec: { parameters: spec },
      dataset,
    } = this;

    // Deconstructing the Spec of the Profile
    const { raw: rawSpec, items: itemsSpec } = spec;

    // ّInit Spec
    spec.profile.dimensions = spec.profile.calcDim(spec, dataset.score.length);

    // Process Fields
    this._processFields();

    // Separate Raw Data from the Dataset
    const rawData = dataset.score.shift();

    const raw = {
      mark: rawData.mark,
      label: rawData.label,
      width: (rawData.mark / rawSpec.maxValue) * rawSpec.rect.width,
    };

    const items = dataset.score.map((data) => ({
      mark: data.mark,
      label: data.label,
      maxValue: itemsSpec.maxValues[data.label.eng],
      questions: itemsSpec.questionNumbers[data.label.eng].map((number) => ({
        number,
        intensity:
          itemsSpec.rect.intensities[
            dataset.answers[number - 1].user_answered - 1
          ],
      })),
    }));

    const descAnswer =
      dataset.answers[dataset.answers.length - 1].user_answered;

    return [{ raw, items, descAnswer }];
  }

  _processFields() {
    const {
      dataset: {
        info: { fields },
      },
    } = this;

    const birthOrderField = fields.find((field) => field.eng === "birth_order") 
    birthOrderField.fr = "فرزند چندم";

    const sonsFieldIndex = fields.findIndex((field) => field.eng === "sons");
    const daughtersFieldIndex = fields.findIndex(
      (field) => field.eng === "daughters"
    );

    const newField1 = Dataset.merge(
      fields[sonsFieldIndex],
      fields[daughtersFieldIndex],
      "تعداد فرزندان (دختر / پسر)",
      "{1} دختر / {0} پسر"
    );

    fields.splice(sonsFieldIndex, 2, newField1);

    const childAgeIndex = fields.findIndex(
      (field) => field.eng === "child_age"
    );
    const childGenderIndex = fields.findIndex((field) => field.eng === "child_gender");

    const newField2 = Dataset.merge(
      fields[childAgeIndex],
      fields[childGenderIndex],
      "سن کودک / جنسیت",
      "{0} / {1}"
    );

    fields.splice(childAgeIndex, 2, newField2);
  }
}

module.exports = SCASP93;
