import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import { remarkMagicLinks } from 'sailkit/packages/atlas';
import { createSlugResolver } from './src/utils/slug-resolver.ts';

const urlBuilder = createSlugResolver('./src/content');

export default defineConfig({
  integrations: [mdx()],
  markdown: {
    remarkPlugins: [
      [remarkMagicLinks, {
        urlBuilder,
        syntax: 'both',
      }],
    ],
  },
});
