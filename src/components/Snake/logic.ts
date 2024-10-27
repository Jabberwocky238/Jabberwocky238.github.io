import p5 from "p5";

const MAP_SIZE = 40;
const BLOCK_SIZE = 20;

const C_BG = 200;

type Vector2D = [number, number];
function drawBlock(p: p5, vec: Vector2D): void {
    p.rect(vec[0] * BLOCK_SIZE, vec[1] * BLOCK_SIZE, (vec[0] + 1) * BLOCK_SIZE, (vec[1] + 1) * BLOCK_SIZE);
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

    try_eat() {
        this.head_to = this.body[this.body.length - 1];
    }

    includes(vec: Vector2D) {
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

        this.body.push(head);

        // die
        if (head[0] === -1 || head[0] === MAP_SIZE || head[1] === -1 || head[1] === MAP_SIZE) {
            return true;
        }

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
    food: Vector2D;

    constructor() {
        this.map = new Array(MAP_SIZE).fill(0).map(() => new Array(MAP_SIZE).fill(0));
        this.food = [Math.floor(Math.random() * MAP_SIZE), Math.floor(Math.random() * MAP_SIZE)];
    }

    draw(p: p5, snake: Snake) {
        if (this.food[0] == snake.head_to[0] && this.food[1] == snake.head_to[1]) {
            snake.lengthen = true;
            this.make_food();
            console.log('eat');
        }

        for (let i = 0; i < MAP_SIZE; i++) {
            for (let j = 0; j < MAP_SIZE; j++) {
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
        this.food = [Math.floor(Math.random() * MAP_SIZE), Math.floor(Math.random() * MAP_SIZE)];
    }
}
// 创建p5游戏画布

function bindKey(snake: Snake) {
    window.addEventListener("deviceorientation", (orientData: DeviceOrientationEvent) => {
        var absolute = orientData.absolute;
        var alpha = orientData.alpha;
        var beta = orientData.beta;
        var gamma = orientData.gamma;
        console.log(absolute, alpha, beta, gamma)

        if (alpha >= 0 && alpha <= 90) {
            if (snake.direction[1] !== 1) {
                snake.direction = [0, -1];
            }
        } else if (alpha > 90 && alpha <= 180) {
            if (snake.direction[0] !== 1) {
                snake.direction = [-1, 0];
            }
        } else if (alpha > 180 && alpha <= 270) {
            if (snake.direction[1] !== -1) {
                snake.direction = [0, 1];
            }
        } else if (alpha > 270 && alpha <= 360) {
            if (snake.direction[0] !== -1) {
                snake.direction = [1, 0];
            }
        } else {
            console.log(alpha)
        }
    });

    // 请记得在不再需要时停止监听器
    // accelerometer.stop();
    document.addEventListener('keydown', function (event: any) {
        switch (event.key) {
            case 'w':
                if (snake.direction[1] !== 1) {
                    snake.direction = [0, -1];
                }
                console.log('w');
                break;
            case 'a':
                if (snake.direction[0] !== 1) {
                    snake.direction = [-1, 0];
                }
                console.log('a');
                break;
            case 's':
                if (snake.direction[1] !== -1) {
                    snake.direction = [0, 1];
                }
                console.log('s');
                break;
            case 'd':
                if (snake.direction[0] !== -1) {
                    snake.direction = [1, 0];
                }
                console.log('d');
                break;
            default:
                break;
        }
    });
}

export const init = () => {
    new p5((p: p5) => {
        let snake: Snake;
        let board: Board;

        p.preload = () => {
            // 在这里加载任何资源，例如图像
        };

        p.setup = () => {
            snake = new Snake();
            bindKey(snake);
            board = new Board();
            const canvasDom = document.getElementById("caonimab");
            p.createCanvas(MAP_SIZE * BLOCK_SIZE, MAP_SIZE * BLOCK_SIZE, canvasDom);
            p.frameRate(7);
        };

        p.draw = () => {
            p.background(C_BG);
            p.fill(C_BG);
            p.rect(0, 0, MAP_SIZE * BLOCK_SIZE, MAP_SIZE * BLOCK_SIZE);

            snake.try_eat();
            board.draw(p, snake);

            const die = snake.move();
            if (die) {
                p.noLoop();
            }
        };
    });
};