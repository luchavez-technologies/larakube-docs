import React from 'react';
import styles from './styles.module.css';
import Heading from '@theme/Heading';

const ecosystemItems = [
  { title: "Octane & FrankenPHP", icon: '/icons/frankenphp.svg', color: '#390075', description: "In-memory performance with native backend watching and zero-downtime rolls." },
  { title: "Horizon & Redis", icon: '/icons/horizon.svg', color: '#4051B5', description: "Isolated queue workers with automated Redis integration and health probes." },
  { title: "Filament PHP", icon: '/icons/filament.jpg', color: '#FBBF24', description: "Production-grade admin panels with automated sidecar databases and S3 storage." },
  { title: "Scout Search", icon: '/icons/meilisearch.svg', color: '#FF5900', description: "Instant search with Meilisearch or Typesense sidecars and secure master keys." },
];

const EcosystemCarousel: React.FC = () => {
  // Duplicate items for infinite scroll (3 sets to keep the track full)
  const allItems = [...ecosystemItems, ...ecosystemItems, ...ecosystemItems];

  return (
    <div className={styles.carouselContainer}>
      <div className={styles.carouselTrack}>
        {allItems.map((item, index) => (
          <div key={index} className={styles.carouselCard} style={{'--brand-color': item.color} as React.CSSProperties}>
            <div className={styles.carouselIcon}>
              <img src={item.icon} alt={item.title} />
            </div>
            <Heading as="h3" style={{ fontSize: '1.4rem', marginBottom: '1rem' }}>{item.title}</Heading>
            <p style={{ opacity: 0.7, fontSize: '0.9rem', margin: 0 }}>{item.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EcosystemCarousel;
