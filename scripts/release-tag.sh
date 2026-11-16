#!/usr/bin/env bash
# Publish step for changesets/action (see .github/workflows/changesets.yml).
#
# Tags the current `markup-generator` version as `markup-generator@<version>`
# with `changeset git-tag`. It never publishes to npm itself: npm trusted
# publishing (OIDC) is bound to npm-publish.yml, so changesets.yml dispatches
# that workflow for the new tag.
#
# If the current version is already on npm (for example 4.1.0, released before
# this flow existed with a `v4.1.0` tag), nothing is tagged, so pushes to main
# without pending changesets don't create duplicate tags or releases.
set -euo pipefail

name="$(node -p "require('./package.json').name")"
version="$(node -p "require('./package.json').version")"

if [ -n "$(npm view "${name}@${version}" version 2>/dev/null || true)" ]; then
  echo "${name}@${version} is already on npm; nothing to tag."
  exit 0
fi

# changeset git-tag reads CHANGESETS_OUTPUT (set by changesets/action) and
# reports the new tag, which is how the action knows what to release.
exec pnpm exec changeset git-tag
