interface BinderHooks {
    getOrientation: (orient: [number, number, number]) => void;
    getAccel: (accel: [number, number, number]) => void;
    getAccelG: (accel: [number, number, number]) => void;
    getRot: (rot: [number, number, number]) => void;
}

interface Module {
    binder: (hooks: BinderHooks) => void;
}

function fix(numbers: [number, number, number]): [number, number, number] {
    return numbers.map((num) => Math.round(num * 100) / 100) as [number, number, number];
}

export function binder(hooks: BinderHooks) {
    window.addEventListener("deviceorientation", (orientData: DeviceOrientationEvent) => {
        let absolute = orientData.absolute;
        let alpha = orientData.alpha!;
        let beta = orientData.beta!;
        let gamma = orientData.gamma!;
        console.log(absolute, alpha, beta, gamma)

        hooks.getOrientation(fix([alpha, beta, gamma]));
    });
    window.ondevicemotion = (event: DeviceMotionEvent) => {
        let accel = event.acceleration!;
        let accelG = event.accelerationIncludingGravity!;
        let interval = event.interval;
        let rot = event.rotationRate!;
        
        hooks.getAccel(fix([accel.x!, accel.y!, accel.z!]));
        hooks.getAccelG(fix([accelG.x!, accelG.y!, accelG.z!]));
        hooks.getRot(fix([rot.alpha!, rot.beta!, rot.gamma!]));
    }
}