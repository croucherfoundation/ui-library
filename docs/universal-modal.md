# Universal modal

Approved 31 October 2026. This is the common interaction and layout standard across Croucher applications. Application-specific fields and permissions are not part of this standard.

## Scrolling and layout

Use one modal scroll container. The logotype, title, content and action buttons scroll together. Only the close control stays visible, in a reserved right-hand gutter. Do not add a sticky header or footer, shrink the logotype on scroll, or introduce a second body scrollbar. Short forms show their actions naturally; long forms reveal them at the end.

The close control must remain inside the viewport at narrow widths, clear of text and inputs throughout scrolling. Preserve the shared typography and spacing tokens, using Marr Sans. The mobile breakpoint is the shared component's breakpoint, not a separate per-application choice.

## Close control

Use the icon-system X with active black colour, light 1.5 stroke and round caps. The visible mark is 24px on desktop and 20px on mobile, centred within a minimum 44px square hit area. Measure the visible paths, not just the SVG canvas. Do not use a text multiplication sign, disabled/edit grey, or remove the close control on mobile.

The approved normalised SVG has a 24 × 24 viewBox and paths `M23.25 0.75 0.75 23.25` and `M0.75 0.75 23.25 23.25`, with stroke width 1.5 and round caps. This accounts for the full painted bounds. The geometry derives from Lucide X (ISC); it is not a new Jan custom icon.

## Actions

Cancel and the primary action have the same 40px border-box height and align at their top and bottom edges. Remove browser-specific submit-input margins and appearance. Keep the outlined secondary and filled primary treatments. Wrap actions at narrow widths without clipping. Preserve accessible names, keyboard operation and visible focus; the close hit area is separate from the button-height rule.

## Implementation

Shared styling: `_croucher/modal/_standard_modal.scss`. Use `standard-modal-overlay`, `standard-modal-container`, `standard-modal-header`, `standard-modal-body`, `standard-modal-footer` and `standard-modal-close-btn`. The current header uses `display: contents` so it does not constrain the sticky close control. Keep dialog semantics on the dialog container, not solely on that presentational header.

Rails and React wrappers must follow this structure and avoid overriding it with fixed footers, nested overflow or independent sizing. Updating the library pin alone does not convert older Bootstrap, Headless UI or bespoke dialogs. Each separately deployed application needs its own compatible wrapper and release. Toasts, menus and image viewers are not automatically form-modal migration targets.

## Verification before release

- Check short and long forms on desktop and narrow screens, including Safari
- Check that only one container scrolls and the X stays visible without overlapping content
- Verify the visible X dimensions and 44px hit area
- Verify equal 40px action heights, wrapping, keyboard focus and close behaviour
- Preserve focus management, validation, Escape behaviour and unsaved-change handling
- Confirm that saving does not clear hidden fields or change permissions

Implementation reference: [UI library PR 2](https://github.com/croucherfoundation/ui-library/pull/2). First application integration: [Data room PR 1124](https://github.com/croucherfoundation/dataroom/pull/1124). Merging a component is not evidence of deployment in every consumer.
