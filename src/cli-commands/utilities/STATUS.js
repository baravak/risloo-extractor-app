const PROFILES_STATUS = {
  0: {
    code: 0,
    message: "(Success): Profiles Successfully Created!",
  },
  1: {
    code: 1,
    message: "(Not Found): Input Data File Does Not Exist!",
  },
  2: {
    code: 2,
    message: "(Profile JS Error): Error in Instantiating the Profile Object",
  },
  3: {
    code: 3,
    message: "(Invalid Name): Profile Name Is Not Valid",
  },
  4: {
    code: 4,
    message: "(Not Found): Profile Template File Does Not Exist",
  },
  5: {
    code: 5,
    message: "Something Went Wrong In The Input Data File!",
  },
  6: {
    code: 6,
    message: "Something Went Wrong In The JS Files!",
  },
};

const GIFTS_STATUS = {
  0: {
    code: 0,
    message: "(Success): Gifts Successfully Created!",
  },
};

module.exports = { PROFILES_STATUS, GIFTS_STATUS };
