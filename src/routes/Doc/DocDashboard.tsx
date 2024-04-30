import { type FolderItem } from './store'
import { Component } from 'react';


import Sidebar from './Sidebar'
import Doc from './DocMain'
import Sticky from './Sticky';
import Graph from './Graph';

import './_style.css'

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
    async componentDidMount() {
        // console.log("[DocDashboard] componentDidMount")
        const raw = await fetch(`/json/flat.json`)
        const text = await raw.text()
        const fditems: FolderItem[] = JSON.parse(text)
        this.setState({ documentTree: fditems })
    }
    render() {
        return (
            <div className='dashboard'>
                <Sticky />
                <main>
                    <Sidebar documentTree={this.state.documentTree} />
                    <div style={{ width: '40%' }}>
                        <Doc />
                    </div>
                    <Graph />
                </main>
            </div>
        );
    }
}

export default DocDashboard;
