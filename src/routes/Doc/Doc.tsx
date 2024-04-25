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
import {gfmAutolinkLiteral, gfmAutolinkLiteralHtml } from 'micromark-extension-gfm-autolink-literal';

import {initReflexMap,  type FolderItem} from './_base'

interface DocProps {
    className: string
}

function Doc(props: DocProps) {
    let location = useLocation();
    const [html, setHtml] = useState('')
    const reflexMap = new Map<string, string[]>()

    useEffect(() => {
        fetchData();
    }, [location.pathname])

    const assetPathList = location.pathname.split('/').slice(2)
    const assetPath = ['markdown', ...assetPathList].join('/')
    const title = decodeURIComponent(assetPathList[assetPathList.length - 1])

    const fetchData = async () => {
        console.log("fetchData", assetPath)
        if(reflexMap.size === 0){
            // console.log(111)
            const rawflat = await fetch(`/flat.json`)
            const textflat = await rawflat.text()
            const fditems: FolderItem[] = JSON.parse(textflat)
            initReflexMap(fditems, reflexMap)
        }

        const replacement = (token: string) => {
            const url = reflexMap.get(token)
            // console.log(url, token, reflexMap)
            if(url){
                if(token.endsWith('.png')){
                    return ['markdown', ...url].join('/')
                }
                return ['#', 'document', ...url].join('/')
            }else{
                if(token.endsWith('.png')){
                    return ['markdown', token].join('/')
                }
                return ['#', 'document', token].join('/')
            }
        }
        
        // console.log(assetPath)
        const res = await fetch(`/${assetPath}`)
        const blob = await res.blob()
        const text = await blob.text()
        
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
            extensions: [jwObsidian(), gfmAutolinkLiteral()],
            htmlExtensions: [jwObsidianHtml({ replacement }), gfmAutolinkLiteralHtml()],
        })
        setHtml(html)
    }

    return (
        <div className={props.className}>
            <h1>{title}</h1>
            <div dangerouslySetInnerHTML={{ __html: html }}></div>
        </div>
    );
}

export default Doc;
