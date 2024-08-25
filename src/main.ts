import { init as inputInit } from './components/input';
import { Vec2 } from "./components/vec2";
import { create as createResources } from "./resources";
import { Timer } from './components/timer';
import { ProgressBar } from './components/display/progress-bar';
import { HEIGHT, WIDTH } from './config';
import { create as createState } from './state';

(function() {
    window.addEventListener("load", () => {
        const canvas = document.getElementById("app") as HTMLCanvasElement;
        const context = canvas.getContext("2d") as CanvasRenderingContext2D;
        context.imageSmoothingEnabled = false;
        const resources = createResources();
        const state = createState(resources);
        const { creature } = state;

        const foodCanvas = document.getElementById("food") as HTMLCanvasElement;
        const foodContext = foodCanvas.getContext("2d") as CanvasRenderingContext2D;
        foodContext.imageSmoothingEnabled = false;

        const input = inputInit();

        const resize = () => {
            const { floor } = Math;
            const { innerWidth: width, innerHeight: height } = window;
            canvas.width = WIDTH;
            canvas.height = HEIGHT;
            foodCanvas.width = 100;
            foodCanvas.height = 50;

            creature.pos.x = floor(WIDTH / 2 - 25);
            creature.pos.y = floor(HEIGHT / 2 - 25);
        };

        window.addEventListener('resize', resize);
        resize();

        const progressBar = new ProgressBar(Vec2.new(0, 0), Vec2.new(WIDTH, 10));



        const step = (dt: number) => {
            Timer.stepAll(dt);
            progressBar.setValue(state.day.timer.value / state.day.timer.targetValue);

            // creature.pos.x += creature.speed.x;
            // if (creature.pos.x >= 100) {
            //     creature.pos.x = 100;
            //     creature.speed.x = -1;
            // }
            // if (creature.pos.x <= 0) {
            //     creature.pos.x = 0;
            //     creature.speed.x = 1;
            // }
        };

        const draw = (dt: number) => {
            const sprite = creature.display[creature.state];

            sprite.step(dt);
            sprite.step(dt);

            context.clearRect(0, 0, window.innerWidth, window.innerHeight);
            sprite.draw(context, creature.pos.x, creature.pos.y);
            progressBar.draw(context);

            foodContext.clearRect(0, 0, foodCanvas.width, foodCanvas.height);
            resources.food.idle.draw(foodContext, 0, 0, !input.foodButton);
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
