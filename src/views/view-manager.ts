import { Display } from "../ui/display";
import { Button, Gizmo } from "../ui/gismo";
import { Resources, statToAsset } from "../resources";
import { Store } from "../store";
import { GIZMO_MARGIN, GIZMO_SCREEN_HEIGHT, GIZMO_SCREEN_WIDTH, HEIGHT, WIDTH } from '../config';
import { Vec2 } from "../components/vec2";
import { InputManager } from "../components/input";
import { ProgressBar } from "../ui/progress-bar";
import { levels } from "../creature/levels";
import { CreatureStateManager } from "../creature/states";

const VIEW_CHANGE_DELAY = 1000;

export interface Step {
    step(dt: number);
}

export type NextView = string;
export interface InputHandler {
    handleInput(buttons: Button[]): NextView | undefined;
}

export class View implements Display, Step, InputHandler {
    step(dt: number) {
        throw new Error("Method not implemented.");
    }

    handleInput(buttons: Button[]): NextView | undefined {
        throw new Error("Method not implemented.");
    }

    draw(context: CanvasRenderingContext2D) {
        throw new Error("Method not implemented.");
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
    progressBar = new ProgressBar(Vec2.new(GIZMO_MARGIN, GIZMO_MARGIN / 2), Vec2.new(20, 20));
    creatureStateManager: CreatureStateManager;
    nextViewName = '';
    timerViewChange = -1;

    constructor(resources: Resources, store: Store, input: InputManager) {
        this.resources = resources;
        this.store = store;
        this.gizmo = new Gizmo(resources, Vec2.new(WIDTH, HEIGHT), input);
        this.gizmo.activate();
        this.creatureStateManager = new CreatureStateManager(store, resources);
    }

    addView(name: string, view: View) {
        this.views[name] = view;
    }

    step(dt: number) {
        if (this.activeViewName == '') {
            return;
        }

        const state = this.store.getState();
        this.progressBar.setValue(state.day.timer.percentage);

        const { evolution } = state.creature;
        const required = levels.requirements[evolution];

        this.gizmo.setButtonTypes(Object
            .entries(required)
            .map(([key]) => statToAsset(key))
            .filter(a => !!a))
        this.gizmo.step(dt);

        const activeView = this.views[this.activeViewName];
        const nextViewName = activeView.handleInput(this.gizmo.buttons);

        if (nextViewName) {
            this.nextViewName = nextViewName;
            this.gizmo.disable();
            activeView.exit();
        }

        if (activeView.isDone()) {
            this.gizmo.disable();

            if (this.nextViewName !== '') {
                const nextView = this.views[this.nextViewName];
                nextView.enter();
                nextView.step(dt);
                this.activeViewName = this.nextViewName;
                this.nextViewName = '';

                if (this.timerViewChange != -1) {
                    clearTimeout(this.timerViewChange);
                }

                this.timerViewChange = setTimeout(() => {
                    this.gizmo.activate();
                    this.timerViewChange;
                }, VIEW_CHANGE_DELAY);

                return;
            } else {
                this.views.main.enter();
                this.activeViewName = 'main';
            }
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
        context.restore();

        // Day progress
        const day = this.resources.days[this.store.getState().day.count];
        day.idle.draw(context, GIZMO_MARGIN, GIZMO_MARGIN / 2, false, 20, 20);
        context.save()
        context.globalCompositeOperation = 'difference';
        this.progressBar.draw(context);
        context.restore();

        this.gizmo.draw(context);

    }

    setActiveView(viewName: string) {
        this.activeViewName = viewName;
    }
}
