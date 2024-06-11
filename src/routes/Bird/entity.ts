import { Graphics, Container } from 'pixi.js';
import { HEIGHT, WIDTH, OUT_OF_RANGE_DIST} from './config';

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
        this.moment_x = this.moment_x / Math.sqrt(Math.pow(this.moment_x, 2) + Math.pow(this.moment_y, 2))
        this.moment_y = this.moment_y / Math.sqrt(Math.pow(this.moment_x, 2) + Math.pow(this.moment_y, 2))
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
        this.toward()
        this.container.x += speed * this.moment_x
        this.container.y += speed * -this.moment_y

        //出界检查
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
    permenant_graphic: Graphics;

    constructor(seq: number, x: number, y: number, mx: number, my: number) {
        console.info(`[Entity ${seq}] ${x} - ${y}`)
        this.serial_number = seq;
        this.container = new Container({ cullable: true, zIndex: 1, x: x, y: y });

        this.movement = new Movement(this.container, mx, my);
        this.permenant_graphic = new Graphics({ cullable: true, zIndex: 3 });
        this.container.addChild(this.permenant_graphic);
    }

    move() {
        console.info("[Entity] move")
        this.movement.move(0.5)
    }
}
