import { useEffect } from "react";
// import * as PIXI from 'pixi.js';
import main from "./main";

function Bird() {
    useEffect(() => {
        
        main()
        // debug()
    }, [])

    return (
        <div id="pixi" style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        </div>
    );
}

export default Bird;
