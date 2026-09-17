// @ts-check
import { defineConfig } from 'astro/config'
import starlight from '@astrojs/starlight'
import starlightTypeDoc from 'starlight-typedoc'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  integrations: [
    starlight({
      title: 'Xeno Docs',
      favicon: '/favicon.ico',
      description: 'Xeno is a Node.js framework for building scalable and maintainable applications.',
      customCss: ['./src/styles/global.css'],
      social: [{ icon: 'github', label: 'GitHub', href: 'https://github.com/Mattia-Carcione/xeno-js' }],

      plugins: [
        starlightTypeDoc({
          entryPoints: ['.temp/xeno-js/src/index.ts'],
          tsconfig: '.temp/xeno-js/tsconfig.json',
          output: 'core/api-reference',
        }),
        starlightTypeDoc({
          entryPoints: ['.temp/xeno-vue/src/index.ts'],
          tsconfig: '.temp/xeno-vue/tsconfig.json',
          output: 'vue/api-reference',
        }),
        starlightTypeDoc({
          entryPoints: ['.temp/xeno-shared/src/index.ts'],
          tsconfig: '.temp/xeno-shared/tsconfig.json',
          output: 'shared/api-reference',
        }),
        // starlightTypeDoc({
        //   entryPoints: ['.temp/xeno-cli/src/index.ts'],
        //   tsconfig: '.temp/xeno-cli/tsconfig.json',
        //   output: 'cli/api-reference',
        // })
      ],

      // 2. Definizione gerarchica della Sidebar
      sidebar: [
        {
          label: '📦 @xeno-js/core',
          collapsed: false,
          items: [
            // ATTENZIONE: Se separi la documentazione, assicurati di spostare 
            // fisicamente questi file .md nella sottocartella src/content/docs/core/
            { label: 'Introduction', link: '/core/introduction' },
            { label: 'Getting Started', link: '/core/getting-started' },
            {
              label: 'Fundamentals',
              items: [
                { label: 'Overview', link: '/core/fundamentals/overview' },
                { label: 'App Registry', link: '/core/fundamentals/xeno-registry' },
                // ... altri file manuali ...
              ],
            },
            // --- INIEZIONE AUTOMATICA DELLE API ---
            {
              label: 'API Reference',
              items: [{ autogenerate: { directory: 'core/api-reference' } }]
            }
          ]
        },
        {
          label: '🎨 @xeno-js/vue',
          collapsed: true,
          items: [
            { label: 'Overview', link: '/vue/overview' },
            // --- INIEZIONE AUTOMATICA DELLE API ---
            {
              label: 'API Reference',
              items: [{ autogenerate: { directory: 'vue/api-reference' } }]
            }
          ]
        },
        {
          label: '🛠️ @xeno-js/shared',
          collapsed: true,
          items: [
            { label: 'Overview', link: '/shared/overview' },
            // --- INIEZIONE AUTOMATICA DELLE API ---
            {
              label: 'API Reference',
              items: [{ autogenerate: { directory: 'shared/api-reference' } }]
            }
          ]
        },
        // {
        //   label: '💻 CLI',
        //   collapsed: true,
        //   items: [
        //     { label: 'Overview', link: '/cli/overview' },
        //     { label: 'Initialization', link: '/cli/initialization' },
        //     // --- INIEZIONE AUTOMATICA DELLE API ---
        //     {
        //       label: 'API Reference',
        //       items: [{ autogenerate: { directory: 'cli/api-reference' } }]
        //     }
        //   ],
        // },
        { label: 'Support', link: 'support-us' },
        { label: 'Contributing Guide', link: 'contributing-guide' },
      ],
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
})