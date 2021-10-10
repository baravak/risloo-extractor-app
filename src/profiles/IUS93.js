import { Profile, FS } from "../profile";

const defaultSpec = {
  IUS93: {
    raw: {
      maxValue: 135,
      fill: "#B91C1C",
      circle: {
        R: 140,
        r: 85,
        rb: 12,
        eta: 270,
      },
      rect: {
        width: 135,
        height: 55,
        rb: 8,
      },
    },
    items: {
      maxValues: {
        factor_1: 75,
        factor_2: 60,
      },
      fills: {
        factor_1: "#D97706",
        factor_2: "#1E3A8A",
      },
      circle: {
        R: 90,
        r: 50,
        rb: 12,
        eta: 270,
      },
      rect: {
        width: 85,
        height: 40,
        rb: 8,
      },
    },
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
  },
};

class IUS93 extends Profile {
  constructor(dataset, config = {}) {
    super(dataset, config, defaultSpec);
  }

  _calcContext() {
    const { spec, dataset, canvas } = this;

    const { raw, items } = spec.parameters["IUS93"];

    // const labels = dataset.score.keys.slice(1);
    // const marks = dataset.score.values.slice(1);
    // const rawLabel = dataset.score.keys[0];
    // const rawMark = dataset.score.values[0];

    // const rawItem = {
    //   label: rawLabel,
    //   mark: rawMark,
    //   eta: raw.circle.eta,
    //   zeta: FS.roundTo2((rawMark / raw.maxValue) * raw.circle.eta),
    //   fill: raw.fill,
    //   opacity: FS.roundTo2(0.5 + rawMark / raw.maxValue),
    // };

    // // console.log(labels);

    // const itemsArr = marks.map((mark, index) => ({
    //   label: labels[index],
    //   mark: mark,
    //   eta: items.circle.eta,
    //   zeta: FS.roundTo2(
    //     (mark / items.maxValues[labels[index].eng]) * items.circle.eta
    //   ),
    //   fill: items.fills[labels[index].eng],
    //   opacity: FS.roundTo2(
    //     0.5 + mark / items.maxValues[labels[index].eng]
    //   ),
    // }));

    // console.log(itemsArr);

    // return { rawItem, itemsArr };
  }
}

module.exports = IUS93;
