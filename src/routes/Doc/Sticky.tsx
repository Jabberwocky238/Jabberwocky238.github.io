import { Component } from 'react';
import counter from './store'
import { observer } from 'mobx-react';

class Sticky extends Component {
    constructor(props: {}) {
        super(props);
    }
    render() {
        return (
            <div style={{
                height: '30px',
                backgroundColor: 'green',
                position: 'sticky',
                top: 0,
                display: 'flex',
                justifyContent: 'space-around',
            }}>
                <div onClick={counter.toggleSidebar}>sidebar</div>
                <div onClick={counter.toggleGraph}>graph</div>
            </div>
        );
    }
}

export default observer(Sticky);