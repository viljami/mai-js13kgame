import { Vec2 } from "../components/vec2";
import { Resources, resourcesService } from "../resources";
import { Button, End, moveCreature, Store, toggleInput } from "../store";
import { Wave } from "../views/animations/wave";
import { CreatureState } from "./base";
import { Eat, Play, Sick, Sleep } from "./bubbling";
import { Grown } from "./grown";
import { Idle } from "./idle";
import { IdleAnd } from "./idleAnd";
import { Jiggle } from "./jiggle";
import { Evolution } from "./levels";

const GROWN_SIZE = Vec2.new(100, 100);

export class CreatureStateManager {
    stack: CreatureState[] = []; // Last is active
    subStates: CreatureState[] = []; // concurrent with each other and active main state
    store: Store;
    resources: Resources;
    evolution: Evolution;
    evolveAnim = new Wave(Vec2.new(50, 50));

    constructor() {
        this.resources = resourcesService.getInstance();
        this.store = Store.getInstance();
        const state = this.store.getState();
        this.evolution = state.creature.evolution;
        this.stack.push(new Idle(this.resources.creature[this.evolution]))
    }

    getSize(): Vec2 {
        if (this.evolution === Evolution.GROWN) {
            return GROWN_SIZE;
        }

        return this.stack[this.stack.length - 1].creature.idle.frames[0].size;
    }

    handleInput(buttons: Button[]) {
        const state = this.store.getState();
        let active = this.stack[this.stack.length - 1];
        let isDrops = false;
        let isFood = false;
        let isNote = false;
        const { stats, tired, hungry, playful } = state.creature;
        const isActiveSleep = active instanceof Sleep;
        const isActivePlay = isActiveSleep ? false : active instanceof Play;
        const isActiveEat = isActiveSleep || isActivePlay ? false : active instanceof Eat;

        for (let { type, down } of buttons) {
            if (down) {
                switch (type) {
                    case 'zzz':
                        isDrops = true;

                        if (!isActiveSleep) {
                            this.stack.push(new Sleep(this.resources.creature[state.creature.evolution], this.resources, this.store));
                        }

                        break;

                    case 'note':
                        isNote = true;
                        if (!isActivePlay) {
                            this.stack.push(new Play(this.resources.creature[state.creature.evolution], this.resources, this.store));
                        }
                        break;

                    case 'food':
                        isFood = true;
                        if (!isActiveEat) {
                            this.stack.push(new Eat(this.resources.creature[state.creature.evolution], this.resources, this.store));
                        }
                        break;

                    default:
                        break;
                }
            }
        }

        if (!isDrops && isActiveSleep) {
            active.exit();
        }

        if (!isFood && isActiveEat) {
            active.exit();
        }

        if (!isNote && isActivePlay) {
            active.exit();
        }

        let newState = active.handleInput();

        if (this.evolution !== Evolution.EGG && newState instanceof Jiggle) {
            newState = null;
        }

        if (this.evolution === Evolution.SMALL || this.evolution === Evolution.BIG) {
            if (newState == null && !isActiveSleep && !isActiveEat && !isActivePlay && !(active instanceof IdleAnd)) {
                if (tired.percentage >= .5) {
                    newState = new IdleAnd(this.resources.creature[this.evolution], tired, 'tired', 'idleTired');
                } else if (hungry.percentage >= .3) {
                    newState = new IdleAnd(this.resources.creature[this.evolution], hungry, 'hungry', 'idleHungry');
                } else if (playful.percentage >= .5) {
                    newState = new IdleAnd(this.resources.creature[this.evolution], playful, 'angry', 'idleAngry');
                } else if (stats.sick > 10) {
                    newState = new Sick(this.resources.creature[this.evolution], this.resources, this.store);
                }
            }
        }

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
        const { evolution } = state.creature;

        if (this.evolution != evolution) {
            if (this.evolveAnim.isStopped) {
                this.store.dispatch(toggleInput(false));
                this.evolveAnim.start();
            }

            this.evolveAnim.step(dt);

            if (this.evolveAnim.isDone()) {
                this.evolveAnim.stop();
                this.evolveAnim.reset();
                this.evolution = evolution;
                const creature = this.resources.creature[this.evolution];
                this.stack.forEach(a => a.setCreature(creature));
                this.subStates.forEach(a => a.setCreature(creature));
                this.store.dispatch(toggleInput(true));
            }
        }

        if (this.evolution == Evolution.GROWN) {
            this.stack.length = 1;
            this.subStates.length = 0;
            this.store.dispatch(moveCreature(0));

            if (!(this.stack[0] instanceof Grown)) {
                this.stack[0] = new Grown(this.resources.creature.small);
            }
        }

        active.step(dt);
        this.subStates.forEach(s => s.step(dt));
    }

    draw(context: CanvasRenderingContext2D) {
        const state = this.store.getState();

        context.save();

        if (state.end == End.SIMPLY_DEAD) {
            this.resources.creature[this.evolution]?.dead.draw(context, 0, 0);
        } else {
            context.translate(state.creature.pos.x, 0);
            this.stack[this.stack.length - 1].draw(context);
            this.subStates.forEach(s => s.draw(context));
        }

        context.restore();
    }
}
