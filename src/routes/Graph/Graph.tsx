import { Component } from 'react';
import { observer } from 'mobx-react';
// import counter from './store'
import * as d3 from "d3";
import Button from '@/components/Button';

class Graph extends Component {
    w = 800
    h = 800
    ss = false
    constructor(props: {}) {
        super(props);
    }
    async componentDidMount() {
        if (this.ss) return;
        this.ss = true
        const raw = await fetch('/json/svgtest.json');
        const text = await raw.text()
        const dataset: { nodes: any[], links: any[] } = JSON.parse(text);
        // console.log(dataset)

        // 定义碰撞检测模型
        var forceCollide = d3.forceCollide()
            .radius(_ => { return 16 * 3 })
            .iterations(0.15)
            .strength(0.75)

        const simulation = d3.forceSimulation(dataset.nodes)
            .force("charge", d3.forceManyBody().strength(-500))
            .force("link", d3.forceLink(dataset.links))
            .force("center", d3.forceCenter(this.w / 2, this.h / 2))
            .force("collision", forceCollide)

        var svg = d3.select("#svggg")
            .append("svg")
            .attr("width", this.w)
            .attr("height", this.h);

        // 渲染链接
        const link = svg.append("g")
            .attr("class", "links")
            .attr("stroke", "black")
            .attr("stroke-width", 1.5)
            .selectAll("line")
            .data(dataset.links)
            .enter().append("line")
            .attr("stroke-width", (d) => {
                // console.log(d, typeof d); 
                return d.value + 'px'
            })

        const node = svg.append("g")
            .attr("class", "nodes")
            .attr("stroke", "black")
            .attr("stroke-width", 1.5)
            .selectAll("circle")
            .data(dataset.nodes).enter()
            .append("circle")
            .attr("r", 15)
            .attr("fill", d => {
                console.log(d);
                return 'white'
            })
            .attr("name", d => d.name)

        // 监听模拟的tick事件来更新节点和链接的位置
        simulation.on("tick", () => {
            node.attr("cx", d => d.x!)
                .attr("cy", d => d.y!);
            link.attr("x1", d => d.source.x)
                .attr("y1", d => d.source.y)
                .attr("x2", d => d.target.x)
                .attr("y2", d => d.target.y);
        });
    }
    render() {
        return (
            <>
                <div style={{
                    position: 'absolute',
                }}>
                    <Button color='aqua' navigateTo='/'>
                        Home
                    </Button>
                </div>
                <div id='svggg'></div>
            </>
        );
    }
}

export default observer(Graph);