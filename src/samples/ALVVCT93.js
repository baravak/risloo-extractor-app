const polygon = require("../handlebars/polygon");
const { Profile, FS } = require("../Profile");
class ALVVCT93 extends Profile {
  // Number of pages
  static pages = 1;

  // Labels of the sample
  labels = {
    L1: { eng: "theoretical_raw", fr: "نظری",  },
    L2: { eng: "theoretical_percentage"  },

    L3: { eng: "economic_raw", fr: "اقتصادی",  },
    L4: { eng: "economic_percentage"  },

    L5: { eng: "aesthetic_raw", fr: "هنری",  },
    L6: { eng: "aesthetic_percentage"  },

    L7: { eng: "social_raw", fr: "اجتماعی",  },
    L8: { eng: "social_percentage"  },

    L9: { eng: "political_raw", fr: "سیاسی",  },
    L10: { eng: "political_percentage"  },

    L11: { eng: "religious_raw", fr: "مذهبی",  },
    L12: { eng: "religious_percentage"  },
  };

  profileSpec = {
    /* "sample" determines some important info about the sample and profile */
    /* Default prerequisites: 1. gender, 2. age, 3. education */
    /* "prerequisites" is synonym to "fields" in our program */
    sample: {
      name: "آزمون بررسی ارزش‌های آلپورت" /* Name of the sample */,
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
          width: 607 + 2 * this.padding.x,
          height: 507 + 2 * this.padding.y,
        };
      },
      padding: {
        x: 145,
        y: 104,
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

    const largePolygon = polygon.shape(240, 240, 240);
    const centerPolygon = polygon.shape(240, 240, 32);
    const labelPoints = [
        [89, 0],
        [-42, 235],
        [89, 470],
        [399, 470],
        [520, 235],
        [399, 0],
    ]
    const items = dataset.score.filter((item, index) => index % 2 === 0).map((item, index) => {
        return {
            mark: item.mark,
            label: item.label.eng.replace("_raw", ""),
            title: item.label.fr,
            percentage: dataset.score[(index * 2) + 1].mark,
            plabel: Math.round(dataset.score[(index * 2) + 1].mark * 100),
            xl: labelPoints[index][0],
            yl: labelPoints[index][1]
        }
    });
    let list = [
        items[4],
        items[3],
        items[2],
        items[1],
        items[0],
        items[5],
    ]
    const listPoints = polygon.xy(240, 240, 240, list.map(item => item.percentage));
    list = list.map((item, index) => {
        return {
            ...item,
            x: listPoints[index][0],
            y: listPoints[index][1],
        }
    })
    const lines = polygon.xy(240, 240, 240, [1, 1, 1, 1, 1, 1]).map(item => ({x: item[0], y: item[1]}));
    const points = polygon.area(240, 240, 240, list.map(item => item.percentage));
    return [{ largePolygon, centerPolygon, points, items:list, lines  }];
  }
}

module.exports = ALVVCT93;
