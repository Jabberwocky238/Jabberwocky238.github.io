import { Component, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { observer } from 'mobx-react';

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

function DirLike(props: { fi: SidebarNode}) {
    const [open, setOpen] = useState(true);
    const toggle = () => {
        console.log("toggle")
        setOpen(!open)
    }
    const { fi } = props;
    return (
        <>
            <div style={{
                cursor: 'pointer',
                backgroundColor: 'purple'
            }} onClick={toggle}>
                <FolderOpenFilled />{fi.showName}
            </div>
            <div style={{
                display: open ? 'block' : 'none',
                paddingLeft: '1em',
            }}>{NestedItem(fi.children!)}</div>
        </>
    );
}

function FileLike(props: { fi: SidebarNode }) {
    const { fi } = props;
    return (<>
        <FileFilled />
        <NavLink to={fi.urlPath!} >{fi.showName}<br></br></NavLink>
    </>)
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
            <div >
                <NavLink to="/">Home</NavLink><br />
                {this.state.sidebarItems !== null
                    ? NestedItem(this.state.sidebarItems)
                    : <h1>sidebar</h1>}
            </div>
        );
    }
}

export default observer(Sidebar);
