const { Profile } = require("../Profile");

class FACES93 extends Profile {
  // Number of pages
  static pages = 2;

  // Labels of the sample
  labels = {
    L1: {
      eng: "a",
      fr: "منسجم متعادل",
    },
    L2: {
      eng: "c",
      fr: "از هم گسسته",
    },
    L3: {
      eng: "d",
      fr: "در هم تنیده",
    },
    L4: {
      eng: "e",
      fr: "خشک",
    },
    L5: {
      eng: "f",
      fr: "آشفته",
    },
    L6: {
      eng: "b",
      fr: "انعطاف‌پذیر متعادل",
    },
    L7: {
      eng: "communication",
      fr: "برقراری ارتباط در خانواده",
    },
    L8: {
      eng: "satisfaction",
      fr: "رضایت خانواده",
    },
    L9: {
      eng: "cohesion",
      fr: "انسجام",
    },
    L10: {
      eng: "flexibility",
      fr: "انعطاف‌پذیری",
    },
    L11: {
      eng: "interpretation",
      fr: "تفسیر",
    },
  };

  profileSpec = {
    /* "sample" determines some important info about the sample and profile */
    /* Default prerequisites: 1. gender, 2. age, 3. education */
    /* "prerequisites" is synonym to "fields" in our program */
    sample: {
      name: "پرسشنامه FACES-III" /* Name of the sample */,
      multiProfile: true /* Whether the sample has multiple profiles or not */,
      questions: false /* Determines whether to get questions from inital dataset or not */,
      defaultFields: true /* Determines whether to have default prerequisites in the profile or not */,
      fields: [
        "job",
        "marriage_duration",
        { merge: ["sons", "daughters"], fr: "تعداد فرزندان (دختر / پسر)", valueFormat: "{1} دختر / {0} پسر" },
        "religion",
      ] /* In case you want to get some additional fields and show in the profile */,
    },
    /* "profile" determines the dimensions of the drawn profile (to be used in svg tag viewbox) */
    /* calculating its dimensions carefully is of great importance */
    profile: {
      get dimensions() {
        return [
          {
            width: 825 + 2 * this.padding[0].x,
            height: 605 + 2 * this.padding[0].y,
          },
          {
            width: 802 + 2 * this.padding[1].x,
            height: 537.5 + 2 * this.padding[1].y,
          },
        ];
      },
      padding: [
        {
          x: 36.75,
          y: 0,
        },
        {
          x: 52,
          y: 0,
        },
      ],
    },
    page2: {
      /* "items" is the general term used for independent data elements to be drawn in the profile */
      items: {
        top: {
          baseline: {
            width: 800 /* Width of the baseline below items */,
          },
          maxValue: 35 /* Maximum value of items marks provided by the dataset */,
          topPos: 353.25 /* Top position of the baseline of items */,
          offsetX: 75 /* Horizontal offset between two consecutive item */,
          get distanceX() {
            return this.offsetX + this.rect.body.width;
          } /* Horizontal distance between two consecutive item */,
          rect: {
            base: {
              width: 4 /* Width of the base rectangle of items */,
              br: 2 /* Border radius of the base rectangle of items */,
              color: "#E4E4E7" /* Fill of the base rectangle */,
            },
            body: {
              width: 35 /* Width of the body rectangle of items */,
              height: 8 /* Height of the body rectangle parts of items */,
              offsetY: 1 /* Vertical offset between two parts of body rectangles */,
              get distanceY() {
                return this.height + this.offsetY;
              } /* Vertical distance between two parts of body rectangles */,
              br: 4 /* Border radius of the body rectangle of items */,
              colors: [
                "#A21CAF",
                "#C026D3",
                "#D946EF",
                "#A855F7",
                "#9333EA",
                "#7E22CE",
              ] /* Colors used for theming items body parts */,
            },
            heightCoeff: 9.28 /* Used to convert mark to height for base rectangle of items */,
          },
        },
        bottom: {
          maxValue: 50 /* Maximum value of raw mark provided by the dataset */,
          offsetY: 112.25 /* Vertical offset from items */,
          rect: {
            base: {
              width: 600 /* Width of the base rectangle of the raw */,
              height: 4 /* Height of the base rectangle of the raw */,
              br: 2 /* Border radius of the base rectangle of the raw */,
            },
            body: {
              height: 27 /* Height of the body rectangle of the raw */,
              br: 8 /* Border radius of the body rectangle of the raw */,
            },
          },
          widthCoeff: 12 /* Used for converting mark to the width */,
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

    const { page2: page2Spec } = spec;

    // Gather Required Info for Item (Page 1)
    const page1Item = {
      marks: {
        cohesion: dataset.score[8].mark,
        flexibility: dataset.score[9].mark,
      },
      coords: {
        x: this._markToCoord(dataset.score[8].mark, 120),
        y: this._markToCoord(dataset.score[9].mark, 80),
      },
    };

    // Gather Required Info for Items (Page 2)
    const page2Items = {
      top: dataset.score.slice(0, 6).map((data, index) => ({
        label: data.label,
        mark: data.mark,
        maxValue: page2Spec.items.top.maxValue,
        height: {
          base: page2Spec.items.top.maxValue * page2Spec.items.top.rect.heightCoeff + 5,
        },
        fill: page2Spec.items.top.rect.body.colors[index],
      })),
      bottom: dataset.score.slice(6, 8).map((data) => ({
        label: data.label,
        mark: data.mark,
        width: data.mark * page2Spec.items.bottom.widthCoeff,
      })),
    };

    return [
      { page: 1, item: page1Item },
      { page: 2, items: page2Items },
    ];
  }

  _markToCoord(mark, coeff) {
    const stops = [0, 15, 35, 65, 85, 100];
    const n = stops.length;
    let index;

    for (let i = 0; i < n; i++) {
      if (mark >= stops[i] && mark <= stops[i + 1]) {
        index = i;
        break;
      }
    }

    const coord = index * coeff + ((mark - stops[index]) / (stops[index + 1] - stops[index])) * coeff;

    return coord;
  }
}

module.exports = FACES93;
