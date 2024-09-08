import { CREATURE_SIDE_JIGGLE_DELAY } from "../config";
import { CreatureStates } from "../resources";
import { Jiggle } from "./jiggle";
import { CreatureState } from "./base";
import { Vec2 } from "../components/vec2";

export class Idle extends CreatureState {
    lastSideJiggle: number = 0;
    jiggleWait = 0;

    constructor(creature: CreatureStates) {
        super(creature);
    }

    handleInput(): CreatureState | null {
        if (this.jiggleWait >= CREATURE_SIDE_JIGGLE_DELAY) {
            this.jiggleWait = 0;
            return new Jiggle(this.creature);
        }

        return null;
    }

    step(dt) {
        this.creature.idle.step(dt);
        this.jiggleWait += dt;
    }

    draw(context: CanvasRenderingContext2D) {
        this.creature.idle.draw(context, 0, 0);
    }

    isDone(): boolean {
        return false; // "Root state"
    }
}
