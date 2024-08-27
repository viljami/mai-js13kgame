import { InputManager } from './components/input';
import { create as createResources } from "./resources";
import { Timer } from './components/timer';
import { HEIGHT, WIDTH } from './config';
import { TamaView, ViewManager } from './view';
import { Store } from './store';

(function() {
    window.addEventListener("load", () => {
        const canvas = document.getElementById("app") as HTMLCanvasElement;
        canvas.width = WIDTH;
        canvas.height = HEIGHT;

        const resize = () => {
            const { innerWidth, innerHeight } = window;
            const a = innerWidth < innerHeight ? innerWidth : innerHeight;
            canvas.style.width = `${a}px`;
            canvas.style.height = `${a}px`;
        };
        resize();
        window.addEventListener('resize', resize);

        const context = canvas.getContext("2d") as CanvasRenderingContext2D;
        context.imageSmoothingEnabled = false;

        const resources = createResources();
        const input = new InputManager();
        const store = new Store(resources);
        const viewManager = new ViewManager(resources, store, input);
        viewManager.addView('tama', new TamaView(resources, store));
        viewManager.setActiveView('tama');

        const step = (dt: number) => {
            Timer.stepAll(dt);
            viewManager.step(dt);
        };

        const draw = (dt: number) => {
            viewManager.draw(context);
        };

        let prevDt = 0;
        const loop = (dt) => {
            requestAnimationFrame(loop);
            const diffDt = dt - prevDt;
            step(diffDt);
            draw(diffDt);
            prevDt = dt;
        };

        loop(0);
    }, { once: true });
})();
