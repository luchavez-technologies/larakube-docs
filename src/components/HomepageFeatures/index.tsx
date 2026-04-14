import React from 'react';
import clsx from 'clsx';
import Heading from '@theme/Heading';

type FeatureItem = {
  title: string;
  Svg: React.ComponentType<React.ComponentProps<'svg'>>;
  description: React.JSX.Element;
};

const FeatureList: FeatureItem[] = [
  {
    title: 'Zero-Host Dependency',
    Svg: require('@site/static/img/undraw_docusaurus_mountain.svg').default,
    description: (
      <>
        LaraKube runs everything inside Docker containers. Your local machine 
        stays clean—no need to install PHP, Node, or Composer.
      </>
    ),
  },
  {
    title: 'Professional UI',
    Svg: require('@site/static/img/undraw_docusaurus_tree.svg').default,
    description: (
      <>
        Built with Termwind and Laravel Prompts, LaraKube provides a 
        high-contrast, professional CLI experience out of the box.
      </>
    ),
  },
  {
    title: 'Lego-like Features',
    Svg: require('@site/static/img/undraw_docusaurus_react.svg').default,
    description: (
      <>
        Plug in features like Horizon, Reverb, or Scout anytime. LaraKube handles 
        the manifests, environment variables, and installations for you.
      </>
    ),
  },
];

function Feature({title, Svg, description}: FeatureItem) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center">
        <Svg className={styles.featureSvg} role="img" />
      </div>
      <div className="text--center padding-horiz--md">
        <Heading as="h3">{title}</Heading>
        <p>{description}</p>
      </div>
    </div>
  );
}

import styles from './styles.module.css';

export default function HomepageFeatures(): React.JSX.Element {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
