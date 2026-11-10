// Canonical content-link contract. Keep navigation and commands out of this file.
const body = 'a.c-body-link';
const heading = 'a.c-heading-link';
const card = 'a.c-heading-card';
const title = `${card} .c-heading-link-text`;
const anchors = `${body}, ${heading}, ${card}`;
const stable = {
  color: 'inherit',
  fontWeight: 'inherit',
};
const geometry = {
  textDecorationStyle: 'solid',
  textDecorationColor: 'currentColor',
  textDecorationThickness: 'auto',
  textUnderlineOffset: 'auto',
  textUnderlinePosition: 'auto',
  textDecorationSkipInk: 'auto',
};
const rules = {
  [anchors]: { ...stable, ...geometry },
  [`${body}:link, ${body}:visited, ${body}:hover, ${body}:active, ${body}:focus-visible, ${heading}:link, ${heading}:visited, ${heading}:hover, ${heading}:active, ${heading}:focus-visible, ${card}:link, ${card}:visited, ${card}:hover, ${card}:active, ${card}:focus-visible`]: stable,
  [body]: { textDecorationLine: 'underline' },
  [`${heading}, ${card}`]: { textDecorationLine: 'none' },
  [title]: { ...geometry, textDecorationLine: 'none' },
  '@media (hover: hover) and (pointer: fine)': {
    [`${body}:hover`]: { textDecorationLine: 'none' },
    [`${heading}:hover, ${card}:hover .c-heading-link-text`]: { textDecorationLine: 'underline' },
  },
  // Focus wins over hover. Outline does not change layout or click targets.
  [`${body}:focus-visible, ${heading}:focus-visible, ${card}:focus-visible`]: {
    outline: '2px solid currentColor',
    outlineOffset: '2px',
  },
  [`${body}:focus-visible, ${heading}:focus-visible, ${card}:focus-visible .c-heading-link-text`]: {
    textDecorationLine: 'underline',
  },
};
module.exports = rules;
