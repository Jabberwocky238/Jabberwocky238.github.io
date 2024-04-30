import { Component, ReactNode, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { type FolderItem } from './store'
import counter from './store'
import { observer } from 'mobx-react';

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
            dom: null,
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
            <div style={{
                width: '30%',
                display: counter.sidebarShow ? 'block' : 'none',
                height: '100%',
                overflow: 'auto',
            }}>
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
            <div style={{ cursor: 'pointer', backgroundColor: 'purple' }} onClick={() => setOpen(!open)}>{fi.uriName}</div>
            <div style={{ display: open ? 'block' : 'none', padding: '10px' }}>{generateNestedElements(fi.items!)}</div>
        </>
    );
}

function FileLike(props: { fi: FolderItem }) {
    const { fi } = props;
    function toUrl(fditem: FolderItem, baseDir = 'document') {
        return '/' + baseDir + '/' + fditem.urlPath.map((item) => encodeURIComponent(item)).join('/')
    }
    return (
        <NavLink to={toUrl(fi, 'document')} >{fi.uriName.split('.')[0]}<br></br></NavLink>
    )
}


function generateNestedElements(items: FolderItem[]) {
    return items.filter((item) => !item.urlPath.includes("assets")).map((item) => {
        if (item.isDir) {
            return <DirLike key={item.uriName} fi={item} />;
        } else {
            return <FileLike key={item.uriName} fi={item} />;
        }
    });
}

export default observer(Sidebar);
