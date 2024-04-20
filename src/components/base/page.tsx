import path from "node:path";
import { readFileSync } from "node:fs";

import { micromark } from "micromark";
// import { gfm, gfmHtml } from "micromark-extension-gfm";
import { getRootUriStrcuture, type FolderItem } from "./fs"
import { jwObsidian, jwObsidianHtml } from 'jw-obsidian-micromark-extension'

// 静态路由达不到的直接404
// export const dynamicParams = true

function initReflexMap(){
  const reflexMap = new Map<string, string[]>()
  getRootUriStrcuture().forEach((item) => {
    reflexMap.set(item.uriName, item.urlPath
  )})
  return reflexMap
}

export default function Home(props: { slug?: string[] }) {
  const { slug } = props
  if(slug === undefined){
    return <div>这是默认页面</div>
  }
  const reflexMap = initReflexMap()
  // console.log("*** slug: ", slug)
  
  let slug_str = path.join(process.cwd(), 'src/content/markdown', ...slug.map((item) => decodeURIComponent(item)));
  // console.log("*** slug_str: %s", slug_str)

  let content = readFileSync(slug_str, "utf8")
  // console.log("*** length: %d", content.length)
  
  content = micromark(content, {
    extensions: [jwObsidian()],
    // extensions: [gfm()],
    htmlExtensions: [jwObsidianHtml({baseDir: 'markdown', reflexMap: reflexMap, extract: (token) => {console.log(token)}})],
    // htmlExtensions: [gfmHtml()],
  })
  
  return (
    <div style={{ width: '70%' }}>
      <div dangerouslySetInnerHTML={{__html: content}}></div>
    </div>
  )
}
