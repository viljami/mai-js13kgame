import { Vec2 } from "./vec2";

export class Input {
    id: number;
    pos: Vec2;
    timestamp: number;

    constructor(id: number, pos: Vec2, timestamp: number) {
        this.id = id;
        this.pos = pos;
        this.timestamp = timestamp;
    }
}

const KEYBOARD_EVENT_ID = 99999999;

export class InputManager {
    inputs: Input[] = [];

    activate() {
        const { body } = document;
        document.addEventListener('contextmenu', this.disableContextMenu);
        body.addEventListener("keydown", this.onKeyDown);
        body.addEventListener("pointerdown", this.onPointerDown);
        body.addEventListener("pointermove", this.onPointerUp);
        body.addEventListener("pointerup", this.onPointerUp);
        body.addEventListener("pointerleave", this.onPointerUp);
        body.addEventListener("pointerout", this.onPointerUp);
        body.addEventListener("pointercancel", this.onPointerUp);
        this.inputs.length = 0;
    }

    disable() {
        const { body } = document;
        document.removeEventListener('contextmenu', this.disableContextMenu);
        body.removeEventListener("keyup", this.onKeyUp);
        body.removeEventListener("pointerdown", this.onPointerDown);
        body.removeEventListener("pointermove", this.onPointerUp);
        body.removeEventListener("pointerup", this.onPointerUp);
        body.removeEventListener("pointerleave", this.onPointerUp);
        body.removeEventListener("pointerout", this.onPointerUp);
        body.removeEventListener("pointercancel", this.onPointerUp);
        this.inputs.length = 0;
    }

    disableContextMenu = (event) => {
        event.preventDefault();
    };

    onKeyDown = ({ key }: KeyboardEvent) => {
        switch (key) {
            case "ArrowLeft":
                this.inputs[0] = new Input(KEYBOARD_EVENT_ID, Vec2.new(0, 0), 0);
                break;
            case "ArrowRight":
                this.inputs[0] = new Input(KEYBOARD_EVENT_ID + 1, Vec2.new(window.innerWidth, 0), 0);
                break;
            case "ArrowDown":
                this.inputs[0] = new Input(KEYBOARD_EVENT_ID + 2, Vec2.new(window.innerWidth / 2, 0), 0);
                break;
            default:
                this.inputs.length = 0;
                break;
        }
    }

    onKeyUp = ({ key }: KeyboardEvent) => {
        let index = -1;

        switch (key) {
            case "ArrowLeft":
                index = this.inputs.findIndex(({ id }) => id == KEYBOARD_EVENT_ID);
                break;
            case "ArrowRight":
                index = this.inputs.findIndex(({ id }) => id == KEYBOARD_EVENT_ID + 1);
                break;
            case "ArrowDown":
                index = this.inputs.findIndex(({ id }) => id == KEYBOARD_EVENT_ID + 2);
                break;
            default:
                break;
        }

        if (index != -1) {
            this.inputs.splice(index, 1);
        } else {
            this.inputs.length = 0;
        }
    }

    onPointerDown = (e: PointerEvent) => {
        e.preventDefault();
        const { x, y, pointerId, timeStamp } = e;
        // this.inputs.push(new Input(pointerId, Vec2.new(x, y), timeStamp));
        this.inputs[0] =new Input(pointerId, Vec2.new(x, y), timeStamp);
        return false;
    }

    onPointerUp = ({ pointerId }: PointerEvent) => {
        const index = this.inputs.findIndex(({ id }) => id == pointerId);

        if (index != -1) {
            this.inputs.splice(index, 1);
        } else {
            this.inputs.length = 0;
        }
    }
}
