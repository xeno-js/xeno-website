// @ts-check
import { defineConfig } from 'astro/config'
import starlight from '@astrojs/starlight'
import tailwindcss from '@tailwindcss/vite'
import sitemap from '@astrojs/sitemap'

export default defineConfig({
  site: 'https://xeno-js.it',
  integrations: [
    starlight({
      title: 'Xeno.JS',
      favicon: '/favicon.ico',
      editLink: {
        baseUrl: 'https://github.com/xeno-js/xeno-website'
      },
      description: 'Xeno.JS is an application architecture framework for TypeScript with explicit dependency injection, DDD, CQRS and modular application boundaries.',
      customCss: ['./src/styles/global.css'],
      social: [{ icon: 'github', label: 'GitHub', href: 'https://github.com/xeno-js/xeno-js' }],
      logo: {
        src: './static/img/logo.png',
        alt: 'Xeno.JS Logo',
      },
      sidebar: [
        {
          label: 'Introduction',
          link: '/docs/introduction',
        },
        {
          label: 'Overview',
          collapsed: false,
          items: [
            { label: 'Why Xeno.JS', link: '/docs/introduction/why-xeno-js' },
            { label: 'Architecture Overview', link: '/docs/introduction/architecture-overview' },
            { label: 'Core Principles', link: '/docs/introduction/core-principles' },
          ]
        },
        {
          label: 'Getting Started',
          items: [
            { label: 'First Steps', link: '/docs/getting_started/installation'},
            { label: 'Create Project', link: '/docs/getting_started/create-project'},
            { label: 'Project Structure', link: '/docs/getting_started/project-structure'},
          ]
        },
        {
          label: 'Fundamentals',
          items: [
            { label: 'Overview', link: '/docs/fundamentals/overview'},
            { label: 'XenoRegistry', link: '/docs/fundamentals/xeno-registry'},
            { label: 'Xeno AppBuilder', link: '/docs/fundamentals/app-builder' },
            { label: 'Service Container', link: '/docs/fundamentals/service-container' },
          ]
        },
        {
          label: 'CLI',
          items: [
            { label: 'Overview', link: '/docs/cli/overview'},
            { label: 'Create Project', link: '/docs/cli/new-project'},
            { label: 'Generate Command', link: '/docs/cli/generate-cqrs'},
          ]
        },
        {
          label: 'Contributing Guide',
          link: '/contributing-guide'
        },
        {
          label: 'Support',
          link: '/support-us'
        }
      ],
    }),
    sitemap(),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
})
