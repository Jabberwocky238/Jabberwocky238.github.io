import { type FolderItem } from './store'
import { type SidebarNode } from '@/components/Sidebar';
import { Component } from 'react';

import Sidebar from '@/components/Sidebar';
import counter from './store'
import Doc from './DocMain'
import Sticky from './Sticky';
import Graph from './Graph';

import './_style.scss'
import { observer } from 'mobx-react';

class DocDashboard extends Component {
    state: {
        documentTree: FolderItem[] | null
    }
    constructor(props: {}) {
        super(props);
        this.state = {
            documentTree: null,
        }
    }
    async mktree() {
        const raw = await fetch(`/json/flat.json`)
        const text = await raw.text()
        const fditems: FolderItem[] = JSON.parse(text)
        const convertAll = (fditems: FolderItem[]): SidebarNode[] => {
            return fditems.map((item) => {
                return convert(item)
            })
        }
        const convert = (fditems: FolderItem): SidebarNode => {
            return {
                showName: fditems.uriName.split('.')[0],
                isDir: fditems.isDir,
                urlPath: fditems.urlPath.join('/'),
                children: fditems.items ? convertAll(fditems.items) : undefined,
            } as SidebarNode
        }
        return convertAll(fditems)
    }
    render() {
        return (
            <div className='doc-container'>
                <Sticky />
                <main>
                    <div className='doc-sidebar' style={{
                        display: counter.sidebarShow ? 'block' : 'none',
                    }}>
                        <Sidebar mktree={this.mktree}></Sidebar>
                    </div>
                    <div className='doc-main' style={{
                        margin: counter.sidebarShow ? '0' : 'auto',
                    }}>
                        <Doc />
                    </div>
                    <div className='doc-graph' style={{ 
                        display: counter.graphShow ? 'block' : 'none' 
                    }}>
                        <Graph />
                    </div>
                </main>
            </div>
        );
    }
}

export default observer(DocDashboard);
