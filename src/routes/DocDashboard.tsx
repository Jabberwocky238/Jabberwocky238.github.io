import React from 'react';
import { useLocation } from 'react-router-dom';
import Sidebar from './Sidebar'

function DocDashboard() {
    let location = useLocation();
    const [html, setHtml] = React.useState('')

    // console.log(location.pathname)
    const assetPathList = location.pathname.split('/').slice(2)
    const assetPath = ['markdown', ...assetPathList].join('/')
    console.log(assetPath)
    fetch(`/${assetPath}`)
        .then(res => res.text())
        .then(text => {
            setHtml(text)
        })

    return (
        <div className="App">
            <Sidebar />
            <div style={{width: '70%'}}>
                <h1>{assetPath}</h1>
                {html}
            </div>
        </div>
    );
}

export default DocDashboard;
