import { Timer, TIMER_EVENT_NAME } from "./components/timer";
import { Vec2 } from "./components/vec2";
import { DAY_DURATION, DIRTY_TIME_MAX, DEBUG_MODE, HUNGRY_TIME_MAX, PLAYFUL_TIME_MAX, TIRED_TIME_MAX } from "./config";
import { Evolution, levels } from "./creature/levels";
import { Resources, resourcesService } from "./resources";

const COUNT_SECONDS = 1000.;

type Action = {
    type: number,
    payload: any
}

export type Button = {
    type: string,
    down: boolean
};

const INCREMENT_DAY_COUNT = 1;
const incrementDayCount: Action = {
    type: INCREMENT_DAY_COUNT,
    payload: 1
};

const INCREMENT_SLEEP = 2;
export const incrementSleep: Action = {
    type: INCREMENT_SLEEP,
    payload: 1
};

const INCREMENT_EATEN = 3;
export const eat: Action = {
    type: INCREMENT_EATEN,
    payload: 1
};

const INCREMENT_PLAY = 4;
export const play: Action = {
    type: INCREMENT_PLAY,
    payload: 1
};

const NOOP = 5;
export const noop = { type: NOOP, payload: undefined }

const SET_BUTTONS = 6;
export const setButtons = (types: string[]) => ({
    type: SET_BUTTONS,
    payload: types
});

const TOGGLE_INPUT = 7;
export const toggleInput = (enabled = true) => ({
    type: TOGGLE_INPUT,
    payload: enabled
});

const SET_BUTTONS_UP = 8;
export const setButtonsUp = {
    type: SET_BUTTONS_UP,
    payload: undefined,
};

const CREATURE_MOVE = 9;
export const moveCreature = (to: number) => ({
    type: CREATURE_MOVE,
    payload: to
});
const INCREMENT_SICK = 10;
export const incrementSick = (n: number) => ({
    type: INCREMENT_SICK,
    payload: n
});
const INCREMENT_DIRTY = 11;
export const incrementDirty = (n: number) => ({
    type: INCREMENT_DIRTY,
    payload: n
});
const SET_END = 12;
export const setEnd = (end: End) => ({
    type: SET_END,
    payload: end
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
            dirty: number
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
                    dirty: 0,
                }
            },

            end: End.NOT_YET,

            buttons: [],
            inputEnabled: true,
        };

        this.state.creature.tired.start();
        this.state.day.timer.start();
        this.state.day.timer.on(TIMER_EVENT_NAME, () => {
            this.dispatch(incrementDayCount);
        });

        this.state.creature.hungry.on(TIMER_EVENT_NAME, this.onIncSick);
        this.state.creature.playful.on(TIMER_EVENT_NAME, this.onIncSick);
        this.state.creature.tired.on(TIMER_EVENT_NAME, this.onIncSick);
        this.state.creature.dirty.on(TIMER_EVENT_NAME, () => this.dispatch(incrementDirty(1)));
    }

    onIncSick = () => {
        this.dispatch(incrementSick(1));
    };

    isDead() {
        const { dirty, sick } = this.state.creature.stats;

        if (dirty + sick >= 50) {
            this.dispatch(setEnd(End.SIMPLY_DEAD));
        }
    }

    dispatch(action: Action) {
        switch (action.type) {
            case SET_END: {
                this.state.end = action.payload;
                break;
            }
            case CREATURE_MOVE: {
                this.state.creature.pos.x = action.payload;
                break;
            }
            case INCREMENT_DAY_COUNT: {
                this.state.day.count += action.payload;

                if (this.state.day.count >= 13) {
                    this.state.day.count = 13;
                    this.state.day.timer.stop();
                    this.state.end = Math.random() < 0.5 ?
                        End.BY_HOLE :
                        End.BY_UFO;
                }

                break;
            }
            case INCREMENT_SLEEP: {
                const { stats, tired } = this.state.creature;
                stats.slept += action.payload;
                tired.decrement(action.payload);
                if (stats.sick > 0) {
                    stats.sick -= tired.value > 0 ? 1 : 0;
                }
                this.handleRequirements();
                break;
            }
            case INCREMENT_EATEN: {
                const { stats, hungry } = this.state.creature;
                stats.eaten += action.payload;
                hungry.decrement(action.payload);
                if (stats.sick > 0) {
                    stats.sick -= hungry.value > 0 ? 1 : 0;
                }
                this.handleRequirements();
                break;
            }
            case INCREMENT_PLAY: {
                const { stats, playful } = this.state.creature;
                stats.played += action.payload;
                playful.decrement(action.payload);
                if (stats.sick > 0) {
                    stats.sick -= playful.value > 0 ? 1 : 0;
                }
                this.handleRequirements();
                break;
            }
            case INCREMENT_SICK: {
                const { stats } = this.state.creature;
                stats.sick += action.payload;
                this.isDead();
                break;
            }
            case INCREMENT_DIRTY: {
                const { stats } = this.state.creature;
                stats.dirty += action.payload;
                this.isDead();
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
                if (DEBUG_MODE) throw new Error(`No such action handler for ${action.type}`)
        }
    }

    handleRequirements() {
        let unfilled = Object.entries(levels.requirements[this.state.creature.evolution])
            .filter(([key]) => key != 'timers')
            .filter(([key, value]) => this.state.creature.stats[key] <= value);

        if (unfilled.length == 0) {
            const index = levels.path.indexOf(this.state.creature.evolution);
            const nextIndex = index + 1;

            if (nextIndex < levels.path.length) {
                this.state.creature.evolution = levels.path[nextIndex];

                switch (this.state.creature.evolution) {
                    default:
                    case Evolution.GROWN:
                        Timer.stop();
                        // No break;
                    case Evolution.EGG:
                        this.state.creature.tired.start();

                        break;
                    case Evolution.SMALL:
                    case Evolution.BIG:
                        this.state.creature.tired.start();
                        this.state.creature.hungry.start();
                        this.state.creature.playful.start();
                        this.state.creature.dirty.start();
                        break;
                }
            }

            if (this.state.creature.evolution === Evolution.GROWN) {
                this.dispatch(setButtons([]));
            }
        }
    }

    getState(): State {
        return this.state;
    }
}
