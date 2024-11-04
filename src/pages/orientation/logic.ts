interface BinderHooks {
    getOrientation: (orient: [number, number, number]) => void;
    getAccel: (accel: [number, number, number]) => void;
    getAccelG: (accel: [number, number, number]) => void;
    getRot: (rot: [number, number, number]) => void;
}

interface Module {
    binder: (hooks: BinderHooks) => void;
}

export function binder(hooks: BinderHooks) {
    window.addEventListener("deviceorientation", (orientData: DeviceOrientationEvent) => {
        let absolute = orientData.absolute;
        let alpha = orientData.alpha!;
        let beta = orientData.beta!;
        let gamma = orientData.gamma!;
        console.log(absolute, alpha, beta, gamma)

        hooks.getOrientation([alpha, beta, gamma]);
    });
    window.ondevicemotion = (event: DeviceMotionEvent) => {
        let accel = event.acceleration!;
        let accelG = event.accelerationIncludingGravity!;
        let interval = event.interval;
        let rot = event.rotationRate!;
        
        hooks.getAccel([accel.x!, accel.y!, accel.z!]);
        hooks.getAccelG([accelG.x!, accelG.y!, accelG.z!]);
        hooks.getRot([rot.alpha!, rot.beta!, rot.gamma!]);
    }
}