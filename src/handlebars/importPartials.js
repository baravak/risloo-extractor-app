const fs = require("fs");
const { readdir } = require("fs/promises");
const path = require("path");

// These are the profiles that might be used completely in other profiles
const baseProfiles = ["AMS93", "MMFAD93"];

async function importPartials(hbs) {
  const partialsDir = path.join(__dirname, "..", "..", "views");

  let baseProfilePromises = baseProfiles.map((profileName) => {
    new Promise(function (resolve, reject) {
      fs.readFile(
        path.join(partialsDir, "profiles", `${profileName}.hbs`),
        "utf-8",
        (err, template) => {
          if (err) reject(err);
          hbs.registerPartial(profileName, template);
          resolve(true);
        }
      );
    });
  });

  return readdir(partialsDir).then((partialFiles) => {
    let generalPartialsPromises = partialFiles.map(
      (partialFile) =>
        new Promise(function (resolve, reject) {
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

    return Promise.all(generalPartialsPromises, baseProfilePromises);
  });
}

module.exports = importPartials;
