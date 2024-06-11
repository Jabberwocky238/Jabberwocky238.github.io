import { Application, Assets} from 'pixi.js';
import { BirdEntity } from './entity';
import { BIRDS_CNT, HEIGHT, WIDTH } from './config';



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

const BIRD_LIST: BirdEntity[] = [];
export function useBIRD_LIST() {
    return BIRD_LIST
}

async function init(app: Application) {
    await Assets.load('sample.png');
    
    for (let index = 0; index < BIRDS_CNT; index++) {
        const randomX = Math.random() * WIDTH
        const randomY = Math.random() * HEIGHT
        const randomRX = Math.random() - 0.5
        const randomRY = Math.random() - 0.5
        const bird = new BirdEntity(index, randomX, randomY, randomRX, randomRY)
        BIRD_LIST.push(bird)
    }
    BIRD_LIST.forEach(bird => {
        app.stage.addChild(bird.container);
    })

    let elapsed = 0.0;
    // Tell our application's ticker to run a new callback every frame, passing
    // in the amount of time that has passed since the last tick
    app.ticker.add((ticker) => {
        // Add the time to our total elapsed time
        elapsed += ticker.deltaTime;
        BIRD_LIST.forEach(bird => {
            bird.move()
        })
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