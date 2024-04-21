'use client'

import styles from "./page.module.css";
import { getArticle } from "./components/article";
import { useEffect, useState } from "react";
// const documentContext = createContext<{ slug: string[] }>();

// 静态路由达不到的直接404
// export const dynamicParams = true

export default function Home({params}: {params: { slug?: string[] }}) {
  const { slug } = params
  const [counter, setCounter] = useState(0)
  const [article, setArticle] = useState("")

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        if(slug !== undefined){
          const data = await getArticle(slug); // 确保路径是字符串
          setArticle(data);
        }
      } catch (error) {
        console.error('Error fetching article:', error);
      }
    };

    if (params.slug) {
      fetchArticle();
    }
  }, [params.slug]);

  if(slug === undefined){
    return <div className={styles.mainContent}>这是默认页面</div>
  }
  // const reflexMap = initReflexMap()reflexMap: reflexMap, 
  console.log("*** slug: ", slug)
  
  return (
    <div>
      {counter}
      <button onClick={() => setCounter(counter + 1)}></button>
      {/* <Sidebar></Sidebar> */}
      <div className={styles.mainContent} dangerouslySetInnerHTML={{__html: article}}></div>
    </div>
  )
}
