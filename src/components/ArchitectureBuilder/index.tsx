import React, { useState, useMemo } from 'react';
import clsx from 'clsx';
import styles from './styles.module.css';
import Heading from '@theme/Heading';

interface Option {
  id: string;
  name: string;
  icon: string;
  color: string;
  category: string;
  flag: string;
  dependencies?: string[];
}

const OPTIONS: Option[] = [
  // Blueprints
  { id: 'filament', name: 'Filament', icon: '/icons/filament.jpg', color: '#FBBF24', category: 'blueprint', flag: '--filament' },
  { id: 'statamic', name: 'Statamic', icon: '/icons/statamic.svg', color: '#FF269E', category: 'blueprint', flag: '--statamic' },
  
  // Servers
  { id: 'frankenphp', name: 'FrankenPHP', icon: '/icons/frankenphp.svg', color: '#390075', category: 'server', flag: '--frankenphp' },
  { id: 'nginx', name: 'Nginx + FPM', icon: '/icons/nginx.svg', color: '#009639', category: 'server', flag: '--fpm-nginx' },
  { id: 'apache', name: 'Apache + FPM', icon: '/icons/apache.svg', color: '#D22128', category: 'server', flag: '--fpm-apache' },
  
  // Frontend Stacks
  { id: 'livewire', name: 'Livewire', icon: '/icons/livewire.svg', color: '#FB70A9', category: 'frontend', flag: '--livewire' },
  { id: 'react', name: 'React', icon: '/icons/react.svg', color: '#61DAFB', category: 'frontend', flag: '--react' },
  { id: 'vue', name: 'Vue.js', icon: '/icons/vue.svg', color: '#4FC08D', category: 'frontend', flag: '--vue' },
  { id: 'svelte', name: 'Svelte', icon: '/icons/svelte.svg', color: '#FF3E00', category: 'frontend', flag: '--svelte' },

  // Databases
  { id: 'mysql', name: 'MySQL', icon: '/icons/mysql.svg', color: '#4479A1', category: 'database', flag: '--mysql' },
  { id: 'mariadb', name: 'MariaDB', icon: '/icons/mariadb.svg', color: '#003545', category: 'database', flag: '--mariadb' },
  { id: 'postgres', name: 'PostgreSQL', icon: '/icons/postgres.svg', color: '#4169E1', category: 'database', flag: '--postgres' },
  { id: 'mongodb', name: 'MongoDB', icon: '/icons/mongodb.svg', color: '#47A248', category: 'database', flag: '--mongodb' },

  // Caching
  { id: 'redis', name: 'Redis', icon: '/icons/redis.svg', color: '#DC382D', category: 'cache', flag: '--redis' },
  { id: 'memcached', name: 'Memcached', icon: '/icons/memcached.svg', color: '#40B5AD', category: 'cache', flag: '--memcached' },

  // Storage
  { id: 'minio', name: 'MinIO', icon: '/icons/minio.svg', color: '#C72E49', category: 'storage', flag: '--minio' },
  { id: 'seaweedfs', name: 'SeaweedFS', icon: '/icons/seaweedfs.svg', color: '#00A3E0', category: 'storage', flag: '--seaweedfs' },
  { id: 'garage', name: 'Garage', icon: '/icons/garage.svg', color: '#FF9000', category: 'storage', flag: '--garage' },

  // Scout
  { id: 'meilisearch', name: 'Meilisearch', icon: '/icons/meilisearch.svg', color: '#FF5900', category: 'search', flag: '--meilisearch' },
  { id: 'typesense', name: 'Typesense', icon: '/icons/typesense.svg', color: '#008a44', category: 'search', flag: '--typesense' },

  // Features
  { id: 'horizon', name: 'Horizon', icon: '/icons/horizon.svg', color: '#4051B5', category: 'feature', flag: '--horizon', dependencies: ['redis'] },
  { id: 'reverb', name: 'Reverb', icon: '/icons/reverb.svg', color: '#FF2D20', category: 'feature', flag: '--reverb' },
  { id: 'scheduler', name: 'Scheduler', icon: '/icons/scheduler.svg', color: '#4F5B93', category: 'feature', flag: '--scheduler' },
  { id: 'ai', name: 'AI SDK', icon: '/icons/ai.svg', color: '#8B5CF6', category: 'feature', flag: '--ai' },
  { id: 'mcp', name: 'MCP', icon: '/icons/mcp.svg', color: '#10B981', category: 'feature', flag: '--mcp' },
  { id: 'boost', name: 'Boost', icon: '/icons/boost.svg', color: '#EF4444', category: 'feature', flag: '--boost' },
];

