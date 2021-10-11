import { Profile, FS } from "../profile";

const defaultSpec = {
  PIES93: {
    /* "profile" determines the dimensions of the drawn profile (to be used in svg tag viewbox) */
    /* calculating its dimensions carefully is of great importance */
    profile: {
      dimensions: {}, /* To be calculated in the class with the function provided */
      calcDim: function (spec, n) {
        return {
          width:
            spec.items.base.rect.width +
            spec.items.maxValue * spec.items.body.widthCoeff -
            spec.items.base.rect.borderRadius +
            spec.raw.offsetX +
            spec.raw.rect.width +
            spec.raw.ticks.line.offsetX +
            spec.raw.ticks.line.width +
            spec.raw.ticks.number.offsetX +
            30 +
            spec.profile.padding.x * 2,
          height:
            spec.items.calcTotalHeight(n) +
            spec.items.ticks.heightOffset * 2 +
            spec.profile.padding.y * 2,
        };
      },
      padding: {
        x: 40,
        y: 0,
      },
    },
    /* "raw" is the general term used for total data element in the profile */
    raw: {
      maxValue: 160 /* Maximum value of raw mark provided by the dataset */,
      offsetX: 120 /* Horizontal offset from items */,
      ticks: {
        num: 4 /* Number of ticks */,
        line: {
          width: 9 /* Width of the tick line */,
          offsetX: 5 /* Horizontal offset from the rectangle */,
        },
        number: {
          offsetX: 15 /* Horizontal Offset from the line */,
        },
      },
      rect: {
        width: 40 /* Width of the raw rectangle */,
        height: 610 /* Height of the raw rectangle */,
        get borderRadius() {
          return this.width / 2;
        } /* Border radius of the raw rectangle */,
      },
      label: {
        circle: {
          radius: 18 /* Radius of the circle in the label part */,
        },
        offsetY: 40 /* Vertical offset of the label from the circle */,
      },
      heightCoeff: 3.81 /* Used for converting mark to the height */,
    },
    /* "items" is the general term used for independent data elements to be drawn in the profile */
    items: {
      maxValue: 20 /* Maximum value of items mark provided by the dataset */,
      offsetY: 30 /* Offset between two consecutive item in the profile */,
      get distanceY() {
        return this.offsetY + this.base.rect.height;
      } /* Distance between two consecutive item in the profile */,
      totalHeight: "", /* To be calculated in the class with the function provided */
      calcTotalHeight: function (n) {
        return this.distanceY * (n - 1) + this.base.rect.height;
      } /* Method for calculating the total height of items */,
      ticks: {
        num: 4 /* Number of ticks */,
        heightOffset: 40 /* Half length that the ticks lines of items is greater than items total heigth */,
        numberOffset: {
          x: 15 /* Horizontal distance from the line */,
          y: 10 /* Vertical distance from the line */,
        },
      },
      body: {
        widthCoeff: 20 /* Used for converting mark to the width */,
        colors: [
          "#8B5CF6",
          "#EC4899",
          "#10B981",
          "#F59E0B",
          "#007BA4",
          "#EF4444",
          "#6B7280",
          "#047857",
        ] /* Colors used for theming items body parts */,
        opacityMapping: {
          20: 1,
          "16-19": 0.9,
          "11-15": 0.8,
          "6-10": 0.7,
          "1-5": 0.6,
        } /* Opacity mapping for marks */,
      },
      base: {
        rect: {
          width: 220 /* Width of the items rectangle (base part) */,
          height: 40 /* Height of the items rectangle (base part) */,
          get borderRadius() {
            return this.height / 2;
          } /* Border Radius of the items rectangle (base part) */,
        },
        label: {
          circle: {
            radius: 18 /* Radius of the circle in the label part */,
          },
          offsetX: 40 /* Horizontal offset of the label from the circle */,
        },
        colors: [
          "#A27DF8",
          "#F06DAD",
          "#40C79A",
          "#F7B13C",
          "#3395B6",
          "#F26969",
          "#898E99",
          "#369379",
        ] /* Colors used for theming items base parts */,
      },
    },
    /* "labels" part which has to be provided for each profile */
    labels: {
      hope: {
        abbr: "HO",
        fr: "امید",
      },
      will: {
        abbr: "W",
        fr: "اراده (خواسته)",
      },
      purpose: {
        abbr: "PU",
        fr: "هدف‌مندی",
      },
      competence: {
        abbr: "CO",
        fr: "شایستگی",
      },
      fidelity: {
        abbr: "FI",
        fr: "صداقت (وفاداری)",
      },
      love: {
        abbr: "LO",
        fr: "عشق",
      },
      care: {
        abbr: "CA",
        fr: "مراقبت",
      },
      wisdom: {
        abbr: "WI",
        fr: "خرد (فرزانگی)",
      },
      raw: {
        abbr: "#",
        fr: "نمره کل",
      },
    },
  },
};

class PIES93 extends Profile {
  constructor(dataset, config = {}) {
    super(dataset, config, defaultSpec);
  }

  _calcContext() {
    const {
      spec: {
        parameters: { PIES93: spec },
      },
      dataset,
    } = this;

    // Deconstructing the Spec of the Profile
    const {
      raw: { maxValue: rawMaxValue, ticks: rawTicksSpec, heightCoeff },
      items: {
        maxValue: itemsMaxValue,
        ticks: itemsTicksSpec,
        base: { colors: baseColors, rect },
        body: { widthCoeff, colors: bodyColors, opacityMapping },
      },
    } = spec;

    // Separate Raw Data from the Dataset
    const rawData = dataset.score.pop();

    // ّInit Spec (Do Not Forget To Separate Raw)
    spec.profile.dimensions = spec.profile.calcDim(spec, dataset.score.length);
    spec.items.totalHeight = spec.items.calcTotalHeight(dataset.score.length );

    // Gather Required Info for Raw
    const raw = {
      label: rawData.label,
      mark: rawData.mark,
      height: rawData.mark * heightCoeff,
    };

    // Gather Required Info for Items
    const items = dataset.score.map((data, index) => ({
      label: data.label,
      width: data.mark * widthCoeff + rect.borderRadius,
      mark: data.mark,
      baseColor: baseColors[index],
      body: {
        color: bodyColors[index],
        opacity: FS.mapInRange(data.mark, opacityMapping),
      },
    }));

    // Calculate Ticks Numbers Array for Raw
    const rawTicksNumbers = FS.createArithmeticSequence(
      rawMaxValue,
      -rawMaxValue / rawTicksSpec.num,
      rawTicksSpec.num
    ).reverse();

    // Gather Required Info for Raw Ticks
    const rawTicks = rawTicksNumbers.map((tick) => ({
      number: tick,
      bottomPos: tick * heightCoeff,
    }));

    // Calculate Ticks Numbers Array for Items
    const itemsTicksNumbers = FS.createArithmeticSequence(
      itemsMaxValue,
      -itemsMaxValue / itemsTicksSpec.num,
      itemsTicksSpec.num
    ).reverse();

    // Gather Required Info for Items Ticks
    const itemsTicks = itemsTicksNumbers.map((tick) => ({
      number: tick,
      leftPos: tick * widthCoeff,
    }));

    return {
      raw,
      items,
      rawTicks,
      itemsTicks,
    };
  }
}

module.exports = PIES93;
