import { Frame } from "./components/frame";
import { Sprite } from "./components/sprite";
import { Vec2 } from "./components/vec2";

export interface DisplayAsset {
    size: Vec2,
    idle: Sprite
}

export interface Resources {
    food: DisplayAsset,
    creature: DisplayAsset,
    days: DisplayAsset[],
}

export const create = (): Resources => {
    const creatureSize = Vec2.new(50, 50);
    const idleFrames = [new Frame(0, 0, creatureSize.x, creatureSize.y), new Frame(creatureSize.x * 2, 0, creatureSize.x, creatureSize.y)];
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

    //     drawCreature(idleFrames[0].pos.x, idleFrames[0].pos.y, creatureSize.x, creatureSize.y);
    //     drawCreature(idleFrames[1].pos.x + 5 + 1, idleFrames[1].pos.y + 10 + 1, creatureSize.x - 10, creatureSize.y - 10);

    //     return canvas;
    // })();

    const spritesheet = document.getElementById("sheet") as HTMLImageElement;

    return {
        food: {
            size: creatureSize.clone(),
            idle: new Sprite([new Frame(0, creatureSize.y * 2, creatureSize.x, creatureSize.y)], spritesheet),
        },
        creature: {
            size: creatureSize,
            idle: new Sprite(idleFrames, spritesheet),
        },
        days: [
            { size: creatureSize.clone(), idle: new Sprite([new Frame(0, creatureSize.y * 3, creatureSize.x, creatureSize.y)], spritesheet) },
            { size: creatureSize.clone(), idle: new Sprite([new Frame(creatureSize.x, creatureSize.y * 3, creatureSize.x, creatureSize.y)], spritesheet) },
            { size: creatureSize.clone(), idle: new Sprite([new Frame(creatureSize.x * 2, creatureSize.y * 3, creatureSize.x, creatureSize.y)], spritesheet) },
            { size: creatureSize.clone(), idle: new Sprite([new Frame(0, creatureSize.y * 4, creatureSize.x, creatureSize.y)], spritesheet) },
            { size: creatureSize.clone(), idle: new Sprite([new Frame(creatureSize.x, creatureSize.y * 4, creatureSize.x, creatureSize.y)], spritesheet) },
            { size: creatureSize.clone(), idle: new Sprite([new Frame(creatureSize.x * 2, creatureSize.y * 4, creatureSize.x, creatureSize.y)], spritesheet) },
            { size: creatureSize.clone(), idle: new Sprite([new Frame(0, creatureSize.y * 5, creatureSize.x, creatureSize.y)], spritesheet) },
            { size: creatureSize.clone(), idle: new Sprite([new Frame(creatureSize.x, creatureSize.y * 5, creatureSize.x, creatureSize.y)], spritesheet) },
            { size: creatureSize.clone(), idle: new Sprite([new Frame(creatureSize.x * 2, creatureSize.y * 5, creatureSize.x, creatureSize.y)], spritesheet) },
            { size: creatureSize.clone(), idle: new Sprite([new Frame(0, creatureSize.y * 6, creatureSize.x, creatureSize.y)], spritesheet) },
            { size: creatureSize.clone(), idle: new Sprite([new Frame(creatureSize.x, creatureSize.y * 6, creatureSize.x, creatureSize.y)], spritesheet) },
            { size: creatureSize.clone(), idle: new Sprite([new Frame(creatureSize.x * 2, creatureSize.y * 6, creatureSize.x, creatureSize.y)], spritesheet) },
            { size: creatureSize.clone(), idle: new Sprite([new Frame(0, creatureSize.y * 7, creatureSize.x, creatureSize.y)], spritesheet) },
        ]
    };
};
