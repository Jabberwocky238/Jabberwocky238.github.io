import { type FolderItem } from './store'
import { Component } from 'react';

import Sidebar from './Sidebar'
import Doc from './DocMain'
import Sticky from './Sticky';
import Graph from './Graph';

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
            <>
                <Sticky />
                <div style={{
                    display: 'flex',
                    textAlign: 'start',
                }}>
                    <div style={{ width: '30%'}}>
                        <Sidebar documentTree={this.state.documentTree} />
                    </div>
                    <div style={{ width: '40%' }}>
                        <Doc />
                    </div>
                    <div style={{ width: '30%' }}>
                        <Graph />
                    </div>
                </div>
            </>
        );
    }
}

export default DocDashboard;
