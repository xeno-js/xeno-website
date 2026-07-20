import React from 'react'
import ComponentCreator from '@docusaurus/ComponentCreator'

export default [
  {
    path: '/__docusaurus/debug',
    component: ComponentCreator('/__docusaurus/debug', '5ff'),
    exact: true,
  },
  {
    path: '/__docusaurus/debug/config',
    component: ComponentCreator('/__docusaurus/debug/config', '5ba'),
    exact: true,
  },
  {
    path: '/__docusaurus/debug/content',
    component: ComponentCreator('/__docusaurus/debug/content', 'a2b'),
    exact: true,
  },
  {
    path: '/__docusaurus/debug/globalData',
    component: ComponentCreator('/__docusaurus/debug/globalData', 'c3c'),
    exact: true,
  },
  {
    path: '/__docusaurus/debug/metadata',
    component: ComponentCreator('/__docusaurus/debug/metadata', '156'),
    exact: true,
  },
  {
    path: '/__docusaurus/debug/registry',
    component: ComponentCreator('/__docusaurus/debug/registry', '88c'),
    exact: true,
  },
  {
    path: '/__docusaurus/debug/routes',
    component: ComponentCreator('/__docusaurus/debug/routes', '000'),
    exact: true,
  },
  {
    path: '/docs',
    component: ComponentCreator('/docs', 'fcd'),
    routes: [
      {
        path: '/docs',
        component: ComponentCreator('/docs', '5b3'),
        routes: [
          {
            path: '/docs',
            component: ComponentCreator('/docs', '35f'),
            routes: [
              {
                path: '/docs/authentication/',
                component: ComponentCreator('/docs/authentication/', '954'),
                exact: true,
                sidebar: 'tutorialSidebar',
              },
              {
                path: '/docs/authentication/how-works-gate-keeper',
                component: ComponentCreator('/docs/authentication/how-works-gate-keeper', '522'),
                exact: true,
                sidebar: 'tutorialSidebar',
              },
              {
                path: '/docs/authentication/supabase-configuration',
                component: ComponentCreator('/docs/authentication/supabase-configuration', '566'),
                exact: true,
                sidebar: 'tutorialSidebar',
              },
              {
                path: '/docs/caching-idempotency-store/',
                component: ComponentCreator('/docs/caching-idempotency-store/', '4d8'),
                exact: true,
                sidebar: 'tutorialSidebar',
              },
              {
                path: '/docs/caching-idempotency-store/in-memory-provider',
                component: ComponentCreator(
                  '/docs/caching-idempotency-store/in-memory-provider',
                  'd6e',
                ),
                exact: true,
                sidebar: 'tutorialSidebar',
              },
              {
                path: '/docs/caching-idempotency-store/redis-provider',
                component: ComponentCreator(
                  '/docs/caching-idempotency-store/redis-provider',
                  'd0f',
                ),
                exact: true,
                sidebar: 'tutorialSidebar',
              },
              {
                path: '/docs/community-open-source/',
                component: ComponentCreator('/docs/community-open-source/', '2ef'),
                exact: true,
                sidebar: 'tutorialSidebar',
              },
              {
                path: '/docs/community-open-source/contributing-guide',
                component: ComponentCreator(
                  '/docs/community-open-source/contributing-guide',
                  '882',
                ),
                exact: true,
                sidebar: 'tutorialSidebar',
              },
              {
                path: '/docs/community-open-source/support-appreciation',
                component: ComponentCreator(
                  '/docs/community-open-source/support-appreciation',
                  'b40',
                ),
                exact: true,
                sidebar: 'tutorialSidebar',
              },
              {
                path: '/docs/core-architecture/',
                component: ComponentCreator('/docs/core-architecture/', '25e'),
                exact: true,
                sidebar: 'tutorialSidebar',
              },
              {
                path: '/docs/core-architecture/application-hosting-bootstrap-engine',
                component: ComponentCreator(
                  '/docs/core-architecture/application-hosting-bootstrap-engine',
                  'b5d',
                ),
                exact: true,
                sidebar: 'tutorialSidebar',
              },
              {
                path: '/docs/core-architecture/ioc-container-service-lifetimes',
                component: ComponentCreator(
                  '/docs/core-architecture/ioc-container-service-lifetimes',
                  'baf',
                ),
                exact: true,
                sidebar: 'tutorialSidebar',
              },
              {
                path: '/docs/core-architecture/module-composition-pattern',
                component: ComponentCreator(
                  '/docs/core-architecture/module-composition-pattern',
                  '5a2',
                ),
                exact: true,
                sidebar: 'tutorialSidebar',
              },
              {
                path: '/docs/cqrs-pipeline-architecture/',
                component: ComponentCreator('/docs/cqrs-pipeline-architecture/', '11d'),
                exact: true,
                sidebar: 'tutorialSidebar',
              },
              {
                path: '/docs/cqrs-pipeline-architecture/application-base-handler',
                component: ComponentCreator(
                  '/docs/cqrs-pipeline-architecture/application-base-handler',
                  '4b3',
                ),
                exact: true,
                sidebar: 'tutorialSidebar',
              },
              {
                path: '/docs/cqrs-pipeline-architecture/cross-cutting-pipeline-behaviors/',
                component: ComponentCreator(
                  '/docs/cqrs-pipeline-architecture/cross-cutting-pipeline-behaviors/',
                  '47b',
                ),
                exact: true,
                sidebar: 'tutorialSidebar',
              },
              {
                path: '/docs/cqrs-pipeline-architecture/cross-cutting-pipeline-behaviors/authorization-pipeline-behavior',
                component: ComponentCreator(
                  '/docs/cqrs-pipeline-architecture/cross-cutting-pipeline-behaviors/authorization-pipeline-behavior',
                  'bfa',
                ),
                exact: true,
                sidebar: 'tutorialSidebar',
              },
              {
                path: '/docs/cqrs-pipeline-architecture/cross-cutting-pipeline-behaviors/concurrency-retry-pipeline-behavior',
                component: ComponentCreator(
                  '/docs/cqrs-pipeline-architecture/cross-cutting-pipeline-behaviors/concurrency-retry-pipeline-behavior',
                  'aed',
                ),
                exact: true,
                sidebar: 'tutorialSidebar',
              },
              {
                path: '/docs/cqrs-pipeline-architecture/cross-cutting-pipeline-behaviors/exception-pipeline-behavior',
                component: ComponentCreator(
                  '/docs/cqrs-pipeline-architecture/cross-cutting-pipeline-behaviors/exception-pipeline-behavior',
                  '1c5',
                ),
                exact: true,
                sidebar: 'tutorialSidebar',
              },
              {
                path: '/docs/cqrs-pipeline-architecture/cross-cutting-pipeline-behaviors/idempotency-pipeline-behavior',
                component: ComponentCreator(
                  '/docs/cqrs-pipeline-architecture/cross-cutting-pipeline-behaviors/idempotency-pipeline-behavior',
                  'c37',
                ),
                exact: true,
                sidebar: 'tutorialSidebar',
              },
              {
                path: '/docs/cqrs-pipeline-architecture/cross-cutting-pipeline-behaviors/logging-pipeline-behavior',
                component: ComponentCreator(
                  '/docs/cqrs-pipeline-architecture/cross-cutting-pipeline-behaviors/logging-pipeline-behavior',
                  'dda',
                ),
                exact: true,
                sidebar: 'tutorialSidebar',
              },
              {
                path: '/docs/cqrs-pipeline-architecture/cross-cutting-pipeline-behaviors/query-caching-pipeline-behavior',
                component: ComponentCreator(
                  '/docs/cqrs-pipeline-architecture/cross-cutting-pipeline-behaviors/query-caching-pipeline-behavior',
                  '8f1',
                ),
                exact: true,
                sidebar: 'tutorialSidebar',
              },
              {
                path: '/docs/cqrs-pipeline-architecture/cross-cutting-pipeline-behaviors/validation-pipeline-behaviors',
                component: ComponentCreator(
                  '/docs/cqrs-pipeline-architecture/cross-cutting-pipeline-behaviors/validation-pipeline-behaviors',
                  '022',
                ),
                exact: true,
                sidebar: 'tutorialSidebar',
              },
              {
                path: '/docs/cqrs-pipeline-architecture/mediator-dispatcher-engine',
                component: ComponentCreator(
                  '/docs/cqrs-pipeline-architecture/mediator-dispatcher-engine',
                  'ff1',
                ),
                exact: true,
                sidebar: 'tutorialSidebar',
              },
              {
                path: '/docs/database-persistence/',
                component: ComponentCreator('/docs/database-persistence/', 'a25'),
                exact: true,
                sidebar: 'tutorialSidebar',
              },
              {
                path: '/docs/database-persistence/database-bootstrapping/',
                component: ComponentCreator(
                  '/docs/database-persistence/database-bootstrapping/',
                  'a89',
                ),
                exact: true,
                sidebar: 'tutorialSidebar',
              },
              {
                path: '/docs/database-persistence/datasources-execution-topology',
                component: ComponentCreator(
                  '/docs/database-persistence/datasources-execution-topology',
                  'b28',
                ),
                exact: true,
                sidebar: 'tutorialSidebar',
              },
              {
                path: '/docs/database-persistence/fluent-query-filter-compiler-grid',
                component: ComponentCreator(
                  '/docs/database-persistence/fluent-query-filter-compiler-grid',
                  '034',
                ),
                exact: true,
                sidebar: 'tutorialSidebar',
              },
              {
                path: '/docs/database-persistence/repositories-daos-design-patterns',
                component: ComponentCreator(
                  '/docs/database-persistence/repositories-daos-design-patterns',
                  'f07',
                ),
                exact: true,
                sidebar: 'tutorialSidebar',
              },
              {
                path: '/docs/defensive-toolkit-utilities/',
                component: ComponentCreator('/docs/defensive-toolkit-utilities/', '8bc'),
                exact: true,
                sidebar: 'tutorialSidebar',
              },
              {
                path: '/docs/defensive-toolkit-utilities/core-framework-utility-helpers',
                component: ComponentCreator(
                  '/docs/defensive-toolkit-utilities/core-framework-utility-helpers',
                  'f7e',
                ),
                exact: true,
                sidebar: 'tutorialSidebar',
              },
              {
                path: '/docs/defensive-toolkit-utilities/defensive-type-guards',
                component: ComponentCreator(
                  '/docs/defensive-toolkit-utilities/defensive-type-guards',
                  '72b',
                ),
                exact: true,
                sidebar: 'tutorialSidebar',
              },
              {
                path: '/docs/developer-ecosystem/',
                component: ComponentCreator('/docs/developer-ecosystem/', '97e'),
                exact: true,
                sidebar: 'tutorialSidebar',
              },
              {
                path: '/docs/developer-ecosystem/enterprise-project-scaffolding-cli',
                component: ComponentCreator(
                  '/docs/developer-ecosystem/enterprise-project-scaffolding-cli',
                  '508',
                ),
                exact: true,
                sidebar: 'tutorialSidebar',
              },
              {
                path: '/docs/domain-driven-design/',
                component: ComponentCreator('/docs/domain-driven-design/', '695'),
                exact: true,
                sidebar: 'tutorialSidebar',
              },
              {
                path: '/docs/domain-driven-design/entities-unique-identifiers',
                component: ComponentCreator(
                  '/docs/domain-driven-design/entities-unique-identifiers',
                  'a4a',
                ),
                exact: true,
                sidebar: 'tutorialSidebar',
              },
              {
                path: '/docs/domain-driven-design/functional-monads-core-errors',
                component: ComponentCreator(
                  '/docs/domain-driven-design/functional-monads-core-errors',
                  '972',
                ),
                exact: true,
                sidebar: 'tutorialSidebar',
              },
              {
                path: '/docs/domain-driven-design/value-objects-defensive-immutability',
                component: ComponentCreator(
                  '/docs/domain-driven-design/value-objects-defensive-immutability',
                  '6e0',
                ),
                exact: true,
                sidebar: 'tutorialSidebar',
              },
              {
                path: '/docs/execution-context-middleware/',
                component: ComponentCreator('/docs/execution-context-middleware/', 'bd7'),
                exact: true,
                sidebar: 'tutorialSidebar',
              },
              {
                path: '/docs/execution-context-middleware/execution-context-composition',
                component: ComponentCreator(
                  '/docs/execution-context-middleware/execution-context-composition',
                  '955',
                ),
                exact: true,
                sidebar: 'tutorialSidebar',
              },
              {
                path: '/docs/execution-context-middleware/request-identity-storage-lifecycle',
                component: ComponentCreator(
                  '/docs/execution-context-middleware/request-identity-storage-lifecycle',
                  '1c8',
                ),
                exact: true,
                sidebar: 'tutorialSidebar',
              },
              {
                path: '/docs/execution-context-middleware/transportation-contract-metadata-headers',
                component: ComponentCreator(
                  '/docs/execution-context-middleware/transportation-contract-metadata-headers',
                  '5ea',
                ),
                exact: true,
                sidebar: 'tutorialSidebar',
              },
              {
                path: '/docs/getting-started/',
                component: ComponentCreator('/docs/getting-started/', '3c4'),
                exact: true,
                sidebar: 'tutorialSidebar',
              },
              {
                path: '/docs/getting-started/architectural-layers-boundaries',
                component: ComponentCreator(
                  '/docs/getting-started/architectural-layers-boundaries',
                  '3fe',
                ),
                exact: true,
                sidebar: 'tutorialSidebar',
              },
              {
                path: '/docs/getting-started/introduction-philosophy',
                component: ComponentCreator('/docs/getting-started/introduction-philosophy', '82f'),
                exact: true,
                sidebar: 'tutorialSidebar',
              },
              {
                path: '/docs/getting-started/quick-start-guide',
                component: ComponentCreator('/docs/getting-started/quick-start-guide', 'e92'),
                exact: true,
                sidebar: 'tutorialSidebar',
              },
              {
                path: '/docs/getting-started/why-this-framework',
                component: ComponentCreator('/docs/getting-started/why-this-framework', '9c7'),
                exact: true,
                sidebar: 'tutorialSidebar',
              },
              {
                path: '/docs/http-requests-resilience/',
                component: ComponentCreator('/docs/http-requests-resilience/', '65a'),
                exact: true,
                sidebar: 'tutorialSidebar',
              },
              {
                path: '/docs/http-requests-resilience/http-client-configuration',
                component: ComponentCreator(
                  '/docs/http-requests-resilience/http-client-configuration',
                  '22c',
                ),
                exact: true,
                sidebar: 'tutorialSidebar',
              },
              {
                path: '/docs/http-requests-resilience/remote-data-source-gateways',
                component: ComponentCreator(
                  '/docs/http-requests-resilience/remote-data-source-gateways',
                  'e4e',
                ),
                exact: true,
                sidebar: 'tutorialSidebar',
              },
              {
                path: '/docs/http-requests-resilience/resilience-policies',
                component: ComponentCreator(
                  '/docs/http-requests-resilience/resilience-policies',
                  '222',
                ),
                exact: true,
                sidebar: 'tutorialSidebar',
              },
              {
                path: '/docs/presentation-layer-response-contracts/',
                component: ComponentCreator('/docs/presentation-layer-response-contracts/', 'd2c'),
                exact: true,
                sidebar: 'tutorialSidebar',
              },
              {
                path: '/docs/presentation-layer-response-contracts/base-controller',
                component: ComponentCreator(
                  '/docs/presentation-layer-response-contracts/base-controller',
                  '9ed',
                ),
                exact: true,
                sidebar: 'tutorialSidebar',
              },
              {
                path: '/docs/presentation-layer-response-contracts/standardize-http-response/',
                component: ComponentCreator(
                  '/docs/presentation-layer-response-contracts/standardize-http-response/',
                  '391',
                ),
                exact: true,
                sidebar: 'tutorialSidebar',
              },
              {
                path: '/docs/presentation-layer-response-contracts/standardize-http-response/error-response',
                component: ComponentCreator(
                  '/docs/presentation-layer-response-contracts/standardize-http-response/error-response',
                  'dd8',
                ),
                exact: true,
                sidebar: 'tutorialSidebar',
              },
              {
                path: '/docs/presentation-layer-response-contracts/standardize-http-response/http-helper',
                component: ComponentCreator(
                  '/docs/presentation-layer-response-contracts/standardize-http-response/http-helper',
                  '88e',
                ),
                exact: true,
                sidebar: 'tutorialSidebar',
              },
              {
                path: '/docs/presentation-layer-response-contracts/standardize-http-response/paginated-response',
                component: ComponentCreator(
                  '/docs/presentation-layer-response-contracts/standardize-http-response/paginated-response',
                  'd9b',
                ),
                exact: true,
                sidebar: 'tutorialSidebar',
              },
              {
                path: '/docs/presentation-layer-response-contracts/standardize-http-response/success-response',
                component: ComponentCreator(
                  '/docs/presentation-layer-response-contracts/standardize-http-response/success-response',
                  '741',
                ),
                exact: true,
                sidebar: 'tutorialSidebar',
              },
              {
                path: '/docs/telemetry-logging/',
                component: ComponentCreator('/docs/telemetry-logging/', 'fcf'),
                exact: true,
                sidebar: 'tutorialSidebar',
              },
              {
                path: '/docs/telemetry-logging/configure-console',
                component: ComponentCreator('/docs/telemetry-logging/configure-console', '0a1'),
                exact: true,
                sidebar: 'tutorialSidebar',
              },
              {
                path: '/docs/telemetry-logging/configure-pino',
                component: ComponentCreator('/docs/telemetry-logging/configure-pino', '73d'),
                exact: true,
                sidebar: 'tutorialSidebar',
              },
              {
                path: '/docs/telemetry-logging/configure-sentry',
                component: ComponentCreator('/docs/telemetry-logging/configure-sentry', 'ea9'),
                exact: true,
                sidebar: 'tutorialSidebar',
              },
            ],
          },
        ],
      },
    ],
  },
  {
    path: '/',
    component: ComponentCreator('/', 'e5f'),
    exact: true,
  },
  {
    path: '*',
    component: ComponentCreator('*'),
  },
]
