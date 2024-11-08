import BrowserOnly from "@docusaurus/BrowserOnly";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import Layout from "@theme/Layout";
import Snake from "@site/src/components/Snake";

export default function Home(): JSX.Element {
    const { siteConfig } = useDocusaurusContext();

    return (
        <Layout noFooter title={`贪吃蛇 | from ${siteConfig.title}`} description="贪吃蛇">
            <BrowserOnly>
                {() => <Snake />}
            </BrowserOnly>
        </Layout>
    );
}
