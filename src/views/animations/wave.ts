import { easeInOutQuad, Easing, ParallelEasing, SequenceEasing } from "../../components/easing";
import { Vec2 } from "../../components/vec2";
import { GIZMO_SCREEN_HEIGHT_HALF, GIZMO_SCREEN_WIDTH_HALF } from "../../config";

const { floor } = Math;
const WAVE_PHASE_DURATION = 250;

export class Wave {
    easings: ParallelEasing;
    isStopped = false;
    size: Vec2;

    constructor(size: Vec2) {
        this.easings = new ParallelEasing({
            dx: new SequenceEasing([
                new Easing(size.x, size.x, WAVE_PHASE_DURATION, easeInOutQuad),
                new Easing(0, 0, WAVE_PHASE_DURATION, easeInOutQuad),
                new Easing(size.x, size.x, WAVE_PHASE_DURATION, easeInOutQuad),
            ]),
            dy: new SequenceEasing([
                new Easing(size.y, size.y, WAVE_PHASE_DURATION, easeInOutQuad),
                new Easing(0, 0, WAVE_PHASE_DURATION, easeInOutQuad),
                new Easing(size.y, size.y, WAVE_PHASE_DURATION, easeInOutQuad),
            ])
        });
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

    draw(context: CanvasRenderingContext2D): void {
        this.easings.getValue();
        let { dx, dy } = this.easings.value;
        dx = floor(dx);
        dy = floor(dy);
        context.fillStyle = '#000';
        context.fillRect(
            GIZMO_SCREEN_WIDTH_HALF - dx,
            GIZMO_SCREEN_HEIGHT_HALF - dy,
            dx * 2,
            dy * 2,
        );
    }
}

export class WaveOut extends Wave {
    draw(context: CanvasRenderingContext2D): void {
        this.easings.getValue();
        let { dx, dy } = this.easings.value;
        context.fillStyle = '#000';
        context.fillRect(
            0,
            0,
            floor(dx) * 2,
            floor(dy) * 2,
        );
    }
}
