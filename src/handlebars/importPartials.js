const fs = require("fs/promises");
const path = require("path");

const partialsDir = path.join(__dirname, "..", "..", "views", "profiles");

async function importPartials(hbs, partials) {
  await Promise.all(
    Object.entries(partials).map(async ([name, relativePath]) => {
      const template = await fs.readFile(path.join(partialsDir, relativePath), "utf-8");
      hbs.registerPartial(name, template);
    })
  );

  return hbs;
}

module.exports = importPartials;
