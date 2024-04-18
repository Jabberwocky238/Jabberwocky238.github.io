

import styles from "./page.module.css";
import path from "node:path";
import { readFileSync } from "node:fs";

import { micromark } from "micromark";
import { gfm, gfmHtml } from "micromark-extension-gfm";
import { getRootUriStrcuture, type FolderItem } from "./fs"
import { jwObsidian, jwObsidianHtml } from 'jw-obsidian-micromark-extension'

// 静态路由达不到的直接404
// export const dynamicParams = true

const reflexMap = new Map<string, string[]>()

function initReflexMap(){
  getRootUriStrcuture().forEach((item) => {reflexMap.set(item.uriName, item.urlPath)})
}
initReflexMap()

// Return a list of `params` to populate the [slug] dynamic segment
export function generateStaticParams() {
  let fditems: FolderItem[] = getRootUriStrcuture()
  fditems = fditems.filter(item => !item.isDir)
  const result = fditems.map((item) => ({ slug: item.urlPath }))
  // console.log(result.length, result)
  return result
}

export default function Home({ params }: { params: { slug?: string[] } }) {
  const { slug } = params
  if(slug === undefined){
    return <div className={styles.mainContent}>这是默认页面</div>
  }
  // console.log("*** slug: ", slug)
  
  let slug_str = path.join(process.cwd(), 'markdown', ...slug.map((item) => decodeURIComponent(item)));
  // console.log("*** slug_str: %s", slug_str)

  let content = readFileSync(slug_str, "utf8")
  console.log("*** length: %d", content.length)

  content = micromark(content, {
    extensions: [jwObsidian()],
    // extensions: [gfm()],
    htmlExtensions: [jwObsidianHtml({baseDir: 'markdown', reflexMap: reflexMap, extract: (token) => {console.log(token)}})],
    // htmlExtensions: [gfmHtml()],
  })
  
  return (
    <div className={styles.mainContent}>
      <div dangerouslySetInnerHTML={{__html: content}}></div>
    </div>
  )
}
