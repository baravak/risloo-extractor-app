const { Profile, FS } = require("../profile");
const AMS93 = require("./AMS93");

// This profile is completely identical to AMS93

class AMS9A extends Profile {
  constructor(dataset, profileVariant, config = {}) {
    super();
    Object.assign(this, new AMS93(dataset, profileVariant, config));
  }
}

module.exports = AMS9A;
