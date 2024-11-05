import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import HomepageFeatures from '@site/src/components/HomepageFeatures';
import HomepagePortals from '@site/src/components/HomepagePortals';
import Heading from '@theme/Heading';
import styles from './index.module.css';
import { useState } from 'react';
import axios from 'axios';
import { API } from '../global';

async function getHowMany() {
  try {
    const api = `${API}/feedback/blog/howmanyvisit`;
    const response = await axios.get(`${api}`, {
      timeout: 2000,
    })
    return response.data;
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
        <p className="hero__subtitle">总访问数：{count}</p>
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
      <HomepagePortals />
        <HomepageFeatures />
      </main>
    </Layout>
  );
}
