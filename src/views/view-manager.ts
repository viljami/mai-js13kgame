import { Display } from "../ui/display";
import { Gizmo } from "../ui/gismo";
import { Resources, resourcesService, statToAsset } from "../resources";
import { Button, End, setButtons, Store } from "../store";
import { GIZMO_MARGIN, GIZMO_SCREEN_HEIGHT, GIZMO_SCREEN_WIDTH, HEIGHT, WIDTH } from '../config';
import { Vec2 } from "../components/vec2";
import { InputManager } from "../components/input";
import { ProgressBar } from "../ui/progress-bar";
import { levels } from "../creature/levels";
import { CreatureStateManager } from "../creature/states";

const VIEW_CHANGE_DELAY = 1000;
const rand = (n: number) => Math.floor(Math.random() * n);

export interface Step {
    step(dt: number);
}

export type NextView = string;
export interface InputHandler {
    handleInput(buttons: Button[]): NextView | undefined;
}

export abstract class View implements Display, Step, InputHandler {
    step(dt: number) {
        throw new Error("Method not implemented.");
    }

    abstract handleInput(buttons: Button[]): NextView | undefined;

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
        this.progressBar.setValue(state.day.timer.percentage);

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
            context.fillRect(rand(GIZMO_SCREEN_WIDTH), rand(GIZMO_SCREEN_HEIGHT), 1, 1);
        }

        context.restore();

        // Day progress
        const day = this.resources.days[this.store.getState().day.count - 1];
        day.idle.draw(context, GIZMO_MARGIN, GIZMO_MARGIN / 2, false, 20, 20);
        context.save()
        context.globalCompositeOperation = 'difference';
        this.progressBar.draw(context);
        context.restore();

        this.gizmo.draw(context);
    }

    setActiveView(viewName: string) {
        this.activeViewName = viewName;
        this.views[this.activeViewName].enter();
        this.gizmo.activate();
    }
}
