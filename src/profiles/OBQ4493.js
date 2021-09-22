import { Profile, FS } from "../profile";

const defaultSpec = {
  OBQ4493: {
    maxValues: {
      CP: 15,
      ICT: 16,
      RT: 21,
      PC: 30,
      G: 48,
      Total: 132,
    },
    indexLength: 3,
    rectHeight: 30,
    paddingX: 20,
    paddingY: 20,
    itemHeights: [35, 120, 205, 290, 375, 500, 625, 650],
    labels: {
      complete_performance: "CP",
      importance_and_control_of_thought: "ICT",
      responsibility_and_threat_estimation: "RT",
      perfectionism_certainty: "PC",
      general: "G",
      raw: "Total",
    },
    desc: "این آزمون هر چقدر به سمت مثبت برود، نشان‌دهنده باورهای وسواس بالاست و در صورت منفی بودن، باورهای وسواس پایین است.",
    descRectHeight: 100,
  },
};

class OBQ4493 extends Profile {
  constructor(dataset, config = {}) {
    super(dataset, config, defaultSpec);
  }

  _calcContext() {
    const { spec, dataset, canvas } = this;

    const { indexLength, maxValues, itemHeights, descRectHeight } =
      spec.parameters["OBQ4493"];

    canvas.height = itemHeights[itemHeights.length - 1] + descRectHeight;

    const num = dataset.score.values.length;

    const rectWidths = Object.entries(maxValues).map(
      (entry) => 2 * entry[1] * indexLength
    );
    const dataWidths = dataset.score.values.map(
      (item) => Math.abs(item) * indexLength
    );

    return {
      num,
      itemHeights,
      rectWidths,
      dataWidths,
    };
  }
}

module.exports = OBQ4493;
