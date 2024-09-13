import { SPRITE_SPEED } from "../config";
import { Frame } from "./frame";

const SCALE = 1;

export class Sprite {
    time = 0;
    activeFrame = 0;
    frames: Frame[];
    sheet: HTMLCanvasElement | HTMLImageElement;
    speed: number;

    constructor(frames: Frame[], sheet: HTMLCanvasElement | HTMLImageElement) {
        this.frames = frames;
        this.sheet = sheet;
        this.speed = SPRITE_SPEED;
    }

    setSpeed(speedMS: number) {
        this.speed = speedMS;
    }

    getSize() {
        return this.frames[this.activeFrame].size;
    }

    step(dt) {
        this.time += dt;

        if (this.time >= this.speed) {
            this.time = 0;
            this.activeFrame++;

            if (this.activeFrame >= this.frames.length) {
                this.activeFrame = 0;
            }
        }
    }

    draw(context, x: number, y: number, invert = false, dw?: number, dh?: number) {
        const frame = this.frames[this.activeFrame];
        const { x: w, y: h } = frame.size;
        dw = (dw ? dw : w) * SCALE;
        dh = (dh ? dh : h) * SCALE;
        context.drawImage(this.sheet, frame.pos.x|0, frame.pos.y|0, w|0, h|0, x|0, y|0, dw|0, dh|0);

        if (invert) {
            context.save()
            context.fillStyle = '#fff';
            context.globalCompositeOperation = 'difference';
            context.fillRect(x|0, y|0, dw|0, dh|0);
            context.restore();
        }
    }
}
