#!/usr/bin/env node

require("../src/cli")
  .cli(process.argv)
  .catch((err) => {console.error(err)});

process.on("unhandledRejection", (reason, promise) => {
  console.log("Unhandled Rejection at:", promise, "reason:", reason);
});
