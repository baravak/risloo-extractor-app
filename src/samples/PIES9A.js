const { Mappings } = require("../Profile");
const PIES93 = require("./PIES93");

const customConfig = {
  sample: {
    name: "پرسشنامه سياهه رواني - اجتماعي نيرومندي من (ايگو) فرم 64 سؤالي" /* Name of the sample */,
  },
  raw: {
    maxValue: 320,
  },
  items: {
    maxValue: 40,
    body: {
      opacityMappings: new Mappings()
        .addMapping("8-9", 0.6)
        .addMapping("10-19", 0.7)
        .addMapping("20-29", 0.8)
        .addMapping("30-39", 0.9)
        .addMapping("40", 1),
    },
  },
};

// This profile is partially identical to PIES93

class PIES9A extends PIES93 {
  constructor(dataset, options, config = customConfig) {
    super(dataset, options, config);
  }
}

module.exports = PIES9A;
