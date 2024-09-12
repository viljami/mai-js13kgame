import { Button } from "../store";
import { Display } from "../ui/display";

export interface Step {
    step(dt: number);
}

export interface InputHandler {
    handleInput(buttons: Button[]): View | undefined;
}

export abstract class View implements Display, Step, InputHandler {
    step(dt: number) {
    }

    abstract handleInput(buttons: Button[]): View | undefined;

    draw(context: CanvasRenderingContext2D) {
    }

    enter() { }

    exit() { }

    isDone() {
        return true;
    }
}
