import { CreatureStates } from "../resources";

export class CreatureState {
    creature: CreatureStates;

    constructor(creature: CreatureStates) {
        this.creature = creature;
    }

    setCreature(creature: CreatureStates) {
        this.creature = creature;
    }
    enter() { }
    exit() { }
    handleInput(): CreatureState | null { return null; }
    step(dt: number) { }
    draw(context: CanvasRenderingContext2D) {
        // this.creature[this.creatureState].draw(context, 0, 0);
    }
    isDone(): boolean { return true; }
}
