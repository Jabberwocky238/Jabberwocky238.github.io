import BrowserOnly from '@docusaurus/BrowserOnly';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import { useEffect } from 'react';

export default function Home(): JSX.Element {
    const { siteConfig } = useDocusaurusContext();
    useEffect(() => {
        const module = require('./logic');
        const remove = module.init();
        return remove;
    }, []);
    return (
        <Layout noFooter
            title={`Hello from ${siteConfig.title}`}
            description="Description will go into a meta tag in <head />">
            <BrowserOnly>
                {() => <main id="caonimab" style={{ display: "flex", justifyContent: "center" }}></main>}
            </BrowserOnly>
        </Layout>
    );
}


