import { Timer, TIMER_EVENT_NAME } from "./components/timer";
import { Vec2 } from "./components/vec2";

const { floor } = Math;
const COUNT_SECONDS = 1000.;
const DAY_DURATION = 60 / 2;

export const create = (resources) => {
    const state = {
        day: {
            count: 1,
            timer: Timer.new(COUNT_SECONDS, DAY_DURATION),
        },

        creature: {
            hungry: Timer.new(COUNT_SECONDS, DAY_DURATION / 5),
            tired: Timer.new(COUNT_SECONDS, DAY_DURATION / 2),
            playful: Timer.new(COUNT_SECONDS, DAY_DURATION / 3),
            dirty: Timer.new(COUNT_SECONDS, DAY_DURATION / 4),
            display: resources.creature,
            state: "idle",
            pos: Vec2.new(0, 0),
            speed: Vec2.new(1, 0),
        }
    };

    state.day.timer.on(TIMER_EVENT_NAME, () => {
        console.log("Triggered: state.day.timePassed");
        state.day.count++;
    });

    return state;
}
