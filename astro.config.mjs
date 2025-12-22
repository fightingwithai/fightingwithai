import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import { remarkMagicLinks } from 'bearing-dev/packages/atlas';
import { createSlugResolver } from 'bearing-dev/packages/atlas/dist/node.js';

export default defineConfig({
  integrations: [mdx()],
  markdown: {
    remarkPlugins: [
      [remarkMagicLinks, {
        urlBuilder: createSlugResolver('./src/content'),
        syntax: 'both',
      }],
    ],
  },
});
