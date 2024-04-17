

import styles from "./page.module.css";
import path from "node:path";
import { readFileSync } from "node:fs";

import { micromark } from "micromark";
import { gfm, gfmHtml } from "micromark-extension-gfm";
import { getRootUriStrcuture, type FolderItem } from "./fs"


// 静态路由达不到的直接404
// export const dynamicParams = true

// Return a list of `params` to populate the [slug] dynamic segment
export async function generateStaticParams() {
  const fditems: FolderItem[] = getRootUriStrcuture()
  // console.log(result.length, result)
  const result = fditems.filter(item => !item.isDir)
    .map((item) => ({ slug: item.urlPath.slice(1).map((item) => encodeURIComponent(item)) }))
  const contruct = fditems.filter(item => !item.isDir)
    .map((item) => ({ slug: item.urlPath.slice(1) }))
  // result.concat(contruct)
  // console.log(result.length, result)
  return contruct
}

export default function Home({ params }: { params: { slug?: string[] } }) {
  const { slug } = params
  if(slug === undefined){
    return <div className={styles.mainContent}>这是默认页面</div>
  }
  console.log("*** slug: ", slug)
  
  let slug_str = path.join(process.cwd(), 'markdown', ...slug.map((item) => decodeURIComponent(item)));
  console.log("*** slug_str: %s", slug_str)

  let content = readFileSync(slug_str, "utf8")
  // console.log("*** length: %d", content.length)
  
  content = micromark(content, {
    // extensions: [gfm(), jwObsidian()],
    extensions: [gfm()],
    // htmlExtensions: [gfmHtml(), jwObsidianHtml()],
    htmlExtensions: [gfmHtml()],
  })
  return (
    <div className={styles.mainContent}>
      <div dangerouslySetInnerHTML={{__html: content}}></div>
    </div>
  )
}
