import { CreatureState } from "./base";
import { easeLinear, Easing, SequenceEasing } from "../components/easing";
import { resourcesService } from "../resources";

export class Grown extends CreatureState {
    headJiggleAnim = new SequenceEasing([
        new Easing(0, 1, 1000, easeLinear),
    ]);
    resources = resourcesService.getInstance();

    handleInput(): CreatureState | null {
        return null;
    }

    step(dt) {
        this.headJiggleAnim.step(dt);

        if (this.headJiggleAnim.isDone()) {
            this.headJiggleAnim.reset();
        }
    }

    draw(context: CanvasRenderingContext2D) {
        this.resources.creature.grown.head.draw(context, this.headJiggleAnim.getValue(), 0);
        this.resources.creature.grown.body.draw(context, 0, 50);
    }

    isDone(): boolean {
        return false; // "Root state"
    }
}
