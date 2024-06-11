import { Sprite, PointData, Graphics, FillStyle, Container } from 'pixi.js';
import { euclideanDistance } from './utils';
import { HEIGHT, SCALE_RATE, WIDTH } from './config';

function calcRotate(mx: number, my: number) {
    let angle = Math.atan(mx / my)
    if (my < 0) angle += Math.PI
    return angle
}

class Movement {
    container: Container;
    moment_x: number;
    moment_y: number;

    constructor(
        container: Container,
        moment_x: number = 0,
        moment_y: number = 1,
    ) {
        this.container = container
        this.moment_x = moment_x;
        this.moment_y = moment_y;
        this.toward()
    }

    toward() {
        this.container.rotation = calcRotate(this.moment_x, this.moment_y);
        this.moment_x /= Math.sqrt(Math.pow(this.moment_x, 2) + Math.pow(this.moment_y, 2))
        this.moment_y /= Math.sqrt(Math.pow(this.moment_x, 2) + Math.pow(this.moment_y, 2))
    }

    public get center() {
        const mountBirdBounds = this.container.getLocalBounds()
        const _x = mountBirdBounds.x + mountBirdBounds.width / 2
        const _y = mountBirdBounds.y + mountBirdBounds.height / 2
        return {
            x: _x,
            y: _y,
        }
    }

    move(speed = 0.1) {
        this.container.x += speed * this.moment_x
        this.container.y += speed * -this.moment_y

        //出界检查
        const OUT_OF_RANGE_DIST = 20
        if (this.container.x > WIDTH + OUT_OF_RANGE_DIST) this.container.x = -OUT_OF_RANGE_DIST;
        if (this.container.x < -OUT_OF_RANGE_DIST) this.container.x = WIDTH + OUT_OF_RANGE_DIST;
        if (this.container.y > HEIGHT + OUT_OF_RANGE_DIST) this.container.y = -OUT_OF_RANGE_DIST;
        if (this.container.y < -OUT_OF_RANGE_DIST) this.container.y = HEIGHT + OUT_OF_RANGE_DIST;
    }

}

export class Entity {
    serial_number: number;
    container: Container
    movement: Movement;

    constructor(seq: number, x: number, y: number, mx: number, my: number) {
        console.log(`[Entity ${seq}] ${x} - ${y}`)
        this.serial_number = seq;
        this.container = new Container({ cullable: true, zIndex: 1, x: x, y: y });
        // this.container.pivot.set(HEIGHT/2, WIDTH/2);
        // console.info(this.container.localTransform)

        this.movement = new Movement(this.container, mx, my);
        const permenant_graphic = new Graphics({ cullable: true, zIndex: 3, label: `permenant_graphic` });
        this.container.addChild(permenant_graphic);

        permenant_graphic.circle(this.movement.center.x, this.movement.center.y, 200);
        permenant_graphic.fill({ color: 0xFFFFFF, alpha: 0.5 });
    }


    move() {
        console.log("move")
        this.movement.move(0.5)
    }
}

export class BirdEntity extends Entity {
    sprite: Sprite;

    constructor(
        seq: number,
        x: number = 100,
        y: number = 100,
        rx: number = 1,
        ry: number = -1,
    ) {
        super(seq, x, y, rx, ry);
        console.log(`[bird ${seq}] ${x} - ${y}`)
        this.sprite = Sprite.from('sample.png');
        this.sprite.zIndex = 5;
        this.sprite.anchor.set(0.5, 0.5);
        this.sprite.scale.set(SCALE_RATE);
        this.container.addChild(this.sprite);

        const mountBirdBounds = this.sprite.getBounds();
        const _w = mountBirdBounds.width * 0.5
        const _x = this.movement.center.x - _w / 2
        const _h = mountBirdBounds.height * 0.5
        const _y = this.movement.center.y - _h / 2
        console.log(_x, _y, _w, _h, mountBirdBounds)

        const permenant_graphic = this.container.getChildByLabel('permenant_graphic') as Graphics;
        permenant_graphic.rect(_x, _y, _w, _h)
        permenant_graphic.stroke({ color: 0x00ff00, width: 6 }); // 设置线条样式

        // if (this.serial_number === 0) {

        //     // console.log(permenant_graphic.label, 'Graphics')

        //     const temporary_graphic = new Graphics({ cullable: true, zIndex: 2, parent: this.container });
        //     // temporary_graphic.position = this.sprite.position
        //     temporary_graphic.label = 'temporary_graphic'
        //     // console.log(temporary_graphic.label, 'Graphics')

        //     permenant_graphic.circle(this.sprite.x, this.sprite.y, RADIO); // 绘制外圆
        //     permenant_graphic.fill({ color: 0xFFFFFF, alpha: 0.5 } as FillStyle); // 设置填充颜色


        // }
    }

