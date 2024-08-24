export class Vec2 {
    public x = -1;
    public y = -1;

    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    clone() {
        return Vec2.new(this.x, this.y);
    }

    static new(x, y): Vec2 { return new Vec2(x, y) }
    static ZERO = new Vec2(0, 0);
}
