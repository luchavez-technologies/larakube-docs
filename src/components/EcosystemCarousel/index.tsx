import React from 'react';
import styles from './styles.module.css';
import Heading from '@theme/Heading';

const ecosystemItems = [
  { title: "Octane & FrankenPHP", icon: "⚡️", description: "In-memory performance with native backend watching and zero-downtime rolls." },
  { title: "Horizon & Redis", icon: "🏗", description: "Isolated queue workers with automated Redis integration and health probes." },
  { title: "Reverb", icon: "📡", description: "WebSocket scaling with automated Echo configuration and cluster-native Ingress." },
  { title: "Scout", icon: "🔍", description: "Instant search with Meilisearch or Typesense sidecars and secure master keys." },
];

const EcosystemCarousel: React.FC = () => {
  // Duplicate items for infinite scroll (3 sets to keep the track full)
  const allItems = [...ecosystemItems, ...ecosystemItems, ...ecosystemItems];

  return (
    <div className={styles.carouselContainer}>
      <div className={styles.carouselTrack}>
        {allItems.map((item, index) => (
          <div key={index} className={styles.carouselCard}>
            <span className={styles.carouselIcon}>{item.icon}</span>
            <Heading as="h3" style={{ fontSize: '1.4rem', marginBottom: '1rem' }}>{item.title}</Heading>
            <p style={{ opacity: 0.7, fontSize: '0.9rem', margin: 0 }}>{item.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EcosystemCarousel;