    // getCenter() {
    //     const _x = this.container.x + this.container.width / 2
    //     const _y = this.container.y + this.container.height / 2
    //     // console.log(_x, _y)
    //     return { x: _x, y: _y }
    // }

    // addRotate(rx: number, ry: number) {
    //     this.r.rx += rx;
    //     this.r.ry += ry;
    //     this.container.rotation = setRotate(this.r.rx, this.r.ry);
    // }

    // steerSeparation() {

    //     var birdInRange = BIRD_LIST.filter(bird => {
    //         const judge1 = bird !== this;
    //         const judge2 = euclideanDistance(this.container.x, this.container.y, bird.container.x, bird.container.y)
    //         // console.log(judge2)
    //         return judge1 && judge2 < RADIO;
    //     })
    //     if (this.seq === 0) {
    //         const temporary_graphic: Graphics = this.container.getChildByLabel('temporary_graphic') as Graphics;
    //         temporary_graphic.clear()
    //         // this.getCenter()
    //     }
    //     // console.log(birdInRange)
    //     birdInRange.forEach(bird => {
    //         const forceX = (this.container.x - bird.container.x);
    //         const forceY = (this.container.y - bird.container.y);
    //         // console.log(forceX, forceY)
    //         this.addRotate(forceX, forceY)
    //         if (this.seq === 0) {
    //             const temporary_graphic: Graphics = this.container.getChildByLabel('temporary_graphic') as Graphics;
    //             // console.log(bird.container.getGlobalPosition().x, bird.container)
    //             temporary_graphic.moveTo(this.getCenter().x, this.getCenter().y)
    //             temporary_graphic.lineTo(bird.getCenter().x, bird.getCenter().y)
    //             temporary_graphic.stroke({ color: 0xff0000, width: 2 }); // 设置线条样式
    //             // graphics.circle(this.container.x, this.container.y, 50); // 绘制外圆
    //             // graphics.fill({ color: 0xFFFFFF, alpha: 0.2 } as FillStyle); // 设置填充颜色

    //             // const mountBirdBounds = this.container.getLocalBounds()
    //         }
    //     })
    // }

    // move() {
    //     this.steerSeparation()
    //     // console.log("move", this.container.position)
    //     const momentum: PointData = {
    //         x: this.speed * Math.sin(this.container.rotation),
    //         y: this.speed * Math.cos(Math.PI - this.container.rotation),
    //     }
    //     this.container.x += momentum.x;
    //     this.container.y += momentum.y;
    //     const OUT_OF_RANGE_DIST = 20
    //     if (this.container.x > WIDTH + OUT_OF_RANGE_DIST) this.container.x = -OUT_OF_RANGE_DIST;
    //     if (this.container.x < -OUT_OF_RANGE_DIST) this.container.x = WIDTH + OUT_OF_RANGE_DIST;
    //     if (this.container.y > HEIGHT + OUT_OF_RANGE_DIST) this.container.y = -OUT_OF_RANGE_DIST;
    //     if (this.container.y < -OUT_OF_RANGE_DIST) this.container.y = HEIGHT + OUT_OF_RANGE_DIST;
    // }
}
