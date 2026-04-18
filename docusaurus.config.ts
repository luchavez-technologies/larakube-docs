import 'dotenv/config';
import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const config: Config = {
  title: 'LaraKube',
  tagline: 'Kubernetes for Laravel from Development to Deployment',
  favicon: 'img/favicon.ico',

  url: 'https://larakube.luchtech.dev',
  baseUrl: '/',

  organizationName: 'Luchavez Techonologies',
  projectName: 'LaraKube',

  onBrokenLinks: 'throw',
  
  markdown: {
    format: 'detect',
    hooks: {
      onBrokenMarkdownLinks: 'warn',
    }
  },

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  // Enable Faster plugin for better performance
  future: {
    faster: {
      swcJsLoader: true,
      swcJsMinimizer: true,
      swcHtmlMinimizer: true,
      lightningCssMinimizer: true,
      rspackBundler: true,
      mdxCrossCompilerCache: true,
    },
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          routeBasePath: '/',
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    navbar: {
      title: 'LaraKube',
      logo: {
        alt: 'LaraKube Logo',
        src: 'img/larakube-logo.svg',
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'tutorialSidebar',
          position: 'left',
          label: 'Documentation',
        },
        {
          href: 'https://github.com/luchavez-technologies/larakube',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Docs',
          items: [
            {
              label: 'Introduction',
              to: '/',
            },
            {
              label: 'Architecture',
              to: '/architecture/philosophy',
            },
          ],
        },
        {
          title: 'Community',
          items: [
            {
              label: 'Contribute to CLI',
              href: 'https://github.com/luchavez-technologies/larakube',
            },
            {
              label: 'Contribute to Docs',
              href: 'https://github.com/luchavez-technologies/larakube-docs',
            },
          ],
        },
        {
          title: 'Creator',
          items: [
            {
              label: 'LinkedIn (Open for Work! 🚀)',
              href: 'https://www.linkedin.com/in/luchaveztech/',
            },
            {
              label: 'Email: james@luchtech.dev',
              href: 'mailto:james@luchtech.dev',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} LaraKube. Built with Docusaurus.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
      additionalLanguages: ['php', 'bash', 'yaml', 'json'],
    },
    algolia: {
      appId: process.env.ALGOLIA_APP_ID || 'NO_APP_ID',
      apiKey: process.env.ALGOLIA_API_KEY || 'NO_API_KEY',
      indexName: process.env.ALGOLIA_INDEX_NAME || 'larakube',
      contextualSearch: true,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
