import { Profile, Color, SVG, FS } from "../profile";

export class Radar extends Profile {

  _calcContext() {
    const { defaults, dataset, canvas } = this;

    const {
      maxValue,
      textOffset,
      centerOffset,
      ticks,
    } = defaults.parameters.Radar;

    // Radius of Main Polygon
    const radius =
      Math.min(canvas.height, canvas.width) / 2 - canvas.padding - centerOffset;

    const dataValues = dataset.dataPoints.map(
      (item) => (item.data / maxValue) * radius + centerOffset
    );
    const n = dataValues.length;

    // Calculate Polygon Points Angles
    const angles = FS.createArithmeticSequence(0, (2 * Math.PI) / n, n);

    // Calculate Ticks Arrary and Angle to Place On
    const ticksNumbers = FS.createArithmeticSequence(
      0,
      maxValue / (ticks - 1),
      ticks
    );
    const ticksAngles = Array(ticks).fill((angles[0] + angles[1]) / 2);
    const ticksRadiuses = FS.createArithmeticSequence(
      centerOffset,
      radius / (ticks - 1),
      ticks
    ).map((item) => item * Math.cos(ticksAngles[0]));

    // Consecutive Distance
    const dist = FS.roundTo2(radius / maxValue);

    // Calculate Radiuses Array for Main Points
    let radiuses = Array(n).fill(radius + centerOffset);

    // Calculate Polygons Points
    let i;
    const points = [];
    for (i = 0; i <= maxValue; i++) {
      points.push(this._calcPolygonPoints(radiuses, angles));
      radiuses = radiuses.map((radius) => radius - dist);
    }

    // Calculate Data Points
    const dataPoints = this._calcPolygonPoints(dataValues, angles);

    // Get "d" Attribute of Path for Polygons and Data Points
    let pointsAttr = points.map((item) => SVG.pathDGenerator(item));
    let dataAttr = SVG.pathDGenerator(dataPoints);

    // Calculate Text Points
    radiuses = Array(n).fill(radius + textOffset + centerOffset);
    const textPoints = this._calcPolygonPoints(radiuses, angles);

    //Calculate Ticks Points
    const ticksPoints = this._calcPolygonPoints(ticksRadiuses, ticksAngles);

    // Get n Random Colors (One of Return Values of Method)
    const colors = Color.getRandomColorArr(n);

    return {
      colors,
      pointsAttr,
      dataAttr,
      dataPoints,
      textPoints,
      ticksPoints,
      ticksNumbers,
    };
  }

  _calcPolygonPoints(radiuses, angles) {
    const center = this.canvas.center;
    let points = angles.map((angle, index) =>
      this._polarToCartesian(radiuses[index], angle)
    );

    return this._transformAxes(points, center, Math.PI);
  }

  _polarToCartesian(radius, angle) {
    return {
      x: FS.roundTo2(radius * Math.sin(angle)),
      y: FS.roundTo2(radius * Math.cos(angle)),
    };
  }

  _transformAxes(points, d, theta) {
    let transformedPoints = points.map((point) =>
      FS.transformAxes(point, d, theta)
    );
    return transformedPoints;
  }

}

module.exports = Radar;
