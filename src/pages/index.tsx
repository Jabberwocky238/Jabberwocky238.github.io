import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import HomepageFeatures from '@site/src/components/HomepageFeatures';
import DocusaurusButton from '@site/src/components/DocusaurusButton';
import Heading from '@theme/Heading';

import styles from './index.module.css';

function HomepageHeader() {
  const { siteConfig } = useDocusaurusContext();
  return (
    <header className={clsx('hero hero--primary', styles.heroBanner)}>
      <div className="container">
        <Heading as="h1" className="hero__title">
          {siteConfig.title}
        </Heading>
        <p className="hero__subtitle">{siteConfig.tagline}</p>
        <DocusaurusButton to={'/intro'}>
          Docusaurus Tutorial - 5min ⏱️
        </DocusaurusButton>
        <DocusaurusButton to={'/snake'} padding>
          贪吃蛇
        </DocusaurusButton>
        <DocusaurusButton to={'/orientation'}>
          orientation
        </DocusaurusButton>
      </div>
    </header>
  );
}

export default function Home(): JSX.Element {
  const { siteConfig } = useDocusaurusContext();
  return (
    <Layout
      title={`Hello from ${siteConfig.title}`}
      description="Description will go into a meta tag in <head />">
      <HomepageHeader />
      {/* <div>
        <img src="https://github-readme-stats.vercel.app/api?username=Jabberwocky238&show_icons=true&theme=radical" alt="" />
      </div> */}
      <main>
        <HomepageFeatures />
      </main>
    </Layout>
  );
}
