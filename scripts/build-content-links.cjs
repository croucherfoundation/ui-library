const fs = require('node:fs');
const path = require('node:path');
const rules = require('../links/rules.cjs');
const property = value => value.replace(/[A-Z]/g, c => `-${c.toLowerCase()}`);
function css(entries, indent = '') {
  return Object.entries(entries).map(([selector, values]) => {
    const body = selector.startsWith('@')
      ? css(values, indent + '  ')
      : Object.entries(values).map(([key, value]) => `${indent}  ${property(key)}: ${value};`).join('\n');
    return `${indent}${selector} {\n${body}\n${indent}}`;
  }).join('\n\n');
}
const output = '// Generated from links/rules.cjs. Do not edit by hand.\n' + css(rules) + '\n';
const target = path.join(__dirname, '../_croucher/_content-links.scss');
if (process.argv.includes('--check')) {
  if (!fs.existsSync(target) || fs.readFileSync(target, 'utf8') !== output) {
    throw new Error('Run npm run build:links to refresh the shared stylesheet.');
  }
} else fs.writeFileSync(target, output);

// A scoped adapter for legacy HTML whose anchors are not React components.
const bodyRules = {};
for (const [selector, values] of Object.entries(rules)) {
  if (selector.startsWith('@')) {
    const nested = {};
    for (const [child, declarations] of Object.entries(values)) {
      const selected = child.split(', ').filter(s => s.startsWith('a.c-body-link')).map(s => s.replace('a.c-body-link', '&'));
      if (selected.length) nested[selected.join(', ')] = declarations;
    }
    if (Object.keys(nested).length) bodyRules[selector] = nested;
  } else {
    const selected = selector.split(', ').filter(s => s.startsWith('a.c-body-link')).map(s => s.replace('a.c-body-link', '&'));
    if (selected.length) bodyRules[selected.join(', ')] = { ...bodyRules[selected.join(', ')], ...values };
  }
}
const mixin = '// Generated from links/rules.cjs. Do not edit by hand.\n@mixin croucher-body-link {\n' + css(bodyRules, '  ') + '\n}\n';
const mixinTarget = path.join(__dirname, '../_croucher/_content-link-mixins.scss');
if (process.argv.includes('--check')) {
  if (fs.readFileSync(mixinTarget, 'utf8') !== mixin) throw new Error('Refresh content-link mixins.');
} else fs.writeFileSync(mixinTarget, mixin);
