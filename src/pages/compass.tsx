import BrowserOnly from "@docusaurus/BrowserOnly";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import Layout from "@theme/Layout";
import Compass from "@site/src/components/Compass";

export default function Home(): JSX.Element {
    const { siteConfig } = useDocusaurusContext();

    return (
        <Layout noFooter title={`指南针 | from ${siteConfig.title}`} description="指南针">
            <BrowserOnly>
                {() => <Compass />}
            </BrowserOnly>
        </Layout>
    );
}
