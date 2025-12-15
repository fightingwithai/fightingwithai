# Fighting With AI

A pattern catalog for AI-assisted software engineering.

## Setup

```bash
npm install
npm run dev
```

## Dependencies

### Sailkit

This project uses [sailkit](https://github.com/joshribakoff/sailkit) installed directly from GitHub. The `dist/` folder is gitignored in that repo, so a `postinstall` script builds it automatically after `npm install`.

If you still see build errors related to sailkit/compass, run manually:

```bash
cd node_modules/sailkit && npm run build
```
