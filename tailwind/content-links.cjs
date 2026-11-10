// Tailwind 3 plugin; the same rules generate the Rails stylesheet.
const rules = require('../links/rules.cjs');
module.exports = function contentLinks({ addComponents }) {
  addComponents(rules);
};
