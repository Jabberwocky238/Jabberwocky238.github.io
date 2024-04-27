import fs from 'node:fs';
import path from 'node:path';

import { jwObsidian, jwObsidianHtml } from 'jw-obsidian-micromark-extension';
import { micromark } from 'micromark';
import { gfmAutolinkLiteral, gfmAutolinkLiteralHtml } from 'micromark-extension-gfm-autolink-literal';
import { type FolderItem, getRootStrcuture } from './basics';

const DOC_BASE_DIR = path.join(process.cwd(), 'scripts', 'assets', 'markdown')
const DOC_OUTPUT_DIR = path.join(process.cwd(), 'public', 'markdown')
const reflexMap = new Map<string, string[]>();

console.log("我擦")

function translate2md(text: string){
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

    const html = micromark(text, {
        extensions: [jwObsidian(), gfmAutolinkLiteral()],
        htmlExtensions: [jwObsidianHtml({ replacement }), gfmAutolinkLiteralHtml()],
    })
    return html
}


function initReflexMap(result: FolderItem[]){
    function getRootUriStrcuture(result: FolderItem[]) {
        function flatten(array: FolderItem[]): FolderItem[] {
            return array.reduce((acc: FolderItem[], val) => {
                return val.isDir ? acc.concat(flatten(val.items!)) : acc.concat(val);
            }, []);
        }
        const flat = flatten(result)
        return flat
    }
    const array = getRootUriStrcuture(result)
    for (let index = 0; index < array.length; index++) {
        reflexMap.set(array[index].uriName, array[index].urlPath)
    }
}

function createDirLike(fditems: FolderItem[]){
    fditems.forEach((item) => {
        if(item.isDir && item.items !== undefined){
            const dirPath = path.join(DOC_OUTPUT_DIR, ...item.urlPath)
            // fs.mkdir(dirPath, { recursive: true }, () => {})
            fs.mkdirSync(dirPath, { recursive: true })
            createDirLike(item.items)
        }else{
            createRenderedHtml(item)
        }
    })
}
function createRenderedHtml(fditems: FolderItem) {
    const outputPath = path.join(DOC_OUTPUT_DIR, ...fditems.urlPath)
    const inputPath = path.join(DOC_BASE_DIR, ...fditems.urlPath)
    // console.log(outputPath)
    if(fditems.uriName.endsWith(".png")){
        fs.copyFileSync(inputPath, outputPath)
    }
    else{
        const rawText = fs.readFileSync(inputPath).toString()
        const html = translate2md(rawText)
        fs.writeFileSync(outputPath, html, 'utf8')
    }
}

function main(){
    const baseFditems = getRootStrcuture(DOC_BASE_DIR)
    fs.writeFileSync('./public/flat.json', JSON.stringify(baseFditems))
    initReflexMap(baseFditems)
    createDirLike(baseFditems)
}
main()