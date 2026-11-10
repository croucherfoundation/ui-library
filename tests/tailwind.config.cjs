module.exports = {
  content: [{ raw: '<a class="c-body-link c-heading-link c-heading-card"><span class="c-heading-link-text"></span></a>', extension: 'html' }],
  corePlugins: { preflight: false },
  plugins: [require('../tailwind/content-links.cjs')],
};
