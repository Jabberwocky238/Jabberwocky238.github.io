import { Component, ReactNode, useState } from 'react';
import { NavLink } from 'react-router-dom';

export type FolderItem = {
    uriName: string;
    isDir: boolean;
    urlPath: string[];
    items?: FolderItem[];
}

interface SidebarProps {
    documentTree: FolderItem[] | null
}

class Sidebar extends Component<SidebarProps> {
    state: {
        dom: ReactNode | null
    }

    constructor(props: SidebarProps) {
        super(props);
        this.state = {
            dom: null
        }
    }
    componentDidUpdate(prevProps: SidebarProps) {
        if (this.props.documentTree !== prevProps.documentTree 
        && this.props.documentTree !== null) {
            this.setState({
                dom: generateNestedElements(this.props.documentTree)
            })
        }
    }
    render() {
        const isReady = this.state.dom !== null;
        return (
            <div style={{ width: '30%' }}>
                <NavLink to="/">Home</NavLink><br />
                {isReady ? this.state.dom : <h1>sidebar</h1>}
            </div>
        );
    }
}

function DirLike(props: { fi: FolderItem }) {
    const { fi } = props;
    const [open, setOpen] = useState(true);
    return (
        <>
            <div style={{ cursor: 'pointer' }} onClick={() => setOpen(!open)}>{fi.uriName}</div>
            <div style={{ display: open ? 'block' : 'none' }}>{generateNestedElements(fi.items!)}</div>
        </>
    );
}

function FileLike(props: { fi: FolderItem }) {
    const { fi } = props;
    function toUrl(fditem: FolderItem, baseDir = 'document') {
        return '/' + baseDir + '/' + fditem.urlPath.map((item) => encodeURIComponent(item)).join('/')
    }
    return (
        <NavLink to={toUrl(fi, 'document')} >{fi.uriName}<br></br></NavLink>
    )
}

const generateNestedElements = (items: FolderItem[]) => {
    return items.filter((item) => !item.urlPath.includes("assets")).map((item) => {
        if (item.isDir) {
            return <DirLike key={item.uriName} fi={item} />;
        } else {
            return <FileLike key={item.uriName} fi={item} />;
        }
    });
}

export function getRootUriStrcuture(result: FolderItem[]) {
    function flatten(array: FolderItem[]): FolderItem[] {
        return array.reduce((acc: FolderItem[], val) => {
            return val.isDir ? acc.concat(flatten(val.items!)) : acc.concat(val);
        }, []);
    }
    const flat = flatten(result)
    return flat
}

export default Sidebar;
