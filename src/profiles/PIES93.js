import { Profile, FS } from "../profile";

const defaultSpec = {
  PIES93: {
    raw: {
      maxValue: 160,
      ticks: {
        num: 4,
        widthOffset: 5,
        lineWidth: 9,
        numberOffset: {
          x: 15,
        },
      },
      rect: {
        width: 40,
        height: 610,
        get borderRadius() {
          return this.width / 2;
        },
      },
      circle: {
        radius: 18,
      },
      textOffset: {
        y: 40,
      },
      heightCoeff: 3.81,
    },
    items: {
      topPos: {
        initial_term: 95,
        common_diff: 70,
      },
      maxValue: 20,
      ticks: {
        num: 4,
        heightOffset: 40,
        numberOffset: {
          x: 15,
          y: 10,
        },
      },
      body: {
        widthCoeff: 25,
        colors: [
          "#8B5CF6",
          "#EC4899",
          "#10B981",
          "#F59E0B",
          "#007BA4",
          "#EF4444",
          "#6B7280",
          "#047857",
        ],
        opacityMapping: {
          20: 1,
          "16-19": 0.9,
          "11-15": 0.8,
          "6-10": 0.7,
          "1-5": 0.6,
        },
      },
      base: {
        rect: {
          width: 220,
          height: 40,
          get borderRadius() {
            return this.height / 2;
          },
        },
        circle: {
          radius: 18,
        },
        textOffset: {
          x: 40,
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
        ],
      },
    },
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
    const { spec, dataset, canvas } = this;

    const {
      raw: { maxValue: rawMaxValue, ticks: rawTicks, heightCoeff },
      items: {
        maxValue: itemsMaxValue,
        ticks: itemsTicks,
        topPos,
        base: {
          colors: baseColors,
          rect,
        },
        body: { widthCoeff, colors: bodyColors, opacityMapping },
      },
    } = spec.parameters["PIES93"];

    const num = dataset.score.values.length;

    const itemsTotalHeight = (num - 2) * topPos.common_diff + rect.height;

    canvas.height = topPos.initial_term + itemsTotalHeight + itemsTicks.heightOffset + 50;

    const labels = dataset.score.keys.slice(0, -1);
    const marks = dataset.score.values.slice(0, -1);
    const rawMark = dataset.score.values[num - 1];

    const raw = {
      mark: rawMark,
      height: rawMark * heightCoeff,
    };

    const itemsArr = marks.map((mark, index) => ({
      label: { abbr: labels[index].abbr, fr: labels[index].fr },
      width: mark * widthCoeff + rect.borderRadius,
      mark,
      baseColor: baseColors[index],
      body: {
        color: bodyColors[index],
        opacity: FS.mapInRange(mark, opacityMapping),
      },
    }));

    const rawTicksNumbers = FS.createArithmeticSequence(
      rawMaxValue,
      -rawMaxValue / rawTicks.num,
      rawTicks.num
    ).reverse();

    const rawTicksArr = rawTicksNumbers.map((tick) => ({
      number: tick,
      bottomPos: tick * heightCoeff,
    }));

    const itemsTicksNumbers = FS.createArithmeticSequence(
      itemsMaxValue,
      -itemsMaxValue / itemsTicks.num,
      itemsTicks.num
    ).reverse();

    const itemsTicksArr = itemsTicksNumbers.map((tick) => ({
      number: tick,
      leftPos: tick * widthCoeff,
    }));

    return {
      raw,
      itemsTotalHeight,
      itemsArr,
      itemsTicksArr,
      rawTicksArr,
    };
  }
}

module.exports = PIES93;
