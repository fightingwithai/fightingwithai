import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import { remarkMagicLinks } from 'sailkit/packages/atlas/dist/remark-magic-links.js';
import { buildLinkTargets } from './scripts/build-link-targets.js';

// Build link targets for magic links at config time
const targets = buildLinkTargets();

export default defineConfig({
  integrations: [mdx()],
  markdown: {
    remarkPlugins: [
      [remarkMagicLinks, {
        targets,
        syntax: 'both',
        unresolvedBehavior: 'warn',
        placeholderClass: 'placeholder-link',
      }],
    ],
  },
});
