export class EventEmitter extends EventTarget {
    on: (type: string, callback: EventListenerOrEventListenerObject | null, options?: AddEventListenerOptions | boolean) => void;
    off: (type: string, callback: EventListenerOrEventListenerObject | null, options?: EventListenerOptions | boolean) => void;
    trigger: (event: Event) => boolean;

    constructor() {
        super();
        this.on = this.addEventListener;
        this.off = this.removeEventListener;
        this.trigger = this.dispatchEvent;
    }
}
