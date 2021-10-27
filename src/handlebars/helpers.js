const boolean = require('./helpers/boolean');
const math = require('./helpers/math');
const ternary = require('./helpers/ternary');
const lineWrap = require('./helpers/lineWrap');
const wrapOnNewline = require('./helpers/wrapOnNewline');
const ellipsisLines = require('./helpers/ellipsisLines');
const ellipsisChars = require('./helpers/ellipsisChars');
const setVar = require('./helpers/setVar');
const forLoop = require('./helpers/forLoop');
const concat = require('./helpers/concat');
const sin = require('./helpers/sin');
const cos = require('./helpers/cos');
const tan = require('./helpers/tan');
const toDeg = require('./helpers/toDeg');
const toRad = require('./helpers/toRad');
const roundToTwo = require('./helpers/roundToTwo');
const object = require('./helpers/object');
const array = require('./helpers/array');
const polarToCartesian = require('./helpers/polarToCartesian');
const abs = require('./helpers/abs');

const gauge = require('./helpers/profiles/gauge')

const helpers = {
  boolean,
  math,
  ternary,
  lineWrap,
  wrapOnNewline,
  ellipsisLines,
  ellipsisChars,
  setVar,
  forLoop,
  concat,
  sin,
  cos,
  tan,
  toDeg,
  toRad,
  roundToTwo,
  object,
  array,
  polarToCartesian,
  abs,
  gauge
};

module.exports = helpers;