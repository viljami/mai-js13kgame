import { Display } from "./ui/display";
import { Button, Gizmo } from "./ui/gismo";
import { Resources, statToAsset } from "./resources";
import { Store } from "./store";
import { GIZMO_MARGIN, GIZMO_SCREEN_HEIGHT, GIZMO_SCREEN_WIDTH, HEIGHT, SPRITE_SPEED, WIDTH } from './config';
import { Vec2 } from "./components/vec2";
import { Input, InputManager } from "./components/input";
import { ProgressBar } from "./ui/progress-bar";
import { levels } from "./creature/levels";
import { CreatureStateManager } from "./creature/states";

const { floor } = Math;

export interface Step {
    step(dt: number);
}

export interface InputHandler {
    handleInput(buttons: Button[]);
}

export class ViewManager implements Display, Step {
    views: { [key: string]: Display & Step & InputHandler } = {};
    activeViewName = '';
    resources: Resources;
    store: Store;
    gizmo: Gizmo;
    progressBar = new ProgressBar(Vec2.new(GIZMO_MARGIN, GIZMO_MARGIN / 2), Vec2.new(20, 20));
    creatureStateManager: CreatureStateManager;

    constructor(resources: Resources, store: Store, input: InputManager) {
        this.resources = resources;
        this.store = store;
        this.gizmo = new Gizmo(resources, Vec2.new(WIDTH, HEIGHT), input);
        this.gizmo.activate();
        this.creatureStateManager = new CreatureStateManager(store, resources);
    }

    addView(name: string, view: Display & Step & InputHandler) {
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
        activeView.handleInput(this.gizmo.buttons);
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

export class TamaView implements Display, Step, InputHandler {
    tamaPos = Vec2.new(floor(GIZMO_SCREEN_WIDTH / 2 - 25), floor(GIZMO_SCREEN_HEIGHT - 50));
    // progressBar = new ProgressBar(Vec2.new(0, 0), Vec2.new(GIZMO_SCREEN_WIDTH, 10));
    resources: Resources;
    store: Store;
    creatureState = 'idle';
    creatureStateManager: CreatureStateManager;

    constructor(resources: Resources, store: Store, creatureStateManager: CreatureStateManager) {
        this.resources = resources;
        this.store = store;
        this.creatureStateManager = creatureStateManager;
    }

    handleInput(buttons: Button[]) {
        this.creatureStateManager.handleInput(buttons);
    }

    step(dt: number) {
        this.creatureStateManager.step(dt);
    }

    draw(context: CanvasRenderingContext2D) {
        const size = this.creatureStateManager.getSize();
        context.save();
        context.translate(GIZMO_SCREEN_WIDTH / 2 - size.x / 2, GIZMO_SCREEN_HEIGHT - size.y);
        this.creatureStateManager.draw(context)
        context.restore();
    }
}
