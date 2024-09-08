import { Timer, TIMER_EVENT_NAME } from "./components/timer";
import { DAY_DURATION, DIRTY_TIME_MAX, HUNGRY_TIME_MAX, PLAYFUL_TIME_MAX, TIRED_TIME_MAX } from "./config";
import { Evolution, levels } from "./creature/levels";
import { Resources } from "./resources";

const COUNT_SECONDS = 1000.;

type Action = {
    type: string,
    payload: any
}

export type Button = {
    type: string,
    down: boolean
};

const INCREMENT_DAY_COUNT = "INCREMENT_DAY_COUNT";
const incrementDayCount: Action = {
    type: INCREMENT_DAY_COUNT,
    payload: 1
};

const INCREMENT_SLEEP = "INCREMENT_SLEEP";
export const incrementSleep: Action = {
    type: INCREMENT_SLEEP,
    payload: 1
};

const INCREMENT_EATEN = "INCREMENT_EATEN";
export const eat: Action = {
    type: INCREMENT_EATEN,
    payload: 1
};

const INCREMENT_PLAY = "INCREMENT_PLAY";
export const play: Action = {
    type: INCREMENT_PLAY,
    payload: 1
};

const NOOP = "NO-OPERATION";
export const noop = { type: NOOP, payload: undefined }

enum End {
    NOT_YET,
    SIMPLY_DEAD,
    BY_UFO,
    BY_HOLE,
    BY_GIANT,
}

export type State = {
    day: {
        count: number;
        timer: Timer;
    };

    creature: {
        hungry: Timer;
        tired: Timer;
        playful: Timer;
        dirty: Timer;
        display: any;
        state: string;
        evolution: Evolution,
        stats: {
            eaten: number,
            played: number,
            slept: number,
            sick: number,
        }
    };

    end: End
};

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
                evolution: Evolution.EGG,
                stats: {
                    eaten: 0,
                    played: 0,
                    slept: 0,
                    sick: 0,
                }
            },

            end: End.NOT_YET,
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

                if (this.state.day.count >= 13) {
                    this.state.end = Math.random() < 0.5 ?
                        End.BY_HOLE :
                        End.BY_UFO;
                }

                break;
            }
            case INCREMENT_SLEEP: {
                this.state.creature.stats.slept += action.payload;
                this.handleRequirements();
                break;
            }
            case INCREMENT_EATEN: {
                this.state.creature.stats.eaten += action.payload;
                this.handleRequirements();
                break;
            }
            case INCREMENT_PLAY: {
                this.state.creature.stats.played += action.payload;
                this.handleRequirements();
                break;
            }
            case NOOP: {
                break;
            }
            default:
                throw new Error(`No such action handler for ${action.type}`)
        }
    }

    handleRequirements() {
        let unfilled = Object.entries(levels.requirements[this.state.creature.evolution])
            .filter(([key]) => key != 'timers')
            .filter(([key, value]) => this.state.creature.stats[key] <= value);

        if (unfilled.length == 0) {
            const index = levels.path.indexOf(this.state.creature.evolution);

            if (index + 1 < levels.path.length) {
                this.state.creature.evolution = levels.path[index + 1];
            }
        }
    }

    getState(): State {
        return this.state;
    }
}
