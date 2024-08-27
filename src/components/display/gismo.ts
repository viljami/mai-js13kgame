import { BUTTON_HEIGHT, BUTTON_WIDTH, GIZMO_EARS_SIZE, GIZMO_MARGIN, GIZMO_SCREEN_HEIGHT, GIZMO_SCREEN_WIDTH, WIDTH } from "../../config";
import { Resources } from "../../resources";
import { Input, InputManager } from "../input";
import { Sprite } from "../sprite";
import { Vec2 } from "../vec2";
import { Display } from "./display";

const { floor, PI } = Math;
const PI2 = PI * 2.;
const cornersTop = [8, 8, 0, 0];
const cornersBottom = [0, 0, 8, 8];

const drawButton = (context: CanvasRenderingContext2D, sprite: Sprite, x: number, y: number, active = false) => {
    context.fillStyle = '#fff';
    context.fillRect(x, y, BUTTON_WIDTH, BUTTON_HEIGHT);

    sprite.draw(context, x, y, active, BUTTON_WIDTH, BUTTON_HEIGHT);
}

export class Gizmo implements Display {
    size: Vec2;
    resources: any;
    input: InputManager;
    enabled = false;
    button1 = false;
    button2 = false;
    button3 = false;

    constructor(resources: Resources, size: Vec2, input: InputManager) {
        this.size = size;
        this.resources = resources;
        this.input = input;
    }

    setSize(size: Vec2) {
        this.size = size;
    }

    activate() {
        if (this.enabled) {
            return;
        }

        this.enabled = true;
        this.input.activate();
    }

    disable() {
        if (!this.enabled) {
            return;
        }

        this.enabled = false;
        this.input.disable();
    }

    step(dt: number) {
        const { innerWidth } = window;
        const { x: w, y: h } = this.size;
        const w2 = floor(w / 2.);
        this.button1 = false;
        this.button2 = false;
        this.button3 = false;

        this.input.inputs.forEach(({ pos }) => {
            const x = pos.x / innerWidth * WIDTH;

            if (x < w2 - 15) {
                this.button1 = true;
                return;
            }

            if (x < w2 + 15) {
                this.button2 = true;
                return;
            }

            if (x > w2 + 15) {
                this.button3 = true;
            }
        });
    }

    draw(context: CanvasRenderingContext2D) {
        const { x: w, y: h } = this.size;
        const w2 = floor(w / 2.);
        const h2 = floor(h / 2.);
        const r = w < h ? w2 : h2;

        context.fillStyle = "#000";
        context.beginPath();
        context.roundRect(GIZMO_MARGIN, GIZMO_MARGIN, w - GIZMO_MARGIN * 2, h - GIZMO_MARGIN * 2, cornersBottom); // clock-wise
        context.roundRect(GIZMO_MARGIN, GIZMO_MARGIN - GIZMO_EARS_SIZE.y, GIZMO_EARS_SIZE.x, GIZMO_EARS_SIZE.y, cornersTop); // clock-wise
        context.roundRect(w - GIZMO_MARGIN - GIZMO_EARS_SIZE.x, GIZMO_MARGIN - GIZMO_EARS_SIZE.y, GIZMO_EARS_SIZE.x, GIZMO_EARS_SIZE.y, cornersTop); // clock-wise
        context.rect(w, 0, -w, h); // counter-clock-wise
        context.fill();

        // context.save()
        // context.fillStyle = '#fff';
        // context.globalCompositeOperation = 'difference';
        // context.fillRect(0, 0, w, h);
        // context.restore();

        const { idle, size } = this.resources.food;
        drawButton(context, idle, w2 - 45, h2 + size.y + 15, this.button1);
        drawButton(context, idle, w2 - 10, h2 + size.y + 20, this.button2);
        drawButton(context, idle, w2 + 25, h2 + size.y + 15, this.button3);
    }
}
