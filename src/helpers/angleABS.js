function angleABS(_angle) {
    let angle = _angle;
    if (typeof _angle === "string") {
      angle = parseInt(_angle);
    } else if (typeof _angle !== "number") {
      angle = 0;
    }
    const quotient = angle % 360;
    if (angle >= 0 || quotient === 0) {
      return Math.abs(quotient);
    }
    return Math.abs(360 + quotient);
  }

module.exports = angleABS;