import styles from "./page.module.css";
import { micromark } from "micromark";
import { gfm, gfmHtml } from "micromark-extension-gfm";
import { readFileSync } from "fs";
import { getRootUriStrcuture, type FolderItem } from "./fs"

export const dynamicParams = false

// Return a list of `params` to populate the [slug] dynamic segment
export function generateStaticParams() {
  const fditems: FolderItem[] = getRootUriStrcuture()
  // console.log(result.length, result)
  const result = fditems.filter(item => !item.isDir).map((item) => ({ slug: [item.path] }))
  console.log(result.length, result)
  return result
}

export default function Home({ params }: { params: { slug: string[] } }) {
  const { slug } = params
  if(slug === undefined){
    return <div className={styles.mainContent}>这是默认页面</div>
  }
  let slug_str = decodeURIComponent(slug.join());
  let content = readFileSync(process.cwd() + '/markdown' + slug_str, "utf8")
  console.log("*** slug_str: %s, length: %d", slug_str, content.length)
  
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
