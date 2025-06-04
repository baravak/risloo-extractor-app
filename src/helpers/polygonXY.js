const angleABS = require("./angleABS");
const polarXY = require("./polarXY");

function polygonXY(cx, cy, points, angle = 0) {
    const xyPoints = [];
    const angleSeperation = 360 / points.length;
    for (let i = 0; i < points.length; i++) {
        const currentAngle = (Math.PI / 180) * angleABS(angle + angleSeperation * i);
        const point = points[i];
        xyPoints.push(polarXY(cx, cy, point, currentAngle, true));
    }
    return xyPoints;
}

module.exports = polygonXY;