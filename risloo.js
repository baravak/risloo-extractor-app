#!/usr/bin/env node

require = require("esm")(module /*, options*/);
try {
  require("./src/cli").cli(process.argv);
} catch (err) {
  if (err) throw err;
}

process.on("unhandledRejection", (reason, promise) => {
  console.log("Unhandled Rejection at:", promise, "reason:", reason);
})

// process.on('warning', e => console.warn(e.stack));
