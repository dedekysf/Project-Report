# Edge Cases & Unhandled Areas — Report Builder (`tasktag-project-detail-v2.jsx`)

Found while auditing the code after this session's changes. Each item: **Question** (the scenario) + **Explanation** (what the code actually does now, with `file:line`). Tagged `[Tech]` for logic issues, `[Design]` for visual/UX issues.

---

## 1. Upload (Logo & Highlight Photo)

### [Tech] What happens if the uploaded file is corrupted or not a real image?
`resizeImageToDataURL` (line 1686) does catch decode failures via `img.onerror = reject`, but both callers just do:
```js
.catch(() => setLoading(false))
```
Loading stops, but **no error message is shown at all**. The box just quietly resets — the user has no idea what happened.

### [Tech] Small regex bug in file type validation
Line 1683-1684:
```js
["image/png", "image/jpeg"].includes(file.type) || /.(png|jpe?g)$/i.test(file.name || "") && !file.type;
```
The dot in `/.(png|jpe?g)$/i` isn't escaped, so it matches *any* character, not a literal dot. A filename like `fotoxpng` could wrongly pass if `file.type` is empty. Should be `/\.(png|jpe?g)$/i`.

### [Tech] File size/type checks are client-side only
Easy to bypass (devtools, renamed extension). Fine for a prototype, but a real backend must re-validate.

### [Design] Can you click "Remove" while an upload is still loading?
The Remove button doesn't check `!loading` before firing (the Pencil/replace button does). In theory you could remove mid-upload, and the old upload could still land afterward.

---

## 2. Checklist Progress Bar

### [Tech] Can `pct` become `NaN%`?
```js
const pct = Math.round(completed / total * 100); // line 3502
```
`total` is currently `DUMMY_ENTRIES.length`, a fixed constant — never 0 today. But the code comment says this will be replaced with real API data. A brand-new project with zero tasks would make `total = 0`, and `pct` would render as `NaN%` as-is.

## 3. Duplicate Dates in Checklist Count

### [Design] Two entries share the same date (`2026-09-06`) — one has checklist items, one doesn't
Picking a custom 1-day period on that date won't trigger the "no checklist items" banner, since the other entry on the same date still has items. Not a bug, just something to remember when demoing custom single-day ranges.

## 4. Skeleton Loading for the New Banner

### [Design] The "no checklist items" banner has no skeleton placeholder
It only renders in the real content, not in the loading-skeleton version. Every other section was earlier made to match its skeleton height exactly to avoid layout shift — this new banner wasn't included in that pass.

---

## 5. Paywall & the New Preview Tab

### [Tech] Paywall state is passed via `?paywall=1` in the URL
Anyone can edit the URL to remove it and unlock Download/Copy link in the new tab. Fine for a prototype with no real auth, but this pattern must not carry over to production — paywall status needs server-side validation.

### [Tech] `localStorage` entries for preview assets are never cleaned up
Each "Preview" open writes a new entry (`tt-preview-assets-{id}`, ~line 6410) and nothing ever deletes old ones. Could slowly fill up browser storage over time.

---

## 6. Task Status & Dummy Data

### [Design] Checklist-empty dummy entries can land on a shared date
See #3 above — same root cause, just flagging it here too since it affects dummy data design.

### [Tech] Task status is computed from a date formula, not real data
`statusForEntry` (line 611) uses `d.getDate() % 5` — a placeholder. Needs to come from the backend once real data is wired in.

---

## 7. Timesheet Tab

### [Design] The tab has no content at all
`<TabsContent value="timesheet" />` (~line 8286) is empty. The "View Timesheet" button and the tab itself are clickable, but land on a blank page. Needs either real content or a "Coming soon" state.

---

## 8. Reports Table

### [Tech] Empty-state copy across paywalled vs. non-paywalled — worth a manual re-check
Handled separately (~line 6855-6860) but should be re-verified in-browser across all demo cases (happy/paywall/error) to make sure the copy still reads correctly.

---

## 9. Design System Consistency

### [Design] A few hardcoded colors remain, not design tokens
E.g. `rgba(10,22,41,0.55)` (overlay button backgrounds, reused in several places), and hex colors in `buildReportHTML` (`#16a97d`, `#0a1629`, etc. — these are intentional, since the exported document must stand alone outside the app's CSS variables). The component-level ones (overlays, shadows) are worth a cleanup pass if full token compliance matters.

### [Design] No dark mode support
No `@media (prefers-color-scheme: dark)` or `data-theme="dark"` handling anywhere. Not an issue unless dark mode becomes a requirement.

---

## 10. Responsiveness / Mobile

### [Design] Layout is fixed-width throughout, not responsive
`PAGE_W`, `NAV_W`, the table, tabs, upload boxes, banners — all sized for a specific desktop width. No mobile/tablet breakpoints exist. Fine if this is desktop-only internal tooling, but worth confirming with stakeholders.

---

## Suggested Priority (not final)

| Priority | Item | Why |
|---|---|---|
| High | Silent upload failure (#1) | User-facing, confusing |
| High | Paywall via query param (#5) | Security, even if just a prototype |
| Medium | `isAllowedUploadType` regex bug (#1) | Small but real |
| Medium | `pct` → `NaN%` when `total=0` (#2) | Only matters once real API data lands |
| Medium | Empty Timesheet tab (#7) | Looks unfinished |
| Low | localStorage never cleaned (#5) | Long-term effect only |
