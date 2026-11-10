# Content links – shared implementation for 3075

Design and implementation approved by David on 10 November 2026. Consumer rollout is tracked separately.

## Contract

| Class | Rest | Fine-pointer hover | Keyboard focus |
| --- | --- | --- | --- |
| `c-body-link` on an anchor | Native underline | Underline removed | Underline and outline |
| `c-heading-link` on a heading's anchor | No underline | Native underline | Underline and outline |
| `c-heading-card` on an existing card anchor, `c-heading-link-text` on its title | No underline | Only title underlined | Card outlined; title underlined |

The card adapter represents the heading type, not a third treatment. Keep the existing card anchor, href, rel, target and click area. Do not nest anchors.

Both types inherit surrounding colour and weight in all states. Theme colour belongs to the content container, not the link. Image Awards can retain `--award-text: #757573`; dark mode inherits its readable light text. No red, dimming, border underline or animation is introduced. Native decoration thickness, offset and ink-skipping are used, with no layout changes.

The approved focus outline is 2px current-colour with a 2px offset. Focus remains visible while hovered. Touch devices keep the resting treatment. Visited and active states retain inherited colour and weight. Browser privacy prevents reliable automated inspection of actual visited colours; a manual clicked-link check remains required before rollout.

## Tailwind 3 integration

In the existing CMS `tailwind.config.js`, append to the existing plugins array:

```js
require('./src/app/styles/tailwind/content-links.cjs')
```

The CMS uses `croucherfoundation/ui-library` as the `src/app/styles` submodule. Pin its reviewed commit before enabling this integration. Other Tailwind consumers use their equivalent shared-library path. No Tailwind upgrade or global colour-token change is needed. Existing content scanning already covers the CMS's TSX files. Dynamic class construction must be avoided or explicitly safelisted.

```jsx
<p className="text-text-primary">
  Read <a className="c-body-link" href={existingHref}>the programme guidance</a>.
</p>
<h3 className="text-dh4">
  <a className="c-heading-link" href={existingHref}>Research fellowships</a>
</h3>
<a className="c-heading-card" href={existingHref}>
  <h3 className="c-heading-link-text">Existing story title</h3>
  <p>Existing description</p>
</a>
```

## Rails and shared source

`links/rules.cjs` is the only authored rule source. The Tailwind plugin consumes it directly. `npm run build:links` generates `_croucher/_content-links.scss`, imported by `main.scss`; `npm run check:links` detects drift. Rails consumers receive the generated partial through their existing UI-library submodule. A consumer importing only selected partials must explicitly import `content-links`.

Use either the generated stylesheet or Tailwind plugin in a consumer. If the CMS already includes the full shared SCSS, the classes are available without a second plugin registration; duplicate emission is unnecessary. The plugin supports consumers whose builds use Tailwind instead of the shared SCSS bundle.

## Migration boundaries and conflicts

No existing class or selector is changed. No global anchor, prose wrapper, navigation, button, breadcrumb, command, footer or event-card selector is added. CSW event cards stay excluded. Do not add the new classes to excluded controls.

Before migrating a call site, replace its conflicting legacy class or rule; do not stack these classes with `.editor-link`, `.link_color`, `.standard-link`, `.dark-mode-link`, `hover:text-red`, underline utilities or bespoke underline pseudo-elements. Tailwind utilities can override component-layer styles, and higher-specificity legacy card rules can override the new contract.

| Consumer | Reviewed source | Required scoped migration after approval |
| --- | --- | --- |
| CMS content | `tailwind.config.js` `.link_color`; `src/app/globals.css` `.editor-link` | Change the reader renderer's link class; audit old inline colours without stripping unrelated formatting. Preserve editor controls |
| CMS heading | `src/app/components/Common/CroucherTitle/CroucherTitle.tsx` | Replace local `hover:text-red hover:underline` only for approved content-heading uses |
| Shared cards | `_croucher/cards/_cards.scss` | Reconcile native hover rules and dark-mode background animation for opted-in story titles; preserve CSW event cards and existing card geometry |
| Dark scholar body links | `_croucher/_links.scss` `.dark-mode-link` | Replace this body-only rule; preserve navigation/footer pseudo-elements in the same file |
| University portal | `app/assets/stylesheets/university_portal.scss` `.portal-body-link`; `app/views/rounds/_portal_invitation.html.haml` | Replace body-link class and remove superseded rule. Restore ink-skipping and hover removal; retain routes and permissions |
| Image Awards | `.award-winner a` and related body-link rules | Existing behaviour matches. Adopt shared classes without overriding the page's grey or changing gallery commands |

3274 had no posted substantive audit findings when checked on 10 November. This link-specific preparation does not complete that wider audit. Current UI-library baseline: `388fe5f2e5e2bb1beabab60a643d6d638424f965`, fetched from origin. The inspected CMS checkout uses Tailwind 3.3.0 and that submodule revision; its local branch is not treated as a verified production release checkout.

## Review and release gate

Review the Figma specification and local preview first. Then integrate bounded consumer examples: one Memo, one News story, dark scholar portal and CSW story card alongside a standard Memo card. Verify old/new content, visited state, keyboard activation, theme switching, multiline links, descenders and narrow layouts in Safari and Chrome. Preserve destinations and permissions. No deployment is authorised by this preparation.

Rollback: revert the opt-in call-site migration and shared-library pin together. No stored content or database migration is part of this change.

## Verification completed

Tailwind 3.3.0 build, generated-file drift check and full Sass compilation passed. Browser checks in Chromium headless shell passed for both Tailwind and generated SCSS: rest, hover, keyboard focus, focus while hovered, unchanged colour/weight/bounds, native ink-skipping, title-only card decoration, excluded controls, 390px layout, Enter activation and touch emulation. Computed styles matched between both outputs. Desktop and narrow renders were visually inspected with Marr Sans. The full shared bundle, after removal of the new opt-in rules, was byte-identical to the compiled baseline. Safari, actual Chrome, actual visited-link colour and live consumer integration remain unverified.

## Consumer integration

The generated `_content-link-mixins.scss` provides `croucher-body-link` for explicitly scoped legacy authored HTML. It uses the same canonical declarations, including focus and hover. Import it in a Sass module and include it only on its content anchors. The legacy card hover rules exclude opted-in `c-heading-card` anchors; event cards remain on the existing rules.

Applications and CSW currently pin older library revisions. Backport the identical content-link change onto those pins to avoid rolling unrelated navigation, modal or container changes into this release.
