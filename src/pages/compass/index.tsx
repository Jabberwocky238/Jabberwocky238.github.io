import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import Admonition from '@theme/Admonition';
import { useEffect, useState } from 'react';

interface BinderHooks {
    getOrientation: (orient: [number, number, number]) => void;
    getAccel: (accel: [number, number, number]) => void;
    getAccelG: (accel: [number, number, number]) => void;
    getRot: (rot: [number, number, number]) => void;
}

interface Module {
    binder: (hooks: BinderHooks) => void;
}

export default function Home(): JSX.Element {
    const { siteConfig } = useDocusaurusContext();
    const [orient, setOrient] = useState<[number, number, number]>([0, 0, 0]);
    const [accel, setAccel] = useState<[number, number, number]>([0, 0, 0]);
    const [accelG, setAccelG] = useState<[number, number, number]>([0, 0, 0]);
    const [rot, setRot] = useState<[number, number, number]>([0, 0, 0]);

    useEffect(() => {
        const module: Module = require('./logic');
        module.binder({
            getOrientation: (orient) => setOrient(orient),
            getAccel: (accel) => setAccel(accel),
            getAccelG: (accelG) => setAccelG(accelG),
            getRot: (rot) => setRot(rot),
        })
    }, []);

    return (
        <Layout noFooter title={`指南针 | from ${siteConfig.title}`} description="指南针">
            <center>
                <Admonition type="tip">
                    仅支持手机
                </Admonition>
                <h2>方向角</h2>
                <h4>orient x: {orient[0]}</h4>
                <h4>orient y: {orient[1]}</h4>
                <h4>orient z: {orient[2]}</h4>
                <h2>加速度</h2>
                <h4>accel x: {accel[0]}</h4>
                <h4>accel y: {accel[1]}</h4>
                <h4>accel z: {accel[2]}</h4>
                <h2>重力加速度</h2>
                <h4>accelG x: {accelG[0]}</h4>
                <h4>accelG y: {accelG[1]}</h4>
                <h4>accelG z: {accelG[2]}</h4>
                <h2>旋转角</h2>
                <h4>rot x: {rot[0]}</h4>
                <h4>rot y: {rot[1]}</h4>
                <h4>rot z: {rot[2]}</h4>
            </center>
        </Layout>
    );
}


