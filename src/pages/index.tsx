import React from 'react';
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
  Terminal 
} from 'lucide-react'; 

function Feature({ title, description, icon }) {
  return (
    <div className="col" style={{ padding: '1rem' }}>
      <div className={styles.featureCard}>
        <div className={styles.iconWrapper}>{icon}</div>
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
    </div>
  );
}

const services = [
  { title: '100% Agnostic', description: 'Business logic independent from transport layers. Swap infrastructure, not your core domain.', icon: <LinkIcon size={32} /> },
  { title: 'Type Safety', description: 'Built with TypeScript from the ground up. Enjoy full autocompletion and robust type inference.', icon: <ShieldCheck size={32} /> },
  { title: 'Enterprise Patterns', description: 'Native support for CQRS, resilience, and idempotency patterns out of the box.', icon: <Settings size={32} /> },
  { title: 'DI with Injection Tokens', description: 'Maintain a clean dependency graph using unique tokens, ensuring stability and testability.', icon: <Container size={32} /> },
  { title: 'Fluent API', description: 'Configure your architecture with an elegant, readable, and strongly-typed AppBuilder.', icon: <Code size={32} /> },
  { title: 'Install what you need', description: 'Keep your bundle lean with optional peer dependencies. Only pay for what you use.', icon: <Package size={32} /> },
  { title: 'Microservices/ Web Apps', description: 'Engineered for flexibility. Seamlessly scale from high-performance APIs and Web Apps to complex Microservice ecosystems.', icon: <Boxes size={32} /> },
  { title: 'CLI Scaffolding', description: 'Boost productivity with our CLI. Generate pre-configured, production-ready templates.', icon: <Terminal size={32} /> },
];

export default function Home() {
  return (
    <Layout title="Graviton5" description="Enterprise-grade TypeScript accelerator">
      
      {/* Hero Section */}
      <header className={styles.heroBanner}>
        <div className="container">
          <h1>Graviton5</h1>
          <p>The production-ready TypeScript accelerator for high-performance enterprise APIs.</p>
          <div className={styles.buttons}>
            <Link className={styles.btnPrimary} to="/docs/introduction">Documentation</Link>
            <Link className={styles.btnSecondary} to="https://github.com/Mattia-Carcione/Graviton5">Repository</Link>
          </div>
        </div>
      </header>

      <main className="container">
        {/* 3 Columns Section */}
        <section className={styles.sectionPadding}>
          <div className="container">
            <div className="row">
              <Feature 
                title="Flexibility" 
                description="Customization is the core. Graviton5 acts as a flexible kernel, empowering you to shape the architecture to your specific needs, rather than being forced to adapt to the framework."
                icon={
                  <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                }
              />
              <Feature 
                title="Versatility" 
                description="Perfectly suited for any server environment. From Fastify to Edge runtimes, Graviton5 provides the execution pipelines while leaving you free to choose your preferred transport layer."
                icon={
                  <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"></path></svg>
                }
              />
              <Feature 
                title="Zero Magic" 
                description="Forget heavy decorators and hidden reflection logic. Graviton5 uses explicit, type-safe builders for transparent performance and a codebase that is straightforward to debug."
                icon={
                  <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                }
              />
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section className={styles.servicesSection}>
          <div className="container">
            <div className="text--center margin-bottom--xl">
              <h2>Enterprise-ready, without reinventing the wheel</h2>
              <p style={{ maxWidth: '600px', margin: '0 auto', color: '#6b7280' }}>
                Graviton5 provides the essential infrastructure to build scalable, robust systems. 
                Leverage enterprise-grade patterns while keeping your domain logic pure and portable.
              </p>
            </div>
    
            <div className="row">
              {services.map((service, idx) => (
                <div key={idx} className="col col--3 margin-bottom--lg">
                  <div className={styles.serviceCard}>
                    <div className={styles.iconWrapper}>{service.icon}</div>
                    <h4>{service.title}</h4>
                    <p>{service.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>


        {/* Support Section */}
        <section className={styles.sectionPadding}>
          <div className={styles.supportSection}>
            <h2>Support Graviton5</h2>
            <p>Graviton5 is built in my spare time. Your support helps keep this project independent and actively maintained.</p>
            <Link className={styles.btnPrimary} style={{ backgroundColor: '#fff', color: '#000', borderColor: '#fff' }} to="https://buymeacoffee.com/graviton5">
              Support
            </Link>
          </div>
        </section>
        
        <hr className={styles.divider} />

        {/* Contact Section */}
        <section className={styles.contactSection}>
          <div className="container">
            <h2>Get in Touch</h2>
            <p style={{ maxWidth: '600px', margin: '0 auto', color: '#6b7280' }}>
              Have an idea for a partnership, need enterprise-grade support for your team, 
              or want to discuss integrating Graviton5 into your architecture? I'm always open 
              to strategic discussions.
            </p>
            
            <Link className={styles.btnPrimary} style={{ marginTop: '1.5rem' }} to="mailto:graviton5@outlook.it">
              Contact us
            </Link>
          </div>
        </section>
      </main>
    </Layout>
  );
}