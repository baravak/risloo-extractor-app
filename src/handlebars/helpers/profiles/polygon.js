// bar Helper
// This helper is used to provide the path tag for the radar chart

const Handlebars = require("handlebars");
const polarToCartesian = require("../polarToCartesian");

const P2C = polarToCartesian;
const PI = Math.PI;

/**
 * Create path tag for the polygon of the radar chart
 * @param  {number} n - number of the vertices of the polygon
 * @param  {array} radiuses - array of radius of the corresponding vertice of the polygon
 * @param  {number} angle - angle of one vertice in radians
 * @param  {object} options
 */
function polygon(n, radiuses, angle, options) {
  if (!Array.isArray(radiuses)) radiuses = Array(n).fill(radiuses);

  const attributes = [];

  Object.keys(options.hash).forEach((key) => {
    const escapedKey = Handlebars.escapeExpression(key);
    const escapedValue = Handlebars.escapeExpression(options.hash[key]);
    attributes.push(escapedKey + '="' + escapedValue + '"');
  });

  // theta is the angle of the polygon
  const theta = (2 * PI) / n;

  const points = radiuses.map((radius, index) => P2C(radius, angle - index * theta));

  let pointsAttr = points.reduce((accm, point) => accm + `${point.x},${point.y} `, "");

  let result = `<polygon points="${pointsAttr}" ${attributes.join(" ")}/>`;

  return new Handlebars.SafeString(result);
}

module.exports = polygon;
