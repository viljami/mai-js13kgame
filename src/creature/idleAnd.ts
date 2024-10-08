import { Timer } from "../components/timer";
import { SPRITE_SPEED } from "../config";
import { CreatureStates } from "../resources";
import { Store } from "../store";
import { CreatureState } from "./base";

export class IdleAnd extends CreatureState {
    creatureState: string;
    timer: Timer;
    stateName: string;
    state90Name: string;

    constructor(creature: CreatureStates, timer: Timer, stateName: string, state90Name: string) {
        super(creature);
        this.timer = timer;
        this.creature = creature;
        this.stateName = stateName;
        this.state90Name = state90Name;
        this.creatureState = this.stateName;
    }

    handleInput(): CreatureState | null {
        return null;
    }

    step(dt) {
        const { percentage } = this.timer;

        if (percentage > .9) {
            this.creatureState = this.state90Name;
        } else {
            this.creatureState = this.stateName;

            if (this.creature[this.creatureState]) {
                this.creature[this.creatureState].speed = SPRITE_SPEED * (1.3 - percentage);
            }
        }

        this.creature[this.creatureState]?.step(dt);
    }

    draw(context: CanvasRenderingContext2D) {
        this.creature[this.creatureState]?.draw(context, 0, 0);
    }

    isDone(): boolean {
        return this.timer.percentage < 0.3;
    }
}
