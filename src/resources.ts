import { Frame } from "./components/frame";
import { Sprite } from "./components/sprite";
import { Vec2 } from "./components/vec2";

export interface DisplayAsset {
    idle: Sprite
}

export interface Creature extends DisplayAsset {
    hungry: Sprite,
    idleHungry: Sprite,
}

export interface Resources {
    food: DisplayAsset,
    creature: Creature,
    days: DisplayAsset[],
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

    const size5050 = Vec2.new(50, 50);
    const spritesheet = document.getElementById("sheet") as HTMLImageElement;

    return {
        food: {
            idle: new Sprite([new Frame(0, size5050.y * 2, size5050.x, size5050.y)], spritesheet),
        },
        creature: {
            idle: new Sprite([new Frame(0, 0, size5050.x, size5050.y)], spritesheet),
            hungry: new Sprite([new Frame(size5050.x * 2, 0, size5050.x, size5050.y)], spritesheet),
            idleHungry: new Sprite([new Frame(0, 0, size5050.x, size5050.y), new Frame(size5050.x * 2, 0, size5050.x, size5050.y)], spritesheet),
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
        ]
    };
};
