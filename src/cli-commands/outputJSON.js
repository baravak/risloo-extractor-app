const path = require("path");

const OutputCode = {
  0: "profiles",
  1: "report",
};

class outputJSON {
  constructor(code) {
    this.code = code;
    this.filesObj = {};
  }

  addOutput(filePath) {
    const base = path.parse(filePath).base.split(".").slice(1);
    let ext = base.pop();
    let name = base.join(".") || "_";

    this.filesObj[name] = [...(this.filesObj[name] || []), ext];
  }

  setMessage(message) {
    if (!this.message) this.message = message;
  }

  setTime(time) {
    if (!this.time) this.time = time;
  }

  showOutput() {
    const { code, filesObj, message, time } = this;
    const output = {
      [OutputCode[code]]: filesObj,
      message,
      time,
    };

    // console.log(output)

    return JSON.stringify(output)
  }
}

module.exports = outputJSON;
