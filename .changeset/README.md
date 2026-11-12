# Changesets

Add a changeset for every user-facing change to the published `markup-generator` package:

```bash
pnpm changeset
```

On push to `main`, the Changesets workflow opens or updates a Version Packages pull request. Merging that PR bumps `package.json` and `CHANGELOG.md` and can create a GitHub Release.

Only the root `markup-generator` package is published (workspace `@llazyemail/*` packages are private and bundled). They are listed in `ignore` so they are not versioned independently.

Never hand-edit the `version` field in `package.json` or the released sections of `CHANGELOG.md`.
