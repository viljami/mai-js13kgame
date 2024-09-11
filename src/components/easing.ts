const { pow } = Math;

// https://easings.net/#easeInOutQuad
export const easeInOutQuad = (x: number): number => // 0 <= x <= 1
    x < 0.5 ? 2 * x * x : 1 - pow(-2 * x + 2, 2) / 2;

export const easeInQuad = (x: number): number => x * x;

export const easeOutQuad = (x: number): number => 1 - (1 - x) * (1 - x);

export const easeLinear = (x: number): number => x;

export const easeJump = (x: number): number => x < 0.5 ? 0. : 1.;

type EasingFn = (x: number) => number;

export interface BaseEasing {
    reset();
    step(dt);
    getValue(): number;
    isDone(): boolean;
}

export class Easing implements BaseEasing {
    from: number;
    to: number;
    value: number = 0.;
    durationMs: number;
    time: number = 0.;
    easingFn: EasingFn;

    constructor(from: number, to: number, durationMs: number, easingFn: EasingFn) {
        this.from = from;
        this.to = to;
        this.durationMs = durationMs;
        this.easingFn = easingFn;
    }

    reset() {
        this.time = 0.;
        this.value = 0.;
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

    getValue(): number {
        return this.from + (this.to - this.from) * this.value;
    }

    isDone() {
        return this.time >= this.durationMs;
    }
}

export class SequenceEasing implements BaseEasing {
    easings: Easing[];

    constructor(easings: Easing[]) {
        this.easings = easings;
    }

    reset() {
        this.easings.forEach(a => a.reset());
    }

    isDone() {
        return this.easings.every(a => a.isDone());
    }

    step(dt) {
        for (let a of this.easings) {
            if (!a.isDone()) {
                a.step(dt);
                return;
            }
        }
    }

    getValue(): number {
        for (let a of this.easings) {
            if (!a.isDone()) {
                return a.getValue();
            }
        }
    }
}

export type EasingGroup = {
    [key: string]: BaseEasing;
};

export class ParallelEasing implements BaseEasing {
    easings: EasingGroup;
    value: { [key: string]: number } = {};

    constructor(easings: EasingGroup) {
        this.easings = easings;
    }

    reset() {
        Object.values(this.easings).forEach(a => a.reset());
    }

    step(dt) {
        Object.values(this.easings).forEach(a => a.step(dt));
    }

    isDone(): boolean {
        return Object.values(this.easings).every(a => a.isDone());
    }

    getValue(): number {
        Object.entries(this.easings).reduce((a, [k, v]) => {
            a[k] = v.getValue();
            return a;
        }, this.value);

        return -1;
    }
}

// const p = new ParallelEasing({
//     x: new Easing(0, 10, 1000, easeInOutQuad),
//     y: new SequenceEasing([
//         new Easing(0, 10, 500, easeInOutQuad),
//         new Easing(10, 20, 50, easeInOutQuad),
//     ]),
// })
// p.step(10);
// p.getValue();
// p.value.x
// p.value.y
