const { pow } = Math;

// https://easings.net/#easeInOutQuad
export const easeInOutQuad = (x: number): number =>
    x < 0.5 ? 2 * x * x : 1 - pow(-2 * x + 2, 2) / 2;

type EasingFn = (x: number) => number;

export class Easing {
    public value: number;
    public duration: number;
    public time: number;
    public easingFn: EasingFn;

    constructor(value: number, duration: number, easingFn: EasingFn) {
        this.value = value;
        this.duration = duration;
        this.easingFn = easingFn;
    }

    step(dt) {
        this.time += dt;

        if (this.time >= this.duration) {
            this.time = this.duration;
        }
    }

    isDone() {
        return this.time >= this.duration;
    }
}
