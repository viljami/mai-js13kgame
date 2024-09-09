import { Vec2 } from "../components/vec2";
import { GIZMO_SCREEN_HEIGHT, GIZMO_SCREEN_HEIGHT_HALF, GIZMO_SCREEN_WIDTH, GIZMO_SCREEN_WIDTH_HALF } from "../config";
import { CreatureStateManager } from "../creature/states";
import { Resources, resourcesService } from "../resources";
import { Button, eat, moveCreature, setButtons, Store } from "../store";
import { Wave } from "./animations/wave";
import { NextView, View } from "./view-manager";

const SPAWN_FOOD_DELAY = 2000;
const GRAVITY_DELAY = 50;
const MOVE_CREATURE_DELAY = 40;
const EAT_CREATURE_DELAY = 200;

const { abs, floor, max, random } = Math;

export class FoodGameView extends View {
    creaturePos = Vec2.new(GIZMO_SCREEN_WIDTH / 2., GIZMO_SCREEN_HEIGHT - 25);
    creatureVel = Vec2.ZERO.clone();
    foods: Vec2[] = [];
    resources: Resources;
    store: Store;
    creatureState = 'idle';
    timeEat = 0.;
    timeGravity = 1000.;
    timeMove = 0.;
    timeSpawn = 0.;
    exitAnimation = new Wave(Vec2.new(GIZMO_SCREEN_WIDTH_HALF, GIZMO_SCREEN_HEIGHT_HALF));
    isExit = false;
    creature: CreatureStateManager;

    constructor(creature: CreatureStateManager) {
        super();
        this.creature = creature;
        this.resources = resourcesService.getInstance();
        this.store = Store.getInstance();
    }

    isDone() {
        return this.isExit && this.exitAnimation.isDone();
    }

    enter() {
        this.creaturePos.x = GIZMO_SCREEN_WIDTH / 2;
        this.creaturePos.y = GIZMO_SCREEN_HEIGHT - 25;
        this.creatureVel.x = 0;
        this.creatureVel.y = 0;
        this.foods.length = 0;
        this.timeEat = 0.;
        this.timeGravity = 1000.; // First spawn earlier
        this.timeMove = 0.;
        this.timeSpawn = 0.;
        this.isExit = false;
        this.exitAnimation.stop();
        this.exitAnimation.reset();
        this.store.dispatch(setButtons(['left', 'down', 'right']));
        this.store.dispatch(moveCreature(0));
    }

    exit() {
        this.exitAnimation.start();
        this.isExit = true;
    }

    handleInput(buttons: Button[]): NextView | undefined {
        if (!buttons.length) {
            return;
        }

        this.creature.handleInput([]);
        const left = buttons[0].down;
        const right = buttons[buttons.length - 1].down;

        if (buttons[1].down) {
            this.exit();
            return;
        }

        if (left) {
            this.creatureVel.x = -1;
        }

        if (right) {
            this.creatureVel.x = 1;
        }

        if (!left && !right) {
            this.creatureVel.x = 0;
        }

        return;
    }

    step(dt: number) {
        if (this.isExit) {
            this.exitAnimation.step(dt);
        }

        this.timeGravity += dt;
        this.timeEat += dt;
        this.timeMove += dt;
        this.timeSpawn += dt;

        if (this.timeGravity > GRAVITY_DELAY) {
            this.timeGravity = 0.;
            this.foods.forEach(v => v.y += 1);
        }

        if (this.timeEat > EAT_CREATURE_DELAY) {
            this.timeEat = 0.;
            this.creatureState = 'idle';
        }

        if (this.timeMove > MOVE_CREATURE_DELAY) {
            this.timeMove = 0.;
            this.creaturePos.x += this.creatureVel.x;

            if (this.creaturePos.x >= GIZMO_SCREEN_WIDTH) {
                this.creaturePos.x--;
            }

            if (this.creaturePos.x <= 0) {
                this.creaturePos.x++;
            }
        }

        if (this.timeSpawn > SPAWN_FOOD_DELAY) {
            this.timeSpawn = 0.;
            this.foods.push(Vec2.new(max(0., floor(random() * GIZMO_SCREEN_WIDTH - 20.)), 0.))
        }

        this.foods = this.foods.filter(a => {
            if (this.creatureState == 'idle') {
                const dx = this.creaturePos.x - a.x;
                const dy = this.creaturePos.y - a.y;

                if (abs(dx) < 10 && abs(dy) < 10) {
                    this.store.dispatch(eat);
                    this.creatureState = 'hungry';
                    this.timeEat = 0.;
                    return false;
                }
            }

            return a.y < GIZMO_SCREEN_HEIGHT - 20;
        })
    }

    draw(context: CanvasRenderingContext2D) {
        if (this.isExit) {
            this.exitAnimation.draw(context);
        } else {
            if (this.creatureState == 'hungry') {
                const state = this.store.getState();
                const creature = this.resources.creature[state.creature.evolution];
                creature[this.creatureState].draw(context, this.creaturePos.x, this.creaturePos.y, false, 25, 25);
            } else {
                context.save();
                context.translate(this.creaturePos.x, this.creaturePos.y);
                // context.translate(this.creaturePos.x * 2, this.creaturePos.y * 2);
                context.scale(.5, .5);
                this.creature.draw(context);
                context.restore();
            }

            this.foods.forEach(a => this.resources.food.idle.draw(context, a.x, a.y, false, 20, 20));
        }
    }
}
