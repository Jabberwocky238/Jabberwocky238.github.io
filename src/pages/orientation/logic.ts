interface BinderHooks {
    getAbsolute: (abs: boolean) => void;
    getAlpha: (alpha: number) => void;
    getBeta: (beta: number) => void;
    getGamma: (gamma: number) => void;
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

        hooks.getAbsolute(absolute);
        hooks.getAlpha(alpha);
        hooks.getBeta(beta);
        hooks.getGamma(gamma);
    });
}