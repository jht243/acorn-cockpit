# Project-scoped Cursor config

## `mcp.json`

Adds a project-local Render MCP server named **`render-acorn`** that authenticates
to **Acorn Care LLC's** Render workspace (owner: karli@acorn-care.com,
owner id: `tea-d8lhe9pkh4rs73b1b3t0`).

This is **separate** from the global `render` MCP server in
`~/.cursor/mcp.json`, which still points to Jonathan's personal Render workspace
(`jht243@nyu.edu`) and is used by other projects.

Use `render-acorn` for anything related to deploying or managing the Acorn Care
production service. Do **not** use the global `render` server for Acorn — it
points at Jonathan's test account.

## Security

The API key in `mcp.json` grants full access to Karli's Render workspace.
This file is gitignored. Rotate the key in Karli's Render dashboard
(Account Settings → API Keys) after migration is complete and we no longer need
programmatic access.
