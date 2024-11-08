import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Heading from '@theme/Heading';
import styles from './index.module.css';
import { useState } from 'react';
import axios from 'axios';
import { useAPIBase } from '@site/src/global';

async function getHowMany() {
    try {
        const API = useAPIBase();
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

export default function HomepageHeader() {
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
                <p className="hero__subtitle">Total Visits: {count}</p>
                <div className={styles.buttons}>
                    <Link
                        className="button button--secondary button--lg"
                        to="/about">
                        Take a look👍
                    </Link>
                </div>
            </div>
        </header>
    );
}