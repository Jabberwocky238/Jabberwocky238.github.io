import fs from 'node:fs';
import path from 'node:path';

import { jwObsidian, jwObsidianHtml } from 'jw-obsidian-micromark-extension';
import { micromark } from 'micromark';
import { gfmAutolinkLiteral, gfmAutolinkLiteralHtml } from 'micromark-extension-gfm-autolink-literal';
import { getRootUriStrcuture, type FolderItem } from './basics';

export function prerender(
    baseFditems: FolderItem[], 
    DOC_BASE_DIR: string, 
    DOC_OUTPUT_DIR: string, 
) {

    const reflexMap = new Map<string, string[]>();
    const array = getRootUriStrcuture(baseFditems)

    for (let index = 0; index < array.length; index++) {
        reflexMap.set(array[index].uriName, array[index].urlPath)
    }

    const translate2md = (text: string) => {
        const replacement = (token: string) => {
            const url = reflexMap.get(token)
            // console.log(url, token, reflexMap)
            if (url) {
                if (token.endsWith('.png')) {
                    return ['markdown', ...url].join('/')
                }
                return ['#', 'document', ...url].join('/')
            } else {
                if (token.endsWith('.png')) {
                    return ['markdown', token].join('/')
                }
                return ['#', 'document', token].join('/')
            }
        }
        // <ruby> swagger <rp>(</rp><rt>大摇大摆，神气十足地走</rt><rp>)</rp> </ruby>
        // <swagger>(大摇大摆，神气十足地走)
        text = text.replaceAll(/<([^\>]*)>\(([^)]*)\)/g, '<ruby>' + '$1' + '<rp>(</rp>' + '<rt>$2</rt>' + '<rp>)</rp></ruby>');
        // text = text.replaceAll('&lt;', '<');

        let html = micromark(text, {
            extensions: [jwObsidian(), gfmAutolinkLiteral()],
            htmlExtensions: [jwObsidianHtml({ replacement }), gfmAutolinkLiteralHtml()],
        })
        html = html.replaceAll('&lt;', '<');
        html = html.replaceAll('&gt;', '>');
        return html
    }


    const createDirLike = (fditems: FolderItem[]) => {
        fditems.forEach((item) => {
            if (item.isDir && item.items !== undefined) {
                const dirPath = path.join(DOC_OUTPUT_DIR, ...item.urlPath)
                // fs.mkdir(dirPath, { recursive: true }, () => {})
                fs.mkdirSync(dirPath, { recursive: true })
                createDirLike(item.items)
            } else {
                createRenderedHtml(item)
            }
        })
    }

    const createRenderedHtml = (fditems: FolderItem) => {
        const outputPath = path.join(DOC_OUTPUT_DIR, ...fditems.urlPath)
        const inputPath = path.join(DOC_BASE_DIR, ...fditems.urlPath)
        // console.log(outputPath)
        if (fditems.uriName.endsWith(".png")) {
            fs.copyFileSync(inputPath, outputPath)
        }
        else {
            const rawText = fs.readFileSync(inputPath).toString()
            const html = translate2md(rawText)
            fs.writeFileSync(outputPath, html, 'utf8')
        }
    }
    createDirLike(baseFditems)
}


