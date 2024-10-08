import { EventEmitter } from "./event";

type Millisecond = number;

export const TIMER_EVENT_NAME = "timed";
export class TimerEvent extends Event {
    constructor() {
        super(TIMER_EVENT_NAME);
    }
}

export class Timer extends EventEmitter {
    value = 0;
    stepDuration: Millisecond;
    time = .0;
    targetValue: number;
    percentage: number;
    running: boolean = false;
    triggered: boolean = false;

    constructor(stepDuration: Millisecond, targetValue: number) {
        super();
        this.stepDuration = stepDuration;
        this.targetValue = targetValue;
    }

    step(dt: number) {
        if (!this.running) {
            return;
        }

        this.time += dt;

        if (this.time >= this.stepDuration) {
            this.time = 0;
            this.value++;

            if (this.value >= this.targetValue) {
                this.value = 0;
                this.triggered = true;
                this.trigger(new TimerEvent())
            }

            this.percentage = this.value / this.targetValue;
        }
    }

    decrement(n: number) {
        this.value = this.value < n ? 0 : this.value - n;
    }

    stop() {
        this.running = false;
    }

    start() {
        this.running = true;
    }

    reset() {
        this.value = 0;
        this.time = 0;
    }

    static stop() {
        Timer.all.forEach(timer => timer.stop());
    }

    static stepAll(dt) {
        Timer.all.forEach(timer => timer.step(dt));
    }

    static all: Timer[] = [];
    static new(stepDuration: Millisecond, targetValue: number) {
        const timer = new Timer(stepDuration, targetValue);
        Timer.all.push(timer);
        return timer;
    }

    static remove(timer: Timer) {
        const index = Timer.all.indexOf(timer);
        if (index > -1) {
            Timer.all.splice(index, 1);
        }
    }
}
