# Changesets

Add a changeset for every user-facing change to the published `markup-generator` package:

```bash
pnpm changeset
```

On push to `main`, the Changesets workflow (`changesets.yml`) opens or updates a *Version packages* pull request. That PR bumps `package.json` and `CHANGELOG.md`; when it merges, the workflow run for that merge tags `markup-generator@<version>`, creates the GitHub Release, and dispatches `npm-publish.yml`, which publishes through npm trusted publishing (no `NPM_TOKEN`). See the Release section of the root README.

Only the root `markup-generator` package is published (workspace `@llazyemail/*` packages are private and bundled). They are listed in `ignore` so they are not versioned independently.

Never hand-edit the `version` field in `package.json` or the released sections of `CHANGELOG.md`.
