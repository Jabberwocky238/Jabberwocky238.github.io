import p5 from "p5";

const MAP_SIZE = 40;
var MAP_WIDTH: number;
var MAP_HEIGHT: number;
const BLOCK_SIZE = 20;
const C_BG = 200;
type Vector2D = [number, number];


function isMobile() {
    return window.matchMedia("only screen and (max-width: 767px)").matches;
}

function drawBlock(p: p5, vec: Vector2D): void {
    p.rect(
        vec[0] * BLOCK_SIZE,
        vec[1] * BLOCK_SIZE,
        (vec[0] + 1) * BLOCK_SIZE,
        (vec[1] + 1) * BLOCK_SIZE
    );
}

// 定义蛇的属性
class Snake {
    /// head = body[0]
    body: Array<Vector2D>;
    /// y, x
    direction: Vector2D;
    /// head towards
    head_to: Vector2D;
    /// 吃了吗
    lengthen: boolean;

    constructor() {
        this.body = [[3, 0], [3, 1], [3, 2], [3, 3], [3, 4]];
        this.direction = [0, 1];
        this.head_to = [3, 5];
        this.lengthen = false;
    }

    turnUp() {
        if (this.direction[1] !== 1) {
            this.direction = [0, -1];
        }
    }
    turnDown() {
        if (this.direction[1] !== -1) {
            this.direction = [0, 1];
        }
    }
    turnLeft() {
        if (this.direction[0] !== 1) {
            this.direction = [-1, 0];
        }
    }
    turnRight() {
        if (this.direction[0] !== -1) {
            this.direction = [1, 0];
        }
    }
    get steer() {
        switch (this.direction[0]) {
            case 1:
                return 'right';
            case -1:
                return 'left';
        }
        switch (this.direction[1]) {
            case 1:
                return 'down';
            case -1:
                return 'up';
        }
        return 'unknown';
    }

    try_eat() {
        this.head_to = this.body[this.body.length - 1];
    }

    includes(vec: Vector2D): boolean {
        for (let i = 0; i < this.body.length; i++) {
            if (this.body[i][0] === vec[0] && this.body[i][1] === vec[1]) {
                return true;
            }
        }
        return false;
    }

    move() {
        let head: Vector2D = [...this.body[this.body.length - 1]];

        switch (this.direction[0]) {
            case 1:
                head[0] += 1;
                break;
            case -1:
                head[0] -= 1;
                break;
        }

        switch (this.direction[1]) {
            case 1:
                head[1] += 1;
                break;
            case -1:
                head[1] -= 1;
                break;
        }
        // die
        if (head[0] === -1 || head[0] === MAP_WIDTH || head[1] === -1 || head[1] === MAP_HEIGHT) {
            return true;
        }
        if (this.includes(head)) {
            return true;
        }
        // not die
        this.body.push(head);

        // eat
        if (this.lengthen) {
            this.lengthen = false;
        } else {
            this.body.shift();
        }

        return false;
    }
}


class Board {
    map: Array<Array<number>>;
    food!: Vector2D;

    constructor() {
        this.map = new Array(MAP_WIDTH).fill(0).map(() => new Array(MAP_HEIGHT).fill(0));
        this.make_food();
    }

    draw(p: p5, snake: Snake) {
        if (this.food[0] == snake.head_to[0] && this.food[1] == snake.head_to[1]) {
            snake.lengthen = true;
            this.make_food();
            console.log('eat');
        }

        for (let i = 0; i < MAP_WIDTH; i++) {
            for (let j = 0; j < MAP_HEIGHT; j++) {
                if (snake.includes([i, j])) {
                    p.fill(0);
                } else if (this.food[0] === i && this.food[1] === j) {
                    p.fill(255, 255, 0);
                } else {
                    p.fill(200);
                }
                drawBlock(p, [i, j]);
            }
        }

        console.log(snake.body[snake.body.length - 1], this.food);
    }

