const angleABS = require("./angleABS");

function polarXY(cx, cy, radius, angle, radian = false) {
    const angleInRadian = radian ? angle : angleABS(angle) * (Math.PI / 180);
    const x = cx + (radius * Math.cos(angleInRadian));
    const y = cy + (radius * Math.sin(angleInRadian));
    return [x, y];
}
module.exports = polarXY;