import React from 'react';
import { useLocation } from 'react-router-dom';
import { micromark } from 'micromark';
import { jwObsidian, jwObsidianHtml } from 'jw-obsidian-micromark-extension';

function Doc() {
    let location = useLocation();
    const [html, setHtml] = React.useState('')

    // console.log(location.pathname)
    const assetPathList = location.pathname.split('/').slice(2)
    const assetPath = ['markdown', ...assetPathList].join('/')
    const title = decodeURIComponent(assetPathList[assetPathList.length - 1])
    
    console.log(assetPath)
    fetch(`/${assetPath}`)
        .then(res => res.text())
        .then(text => {
            text = text.length === 0 ? '' : text
            const html = micromark(text, {
                extensions: [],//jwObsidian()
                htmlExtensions: [jwObsidianHtml({
                    baseDir: 'markdown', 
                    extract: (token) => {console.log(token)},
                })]
            })
            setHtml(html)
        })

    return (
        <div style={{width: '70%'}}>
            <h1>{title}</h1>
            <div dangerouslySetInnerHTML={{__html: html}}></div>
        </div>
    );
}

export default Doc;
