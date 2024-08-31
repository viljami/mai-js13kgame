import { SPRITE_SPEED } from "../config";
import { CreatureStates } from "../resources";
import { Store } from "../store";
import { CreatureState } from "./base";

export class Hungry extends CreatureState {
    store: Store;
    creatureState: string;

    constructor(creature: CreatureStates, store: Store) {
        super(creature);
        this.store = store;
        this.creature = creature;
    }

    handleInput(): CreatureState | null {
        return null;
    }

    step(dt) {
        this.creature.hungry.step(dt);
        const { percentage } = this.store.getState().creature.hungry;

        if (percentage > .9) {
            this.creatureState = 'hungry';
        } else {
            this.creatureState = 'idleHungry';
            this.creature.idleHungry.speed = SPRITE_SPEED * (1.3 - percentage);
        }
    }

    draw(context: CanvasRenderingContext2D) {
        this.creature[this.creatureState].draw(context, 0, 0);
    }

    isDone(): boolean {
        return this.store.getState().creature.hungry.value < 0.3; // "Root state"
    }
}
