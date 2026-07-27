const AMS93 = require("./AMS93");

// This profile is completely identical to AMS93

class AMS9A extends AMS93 {
  static partials = {
    AMS93: "samples/AMS93.hbs",
  };
}

module.exports = AMS9A;
