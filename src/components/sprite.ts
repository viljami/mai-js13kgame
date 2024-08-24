import { Frame } from "./frame";

const SCALE = 1;
const SPEED = 700;
const { floor } = Math;

export class Sprite {
    public time = 0;
    public activeFrame = 0;
    public frames: Frame[];
    public sheet: HTMLCanvasElement | HTMLImageElement;

    constructor(frames: Frame[], sheet: HTMLCanvasElement | HTMLImageElement) {
        this.frames = frames;
        this.sheet = sheet;
    }

    step(dt) {
        this.time += dt;

        if (this.time >= SPEED) {
            this.time = 0;
            this.activeFrame++;

            if (this.activeFrame >= this.frames.length) {
                this.activeFrame = 0;
            }
        }
    }

    draw(context, x: number, y: number, invert = false) {
        const frame = this.frames[this.activeFrame];
        const { x: w, y: h } = frame.size;
        context.drawImage(this.sheet, frame.pos.x, frame.pos.y, w, h, x, y, w * SCALE, h * SCALE);

        if (invert) {
            context.globalCompositeOperation = 'difference';
            context.fillStyle = 'white';
            context.fillRect(x, y, w * SCALE, h * SCALE);
        }
    }
}
