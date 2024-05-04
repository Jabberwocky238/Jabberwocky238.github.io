import { Component } from 'react';
import counter from './store'
import { observer } from 'mobx-react';
import Button from '@/components/Button';

class Sticky extends Component {
    constructor(props: {}) {
        super(props);
    }
    render() {
        return (
            <div style={{
                // height: '30px',
                backgroundColor: 'rgba(0,0,0,0.5)',
                boxShadow: '0 0 5px 0 rgba(0,0,0,0.5)',
                position: 'sticky',
                top: '-5px',
                display: 'flex',
                justifyContent: 'space-around',
            }}>
                <Button color='rgb(47, 255, 24)' onClick={counter.toggleSidebar}>
                    sidebar
                </Button>
                <Button color='tomato' onClick={counter.toggleGraph}>
                    graph
                </Button>
            </div>
        );
    }
}

export default observer(Sticky);