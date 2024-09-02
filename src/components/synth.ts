export class Synth {
    tones: number[] = new Array(120);
    isMuted: boolean;
    context: null | AudioContext;
    master: GainNode;
    osc: OscillatorNode;
    onMute: Function;
    timeout = -1;

    constructor(isMuted: boolean, onMute: Function) {
        for (let i = 0; i < 120; i++) {
            this.tones[i] = Math.pow(2, (i - 49) / 12) * 440;
        }

        this.isMuted = isMuted;
        this.context = null;
        this.master = null;
        this.osc = null;

        this.stop = this.stop.bind(this);
        this.onMute = onMute;
    }

    init() {
        if (this.context) return;

        // this.context = new (window.AudioContext || window.webkitAudioContext)();
        this.context = new window.AudioContext();

        const master = this.context.createGain();
        master.connect(this.context.destination);
        master.gain.value = 1.0;
        this.master = master;

        const osc = this.context.createOscillator();
        osc.connect(this.master);

        const sinTerms = new Float32Array([0, 0, 1, 0, 1]);
        const cosTerms = new Float32Array(sinTerms.length);
        osc.setPeriodicWave(
            this.context.createPeriodicWave(cosTerms, sinTerms)
        );

        osc.frequency.value = 0;
        osc.start();
        this.osc = osc;
    }

    play(n, d, volume) {
        if (this.isMuted || this.timeout != -1) return;
        // Does not work on FF: exponentialRampToValueAtTime
        // this.osc.frequency.exponentialRampToValueAtTime(this.tones[n], (this.context.currentTime || 1) + 0.1);
        this.master.gain.setValueAtTime(volume, this.context.currentTime + 0.015);
        this.osc.frequency.setValueAtTime(this.tones[n], this.context.currentTime + 0.015);
        this.timeout = setTimeout(this.stop, d);
    }

    stop() {
        this.osc.frequency.setValueAtTime(0.01, this.context.currentTime + 0.05);
        setTimeout(() => this.timeout = null, 50);
    }

    toggle() {
        this.isMuted = !this.isMuted
        this.onMute(this.isMuted);
    }

    static synth: Synth;

    static new(isMuted: boolean, onMute: Function) {
        if (!Synth.synth) {
            Synth.synth = new Synth(isMuted, onMute);
        }

        return Synth.synth;
    }
}
