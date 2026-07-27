const Handlebars = require("handlebars");
const helpers = require("./helpers");
const importPartials = require("./importPartials");

const sharedPartials = {
  fonts: "fonts.css",
  layout: "layout.hbs",
  sidebar: "sidebar.hbs",
};

async function createHandlebars(partials = {}) {
  const hbs = Handlebars.create();

  for (const [name, helper] of Object.entries(helpers)) {
    hbs.registerHelper(name, helper);
  }

  return importPartials(hbs, { ...partials, ...sharedPartials });
}

module.exports = createHandlebars;
