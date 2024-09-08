import { Timer, TIMER_EVENT_NAME } from "./components/timer";
import { Vec2 } from "./components/vec2";
import { DAY_DURATION, DIRTY_TIME_MAX, HUNGRY_TIME_MAX, PLAYFUL_TIME_MAX, TIRED_TIME_MAX } from "./config";
import { Evolution, levels } from "./creature/levels";
import { Resources, resourcesService } from "./resources";

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

const SET_BUTTONS = "SET_BUTTONS";
export const setButtons = (types: string[]) => ({
    type: SET_BUTTONS,
    payload: types
});

const TOGGLE_INPUT = "TOGGLE_INPUT";
export const toggleInput = (enabled = true) => ({
    type: TOGGLE_INPUT,
    payload: enabled
});

const SET_BUTTONS_UP = "SET_BUTTONS_UP";
export const setButtonsUp = {
    type: SET_BUTTONS_UP,
    payload: undefined,
};

const CREATURE_MOVE = "CREATURE_MOVE";
export const moveCreature = (diff: number) => ({
    type: CREATURE_MOVE,
    payload: diff
});

export enum End {
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
        pos: Vec2,
        stats: {
            eaten: number,
            played: number,
            slept: number,
            sick: number,
        }
    };

    end: End,

    buttons: Button[],
    inputEnabled: boolean,
};

export class Store {
    static store: Store;
    static getInstance() {
        if (Store.store) {
            return Store.store;
        }

        Store.store = new Store(resourcesService.getInstance());
        return Store.store;
    }
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
                pos: Vec2.ZERO.clone(),
                stats: {
                    eaten: 0,
                    played: 0,
                    slept: 0,
                    sick: 0,
                }
            },

            end: End.NOT_YET,

            buttons: [],
            inputEnabled: true,
        };

        this.state.creature.tired.start();
        this.state.day.timer.start();
        this.state.day.timer.on(TIMER_EVENT_NAME, () => {
            console.log("Triggered: state.day.timePassed");
            this.dispatch(incrementDayCount);
        });
    }

    dispatch(action: Action) {
        switch (action.type) {
            case CREATURE_MOVE: {
                this.state.creature.pos.x = action.payload;
                break;
            }
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
            case SET_BUTTONS: {
                this.state.buttons = action.payload.map(type => ({ type, down: false }));
                break;
            }
            case SET_BUTTONS_UP: {
                this.state.buttons.forEach(a => a.down = false);
                break;
            }
            case TOGGLE_INPUT: {
                this.state.inputEnabled = action.payload;
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
            const nextIndex = index + 1;

            this.state.creature.hungry.start();
            this.state.creature.playful.start();
            this.state.creature.dirty.start();

            if (nextIndex < levels.path.length) {
                this.state.creature.evolution = levels.path[nextIndex];
            }
        }
    }

    getState(): State {
        return this.state;
    }
}
