import { SPRITE_SPEED } from "../config";
import { CreatureStates, Resources } from "../resources";
import { eat, Store } from "../store";
import { CreatureState } from "./base";

export class Eat extends CreatureState {
    store: Store;
    stopped = false;
    time = 0;
    resources: Resources;

    constructor(creature: CreatureStates, resources: Resources, store: Store) {
        super(creature);
        this.store = store;
        this.resources = resources;
        this.creature = creature;
    }

    exit() {
        this.stopped = true;
    }

    handleInput(): CreatureState | null {
        return null;
    }

    step(dt) {
        this.creature.idleHungry.step(dt);
        this.creature.idleHungry.speed = SPRITE_SPEED * 0.5;

        if (!this.stopped && this.time >= 400) {
            this.time = 0;
            this.store.dispatch(eat);
        }
    }

    draw(context: CanvasRenderingContext2D) {
        this.creature.idleHungry.draw(context, 0, 0);
    }

    isDone(): boolean {
        return this.stopped;
    }
}
