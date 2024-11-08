import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import Admonition from '@theme/Admonition';
import { useEffect, useState } from 'react';
import styles from './styles.module.css';

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
            <center className='container'>
                <div className={styles.MAXwidth}>
                    <center>
                        <Admonition type="tip">仅支持手机</Admonition>
                    </center>
                    <h2>方向角 orientation</h2>
                    <h4>x: {orient[0]}</h4>
                    <h4>y: {orient[1]}</h4>
                    <h4>z: {orient[2]}</h4>
                    <h2>加速度 acceleration</h2>
                    <h4>x: {accel[0]}</h4>
                    <h4>y: {accel[1]}</h4>
                    <h4>z: {accel[2]}</h4>
                    <h2>重力加速度 acceleration with gravity</h2>
                    <h4>x: {accelG[0]}</h4>
                    <h4>y: {accelG[1]}</h4>
                    <h4>z: {accelG[2]}</h4>
                    <h2>旋转角加速度 rotation acceleration</h2>
                    <h4>x: {rot[0]}</h4>
                    <h4>y: {rot[1]}</h4>
                    <h4>z: {rot[2]}</h4>
                </div>
            </center>
        </Layout>
    );
}


