// gauge Helper
// This helper is used to provide the path tag for the gauge chart

const Handlebars = require("handlebars");
const calcGaugeEndpoints = require("./calcGaugeEndpoints");
const normalizeAngle = require("./normalizeAngle");

function gauge(R, r, brs, angles, directionFlag, options) {
  // R: outer radius
  // r: inner radius
  // brs: border radiuses : {start, end}
  // angles: {start, end}
  // directionFlag: direction of gauge (false: clockwise, true: counterclockwise)

  const attributes = [];

  Object.keys(options.hash).forEach((key) => {
    const escapedKey = Handlebars.escapeExpression(key);
    const escapedValue = Handlebars.escapeExpression(options.hash[key]);
    attributes.push(escapedKey + '="' + escapedValue + '"');
  });

  // Normalize the angles to be in the range (-PI, PI]
  for (let key in angles) angles[key] = normalizeAngle(angles[key]);

  let isGreater = true;
  if (angles.end < angles.start) isGreater = false;

  const totalAngle = directionFlag ^ isGreater
    ? Math.abs(angles.end - angles.start)
    : 2 * Math.PI - Math.abs(angles.end - angles.start);

  const startEndpoints = calcGaugeEndpoints(
    R,
    r,
    brs.start,
    angles.start,
    true,
    directionFlag
  );
  const endEndpoints = calcGaugeEndpoints(
    R,
    r,
    brs.end,
    angles.end,
    false,
    directionFlag
  );

  // Calculate "d" Attribute of Path
  let dAttr = `M ${startEndpoints.P1.x} ${startEndpoints.P1.y}`;
  dAttr += `A ${R} ${R} 1 ${totalAngle > Math.PI ? 1 : 0} ${
    directionFlag ? 0 : 1
  } ${endEndpoints.P1.x} ${endEndpoints.P1.y}`;
  
  if (brs.end) {
    dAttr += `A ${brs.end} ${brs.end} 1 0 ${directionFlag ? 0 : 1} ${
      endEndpoints.P2.x
    } ${endEndpoints.P2.y}`;
    dAttr += `L ${endEndpoints.P3.x} ${endEndpoints.P3.y} `;
    dAttr += `A ${brs.end} ${brs.end} 1 0 ${directionFlag ? 0 : 1} ${
      endEndpoints.P4.x
    } ${endEndpoints.P4.y}`;
  } else {
    dAttr += `L ${endEndpoints.P2.x} ${endEndpoints.P2.y}`;
  }
  
  if (brs.start) {
    dAttr += `A ${r} ${r} 1 ${totalAngle > Math.PI ? 1 : 0} ${
      directionFlag ? 1 : 0
    } ${startEndpoints.P4.x} ${startEndpoints.P4.y}`;

    dAttr += `A ${brs.start} ${brs.start} 1 0 ${directionFlag ? 0 : 1} ${
      startEndpoints.P3.x
    } ${startEndpoints.P3.y}`;
    dAttr += `L ${startEndpoints.P2.x} ${startEndpoints.P2.y}`;
    dAttr += `A ${brs.start} ${brs.start} 1 0 ${directionFlag ? 0 : 1} ${
      startEndpoints.P1.x
    } ${startEndpoints.P1.y}`;
  } else {
    dAttr += `A ${r} ${r} 1 ${totalAngle > Math.PI ? 1 : 0} ${
      directionFlag ? 1 : 0
    } ${startEndpoints.P2.x} ${startEndpoints.P2.y}`;
    dAttr += `L ${startEndpoints.P1.x} ${startEndpoints.P1.y}`;
  }

  let result = `<path d="${dAttr}" ${attributes.join(" ")}/>`;

  return new Handlebars.SafeString(result);
}

module.exports = gauge;
