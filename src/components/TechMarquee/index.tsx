import React from 'react';
import styles from './styles.module.css';

const TECHS = [
  { name: 'Laravel', icon: '/icons/laravel.svg', color: '#FF2D20' },
  { name: 'FrankenPHP', icon: '/icons/frankenphp.svg', color: '#390075' },
  { name: 'MySQL', icon: '/icons/mysql.svg', color: '#4479A1' },
  { name: 'MariaDB', icon: '/icons/mariadb.svg', color: '#003545' },
  { name: 'PostgreSQL', icon: '/icons/postgres.svg', color: '#4169E1' },
  { name: 'MongoDB', icon: '/icons/mongodb.svg', color: '#47A248' },
  { name: 'Redis', icon: '/icons/redis.svg', color: '#DC382D' },
  { name: 'Memcached', icon: '/icons/memcached.svg', color: '#40B5AD' },
  { name: 'MinIO', icon: '/icons/minio.svg', color: '#C72E49' },
  { name: 'SeaweedFS', icon: '/icons/seaweedfs.svg', color: '#005dad' },
  { name: 'Garage', icon: '/icons/garage.svg', color: '#FF9000' },
  { name: 'Meilisearch', icon: '/icons/meilisearch.svg', color: '#FF5900' },
  { name: 'Typesense', icon: '/icons/typesense.svg', color: '#008a44' },
  { name: 'Livewire', icon: '/icons/livewire.svg', color: '#FB70A9' },
  { name: 'React', icon: '/icons/react.svg', color: '#61DAFB' },
  { name: 'Vue.js', icon: '/icons/vue.svg', color: '#4FC08D' },
  { name: 'Svelte', icon: '/icons/svelte.svg', color: '#FF3E00' },
  { name: 'Filament', icon: '/icons/filament.jpg', color: '#FBBF24' },
  { name: 'Tailwind', icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v13/icons/tailwindcss.svg', color: '#06B6D4' },
  { name: 'Kubernetes', icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v13/icons/kubernetes.svg', color: '#326CE5' },
  { name: 'Docker', icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v13/icons/docker.svg', color: '#2496ED' },
  { name: 'Traefik', icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v13/icons/traefikproxy.svg', color: '#24A1C1' },
];

export default function TechMarquee() {
  const allTechs = [...TECHS, ...TECHS, ...TECHS]; // Loop for infinite scroll

  return (
    <div className={styles.marqueeContainer}>
      <div className={styles.marqueeTrack}>
        {allTechs.map((tech, i) => (
          <div key={i} className={styles.techItem} style={{'--brand-color': tech.color} as React.CSSProperties}>
            <div className={styles.techLogo}>
              <img src={tech.icon} alt={tech.name} title={tech.name} />
            </div>
            <span className={styles.techName}>{tech.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
