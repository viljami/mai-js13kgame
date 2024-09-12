import { Vec2 } from "./vec2";

export class Frame {
    public pos: Vec2;
    public size: Vec2;

    constructor(x, y, w, h) {
        this.pos = new Vec2(x, y);
        this.size = new Vec2(w, h);
    }
}
