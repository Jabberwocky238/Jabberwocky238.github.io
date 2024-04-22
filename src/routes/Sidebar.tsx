import { Component, ReactNode, useState } from 'react';
import { NavLink } from 'react-router-dom';

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
    componentDidMount() {
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
            <div style={{width: '30%'}}>
                {isReady ? this.state.dom : <h1>sidebar</h1>}
            </div>
        );
    }
}

function DirLike(props: {fi: FolderItem}) {
    const { fi } = props;
    const [open, setOpen] = useState(true);
    return (
        <>
            <div style={{cursor: 'pointer'}} onClick={() => setOpen(!open)}>{fi.uriName}</div>
            <div style={{display: open ? 'block' : 'none'}}>{generateNestedElements(fi.items!)}</div>
        </>
    );
}

function FileLike(props: {fi: FolderItem}) {
    const { fi } = props;
    function toUrl(fditem: FolderItem, baseDir = 'document') {
        return '/' + baseDir + '/'+ fditem.urlPath.map((item) => encodeURIComponent(item)).join('/')
    }
    return (
        <NavLink className="App-link" to={toUrl(fi, 'document')} >{fi.uriName}<br></br></NavLink>
    )
}

const generateNestedElements = (items: FolderItem[]) => {
    return items.filter((item) => !item.urlPath.includes("assets")).map((item) => {
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
