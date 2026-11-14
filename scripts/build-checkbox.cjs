const fs = require('node:fs');
const path = require('node:path');
const rules = require('../checkbox/rules.json');
function css(r) {
  return Object.entries(r).map(([key, val]) => key + ' { ' + (key.startsWith('@') ? css(val) : Object.entries(val).map(([k,v]) => k + ': ' + v).join('; ') + ';') + ' }').join('\n') + '\n';
}
const result = '/* Croucher checkbox – Figma cf/form/checkbox 124:2328. */\n' + css(rules);
const dest = path.join(__dirname, '../_croucher/form/_checkbox-standard.scss');
if (process.argv.includes('--check')) {
  if (fs.readFileSync(dest, 'utf8') !== result) throw Error('Regenerate checkbox stylesheet.');
} else fs.writeFileSync(dest, result);
