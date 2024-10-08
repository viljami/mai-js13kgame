import { Display } from "../ui/display";
import { Gizmo } from "../ui/gismo";
import { Resources, resourcesService } from "../resources";
import { Button, End, setButtons, Store } from "../store";
import { DEBUG_MODE, GIZMO_MARGIN, GIZMO_SCREEN_HEIGHT, GIZMO_SCREEN_WIDTH, HEIGHT, WIDTH } from '../config';
import { Vec2 } from "../components/vec2";
import { InputManager } from "../components/input";
import { Evolution } from "../creature/levels";
import { CreatureStateManager } from "../creature/states";

const rand = (n: number) => (Math.random() * n)|0;

export interface Step {
    step(dt: number);
}

export type NextView = string;
export interface InputHandler {
    handleInput(buttons: Button[]): NextView | undefined;
}

export abstract class View implements Display, Step, InputHandler {
    step(dt: number) {
        if (DEBUG_MODE) throw new Error("Method not implemented.");
    }

    abstract handleInput(buttons: Button[]): NextView | undefined;

    draw(context: CanvasRenderingContext2D) {
        if (DEBUG_MODE) throw new Error("Method not implemented.");
    }

    enter() { }

    exit() { }

    isDone() {
        return true;
    }
}

export class ViewManager implements Display, Step {
    views: { [key: string]: View } = {};
    activeViewName = '';
    resources: Resources;
    store: Store;
    gizmo: Gizmo;
    creatureStateManager: CreatureStateManager;
    nextViewName = '';

    constructor(input: InputManager) {
        this.resources = resourcesService.getInstance();
        this.store = Store.getInstance();
        this.gizmo = new Gizmo(Vec2.new(WIDTH, HEIGHT), input);
        this.gizmo.activate();
        this.creatureStateManager = new CreatureStateManager();
    }

    addView(name: string, view: View) {
        this.views[name] = view;
    }

    step(dt: number) {
        if (this.activeViewName == '') {
            return;
        }

        const state = this.store.getState();

        if (state.creature.evolution === Evolution.GROWN) {
            if (this.activeViewName != 'end') {
                this.nextViewName = 'end';
                this.views[this.activeViewName].exit();
                // this.setActiveView('main');
                this.gizmo.disable();
                this.store.dispatch(setButtons([]));
            }

            if (this.views[this.activeViewName].isDone()) {
                this.activeViewName = 'end';
                this.views[this.activeViewName].enter();
            }

            this.views[this.activeViewName].step(dt);
            return;
        }

        this.gizmo.step(dt);

        const activeView = this.views[this.activeViewName];
        const nextViewName = activeView.handleInput(this.store.getState().buttons);

        if (this.nextViewName !== 'end' && nextViewName) {
            this.nextViewName = nextViewName;
            this.gizmo.disable();
            activeView.exit();
        }

        if (activeView.isDone()) {
            this.gizmo.disable();

            const newView = this.nextViewName || 'main';
            this.nextViewName = '';
            this.setActiveView(newView);
            return;
        }

        if (state.end !== End.NOT_YET && (this.activeViewName !== 'end' || this.nextViewName !== 'end')) {
            this.nextViewName = 'end';
            activeView.exit();
            // this.setActiveView('end');
            this.gizmo.disable();
            this.store.dispatch(setButtons([]));
        }

        activeView.step(dt);
    }

    draw(context: CanvasRenderingContext2D) {
        if (this.activeViewName == '') {
            return;
        }

        context.clearRect(0, 0, WIDTH, HEIGHT);

        context.save();
        context.translate(this.gizmo.size.x / 2 - GIZMO_SCREEN_WIDTH / 2, this.gizmo.size.y / 2 - GIZMO_SCREEN_HEIGHT / 2);
        this.views[this.activeViewName].draw(context);

        context.fillStyle = '#000';

        for (let i = this.store.getState().creature.stats.dirty; i--; i >= 0) {
            context.fillRect(rand(GIZMO_SCREEN_WIDTH)|0, rand(GIZMO_SCREEN_HEIGHT)|0, 1, 1);
        }

        context.restore();

        // Day progress
        const day = this.resources.days[this.store.getState().day.count - 1];
        day.draw(context, GIZMO_MARGIN, GIZMO_MARGIN / 2, false, 20, 20);

        this.gizmo.draw(context);
    }

    setActiveView(viewName: string) {
        this.activeViewName = viewName;
        this.views[this.activeViewName].enter();
        this.gizmo.activate();
    }
}
