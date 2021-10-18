// gauge Helper
// This helper is used to provide the path tag for the gauge chart

const Handlebars = require("handlebars");

function gauge(R, r, rb, angle, options) {
  
  const attributes = [];

  Object.keys(options.hash).forEach((key) => {
    const escapedKey = Handlebars.escapeExpression(key);
    const escapedValue = Handlebars.escapeExpression(options.hash[key]);
    attributes.push(escapedKey + '="' + escapedValue + '"');
  });

  const alpha = +(Math.asin(rb / (R - rb))).toFixed(2);
  const theta = angle - alpha;

  const points = {
    P1: {
      x: +(R * Math.sin(theta)).toFixed(2),
      y: +(-R * Math.cos(theta)).toFixed(2),
    },
    P2: {
      x: +((R - rb) * Math.cos(alpha) * Math.sin(angle)).toFixed(2),
      y: +(-(R - rb) * Math.cos(alpha) * Math.cos(angle)).toFixed(2),
    },
    P3: {
      x: +((r + rb) * Math.cos(alpha) * Math.sin(angle)).toFixed(2),
      y: +(-(r + rb) * Math.cos(alpha) * Math.cos(angle)).toFixed(2),
    },
    P4: {
      x: +(r * Math.sin(theta)).toFixed(2),
      y: +(-r * Math.cos(theta)).toFixed(2),
    },
  };

  const result = `<path d="M 0 -${R} A ${R} ${R} ${theta} ${angle > Math.PI ? 1 : 0} 1 ${points.P1.x} ${
    points.P1.y
  } A ${rb} ${rb} 10 0 1 ${points.P2.x} ${points.P2.y} L ${points.P3.x} ${
    points.P3.y
  } A ${rb} ${rb} 10 0 1 ${points.P4.x} ${
    points.P4.y
  } A ${r} ${r} ${theta} ${angle > Math.PI ? 1 : 0} 0 0 -${r} Z" ${attributes.join(" ")}/>`;

  return new Handlebars.SafeString(result);
}

module.exports = gauge;
