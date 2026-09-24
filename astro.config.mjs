// @ts-check
import { defineConfig } from 'astro/config'
import starlight from '@astrojs/starlight'
import tailwindcss from '@tailwindcss/vite'
import sitemap from '@astrojs/sitemap'

export default defineConfig({
  site: 'https://xenojs.com',
  integrations: [
    starlight({
      title: 'Xeno Docs',
      favicon: '/favicon.ico',
      description: 'Xeno is a Node.js framework for building scalable and maintainable applications.',
      customCss: ['./src/styles/global.css'],
      social: [{ icon: 'github', label: 'GitHub', href: 'https://github.com/xeno-js/xeno-js' }],

      sidebar: [
        {
          label: 'Introduction',
          link: '/introduction'
        },
        {
          label: '📦 @xeno-js/core',
          collapsed: false,
          items: [
            { label: 'Introduction', link: '/core/introduction' },
            { label: 'Getting Started', link: '/core/getting-started' },
            {
              label: 'Fundamentals',
              items: [
                { label: 'Overview', link: '/core/fundamentals/overview' },
                { label: 'App Registry', link: '/core/fundamentals/xeno-registry' },
                { label: 'Service Container', link: '/core/fundamentals/service-container' },
                { label: 'App Builder', link: '/core/fundamentals/app-builder' },
                { label: 'Request Context', link: '/core/fundamentals/node-request-context' },
                { label: 'Middleware', link: '/core/fundamentals/middleware' },
                { label: 'Controllers', link: '/core/fundamentals/base-controller' },
                { label: 'Handlers', link: '/core/fundamentals/base-handler' },
                { label: 'Commands & Queries', link: '/core/fundamentals/command-query' },
                { label: 'Base Repositories', link: '/core/fundamentals/base-repositories' },
                { label: 'Entities & Mappers', link: '/core/fundamentals/entities-mappers' },
                { label: 'Result and Error Handling', link: '/core/fundamentals/result-app-error' },
              ],
            },
            {
              label: 'Middleware',
              items: [
                { label: 'Request Middleware', link: '/core/middlewares/request-middleware' },
                { label: 'Cookie Middleware', link: '/core/middlewares/cookie-middleware' },
                { label: 'RateLimit Middleware', link: '/core/middlewares/rate-limiter-middleware' },
                { label: 'Options Middleware', link: '/core/middlewares/options-middleware' },
                { label: 'Allow Origin Middleware', link: '/core/middlewares/allow-origins-middleware' },
                { label: 'CORS Middleware', link: '/core/middlewares/cors-middleware' },
                { label: 'Method Check Middleware', link: '/core/middlewares/allow-method-middleware' },
                { label: 'CSRF Middleware', link: '/core/middlewares/csrf-middleware' }
              ],
            },
            {
              label: 'Security',
              items: [
                { label: 'Authentication', link: '/core/security/authentication' },
                { label: 'Custom Authentication', link: '/core/security/custom-authentication' },
                { label: 'Authorization', link: '/core/security/authorization' },
                { label: 'Roles & Permissions Policies', link: '/core/security/role-permission-policy' },
                { label: 'Custom Authorization', link: '/core/security/custom-authorization' },
                { label: 'CSRF Token Service', link: '/core/security/csrf-token-service' },
                { label: 'SSR & Platform Adapters', link: '/core/security/ssr-adapters' },
              ],
            },
            {
              label: 'Database',
              items: [
                { label: 'Drizzle ORM', link: '/core/database/database-persistent' },
                { label: 'Sql Lite', link: '/core/database/sql-lite' },
                { label: 'Unit of Work Transaction', link: '/core/database/unit-of-work' },
              ],
            },
            {
              label: 'Loggers',
              items: [
                { label: 'Overview', link: '/core/loggers/overview' },
                { label: 'Pino', link: '/core/loggers/pino-logger' },
                { label: 'Sentry', link: '/core/loggers/sentry-logger' },
              ],
            },
            {
              label: 'Cache',
              items: [
                { label: 'Overview', link: '/core/cache/overview' },
                { label: 'In-Memory', link: '/core/cache/in-memory' },
                { label: 'Redis', link: '/core/cache/redis' },
              ],
            },
            {
              label: 'CQRS',
              items: [
                { label: 'Overview', link: '/core/cqrs/overview' },
                { label: 'Exception Behavior', link: '/core/cqrs/exception-pipeline' },
                { label: 'Logging Behavior', link: '/core/cqrs/logging-pipeline' },
                { label: 'Performance Behavior', link: '/core/cqrs/performance-pipeline' },
                { label: 'Validation Behavior', link: '/core/cqrs/validation-pipeline' },
                { label: 'Idempotency Behavior', link: '/core/cqrs/idempotency-pipeline' },
                { label: 'Concurrency Behavior', link: '/core/cqrs/concurrency-retry-pipeline' },
                { label: 'Query caching Behavior', link: '/core/cqrs/query-caching-pipeline' },
              ],
            },
            { label: 'HTTP Core', link: '/core/http-core' },
          ],
        },
        {
          label: '🎨 @xeno-js/vue',
          collapsed: false,
          items: [
            { label: 'Overview', link: '/vue/overview' },
            {
              label: 'Fundamentals',
              items: [
                { label: 'App Builder & Bootstrap', link: '/vue/fundamentals/app-builder' },
                { label: 'IoC & Vue Inject', link: '/vue/fundamentals/ioc-registry' },
                { label: 'Browser Context', link: '/vue/fundamentals/browser-context' },
                { label: 'Vite Environment', link: '/vue/fundamentals/vite-env-config' },
              ],
            },
            {
              label: 'CQRS & State',
              items: [
                { label: 'Client Mediator', link: '/vue/cqrs/client-mediator' },
                { label: 'Composables & Handlers', link: '/vue/cqrs/cqrs-composables' },
                { label: 'Pipeline Behaviors', link: '/vue/cqrs/client-pipelines' },
              ],
            },
            {
              label: 'Data Fetching',
              items: [
                { label: 'HTTP Core', link: '/vue/data/http-core' },
                { label: 'Remote Data Sources', link: '/vue/data/remote-data-sources' },
              ],
            },
            {
              label: 'Observability & Security',
              items: [
                { label: 'Sentry Vue Tracker', link: '/vue/observability/sentry-logger' },
                { label: 'Supabase Auth', link: '/vue/security/supabase-auth' },
              ],
            },
          ]
        },
        {
          label: '🛠️ @xeno-js/shared',
          collapsed: true,
          items: [
            { label: 'Overview', link: '/shared/overview' },
            { label: 'Utils', 
              items: [
                { label: 'Overview', link: '/shared/utils/overview' },
                { label: 'Guards Utils', link: '/shared/utils/guards' },
                { label: 'String Utils', link: '/shared/utils/string-utils' },
                { label: 'Math Utils', link: '/shared/utils/math-utils' },
                { label: 'Date Utils', link: '/shared/utils/date-utils' },
                { label: 'Enumerable', link: '/shared/utils/enumerable' },
                { label: 'Guid Utils', link: '/shared/utils/guid' },
                { label: 'HTTP Utils', link: '/shared/utils/http-utils' },
                { label: 'Promise Utils', link: '/shared/utils/promise-utils' },
              ]
            }
          ]
        },
        {
          label: '🚀 CLI',
          collapsed: false,
          items: [
            { label: 'Overview', link: '/cli/overview' },
            { label: 'New Project Scaffolding', link: '/cli/new-project' },
            { label: 'CQRS Generators', link: '/cli/generate-cqrs' },
          ],
        },
        { label: 'GDPR & IP Masking', link: '/loggers/gdpr-ip-masking' },
        { label: 'Support', link: 'support-us' },
        { label: 'Contributing Guide', link: 'contributing-guide' },
      ],
    }),
    sitemap(),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
})