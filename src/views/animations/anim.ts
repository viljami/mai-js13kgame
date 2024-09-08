import { easeInOutQuad, Easing, ParallelEasing } from "../../components/easing";
import { Vec2 } from "../../components/vec2";
import { GIZMO_SCREEN_HEIGHT, GIZMO_SCREEN_HEIGHT_HALF, GIZMO_SCREEN_WIDTH, GIZMO_SCREEN_WIDTH_HALF } from "../../config";

const { floor } = Math;

export abstract class Anim {
    easings: ParallelEasing;
    isStopped = false;

    constructor(easings: ParallelEasing) {
        this.easings = easings;
    }

    reset() {
        this.easings.reset()
    }

    start() {
        this.isStopped = false;
    }

    stop() {
        this.isStopped = true;
    }

    isDone() {
        return this.easings.isDone();
    }

    step(dt: number) {
        if (this.isStopped) {
            return;
        }

        this.easings.step(dt);
    }

    abstract draw(context: CanvasRenderingContext2D): void;
}
