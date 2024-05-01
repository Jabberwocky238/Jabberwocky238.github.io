import fs from 'node:fs';
import path from 'node:path';
import { FolderItem, getRootStrcuture } from './basics';
import { prerender } from './prerender'

const DOC_BASE_DIR = path.join(process.cwd(), 'scripts', 'assets', 'markdown')
const DOC_OUTPUT_DIR = path.join(process.cwd(), 'public', 'markdown')

// interface D3Node {

// }

function getD3data(fditems: FolderItem[]): FolderItem[] {
    return fditems
}

function main(){
    console.log("[PREBUILD]")
    const baseFditems = getRootStrcuture(DOC_BASE_DIR)
    fs.writeFileSync('./public/json/flat.json', JSON.stringify(getD3data(baseFditems)))
    prerender(baseFditems, DOC_BASE_DIR, DOC_OUTPUT_DIR)
}
main()