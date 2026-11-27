# Single-pick search filters

The Rails adapter is `shared/cds_filters` in the data room. Each search endpoint supplies its own fields and options, scoped to the viewer, query and other selections. A choice consists of its display label including the result count, and its URL value. Count distinct result records. Recompute each field with only that field omitted. Keep permission and scope checks on the server.

Render the grid in `.cds-filters.croucher_container` with `.cds-filters__grid`. In each `.cds-filters__box`, follow the native select with an aria-hidden span containing the category label. Give the select that same accessible name. Native option text carries the value label and count. On the data room filter boxes keep the white fill and 1 px #a0a0a0 border identical at rest, on pointer focus and on keyboard focus. Suppress the browser outline and shadow on the box, preserving native keyboard operation. Show applied values below the boxes. Use stable query keys and normal GET form submission or a single fragment-refresh handler. Additional page controls may be rendered inside the grid.

In `.cds-filters__active`, each selected value is one link with the class `cds-filters__remove`, containing a 16 px Lucide X followed by the label. Its accessible name begins with “Remove”. Use `cds-filters__clear` for the clear link. Generate each link from the current path and query, retaining search text, view, sort and page size. Remove the page number when changing the result set or page size. Links support direct navigation, reload and Back.

Use `.cds-filters__toolbar.croucher_container` for the total and any existing sort control. Keep records in their original reading column. Render the page-size picker and pagination only when the selected page size produces multiple pages. Amounts, sorting and support for “all” belong to the consuming page.

| Page | Filter query keys | Other controls |
| --- | --- | --- |
| Directory | organisation, relationship, status | q, show, page |
| Scholars | award_type_code, country_code, institution_code, college, year, conference_id, begin_date, end_date | q, tags, view, sort, show, page |
| Library | type, modified, user_id | q, view, folder path, sort, show, page |

A Next.js adapter can emit the same semantic controls and classes, consume the same scoped choices, and navigate to the removal and clear URLs supplied by its endpoint.
