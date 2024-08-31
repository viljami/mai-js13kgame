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
            slept: 10,
            timers: ['tired']
        },
        [Evolution.SMALL]: {
            eaten: 30,
            slept: 20,
            played: 10,
            timers: ['hungry', 'tired', 'dirty']
        },
        [Evolution.BIG]: {
            eaten: 60,
            slept: 40,
            played: 30,
            timers: ['hungry', 'tired', 'dirty', 'playful']
        },
        [Evolution.GROWN]: {
            eaten: 1000,
            slept: 1000,
            played: 1000,
        },
    },
};
