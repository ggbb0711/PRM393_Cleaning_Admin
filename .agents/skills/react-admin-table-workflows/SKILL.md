---
name: react-admin-table-workflows
description: Table-first design guidance for CleanAI Admin dashboards and record-management workflows. Use when creating or changing list screens, dashboard summaries, filters, sorting, pagination, detail views, edit forms, row actions, archive/delete/suspend operations, or other destructive and financial actions.
---

# React Admin Table Workflows

## Screen Shape

- Use dashboard cards only for aggregated metrics, alerts, and operational summaries.
- Use a table for collections and record management. Keep the page title, explanation, search, filters, sort, pagination, column controls, and primary create action near the table.
- Preserve filters, pagination, and scroll position when an Admin views or edits a record.
- Use a detail drawer for quick inspection and a dedicated page when the record has substantial sections or history.
- Use a validated drawer, dialog, or page for editing based on form size. Protect unsaved changes.

## Row Actions

- Put View, Edit, and domain actions in a consistent row action area or overflow menu.
- Prefer explicit domain operations such as approve, reject, suspend, archive, cancel, reassign, and refund over arbitrary field mutation.
- Before destructive, financial, or privacy-sensitive actions, identify the target, summarize consequences, require confirmation, and collect a reason when required.
- Disable repeated submission while a mutation is pending. Refresh the affected row and summaries after success.
- On `409`, preserve the Admin's context and explain how to reload current data.

## Required States

- Provide visible loading, success, empty, error, retry, permission-denied, disabled, stale, and conflict states where applicable.
- Keep action visibility consistent with known state, but rely on the API for final authorization and policy decisions.
- On narrow screens, allow horizontal table scrolling, keep critical identity/action columns usable, and move complex filters into a responsive panel.

## Testing

Use `$react-admin-testing` to cover state rendering, query mapping, row identity, action eligibility, confirmation, cancellation, successful mutation, authorization failure, and conflict behavior.
