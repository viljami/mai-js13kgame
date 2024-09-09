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
    idleTired: Sprite,
    idleAngry: Sprite,
    idleSick: Sprite,
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
            return 'zzz';
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
        case 'zzz':
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
    bubble: DisplayAsset,
    left: DisplayAsset,
    right: DisplayAsset,
    down: DisplayAsset,
}

const create = (): Resources => {
    const size1010 = Vec2.new(20, 20);
    const size5050 = Vec2.new(50, 50);
    const size100100 = Vec2.new(100, 100);
    const size150100 = Vec2.new(100, 150);
    const spritesheet = document.getElementById("sheet") as HTMLImageElement;
    const canvas = document.createElement('canvas');
    canvas.width = spritesheet.width;
    canvas.height = spritesheet.height;
    const context = canvas.getContext('2d');
    context.drawImage(spritesheet, 0, 0);
    const imageData = context.getImageData(0, 0, spritesheet.width, spritesheet.height);
    const { data } = imageData;
    for (let i = 0; i < data.length; i += 4) {
        if (data[i] === 255) {
            data[i + 3] = 0;
        }
    }
    context.putImageData(imageData, 0, 0);
    const spritesheetTransparent = document.createElement('img');
    spritesheetTransparent.src = canvas.toDataURL();
    const eggIdle = new Sprite([new Frame(size5050.x, size5050.y * 2, size5050.x, size5050.y)], spritesheet);

    const arrowCanvas = document.createElement('canvas');
    const arrowContext = arrowCanvas.getContext('2d');
    arrowContext.fillStyle = '#000';
    // left
    arrowContext.moveTo(25, 5);
    arrowContext.lineTo(25, 45);
    arrowContext.lineTo(5, 25);
    arrowContext.fill();
    //right
    arrowContext.moveTo(75, 5);
    arrowContext.lineTo(75, 45);
    arrowContext.lineTo(95, 25);
    arrowContext.fill();
    //down
    arrowContext.moveTo(105, 25);
    arrowContext.lineTo(145, 25);
    arrowContext.lineTo(125, 45);
    arrowContext.fill();

    return {
        food: {
            idle: new Sprite([new Frame(0, size5050.y * 2, size5050.x, size5050.y)], spritesheetTransparent),
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
                idleTired: new Sprite([new Frame(0, 0, size5050.x, size5050.y), new Frame(size5050.x * 3, 0, size5050.x, size5050.y)], spritesheet),
                idleAngry: new Sprite([new Frame(0, 0, size5050.x, size5050.y), new Frame(size5050.x * 4, 0, size5050.x, size5050.y)], spritesheet),
                idleSick: new Sprite([new Frame(0, 0, size5050.x, size5050.y), new Frame(size5050.x * 5, 0, size5050.x, size5050.y)], spritesheet),
            },
            [Evolution.BIG]: {
                idle: new Sprite([new Frame(0, size5050.y, size5050.x, size5050.y)], spritesheet),
                hungry: new Sprite([new Frame(size5050.x * 2, size5050.x, size5050.x, size5050.y)], spritesheet),
                tired: new Sprite([new Frame(size5050.x * 3, size5050.x, size5050.x, size5050.y)], spritesheet),
                angry: new Sprite([new Frame(size5050.x * 4, size5050.x, size5050.x, size5050.y)], spritesheet),
                sick: new Sprite([new Frame(size5050.x * 5, size5050.x, size5050.x, size5050.y)], spritesheet),
                dead: new Sprite([new Frame(size5050.x * 7, size5050.x, size5050.x, size5050.y)], spritesheet),
                idleHungry: new Sprite([new Frame(0, size5050.x, size5050.x, size5050.y), new Frame(size5050.x * 2, size5050.x, size5050.x, size5050.y)], spritesheet),
                idleTired: new Sprite([new Frame(0, size5050.x, size5050.x, size5050.y), new Frame(size5050.x * 3, size5050.x, size5050.x, size5050.y)], spritesheet),
                idleAngry: new Sprite([new Frame(0, size5050.x, size5050.x, size5050.y), new Frame(size5050.x * 4, size5050.x, size5050.x, size5050.y)], spritesheet),
                idleSick: new Sprite([new Frame(0, size5050.x, size5050.x, size5050.y), new Frame(size5050.x * 5, size5050.x, size5050.x, size5050.y)], spritesheet),
            },
            [Evolution.GROWN]: {
                idle: new Sprite([new Frame(50 * 6, 150, size100100.x, size100100.y)], spritesheet),
            },
            [Evolution.EGG]: {
                idle: eggIdle,
                hungry: eggIdle,
                tired: eggIdle,
                angry: eggIdle,
                sick: eggIdle,
                dead: eggIdle,
                idleHungry: eggIdle,
                idleTired: eggIdle,
                idleAngry: eggIdle,
                idleSick: eggIdle,
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
            idle: new Sprite([new Frame(size5050.x * 6, size5050.y * 2, size5050.x, size5050.y)], spritesheetTransparent),
        },
        zzz: {
            idle: new Sprite([new Frame(size5050.x * 5, size5050.y * 3, size1010.x, size1010.y)], spritesheet),
        },
        bubble: {
            idle: new Sprite([new Frame(size5050.x * 5, size5050.y * 3 + 20, size1010.x, size1010.y)], spritesheet),
        },
        left: {
            idle: new Sprite([new Frame(0, 0, size5050.x, size5050.y)], arrowCanvas),
        },
        right: {
            idle: new Sprite([new Frame(size5050.x, 0, size5050.x, size5050.y)], arrowCanvas),
        },
        down: {
            idle: new Sprite([new Frame(size5050.x * 2, 0, size5050.x, size5050.y)], arrowCanvas),

        }
    };
};

let resources: Resources;
export const resourcesService = {
    getInstance: () => {
        if (resources) {
            return resources;
        }

        resources = create();
        return resources;
    }
}
