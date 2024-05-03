import { type FolderItem } from './store'
import { type SidebarNode } from '@/components/Sidebar';
import { Component } from 'react';

import Sidebar from '@/components/Sidebar';
import counter from './store'
import Doc from './DocMain'
import Sticky from './Sticky';
import Graph from './Graph';

import './_style.css'
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
            <div className='dashboard'>
                <Sticky />
                <main>
                    <div style={{
                        width: '30%',
                        display: counter.sidebarShow ? 'block' : 'none',
                        height: '100%',
                        overflow: 'auto',
                    }}>
                        <Sidebar mktree={this.mktree}></Sidebar>
                    </div>
                    <div style={{ width: '40%' }}>
                        <Doc />
                    </div>
                    <div style={{ 
                        width: '60%', 
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
