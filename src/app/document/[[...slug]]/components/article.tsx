'use server'

import { micromark } from "micromark";
import { jwObsidian, jwObsidianHtml } from 'jw-obsidian-micromark-extension'
import { initReflexMap } from "./fs";
import { readFileSync } from "fs";
import path from "path";

export async function getArticle(slug: string[]) {
    const reflexMap = initReflexMap()
    const pth = path.join(...[process.cwd(), "public", 'markdown', ...slug])
    let content = readFileSync(pth, 'utf-8')

    content = micromark(content, {
        extensions: [jwObsidian()],
        // extensions: [gfm()],
        htmlExtensions: [jwObsidianHtml({ baseDir: 'markdown', reflexMap, extract: (token) => { console.log(token) } })],
        // htmlExtensions: [gfmHtml()],
    })

    return content
}