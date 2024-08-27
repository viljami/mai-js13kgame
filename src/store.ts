import { Timer, TIMER_EVENT_NAME } from "./components/timer";
import { Vec2 } from "./components/vec2";
import { Resources } from "./resources";

const { floor } = Math;
const COUNT_SECONDS = 1000.;
const DAY_DURATION = 60 / 2;

type Action = {
    type: string,
    payload: any
}

const INCREMENT_DAY_COUNT = "INCREMENT_DAY_COUNT";
const incrementDayCount: Action = {
    type: INCREMENT_DAY_COUNT,
    payload: 1
};

export type State = { day: { count: number; timer: Timer; }; creature: { hungry: Timer; tired: Timer; playful: Timer; dirty: Timer; display: any; state: string; }; };

export class Store {
    state: State;

    constructor(resources: Resources) {
        this.state = {
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
            }
        };

        this.state.day.timer.on(TIMER_EVENT_NAME, () => {
            console.log("Triggered: state.day.timePassed");
            this.dispatch(incrementDayCount);
        });
    }

    dispatch(action: Action) {
        switch (action.type) {
            case INCREMENT_DAY_COUNT: {
                this.state.day.count += action.payload;
            }
        }
    }

    getState(): State {
        return this.state;
    }
}
