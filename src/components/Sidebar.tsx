import { Component, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { observer } from 'mobx-react';
import './Sidebar.css'
import { FileFilled, FolderOpenFilled } from '@ant-design/icons';

export interface SidebarNode {
    showName: string,
    isDir: boolean,
    urlPath?: string,
    children?: SidebarNode[],
}
export type SidebarProps = {
    mktree: () => Promise<SidebarNode[]>,
}

function NestedItem(items: SidebarNode[]) {
    return items.filter((item: SidebarNode) => {
        if (!item.isDir) {
            // console.log(item.showName, item.urlPath)
            return !item.urlPath!.includes("assets")
        } else {
            return !item.showName.includes("assets")
        }
    })
        .map((item: SidebarNode) => {
            if (item.isDir) {
                return <DirLike fi={item} key={item.showName}></DirLike>
            } else {
                return <FileLike fi={item} key={item.showName}></FileLike>
            }
        });
}

function DirLike(props: { fi: SidebarNode }) {
    const [open, setOpen] = useState(false);
    const [isHovering, setIsHovering] = useState(false);
    const { fi } = props;
    return (
        <>
            <div className='sidebar-dirlike'
                onMouseOver={() => setIsHovering(true)}
                onMouseOut={() => setIsHovering(false)}
                onClick={() => setOpen(!open)}>
                <FolderOpenFilled />{fi.showName}
                {isHovering && <div className='sidebar-hover'>{fi.showName}</div>}
            </div>
            <div className='sidebar-nested' style={{
                display: open ? 'block' : 'none',
            }}>{NestedItem(fi.children!)}</div>
        </>
    );
}

function FileLike(props: { fi: SidebarNode }) {
    const { fi } = props;
    const showName = fi.showName.replace(/(\([\w. \-]+\))/g, "");
    console.log(showName)
    const [isHovering, setIsHovering] = useState(false);

    return (<NavLink to={fi.urlPath!} >
        <div className='sidebar-filelike'
            onMouseOver={() => setIsHovering(true)}
            onMouseOut={() => setIsHovering(false)}>
            <FileFilled />{showName}<br></br>
            {isHovering && <div className='sidebar-hover'>{fi.showName}</div>}
        </div>
    </NavLink>)
}

class Sidebar extends Component<SidebarProps> {
    state: {
        sidebarItems: SidebarNode[] | null
    }

    constructor(props: SidebarProps) {
        super(props);
        this.state = {
            sidebarItems: null,
        }
    }
    async componentDidMount() {
        const sidebarItems: SidebarNode[] = await this.props.mktree();
        this.setState({ sidebarItems })
    }
    render() {
        return (
            <div className='sidebar-container'>
                <NavLink to="/">Home</NavLink><br />
                {this.state.sidebarItems !== null
                    ? NestedItem(this.state.sidebarItems)
                    : <h1>sidebar</h1>}
            </div>
        );
    }
}

export default observer(Sidebar);
