const { Profile, FS } = require("../profile");
const PIES93 = require("./PIES93");

const customConfig = {
  test: {
    name: "پرسشنامه سياهه رواني - اجتماعي نيرومندي من (ايگو) فرم 64 سؤالي" /* Name of the test */,
  },
  raw: {
    maxValue: 320,
  },
  items: {
    maxValue: 40,
    body: {
      opacityMapping: {
        40: 1,
        "30-39": 0.9,
        "20-29": 0.8,
        "10-19": 0.7,
        "8-9": 0.6,
      } /* Opacity mapping for marks */,
    }
  },
};

// This profile is completely identical to MMFAD9A

class PIES9A extends Profile {
  constructor(dataset, options, config = customConfig) {
    super();
    Object.assign(this, new PIES93(dataset, options, config));
  }
}

module.exports = PIES9A;
