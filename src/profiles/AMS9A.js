const { Profile, FS } = require("../profile");
const AMS93 = require("./AMS93");

// This profile is completely identical to AMS93

class AMS9A extends Profile {
  constructor(dataset, options, config = {}) {
    super();
    Object.assign(this, new AMS93(dataset, options, config));
  }
}

module.exports = AMS9A;
