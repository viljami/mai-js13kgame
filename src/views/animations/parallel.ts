import { ParallelEasing } from "../../components/easing";
import { Anim } from "./anim";

export class Parallel extends Anim {
    animations: Anim[];

    constructor(animations: Anim[]) {
        super(new ParallelEasing({}));
        this.animations = animations;
    }

    reset() {
        this.animations.forEach(a => a.reset());
    }

    start() {
        this.animations.forEach(a => a.start());
    }

    stop() {
        this.animations.forEach(a => a.stop());
    }

    isDone() {
        return this.animations.every(a => a.isDone());
    }

    step(dt: number) {
        this.animations.forEach(a => a.step(dt));
    }

    draw(context: CanvasRenderingContext2D): void {
        this.animations.forEach(a => a.draw(context));
    }
}
