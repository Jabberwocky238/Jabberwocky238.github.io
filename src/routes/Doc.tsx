import React from 'react';
import { useLocation } from 'react-router-dom';
import { micromark } from 'micromark';

import { jwObsidian, jwObsidianHtml } from 'jw-obsidian-micromark-extension';
import { gfmAutolinkLiteral, gfmAutolinkLiteralHtml } from 'micromark-extension-gfm-autolink-literal'

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
    try {
        const assetPathList = location.pathname.split('/').slice(2)
        const assetPath = ['markdown', ...assetPathList].join('/')
        const title = decodeURIComponent(assetPathList[assetPathList.length - 1])
        // console.log(assetPath)

        const fetchData = async () => {
            const res = await fetch(`/${assetPath}`)
            const text = await res.text()
            const html = micromark(text, {
                extensions: [gfmAutolinkLiteral(), ],//jwObsidian()
                htmlExtensions: [jwObsidianHtml({
                    baseDir: 'markdown',
                    extract: (token) => { console.log(token) },
                }), gfmAutolinkLiteralHtml()],
                allowDangerousHtml: true,
            })
            setHtml(html)
        }
        fetchData();

        return (
            <div style={{ width: '70%' }}>
                <h1>{title}</h1>
                <div dangerouslySetInnerHTML={{ __html: html }}></div>
            </div>
        );
    } catch (err) {
        console.error(err)
        return (
            <div style={{ width: '70%' }}>
                <div>请求资源失败，或许是不存在</div>
            </div>
        );
    }
}

export default Doc;
