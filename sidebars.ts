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
      label: 'Getting Started',
      items: [
        'onboarding/installation',
        'onboarding/first-app',
        'onboarding/full-flight-plan',
        'onboarding/glossary',
      ],
    },
    {
      type: 'category',
      label: 'Architecture Concepts',
      items: [
        'architecture/single-node-hero',
        'architecture/multi-blueprint',
        'architecture/networking',
        'architecture/infrastructure',
        'architecture/console',
      ],
    },
    {
      type: 'category',
      label: 'Foundations & Storage',
      items: [
        'architecture/shared-storage',
        'foundations/safety-reliability',
      ],
    },
    {
      type: 'category',
      label: 'Digging Deeper',
      items: [
        'deployment/gitops',
        'deployment/6dollar-baseline',
        'deployment/surgical-credentials',
        'development/teammate-access',
        'development/ai-native-orchestration',
      ],
    },
    {
      type: 'category',
      label: 'Advanced',
      items: [
        'blueprints/index',
        'databases/index',
        'frontend-stacks/index',
        'troubleshooting/index',
      ],
    },
  ],
};

export default sidebars;
