import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

/**
 * Creating a sidebar enables you to:
 - create an ordered group of docs
 - render a sidebar for each doc of that group
 - provide next/previous navigation

 The sidebars can be generated from the filesystem, or explicitly defined here.

 Create as many sidebars as you want.
 */
const sidebars: SidebarsConfig = {
  tutorialSidebar: [
    {
      type: 'category',
      label: 'Prologue',
      items: ['index', 'architecture/philosophy'],
    },
    {
      type: 'category',
      label: 'Why LaraKube CLI',
      items: [
        'why/comparison',
        'why/larakube-vs-swarm',
      ],
    },
    {
      type: 'category',
      label: 'Getting Started',
      items: [
        'onboarding/installation',
        {
          type: 'category',
          label: 'Operating Systems',
          items: [
            'onboarding/operating-systems/macos',
            'onboarding/operating-systems/linux',
            'onboarding/operating-systems/windows',
          ],
        },
        'onboarding/first-app',
        'onboarding/full-flight-plan',
        'onboarding/configuration',
        'onboarding/without-the-cli',
        'onboarding/glossary',
      ],
    },
    {
      type: 'category',
      label: 'Architecture Concepts',
      items: [
        'architecture/at-a-glance',
        'architecture/infrastructure',
        'architecture/provisioning',
        'architecture/blueprint-anatomy',
        'architecture/multi-blueprint',
        'architecture/networking',
        'architecture/shared-storage',
        'architecture/startup-sequence',
        'architecture/console',
      ],
    },
    {
      type: 'category',
      label: 'Foundations & Tooling',
      items: [
        'foundations/safety-reliability',
        'foundations/dual-mcp',
        'foundations/tooling',
      ],
    },
    {
      type: 'category',
      label: 'The Basics (Commands)',
      items: [
        'commands/operations',
        'commands/management',
        'commands/networking',
        'commands/development',
        'commands/cluster',
        'commands/cloud',
      ],
    },
    {
      type: 'category',
      label: 'Daily Development',
      items: [
        'development/hmr',
        'development/logs',
        'development/monitoring',
        'development/tunneling',
        'development/ai-native-orchestration',
      ],
    },
    {
      type: 'category',
      label: 'Digging Deeper (Deployment)',
      items: [
        'deployment/overview',
        'deployment/journey',
        'deployment/how-builds-work',
        'deployment/scaling-journey',
        'architecture/single-node-hero',
        'deployment/multiple-projects',
        'deployment/two-envs-one-server',
        'deployment/plex-resources',
        'deployment/airgapped-bundles',
        'deployment/manual-deploy',
        'deployment/github-actions',
        'deployment/cloud-create',
        'deployment/doks-quickstart',
      ],
    },
    {
      type: 'category',
      label: 'Security',
      items: [
        'security/overview',
        'deployment/surgical-credentials',
        'security/rotating-credentials',
        'security/server-hardening',
      ],
    },
    {
      type: 'category',
      label: 'Teams',
      items: [
        'teams/overview',
      ],
    },
    {
      type: 'category',
      label: 'Ecosystem & Advanced',
      items: [
        {
          type: 'category',
          label: 'Laravel Ecosystem',
          items: [
            'laravel-ecosystem/octane',
            'laravel-ecosystem/reverb',
            'laravel-ecosystem/horizon',
            'laravel-ecosystem/scheduling',
            'laravel-ecosystem/scout',
          ],
        },
        {
          type: 'category',
          label: 'Databases',
          items: [
            'databases/overview',
            'databases/postgresql',
            'databases/redis',
          ],
        },
        'frontend-stacks/overview',
        'storage/overview',
        'blueprints/overview',
        'lifecycle/index',
        'troubleshooting/common-issues',
      ],
    },
    {
      type: 'category',
      label: 'Community',
      items: [
        'community/mission-vision',
        'community/changelog',
        'community/roadmap',
      ],
    },
  ],
};

export default sidebars;
