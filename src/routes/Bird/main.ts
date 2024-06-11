import { Application, Sprite, Assets, PointData, Graphics, FillStyle, Container } from 'pixi.js';
import { euclideanDistance } from './utils';
import { Entity, BirdEntity } from './entity';
import { HEIGHT, WIDTH } from './config';



// const BIRD_LIST: BirdEntity[] = [];

// async function init() {
//     const app = new Application();
//     await app.init({ width: WIDTH, height: HEIGHT });

//     const piximount = document.getElementById('pixi')!;
//     if (piximount.childNodes.length !== 0) {
//         piximount.removeChild(piximount.childNodes[0])
//     }
//     piximount.appendChild(app.canvas);

//     await Assets.load('sample.png');
//     for (let index = 0; index < BIRDS_CNT; index++) {
//         const randomX = Math.random() * WIDTH
//         const randomY = Math.random() * HEIGHT
//         const randomRX = Math.random() - 0.5
//         const randomRY = Math.random() - 0.5
//         const bird = new BirdEntity(index, randomX, randomY, randomRX, randomRY)
//         BIRD_LIST.push(bird)
//     }


//     BIRD_LIST.forEach(bird => {
//         app.stage.addChild(bird.container);
//     })
//     let elapsed = 0.0;
//     // Tell our application's ticker to run a new callback every frame, passing
//     // in the amount of time that has passed since the last tick
//     app.ticker.add((ticker) => {
//         // Add the time to our total elapsed time
//         elapsed += ticker.deltaTime;
//         // Update the sprite's X position based on the cosine of our elapsed time.  We divide
//         // by 50 to slow the animation down a bit...
//         // bird.sprite.x = 100.0 + Math.cos(elapsed / 50.0) * 100.0;
//         BIRD_LIST.forEach((value: BirdEntity, index) => {
//             value.move()
//         })
//     });
// }


async function init(app: Application) {
    await Assets.load('sample.png');
    const entity = new BirdEntity(0)

    app.stage.addChild(entity.container);

    app.ticker.add((ticker) => {
        entity.move()
    });
}

async function main()  {
    const app = new Application();
    await app.init({ width: WIDTH, height: HEIGHT });

    const piximount = document.getElementById('pixi')!;
    if (piximount.childNodes.length !== 0) {
        piximount.removeChild(piximount.childNodes[0])
    }
    piximount.appendChild(app.canvas);
    init(app)
}

export default main