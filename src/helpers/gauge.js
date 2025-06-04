const { FS } = require("../Profile");

function gauge(data) {
  data.mark = data.mark ?? 0;
  const circleData = {
    angles: {
      start: FS.toRadians(-90),
      end: FS.toRadians(180),
    },
    direction: false,
    get totalAngle() {
      return this.direction ? 2 * Math.PI - (this.angles.end - this.angles.start) : this.angles.end - this.angles.start;
    },
  };
  return {
    details: data,
    circle: circleData,
    zeta: (data.mark / data.label.max) * circleData.totalAngle + circleData.angles.start,
  };
}

module.exports = gauge;