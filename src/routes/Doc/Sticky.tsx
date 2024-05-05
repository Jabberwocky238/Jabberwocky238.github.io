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
            <div className='tab'>
                <Button color='aqua' navigateTo='/'>
                    Home
                </Button>
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