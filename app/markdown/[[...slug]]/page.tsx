import styles from "./page.module.css";
import { micromark } from "micromark";
import { gfm, gfmHtml } from "micromark-extension-gfm";
import { readFileSync } from "fs";

// Return a list of `params` to populate the [slug] dynamic segment
// export function generateStaticParams() {
//   return [{ slug: '1' }, { slug: '2' }, { slug: '3' }]
// }

export default function Home({ params }: { params: { slug: string[] } }) {
  const { slug } = params
  if(slug === undefined){
    return <div className={styles.mainContent}>ttfyghuij</div>
  }
  let slug_str = slug.join('/')
  slug_str = decodeURIComponent(slug_str);
  let content = readFileSync(process.cwd() + "/markdown/" + slug_str, "utf8")
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
