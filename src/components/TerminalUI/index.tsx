import React, { useState, useEffect } from 'react';
import styles from './styles.module.css';

const questions = [
  "e.g., Create a new project called masterpiece...",
  "How do I add a MySQL database to my project?",
  "Can you scale my horizon workers to 3 replicas?",
  "Why is my FrankenPHP container not starting?",
  "How do I expose my local site via a dev.test domain?",
  "Trust the local CA certificate for this cluster."
];

const asciiLogo = `██       █████  ██████   █████  ██   ██ ██    ██ ██████  ███████ 
██      ██   ██ ██   ██ ██   ██ ██  ██  ██    ██ ██   ██ ██      
██      ███████ ██████  ███████ █████   ██    ██ ██████  █████   
██      ██   ██ ██   ██ ██   ██ ██  ██  ██    ██ ██   ██ ██      
███████ ██   ██ ██   ██ ██   ██ ██   ██  ██████  ██████  ███████`;

const TerminalUI: React.FC = () => {
  const [currentText, setCurrentText] = useState('');
  const [questionIndex, setQuestionIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [typingSpeed, setTypingSpeed] = useState(80);

  useEffect(() => {
    const handleTyping = () => {
      const fullText = questions[questionIndex];
      
      if (!isDeleting) {
        setCurrentText(fullText.substring(0, currentText.length + 1));
        setTypingSpeed(80);

        if (currentText === fullText) {
          setTimeout(() => setIsDeleting(true), 2000);
        }
      } else {
        setCurrentText(fullText.substring(0, currentText.length - 1));
        setTypingSpeed(30);

        if (currentText === '') {
          setIsDeleting(false);
          setQuestionIndex((prev) => (prev + 1) % questions.length);
        }
      }
    };

    const timer = setTimeout(handleTyping, typingSpeed);
    return () => clearTimeout(timer);
  }, [currentText, isDeleting, questionIndex, typingSpeed]);

  return (
    <div className={styles.terminal}>
      <div className={styles.terminalHeader}>
        <div className={styles.terminalButtons}>
          <span className={styles.dot} style={{ background: '#ff5f56', borderColor: '#e0443e' }}></span>
          <span className={styles.dot} style={{ background: '#ffbd2e', borderColor: '#dea123' }}></span>
          <span className={styles.dot} style={{ background: '#27c93f', borderColor: '#1aab29' }}></span>
        </div>
        <div className={styles.terminalTitle}>📁 jsluchavez — larakube chat — 70x20</div>
      </div>
      <div className={styles.terminalBody}>
        <div className={styles.loginText}>Last login: Wed Apr 22 19:33:03 on ttys016</div>
        <div className={styles.commandLine}>
          <span className={styles.promptText}>jsluchavez@adam-macbook-pro ~ %</span> larakube chat
        </div>
        
        <div className={styles.asciiArtContainer}>
          <pre className={styles.asciiArt}>{asciiLogo}</pre>
        </div>

        <div className={styles.banner}>
          THE PROFESSIONAL KUBERNETES ORCHESTRATOR FOR LARAVEL
        </div>

        <div className={styles.welcomeLine}>
          <span className={styles.larakubeBadge}>LARAKUBE</span>
          <span className={styles.welcomeMessage}>Welcome to LaraKube CLI Chat! How can I help you today?</span>
        </div>

        <fieldset className={styles.inputFieldset}>
          <legend className={styles.inputLegend}>You</legend>
          <span className={styles.typedText}>
            {currentText === '' ? '' : currentText}
          </span>
          <span className={styles.cursorBlock}></span>
        </fieldset>
      </div>
    </div>
  );
};

export default TerminalUI;
