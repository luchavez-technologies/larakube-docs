import React, { useState, useEffect } from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import useBaseUrl from '@docusaurus/useBaseUrl';

import styles from './index.module.css';
import HexagonGrid from '../components/HexagonGrid';
import TerminalUI from '../components/TerminalUI';
import EcosystemCarousel from '../components/EcosystemCarousel';
import GeminiTerminal from '../components/GeminiTerminal';

function HomepageHeader() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <header className={styles.heroBanner}>
      <HexagonGrid />
      <div className="container" style={{position: 'relative', zIndex: 1}}>
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
  const fullText = 'curl -s https://larakube.luchtech.dev/install.sh | bash';
  const [displayText, setDisplayText] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let timeoutId;
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
          <span className={styles.terminalPrompt}>{'>'}</span>
          <span className={styles.terminalTypewriter}>
            {displayText}
            <span className={styles.terminalCursor}></span>
          </span>
        </div>
      </div>
    </div>
  );
}

export default function Home(): React.JSX.Element {
  const {siteConfig} = useDocusaurusContext();

  return (
    <Layout
      title={`Welcome to ${siteConfig.title}`}
      description="Professional Kubernetes Orchestration for Laravel Developers">
      <HomepageHeader />
      
      <main>
        {/* Core Pillars */}
        <section className={clsx(styles.section, styles.pillarSection)}>
          <div className="container">
            <div className={styles.schematicGrid}>
              <div className={styles.schematicNode}>
                <div className={styles.schematicHex}>
                  <span className={styles.hexEmoji}>📦</span>
                </div>
                <Heading as="h3">Zero-Host Dependency</Heading>
                <p>
                  Orchestrate everything inside isolated, professional containers. 
                  Keep your host machine factory-original.
                </p>
              </div>

              <div className={styles.schematicNode}>
                <div className={styles.schematicHex}>
                  <span className={styles.hexEmoji}>🤖</span>
                </div>
                <Heading as="h3">AI-Native DNA</Heading>
                <p>
                  Built-in MCP tools and natural language commands allow AI agents 
                  to manage your cluster.
                </p>
              </div>

              <div className={styles.schematicNode}>
                <div className={styles.schematicHex}>
                  <span className={styles.hexEmoji}>💎</span>
                </div>
                <Heading as="h3">Absolute Parity</Heading>
                <p>
                  Run the exact same k3s-based infrastructure locally that you 
                  deploy to production cloud clusters.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* AI-Native Showcase */}
        <section className={styles.section}>
          <div className="container">
            <div className="row align-items-center">
              <div className="col col--6">
                <span className={styles.techLabel}>Model Context Protocol</span>
                <Heading as="h2" style={{fontSize: '3.5rem', marginBottom: '2rem'}}>AI-Native Orchestration</Heading>
                <p style={{fontSize: '1.3rem', opacity: 0.8, lineHeight: '1.8', marginBottom: '3rem'}}>
                  <b>LaraKube CLI</b> isn't just a tool; it's a teammate. We've built <b>MCP</b> directly into the core, 
                  allowing AI agents to see, diagnose, and manage your cluster using plain English.
                </p>
                <div className={styles.doctorCard}>
                  <h4 style={{fontSize: '1.5rem', color: 'var(--ifm-color-primary)', marginBottom: '1rem'}}>The Intelligent Doctor</h4>
                  <p style={{opacity: 0.8, fontSize: '1.1rem'}}>Run <code className={styles.inlineCode}>larakube doctor --ai</code> to have an expert agent analyze pod logs and events to provide instant, actionable fixes.</p>
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

        {/* Interactive Chat Showcase */}
        <section className={styles.section}>
          <div className="container">
            <div className={clsx('row align-items-center', styles.reverseMobile)}>
              <div className="col col--6">
                <div className={styles.desktopOnly}>
                  <TerminalUI />
                </div>
                <div className={styles.mobileOnly}>
                  <img src={useBaseUrl('/larakube-chat.png')} className={styles.showcaseImage} alt="LaraKube CLI Chat" />
                </div>
              </div>
              <div className={clsx('col col--6', styles.desktopOnlyPadding)}>
                <span className={styles.techLabel}>Interactive Intelligence</span>
                <Heading as="h2" style={{fontSize: '3.5rem', marginBottom: '2rem'}}>Chat with your Cluster</Heading>
                <p style={{fontSize: '1.3rem', opacity: 0.8, lineHeight: '1.8', marginBottom: '3rem'}}>
                  No more memorizing complex kubectl flags. Use <code className={styles.inlineCode}>larakube chat</code> to plan architectural changes 
                  or troubleshoot issues using the most intuitive interface ever built: <b>Conversation.</b>
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Laravel Ecosystem Grid */}
        <section className={clsx(styles.section, styles.sectionDark)}>
          <div className="container">
            <div className={styles.textCenter}>
              <Heading as="h2" style={{fontSize: '3.5rem'}}>🐘 Hardened for the Ecosystem</Heading>
              <p style={{fontSize: '1.4rem', opacity: 0.8, marginBottom: '2rem'}}>Professional-grade manifests for the tools you love.</p>
            </div>

            <EcosystemCarousel />
            </div>
            </section>


        {/* Contributions Section */}
        <section className={styles.contributeSection}>
          <div className="container">
            <div className={styles.textCenter}>
              <span className={styles.techLabel}>Open Source</span>
              <Heading as="h2" style={{fontSize: '3.5rem'}}>Shape the Future</Heading>
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
        <section className={styles.section}>
          <div className="container">
            <div className={styles.architectSection}>
              <div className="row align-items-center">
                <div className={clsx("col col--12", styles.makerContent)}>
                  <span className={styles.techLabel}>The Maker</span>
                  <Heading as="h2" style={{fontSize: '3rem', marginBottom: '1.5rem'}}>Built by a developer, for developers</Heading>
                  
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
          </div>
        </section>

        {/* Final CTA */}
        <section className={styles.section} style={{textAlign: 'center', background: '#000', color: 'white'}}>
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
