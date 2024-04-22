import React, { Component, ReactNode } from 'react';
import ReactDOM from 'react-dom';
import { Link, NavLink, useLocation } from 'react-router-dom';

type FolderItem = {
    uriName: string;
    isDir: boolean;
    urlPath: string[];
    items?: FolderItem[];
}

class Sidebar extends Component {
    state: { 
        dom: ReactNode | null
    }
    
    constructor(props: {}) {
        super(props);
        this.state = {
            dom: null
        }
    }
    async componentDidMount() {
        fetch(`/flat.json`)
            .then(res => res.text())
            .then(text => {
                const raw: FolderItem[] = JSON.parse(text)
                const doms = generateNestedElements(raw)
                this.setState({
                    dom: doms
                })
            })
    }
    render() {
        const isReady = this.state.dom !== null;
        return (
            <div style={{width: '30%'}} id='doc-sidebar'>
                {isReady ? this.state.dom : <h1>sidebar</h1>}
            </div>
        );
    }
}

function DirLike(props: {fi: FolderItem}) {
    const { fi } = props;
    return (
        <>
            <div>{fi.uriName}</div>
            {generateNestedElements(fi.items!)}
        </>
    );
}

function toUrl(fditem: FolderItem, baseDir = 'document') {
    return '/' + baseDir + '/'+ fditem.urlPath.map((item) => encodeURIComponent(item)).join('/')
}
function FileLike(props: {fi: FolderItem}) {
    const { fi } = props;
    return (
        <NavLink to={toUrl(fi, 'document')} >{fi.uriName}<br></br></NavLink>
    )
}

const generateNestedElements = (items: FolderItem[]) => {
    return items.filter((item) => !item.uriName.endsWith(".png")).map((item) => {
        if (item.isDir) {
            return <DirLike key={item.uriName} fi={item}/>;
        } else {
            return <FileLike key={item.uriName} fi={item}/>;
        }
    });
}

// function getRootUriStrcuture() {
//     function flatten(array) {
//         return array.reduce((acc, val) => {
//             return val.isDir ? acc.concat(flatten(val.items)) : acc.concat(val);
//         }, []);
//     }
//     const flat = flatten(result)
//     return flat
// }

export default Sidebar;
