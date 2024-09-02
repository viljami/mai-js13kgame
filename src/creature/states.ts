import { Vec2 } from "../components/vec2";
import { Resources } from "../resources";
import { Store } from "../store";
import { Button } from "../ui/gismo";
import { CreatureState } from "./base";
import { Eat, Play, Sleep } from "./bubbling";
import { Idle } from "./idle";

export class Eating {

}

export class Tired {

}

export class Playful {

}


export class CreatureStateManager {
    stack: CreatureState[] = []; // Last is active
    subStates: CreatureState[] = []; // concurrent with each other and active main state
    store: Store;
    resources: Resources;

    constructor(store: Store, resources: Resources) {
        this.store = store;
        this.resources = resources;
        const state = store.getState();
        this.stack.push(new Idle(this.resources.creature[state.creature.evolution]))
    }

    getSize(): Vec2 {
        return this.stack[this.stack.length - 1].creature.idle.frames[0].size;
    }

    handleInput(buttons: Button[]) {
        const state = this.store.getState();
        let active = this.stack[this.stack.length - 1];
        let isDrops = false;
        let isFood = false;
        let isNote = false;


        for (let { type, down } of buttons) {
            if (down) {
                switch (type) {
                    case 'zzz':
                        isDrops = true;

                        if (!(active instanceof Sleep)) {
                            this.stack.push(new Sleep(this.resources.creature[state.creature.evolution], this.resources, this.store));
                        }

                        break;

                    case 'note':
                        isNote = true;
                        if (!(active instanceof Play)) {
                            this.stack.push(new Play(this.resources.creature[state.creature.evolution], this.resources, this.store));
                        }
                        break;

                    case 'food':
                        isFood = true;
                        if (!(active instanceof Eat)) {
                            this.stack.push(new Eat(this.resources.creature[state.creature.evolution], this.resources, this.store));
                        }
                        break;

                    default:
                        break;
                }
            }
        }

        if (!isDrops && active instanceof Sleep) {
            active.exit();
        }

        if (!isFood && active instanceof Eat) {
            active.exit();
        }

        if (!isNote && active instanceof Play) {
            active.exit();
        }

        const newState = active.handleInput();

        if (newState != null) {
            if (active.isDone()) {
                active.exit();
                this.stack.pop();
            }

            newState.enter();
            this.stack.push(newState);
            return;
        }

        if (active.isDone()) {
            active.exit();
            this.stack.pop();
        }
    }

    step(dt) {
        const state = this.store.getState();
        const active = this.stack[this.stack.length - 1];
        active.setCreature(this.resources.creature[state.creature.evolution]);
        active.step(dt);
        this.subStates.forEach(s => s.step(dt));
    }

    draw(context: CanvasRenderingContext2D) {
        this.stack[this.stack.length - 1].draw(context);
        this.subStates.forEach(s => s.draw(context));
    }
}
