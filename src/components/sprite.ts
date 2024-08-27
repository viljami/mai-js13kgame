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
        this.speed = SPEED;
    }

    setSpeed(speedMS: number) {
        this.speed = speedMS;
    }

    getSize() {
        return this.frames[this.activeFrame].size;
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

    draw(context, x: number, y: number, invert = false, dw?: number, dh?: number) {
        const frame = this.frames[this.activeFrame];
        const { x: w, y: h } = frame.size;
        dw = (dw ? dw : w) * SCALE;
        dh = (dh ? dh : h) * SCALE;
        context.drawImage(this.sheet, frame.pos.x, frame.pos.y, w, h, x, y, dw, dh);

        if (invert) {
            context.save()
            context.fillStyle = 'white';
            context.globalCompositeOperation = 'difference';
            context.fillRect(x, y, dw, dh);
            context.restore();
        }
    }
}
