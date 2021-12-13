const path = require("path");

class Response {
  constructor() {
    this.files = {};
  }

  addBranch(name) {
    this.files[name] = {};
  }

  addOutput(dir, branch) {
    const base = path.parse(dir).base.split(".").slice(1);
    let ext = base.pop();
    let name = base.join(".") || "_";

    this.files[branch][name] = [...(this.files[branch][name] || []), ext];
  }

  setStatus({ code, label, message }, err = null) {
    if (!this.status) {
      this.status = {
        code,
        label,
        message,
      };
    }
    process.exitCode = code;

    if (err) throw err;
  }

  setTime(time) {
    if (!this.time) this.time = time;
  }

  showOutput() {
    const { files, status, time } = this;
    const output = {
      ...files,
      message_code: status && status.code,
      message: status && `(${status.label}) ${status.message}`,
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

module.exports = Response;
