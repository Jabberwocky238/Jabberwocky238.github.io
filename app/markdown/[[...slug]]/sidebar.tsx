import { getRootStrcuture, type FolderItem } from './fs'
import styles from "./page.module.css";
import React from 'react';
import Link from 'next/link';

function DirLike(props: {fi: FolderItem}) {
    const { fi } = props;
    return (
        <>
            <div className={styles.debugDir}>{fi.name}</div>
            {generateNestedElements(fi.items!)}
        </>
    );
}

function FileLike(props: {fi: FolderItem}) {
    const { fi } = props;
    return (
        <Link href={fi.path!} >{fi.name}<br></br></Link>
    )
}


const generateNestedElements = (items: FolderItem[]) => {
    return items.map((item) => {
        if (item.idDir) {
            return <DirLike key={item.name} fi={item}/>;
        } else {
            return <FileLike key={item.name} fi={item}/>;
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