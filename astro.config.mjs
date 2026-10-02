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
          collapsed: true,
          items: [
            { label: 'Why Xeno.JS', link: '/docs/introduction/why-xeno-js' },
            { label: 'Architecture Overview', link: '/docs/introduction/architecture-overview' },
            { label: 'Core Principles', link: '/docs/introduction/core-principles' },
          ]
        },
        {
          label: 'Getting Started',
          collapsed: true,
          items: [
            { label: 'First Steps', link: '/docs/getting_started/installation'},
            { label: 'Create Project', link: '/docs/getting_started/create-project'},
            { label: 'Project Structure', link: '/docs/getting_started/project-structure'},
          ]
        },
        {
          label: 'Fundamentals',
          collapsed: true,
          items: [
            { label: 'Overview', link: '/docs/fundamentals/overview'},
            { label: 'XenoRegistry', link: '/docs/fundamentals/xeno-registry'},
            { label: 'Xeno AppBuilder', link: '/docs/fundamentals/app-builder' },
            { label: 'Contexts Scopes', link: '/docs/fundamentals/context-scopes' },
          ]
        },
        {
          label: 'Dependency Injection',
          collapsed: true,
          items: [
            { label: 'Service Container', link: '/docs/dependency-injection/service-container' },
            { label: 'Registration', link: '/docs/dependency-injection/registration' },
            {
              label: 'Lifetimes',
              collapsed: true,
              items: [
                { label: 'Singleton', link: '/docs/dependency-injection/lifetimes/singleton' },
                { label: 'Scoped', link: '/docs/dependency-injection/lifetimes/scoped' },
                { label: 'Transient', link: '/docs/dependency-injection/lifetimes/transient' },
              ]
            },
            { label: 'Resolution', link: '/docs/dependency-injection/resolution' },
            { label: 'Dependency Graph', link: '/docs/dependency-injection/dependency-graph' },
            { label: 'Captive Dependencies', link: '/docs/dependency-injection/captive-dependencies' },
          ]
        },
        {
          label: 'Application',
          collapsed: true,
          items: [
            { label: 'Overview', link: '/docs/application/overview' },
            {
              label: 'Pipelines',
              collapsed: true,
              items: [
                { label: 'Exception Pipeline', link: '/docs/application/pipelines/exception' },
                { label: 'Logging Pipeline', link: '/docs/application/pipelines/logging' },
                { label: 'Performance Pipeline', link: '/docs/application/pipelines/performance' },
                { label: 'Validation Pipeline', link: '/docs/application/pipelines/validation' },
                { label: 'Concurrency Pipeline', link: '/docs/application/pipelines/concurrency' },
                { label: 'Idempotency Pipeline', link: '/docs/application/pipelines/idempotency' },
                { label: 'Caching Pipeline', link: '/docs/application/pipelines/caching' },
              ]
            },
            {
              label: 'CQRS',
              collapsed: true,
              items: [
                { label: 'Overview', link: '/docs/application/cqrs/overview' },
                { label: 'Command', link: '/docs/application/cqrs/command' },
                { label: 'Query', link: '/docs/application/cqrs/query' },
                { label: 'Schema Zod', link: '/docs/application/cqrs/zod-schema' },
                { label: 'Handlers', link: '/docs/application/cqrs/handler' },
              ]
            },
          ]
        },
        {
          label: 'CLI',
          collapsed: true,
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
