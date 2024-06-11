export function euclideanDistance(x1: number, y1: number, x2: number, y2: number) {
    return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
}

export function calcRotate(mx: number, my: number) {
    let angle = Math.atan(mx / my)
    if (my < 0) angle += Math.PI
    return angle
}