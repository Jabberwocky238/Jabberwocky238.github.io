import { useEffect } from "react";
// import * as PIXI from 'pixi.js';
import { Application, Sprite, Assets } from 'pixi.js';

const WIDTH = 640;
const HEIGHT = 640;


class BirdEntity {
    sprite: Sprite;
    speed: number;

    constructor(x: number = WIDTH % 200, y: number = HEIGHT % 300) {
        console.log("bird")
        this.speed = 1;
        this.sprite = Sprite.from('sample.png');

        this.sprite.scale.set(0.3, 0.3);
        this.sprite.x = x;
        this.sprite.y = y;
        this.sprite.rotation = Math.PI / 6;
        this.sprite.anchor.x = 0.5;
        this.sprite.anchor.y = 0.5;
    }

    move() {
        // console.log("move", this.sprite.pivot)
        this.sprite.x += this.speed * Math.sin(this.sprite.rotation);
        this.sprite.y += this.speed * Math.cos(Math.PI - this.sprite.rotation);
        if (this.sprite.x > WIDTH + 40) {
            this.sprite.x = -40;
        }
        if (this.sprite.x < -40) {
            this.sprite.x = WIDTH + 40;
        }
        if (this.sprite.y > HEIGHT + 40) {
            this.sprite.y = -40;
        }
        if (this.sprite.y < -40) {
            this.sprite.y = HEIGHT + 40;
        }
    }
}

async function main() {
    const app = new Application();
    await app.init({ width: WIDTH, height: HEIGHT });

    var piximount = document.getElementById('pixi')!;
    piximount.appendChild(app.canvas);

    await Assets.load('sample.png');
    const bird = new BirdEntity()
    const bird2 = new BirdEntity(100, 100)

    app.stage.addChild(bird.sprite);
    app.stage.addChild(bird2.sprite);
    let elapsed = 0.0;
    // Tell our application's ticker to run a new callback every frame, passing
    // in the amount of time that has passed since the last tick
    app.ticker.add((ticker) => {
        // Add the time to our total elapsed time
        elapsed += ticker.deltaTime;
        // Update the sprite's X position based on the cosine of our elapsed time.  We divide
        // by 50 to slow the animation down a bit...
        // bird.sprite.x = 100.0 + Math.cos(elapsed / 50.0) * 100.0;
        bird.move()
        bird2.move()
    });
}

function Bird() {
    useEffect(() => {
        main()
    }, [])

    return (
        <div id="pixi" style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        </div>
    );
}

export default Bird;
