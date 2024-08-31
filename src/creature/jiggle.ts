import { Vec2 } from "../components/vec2";
import { CREATURE_SIDE_JIGGLE_DURATION } from "../config";
import { CreatureStates } from "../resources";
import { CreatureState } from "./base";

export class Jiggle extends CreatureState {
    pos = Vec2.ZERO.clone();
    start = 0;

    constructor(creature: CreatureStates) {
        super(creature);
    }

    enter() {
        this.start = 0;
        this.pos.x = 0;
    }

    step(dt: number) {
        this.creature.idle.step(dt);
        this.start += dt;

        if (this.start < CREATURE_SIDE_JIGGLE_DURATION / 3) {
            this.pos.x = 1;
        } else if (this.start < CREATURE_SIDE_JIGGLE_DURATION / 2) {
            this.pos.x = -1;
        } else {
            this.pos.x = 0;
        }
    }

    draw(context: CanvasRenderingContext2D) {
        this.creature.idle.draw(context, this.pos.x, this.pos.y);
    }

    isDone(): boolean {
        return this.start >= CREATURE_SIDE_JIGGLE_DURATION;
    }
}
