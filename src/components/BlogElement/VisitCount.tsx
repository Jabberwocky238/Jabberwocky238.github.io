import type { BlogPostMetadata } from '@docusaurus/plugin-content-blog';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { getvisitbyname, visit } from './apis';

interface Props {
    metadata: BlogPostMetadata
}

export default function VisitCount(props: Props) {
    const { metadata } = props;
    const [count, setCount] = useState(0);

    useEffect(() => {
        visit(metadata.permalink);
        getvisitbyname(metadata.permalink).then((count) => {
            setCount(count);
        });
    }, []);

    return (
        <>当前文章阅读 {count} 人次</>
    );
}