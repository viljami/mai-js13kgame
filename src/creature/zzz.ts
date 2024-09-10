import { easeInOutQuad, Easing } from "../components/easing";
import { Sprite } from "../components/sprite";
import { Vec2 } from "../components/vec2";
import { Resources } from "../resources";
import { Display } from "../ui/display";
import { Step } from "../views/view-manager";

export class SleepZzz implements Step, Display {
    pos: Vec2;
    targetY: number;
    easing: Easing;
    time: number = 0;
    sprite: Sprite;

    constructor(resources: Resources, pos: Vec2, targetY: number, durationMs: number) {
        this.pos = pos;
        this.targetY = targetY;
        this.easing = new Easing(this.pos.y, targetY, durationMs, easeInOutQuad);
        this.sprite = resources.zzz;
    }

    step(dt: number) {
        this.time += dt;
        this.easing.step(dt);
        this.pos.x += 5 * Math.sin(this.time / 10000);
        this.pos.y = this.easing.getValue();
    }

    draw(context: CanvasRenderingContext2D) {
        this.sprite.draw(context, this.pos.x, this.pos.y);
    }

    isDone() {
        return this.easing.isDone();
    }
}
