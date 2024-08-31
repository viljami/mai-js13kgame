import { Frame } from "./components/frame";
import { Sprite } from "./components/sprite";
import { Vec2 } from "./components/vec2";
import { Evolution } from "./creature/levels";

export interface DisplayAsset {
    idle: Sprite
}

export interface CreatureStates extends DisplayAsset {
    hungry: Sprite,
    tired: Sprite,
    angry: Sprite,
    sick: Sprite,
    dead: Sprite,
    idleHungry: Sprite,
}

export interface Creature {
    [Evolution.SMALL]: CreatureStates,
    [Evolution.BIG]: CreatureStates,
    [Evolution.GROWN]: DisplayAsset,
    [Evolution.EGG]: CreatureStates,
}

export const statToAsset = (asset) => {
    switch (asset) {
        case 'slept':
            return 'drops';
        case 'played':
            return 'note';
        case 'eaten':
            return 'food';
        case 'timers':
            return;
        default:
            throw new Error(`No mapping for asset '${asset}'`);
    }
};

export const assetToStat = (stat) => {
    switch (stat) {
        case 'drops':
            return 'slept';
        case 'note':
            return 'played';
        case 'food':
            return 'eaten';
        case 'timers':
            return;
        default:
            throw new Error(`No mapping for stat '${stat}'`);
    }
};

export interface Resources {
    food: DisplayAsset,
    creature: Creature,
    days: DisplayAsset[],
    piano: DisplayAsset,
    medic: DisplayAsset,
    note: DisplayAsset,
    drops: DisplayAsset,
    hole: DisplayAsset,
    ufo: DisplayAsset,
    zzz: DisplayAsset,
}

