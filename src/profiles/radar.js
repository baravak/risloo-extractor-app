import { Chart, Color, SVG, Dataset, FS } from "../chart";

export class radar extends Chart {
  constructor(dataset, config = {}) {
    super(config);
    const me = this;
    this.defaults = me.defaults.parameters.polygonChart;
    this.dataset = new Dataset(me.defaults.global.maxValue, dataset);
    this.innerPolygonNum = me.defaults.global.innerPolygonNum;
    this.textOffset = me.defaults.global.textOffset;
    this.centerOffset = me.defaults.global.centerOffset;
    this.center = me.canvas.center;
    this.radius = me.canvas.height / 2 - me.canvas.padding;
    this.dataValues = me.dataset.dataPoints.map(
      (item) => (item.data / me.dataset.max_value) * me.radius
    );
    this.n = me.dataValues.length;
    this.consecutiveDistance = Math.round(
      (me.radius - me.centerOffset) / me.innerPolygonNum
    );
    this.colors = Color.getRandomColorArr(me.n);
    this.angles = FS.createArithmeticSequence(0, (2 * Math.PI) / me.n, me.n);
    this.mainPoints = me._calcMainPolygonPoints();
    this.innerPoints = me._calcInnerPolygonPoints();
    this.dataPoints = me._calcDataPoints();
    this.textPoints = me._calcTextPoints();
  }

  _calcMainPolygonPoints() {
    const { radius, angles, n } = this;
    let radiuses = Array(n).fill(radius);

    return this._calcPolygonPoints(radiuses, angles);
  }

  _calcInnerPolygonPoints() {
    const {
      radius,
      angles,
      n,
      consecutiveDistance: dist,
      innerPolygonNum: num,
    } = this;
    let radiuses = Array(n).fill(radius);

    let i;
    let arr = [];
    for (i = 0; i <= num; i++) {
      radiuses = radiuses.map((radius) => radius - dist);
      arr.push(this._calcPolygonPoints(radiuses, angles));
    }

    return arr;
  }

  _calcDataPoints() {
    const { dataValues, angles } = this;

    return this._calcPolygonPoints(dataValues, angles);
  }

  _calcTextPoints() {
    const { radius, angles, textOffset, n } = this;
    const radiuses = Array(n).fill(radius + textOffset);

    return this._calcPolygonPoints(radiuses, angles);
  }

  _calcPolygonPoints(radiuses, angles) {
    let points = angles.map((angle, index) =>
      this._polarToCartesian(radiuses[index], angle)
    );

    points = this._transformAxes(points, this.center, Math.PI);

    return points;
  }

  _polarToCartesian(radius, angle) {
    return {
      x: Math.round(radius * Math.sin(angle)),
      y: Math.round(radius * Math.cos(angle)),
    };
  }

  _transformAxes(points, d, theta) {
    let transformedPoints = points.map((point) =>
      FS.transformAxes(point, d, theta)
    );
    return transformedPoints;
  }

  register() {
    const { canvas, innerPoints: points, mainPoints, dataPoints, textPoints, colors, dataset } = this;
    points.push(mainPoints);

    let pointsAttr = points.map((item) => SVG.pathDGenerator(item));
    let dataAttr = SVG.pathDGenerator(dataPoints);

    return {
      canvas,
      dataset: dataset.dataPoints,
      colors,
      pointsAttr,
      dataAttr,
      dataPoints,
      textPoints,
    };
  }
}
