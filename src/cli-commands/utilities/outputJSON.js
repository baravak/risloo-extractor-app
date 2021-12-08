const path = require("path");

const OutputCode = {
  0: "profiles",
  1: "gift",
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

  setStatus({ code, message }) {
    if (!this.status) {
      this.status = {
        code,
        message,
      };
    }
    process.exitCode = code;
  }

  setTime(time) {
    if (!this.time) this.time = time;
  }

  showOutput() {
    const { code, filesObj, status, time } = this;
    const output = {
      [OutputCode[code]]: filesObj,
      message_code: status?.code,
      message: status?.message,
      time,
    };

    console.log(JSON.stringify(output));
    this._clear();
  }

  _clear() {
    this.filesObj = {};
    this.status = null;
    this.time = null;
  }
}

module.exports = outputJSON;
