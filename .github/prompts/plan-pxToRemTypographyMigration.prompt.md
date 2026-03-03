## Plan: Typography px→rem Zero-Drift Migration

Use this as an execution prompt for a safe, mechanical migration of typography `font-size` declarations from `px` to `rem` across this SCSS repository.

## Objective

Convert all in-scope SCSS `font-size` values expressed in `px` to `rem` with zero visual drift at a 16px root baseline.

## Migration Contract (Must Hold)

1. Scope is all SCSS files in the repository.
2. Convert only `font-size` values in `px`.
3. Baseline is 16px; conversion is:

	`rem = px ÷ 16`

4. Preserve full precision (including fractional px values).
5. Preserve declaration order and cascade behavior.
6. Do not modify non-`font-size` properties (`line-height`, `letter-spacing`, spacing, layout units, etc.).
7. Do not refactor tokens, typography scale, or root font-size.

## In-Scope Discovery

Run migration across:

- [main.scss](../../main.scss)
- [nav.scss](../../nav.scss)
- All files under [_croucher/](../../_croucher/)

Prioritize high-impact hotspots first:

- [_croucher/_my-bookings.scss](../../_croucher/_my-bookings.scss)
- [_croucher/_calendar.scss](../../_croucher/_calendar.scss)
- [_croucher/modal/_standard_modal.scss](../../_croucher/modal/_standard_modal.scss)
- [_croucher/_navbar.scss](../../_croucher/_navbar.scss)
- [_croucher/_filter-dropdown.scss](../../_croucher/_filter-dropdown.scss)
- [_croucher/_fonts.scss](../../_croucher/_fonts.scss)

## Explicit Conversion Rules

Apply these mechanically:

1. Convert active declarations such as `font-size: 16px;`, `font-size: 22px;`, `font-size: 18.8px;`.
2. Preserve flags and suffixes, e.g. `!important`.
3. Do not change values already in `rem`, `em`, `%`, `inherit`, `initial`, `unset`, `var(...)`, or `calc(...)` unless they contain a direct `px` literal that is the final `font-size` value.
4. Keep comments unchanged unless minimal clarification is needed for migration traceability.

## Edge-Case Policy

1. Duplicate `font-size` declarations must keep original order and override semantics.
	- Example pattern: [_croucher/_modal.scss](../../_croucher/_modal.scss#L72-L78)
2. Skip commented lines and dead code blocks.
3. Convert fractional px exactly (no rounding cap).
	- Example: [_croucher/_tagged_preview.scss](../../_croucher/_tagged_preview.scss#L43)

## Execution Phases

### Phase A: High-Impact Files

Migrate entrypoints and known typography-heavy hotspots first.

### Phase B: Remaining SCSS Coverage

Migrate all remaining `.scss` files under repository scope.

### Phase C: Cleanup + Validation Sweep

Run residual scans and patch any missed `font-size: <px>` declarations.

## Search and Audit Protocol

### Pre-Scan (Baseline)

Count in-scope `font-size` declarations still using `px`:

```bash
rg -n --glob '**/*.scss' 'font-size\s*:\s*-?[0-9]*\.?[0-9]+px\b'
```

### Post-Conversion Residual Scan

Must return zero intended hits (excluding comments if needed):

```bash
rg -n --glob '**/*.scss' 'font-size\s*:\s*-?[0-9]*\.?[0-9]+px\b'
```

### Safety Scan (Non-Goal Protection)

Review diff and confirm only `font-size` unit expressions changed; no unrelated `px` property migrations.

## Zero Visual Change Verification

At default root `16px`, verify on representative pages/components:

1. Computed `font-size` values are identical before vs after.
2. Only unit expression changed (`px` → `rem`), not actual rendered size.
3. Validate representative selectors sourced via [main.scss](../../main.scss) and [nav.scss](../../nav.scss).

## Rollback and Safety

1. Commit in chunks by phase (A/B/C) for fast, scoped reverts.
2. If regression appears, revert latest phase commit and re-run targeted conversion.
3. Non-goals (must not be introduced):
	- typography token refactor
	- typography scale redesign
	- root font-size change

## Completion Checklist

- [ ] Scope covered: all `.scss` files in repository.
- [ ] Residual scan clean for `font-size` px declarations.
- [ ] Diff confirms no non-`font-size` unit migrations.
- [ ] Key pages/components visually validated at 16px root.
- [ ] Computed `font-size` equality verified on sampled selectors.
- [ ] Migration report generated with converted file list and explicit exceptions.

## Migration Report Template

```md
# Typography px→rem Migration Report

## Summary
- Files scanned:
- Files changed:
- Declarations converted:

## Phases
- Phase A:
- Phase B:
- Phase C:

## Exceptions
- File:
  - Reason:

## Validation
- Residual `font-size px` scan: pass/fail
- Non-`font-size` safety audit: pass/fail
- Visual/computed-size checks: pass/fail
```

## Appendix: Exact Conversion Examples

- 11px → 0.6875rem
- 12px → 0.75rem
- 13px → 0.8125rem
- 14px → 0.875rem
- 15px → 0.9375rem
- 16px → 1rem
- 18px → 1.125rem
- 18.8px → 1.175rem
- 19.2px → 1.2rem
- 20px → 1.25rem
- 22px → 1.375rem
- 24px → 1.5rem
- 25px → 1.5625rem
- 26px → 1.625rem
- 32px → 2rem
- 40px → 2.5rem
- 42px → 2.625rem
- 46px → 2.875rem

## Operator Output Requirement

When executing this migration, always return:

1. Changed file list.
2. Count of converted `font-size` declarations.
3. Residual scan output.
4. Any exceptions not converted and why.
5. Final pass/fail against completion checklist.
