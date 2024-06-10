import fs from 'node:fs';
import path from 'node:path';

import { translate2md } from './utils';
import { getRootUriStrcuture, type FolderItem } from './basics';
import { DOC_INPUT_DIR, DOC_OUTPUT_DIR, DOC_ROOT_DIR } from './prebuild';

interface fileInfo {
    mtime: string;
    ino: number;
    uriName: string;
}

export function modify_control(baseFditems: FolderItem[]) {
    let rootStructure = getRootUriStrcuture(baseFditems)
    const mtimes_path = path.join(DOC_ROOT_DIR, 'mtime.json')

    let mtimes: fileInfo[] = JSON.parse(fs.readFileSync(mtimes_path, 'utf-8'));
    rootStructure = rootStructure.filter((item) => {
        const urlPath = path.join(DOC_INPUT_DIR, ...item.urlPath);
        const info = fs.statSync(urlPath);
        const that_one = mtimes.find((item) => item.ino === info.ino)
        if (that_one) {
            if (that_one.uriName !== item.uriName) {
                console.log(`[rename] ${that_one.uriName} => ${item.uriName}`)
                that_one.uriName = item.uriName
            }
            if (that_one.mtime === info.mtime.toISOString()) {
                return false;
            } else {
                that_one.mtime = info.mtime.toISOString();
                console.log(`[update] ${that_one.uriName}`)
            }
        } else {
            console.log(`[new] ${item.uriName} == fullpath => ${urlPath}`)
            mtimes.push({
                mtime: info.mtime.toISOString(),
                ino: info.ino,
                uriName: item.uriName,
            })
        }
        return true;
    })
    fs.writeFileSync(mtimes_path, JSON.stringify(mtimes))
    return rootStructure
}

export function prerender(
    baseFditems: FolderItem[],
    dir: string,
) {
    const reflexMap = new Map<string, string[]>();
    const rootStructure = modify_control(baseFditems)

    for (let index = 0; index < rootStructure.length; index++) {
        reflexMap.set(rootStructure[index].uriName, rootStructure[index].urlPath)
    }

    // 目录不存在则会导致写入文件时找不到路径
    const curDir = path.join(DOC_OUTPUT_DIR, dir)
    if (!fs.existsSync(curDir)) {
        fs.mkdirSync(curDir, { recursive: true })
    }

    const createDirLike = (fditems: FolderItem[]) => {
        fditems.forEach((item) => {
            if (item.isDir && item.items !== undefined) {
                const dirPath = path.join(DOC_OUTPUT_DIR, ...item.urlPath)
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
            const html = translate2md(rawText, reflexMap)
            fs.writeFileSync(outputPath, html, 'utf8')
            // fs.writeFile(outputPath, html, 'utf8', () => {})
        }
    }
    createDirLike(baseFditems)
}


