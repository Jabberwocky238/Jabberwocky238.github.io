import { Sprite, Graphics, Point } from 'pixi.js';
import { euclideanDistance } from './utils';
import { SPEED, PERCEPT_RANGE, SCALE_RATE, COHESION_RATE, DEBUG_SERIAL } from './config';
import { useBIRD_LIST } from './main';
import { Entity } from './entity';

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
        console.info(`[bird ${seq}] ${x} - ${y}`)
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
        // console.log(_x, _y, _w, _h, mountBirdBounds)

        this.permenant_graphic.rect(_x, _y, _w, _h)
        this.permenant_graphic.stroke({ color: 0x00ff00, width: 6 }); // 设置线条样式

        DEBUG_SERIAL.forEach(debug_item => {
            if (this.serial_number === debug_item.serial_number) {
                this.permenant_graphic.circle(this.movement.center.x, this.movement.center.y, PERCEPT_RANGE);
                this.permenant_graphic.fill({ color: debug_item.color, alpha: 0.5 });

                const temporary_graphic = new Graphics({ cullable: true, zIndex: 10, parent: this.container });
                temporary_graphic.label = 'temporary_graphic'
                this.container.addChild(temporary_graphic);
            }
        })
    }

    steerSeparation(birdInRange: BirdEntity[]) {
        birdInRange.forEach(bird => {
            const forceX = bird.container.x - this.container.x;
            const forceY = bird.container.y - this.container.y;
            const distance = euclideanDistance(this.container.x, this.container.y, bird.container.x, bird.container.y);
            // const steer = (forceX + forceY) / distance;
            // console.log(forceX  / distance, forceY  / distance)
            this.movement.moment_x -= forceX / distance / PERCEPT_RANGE
            this.movement.moment_y -= forceY / distance / PERCEPT_RANGE
        })
    }

    steerAlignment(birdInRange: BirdEntity[]) {
        birdInRange.forEach(bird => {
            this.movement.moment_x += bird.movement.moment_x / PERCEPT_RANGE;
            this.movement.moment_y += bird.movement.moment_y / PERCEPT_RANGE;
        })
    }

    steerCohesion(birdInRange: BirdEntity[]) {
        let center_x = this.container.x;
        let center_y = this.container.y;
        let cnt = 1

        birdInRange.forEach(bird => {
            center_x += bird.container.x
            center_y += bird.container.y
            cnt += 1            
        })

        if (cnt === 1) return

        const globalCenter = new Point(center_x / cnt, center_y / cnt)
        const localCenter = this.container.toLocal(globalCenter)

        this.movement.moment_x += localCenter.x / PERCEPT_RANGE * COHESION_RATE ;
        this.movement.moment_y += localCenter.y / PERCEPT_RANGE * COHESION_RATE ;

        DEBUG_SERIAL.forEach(debug_item => {
            if (this.serial_number === debug_item.serial_number) {
                const temporary_graphic: Graphics = this.container.getChildByLabel('temporary_graphic') as Graphics;
                temporary_graphic.circle(localCenter.x, localCenter.y, 20);
                temporary_graphic.fill({ color: debug_item.color, alpha: 0.5 });
            }
        })
    }

    move() {
        const BIRD_LIST = useBIRD_LIST()
        var birdInRange = BIRD_LIST.filter(bird => {
            const judge1 = bird !== this;
            const judge2 = euclideanDistance(this.container.x, this.container.y, bird.container.x, bird.container.y)
            // console.log(judge2)
            return judge1 && judge2 < PERCEPT_RANGE;
        })

        DEBUG_SERIAL.forEach(debug_item => {
            if (this.serial_number === debug_item.serial_number) {
                const temporary_graphic: Graphics = this.container.getChildByLabel('temporary_graphic') as Graphics;
                temporary_graphic.clear()
            }
        })

        this.steerSeparation(birdInRange)
        this.steerAlignment(birdInRange)
        this.steerCohesion(birdInRange)

        DEBUG_SERIAL.forEach(debug_item => {
            if (this.serial_number === debug_item.serial_number) {
                birdInRange.forEach(bird => {
                    const temporary_graphic: Graphics = this.container.getChildByLabel('temporary_graphic') as Graphics;
                    var thisPosition = this.container.toLocal(this.container.position);
                    var birdPosition = this.container.toLocal(bird.container.position);
                    temporary_graphic.moveTo(thisPosition.x, thisPosition.y)
                    temporary_graphic.lineTo(birdPosition.x, birdPosition.y)
                    temporary_graphic.stroke({ color: debug_item.color, width: 2 }); // 设置线条样式
                })
            }
        })
 
        // console.info("move")
        this.movement.move(SPEED);
    }
}
