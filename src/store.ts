import { Timer, TIMER_EVENT_NAME } from "./components/timer";
import { DAY_DURATION, DIRTY_TIME_MAX, HUNGRY_TIME_MAX, PLAYFUL_TIME_MAX, TIRED_TIME_MAX } from "./config";
import { Resources } from "./resources";

const COUNT_SECONDS = 1000.;

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
                hungry: Timer.new(COUNT_SECONDS, HUNGRY_TIME_MAX),
                tired: Timer.new(COUNT_SECONDS, TIRED_TIME_MAX),
                playful: Timer.new(COUNT_SECONDS, PLAYFUL_TIME_MAX),
                dirty: Timer.new(COUNT_SECONDS, DIRTY_TIME_MAX),
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