export const create = (): Resources => {
    // const spritesheet = (() => {
    //     const canvas = document.createElement("canvas");
    //     const context = canvas.getContext("2d") as CanvasRenderingContext2D;
    //     context.fillStyle = '#ffffff';
    //     context.fillRect(0, 0, 100, 100);

    //     const drawCreature = (x, y, w, h) => {
    //         // body
    //         context.fillStyle = '#000000';
    //         context.fillRect(x, y, w, h);
    //         // eyes
    //         context.fillStyle = '#ffffff';
    //         context.fillRect(x + 5, y + 5, 10, 10);
    //         context.fillRect(x + w - 15, y + 5, 10, 10);
    //     };

    //     drawCreature(idleFrames[0].pos.x, idleFrames[0].pos.y, size5050.x, size5050.y);
    //     drawCreature(idleFrames[1].pos.x + 5 + 1, idleFrames[1].pos.y + 10 + 1, size5050.x - 10, size5050.y - 10);

    //     return canvas;
    // })();

    const size1010 = Vec2.new(20, 20);
    const size5050 = Vec2.new(50, 50);
    const size100150 = Vec2.new(100, 150);
    const size150100 = Vec2.new(100, 150);
    const spritesheet = document.getElementById("sheet") as HTMLImageElement;
    const eggIdle = new Sprite([new Frame(size5050.x, size5050.y * 2, size5050.x, size5050.y)], spritesheet);
    return {
        food: {
            idle: new Sprite([new Frame(0, size5050.y * 2, size5050.x, size5050.y)], spritesheet),
        },
        creature: {
            [Evolution.SMALL]: {
                idle: new Sprite([new Frame(0, 0, size5050.x, size5050.y)], spritesheet),
                hungry: new Sprite([new Frame(size5050.x * 2, 0, size5050.x, size5050.y)], spritesheet),
                tired: new Sprite([new Frame(size5050.x * 3, 0, size5050.x, size5050.y)], spritesheet),
                angry: new Sprite([new Frame(size5050.x * 4, 0, size5050.x, size5050.y)], spritesheet),
                sick: new Sprite([new Frame(size5050.x * 5, 0, size5050.x, size5050.y)], spritesheet),
                dead: new Sprite([new Frame(size5050.x * 7, 0, size5050.x, size5050.y)], spritesheet),
                idleHungry: new Sprite([new Frame(0, 0, size5050.x, size5050.y), new Frame(size5050.x * 2, 0, size5050.x, size5050.y)], spritesheet),
            },
            [Evolution.BIG]: {
                idle: new Sprite([new Frame(0, size5050.y, size5050.x, size5050.y)], spritesheet),
                hungry: new Sprite([new Frame(size5050.x * 2, size5050.x, size5050.x, size5050.y)], spritesheet),
                tired: new Sprite([new Frame(size5050.x * 3, size5050.x, size5050.x, size5050.y)], spritesheet),
                angry: new Sprite([new Frame(size5050.x * 4, size5050.x, size5050.x, size5050.y)], spritesheet),
                sick: new Sprite([new Frame(size5050.x * 5, size5050.x, size5050.x, size5050.y)], spritesheet),
                dead: new Sprite([new Frame(size5050.x * 7, size5050.x, size5050.x, size5050.y)], spritesheet),
                idleHungry: new Sprite([new Frame(0, size5050.x, size5050.x, size5050.y), new Frame(size5050.x * 2, size5050.x, size5050.x, size5050.y)], spritesheet),
            },
            [Evolution.GROWN]: {
                idle: new Sprite([new Frame(50 * 6, size100150.y, size100150.x, size100150.y)], spritesheet),
            },
            [Evolution.EGG]: {
                idle: eggIdle,
                hungry: eggIdle,
                tired: eggIdle,
                angry: eggIdle,
                sick: eggIdle,
                dead: eggIdle,
                idleHungry: eggIdle,
            }
        },
        days: [
            { idle: new Sprite([new Frame(0, size5050.y * 3, size5050.x, size5050.y)], spritesheet) },
            { idle: new Sprite([new Frame(size5050.x, size5050.y * 3, size5050.x, size5050.y)], spritesheet) },
            { idle: new Sprite([new Frame(size5050.x * 2, size5050.y * 3, size5050.x, size5050.y)], spritesheet) },
            { idle: new Sprite([new Frame(0, size5050.y * 4, size5050.x, size5050.y)], spritesheet) },
            { idle: new Sprite([new Frame(size5050.x, size5050.y * 4, size5050.x, size5050.y)], spritesheet) },
            { idle: new Sprite([new Frame(size5050.x * 2, size5050.y * 4, size5050.x, size5050.y)], spritesheet) },
            { idle: new Sprite([new Frame(0, size5050.y * 5, size5050.x, size5050.y)], spritesheet) },
            { idle: new Sprite([new Frame(size5050.x, size5050.y * 5, size5050.x, size5050.y)], spritesheet) },
            { idle: new Sprite([new Frame(size5050.x * 2, size5050.y * 5, size5050.x, size5050.y)], spritesheet) },
            { idle: new Sprite([new Frame(0, size5050.y * 6, size5050.x, size5050.y)], spritesheet) },
            { idle: new Sprite([new Frame(size5050.x, size5050.y * 6, size5050.x, size5050.y)], spritesheet) },
            { idle: new Sprite([new Frame(size5050.x * 2, size5050.y * 6, size5050.x, size5050.y)], spritesheet) },
            { idle: new Sprite([new Frame(0, size5050.y * 7, size5050.x, size5050.y)], spritesheet) },
        ],
        piano: {
            idle: new Sprite([new Frame(50 * 4, size150100.y, size150100.x, size150100.y)], spritesheet),
        },
        medic: {
            idle: new Sprite([new Frame(size5050.x * 2, size5050.y * 2, size5050.x, size5050.y)], spritesheet),
        },
        note: {
            idle: new Sprite([new Frame(size5050.x * 3, size5050.y * 2, size5050.x, size5050.y)], spritesheet),
        },
        drops: {
            idle: new Sprite([new Frame(size5050.x * 4, size5050.y * 2, size5050.x, size5050.y)], spritesheet),
        },
        hole: {
            idle: new Sprite([new Frame(size5050.x * 5, size5050.y * 2, size5050.x, size5050.y)], spritesheet),
        },
        ufo: {
            idle: new Sprite([new Frame(size5050.x * 6, size5050.y * 2, size5050.x, size5050.y)], spritesheet),
        },
        zzz: {
            idle: new Sprite([new Frame(size5050.x * 5, size5050.y * 3, size1010.x, size1010.y)], spritesheet),
        }
    };
};
