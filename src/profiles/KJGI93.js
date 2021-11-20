const { Profile, FS } = require("../profile");

class KJGI93 extends Profile {
  profileSpec = {
    /* "test" determines some important info about the test and profile */
    /* Default prerequisites: 1. gender, 2. age, 3. education */
    /* "prerequisites" is synonym to "fields" in our program */
    test: {
      name: "پرسشنامه احساس گناه گوکلر و جونز" /* Name of the test */,
      multiProfile: false /* Whether the test has multiple profiles or not */,
      questions: false /* Determines whether to get questions from inital dataset or not */,
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
          width:
            spec.items.distance.x * (n - 1) +
            2 * spec.items.markToRadius(spec.items.maxValue) +
            spec.profile.padding.x * 2,
          height:
            spec.raw.markToRadius(spec.raw.maxValue) * 2 +
            spec.interpretRects.height +
            spec.interpretRects.offsetY1 +
            spec.interpretRects.offsetY2 +
            spec.items.markToRadius(spec.items.maxValue) * 2 +
            spec.items.offset.y +
            20 +
            spec.profile.padding.y * 2,
        };
      },
      padding: {
        x: 10,
        y: 35,
      },
    },
    /* "raw" is the general term used for total data element in the profile */
    raw: {
      maxValue: 225 /* Maximum value of raw mark */,
      markToRadius: FS.createLine(
        { x: 45, y: 90 },
        { x: 225, y: 225 }
      ) /* The function used for converting mark to the radius of the circle */,
      get maxRadius() {
        return this.markToRadius(this.maxValue);
      } /* Maximum radius of raw circle */,
    },
    /* "items" is the general term used for independent data elements to be drawn in the profile */
    items: {
      maxValue: 225 /* Maximum value of items mark */,
      markToRadius: FS.createLine(
        { x: 45, y: 50 },
        { x: 225, y: 80 }
      ) /* The function used for converting mark to the radius of the circle */,
      get maxRadius() {
        return this.markToRadius(this.maxValue);
      } /* Maximum radius of items circle */,
      offset: {
        x: 10 /* Horizontal offset between items */,
        y: 10 /* Vertical offset between items and their labels */,
      },
      get distance() {
        return {
          x: this.offset.x + 2 * this.markToRadius(this.maxValue),
          y: this.offset.y + this.markToRadius(this.maxValue),
        };
      },
    },
    interpretRects: {
      width: 160 /* Width of interpretation rectangles */,
      height: 40 /* Height of interpretation rectangles */,
      borderRadius: 4 /* Border Radius of interpretation rectangles */,
      offsetX: 10 /* Horizontal offset between two adjacent interpretation rectangles */,
      offsetY1: 80 /* Vertical offset between raw circle and interpretation rectangles */,
      offsetY2: 25 /* Vertical offset between interpretation rectangles and items circles */,
      get distanceX() {
        return this.width + this.offsetX;
      } /* Horizontal distance between two adjacent interpretation rectangles */,
      labels: [
        { eng: "mild", fr: "احساس گناه کم" },
        { eng: "moderate", fr: "احساس گناه متوسط" },
        { eng: "severe", fr: "احساس گناه زیاد" },
      ] /* labels of interpretation rectangles */,
    },
    /* "labels" part which has to be provided for each profile */
    labels: {
      raw: { fr: "نمره کل" },
      moral_standards: { fr: "معیارهای اخلاقی" },
      state_guilt: { fr: "حالت گناه" },
      trait_guilt: { fr: "خصیصه گناه" },
      interpretation: { fr: "تفسیر" },
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
    let { raw: rawSpec, items: itemsSpec } = spec;

    // Separate Raw Data from the Dataset
    let rawData = dataset.score.shift();

    // Separate Interpretation from the Dataset
    let interpret = dataset.score.pop().mark;

    // ّInit Spec (Do Not Forget To Separate Raw)
    spec.profile.dimensions = spec.profile.calcDim(spec, dataset.score.length);

    // Gather Required Info for Raw
    const raw = {
      mark: rawData.mark,
      radius: FS.roundTo2(rawSpec.markToRadius(rawData.mark)),
    };

    // Gather Required Info for Items
    const items = dataset.score.map((data) => ({
      label: data.label.fr,
      mark: data.mark,
      radius: FS.roundTo2(itemsSpec.markToRadius(data.mark)),
    }));

    return [{
      raw,
      interpret,
      items,
    }];
  }
}

module.exports = KJGI93;
