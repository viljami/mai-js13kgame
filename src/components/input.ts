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

export class InputManager {
    inputs: Input[] = [];

    activate() {
        const { body } = document;
        body.addEventListener("pointerdown", this.onPointerDown);
        body.addEventListener("pointerup", this.onPointerUp);
    }

    disable() {
        this.inputs.length = 0;
        const { body } = document;
        body.removeEventListener("pointerdown", this.onPointerDown);
        body.removeEventListener("pointerup", this.onPointerUp);
    }

    onPointerDown = ({ x, y, pointerId, timeStamp }: PointerEvent) => {
        this.inputs.push(new Input(pointerId, Vec2.new(x, y), timeStamp));
    }

    onPointerUp = ({ x, y, pointerId, timeStamp }: PointerEvent) => {
        const index = this.inputs.findIndex(({ id }) => id == pointerId);

        if (index != -1) {
            this.inputs.splice(index, 1);
        } else {
            this.inputs.length = 0;
        }
    }
}
