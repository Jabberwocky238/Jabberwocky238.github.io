import Sidebar from './Sidebar'
import Doc from './Doc'
import { CSSProperties } from 'react';

const _CSS: CSSProperties = {
    width: '100%', 
    display: 'flex', 
    flexDirection: 'row',
    textAlign: 'start',
    justifyContent: 'normal',
}

function DocDashboard() {
    return (
        <div style={_CSS}>
            <Sidebar />
            <Doc />
        </div>
    );
}

export default DocDashboard;