function ServerPod({ server, blueprint, frontend, features }: { server: Option, blueprint: Option, frontend: Option | undefined, features: Option[] }) {
  return (
    <div className={styles.podNode} style={{'--brand-color': server.color} as React.CSSProperties}>
      <div className={styles.podHeader}>
        <img src={server.icon} className={styles.podHeaderIcon} alt={server.name} />
        <div className={styles.podHeaderText}>
          <span className={styles.podKind}>Kubernetes Workload</span>
          <span className={styles.podName}>{server.name}</span>
        </div>
      </div>
      
      <div className={styles.podContent}>
        <div className={styles.layerRow}>
          <div className={styles.layerBadge} style={{'--bg': blueprint.color} as React.CSSProperties}>
            <img src={blueprint.icon} alt={blueprint.name} />
            {blueprint.name}
          </div>
          {frontend && (
            <div className={styles.layerBadge} style={{'--bg': frontend.color} as React.CSSProperties}>
              <img src={frontend.icon} alt={frontend.name} />
              {frontend.name}
            </div>
          )}
        </div>

        {features.length > 0 && (
          <div className={styles.featureGrid}>
            {features.map(f => (
              <div key={f.id} className={styles.featureIcon} title={f.name} style={{'--bg': f.color} as React.CSSProperties}>
                <img src={f.icon} alt={f.name} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function InfraPod({ opt }: { opt: Option }) {
  return (
    <div className={styles.infraNode} style={{'--brand-color': opt.color} as React.CSSProperties}>
      <div className={styles.infraIcon}>
        <img src={opt.icon} alt={opt.name} />
      </div>
      <span className={styles.infraName}>{opt.name}</span>
    </div>
  );
}

export default function ArchitectureBuilder() {
  const [selections, setSelections] = useState<string[]>(['frankenphp', 'livewire', 'mysql', 'redis']);
  const [appName, setAppName] = useState('my-masterpiece');
  const [copied, setCopied] = useState(false);

  const toggleOption = (id: string, category: string) => {
    setSelections(prev => {
      let next = [...prev];
      const opt = OPTIONS.find(o => o.id === id);
      const isSelected = prev.includes(id);

      if (['server', 'database'].includes(category)) {
        if (isSelected) return prev;
        next = next.filter(s => OPTIONS.find(o => o.id === s)?.category !== category);
        next.push(id);
      }
      else if (['blueprint', 'frontend', 'cache', 'storage', 'search'].includes(category)) {
        next = next.filter(s => OPTIONS.find(o => o.id === s)?.category !== category);
        if (!isSelected) {
          next.push(id);
        }
      }
      else {
        if (isSelected) {
          next = next.filter(s => s !== id);
        } else {
          next.push(id);
        }
      }

      if (opt?.dependencies && next.includes(id)) {
        opt.dependencies.forEach(depId => {
          if (!next.includes(depId)) {
            next.push(depId);
          }
        });
      }

      return next;
    });
  };

  const currentServer = useMemo(() => OPTIONS.find(o => o.category === 'server' && selections.includes(o.id))!, [selections]);
  const currentBlueprint = useMemo(() => OPTIONS.find(o => o.category === 'blueprint' && selections.includes(o.id)) || { id: 'laravel', name: 'Laravel', icon: '/icons/laravel.svg', color: '#FF2D20', category: 'blueprint', flag: '' }, [selections]);
  const currentFrontend = useMemo(() => OPTIONS.find(o => o.category === 'frontend' && selections.includes(o.id)), [selections]);
  const currentFeatures = useMemo(() => OPTIONS.filter(o => o.category === 'feature' && selections.includes(o.id)), [selections]);
  const infraNodes = useMemo(() => OPTIONS.filter(o => ['database', 'cache', 'storage', 'search'].includes(o.category) && selections.includes(o.id)), [selections]);

  const copyToClipboard = () => {
    const flags = selections.map(id => OPTIONS.find(o => o.id === id)?.flag).filter(Boolean).sort().join(' ');
    navigator.clipboard.writeText(`larakube new ${appName} ${flags}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={styles.builderContainer}>
      <div className={styles.builderGrid}>
        {/* CANVAS (Left) */}
        <div className={styles.previewPanel}>
          <div className={styles.blueprintCanvas}>
            <div className={styles.topologyFlow}>
              {/* TOP: INGRESS */}
              <div className={styles.gatewayNode}>
                <div className={styles.gatewayIcon}>
                  <img src="https://cdn.simpleicons.org/traefikproxy/white" alt="Traefik" />
                </div>
                <div className={styles.gatewayText}>
                  <span className={styles.gatewayKind}>Ingress Controller</span>
                  <span className={styles.gatewayName}>Traefik Gateway</span>
                </div>
              </div>

              <div className={styles.flowLine} />

              {/* MIDDLE: APP POD */}
              <ServerPod 
                server={currentServer}
                blueprint={currentBlueprint}
                frontend={currentFrontend}
                features={currentFeatures}
              />

              <div className={styles.flowLine} />

              {/* BOTTOM: INFRASTRUCTURE */}
              <div className={styles.infraCluster}>
                {infraNodes.map(opt => (
                  <InfraPod key={opt.id} opt={opt} />
                ))}
              </div>
            </div>

            {/* INTEGRATED COMMAND BOX */}
            <div className={styles.integratedCommand} onClick={copyToClipboard} title="Click to copy command">
              <div className={styles.commandHeader}>
                <span className={styles.commandLabel}>Generated Orchestration Command</span>
                {copied && <span className={styles.commandCopied}>Copied! ✨</span>}
              </div>
              <div className={styles.commandText}>
                larakube new <span className={styles.commandAppName}>{appName}</span> <span className={styles.commandFlags}>
                  {selections.map(id => OPTIONS.find(o => o.id === id)?.flag).filter(Boolean).sort().join(' ')}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* SHELF (Right) */}
        <div className={styles.selectionPanel}>
          <div className={styles.projectCard}>
            <div className={styles.inputGroup}>
              <label>Project Name</label>
              <input 
                type="text" 
                value={appName} 
                onChange={e => setAppName(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-'))}
              />
            </div>
          </div>

          <div className={styles.optionsCard}>
            <div className={styles.optionsScrollArea}>
              {[
                { title: 'Foundation', cat: 'blueprint' },
                { title: 'Server', cat: 'server' },
                { title: 'Frontend Stack', cat: 'frontend' },
                { title: 'Database', cat: 'database' },
                { title: 'Cache Driver', cat: 'cache' },
                { title: 'Storage', cat: 'storage' },
                { title: 'Search', cat: 'search' },
                { title: 'Scaling Features', cat: 'feature' },
              ].map(group => (
                <div key={group.cat} className={styles.categoryGroup}>
                  <Heading as="h4" className={styles.categoryTitle}>{group.title}</Heading>
                  <div className={styles.optionsGrid}>
                    {OPTIONS.filter(o => o.category === group.cat).map(opt => (
                      <button
                        key={opt.id}
                        className={clsx(styles.optionCard, selections.includes(opt.id) && styles.optionSelected)}
                        style={{'--brand-color': opt.color} as React.CSSProperties}
                        onClick={() => toggleOption(opt.id, opt.category)}
                      >
                        <div className={styles.optionIcon}>
                          <img src={opt.icon} alt={opt.name} />
                        </div>
                        <span className={styles.optionName}>{opt.name}</span>
                        {selections.includes(opt.id) && <div className={styles.selectedCheck}>✓</div>}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
