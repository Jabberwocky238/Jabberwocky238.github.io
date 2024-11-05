import Link from '@docusaurus/Link';
import clsx from 'clsx';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

type FeatureItem = {
  title: string;
  link: string;
  description: string;
};

const FeatureList: FeatureItem[] = [
  {
    title: '贪吃蛇',
    link: '/snake',
    description: '完全基于浏览器的简单贪吃蛇实现',
  },
  {
    title: '指南针',
    link: '/compass',
    description: '依然是现代浏览器API的应用',
  },
  {
    title: '博客',
    link: '/blog',
    description: '纯粹占位用的博客',
  },
  {
    title: 'B站',
    link: 'https://space.bilibili.com/86221452',
    description: '不定期扯淡和更新音乐',
  },
];

function Feature({ title, link, description }: FeatureItem) {
  return (
    <a href={link} className={styles.block}>
      <div className="text--center padding-horiz--md">
        <Heading as="h3">{title}</Heading>
        <p>{description}</p>
      </div>
    </a>
  );
}

export default function HomepageFeatures(): JSX.Element {
  return (
    <section className={styles.container}>
      {FeatureList.map((props, idx) => (
        <Feature key={idx} {...props} />
      ))}
    </section>
  );
}
