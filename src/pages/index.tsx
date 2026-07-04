import React, { JSX } from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import styles from './index.module.css';
import { 
  Link as LinkIcon, 
  ShieldCheck, 
  Settings, 
  Container, 
  Code, 
  Package, 
  Boxes, 
  Terminal,
  Cpu,
  Layers,
  Zap
} from 'lucide-react'; 

/**
 * @description Invarianti di interfaccia per le proprietà dei componenti Feature.
 */
interface FeatureProps {
  title: string;
  description: string;
  icon: JSX.Element;
}

/**
 * @description Invarianti di interfaccia per i blocchi dei servizi architetturali core.
 */
interface CoreService {
  title: string;
  description: string;
  icon: JSX.Element;
}

/**
 * @description Componente atomico autocontenuto per la renderizzazione dei pilastri tecnologici.
 */
function HighLevelFeature({ title, description, icon }: FeatureProps): JSX.Element {
  return (
    <div className="col col--4" style={{ padding: '1rem' }}>
      <div className={styles.featureCard}>
        <div className={styles.iconWrapper} aria-hidden="true">{icon}</div>
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
    </div>
  );
}

/**
 * @description Componente atomico riutilizzabile per la griglia delle funzionalità enterprise.
 */
function ServiceGridItem({ title, description, icon }: CoreService): JSX.Element {
  return (
    <div className="col col--3 margin-bottom--lg">
      <div className={styles.serviceCard}>
        <div className={styles.iconWrapper} aria-hidden="true">{icon}</div>
        <h4>{title}</h4>
        <p>{description}</p>
      </div>
    </div>
  );
}

/**
 * @description Matrice dei dati dei servizi core allineata alla consistenza terminologica del framework.
 */
const coreServices: CoreService[] = [
  { 
    title: '100% Agnostic', 
    description: 'Core application use cases communicate with external delivery mechanisms solely via standard input/output mapping models.', 
    icon: <LinkIcon size={24} /> 
  },
  { 
    title: 'Precision Type Safety', 
    description: 'Enforces strict nominal typing via branded tokens to completely eliminate structural inversion-of-control resolution mismatches.', 
    icon: <ShieldCheck size={24} /> 
  },
  { 
    title: 'Enterprise Pattern', 
    description: 'Native support for CQRS, resilience, and idempotency patterns out of the box.', 
    icon: <Settings size={24} /> 
  },
  { 
    title: 'Zero-Decorator', 
    description: 'Compiles the application dependency graph linearly during boot phase with zero reliance on reflection metadata or runtime scanning.', 
    icon: <Container size={24} /> 
  },
  { 
    title: 'Fluent AppBuilder API', 
    description: 'Orchestrates system configurations and modules programmatically using an explicit, strongly-typed fluent interface.', 
    icon: <Code size={24} /> 
  },
  { 
    title: 'Install what you need', 
    description: 'External utility drivers are lazy-loaded on demand via dynamic imports, keeping the runtime memory footprint lightweight.', 
    icon: <Package size={24} /> 
  },
  { 
    title: 'Distributed System Scale', 
    description: 'Engineered interchangeably to host high-concurrency cloud environments, distributed microservices, and monolithic topologies.', 
    icon: <Boxes size={24} /> 
  },
  { 
    title: 'CLI Scaffolding', 
    description: 'Automates directory topology generation and compile-time lint rules ensuring structural boundary enforcement across the workspace.', 
    icon: <Terminal size={24} /> 
  },
];

