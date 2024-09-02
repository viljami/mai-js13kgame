export enum Evolution {
    EGG = 'egg',
    SMALL = 'small',
    BIG = 'big',
    DEAD = 'dead',
    GROWN = 'grown',
}

export const levels = {
    path: [Evolution.EGG, Evolution.SMALL, Evolution.BIG, Evolution.GROWN],
    requirements: {
        [Evolution.EGG]: { // Start state -> does not require anything
            slept: 1,
            timers: ['tired']
        },
        [Evolution.SMALL]: {
            slept: 5,
            eaten: 5,
            played: 5,
            timers: ['hungry', 'tired', 'playful']
        },
        [Evolution.BIG]: {
            slept: 10,
            eaten: 10,
            played: 10,
            timers: ['hungry', 'tired', 'dirty', 'playful']
        },
        [Evolution.GROWN]: {
            eaten: 1000,
            slept: 1000,
            played: 1000,
        },
    },
};
