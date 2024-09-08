import { easeInOutQuad, Easing, ParallelEasing, SequenceEasing } from "../components/easing";
import { Vec2 } from "../components/vec2";
import { GIZMO_SCREEN_HEIGHT, GIZMO_SCREEN_HEIGHT_HALF, GIZMO_SCREEN_WIDTH, GIZMO_SCREEN_WIDTH_HALF } from "../config";
import { Evolution, levels } from "../creature/levels";
import { CreatureStateManager } from "../creature/states";
import { Resources, resourcesService, statToAsset } from "../resources";
import { Button, moveCreature, setButtons, Store, toggleInput } from "../store";
import { Wave } from "./animations/wave";
import { NextView, View } from "./view-manager";

export const VIEW_EXIT_DURATION = 2000.;

export class MainView extends View {
    resources: Resources;
    store: Store;
    creatureState = 'idle';
    creatureStateManager: CreatureStateManager;
    creatureAnim = new ParallelEasing({
        dx: new SequenceEasing([
            new Easing(0, 5, 5000, easeInOutQuad),
            new Easing(5, 5, 1000, easeInOutQuad),
            new Easing(5, -5, 10000, easeInOutQuad),
            new Easing(-5, 0, 5000, easeInOutQuad),
            new Easing(0, 0, 6000, easeInOutQuad),
        ])
    })

    exitAnimation = new Wave(Vec2.new(GIZMO_SCREEN_WIDTH_HALF, GIZMO_SCREEN_HEIGHT_HALF));
    isExit = false;
    exitColors = ["#fff", "#000"];
    evolution: Evolution;

    constructor(creatureStateManager: CreatureStateManager) {
        super();
        this.resources = resourcesService.getInstance();
        this.store = Store.getInstance();
        this.evolution = this.store.getState().creature.evolution;
        this.creatureStateManager = creatureStateManager;
    }

    updateButtons() {
        const state = this.store.getState();
        const { evolution } = state.creature;
        const required = levels.requirements[evolution];

        this.store.dispatch(setButtons(Object
            .entries(required)
            .map(([key]) => statToAsset(key))
            .filter(a => !!a)));
    }

    enter() {
        this.updateButtons();
        this.exitAnimation.stop();
        this.exitAnimation.reset();
        this.isExit = false;
    }

    exit() {
        this.exitAnimation.start();
        this.isExit = true;
    }

    isDone() {
        return this.isExit && this.exitAnimation.isDone();
    }

    handleInput(buttons: Button[]): NextView | undefined {
        this.creatureStateManager.handleInput(buttons);

        if (buttons.some(({ type, down }) => type === 'food' && down)) {
            return 'foodGame';
        }
    }

    step(dt: number) {
        if (this.isExit) {
            this.exitAnimation.step(dt);
        }

        const { evolution, pos } = this.store.getState().creature;

        if (evolution != this.evolution) {
            this.evolution = evolution;
            this.updateButtons();
        }

        if (evolution === Evolution.SMALL || evolution == Evolution.BIG) {
            this.creatureAnim.step(dt);

            if (this.creatureAnim.isDone()) {
                this.creatureAnim.reset();
            }

            this.creatureAnim.getValue()
            this.store.dispatch(moveCreature(this.creatureAnim.value.dx));
        } else if (pos.x != 0) {
            this.store.dispatch(moveCreature(0));
        }

        this.creatureStateManager.step(dt);
    }

    draw(context: CanvasRenderingContext2D) {
        if (this.isExit) {
            this.exitAnimation.draw(context);
        } else {
            const size = this.creatureStateManager.getSize();
            context.save();
            context.translate(GIZMO_SCREEN_WIDTH / 2 - size.x / 2, GIZMO_SCREEN_HEIGHT - size.y);
            this.creatureStateManager.draw(context)
            context.restore();
        }
    }
}