export default function Home(): JSX.Element {
  return (
    <Layout 
      title="Xeno — Multi-Tenant DDD & CQRS Accelerator" 
      description="Architectural accelerator and agnostically decoupled TypeScript execution kernel for high-performance applications."
    >
      
      {/* 1. Hero Section */}
      <header className={styles.heroBanner}>
        <div className="container">
          <img src="/img/logo.png" alt="Xeno Logo" style={{ borderRadius: '50%', width: '10rem' }} />
          <h1 className={styles.heroTitle}>Xeno</h1>
          <p className={styles.heroSubtitle}>
            A Backend Framework for Node.js and TypeScript.
          </p>
          <div className={styles.buttons}>
            <Link className={styles.btnPrimary} to="/docs/getting-started">
              Getting Started
            </Link>
            <Link className={styles.btnSecondary} to="https://github.com/Mattia-Carcione/xeno-js" rel="noopener noreferrer" target="_blank">
              Github
            </Link>
          </div>
        </div>
      </header>

      <main className="container">
        
        {/* 2. Problem Statement & Structural Drivers */}
        <section className={styles.sectionPadding}>
          <div className="container">
            <div className="text--center margin-bottom--xl">
              <h2>Engineered to Eliminate Structural Decay</h2>
              <p style={{ maxWidth: '750px', margin: '0 auto', color: '#6b7280' }}>
                Traditional runtime frameworks introduce ambient side effects, severe serverless cold-start latency, and boundary erosion. Xeno substitutes implicit meta-programming with concrete compile-time guardrails and deterministic request lifecycles.
              </p>
            </div>
            <div className="row">
              <HighLevelFeature 
                title="Concentric Layer Isolation" 
                description="Implements strict Layered Clean Architecture boundaries (Domain, Application, Infrastructure, Presentation). Data flow constraints are validated statically at compile time to decouple corporate policies from platform code."
                icon={<Layers size={28} />}
              />
              <HighLevelFeature 
                title="Zero-Magic Performance" 
                description="Completely rejects runtime annotations, module proxies, and metadata reflection. The code written by the engineer is exactly the code that executes, optimizing cold starts for serverless and edge environments."
                icon={<Zap size={28} />}
              />
              <HighLevelFeature 
                title="Deterministic Failure Handling" 
                description="Strips the codebase of unpredictable runtime exception throwing by routing all operational outcomes across software layers through an explicit, strongly typed functional Result monad pattern."
                icon={<Cpu size={28} />}
              />
            </div>
          </div>
        </section>

        {/* 3. Core Architectural Subsystems Overview */}
        <section className={styles.servicesSection}>
          <div className="container">
            <div className="text--center margin-bottom--xl">
              <h2>Distributed Infrastructure</h2>
              <p style={{ maxWidth: '650px', margin: '0 auto', color: '#6b7280' }}>
                Xeno provides the essential infrastructure to build scalable, robust systems. Leverage software engineering while keeping your domain logic pure and portable.
              </p>
            </div>
    
            <div className="row">
              {coreServices.map((service, idx) => (
                <ServiceGridItem 
                  key={idx} 
                  title={service.title} 
                  description={service.description} 
                  icon={service.icon} 
                />
              ))}
            </div>
          </div>
        </section>

        {/* 4. Open Source & Project Maintenance */}
        <section className={styles.sectionPadding}>
          <div className={styles.supportSection}>
            <h2>Support Xeno</h2>
            <p>Xeno is an open-source, MIT-licensed project developed independently. Financial support helps guarantee active development, routine maintenance, and long-term project stability.</p>
            <Link 
              className={styles.btnPrimary} 
              style={{ backgroundColor: '#fff', color: '#000', borderColor: '#fff' }} 
              to="https://buymeacoffee.com/xenojs"
              rel="noopener noreferrer" 
              target="_blank"
            >
              Support
            </Link>
          </div>
        </section>
        
        <hr className={styles.divider} />

        {/* 5. Strategic Context & Technical Inquiries */}
        <section className={styles.contactSection}>
          <div className="container">
            <h2>Get in touch!</h2>
            <p style={{ maxWidth: '650px', margin: '0 auto', color: '#6b7280' }}>
              Have an idea for a partnership, need support for your team, 
              or want to discuss integrating Xeno into your architecture? I'm always open 
              to strategic discussions.
            </p>
            
            <Link className={styles.btnPrimary} style={{ marginTop: '1.5rem' }} to="mailto:xeno-js@outlook.it">
              Contact us
            </Link>
          </div>
        </section>
      </main>
    </Layout>
  );
}