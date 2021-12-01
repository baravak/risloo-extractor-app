class MyError extends Error {
  constructor(message) {
    super(message);
    this.name = this.constructor.name;
  }
}

class FileNotFoundError extends MyError {
  constructor(dir) {
    super(`File Not Found in ${dir}`);
  }
}

module.exports = { MyError, FileNotFoundError };
