import { Profile, FS } from "../profile";

const defaultSpec = {
  BAOMEIS93: {
    /* "profile" determines the dimensions of the drawn profile (to be used in svg tag viewbox) */
    /* calculating its dimensions carefully is of great importance */
    profile: {
      dimensions:
        {} /* To be calculated in the class with the function provided */,
      calcDim: function (spec, n) {
        return {
          width:
            spec.items.ticks.line.width +
            spec.items.ticks.label.offsetX +
            78 +
            spec.profile.padding.x * 2,
          height:
            spec.items.rect.base.totalHeight +
            spec.items.rect.body.maxHeight +
            spec.items.label.shape.height / 2 +
            spec.items.label.shape.offsetY +
            spec.items.label.title.offsetY +
            15 +
            spec.profile.padding.y * 2,
        };
      },
      padding: {
        x: 103,
        y: 0,
      },
    },
    /* "items" is the general term used for independent data elements to be drawn in the profile */
    items: {
      minValue: 16 /* Minimum value of items mark provided by the dataset */,
      maxValue: 96 /* Maximum value of items mark provided by the dataset */,
      offsetX1: 35.5 /* Horizontal offset between first item and left side of the profile */,
      offsetX2: 80 /* Horizontal offset between two consecutive items in the profile */,
      get distanceX() {
        return this.offsetX2 + this.rect.width;
      } /* Horizontal distance between two consecutive items in the profile */,
      thresholdsNumber: {
        offsetX: 8,
        offsetY: 18,
      },
      thresholds: {
        diffusion: 52,
        foreclosure: 52,
        moratorium: 62,
        achievement: 72,
      } /* Thresholds for the items marks */,
      ticks: {
        line: {
          width: 600,
        },
        label: {
          offsetX: 18,
        },
      },
      rect: {
        width: 60 /* Width of the items rectangle */,
        base: {
          height: 50 /* Start height of the items base rectangle (corresponding minimum value) */,
          maxHeight: 150 /* Height of the base rectangle between minimum value and threshold */,
          get totalHeight() {
            return this.height + this.maxHeight;
          } /* Total height of the base rectangle */,
          borderRadius: 6 /* Border radius of the base rectangle */,
        },
        body: {
          maxHeight: 260 /* Height of the body rectangle between threshold and maximum value */,
          borderRadius: 8 /* Border radius of the body rectangle */,
          colors: {
            diffusion: "#F87171",
            foreclosure: "#FCD34D",
            moratorium: "#93C5FD",
            achievement: "#6EE7B7",
          } /* Colors used for theming items body parts */,
        },
      },
      label: {
        title: {
          offsetY: 40,
        },
        shape: {
          width: 50,
          height: 40.88,
          offsetY: 30,
        },
        colors: {
          diffusion: "#EF4444",
          foreclosure: "#FBBF24",
          moratorium: "#3B82F6",
          achievement: "#10B981",
        } /* Colors used for theming labels */,
      },
    },
    /* "labels" part which has to be provided for each profile */
    labels: {
      diffusion: { fr: "آشفته" },
      foreclosure: { fr: "زود شکل گرفته" },
      moratorium: { fr: "تعویق افتاده" },
      achievement: { fr: "پیشرفته" },
    },
  },
};

export default class BAOMEIS93 extends Profile {
  constructor(dataset, config = {}) {
    super(dataset, config, defaultSpec);
  }

  _calcContext() {
    const {
      spec: {
        parameters: { BAOMEIS93: spec },
      },
      dataset,
    } = this;

    const { items: itemsSpec } = spec;

    // Init Spec
    spec.profile.dimensions = spec.profile.calcDim(spec, dataset.score.length);

    const items = dataset.score.map((data) => ({
      label: data.label,
      mark: data.mark,
      height:
        data.mark > itemsSpec.thresholds[data.label.eng]
          ? ((data.mark - itemsSpec.thresholds[data.label.eng]) /
              (itemsSpec.maxValue - itemsSpec.thresholds[data.label.eng])) *
              itemsSpec.rect.body.maxHeight +
            itemsSpec.rect.base.maxHeight +
            itemsSpec.rect.base.height
          : ((data.mark - itemsSpec.minValue) /
              (itemsSpec.thresholds[data.label.eng] - itemsSpec.minValue)) *
              itemsSpec.rect.base.maxHeight +
            itemsSpec.rect.base.height,
      exceedThreshold: data.mark > itemsSpec.thresholds[data.label.eng],
      fill: {
        body: itemsSpec.rect.body.colors[data.label.eng],
        label: itemsSpec.label.colors[data.label.eng],
      },
    }));

    return { items };
  }
}