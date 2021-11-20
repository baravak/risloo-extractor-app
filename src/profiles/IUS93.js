const { Profile, FS } = require("../profile");

class IUS93 extends Profile {
  profileSpec = {
    /* "test" determines some important info about the test and profile */
    /* Default prerequisites: 1. gender, 2. age, 3. education */
    /* "prerequisites" is synonym to "fields" in our program */
    test: {
      name: "پرسشنامه عدم تحمل بلاتکلیفی" /* Name of the test */,
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
            spec.items.circle.R * 4 +
            spec.items.offsetX +
            spec.items.ticks.line.width +
            spec.items.ticks.line.offset +
            spec.items.ticks.number.offset +
            20 +
            spec.profile.padding.x * 2,
          height:
            spec.raw.ticks.line.width +
            spec.raw.ticks.line.offset +
            spec.raw.ticks.number.offset +
            spec.raw.circle.R * 2 +
            spec.items.offsetY +
            spec.items.circle.R * 2 +
            spec.items.label.offsetY +
            spec.items.label.lineHeight +
            25 +
            spec.profile.padding.y * 2,
        };
      },
      padding: {
        x: 10,
        y: 45,
      },
    },
    /* "raw" is the general term used for total data element in the profile */
    raw: {
      maxValue: 135 /* Maximum value of raw mark provided by the dataset */,
      fill: "#B91C1C" /* Color used in the raw element */,
      circle: {
        R: 140 /* Radius of the outer circle of the raw element */,
        r: 85 /* Radius of the inner circle of the raw element */,
        brs: {
          start: 0,
          end: 12,
        } /* Border radiuses at each end of the gauge of the raw element */,
        angles: {
          start: FS.toRadians(-90),
          end: FS.toRadians(180),
        } /* Angles of each end of the raw element */,
        direction: false /* Clockwise direction for the raw gauge element */,
        get totalAngle() {
          return this.direction
            ? 2 * Math.PI - (this.angles.end - this.angles.start)
            : this.angles.end - this.angles.start;
        },
      },
      rect: {
        width: 135 /* Width of the label rect of the raw element */,
        height: 55 /* Height of the label rect of the raw element */,
        rb: 8 /* Border radius of the label rect of the raw element */,
        offsetX: 5 /* Offset between rectangle and the beginning of the gauge */,
      },
      ticks: {
        num: 2 /* Number of ticks */,
        line: {
          width: 12 /* Width of the tick line */,
          offset: 4 /* Offset from the element */,
        },
        number: {
          offset: 8 /* Offset from the line */,
        },
      },
    },
    /* "items" is the general term used for independent data elements to be drawn in the profile */
    items: {
      offsetX: 102 /* Horizontal offset between two items */,
      offsetY: 63 /* Vertical offset between items and raw */,
      get distanceX() {
        return this.offsetX + this.circle.R * 2;
      } /* Horizontal distance between two items */,
      maxValues: {
        factor_1: 75,
        factor_2: 60,
      } /* Maximum value of items */,
      fills: {
        factor_1: "#D97706",
        factor_2: "#1E3A8A",
      } /* Color used in items */,
      circle: {
        R: 90 /* Radius of the outer circle of the items element */,
        r: 50 /* Radius of the inner circle of the items element */,
        brs: {
          start: 0,
          end: 12,
        } /* Border radiuses at each end of the gauge of the items element */,
        angles: {
          start: FS.toRadians(-90),
          end: FS.toRadians(180),
        } /* Angles of each end of the items element */,
        direction: false /* Clockwise direction for the items gauge element */,
        get totalAngle() {
          return this.direction
            ? 2 * Math.PI - (this.angles.end - this.angles.start)
            : this.angles.end - this.angles.start;
        },
      },
      rect: {
        width: 85 /* Width of the label rect of the items element */,
        height: 40 /* Width of the label rect of the items element */,
        rb: 8 /* Width of the label rect of the items element */,
        offsetX: 5 /* Offset between rectangle and the beginning of the gauge */,
      },
      ticks: {
        num: 2 /* Number of ticks */,
        line: {
          width: 12 /* Width of the tick line */,
          offset: 4 /* Offset from the element */,
        },
        number: {
          offset: 8 /* Offset from the line */,
        },
      },
      label: {
        offsetY: 30,
        lineHeight: 25,
      },
    },
    /* "labels" part which has to be provided for each profile */
    labels: {
      raw: {
        title: "نمره کل",
        desc: "",
      },
      factor_1: {
        title: "عامل ۱",
        desc: "بلاتکلیفی تلویحات خودارجاعی و رفتار منفی دارد",
      },
      factor_2: {
        title: "عامل ۲",
        desc: "بلاتکلیفی غیرمنصفانه است و همه چیز را تباه می‌کند",
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

    // Separate Raw Data from the Dataset
    const rawData = dataset.score.shift();

    // ّInit Spec
    spec.profile.dimensions = spec.profile.calcDim(spec, dataset.score.length);

    // Calculate Ticks Numbers Array for Raw
    const rawTicksNumbers = FS.createArithmeticSequence(
      rawSpec.maxValue,
      -rawSpec.maxValue / (rawSpec.ticks.num - 1),
      rawSpec.ticks.num
    ).reverse();

    // Gather Required Info for Raw
    const raw = {
      label: rawData.label,
      mark: rawData.mark,
      zeta:
        (rawData.mark / rawSpec.maxValue) * rawSpec.circle.totalAngle +
        rawSpec.circle.angles.start,
      fill: rawSpec.fill,
      opacity: FS.roundTo2(0.5 * (1 + rawData.mark / rawSpec.maxValue)),
      ticks: rawTicksNumbers.map((tick) => ({
        number: tick,
        angle:
          (tick / rawSpec.maxValue) * rawSpec.circle.totalAngle +
          rawSpec.circle.angles.start,
      })),
    };

    // Calculate Ticks Numbers Object for Items
    const itemsTicksNumbers = Object.fromEntries(
      Object.entries(itemsSpec.maxValues).map((entry) => [
        entry[0],
        FS.createArithmeticSequence(
          entry[1],
          -entry[1] / (itemsSpec.ticks.num - 1),
          itemsSpec.ticks.num
        ).reverse(),
      ])
    );

    // Gather Required Info for Items
    const items = dataset.score.map((data) => ({
      label: data.label,
      mark: data.mark,
      zeta:
        (data.mark / itemsSpec.maxValues[data.label.eng]) *
          itemsSpec.circle.totalAngle +
        itemsSpec.circle.angles.start,
      fill: itemsSpec.fills[data.label.eng],
      opacity: FS.roundTo2(
        0.5 * (1 + data.mark / itemsSpec.maxValues[data.label.eng])
      ),
      ticks: itemsTicksNumbers[data.label.eng].map((tick) => ({
        number: tick,
        angle:
          (tick / itemsSpec.maxValues[data.label.eng]) *
            itemsSpec.circle.totalAngle +
          itemsSpec.circle.angles.start,
      })),
    }));

    return [{ raw, items }];
  }
}

module.exports = IUS93;
