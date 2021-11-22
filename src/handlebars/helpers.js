const boolean = require("./helpers/boolean");
const math = require("./helpers/math");
const ternary = require("./helpers/ternary");
const lineWrap = require("./helpers/lineWrap");
const wrapOnNewline = require("./helpers/wrapOnNewline");
const ellipsisLines = require("./helpers/ellipsisLines");
const ellipsisChars = require("./helpers/ellipsisChars");
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
const polarToCartesian = require("./helpers/polarToCartesian");
const abs = require("./helpers/abs");
const getArrOfProp = require("./helpers/getArrOfProp");
const displacePoint = require("./helpers/displacePoint");
const normalizeAngle = require("./helpers/normalizeAngle");

const polygon = require("./helpers/profiles/polygon");
const gauge = require("./helpers/profiles/gauge");
const bar = require("./helpers/profiles/bar");

const helpers = {
  boolean,
  math,
  ternary,
  lineWrap,
  wrapOnNewline,
  ellipsisLines,
  ellipsisChars,
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
  polarToCartesian,
  abs,
  getArrOfProp,
  displacePoint,
  normalizeAngle,
  polygon,
  gauge,
  bar,
};

module.exports = helpers;
