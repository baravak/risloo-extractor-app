// bar Helper
// This helper is used to provide the path tag for the bar chart

const Handlebars = require("handlebars");
const polarToCartesian = require("../polarToCartesian");

const P2C = polarToCartesian;
const PI = Math.PI;

function bar(W, H, brs, angle, options) {
  // W: width
  // H: height
  // brs: border radiuses : {tl: top-left, tr: top-right, bl: bottom-left, br: bottom-right}

  const attributes = [];

  Object.keys(options.hash).forEach((key) => {
    const escapedKey = Handlebars.escapeExpression(key);
    const escapedValue = Handlebars.escapeExpression(options.hash[key]);
    attributes.push(escapedKey + '="' + escapedValue + '"');
  });

  // Calculate "d" Attribute of Path
  let dAttr = `M ${P2C(W / 2, angle).toString}`;

  dAttr += `L ${P2C(brs.tl, angle).toString}`;
  dAttr += brs.tl ? `A ${brs.tl} ${brs.tl} 90 0 0 ${P2C(brs.tl, PI / 2 + angle).toString}` : "";

  dAttr += `L ${P2C(H - brs.bl, PI / 2 + angle).toString}`;
  dAttr += brs.bl ? `a ${brs.bl} ${brs.bl} 90 0 0 ${P2C(1.414 * brs.bl, PI / 4 + angle).toString}` : "";

  dAttr += `l ${P2C(W - brs.bl - brs.br, angle).toString}`;
  dAttr += brs.br ? `a ${brs.br} ${brs.br} 90 0 0 ${P2C(1.414 * brs.br, -PI / 4 + angle).toString}` : "";

  dAttr += `l ${P2C(-(H - brs.br - brs.tr), PI / 2 + angle).toString}`;
  dAttr += brs.tr ? `A ${brs.tr} ${brs.tr} 90 0 0 ${P2C(W - brs.tr, angle).toString}` : "";

  dAttr += `L ${P2C(W / 2, angle).toString}`;

  let result = `<path d="${dAttr}" ${attributes.join(" ")}/>`;

  return new Handlebars.SafeString(result);
}

module.exports = bar;
