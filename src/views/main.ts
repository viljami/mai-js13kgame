import { GIZMO_SCREEN_HEIGHT, GIZMO_SCREEN_WIDTH } from "../config";
import { CreatureStateManager } from "../creature/states";
import { Resources } from "../resources";
import { Store } from "../store";
import { Button } from "../ui/gismo";
import { NextView, View } from "./view-manager";

export const VIEW_EXIT_DURATION = 2000.;

export class MainView extends View {
    resources: Resources;
    store: Store;
    creatureState = 'idle';
    creatureStateManager: CreatureStateManager;

    timeExit = 0.;
    isExit = false;
    exitColors = ["#fff", "#000"];

    constructor(resources: Resources, store: Store, creatureStateManager: CreatureStateManager) {
        super();
        this.resources = resources;
        this.store = store;
        this.creatureStateManager = creatureStateManager;
    }

    enter() {
        this.timeExit = 0.;
        this.isExit = false;
    }

    exit() {
        this.isExit = true;
    }

    isDone() {
        return this.isExit && this.timeExit >= VIEW_EXIT_DURATION;
    }

    handleInput(buttons: Button[]): NextView | undefined {
        this.creatureStateManager.handleInput(buttons);

        if (buttons.some(({ type, down }) => type === 'food' && down)) {
            return 'foodGame';
        }
    }

    step(dt: number) {
        if (this.isExit) {
            this.timeExit += dt;
        }

        this.creatureStateManager.step(dt);
    }

    draw(context: CanvasRenderingContext2D) {
        const size = this.creatureStateManager.getSize();

        context.save();
        context.translate(GIZMO_SCREEN_WIDTH / 2 - size.x / 2, GIZMO_SCREEN_HEIGHT - size.y);
        if (this.isExit) {
            for (let i = 1; i <= 10; i++) {
                context.fillStyle = i % 2 ? this.exitColors[0] : this.exitColors[1];
                context.fillRect(0, 0, GIZMO_SCREEN_WIDTH / 10 * i, GIZMO_SCREEN_HEIGHT / 10 * i);
                this.exitColors.reverse();
            }
        }
        this.creatureStateManager.draw(context)
        context.restore();
    }
}
