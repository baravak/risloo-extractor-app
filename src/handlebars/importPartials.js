const fs = require("fs/promises");
const path = require("path");

async function importPartials(hbs) {
  const partialsDir = path.join(__dirname, "..", "..", "views");

  const partialFiles = await fs.readdir(partialsDir);

  partialFiles.forEach(async function (partialFile) {
    const matches = /^([^.]+).(hbs|css|js)$/.exec(partialFile);
    if (!matches) return;
    const name = matches[1];
    const template = await fs.readFile(
      path.join(partialsDir, partialFile),
      "utf-8"
    );

    hbs.registerPartial(name, template);
  });
}

module.exports = importPartials;
