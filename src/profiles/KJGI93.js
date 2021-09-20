import { Profile, FS } from "../profile";

const defaultSpec = {
  KJGI93: {
    radiusesFunc: {
      rawRadius: FS.createLine({ x: 45, y: 90 }, { x: 225, y: 225 }),
      itemRadius: FS.createLine({ x: 45, y: 50 }, { x: 225, y: 90 }),
    },
    items: {
      distance: {
        x: 200,
        y: 100,
      }
    },
    itemHeights: [280, 560, 700],
    interpretRects: {
      width: 160,
      height: 40,
      borderRadius: 4,
      distance: 170,
      labels: ["احساس گناه کم", "احساس گناه متوسط", "احساس گناه زیاد"],
    },
    labels: {
      raw: "raw",
      moral_standards: "معیارهای اخلاقی",
      state_guilt: "حالت گناه",
      trait_guilt: "خصیصه گناه",
      interpretation: "interpretation",
    },
  },
};

class KJGI93 extends Profile {
  constructor(dataset, config = {}) {
    super(dataset, config, defaultSpec);
  }

  _calcContext() {
    const { spec, dataset, canvas } = this;

    let { radiusesFunc, itemHeights, items: {distance} } = spec.parameters["KJGI93"];

    canvas.height = itemHeights[itemHeights.length - 1] + 1.5 * distance.y;

    let rawMark = dataset.score.values[0];
    let itemMarks = dataset.score.values.slice(1, 4);
    let itemLabels = dataset.score.keys.slice(1, 4);

    const raw = {
      mark: rawMark,
      radius: FS.roundTo2(radiusesFunc.rawRadius(rawMark)),
    };

    const items = itemMarks.map((item, index) => ({
      label: itemLabels[index],
      mark: item,
      radius: FS.roundTo2(radiusesFunc.itemRadius(item)),
    }));

    return {
      raw,
      items,
    };
  }
}

module.exports = KJGI93;
