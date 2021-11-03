import { Profile, FS } from "../profile";

const defaultSpec = {
  MOCI93: {
    /* "profile" determines the dimensions of the drawn profile (to be used in svg tag viewbox) */
    /* calculating its dimensions carefully is of great importance */
    profile: {
      dimensions:
        {} /* To be calculated in the class with the function provided */,
      calcDim: function (spec, n) {
        return {
          width:
            spec.items.distanceX * (n - 2) +
            spec.raw.distanceX +
            spec.raw.rect.width +
            spec.profile.padding.x * 2,
          height:
            (spec.raw.maxValue / spec.raw.step) * spec.raw.rect.distanceY -
            spec.raw.rect.offsetY +
            108 +
            spec.profile.padding.y * 2,
        };
      },
      padding: {
        x: 15,
        y: 50,
      },
    },
    /* "raw" is the general term used for total data element in the profile */
    raw: {
      offsetX: 110 /* Horizontal offset between raw and last item */,
      get distanceX() {
        return this.offsetX + this.rect.width;
      } /* Horizontal distance between raw and last item */,
      rect: {
        width: 60 /* Width of the raw rectangle */,
        height: 30 /* Height of the raw rectangle */,
        offsetY: 2 /* Vertical offset between two consecutive raw rectangles */,
        get distanceY() {
          return this.height + this.offsetY;
        } /* Vertical Distance between two consecutive raw rectangles */,
        defaultColor: "#F3F4F6" /* Default color of the raw rectangle */,
        color: "#831843" /* Focused color of the raw rectangle */,
      },
      maxValue: 30 /* Maximum value of raw mark provided by the dataset */,
      step: 2 /* Step is used to divide the mark in drawing the profile */,
    },
    /* "items" is the general term used for independent data elements to be drawn in the profile */
    items: {
      offsetX: 80 /* Horizontal offset between two consecutive item */,
      get distanceX() {
        return this.offsetX + this.rect.width;
      } /* Horizontal distance between two consecutive item */,
      rect: {
        width: 50 /* Width of the items rectangle */,
        height: 30 /* Height of the items rectangle */,
        offsetY: 2 /* Vertical offset between two consecutive items rectangle */,
        get distanceY() {
          return this.height + this.offsetY;
        } /* Vertical distance between two consecutive items rectangle */,
        defaultColor: "#F3F4F6" /* Default color of the items rectangle */,
        colors: [
          "#4C1D95",
          "#1E3A8A",
          "#374151",
          "#92400E",
        ] /* Colors used for theming items */,
      },
      maxValues: {
        washing: 11,
        control: 9,
        slowing_repeat: 7,
        doubt: 7,
      } /* Maximum values of items marks provided by the dataset */,
      step: 1 /* Step is used to divide the mark in drawing the profile */,
    },
    /* "labels" part which has to be provided for each profile */
    labels: {
      washing: {
        abbr: "W",
        fr: "شستشو",
      },
      control: {
        abbr: "C",
        fr: "وارسی",
      },
      slowing_repeat: {
        abbr: "SR",
        fr: "کندی - تکرار",
      },
      doubt: {
        abbr: "D",
        fr: "تردید",
      },
      total: {
        abbr: "T",
        fr: "نمره کل",
      },
    },
  },
};

export default class MOCI93 extends Profile {
  constructor(dataset, config = {}) {
    super(dataset, config, defaultSpec);
  }

  _calcContext() {
    const {
      spec: {
        parameters: { MOCI93: spec },
      },
      dataset,
    } = this;

    // Deconstructing the Spec of the Profile
    const {
      items: {
        maxValues,
        rect: { colors },
      },
    } = spec;

    // ّInit Spec
    spec.profile.dimensions = spec.profile.calcDim(spec, dataset.score.length);

    // Separate Raw Data from the Dataset
    const rawData = dataset.score.pop();

    // Gather Required Info for Raw
    const raw = {
      label: rawData.label,
      mark: rawData.mark,
    };

    // Gather Required Info for Items
    const items = dataset.score.map((data, index) => ({
      label: data.label,
      mark: data.mark,
      maxValue: maxValues[data.label.eng],
      fill: colors[index],
    }));

    return { items, raw };
  }
}