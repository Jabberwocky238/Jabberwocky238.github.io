import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// import { unified } from 'unified';
// import remarkParse from 'remark-parse';
// import remarkGfm from 'remark-gfm'
// import remarkRehype from 'remark-rehype';
// import rehypeStringify from 'rehype-stringify';
// import wikiLinkPlugin from 'remark-wiki-link';

import { micromark } from 'micromark';
import { jwObsidian, jwObsidianHtml } from 'jw-obsidian-micromark-extension';

import {initReflexMap,  type FolderItem} from './_base'

function Doc() {
    let location = useLocation();
    const [html, setHtml] = useState('')
    const [reflexMap, setReflexMap] = useState(new Map<String, String[]>())
    useEffect(() => {
        fetchData();
    }, [location.pathname])

    const assetPathList = location.pathname.split('/').slice(2)
    const assetPath = ['markdown', ...assetPathList].join('/')
    const title = decodeURIComponent(assetPathList[assetPathList.length - 1])

    const fetchData = async () => {
        // console.log("fetchData", assetPath)
        if(reflexMap.size === 0){
            // console.log(111)
            const rawflat = await fetch(`/flat.json`)
            const textflat = await rawflat.text()
            const fditems: FolderItem[] = JSON.parse(textflat)
            setReflexMap(initReflexMap(fditems))
        }
        
        // console.log(assetPath)
        const res = await fetch(`/${assetPath}`)
        const text = await res.text()
        // const html = await unified()
        // .use(remarkParse)
        // .use(remarkRehype)
        // .use(remarkGfm)
        // .use(rehypeStringify)
        // .use(wikiLinkPlugin, {
        //     hrefTemplate: (permalink: string) => {
        //         // console.log(reflexMap, permalink+'.md')
        //         const candidate = reflexMap.get(permalink+'.md')
        //         // console.log(candidate)
        //         if (candidate) {
        //             return `#/document/${candidate.join('/')}`
        //         }else{
        //             return `#/document/${permalink}`
        //         }
        //     }
        // })
        // .process(text)
        // setHtml(String(html))

        const html = micromark(text, {
            extensions: [jwObsidian()],
            htmlExtensions: [jwObsidianHtml()],
        })
        setHtml(html)
    }

    return (
        <div style={{ width: '70%' }}>
            <h1>{title}</h1>
            <div dangerouslySetInnerHTML={{ __html: html }}></div>
        </div>
    );
}

export default Doc;
