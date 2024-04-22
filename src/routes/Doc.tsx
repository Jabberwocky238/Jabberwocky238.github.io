import React from 'react';
import { useLocation } from 'react-router-dom';
import { micromark } from 'micromark';
import { jwObsidian, jwObsidianHtml } from 'jw-obsidian-micromark-extension';
import type { FolderItem } from './Sidebar';

export function getRootUriStrcuture(result: FolderItem[]) {
    function flatten(array: FolderItem[]): FolderItem[] {
        return array.reduce((acc: FolderItem[], val) => {
            return val.isDir ? acc.concat(flatten(val.items!)) : acc.concat(val);
        }, []);
    }
    const flat = flatten(result)
    return flat
}

function Doc() {
    let location = useLocation();
    const [html, setHtml] = React.useState('')

    // console.log(location.pathname)
    try{
        const assetPathList = location.pathname.split('/').slice(2)
        const assetPath = ['markdown', ...assetPathList].join('/')
        const title = decodeURIComponent(assetPathList[assetPathList.length - 1])

        console.log(assetPath)
        fetch(`/${assetPath}`)
            .then(res => res.text())
            .then(text => {
                const html = micromark(text, {
                    extensions: [],//jwObsidian()
                    htmlExtensions: [jwObsidianHtml({
                        baseDir: 'markdown', 
                        extract: (token) => {console.log(token)},
                    })]
                })
                setHtml(html)
            }).catch((err) => {
                setHtml(err)
            })
    
        return (
            <div style={{width: '70%'}}>
                <h1>{title}</h1>
                <div dangerouslySetInnerHTML={{__html: html}}></div>
            </div>
        );
    }catch(err) {
        return (
            <div style={{width: '70%'}}>
                <h1>{err as string}</h1>
                <div dangerouslySetInnerHTML={{__html: html}}></div>
            </div>
        );
    }
}

export default Doc;
