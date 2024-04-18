import { getRootStrcuture, type FolderItem } from './fs'
import styles from "./page.module.css";
import React from 'react';
import Link from 'next/link';

function DirLike(props: {fi: FolderItem}) {
    const { fi } = props;
    return (
        <>
            <div className={styles.debugDir}>{fi.uriName}</div>
            {generateNestedElements(fi.items!)}
        </>
    );
}

function FileLike(props: {fi: FolderItem}) {
    const { fi } = props;
    return (
        <Link href={fi.toUrl('markdown')} >{fi.uriName}<br></br></Link>
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

export default function Sidebar() {
    const nestedElements = generateNestedElements(getRootStrcuture());
    return (
        <div className={styles.sidebar}>
            {nestedElements}
        </div>
    );
}