const { Mappings } = require("../Profile");
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
      opacityMappings: new Mappings()
        .addMapping("8-9", 0.6)
        .addMapping("10-19", 0.7)
        .addMapping("20-29", 0.8)
        .addMapping("30-39", 0.9)
        .addMapping("40", 1) /* Opacity mapping for marks */,
    },
  },
};

// This profile is completely identical to MMFAD9A

class PIES9A extends PIES93 {
  constructor(dataset, options, config = customConfig) {
    super(dataset, options, config);
  }
}

module.exports = PIES9A;
