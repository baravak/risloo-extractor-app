const fs = require("fs");
const { readdir } = require("fs/promises");
const path = require("path");

async function importPartials(hbs) {
  const partialsDir = path.join(__dirname, "..", "..", "views");

  const partialFiles = await readdir(partialsDir);

  let addPartialsPromises = partialFiles.map(
    (partialFile) =>
      new Promise(async function (resolve, reject) {
        const matches = /^([^.]+).(hbs|css|js)$/.exec(partialFile);
        if (!matches) return resolve(true);
        const name = matches[1];
        fs.readFile(
          path.join(partialsDir, partialFile),
          "utf-8",
          (err, template) => {
            if (err) reject(err);
            hbs.registerPartial(name, template);
            resolve(true);
          }
        );
      })
  );

  return Promise.all(addPartialsPromises);
}

module.exports = importPartials;
