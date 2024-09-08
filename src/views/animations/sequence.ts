import { ParallelEasing } from "../../components/easing";
import { Anim } from "./anim";

const NOOP_PARALLEL_EASING = new ParallelEasing({});

export class Sequence extends Anim {
    animations: Anim[];

    constructor(animations: Anim[]) {
        super(NOOP_PARALLEL_EASING);
        this.animations = animations;
    }

    reset() {
        this.animations.forEach(a => a.reset());
    }

    start() {
        for (let a of this.animations) {
            if (!a.isDone()) {
                a.start();
                return;
            }
        }
    }

    stop() {
        this.animations.forEach(a => a.stop());
    }

    isDone() {
        return this.animations.every(a => a.isDone());
    }

    step(dt: number) {
        for (let a of this.animations) {
            if (!a.isDone()) {
                a.step(dt);
                return;
            }
        }
    }

    draw(context: CanvasRenderingContext2D): void {
        for (let a of this.animations) {
            if (!a.isDone()) {
                a.draw(context);
                return;
            }
        }
    }
}
