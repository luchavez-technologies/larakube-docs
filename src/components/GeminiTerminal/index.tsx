import React, { useState, useEffect } from 'react';
import styles from './styles.module.css';

const prompts = [
  "Analyze the pod logs for my octane application.",
  "Why is the redis pod not starting correctly?",
  "Apply a healing patch for the storage permissions.",
  "Scale my horizon workers to 5 replicas.",
  "Search the LaraKube docs for FrankenPHP setup."
];

const GeminiTerminal: React.FC = () => {
  const [currentText, setCurrentText] = useState('');
  const [promptIndex, setPromptIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [typingSpeed, setTypingSpeed] = useState(80);

  useEffect(() => {
    const handleTyping = () => {
      const fullText = prompts[promptIndex];
      
      if (!isDeleting) {
        setCurrentText(fullText.substring(0, currentText.length + 1));
        setTypingSpeed(80);

        if (currentText === fullText) {
          setTimeout(() => setIsDeleting(true), 2500);
        }
      } else {
        setCurrentText(fullText.substring(0, currentText.length - 1));
        setTypingSpeed(30);

        if (currentText === '') {
          setIsDeleting(false);
          setPromptIndex((prev) => (prev + 1) % prompts.length);
        }
      }
    };

    const timer = setTimeout(handleTyping, typingSpeed);
    return () => clearTimeout(timer);
  }, [currentText, isDeleting, promptIndex, typingSpeed]);

  return (
    <div className={styles.terminal}>
      <div className={styles.terminalHeader}>
        <div className={styles.terminalButtons}>
          <span className={styles.dot} style={{ background: '#ff5f56', borderColor: '#e0443e' }}></span>
          <span className={styles.dot} style={{ background: '#ffbd2e', borderColor: '#dea123' }}></span>
          <span className={styles.dot} style={{ background: '#27c93f', borderColor: '#1aab29' }}></span>
        </div>
        <div className={styles.terminalTitle}>📁 jsluchavez — 💠 Ready — gemini-cli — 98x39</div>
      </div>
      <div className={styles.terminalBody}>
        <div className={styles.topInfo}>
          <div className={styles.geminiLogo}>
             <div className={styles.logoRow}>
               <span className={styles.logoBlock} style={{ background: '#4285f4' }}></span>
               <span className={styles.logoBlock} style={{ background: '#4285f4', opacity: 0.6 }}></span>
             </div>
             <div className={styles.logoRow}>
               <span className={styles.logoBlock} style={{ background: '#ea4335' }}></span>
               <span className={styles.logoBlock} style={{ background: '#fbbc05' }}></span>
             </div>
          </div>
          <div className={styles.headerText}>
            <div className={styles.titleLine}><strong>Gemini CLI</strong> v0.38.1</div>
            <div className={styles.infoLine}><strong>Signed in with Google</strong> /auth</div>
            <div className={styles.infoLine}><strong>Plan:</strong> Gemini Code Assist in Google One AI Pro /upgrade</div>
          </div>
        </div>

        <div className={styles.mcpSection}>
          <div className={styles.mcpCommand}>{">"} /mcp</div>
          <div className={styles.mcpTitle}>Configured MCP servers:</div>
          <div className={styles.mcpServer}>
            <span className={styles.greenDot}>●</span> <strong>larakube</strong> - Ready (8 tools)
          </div>
          <div className={styles.mcpTools}>
            - mcp_larakube_apply_healing_patch<br />
            - mcp_larakube_diagnose_pod<br />
            - mcp_larakube_execute_command<br />
            - mcp_larakube_get_command_help<br />
            - mcp_larakube_get_project_config<br />
            - mcp_larakube_list_commands<br />
            - mcp_larakube_list_pods<br />
            - mcp_larakube_search_documentation
          </div>
        </div>

        <div className={styles.typingSection}>
          <div className={styles.typingLabel}>Shift+Tab to accept edits</div>
          <div className={styles.promptLine}>
            <span className={styles.promptArrow}>{">"}</span>
            <span className={styles.cursorBlock}></span>
            <span className={currentText === '' ? styles.placeholder : styles.typingContent}>
               {currentText === '' ? ' Type your message or @path/to/file' : currentText}
            </span>
          </div>
        </div>

        <div className={styles.statusBar}>
          <div className={styles.statusCol}>
            <div className={styles.statusHeader}>workspace (/directory)</div>
            <div className={styles.statusValue}>~</div>
          </div>
          <div className={styles.statusCol}>
            <div className={styles.statusHeader}>sandbox</div>
            <div className={styles.statusValue} style={{ color: '#ef4444' }}>no sandbox</div>
          </div>
          <div className={styles.statusCol}>
            <div className={styles.statusHeader}>/model</div>
            <div className={styles.statusValue}>Auto (Gemini 3)</div>
          </div>
          <div className={styles.statusCol}>
            <div className={styles.statusHeader}>memory</div>
            <div className={styles.statusValue}>132.0 MB</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GeminiTerminal;
