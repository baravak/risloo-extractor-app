const { Profile, FS } = require("../profile");
const MMAFD93 = require("./MMFAD93");

const customConfig = {
  test: {
    name: "پرسشنامه عملکرد خانواده ۶۰ سؤالی" /* Name of the test */,
  },
  raw: {
    maxValue: 240,
  },
  items: {
    maxValues: {
      problem_solving: 24,
      roles: 36,
      affective_responsiveness: 28,
      communication: 28,
      affective_involvement: 36,
      behaviour_control: 36,
      overall_performance: 52,
    } /* Maximum value of marks provided by the dataset */,
  },
};

// This profile is completely identical to MMFAD9A

class MMFAD9A extends Profile {
  constructor(dataset, options, config = customConfig) {
    super();
    Object.assign(this, new MMAFD93(dataset, options, config));
  }
}

module.exports = MMFAD9A;
