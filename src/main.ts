import { InputManager } from './components/input';
import { Timer } from './components/timer';
import { HEIGHT, WIDTH } from './config';
import { ViewManager } from './views/view-manager';
import { MainView } from './views/main';
import { FoodGameView } from './views/food-game';
import { EndView } from './views/end';

(function() {
    window.addEventListener("load", () => {
        const canvas = document.querySelector('canvas') as HTMLCanvasElement;
        canvas.width = WIDTH;
        canvas.height = HEIGHT;

        const resize = () => {
            const { devicePixelRatio, innerWidth, innerHeight } = window;
            const a = innerWidth < innerHeight ? innerWidth : innerHeight;
            let d = a / WIDTH|0;

            if (d <= 0) {
                d = 1;
            }

            canvas.width = WIDTH;
            canvas.height = HEIGHT;
            canvas.style.width = `${d * WIDTH}px`;
            canvas.style.height = `${d * HEIGHT}px`;
        };
        resize();
        window.addEventListener('resize', resize);

        const context = canvas.getContext("2d") as CanvasRenderingContext2D;
        context.imageSmoothingEnabled = false;

        const viewManager = new ViewManager(new InputManager());
        viewManager.addView('main', new MainView(viewManager.creatureStateManager));
        viewManager.addView('foodGame', new FoodGameView(viewManager.creatureStateManager));
        viewManager.addView('end', new EndView(viewManager.creatureStateManager));
        viewManager.setActiveView('main');

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
