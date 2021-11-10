import { Profile, FS } from "../profile";

const defaultSpec = {
  AMS93: {
    /* "profile" determines the dimensions of the drawn profile (to be used in svg tag viewbox) */
    /* calculating its dimensions carefully is of great importance */
    profile: {
      dimensions:
        {} /* To be calculated in the class with the function provided */,
      calcDim: function (spec, n) {
        return {
          width: 642 + spec.profile.padding.x * 2,
          height: 530 + spec.profile.padding.y * 2,
        };
      },
      padding: {
        x: 0,
        y: 0,
      },
    },
    /* "items" is the general term used for independent data elements to be drawn in the profile */
    items: {
      minValue: 4 /* Minimum value of items mark provided by the dataset */,
      maxValue: 28 /* Maximum value of items mark provided by the dataset */,
      offsetX: 200 /* Horizontal offset between items and category label rectangle */,
      offsetY1: 10 /* Vertical offset between two consecutive item in the profile */,
      offsetY2: 64 /* Vertical offset between two categories of items */,
      get distanceY() {
        return this.offsetY1 + this.rect.height;
      } /* Distance between two consecutive item in the profile */,
      totalHeights:
        [] /* To be calculated in the class with the function provided */,
      calcTotalHeight: function (n) {
        return this.distanceY * (n - 1) + this.rect.height;
      } /* Method for calculating the total height of items */,
      ticks: {
        num: 4 /* Number of ticks */,
        heightOffset: 45 /* Half length that the ticks lines of items is greater than items total heigth */,
        numberOffset: {
          x: 10 /* Horizontal distance from the line */,
          y: 10 /* Vertical distance from the line */,
        },
      },
      rect: {
        height: 40 /* Height of the items rectangle */,
        get borderRadius() {
          return this.height / 2;
        } /* Border Radius of the items rectangle */,
        colors: [
          "#8B5CF6",
          "#EC4899",
          "#71717A",
        ] /* Colors used for theming items body parts */,
        opacityMapping: {
          28: 1,
          "21-27": 0.9,
          "13-20": 0.8,
          "5-12": 0.7,
          4: 0.6,
        } /* Opacity mapping for marks */,
      },
      widthCoeff: 15 /* Used for converting mark to the width */,
      label: {
        offsetX: 10 /* Horizontal offset of label from item */,
        rect: {
          width: 42 /* Width of the category label rectangle of the items */,
          borderRadius: 5 /* Border radius of the category label rectangle of the items */,
        },
        colors: [
          "#A27DF8",
          "#F06DAD",
          "#898E99"
        ] /* Colors used for theming items label rectangle */,
      },
    },
    /* "labels" part which has to be provided for each profile */
    labels: {
      intrinsic_motivation_to_know: { fr: "برای فهمیدن" },
      intrinsic_motivation_toward_accomplishment: { fr: "پیشرفت" },
      intrinsic_motivation_to_experience_stimulation: {
        fr: "برای تجربه تحریک",
      },
      extrinsic_motivation_identified: { fr: "تنظیم همانند شده" },
      extrinsic_motivation_introjected: { fr: "تنظیم تزریقی" },
      extrinsic_motivation_external_regulation: { fr: "تنظیم بیرونی" },
      unmotivation: { fr: "بی‌انگیزگی" },
    },
  },
};

export default class AMS93 extends Profile {
  constructor(dataset, config = {}) {
    super(dataset, config, defaultSpec);
  }

  _calcContext() {
    const {
      spec: {
        parameters: { AMS93: spec },
      },
      dataset,
    } = this;

    const { raw: rawSpec, items: itemsSpec } = spec;

    // Categorize Items Dataset
    const itemsDatasets = [dataset.score.slice(0, 5), dataset.score.slice(5)];

    // ّInit Spec
    spec.items.totalHeights = itemsDatasets.map((dataset) =>
      spec.items.calcTotalHeight(dataset.length)
    );
    spec.profile.dimensions = spec.profile.calcDim(spec, dataset.score.length);
  }
}
