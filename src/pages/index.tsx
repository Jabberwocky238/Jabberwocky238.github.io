import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import HomepageFeatures from '@site/src/components/HomepageFeatures';
import DocusaurusButton from '@site/src/components/DocusaurusButton';
import Heading from '@theme/Heading';
import styles from './index.module.css';
import { useState } from 'react';
import axios from 'axios';

const BASE_API_JW238 = 'https://jw238.site/api/feedback/blog/howmanyvisit';
async function getHowMany() {
  try {
    const response = await axios.get(`${BASE_API_JW238}`, {
      timeout: 2000,
    })
    const text = response.data;
    return text;
  }
  catch (error) {
    return '服务器网断啦';
  }
}

function HomepageHeader() {
  const { siteConfig } = useDocusaurusContext();
  const [count, setCount] = useState('加载中...');
  getHowMany().then((text) => {
    setCount(text);
  })

  return (
    <header className={clsx('hero hero--primary', styles.heroBanner)}>
      <div className="container">
        <Heading as="h1" className="hero__title">
          {siteConfig.title}
        </Heading>
        <p className="hero__subtitle">{siteConfig.tagline}</p>
        <p className="hero__subtitle">总访问数：{ count }</p>
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
      <main>
        <HomepageFeatures />
      </main>
    </Layout>
  );
}
