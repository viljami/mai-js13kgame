import { BUTTON_HEIGHT, BUTTON_WIDTH, GIZMO_EARS_SIZE, GIZMO_MARGIN, GIZMO_SCREEN_HEIGHT, GIZMO_SCREEN_WIDTH, WIDTH } from "../config";
import { Resources, resourcesService } from "../resources";
import { Input, InputManager } from "../components/input";
import { Sprite } from "../components/sprite";
import { Vec2 } from "../components/vec2";
import { Display } from "./display";
import { Evolution, levels } from "../creature/levels";
import { setButtonsUp, Store } from "../store";

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
    store: Store;

    constructor(size: Vec2, input: InputManager) {
        this.size = size;
        this.resources = resourcesService.getInstance();
        this.store = Store.getInstance();
        this.input = input;
    }

    setSize(size: Vec2) {
        this.size = size;
    }

    activate() {
        if (this.enabled) {
            return;
        }

        this.store.dispatch(setButtonsUp);
        this.enabled = true;
        this.input.activate();
    }

    disable() {
        if (!this.enabled) {
            return;
        }

        this.enabled = false;
        this.input.disable();
        this.store.dispatch(setButtonsUp);
    }

    step(dt: number) {
        this.store.dispatch(setButtonsUp);

        const { inputEnabled } = this.store.getState();

        if (!inputEnabled) {
            return;
        }

        const { innerWidth } = window;
        const { x: w, y: h } = this.size;
        const w2 = floor(w / 2.);

        if (this.input.inputs.length > 0) {
            const pos = this.input.inputs[0].pos;
            const x = pos.x / innerWidth * WIDTH;
            const { buttons } = this.store.getState();

            switch (buttons.length) {
                case 1:
                    buttons[0].down = true;
                    break;
                case 2:
                    if (x <= w2 - 15 + 30 * 0) {
                        buttons[0].down = true;
                        break;
                    }

                    if (x > w2 - 15 + 30 * 1) {
                        buttons[1].down = true;
                        break;
                    }
                    break;
                case 3:
                    if (x < w2 - 15 + 30 * 0) {
                        buttons[0].down = true;
                        break;
                    }

                    if (x <= w2 - 15 + 30 * 1) {
                        buttons[1].down = true;
                        break;
                    }

                    if (x > w2 - 15 + 30 * 1) {
                        buttons[2].down = true;
                        break;
                    }
                    break;
                default:
                    throw new Error(`More buttons than can handle ${buttons.length}`);
            }
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
        const size = this.resources.food.getSize();

        this.store.getState().buttons.forEach(({ type, down }, i, all) => {
            switch (all.length) {
                case 1: {
                    drawButton(context, this.resources[type], w2 - 45 + 35, h2 + size.y + 15, down);
                    break;
                }
                case 2: {
                    drawButton(context, this.resources[type], w2 - 45 + 35 * i * 2, h2 + size.y + 15, down);
                    break;
                }
                case 3: {
                    drawButton(context, this.resources[type], w2 - 45 + 35 * i, h2 + size.y + 15, down);
                    break;
                }
                default:
                    break;
            }
        });
    }
}
