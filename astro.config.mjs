// @ts-check
import { defineConfig } from 'astro/config'
import starlight from '@astrojs/starlight'

import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  integrations: [
    starlight({
      title: 'Xeno Docs',
      favicon: '/favicon.ico',
      description:
        'Xeno is a Node.js framework for building scalable and maintainable applications.',
      customCss: ['./src/styles/global.css'],
      social: [{ icon: 'github', label: 'GitHub', href: 'https://github.com/withastro/starlight' }],
      sidebar: [
        { label: 'Introduction', link: '/introduction' },
        { label: 'Getting Started', link: '/getting-started' },
        {
          label: 'Fundamentals',
          items: [
            { label: 'Overview', link: '/fundamentals/overview' },
            { label: 'App Registry', link: '/fundamentals/xeno-registry' },
            { label: 'Service Container', link: '/fundamentals/service-container' },
            { label: 'App Builder', link: '/fundamentals/app-builder' },
            { label: 'Request Context', link: '/fundamentals/node-request-context' },
            { label: 'Middleware', link: '/fundamentals/middleware' },
            { label: 'Controllers', link: '/fundamentals/base-controller' },
            { label: 'Handlers', link: '/fundamentals/base-handler' },
            { label: 'Commands & Queries', link: '/fundamentals/command-query' },
            { label: 'Base Repositories', link: '/fundamentals/base-repositories' },
            { label: 'Entities & Mappers', link: '/fundamentals/entities-mappers' },
            { label: 'Result and Error Handling', link: '/fundamentals/result-app-error' },
          ],
        },
        {
          label: 'Security',
          items: [
            { label: 'Authentication', link: '/security/authentication' },
            { label: 'Custom Authentication', link: '/security/custom-authentication' },
            { label: 'Authorization', link: '/security/authorization' },
            { label: 'Roles & Permissions Policies', link: '/security/role-permission-policy' },
            { label: 'Custom Authorization', link: '/security/custom-authorization' },
          ],
        },
        {
          label: 'Database',
          items: [
            { label: 'Drizzle ORM', link: '/database/database-persistent' },
            { label: 'Sql Lite', link: '/database/sql-lite' },
            { label: 'Unit of Work Transaction', link: '/database/unit-of-work' },
          ],
        },
        {
          label: 'Loggers',
          items: [
            { label: 'Overview', link: '/loggers/overview' },
            { label: 'Pino', link: '/loggers/pino-logger' },
            { label: 'Sentry', link: '/loggers/sentry-logger' },
          ],
        },
        {
          label: 'Cache',
          items: [
            { label: 'Overview', link: '/cache/overview' },
            { label: 'In-Memory', link: '/cache/in-memory' },
            { label: 'Redis', link: '/cache/redis' },
          ],
        },
        {
          label: 'CQRS',
          items: [
            { label: 'Overview', link: '/cqrs/overview' },
            { label: 'Exception Behavior', link: '/cqrs/exception-pipeline' },
            { label: 'Logging Behavior', link: '/cqrs/logging-pipeline' },
            { label: 'Performance Behavior', link: '/cqrs/performance-pipeline' },
            { label: 'Validation Behavior', link: '/cqrs/validation-pipeline' },
            { label: 'Idempotency Behavior', link: '/cqrs/idempotency-pipeline' },
            { label: 'Concurrency Behavior', link: '/cqrs/concurrency-retry-pipeline' },
          ],
        },
      ],
    }),
  ],

  vite: {
    plugins: [tailwindcss()],
  },
})
