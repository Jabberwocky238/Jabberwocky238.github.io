import fs from 'node:fs';
import path from 'node:path';

import { jwObsidian, jwObsidianHtml } from 'jw-obsidian-micromark-extension';
import { micromark } from 'micromark';
import { gfmAutolinkLiteral, gfmAutolinkLiteralHtml } from 'micromark-extension-gfm-autolink-literal';
import { getRootUriStrcuture, type FolderItem } from './basics';
import { DOC_INPUT_DIR, DOC_OUTPUT_DIR } from './prebuild';

export function prerender(
    baseFditems: FolderItem[], 
    dir: string, 
) {
    const reflexMap = new Map<string, string[]>();
    const array = getRootUriStrcuture(baseFditems)

    for (let index = 0; index < array.length; index++) {
        reflexMap.set(array[index].uriName, array[index].urlPath)
    }

    // 目录不存在则会导致写入文件时找不到路径
    const curDir = path.join(DOC_OUTPUT_DIR, dir)
    if(!fs.existsSync(curDir)){
        fs.mkdirSync(curDir, { recursive: true })
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

        let html = micromark(text, {
            extensions: [jwObsidian(), gfmAutolinkLiteral()],
            htmlExtensions: [jwObsidianHtml({ 
                edit4image: replacement,
                edit4link: replacement,
            }), gfmAutolinkLiteralHtml()],
        })
        
        if(dir != 'ai'){
            // <swagger>(大摇大摆，神气十足地走)
            html = html.replaceAll('&lt;', '<');
            html = html.replaceAll('&gt;', '>');
            html = html.replaceAll(/<([^\>]*)>\(([^)]*)\)/g, '<span class="origin-text">' + '$1' + '<span class="translated-text">' + '$2' + '</span></span>');
        }
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
        const inputPath = path.join(DOC_INPUT_DIR, ...fditems.urlPath)
        // console.log(outputPath)
        if (fditems.uriName.endsWith(".png")) {
            fs.copyFileSync(inputPath, outputPath)
        }
        else {
            const rawText = fs.readFileSync(inputPath).toString()
            const html = translate2md(rawText)
            fs.writeFileSync(outputPath, html, 'utf8')
            // fs.writeFile(outputPath, html, 'utf8', () => {})
        }
    }
    createDirLike(baseFditems)
}


