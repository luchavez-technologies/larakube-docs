import React from 'react';
import clsx from 'clsx';
import styles from './styles.module.css';

interface TierCardProps {
  icon: string;
  sub: string;
  price: string;
  period?: string;
  features: string[];
  isHighlighted?: boolean;
}

const TierCard: React.FC<TierCardProps> = ({ icon, sub, price, period, features, isHighlighted }) => (
  <div className={clsx(styles.tierCard, isHighlighted && styles.tierHighlight)}>
    {isHighlighted && <div className={styles.popularBadge}>Production Ready</div>}
    
    <div className={styles.header}>
      <div className={styles.tierIcon}>{icon}</div>
      <span className={styles.tierTitle}>{sub}</span>
    </div>

    <div className={styles.priceBox}>
      <span className={styles.price}>{price}</span>
      {period && <span className={styles.period}>{period}</span>}
    </div>

    <ul className={styles.featureList}>
      <li className={styles.featureItem}>
        <span className={styles.checkIcon}>✓</span>
        <span><strong className={styles.featureMain}>One Blueprint</strong> (.larakube.json)</span>
      </li>
      {features.map((feature, index) => (
        <li key={index} className={styles.featureItem}>
          <span className={styles.checkIcon}>✓</span>
          <span>{feature}</span>
        </li>
      ))}
    </ul>
  </div>
);

const GraduationPath: React.FC = () => {
  return (
    <div className={styles.pathContainer}>
      <div className={styles.tierGrid}>
        <TierCard 
          icon="💻"
          sub="Local Development"
          price="$0"
          period="/mo"
          features={[
            "100% Production Parity",
            "Zero Host Dependencies",
            "K3d Cluster Local",
            "Instant Feedback"
          ]}
        />
        
        <TierCard 
          icon="🚀"
          sub="Single-Node Hero"
          price="~$4-12"
          period="/mo"
          isHighlighted={true}
          features={[
            "High-Performance VPS",
            "Automated SSL (Traefik)",
            "Server-Side Builds",
            "GitHub Actions CI/CD"
          ]}
        />
        
        <TierCard 
          icon="🌎"
          sub="Managed K8s"
          price="Scale"
          period="with usage"
          features={[
            "DOKS / GKE / EKS",
            "High Availability",
            "Rolling Zero-Downtime",
            "Global Redundancy"
          ]}
        />
      </div>
    </div>
  );
};

export default GraduationPath;