    private make_food() {
        this.food = [Math.floor(Math.random() * MAP_WIDTH), Math.floor(Math.random() * MAP_HEIGHT)];
    }
}
// 创建p5游戏画布
function bindKey(snake: Snake) {
    if (isMobile()) {
        console.log('This is a mobile device.');
        window.ondevicemotion
        window.addEventListener("deviceorientation", (orientData: DeviceOrientationEvent) => {
            var absolute = orientData.absolute;
            var alpha = orientData.alpha!;
            var beta = orientData.beta;
            var gamma = orientData.gamma;
            console.log(absolute, alpha, beta, gamma)
    
            if (alpha >= 0 && alpha <= 90) {
                snake.turnUp();
            } else if (alpha > 90 && alpha <= 180) {
                snake.turnLeft();
            } else if (alpha > 180 && alpha <= 270) {
                snake.turnDown();
            } else if (alpha > 270 && alpha <= 360) {
                snake.turnRight();
            } else {
                console.log(alpha)
            }
        });
    }

    // 请记得在不再需要时停止监听器
    // accelerometer.stop();
    document.addEventListener('keydown', function (event: any) {
        switch (event.key) {
            case 'w':
                snake.turnUp();
                console.log('w');
                break;
            case 'a':
                snake.turnLeft();
                console.log('a');
                break;
            case 's':
                snake.turnDown();
                console.log('s');
                break;
            case 'd':
                snake.turnRight();
                console.log('d');
                break;
            default:
                break;
        }
    });
}

interface Hooks {
    getLength: (len: number) => void;
    getHeadPos: (pos: Vector2D) => void;
    getLiveState: (die: boolean) => void;
    getSteer: (dir: string) => void;
}
interface Module {
    init: () => { remove: () => void, register: (hooks: Partial<Hooks>) => void };
}

export const init = () => {
    let hooks: Partial<Hooks> = {
        getLength: undefined,
        getHeadPos: undefined,
        getLiveState: undefined,
    };

    const obj = new p5((p: p5) => {
        let canvasDom: HTMLCanvasElement;
        let snake: Snake;
        let board: Board;
        let die: boolean;

        p.preload = () => {
        };

        p.setup = () => {
            canvasDom = document.getElementById("caonimab") as HTMLCanvasElement;
            MAP_WIDTH = Math.floor(window.innerWidth * 0.8 / 20);
            MAP_HEIGHT = Math.floor(window.innerHeight * 0.8 / 20);
            MAP_WIDTH = MAP_WIDTH > 40 ? 40: MAP_WIDTH;
            MAP_HEIGHT = MAP_HEIGHT > 40 ? 40: MAP_HEIGHT;

            snake = new Snake();
            bindKey(snake);
            board = new Board();
            p.createCanvas(MAP_WIDTH * BLOCK_SIZE, MAP_HEIGHT * BLOCK_SIZE, canvasDom);
            p.frameRate(7);
        };

        p.draw = () => {
            p.background(C_BG);
            p.fill(C_BG);
            p.rect(0, 0, MAP_WIDTH * BLOCK_SIZE, MAP_HEIGHT * BLOCK_SIZE);

            snake.try_eat();
            board.draw(p, snake);
            
            // hooks
            if (hooks.getLength) {
                hooks.getLength(snake.body.length);
            }
            if (hooks.getHeadPos) {
                hooks.getHeadPos(snake.body[snake.body.length - 1]);
            }
            if (hooks.getSteer) {
                hooks.getSteer(snake.steer);
            }

            // move and die
            die = snake.move();
            if (hooks.getLiveState) {
                hooks.getLiveState(die);
            }
            if (die) {
                p.noLoop();
            }
        };
    });
    let remove = () => {
        obj.remove();
    }
    let register = (newhooks: Partial<Hooks>) => {
        hooks = { ...hooks, ...newhooks };
    }

    return { remove, register };
};

