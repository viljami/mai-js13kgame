import { easeInOutQuad, easeInQuad, easeLinear, easeOutQuad, Easing, ParallelEasing, SequenceEasing } from "../components/easing";
import { Vec2 } from "../components/vec2";
import { GIZMO_SCREEN_HEIGHT, GIZMO_SCREEN_HEIGHT_HALF, GIZMO_SCREEN_WIDTH, GIZMO_SCREEN_WIDTH_HALF } from "../config";
import { Evolution, levels } from "../creature/levels";
import { CreatureStateManager } from "../creature/states";
import { Resources, resourcesService, statToAsset } from "../resources";
import { Button, End, moveCreature, setButtons, Store, toggleInput } from "../store";
import { Wave } from "./animations/wave";
import { NextView, View } from "./view-manager";

export const VIEW_EXIT_DURATION = 2000.;

export class EndView extends View {
    resources: Resources;
    store: Store;
    // creatureState = 'angry';
    creatureStateManager: CreatureStateManager;
    ufoAnim = new ParallelEasing({
        ufoX: new SequenceEasing([
            new Easing(0, GIZMO_SCREEN_WIDTH_HALF - 25, 500, easeOutQuad),
            new Easing(GIZMO_SCREEN_WIDTH_HALF - 25, GIZMO_SCREEN_WIDTH_HALF - 25, 500, easeLinear),
            new Easing(GIZMO_SCREEN_WIDTH_HALF - 25, GIZMO_SCREEN_WIDTH - 25, 500, easeInQuad),
        ]),
        ufoY: new SequenceEasing([
            new Easing(0, GIZMO_SCREEN_HEIGHT_HALF - 25, 500, easeOutQuad),
            new Easing(GIZMO_SCREEN_HEIGHT_HALF - 25, GIZMO_SCREEN_HEIGHT_HALF - 25, 500, easeLinear),
            new Easing(GIZMO_SCREEN_HEIGHT_HALF - 25, 0, 500, easeInQuad),
        ]),
        creatureY: new SequenceEasing([
            new Easing(GIZMO_SCREEN_HEIGHT - 50, GIZMO_SCREEN_HEIGHT - 50, 500, easeLinear),
            new Easing(GIZMO_SCREEN_HEIGHT - 50, GIZMO_SCREEN_HEIGHT_HALF, 500, easeOutQuad),
        ]),
        creatureShrink: new SequenceEasing([
            new Easing(1, 1, 500, easeLinear),
            new Easing(1., 0.5, 500, easeLinear),
        ]),
    });
    creatureDropAnim = new Easing(0, 50, 500, easeInOutQuad);

    constructor(creatureStateManager: CreatureStateManager) {
        super();
        this.resources = resourcesService.getInstance();
        this.store = Store.getInstance();
        // this.evolution = this.store.getState().creature.evolution;
        this.creatureStateManager = creatureStateManager;
    }

    updateButtons() {
        this.store.dispatch(setButtons([]));
    }

    enter() {
        this.updateButtons();
        this.ufoAnim.reset();
    }

    exit() {

    }

    isDone() {
        return false;
    }

    handleInput(buttons: Button[]): NextView | undefined {
        return;
    }

    step(dt: number) {
        this.ufoAnim.step(dt);
        this.ufoAnim.getValue();
        this.creatureStateManager.step(dt);
    }

    draw(context: CanvasRenderingContext2D) {
        const size = this.creatureStateManager.getSize();

        switch (this.store.getState().end) {
            case End.NOT_YET:
            case End.BY_GIANT:
            case End.SIMPLY_DEAD: {
                context.save();
                context.translate(GIZMO_SCREEN_WIDTH / 2 - size.x / 2, GIZMO_SCREEN_HEIGHT - size.y);
                this.creatureStateManager.draw(context)
                context.restore();
                break;
            }
            case End.BY_UFO:
            case End.BY_HOLE: {
                const { ufoX, ufoY, creatureY, creatureShrink } = this.ufoAnim.value;

                if (creatureShrink > 0.5) {
                    context.save();
                    context.translate(GIZMO_SCREEN_WIDTH / 2 - size.x / 2 * creatureShrink, creatureY);
                    context.scale(creatureShrink, creatureShrink);
                    this.creatureStateManager.draw(context)
                    context.restore();
                }

                this.resources.ufo.idle.draw(context, ufoX, ufoY);

                break;
            }

            default:
                throw new Error("Unhandled end state");
        }
    }
}
