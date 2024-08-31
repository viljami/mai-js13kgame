import { BUTTON_HEIGHT, BUTTON_WIDTH, GIZMO_EARS_SIZE, GIZMO_MARGIN, GIZMO_SCREEN_HEIGHT, GIZMO_SCREEN_WIDTH, WIDTH } from "../config";
import { Resources } from "../resources";
import { Input, InputManager } from "../components/input";
import { Sprite } from "../components/sprite";
import { Vec2 } from "../components/vec2";
import { Display } from "./display";
import { Evolution, levels } from "../creature/levels";

const { floor, PI } = Math;
const PI2 = PI * 2.;
const cornersTop = [8, 8, 0, 0];
const cornersBottom = [0, 0, 8, 8];

const drawButton = (context: CanvasRenderingContext2D, sprite: Sprite, x: number, y: number, active = false) => {
    context.fillStyle = '#fff';
    context.fillRect(x, y, BUTTON_WIDTH, BUTTON_HEIGHT);

    sprite.draw(context, x, y, active, BUTTON_WIDTH, BUTTON_HEIGHT);
}

export type Button = {
    type: string,
    down: boolean
};

export class Gizmo implements Display {
    size: Vec2;
    resources: any;
    input: InputManager;
    enabled = false;
    buttons: Button[] = [];

    constructor(resources: Resources, size: Vec2, input: InputManager) {
        this.size = size;
        this.resources = resources;
        this.input = input;
    }

    setButtonTypes(buttonTypes: string[]) {
        if (buttonTypes.length != this.buttons.length) {
            this.buttons.length = buttonTypes.length;
            this.buttons = buttonTypes.map(type => ({ type, down: false }));
        }
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
        this.buttons.forEach(a => a.down = false);

        // this.input.inputs.forEach(({ pos }) => {
        if (this.input.inputs.length > 0) {
            const pos = this.input.inputs[0].pos;
            const x = pos.x / innerWidth * WIDTH;
            const all = this.buttons;

            for (let i = 0; i < this.buttons.length; i++) {
                const button = this.buttons[i];

                if (all.length == 1) {
                    this.buttons[i].down = true;
                    break;
                }

                if (i < all.length - 1) {
                    if (x < w2 - 15 + 30 * i) {
                        this.buttons[i].down = true;
                    }
                    break;
                }

                if (x > w2 - 15 + 30 * i) {
                    this.buttons[i].down = true;
                    break;
                }
            }
        // });
        }
    }

    draw(context: CanvasRenderingContext2D) {
        const { x: w, y: h } = this.size;
        const w2 = floor(w / 2.);
        const h2 = floor(h / 2.);
        const r = w < h ? w2 : h2;

        // Screen
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
        const { idle } = this.resources.food;
        const size = idle.getSize();

        this.buttons.forEach(({ type, down }, i, all) => {
            drawButton(context, this.resources[type].idle, w2 - 45 + 35 * i, h2 + size.y + 15, down);
        });
    }
}
