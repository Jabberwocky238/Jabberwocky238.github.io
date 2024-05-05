// import * as d3 from "d3";

// interface D3Node {
//     // index: number;
//     // showName: string;
//     // group: number;
//     // link: string;
//     // name: string;
//     // group: number;
//     // QQ: string;
// }

// interface D3Link {
//     // src: number;
//     // dst: number;
//     // weight: number;
//     // source: number,
//     // target: number,
//     // value: number,
// }

// async function getData() {
//     const raw = await fetch('/json/svgtest.json');
//     const text = await raw.text()
//     const dataset: { nodes: any[], links: any[] } = JSON.parse(text);
//     // console.log(dataset)
//     return dataset
// }


// // 绘制关系箭头
// function addMarkers(svgDom) {
//     // 定义箭头的标识
//     var defs = svgDom.append("defs")
//     defs.append("marker")
//         .attr("id", "posMarker")
//         .attr("orient", "auto")
//         .attr("stroke-width", 2)
//         .attr("markerUnits", "strokeWidth")
//         .attr("markerUnits", "userSpaceOnUse")
//         .attr("viewBox", "0 -5 10 10")
//         .attr("refX", 31)
//         .attr("refY", 0)
//         .attr("markerWidth", 12)
//         .attr("markerHeight", 12)
//         .append("path")
//         .attr("d", "M 0 -5 L 10 0 L 0 5")
//         .attr('fill', '#e0cac1')
//         .attr("stroke-opacity", 0.6);
//     defs.append("marker")
//         .attr("id", "posActMarker")
//         .attr("orient", "auto")
//         .attr("stroke-width", 2)
//         .attr("markerUnits", "strokeWidth")
//         .attr("markerUnits", "userSpaceOnUse")
//         .attr("viewBox", "0 -5 10 10")
//         .attr("refX", 31)
//         .attr("refY", 0)
//         .attr("markerWidth", 12)
//         .attr("markerHeight", 12)
//         .append("path")
//         .attr("d", "M 0 -5 L 10 0 L 0 5")
//         .attr('fill', '#1E90FF')
//         .attr("stroke-opacity", 0.6);
// }

// function drag(simulation) {
//     // 是否固定当前节点
//     let fixed = false

//     function dragsubject(event) {
//         return simulation.find(event.x, event.y);
//     }

//     function dragstarted(event) {
//         // 默认是不固定的
//         fixed = false
//         if (!event.active) simulation.alphaTarget(0.3).restart();
//         event.subject.fx = event.subject.x;
//         event.subject.fy = event.subject.y;
//     }

//     function dragged(event) {
//         // 一旦移动过了，就默认固定他
//         fixed = true
//         event.subject.fx = event.x;
//         event.subject.fy = event.y;
//     }

//     function dragended(event) {
//         if (!event.active) {
//             simulation.alphaTarget(0);
//         }
//         // 没移动，就解锁他
//         if (!fixed) {
//             event.subject.fx = null;
//             event.subject.fy = null;
//         } else {
//             event.subject.fx = event.x;
//             event.subject.fy = event.y;
//         }
//     }

//     return d3.drag()
//         .subject(dragsubject)
//         .on("start", dragstarted)
//         .on("drag", dragged)
//         .on("end", dragended)
// },