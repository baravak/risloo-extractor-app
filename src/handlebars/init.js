const Handlebars = require("handlebars");
const helpers = require("./helpers");
const handlebarsHelpers = require("handlebars-helpers")({
  handlebars: Handlebars,
});
const importPartials = require("./importPartials");

// Add Custom Helpers to Handlebars
for (let helper in helpers) Handlebars.registerHelper(helper, helpers[helper]);

// Add Partials to Handlebars
importPartials(Handlebars);

module.exports = Handlebars;
