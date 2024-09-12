import { Vec2 } from "../components/vec2"
import { DEBUG_MODE } from "../config";
import { Display } from "./display";

export type Percentage = number;

export class ProgressBar implements Display {
    position: Vec2;
    size: Vec2;
    value: Percentage; // 0.0 - 1.0

    constructor(position: Vec2, size: Vec2) {
        this.position = position;
        this.size = size;
    }

    setValue(value: Percentage) {
        if (this.value < 0) {
            if (DEBUG_MODE) throw new Error("Value below zero");
        }

        if (this.value > 1) {
            if (DEBUG_MODE) throw new Error("Value above one");
        }

        this.value = value;
    }

    draw(context: CanvasRenderingContext2D) {
        context.fillStyle = "#000";
        context.fillRect(this.position.x, this.position.y, this.size.x, this.size.y);
        context.fillStyle = "#fff";
        context.fillRect(this.position.x, this.position.y, this.size.x * this.value, this.size.y);
    }
}
