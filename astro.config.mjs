import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import { remarkMagicLinks } from '@sailkit/atlas';

export default defineConfig({
  integrations: [mdx()],
  markdown: {
    remarkPlugins: [
      [remarkMagicLinks, {
        urlBuilder: (id) => `/concepts/${id}/`,
        syntax: 'both',
      }],
    ],
  },
});
