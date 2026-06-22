import React, { useState, useEffect, useCallback } from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import useBaseUrl from '@docusaurus/useBaseUrl';

import styles from './index.module.css';
import HexagonGrid from '../components/HexagonGrid';
import EcosystemCarousel from '../components/EcosystemCarousel';
import GeminiTerminal from '../components/GeminiTerminal';
import ArchitectureBuilder from '../components/ArchitectureBuilder';
import TechMarquee from '../components/TechMarquee';
import GraduationPath from '../components/GraduationPath';

const AnchorLink = ({ id, title }: { id: string, title: string }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    const url = `${window.location.origin}${window.location.pathname}#${id}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    window.history.pushState(null, '', `#${id}`);
    setTimeout(() => setCopied(false), 2000);
  }, [id]);

  return (
    <a 
      className={clsx(styles.anchorLink, copied && styles.anchorLinkActive)} 
      href={`#${id}`} 
      onClick={handleCopy}
      title={copied ? 'Copied URL!' : title}
    >
      {copied ? '✓' : '#'}
    </a>
  );
};

function HomepageHeader() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <header className={styles.heroBanner}>
      <HexagonGrid />
      <div className="container" style={{position: 'relative', zIndex: 1}}>
        <Link
          className={styles.heroBadge}
          to="https://github.com/luchavez-technologies/larakube-cli">
          <svg viewBox="0 0 16 16" width="16" height="16" fill="currentColor" aria-hidden="true">
            <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
          </svg>
          Free &amp; Open Source
        </Link>
        <br />
        <img
          src={useBaseUrl('/img/larakube-logo.svg')}
          alt="LaraKube CLI Logo"
          className={styles.heroLogo}
        />
        <Heading as="h1" className={styles.heroTitle}>
          {siteConfig.title}
        </Heading>
        <p className={styles.heroSubtitle}>
          Industrial-strength Kubernetes orchestration for the modern Laravel Architect. 
          Zero host dependencies. Production-grade stability. AI-native DNA.
        </p>
        <div className={styles.buttons}>
          <Link
            className={clsx('button button--lg', styles.heroButton, styles.primaryButton)}
            to="/docs">
            Get Started 🚀
          </Link>
          <Link
            className={clsx('button button--lg', styles.heroButton, styles.secondaryButton)}
            to="/blog">
            Read the Blog ✍️
          </Link>
          <Link
            className={clsx('button button--lg', styles.heroButton, styles.discordButton)}
            to="https://discord.gg/g2pFhpEh9G">
            Join Discord 💬
          </Link>
        </div>
      </div>
    </header>
  );
}

function TypingTerminal() {
  const fullText = 'curl -fsSL https://cli.larakube.app/install.sh | bash';
  const [displayText, setDisplayText] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;
    let index = 0;

    const runAnimation = () => {
      if (index <= fullText.length) {
        setDisplayText(fullText.substring(0, index));
        index++;
        timeoutId = setTimeout(runAnimation, 50);
      } else {
        // Wait 10 seconds after finished typing, then reset and repeat
        timeoutId = setTimeout(() => {
          index = 0;
          runAnimation();
        }, 10000);
      }
    };

    runAnimation();
    return () => clearTimeout(timeoutId);
  }, []);

  const handleCopy = () => {
    navigator.clipboard.writeText(fullText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div 
      className={clsx(styles.naturalTerminal, copied && styles.terminalCopied)} 
      onClick={handleCopy}
      title="Click to copy command"
    >
      <div className={styles.terminalHeader}>
        <div className={styles.terminalButtons}>
          <span className={styles.dot} style={{ background: '#ff5f56' }}></span>
          <span className={styles.dot} style={{ background: '#ffbd2e' }}></span>
          <span className={styles.dot} style={{ background: '#27c93f' }}></span>
        </div>
        <div className={styles.terminalTitle}>📁 larakube — install</div>
        {copied && <div className={styles.copiedIndicator}>Copied! ✨</div>}
      </div>
      <div className={styles.terminalBody}>
        <div className={styles.terminalContent}>
          <span className={styles.terminalTypewriter}>
            {displayText}
            <span className={styles.terminalCursor}></span>
          </span>
        </div>
      </div>
    </div>
  );
}

function TechItem({ name, icon }: { name: string, icon: string }) {
  const isEmoji = !icon.startsWith('http') && !icon.includes('.');
  return (
    <li className={styles.techItem}>
      <span className={styles.techIcon}>
        {isEmoji ? (
          <span style={{fontSize: '1.2rem'}}>{icon}</span>
        ) : (
          <img src={icon} alt={`${name} logo`} />
        )}
      </span>
      {name}
    </li>
  );
}

