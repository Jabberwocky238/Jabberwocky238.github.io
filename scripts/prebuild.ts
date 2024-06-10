import fs from 'node:fs';
import path from 'node:path';
import { getRootStrcuture } from './basics';
import { prerender, prerender2 } from './prerender'

export const DOC_ROOT_DIR = path.join(process.cwd(), 'scripts')
export const DOC_INPUT_DIR = path.join(process.cwd(), 'scripts', 'markdown')
export const DOC_OUTPUT_DIR = path.join(process.cwd(), 'public', 'markdown')

const DOC_DIRS = ['english']

function main(){
    console.log("[PREBUILD]")
    fs.rmdirSync(DOC_OUTPUT_DIR, { recursive: true })
    DOC_DIRS.forEach((dir) => {
        // 获取目录结构
        const baseFditems = getRootStrcuture(dir)
        // 输出目录结构
        fs.writeFileSync(`./public/json/${dir}.json`, JSON.stringify(baseFditems))
        // 按结构渲染文档
        prerender2(baseFditems, dir)
        // prerender(baseFditems, dir)
    })
}
main()
