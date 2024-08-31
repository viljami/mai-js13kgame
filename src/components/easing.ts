const { pow } = Math;

// https://easings.net/#easeInOutQuad
export const easeInOutQuad = (x: number): number => // 0 <= x <= 1
    x < 0.5 ? 2 * x * x : 1 - pow(-2 * x + 2, 2) / 2;

type EasingFn = (x: number) => number;

export class Easing {
    from: number;
    to: number;
    value: number = 0;
    durationMs: number;
    time: number = 0;
    easingFn: EasingFn;

    constructor(from: number, to: number, durationMs: number, easingFn: EasingFn) {
        this.from = from;
        this.to = to;
        this.durationMs = durationMs;
        this.easingFn = easingFn;
    }

    step(dt: number) {
        this.time += dt;

        if (this.time >= this.durationMs) {
            this.time = this.durationMs;
            this.value = 1.0;
        } else {
            this.value = this.easingFn(this.time / this.durationMs);
        }
    }

    getValue() {
        return this.from + (this.to - this.from) * this.value;
    }

    isDone() {
        return this.time >= this.durationMs;
    }
}
