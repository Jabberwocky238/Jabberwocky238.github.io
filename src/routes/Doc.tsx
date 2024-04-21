import React from 'react';
import { useSearchParams, useLocation } from 'react-router-dom';
import { useParams } from 'react-router-dom';

function Doc() {
    let location = useLocation();
    const [html, setHtml] = React.useState('')

    // console.log(location.pathname)
    const assetPathList = location.pathname.split('/').slice(2)
    const assetPath = ['markdown', ...assetPathList].join('/')
    console.log(assetPath)
    fetch(`http://localhost:3000/${assetPath}`)
        .then(res => res.text())
        .then(text => {
            setHtml(text)
        })

    return (
        <div className="App">
            <header className="App-header">
                <h1>{assetPath}</h1>
                {html}
            </header>
        </div>
    );
}

export default Doc;
