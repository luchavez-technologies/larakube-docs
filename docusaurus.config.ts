import 'dotenv/config';
import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const config: Config = {
  title: 'LaraKube CLI',
  tagline: 'Kubernetes for Laravel from Development to Deployment',
  favicon: 'img/larakube-logo.svg',

  url: 'https://larakube.luchtech.dev',
  baseUrl: '/',

  organizationName: 'Luchavez Techonologies',
  projectName: 'LaraKube CLI',

  onBrokenLinks: 'warn',
  
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
          routeBasePath: '/docs',
        },
        blog: {
          showReadingTime: true,
          feedOptions: {
            type: ['rss', 'atom'],
            xslt: true,
          },
          onInlineAuthors: 'warn',
          onUntruncatedBlogPosts: 'warn',
        },
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    metadata: [
      {name: 'keywords', content: 'laravel, kubernetes, k8s, docker, php, orchestration, cli, devops, larakube'},
      {name: 'twitter:card', content: 'summary_large_image'},
      {name: 'og:type', content: 'website'},
      {name: 'og:site_name', content: 'LaraKube CLI'},
    ],
    image: 'img/larakube-logo.svg', // Fallback social image
    navbar: {
      title: 'LaraKube CLI',
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
        {to: '/blog', label: 'Blog', position: 'left'},
        {
          href: 'https://github.com/luchavez-technologies/larakube-cli',
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
              to: '/docs',
            },
            {
              label: 'Architecture',
              to: '/docs/architecture/philosophy',
            },
          ],
        },
        {
          title: 'Community',
          items: [
            {
              label: 'Contribute to CLI',
              href: 'https://github.com/luchavez-technologies/larakube-cli',
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
      copyright: `Copyright © ${new Date().getFullYear()} LaraKube CLI. Built with Docusaurus.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
      additionalLanguages: ['php', 'bash', 'yaml', 'json'],
    },
    algolia: {
      appId: process.env.ALGOLIA_APP_ID || 'NO_APP_ID',
      apiKey: process.env.ALGOLIA_API_KEY || 'NO_API_KEY',
      indexName: process.env.ALGOLIA_INDEX_NAME || 'LaraKube Documentation',
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
