const angleABS = require("./angleABS");

function polygonDefaultStart(points, defaultAngle) {
    if(defaultAngle) return angleABS(defaultAngle)
    let angle = 0;
    switch (points) {
        case 3:
          angle = -90;
          break;
        case 4:
          angle = -45;
          break;
        case 5:
          angle = -90;
          break;
        case 6:
          angle = -60;
          break;
        case 7:
      angle = -90;
      break;
  }
  return angleABS(angle);
}
module.exports = polygonDefaultStart;