const Handlebars = require("handlebars");
const helpers = require("./helpers");
const importPartials = require("./importPartials");

// Add Custom Helpers to Handlebars
for (let helper in helpers) Handlebars.registerHelper(helper, helpers[helper]);

module.exports = new Promise(function (resolve, reject) {
  // Add Partials to Handlebars
  importPartials(Handlebars)
    .then(() => resolve(Handlebars))
    .catch((err) => {
      reject(err);
    });
});
