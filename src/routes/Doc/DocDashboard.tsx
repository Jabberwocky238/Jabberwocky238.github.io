import { type FolderItem} from './_base'
import Sidebar from './Sidebar'
import Doc from './Doc'
import { Component } from 'react';

class DocDashboard extends Component {
    state: { 
        documentTree: FolderItem[] | null
        sidebarOpen: boolean
    }
    constructor(props: {}) {
        super(props);
        this.state = {
            documentTree: null,
            sidebarOpen: false,
        }
    }
    async componentDidMount() {
        // console.log("[DocDashboard] componentDidMount")
        const raw = await fetch(`/flat.json`)
        const text = await raw.text()
        const fditems: FolderItem[] = JSON.parse(text)
        this.setState({ documentTree: fditems })
    }
    render() {
        const opensidebarClick = () => this.setState({ sidebarOpen: !this.state.sidebarOpen })
        const sidebarClass = 'doc-sidebar ' + (this.state.sidebarOpen ? 'doc-sidebar-close' : 'doc-sidebar-open')
        const docClass = 'doc-doc'
        return (
            <>
            <div onClick={opensidebarClick} className='doc-sidebar-open-button'>opensidebar</div>
            <div className="doc-base">
                <Sidebar className={sidebarClass} documentTree={this.state.documentTree} />
                <Doc className={docClass} />
                <div className='doc-sidebar'></div>
            </div>
            </>
        );
    }
}

export default DocDashboard;
