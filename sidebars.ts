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
      items: ['index', 'architecture/philosophy', 'comparison'],
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
        'architecture/single-node-hero',
        'architecture/strategy-switching',
        'architecture/CLOUD_STRATEGY',
        'architecture/networking',
        'architecture/shared-storage',
        'architecture/infrastructure',
        'architecture/console',
        'architecture/multi-blueprint',
        'architecture/architectural-dna',
        'architecture/blueprint-anatomy',
        'architecture/startup-sequence',
      ],
    },
    {
      type: 'category',
      label: 'Foundations & Tooling',
      items: [
        'foundations/safety-reliability',
        'foundations/dual-mcp',
        'foundations/filament',
        'foundations/statamic',
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
      label: 'Digging Deeper (Deployment)',
      items: [
        'deployment/overview',
        'deployment/scaling-journey',
        'deployment/gitops',
        'deployment/6dollar-baseline',
        'deployment/multiple-projects',
        'deployment/surgical-credentials',
        'deployment/github-actions',
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
            'databases/mysql',
            'databases/mariadb',
            'databases/postgresql',
            'databases/redis',
          ],
        },
        {
          type: 'category',
          label: 'Frontend Stacks',
          items: [
            'frontend-stacks/livewire',
            'frontend-stacks/react',
            'frontend-stacks/vue',
            'frontend-stacks/svelte',
          ],
        },
        {
          type: 'category',
          label: 'Storage Solutions',
          items: [
            'storage/overview',
            'storage/minio',
            'storage/seaweedfs',
            'storage/garage',
          ],
        },
        {
          type: 'category',
          label: 'Masterpiece Blueprints',
          items: [
            'blueprints/portfolio',
            'blueprints/ecommerce',
            'blueprints/ai-chat',
            'blueprints/data-processor',
          ],
        },
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
