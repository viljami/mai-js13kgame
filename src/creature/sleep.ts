import { Vec2 } from "../components/vec2";
import { CreatureStates, Resources } from "../resources";
import { incrementSleep, Store } from "../store";
import { CreatureState } from "./base";
import { SleepZzz } from "./zzz";

export class Sleep extends CreatureState {
    sleepZzzs = [];
    time = 0;
    resources: Resources;
    stopped = false;
    store: Store;

    constructor(creature: CreatureStates, resources: Resources, store: Store) {
        super(creature);
        this.resources = resources;
        this.store = store;
        this.sleepZzzs.push(new SleepZzz(resources, Vec2.new(15, 30), -50, 700));
    }

    exit() {
        this.stopped = true;
    }

    step(dt: number) {
        this.sleepZzzs = this.sleepZzzs.filter(a => !a.isDone());
        this.sleepZzzs.forEach(z => z.step(dt));
        this.time += dt;

        if (!this.stopped && this.time >= 400) {
            this.time = 0;
            this.sleepZzzs.push(new SleepZzz(this.resources, Vec2.new(15, 30), -50, 700));
            this.store.dispatch(incrementSleep);
        }
    }

    draw(context: CanvasRenderingContext2D) {
        this.sleepZzzs.forEach(a => a.draw(context));
        this.creature.tired.draw(context, 0, 0);
    }

    isDone(): boolean {
        return this.sleepZzzs.length == 0;
    }
}
