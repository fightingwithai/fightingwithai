# Fighting With AI

A pattern catalog for AI-assisted software engineering.

## Setup

```bash
npm install
npm run dev
```

## Dependencies

### Bearing Dev

This project uses [bearing-dev](https://github.com/bearing-dev/bearing-dev) installed directly from GitHub. The `dist/` folder is gitignored in that repo, so a `postinstall` script builds it automatically after `npm install`.

If you still see build errors related to bearing-dev, run manually:

```bash
cd node_modules/bearing-dev && npm run build
```
