const isArray = require("./helpers/isArray");
const addCommas = require("./helpers/addCommas");
const boolean = require("./helpers/boolean");
const math = require("./helpers/math");
const modulo = require("./helpers/modulo");
const ternary = require("./helpers/ternary");
const lineWrap = require("./helpers/lineWrap");
const wrapOnNewline = require("./helpers/wrapOnNewline");
const ellipsisLines = require("./helpers/ellipsisLines");
const ellipsisChars = require("./helpers/ellipsisChars");
const replace = require("./helpers/replace");
const setVar = require("./helpers/setVar");
const assignGlobal = require("./helpers/assignGlobal");
const forLoop = require("./helpers/forLoop");
const concat = require("./helpers/concat");
const sin = require("./helpers/sin");
const cos = require("./helpers/cos");
const tan = require("./helpers/tan");
const toDeg = require("./helpers/toDeg");
const toRad = require("./helpers/toRad");
const roundToTwo = require("./helpers/roundToTwo");
const objectEntries = require("./helpers/objectEntries");
const object = require("./helpers/object");
const array = require("./helpers/array");
const reverse = require("./helpers/reverse");
const prepend = require("./helpers/prepend");
const polarToCartesian = require("./helpers/polarToCartesian");
const abs = require("./helpers/abs");
const getArrOfProp = require("./helpers/getArrOfProp");
const displacePoint = require("./helpers/displacePoint");
const normalizeAngle = require("./helpers/normalizeAngle");
const withGroup = require("./helpers/withGroup");
const join = require("./helpers/join");
const split = require("./helpers/split");
const first = require("./helpers/first");
const last = require("./helpers/last");
const ceil = require("./helpers/ceil");
const floor = require("./helpers/floor");

const polygon = require("./helpers/profiles/polygon");
const gauge = require("./helpers/profiles/gauge");
const bar = require("./helpers/profiles/bar");

const helpers = {
  isArray,
  addCommas,
  boolean,
  math,
  modulo,
  ternary,
  lineWrap,
  wrapOnNewline,
  ellipsisLines,
  ellipsisChars,
  replace,
  setVar,
  assignGlobal,
  forLoop,
  concat,
  sin,
  cos,
  tan,
  toDeg,
  toRad,
  roundToTwo,
  objectEntries,
  object,
  array,
  reverse,
  prepend,
  polarToCartesian,
  abs,
  getArrOfProp,
  displacePoint,
  normalizeAngle,
  withGroup,
  join,
  split,
  first,
  last,
  ceil,
  floor,
  polygon,
  gauge,
  bar,
};

module.exports = helpers;
