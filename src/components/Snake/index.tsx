import { useEffect, useState } from 'react';

type Vector2D = [number, number];
interface Hooks {
    getLength: (len: number) => void;
    getHeadPos: (pos: Vector2D) => void;
    getLiveState: (die: boolean) => void;
    getSteer: (dir: string) => void;
}
interface Module {
    init: () => {
        remove: () => void,
        register: (hooks: Partial<Hooks>) => void
    };
}

export default function Home(): JSX.Element {
    const [len, setLen] = useState(0);
    const [headPos, setHeadPos] = useState([0, 0]);
    const [isDie, setDie] = useState(false);
    const [steer, setSteer] = useState('unknown');

    useEffect(() => {
        const module: Module = require('./logic');
        const { remove, register } = module.init();
        register({
            getLength: (len: number) => {
                setLen(len);
            },
            getHeadPos: (pos: Vector2D) => {
                setHeadPos(pos);
            },
            getLiveState: (die: boolean) => {
                setDie(die);
            },
            getSteer: (dir: string) => {
                setSteer(dir);
            }
        })
        return remove;
    }, []);

    return (
        <>
            <main style={{ display: "flex", justifyContent: "center" }}>
                <canvas id="caonimab"></canvas>
            </main>
            <center>
                <strong>手机竖屏游玩，兼容度差，目前不正常</strong>
                <br />
                <strong>WASD控制方向，死了刷新网页</strong>
                <br />
                <strong>长度：{len}，头部位置：[{headPos[0]}, {headPos[1]}]，方向：{steer}, 状态：{isDie ? "死亡" : "健康"}</strong>
            </center>
        </>
    );
}


