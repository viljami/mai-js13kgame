import { easeInOutQuad, Easing } from "../components/easing";
import { Sprite } from "../components/sprite";
import { Vec2 } from "../components/vec2";
import { SPRITE_SPEED } from "../config";
import { CreatureStates, Resources } from "../resources";
import { eat, incrementSleep, noop, play, Store } from "../store";
import { Display } from "../ui/display";
import { Step } from "../views/view-manager";
import { CreatureState } from "./base";

const createBubbling = (className: string, resourceName: string, creatureLook: string, storeDispatch) => {
    class BubblingItem implements Step, Display {
        pos: Vec2;
        targetY: number;
        easing: Easing;
        time: number = 0;
        sprite: Sprite;

        constructor(resources: Resources, pos: Vec2, targetY: number, durationMs: number) {
            this.pos = pos;
            this.targetY = targetY;
            this.easing = new Easing(this.pos.y, targetY, durationMs, easeInOutQuad);
            this.sprite = resources[resourceName];
        }

        step(dt: number) {
            this.time += dt;
            this.easing.step(dt);
            this.pos.x += 2 * Math.sin(this.time / this.easing.durationMs * Math.PI * 3);
            this.pos.y = this.easing.getValue();
        }

        draw(context: CanvasRenderingContext2D) {
            this.sprite.draw(context, this.pos.x, this.pos.y, false, 20, 20);
        }

        isDone() {
            return this.easing.isDone();
        }
    }

    return class className extends CreatureState {
        static Bubbling = BubblingItem;

        bubbling: BubblingItem[] = [];
        time = 0;
        resources: Resources;
        stopped = false;
        store: Store;

        constructor(creature: CreatureStates, resources: Resources, store: Store) {
            super(creature);
            this.resources = resources;
            this.store = store;
            this.bubbling.push(new BubblingItem(resources, Vec2.new(15, -15), -40, 700));
        }

        exit() {
            this.stopped = true;
        }

        step(dt: number) {
            this.bubbling = this.bubbling.filter(a => !a.isDone());
            this.bubbling.forEach(z => z.step(dt));
            this.time += dt;

            if (!this.stopped && this.time >= 400) {
                this.time = 0;
                this.bubbling.push(new BubblingItem(this.resources, Vec2.new(15, -15), -40, 700));
                this.store.dispatch(storeDispatch);
            }
        }

        draw(context: CanvasRenderingContext2D) {
            if (this.creature[creatureLook]) {
                this.creature[creatureLook].draw(context, 0, 0);
            } else {
                this.creature.idle.draw(context, 0, 0);
            }
            this.bubbling.forEach(a => a.draw(context));
        }

        isDone(): boolean {
            return this.bubbling.length == 0;
        }
    }
};

export const Sleep = createBubbling('Sleep', 'zzz', 'tired', incrementSleep);
export const Sick = createBubbling('Sick', 'bubble', 'sick', noop);
export const Play = createBubbling('Play', 'note', 'idle', play);
export const Eat = createBubbling('Eat', 'food', 'hungry', eat);
