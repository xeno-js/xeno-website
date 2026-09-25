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
      description: 'Xeno.JS is an enterprise backend framework for Node.js and TypeScript. Powered by @xeno-js/core, it delivers DDD, CQRS, and explicit dependency injection.',
      customCss: ['./src/styles/global.css'],
      social: [{ icon: 'github', label: 'GitHub', href: 'https://github.com/xeno-js/xeno-js' }],
      logo: {
        src: '/img/logo.png',
        alt: 'Xeno.JS Logo',
      },
      sidebar: [
        {
          label: 'Introduction',
          link: '/docs/introduction'
        },
        {
          label: '📦 @xeno-js/core',
          collapsed: false,
          items: [
            { label: 'Introduction', link: '/docs/core/introduction' },
            { label: 'Getting Started', link: '/docs/core/getting-started' },
            {
              label: 'Fundamentals',
              items: [
                { label: 'Overview', link: '/docs/core/fundamentals/overview' },
                { label: 'App Registry', link: '/docs/core/fundamentals/xeno-registry' },
                { label: 'Service Container', link: '/docs/core/fundamentals/service-container' },
                { label: 'App Builder', link: '/docs/core/fundamentals/app-builder' },
                { label: 'Request Context', link: '/docs/core/fundamentals/node-request-context' },
                { label: 'Middleware', link: '/docs/core/fundamentals/middleware' },
                { label: 'Controllers', link: '/docs/core/fundamentals/base-controller' },
                { label: 'Handlers', link: '/docs/core/fundamentals/base-handler' },
                { label: 'Commands & Queries', link: '/docs/core/fundamentals/command-query' },
                { label: 'Base Repositories', link: '/docs/core/fundamentals/base-repositories' },
                { label: 'Entities & Mappers', link: '/docs/core/fundamentals/entities-mappers' },
                { label: 'Result and Error Handling', link: '/docs/core/fundamentals/result-app-error' },
              ],
            },
            {
              label: 'Middleware',
              items: [
                { label: 'Request Middleware', link: '/docs/core/middlewares/request-middleware' },
                { label: 'Cookie Middleware', link: '/docs/core/middlewares/cookie-middleware' },
                { label: 'RateLimit Middleware', link: '/docs/core/middlewares/rate-limiter-middleware' },
                { label: 'Options Middleware', link: '/docs/core/middlewares/options-middleware' },
                { label: 'Allow Origin Middleware', link: '/docs/core/middlewares/allow-origins-middleware' },
                { label: 'CORS Middleware', link: '/docs/core/middlewares/cors-middleware' },
                { label: 'Method Check Middleware', link: '/docs/core/middlewares/allow-method-middleware' },
                { label: 'CSRF Middleware', link: '/docs/core/middlewares/csrf-middleware' }
              ],
            },
            {
              label: 'Security',
              items: [
                { label: 'Authentication', link: '/docs/core/security/authentication' },
                { label: 'Custom Authentication', link: '/docs/core/security/custom-authentication' },
                { label: 'Authorization', link: '/docs/core/security/authorization' },
                { label: 'Roles & Permissions Policies', link: '/docs/core/security/role-permission-policy' },
                { label: 'Custom Authorization', link: '/docs/core/security/custom-authorization' },
                { label: 'CSRF Token Service', link: '/docs/core/security/csrf-token-service' },
                { label: 'SSR & Platform Adapters', link: '/docs/core/security/ssr-adapters' },
              ],
            },
            {
              label: 'Database',
              items: [
                { label: 'Drizzle ORM', link: '/docs/core/database/database-persistent' },
                { label: 'Sql Lite', link: '/docs/core/database/sql-lite' },
                { label: 'Unit of Work Transaction', link: '/docs/core/database/unit-of-work' },
                { label: 'Base DataSource', link: '/docs/core/database/base-datasource' },
              ],
            },
            {
              label: 'Loggers',
              items: [
                { label: 'Overview', link: '/docs/core/loggers/overview' },
                { label: 'Pino', link: '/docs/core/loggers/pino-logger' },
                { label: 'Sentry', link: '/docs/core/loggers/sentry-logger' },
              ],
            },
            {
              label: 'Cache',
              items: [
                { label: 'Overview', link: '/docs/core/cache/overview' },
                { label: 'In-Memory', link: '/docs/core/cache/in-memory' },
                { label: 'Redis', link: '/docs/core/cache/redis' },
              ],
            },
            {
              label: 'CQRS',
              items: [
                { label: 'Overview', link: '/docs/core/cqrs/overview' },
                { label: 'Exception Behavior', link: '/docs/core/cqrs/exception-pipeline' },
                { label: 'Logging Behavior', link: '/docs/core/cqrs/logging-pipeline' },
                { label: 'Performance Behavior', link: '/docs/core/cqrs/performance-pipeline' },
                { label: 'Validation Behavior', link: '/docs/core/cqrs/validation-pipeline' },
                { label: 'Idempotency Behavior', link: '/docs/core/cqrs/idempotency-pipeline' },
                { label: 'Concurrency Behavior', link: '/docs/core/cqrs/concurrency-retry-pipeline' },
                { label: 'Query caching Behavior', link: '/docs/core/cqrs/query-caching-pipeline' },
              ],
            },
            { label: 'HTTP Core', link: '/docs/core/http-core' },
          ],
        },
        {
          label: '🎨 @xeno-js/vue',
          collapsed: false,
          items: [
            { label: 'Overview', link: '/docs/vue/overview' },
            {
              label: 'Fundamentals',
              items: [
                { label: 'App Builder & Bootstrap', link: '/docs/vue/fundamentals/app-builder' },
                { label: 'IoC & Vue Inject', link: '/docs/vue/fundamentals/ioc-registry' },
                { label: 'Browser Context', link: '/docs/vue/fundamentals/browser-context' },
                { label: 'Vite Environment', link: '/docs/vue/fundamentals/vite-env-config' },
              ],
            },
            {
              label: 'CQRS & State',
              items: [
                { label: 'Client Mediator', link: '/docs/vue/cqrs/client-mediator' },
                { label: 'Composables & Handlers', link: '/docs/vue/cqrs/cqrs-composables' },
                { label: 'Pipeline Behaviors', link: '/docs/vue/cqrs/client-pipelines' },
              ],
            },
            {
              label: 'Data Fetching',
              items: [
                { label: 'HTTP Core', link: '/docs/vue/data/http-core' },
                { label: 'Remote Data Sources', link: '/docs/vue/data/remote-data-sources' },
              ],
            },
            {
              label: 'Observability & Security',
              items: [
                { label: 'Sentry Vue Tracker', link: '/docs/vue/observability/sentry-logger' },
                { label: 'Supabase Auth', link: '/docs/vue/security/supabase-auth' },
              ],
            },
          ]
        },
        {
          label: '🛠️ @xeno-js/shared',
          collapsed: true,
          items: [
            { label: 'Overview', link: '/docs/shared/overview' },
            { label: 'Utils', 
              items: [
                { label: 'Overview', link: '/docs/shared/utils/overview' },
                { label: 'Guards Utils', link: '/docs/shared/utils/guards' },
                { label: 'String Utils', link: '/docs/shared/utils/string-utils' },
                { label: 'Math Utils', link: '/docs/shared/utils/math-utils' },
                { label: 'Date Utils', link: '/docs/shared/utils/date-utils' },
                { label: 'Enumerable', link: '/docs/shared/utils/enumerable' },
                { label: 'Guid Utils', link: '/docs/shared/utils/guid' },
                { label: 'HTTP Utils', link: '/docs/shared/utils/http-utils' },
                { label: 'Promise Utils', link: '/docs/shared/utils/promise-utils' },
              ]
            }
          ]
        },
        {
          label: '🚀 CLI',
          collapsed: false,
          items: [
            { label: 'Overview', link: '/docs/cli/overview' },
            { label: 'New Project Scaffolding', link: '/docs/cli/new-project' },
            { label: 'CQRS Generators', link: '/docs/cli/generate-cqrs' },
          ],
        },
        { label: 'GDPR & IP Masking', link: '/docs/loggers/gdpr-ip-masking' },
        { label: 'Support', link: '/docs/support-us' },
        { label: 'Contributing Guide', link: '/docs/contributing-guide' },
      ],
    }),
    sitemap(),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
})