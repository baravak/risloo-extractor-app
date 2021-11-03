import { Profile, FS } from "../profile";

const defaultSpec = {
  STAIY93: {
    /* "profile" determines the dimensions of the drawn profile (to be used in svg tag viewbox) */
    /* calculating its dimensions carefully is of great importance */
    profile: {
      dimensions:
        {} /* To be calculated in the class with the function provided */,
      calcDim: function (spec, n) {
        return {
          width:
            spec.items.rect.width * 2 +
            spec.items.rect.offsetX +
            spec.profile.padding.x * 2,
          height:
            spec.items.rect.distanceY +
            spec.items.trait.circle.R * 2 +
            spec.profile.padding.y * 2,
        };
      },
      padding: {
        x: 70,
        y: 70,
      },
    },
    items: {
      rect: {
        width: 180 /* Width of label rectangle */,
        height: 42 /* Height of label rectangle */,
        br: 10 /* Border radius of label rectangle */,
        offsetX: 190 /* Horizontal offset between label rectangles */,
        offsetY: 84 /* Vetical offset between label rectangles and items */,
        get distanceY() {
          return this.height + this.offsetY;
        },
      },
      offsetX: 2 /* Horizontal offset between two items element */,
      minValue: 20 /* Minimum value of items data element */,
      maxValue: 80 /* Maximum value of items data element */,
      get range() {
        return this.maxValue - this.minValue;
      },
      trait: {
        stops: [20, 34, 45, 56, 80],
        fill: "#581C87",
        circle: {
          R: 175 /* Radius of the outer circle of the items element */,
          r: 130 /* Radius of the inner circle of the items element */,
          brs: {
            start: 0,
            end: 0,
          } /* Border radiuses at each end of the gauge of the items element */,
          angles: {
            start: FS.toRadians(-90),
            end: FS.toRadians(90),
          } /* Angles of each end of the items element */,
          direction: false /* Clockwise direction for the items gauge element */,
        },
      },
      state: {
        stops: [20, 30, 42, 53, 80],
        fill: "#BE185D",
        circle: {
          R: 175 /* Radius of the outer circle of the items element */,
          r: 130 /* Radius of the inner circle of the items element */,
          brs: {
            start: 0,
            end: 0,
          } /* Border radiuses at each end of the gauge of the items element */,
          angles: {
            start: FS.toRadians(-90),
            end: FS.toRadians(90),
          } /* Angles of each end of the items element */,
          direction: true /* Clockwise direction for the items gauge element */,
        },
      },
      interprets: [
        { opacity: 0.4, eng: "none", fr: "هیچ یا کمترین حد" },
        { opacity: 0.6, eng: "mild", fr: "خفیف" },
        { opacity: 0.8, eng: "moderate", fr: "متوسط" },
        { opacity: 1, eng: "severe", fr: "شدید" },
      ],
    },
    /* "labels" part which has to be provided for each profile */
    labels: {
      trait: {
        fr: "رگه اضطراب",
      },
      state: {
        fr: "حالت اضطراب",
      },
    },
  },
};

export default class STAIY93 extends Profile {
  constructor(dataset, config = {}) {
    super(dataset, config, defaultSpec);
  }

  _calcContext() {
    const {
      spec: {
        parameters: { STAIY93: spec },
      },
      dataset,
    } = this;

    // Deconstructing the Spec of the Profile
    const { items: itemsSpec } = spec;

    // ّInit Spec
    spec.profile.dimensions = spec.profile.calcDim(spec, dataset.score.length);

    const items = dataset.score.map((data) => ({
      label: data.label,
      mark: data.mark,
      angle: this._markToAngle(
        data.mark.value,
        itemsSpec.minValue,
        itemsSpec.maxValue,
        itemsSpec[data.label.eng].circle.angles,
        itemsSpec[data.label.eng].circle.direction
      ),
      totalAngle: this._calcDiffAngle(
        itemsSpec[data.label.eng].circle.angles.end,
        itemsSpec[data.label.eng].circle.angles.start,
        itemsSpec[data.label.eng].circle.direction
      ),
      stops: itemsSpec[data.label.eng].stops.map((stop) => ({
        mark: stop,
        angle: this._markToAngle(
          stop,
          itemsSpec.minValue,
          itemsSpec.maxValue,
          itemsSpec[data.label.eng].circle.angles,
          itemsSpec[data.label.eng].circle.direction
        ),
      })),
    }));

    return { items };
  }

  _markToAngle(mark, min, max, angles, direction) {
    const totalAngle = this._calcDiffAngle(angles.end, angles.start, direction);
    const deltaTheta = ((mark - min) / (max - min)) * totalAngle;
    return this._calcDistAngle(deltaTheta, angles.start, direction);
  }

  _calcDiffAngle(theta, theta0, direction) {
    return direction ? 2 * Math.PI - (theta - theta0) : theta - theta0;
  }

  _calcDistAngle(deltaTheta, theta0, direction) {
    return direction ? 2 * Math.PI - deltaTheta + theta0 : deltaTheta + theta0;
  }
}