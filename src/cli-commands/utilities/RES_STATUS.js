const Status = require("./Status");

const PROFILE_STATUS = {
  SUCCESS: new Status(0, "Success", "Profiles Successfully Created!"),
  "INPUT_NOT_FOUND": new Status(1, "Not Found", "Input Data File Does Not Exist!"),
  "JS_ERROR": new Status(2, "Profile JS Error", "Error in Instantiating the Profile Object"),
  "INVALID_SAMPLE_NAME": new Status(3, "Invalid Name", "Sample Name Is Not Valid"),
  "TEMPLATE_NOT_FOUND": new Status(4, "Not Found", "Profile Template File Does Not Exist"),
  "GENERAL_ERROR": new Status(5, "General Error", "Something Went Wrong!"),
};

const GIFT_STATUS = {
  SUCCESS: new Status(0, "Success", "Gift Successfully Created!"),
};

module.exports = { PROFILE_STATUS, GIFT_STATUS };
