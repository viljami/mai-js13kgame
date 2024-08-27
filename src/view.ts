import { Display } from "./components/display/display";
import { Gizmo } from "./components/display/gismo";
import { Resources } from "./resources";
import { Store } from "./store";
import { GIZMO_MARGIN, GIZMO_SCREEN_HEIGHT, GIZMO_SCREEN_WIDTH, HEIGHT, WIDTH } from './config';
import { Vec2 } from "./components/vec2";
import { InputManager } from "./components/input";
import { ProgressBar } from "./components/display/progress-bar";

const { floor } = Math;

export interface Step {
    step(dt: number);
}

export class ViewManager implements Display, Step {
    views: { [key: string]: Display & Step } = {};
    activeViewName = '';
    resources: Resources;
    store: Store;
    gizmo: Gizmo;
    progressBar = new ProgressBar(Vec2.new(GIZMO_MARGIN, GIZMO_MARGIN / 2), Vec2.new(20, 20));

    constructor(resources: Resources, store: Store, input: InputManager) {
        this.resources = resources;
        this.store = store;
        this.gizmo = new Gizmo(resources, Vec2.new(WIDTH, HEIGHT), input);
        this.gizmo.activate();
    }

    addView(name: string, view: Display & Step) {
        this.views[name] = view;
    }

    step(dt: number) {
        if (this.activeViewName == '') {
            return;
        }

        const state = this.store.getState();
        this.progressBar.setValue(state.day.timer.percentage);
        this.gizmo.step(dt);
        this.views[this.activeViewName].step(dt);
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

        const day = this.resources.days[this.store.getState().day.count];
        day.idle.draw(context, GIZMO_MARGIN, GIZMO_MARGIN / 2, false, 20, 20);
        context.save()
        // context.fillStyle = 'white';
        context.globalCompositeOperation = 'difference';
        // context.fillRect(x, y, dw, dh);
        this.progressBar.draw(context);
        context.restore();

        this.gizmo.draw(context);

    }

    setActiveView(viewName: string) {
        this.activeViewName = viewName;
    }
}

export class TamaView implements Display, Step {
    tamaPos = Vec2.new(floor(GIZMO_SCREEN_WIDTH / 2 - 25), floor(GIZMO_SCREEN_HEIGHT - 50));
    // progressBar = new ProgressBar(Vec2.new(0, 0), Vec2.new(GIZMO_SCREEN_WIDTH, 10));
    resources: Resources;
    store: Store;
    creatureState = 'idle';

    constructor(resources: Resources, store: Store) {
        this.resources = resources;
        this.store = store;
    }

    step(dt: number) {
        // const state = this.store.getState();
        // this.progressBar.setValue(state.day.timer.percentage);
        this.resources.creature[this.creatureState].step(dt);
    }

    draw(context: CanvasRenderingContext2D) {
        const sprite = this.resources.creature[this.creatureState];
        sprite.draw(context, this.tamaPos.x, this.tamaPos.y);
        // this.progressBar.draw(context);
    }
}
