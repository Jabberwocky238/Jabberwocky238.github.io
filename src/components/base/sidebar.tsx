import { getRootStrcuture, type FolderItem, toUrl } from './fs'
import { useState } from 'react';

function DirLike(props: {fi: FolderItem}) {
    const { fi } = props;
    const [show, setShow] = useState(true);
    const onclick = () => {
        console.log("6666")
        setShow(!show)
    };
    return (
        <>
            <div style={{ cursor: 'pointer', color: 'red'}} onClick={onclick}>{fi.uriName}</div>
            <div style={{ display: show ? 'block' : 'none' }}>{generateNestedElements(fi.items!)}</div>
        </>
    );
}

function FileLike(props: {fi: FolderItem}) {
    const { fi } = props;
    return (
        <a href={toUrl(fi, 'markdown')} >{fi.uriName}<br></br></a>
    )
}

const generateNestedElements = (items: FolderItem[]) => {
    return items.filter((item) => !item.uriName.endsWith(".png")).map((item) => {
        if (item.isDir) {
            return <DirLike key={item.uriName} fi={item}/>;
        } else {
            return <FileLike key={item.uriName} fi={item}/>;
        }
    });
}

export default function Sidebar(props: { items: FolderItem[] }) {
    const { items } = props
    const nestedElements = generateNestedElements(items);
    return (
        <div style={{
            width: '30%'
        }}>
            {nestedElements}
        </div>
    );
}