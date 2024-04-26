import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

interface DocProps {
    className: string
}

function Doc(props: DocProps) {
    let location = useLocation();
    const [html, setHtml] = useState('')

    useEffect(() => {
        fetchData();
    }, [location.pathname])

    const assetPathList = location.pathname.split('/').slice(2)
    const assetPath = ['markdown', ...assetPathList].join('/')
    const title = decodeURIComponent(assetPathList[assetPathList.length - 1])

    const fetchData = async () => {
        console.log("fetchData", assetPath)
        // console.log(assetPath)
        const res = await fetch(`/${assetPath}`)
        const text = await res.text()
        setHtml(text)
    }

    return (
        <div className={props.className}>
            <h1>{title}</h1>
            <div dangerouslySetInnerHTML={{ __html: html }}></div>
        </div>
    );
}

export default Doc;
