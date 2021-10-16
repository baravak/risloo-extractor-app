// boolean Helper
// Evaluates Comparison and Logical Operations

function boolean(v1, operator, v2, options) {
  return {
    "==": v1 == v2,
    "===": v1 === v2,
    "!=": v1 != v2,
    "!==": v1 !== v2,
    "<": v1 < v2,
    "<=": v1 <= v2,
    ">": v1 > v2,
    ">=": v1 >= v2,
    "&&": v1 && v2,
    "||": v1 || v2,
  }[operator]
}

module.exports = boolean;
