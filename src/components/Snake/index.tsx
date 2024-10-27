import BrowserOnly from "@docusaurus/BrowserOnly";
import { useEffect } from "react";

export default function Home(): JSX.Element {
    useEffect(() => {
        const module = require('./logic');
        module.init();
    }, []);
    return (
        <BrowserOnly>
            {() => <main id="caonimab" style={{ display: "flex", justifyContent: "center" }}></main>}
        </BrowserOnly>
    );
}


