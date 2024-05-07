import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

function Doc() {
    const location = useLocation();
    const [html, setHtml] = useState('')

    useEffect(() => {
        fetchData();
    }, [location.pathname])

    const assetPathList = location.pathname.split('/').slice(2)
    const assetPath = ['markdown', ...assetPathList].join('/')
    const titleFileName = assetPathList[assetPathList.length - 1]
    const title = decodeURIComponent(titleFileName.split('.')[0])

    const fetchData = async () => {
        console.log("fetchData", assetPath)
        const res = await fetch(`/${assetPath}`)
        const text = await res.text()
        setHtml(text)
    }

    console.log("Doc render")
    return (
        <>
            <h1>{title}</h1>
            <div dangerouslySetInnerHTML={{ __html: html }}></div>
        </>
    );
}

export default Doc;
