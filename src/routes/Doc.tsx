import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { micromark } from 'micromark';

import { jwObsidian, jwObsidianHtml } from 'jw-obsidian-micromark-extension';
import { gfmAutolinkLiteral, gfmAutolinkLiteralHtml } from 'micromark-extension-gfm-autolink-literal'

import { type FolderItem, getRootUriStrcuture } from './Sidebar';

function initReflexMap(result: FolderItem[]){
    const reflexMap = new Map<string, string[]>()
    getRootUriStrcuture(result).forEach((item) => {
      reflexMap.set(item.uriName, item.urlPath
    )})
    return reflexMap
}

function Doc(props: { result: FolderItem[] | null}) {
    let location = useLocation();
    const [html, setHtml] = useState('')

    const assetPathList = location.pathname.split('/').slice(2)
    const assetPath = ['markdown', ...assetPathList].join('/')
    const title = decodeURIComponent(assetPathList[assetPathList.length - 1])

    const fetchData = async () => {
        console.log("fetchData", assetPath)
        const res = await fetch(`/${assetPath}`)
        const text = await res.text()
        const reflexMap = props.result !== null ? initReflexMap(props.result) : undefined
        console.log(reflexMap)

        try {
            const html = micromark(text, {
                extensions: [gfmAutolinkLiteral(), jwObsidian()],
                htmlExtensions: [gfmAutolinkLiteralHtml(), jwObsidianHtml({
                    baseDir: 'markdown',
                    reflexMap: reflexMap,
                    extract: (token) => { console.log(token) },
                })],
            })
            setHtml(html)
        } catch {
            setHtml("micromark解析失败")
        }
    }

    useEffect(() => {
        fetchData();
    }, [location.pathname, props.result])

    return (
        <div style={{ width: '70%' }}>
            <h1>{title}</h1>
            <div dangerouslySetInnerHTML={{ __html: html }}></div>
        </div>
    );
}

export default Doc;
