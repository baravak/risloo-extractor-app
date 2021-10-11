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
    const {
      spec: {
        parameters: { IUS93: spec },
      },
      dataset,
    } = this;

    const { raw, items } = spec;

    // Separate Raw Data from the Dataset
    const rawData = dataset.score.shift();

    // Gather Required Info for Raw
    const raw = {
      label: rawData.label,
      mark: rawData.mark,
      eta: raw.circle.eta,
      zeta: FS.roundTo2((rawData.mark / raw.maxValue) * raw.circle.eta),
      fill: raw.fill,
      opacity: FS.roundTo2(0.5 + rawData.mark / raw.maxValue),
    };

    // Gather Required Info for Items
    const items = dataset.score.map((data) => ({
      label: data.label,
      mark: data.mark,
      eta: items.circle.eta,
      zeta: FS.roundTo2(
        (data.mark / items.maxValues[data.label.eng]) * items.circle.eta
      ),
      fill: items.fills[data.label.eng],
      opacity: FS.roundTo2(
        0.5 + data.mark / items.maxValues[data.label.eng]
      ),
    }));

    return { raw, items };
  }
}

module.exports = IUS93;
