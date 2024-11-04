import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import { useEffect, useState } from 'react';

interface BinderHooks {
    getAbsolute: (abs: boolean) => void;
    getAlpha: (alpha: number) => void;
    getBeta: (beta: number) => void;
    getGamma: (gamma: number) => void;
}

interface Module {
    binder: (hooks: BinderHooks) => void;
}

export default function Home(): JSX.Element {
    const { siteConfig } = useDocusaurusContext();
    const [abs, setAbs] = useState(false);
    const [alpha, setAlpha] = useState(0);
    const [beta, setBeta] = useState(0);
    const [gamma, setGamma] = useState(0);

    useEffect(() => {
        const module: Module = require('./logic');
        module.binder({
            getAbsolute: (abs: boolean) => {
                setAbs(abs);
            },
            getAlpha: (alpha: number) => {
                setAlpha(alpha);
            },
            getBeta: (beta: number) => {
                setBeta(beta);
            },
            getGamma: (gamma: number) => {
                setGamma(gamma);
            }
        })
    }, []);

    return (
        <Layout noFooter title={`指南针 | from ${siteConfig.title}`} description="指南针">
            <center>
                <strong>是否绝对: {abs ? "是": "否"}</strong>
                <br />
                <strong>alpha: {alpha}</strong>
                <br />
                <strong>beta: {beta}</strong>
                <br />
                <strong>gamma: {gamma}</strong>
            </center>
        </Layout>
    );
}


