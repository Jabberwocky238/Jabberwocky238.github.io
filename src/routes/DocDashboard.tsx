import Sidebar, { FolderItem } from './Sidebar'
import Doc from './Doc'
import { CSSProperties, Component } from 'react';


const _CSS: CSSProperties = {
    width: '100%', 
    display: 'flex', 
    flexDirection: 'row',
    textAlign: 'start',
    justifyContent: 'normal',
}

class DocDashboard extends Component {
    state: { 
        documentTree: FolderItem[] | null
    }
    constructor(props: {}) {
        super(props);
        this.state = {
            documentTree: null
        }
    }
    async componentDidMount() {
        console.log("[DocDashboard] componentDidMount")
        const raw = await fetch(`/flat.json`)
        const text = await raw.text()
        const fditems: FolderItem[] = JSON.parse(text)
        this.setState({ documentTree: fditems })
    }
    render() {
        return (
            <div style={_CSS}>
                <Sidebar documentTree={this.state.documentTree}/>
                <Doc />
            </div>
        );
    }
}

export default DocDashboard;
