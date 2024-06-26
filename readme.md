Old Contract address:
0xe75904331072ba88444f1d6c8aad09fe9aacce96

link:
<https://sepolia.etherscan.io/address/0xe75904331072ba88444f1d6c8aad09fe9aacce96>

New Offchain Contract address:

<!-- 0x9228564Cc08a5A82f79c948eC870430d4bFe5B88 -->
<!-- <https://sepolia.etherscan.io/address/0x9228564cc08a5a82f79c948ec870430d4bfe5b88#code> -->

0x3745724986BcF75B597a54e61ACF1ec4415561Af

Verify the contract code on etherscan:
<https://sepolia.etherscan.io/address/0x3745724986bcf75b597a54e61acf1ec4415561af#code>

# Christmass-Lottery

This template should help get you started developing with Vue 3 in Vite.

## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

## Type Support for `.vue` Imports in TS

TypeScript cannot handle type information for `.vue` imports by default, so we replace the `tsc` CLI with `vue-tsc` for type checking. In editors, we need [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) to make the TypeScript language service aware of `.vue` types.

## Customize configuration

See [Vite Configuration Reference](https://vitejs.dev/config/).

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Type-Check, Compile and Minify for Production

```sh
npm run build
```

### Run Unit Tests with [Vitest](https://vitest.dev/)

```sh
npm run test:unit
```

### Run End-to-End Tests with [Playwright](https://playwright.dev)

```sh
# Install browsers for the first run
npx playwright install

# When testing on CI, must build the project first
npm run build

# Runs the end-to-end tests
npm run test:e2e
# Runs the tests only on Chromium
npm run test:e2e -- --project=chromium
# Runs the tests of a specific file
npm run test:e2e -- tests/example.spec.ts
# Runs the tests in debug mode
npm run test:e2e -- --debug
```

### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```