export default function Home(): React.JSX.Element {
  const {siteConfig} = useDocusaurusContext();

  const si = (name: string) => `https://cdn.jsdelivr.net/npm/simple-icons@v13/icons/${name}.svg`;

  return (
    <Layout
      title="Industrial-Strength Kubernetes Orchestrator for Laravel"
      description="Deploy Laravel to Kubernetes with zero host dependencies. AI-native orchestration, professional-grade stability, and industrial-strength automation.">
      <HomepageHeader />
      
      <main>
        {/* Free / Open / Yours + Core Pillars (merged) */}
        <section id="open-and-yours" className={styles.section}>
          <div className="container">
            <div className={styles.textCenter}>
              <span className={styles.techLabel}>No Catch</span>
              <div className={clsx(styles.headingWrapper, styles.headingWrapperCentered)}>
                <Heading as="h2" style={{fontSize: '3.5rem'}}>Free, open, and entirely yours</Heading>
                <AnchorLink id="open-and-yours" title="Direct link to this section" />
              </div>
              <p style={{fontSize: '1.4rem', opacity: 0.8, marginBottom: '2rem'}}>
                A generator you run on infrastructure you own — not a platform you rent.
              </p>
            </div>

            <div className={styles.schematicGrid}>
              <div className={styles.schematicNode}>
                <div className={styles.schematicHex}>
                  <span className={styles.hexEmoji}>🆓</span>
                </div>
                <Heading as="h3">Free &amp; Open Source</Heading>
                <p>
                  100% free and <Link to="https://github.com/luchavez-technologies/larakube-cli">open source on GitHub</Link>.
                  No subscription, no per-seat pricing, no usage fees, no hidden costs—the CLI is the whole product.
                </p>
              </div>

              <div className={styles.schematicNode}>
                <div className={styles.schematicHex}>
                  <span className={styles.hexEmoji}>📄</span>
                </div>
                <Heading as="h3">A Generator, Not a Lock-In</Heading>
                <p>
                  It writes standard Kubernetes manifests and Dockerfiles into <em>your</em> repo. The output is plain
                  YAML and Docker that runs <b>with or without</b> LaraKube—nothing phones home, and nothing runs in
                  your cluster on our behalf.
                </p>
              </div>

              <div className={styles.schematicNode}>
                <div className={styles.schematicHex}>
                  <span className={styles.hexEmoji}>🔑</span>
                </div>
                <Heading as="h3">You Own Everything</Heading>
                <p>
                  Deploy to your own cloud account, your servers, your data—you pay the provider directly. There's no
                  LaraKube platform in the middle, and nothing to migrate off if you walk away.
                </p>
              </div>

              <div className={styles.schematicNode}>
                <div className={styles.schematicHex}>
                  <span className={styles.hexEmoji}>🚀</span>
                </div>
                <Heading as="h3">Standalone Engine</Heading>
                <p>
                  A self-contained binary with its own embedded PHP runtime—zero
                  dependencies on your host machine, just pure orchestration.
                </p>
              </div>

              <div className={styles.schematicNode}>
                <div className={styles.schematicHex}>
                  <span className={styles.hexEmoji}>💾</span>
                </div>
                <Heading as="h3">Shared Storage</Heading>
                <p>
                  True Workload Parity with shared volumes across Web, Worker, and
                  Scheduler pods—synchronized state, zero friction.
                </p>
              </div>

              <div className={styles.schematicNode}>
                <div className={styles.schematicHex}>
                  <span className={styles.hexEmoji}>🔌</span>
                </div>
                <Heading as="h3">Proxy-First Workflow</Heading>
                <p>
                  Run <code className={styles.inlineCode}>artisan</code>, <code className={styles.inlineCode}>composer</code>, and <code className={styles.inlineCode}>npm</code> straight
                  through the CLI—commands run inside the cluster as if they were local.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* AI-Native Showcase */}
        <section id="ai-native" className={styles.section}>
          <div className="container">
            <div className="row align-items-center">
              <div className="col col--6">
                <span className={styles.techLabel}>Model Context Protocol</span>
                <div className={styles.headingWrapper}>
                  <Heading as="h2" style={{fontSize: '3.5rem'}}>Dual-MCP Intelligence</Heading>
                  <AnchorLink id="ai-native" title="Direct link to this section" />
                </div>
                <p style={{fontSize: '1.3rem', opacity: 0.8, lineHeight: '1.8', marginBottom: '3rem'}}>
                  LaraKube is the first AI-native orchestrator. We've built <b>MCP</b> directly into the ecosystem, providing your AI agents with professional-grade tools to manage your entire Kubernetes fleet.
                </p>
                
                <div className={styles.mcpComparison} style={{marginTop: '2rem'}}>
                  <div style={{marginBottom: '2rem'}}>
                    <Heading as="h4" style={{color: 'var(--ifm-color-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
                      🛠️ The Local Mechanic (CLI)
                    </Heading>
                    <p style={{fontSize: '1.1rem', opacity: 0.8, marginLeft: '1.8rem'}}>
                      Your <b>Hands</b>. Project-scoped tools for surgical code edits, blueprint patching, and orchestration execution directly on your local machine.
                    </p>
                  </div>
                  <div>
                    <Heading as="h4" style={{color: 'var(--ifm-color-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
                      🧠 The Master Architect (Console)
                    </Heading>
                    <p style={{fontSize: '1.1rem', opacity: 0.8, marginLeft: '1.8rem'}}>
                      Your <b>Eyes</b>. Cluster-wide observability providing real-time fleet health, diagnostic logs, and historical context for intelligent root-cause analysis.
                    </p>
                  </div>
                </div>
              </div>
              <div className="col col--6">
                <div className={styles.desktopOnly}>
                  <GeminiTerminal />
                </div>
                <div className={styles.mobileOnly}>
                  <img src={useBaseUrl('/larakube-mcp.png')} className={styles.showcaseImage} alt="LaraKube CLI MCP" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Scaling Roadmap */}
        <section id="scaling-roadmap" className={styles.section}>
          <div className="container">
            <div className={styles.textCenter}>
              <span className={styles.techLabel}>Scale Journey</span>
              <div className={clsx(styles.headingWrapper, styles.headingWrapperCentered)}>
                <Heading as="h2" style={{fontSize: '3.5rem'}}>The Scaling Roadmap</Heading>
                <AnchorLink id="scaling-roadmap" title="Direct link to this section" />
              </div>
              <p style={{fontSize: '1.4rem', opacity: 0.8}}>Same Blueprint, Different Scale. From your laptop to global infrastructure.</p>
            </div>

            <GraduationPath />
          </div>
        </section>

        {/* Laravel Ecosystem Grid */}
        <section id="ecosystem" className={clsx(styles.section, styles.sectionDark)}>
          <div className="container">
            <div className={styles.textCenter}>
              <div className={clsx(styles.headingWrapper, styles.headingWrapperCentered)}>
                <Heading as="h2" style={{fontSize: '3.5rem'}}>🐘 Hardened for the Ecosystem</Heading>
                <AnchorLink id="ecosystem" title="Direct link to this section" />
              </div>
              <p style={{fontSize: '1.4rem', opacity: 0.8, marginBottom: '2rem'}}>Professional-grade manifests for the tools you love.</p>
            </div>

            <EcosystemCarousel />
          </div>
        </section>

        {/* Supported Tech Marquee */}
        <section id="tech" className={clsx(styles.section, styles.sectionDark)}>
          <div className="container">
            <div className={styles.textCenter}>
              <div className={clsx(styles.headingWrapper, styles.headingWrapperCentered)}>
                <Heading as="h2" style={{fontSize: '3.5rem'}}>🏗 Supported Architecture</Heading>
                <AnchorLink id="tech" title="Direct link to this section" />
              </div>
              <p style={{fontSize: '1.4rem', opacity: 0.8}}>The professional foundation for your next masterpiece.</p>
            </div>

            <TechMarquee />
          </div>
        </section>


        {/* Architecture Designer */}
        <section id="design-your-masterpiece" className={styles.section}>
          <div className="container">
            <div className={styles.textCenter}>
              <span className={styles.techLabel}>Interactive Blueprinting</span>
              <div className={clsx(styles.headingWrapper, styles.headingWrapperCentered)}>
                <Heading as="h2" style={{fontSize: '3.5rem'}}>Design Your Masterpiece</Heading>
                <AnchorLink id="design-your-masterpiece" title="Direct link to this section" />
              </div>
              <p style={{fontSize: '1.4rem', opacity: 0.8}}>Select your components and generate your unique LaraKube command.</p>
            </div>

            <ArchitectureBuilder />
          </div>
        </section>

        {/* Contributions Section */}
        <section id="contribute" className={styles.contributeSection}>
          <div className="container">
            <div className={styles.textCenter}>
              <span className={styles.techLabel}>Open Source</span>
              <div className={clsx(styles.headingWrapper, styles.headingWrapperCentered)}>
                <Heading as="h2" style={{fontSize: '3.5rem'}}>Shape the Future</Heading>
                <AnchorLink id="contribute" title="Direct link to this section" />
              </div>
              <p style={{fontSize: '1.4rem', opacity: 0.8}}><b>LaraKube CLI</b> is built by the community. We'd love for you to be part of it.</p>
            </div>

            <div className={styles.contributeGrid}>
              <div className={styles.contributeCard}>
                <Heading as="h3">📚 Improve the Docs</Heading>
                <p style={{fontSize: '1.1rem', opacity: 0.7, marginBottom: '2rem'}}>Help us make Kubernetes more accessible. Fix a typo, add a tutorial, or improve our architectural guides.</p>
                <div className={styles.contributeActions}>
                  <Link className="button button--primary" href="https://github.com/luchavez-technologies/larakube-docs">Contribute to Docs</Link>
                </div>
              </div>
              <div className={styles.contributeCard}>
                <Heading as="h3">🛠 Harden the CLI</Heading>
                <p style={{fontSize: '1.1rem', opacity: 0.7, marginBottom: '2rem'}}>The core engine is written in PHP. Help us add new features, fix bugs, or optimize the orchestration logic.</p>
                <div className={styles.contributeActions}>
                  <Link className="button button--primary" href="https://github.com/luchavez-technologies/larakube-cli">Contribute to CLI</Link>
                </div>
              </div>
              <div className={styles.contributeCard}>
                <Heading as="h3">💬 Join the Conversation</Heading>
                <p style={{fontSize: '1.1rem', opacity: 0.7, marginBottom: '2rem'}}>Have questions? Want to share your "Masterpiece Blueprints"? Our community is here to help.</p>
                <div className={styles.contributeActions}>
                  <Link className={clsx('button', styles.discordButton)} href="https://discord.gg/g2pFhpEh9G">Join Discord</Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* The Human behind LaraKube CLI Section */}
        <section id="maker" className={styles.section}>
          <div className="container">
            <div className={styles.architectSection}>
              <div className={styles.makerContent}>
                <span className={styles.techLabel}>The Maker</span>
                <div className={clsx(styles.headingWrapper, styles.headingWrapperCentered)}>
                  <Heading as="h2" style={{fontSize: '3rem'}}>Built by a developer, for developers</Heading>
                  <AnchorLink id="maker" title="Direct link to this section" />
                </div>
                
                <p style={{fontSize: '1.25rem', lineHeight: '1.7'}}>
                  I built <b>LaraKube CLI</b> because, for a long time, Kubernetes felt like a wall I couldn't climb. 
                  I'm not a Kubernetes expert—I'm a student of it, building the tool I wish I had 
                  when I first encountered the complexity of cloud-native infrastructure.
                </p>
                <p style={{fontSize: '1.25rem', lineHeight: '1.7'}}>
                  <b>LaraKube CLI</b> is my journey of translating "Expert-Speak" into something we can all use 
                  to build robust applications. If you're also learning, I hope this tool makes your 
                  path a little smoother. Let's build something great together.
                </p>

                <div style={{marginTop: '2rem', marginBottom: '2rem'}}>
                  <Heading as="h3" style={{margin: 0}}>James Carlo Luchavez</Heading>
                  <p className={styles.makerTitle}>Systems Learner & Builder</p>
                </div>

                <div className={styles.buttons} style={{justifyContent: 'center', gap: '1rem', flexWrap: 'wrap'}}>
                  <Link className="button button--primary button--lg" style={{borderRadius: '100px'}} href="https://www.linkedin.com/in/luchaveztech/">Say Hello 👋 on LinkedIn</Link>
                  <Link className="button button--outline button--primary button--lg" style={{borderRadius: '100px'}} href="https://github.com/sponsors/luchavez-technologies">Sponsor 💖 on GitHub</Link>
                  <Link className="button button--outline button--primary button--lg" style={{borderRadius: '100px'}} href="https://github.com/luchavez-technologies/larakube-cli">View 🐙 on GitHub</Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className={clsx(styles.section, styles.ctaSection)}>
          <div className="container">
            <img 
              src={useBaseUrl('/img/larakube-logo.svg')} 
              alt="LaraKube CLI Logo" 
              style={{width: '120px', marginBottom: '3rem', filter: 'drop-shadow(0 0 30px var(--larakube-glow))'}} 
            />
            <Heading as="h2" style={{fontSize: '4rem', marginBottom: '1rem'}}>Ready to Orchestrate?</Heading>
            <p style={{fontSize: '1.6rem', opacity: '0.5', marginBottom: '4rem'}}>The future of professional Laravel development is here.</p>
            <TypingTerminal />
          </div>
        </section>
      </main>
    </Layout>
  );
}
