# @llazyemail/core (private stub)

This package is `"private": true` and is **not published**. It only reserves the
scope name. The real v4 "core barrel" is the root
[`markup-generator`](./markup-generator.md) package.

## Exports
```ts
export const PHASE0_STUB = true as const;
export const PACKAGE_NAME = '@llazyemail/core' as const;
```
Do not rely on these. Its `test` script only checks that `dist/index.js` exports
`PHASE0_STUB === true`. It has no dependencies and no README.

```bash
pnpm --filter @llazyemail/core build && pnpm --filter @llazyemail/core test
```
