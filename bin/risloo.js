#!/usr/bin/env node

require = require("esm")(module /*, options*/);
require("../src/cli").cli(process.argv);

process.on("unhandledRejection", (reason, promise) => {
  console.log("Unhandled Rejection at:", promise, "reason:", reason);
});
