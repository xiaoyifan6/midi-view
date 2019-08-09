const { Midi } = require('@tonejs/midi')
const Tone = require('tone/Tone')
import { base } from "./base/rect"
import { UI } from "./ui/ui"
import { event } from "./base/event"
import { clone } from "./base/util"

export class MidiView {
    private view: HTMLElement;
    private canvas: HTMLCanvasElement;
    private context: CanvasRenderingContext2D;
    private data: any;
    private ui: UI;
    private container: base.Component;
    private eobj: event.TouchData = { x: 0, y: 0, detailX: 0, detailY: 0, oldX: 0, oldY: 0, x0: 0, y0: 0 };
    private active: boolean = false;
    private keysMap: { [key: string]: boolean } = {};
    private synths: any[] = [];
    private startTime: number = 0;
    private intervalIndex: any;


    public constructor(view: HTMLElement) {
        this.view = view;
        this.canvas = <HTMLCanvasElement>this.view.querySelector("canvas");
        if (!this.canvas) {
            this.canvas = document.createElement("canvas");
            this.view.appendChild(this.canvas);
        }

        var ctx = this.canvas.getContext("2d");
        if (ctx) {
            this.context = ctx;
        } else {
            throw "unsupport canvas 2d"
        }
        this.container = new base.Component();
        this.container.borderWith = 2;
        this.container.borderColor = "#cccccc";
        this.container.parent = new base.Component();

        this.ui = new UI(this.container);
        this.fit()
        this.bind();

        // this.ui.visible = false;
    }

    public refresh() {
        this.container.onDraw(this.context);
    }

    public bind() {
        window.addEventListener("resize", this.fit.bind(this));
        this.canvas.addEventListener("mousedown", this.onDown.bind(this))
        this.canvas.addEventListener("mousemove", this.onMove.bind(this))
        this.canvas.addEventListener("mouseup", this.onUp.bind(this))
        this.canvas.addEventListener("mouseout", this.onUp.bind(this))
        // this.canvas.addEventListener("scroll", this.onScroll.bind(this))
        this.canvas.addEventListener("wheel", this.onScroll.bind(this))
        document.addEventListener("keydown", this.onKeyDown.bind(this));
        document.addEventListener("keyup", this.onKeyUp.bind(this));

        this.canvas.addEventListener("position", this.onPosition.bind(this));
    }

    public onDown(e: MouseEvent) {
        this.eobj.x = e.offsetX;
        this.eobj.y = e.offsetY;
        this.eobj.x0 = e.offsetX;
        this.eobj.y0 = e.offsetY;
        this.eobj.detailX = 0;
        this.eobj.detailY = 0;

        this.active = true;
        event.emitComponent(event.TOUCH_DOWN, clone(this.eobj));
        this.refresh();
    }

    public onMove(e: MouseEvent) {
        this.eobj.oldX = this.eobj.x;
        this.eobj.oldY = this.eobj.y;
        this.eobj.x = e.offsetX;
        this.eobj.y = e.offsetY;
        this.eobj.detailX = this.eobj.x - this.eobj.oldX;
        this.eobj.detailY = this.eobj.y - this.eobj.oldY;

        if (this.active) {
            if (base.Point.distance(this.eobj.x, this.eobj.y, this.eobj.x0, this.eobj.y0) >= 5) {
                event.emitComponent(event.TOUCH_MOVE, clone(this.eobj));
            }
            this.refresh();
        }
    }

    public onUp(e: MouseEvent) {
        this.eobj.oldX = this.eobj.x;
        this.eobj.oldY = this.eobj.y;
        this.eobj.x = e.offsetX;
        this.eobj.y = e.offsetY;
        this.eobj.detailX = this.eobj.x - this.eobj.oldX;
        this.eobj.detailY = this.eobj.y - this.eobj.oldY;

        if (base.Point.distance(this.eobj.x, this.eobj.y, this.eobj.x0, this.eobj.y0) < 5) {
            event.emitComponent(event.TOUCH, clone(this.eobj));
        }
        event.emitComponent(event.TOUCH_UP, clone(this.eobj));
        this.refresh();
        this.active = false;
    }

    public onScroll(e: Event) {
        e = e || window.event;
        var detail = (e["wheelDelta"] || e["detail"] || 0) * 0.1;
        if (this.keysMap["ALT"]) {
            this.eobj.detailX = detail;
            this.eobj.detailY = 0;
            event.emitComponent(event.TOUCH_MOVE, clone(this.eobj));
        } else if (this.keysMap["SHIFT"] && this.keysMap["CONTROL"]) {
            this.eobj.detailX = detail;
            this.eobj.detailY = detail;
            event.emitComponent("scale", clone(this.eobj));
        } else if (this.keysMap["SHIFT"]) {
            this.eobj.detailX = 0;
            this.eobj.detailY = detail;
            event.emitComponent("scale", clone(this.eobj));
        } else if (this.keysMap["CONTROL"]) {
            this.eobj.detailX = detail;
            this.eobj.detailY = 0;
            event.emitComponent("scale", clone(this.eobj));
        } else {
            this.eobj.detailX = 0;
            this.eobj.detailY = detail;
            event.emitComponent(event.TOUCH_MOVE, clone(this.eobj));
        }
        this.refresh();
    }

    public onKeyDown(e: KeyboardEvent) {
        if (e.altKey) {
            this.keysMap["ALT"] = true;
        }
        if (e.shiftKey) {
            this.keysMap["SHIFT"] = true;
        }
        if (e.ctrlKey) {
            this.keysMap["CONTROL"] = true;
        }
    }

    public onKeyUp(e: KeyboardEvent) {
        var key = e.key.toUpperCase();
        delete this.keysMap[key];
    }

    public onPosition(e: any) {
        debugger
    }

    public fit() {
        this.canvas.width = this.view.offsetWidth;
        this.canvas.height = this.view.offsetHeight;
        this.container.width = this.canvas.width;
        this.container.height = this.canvas.height;
        this.ui.refresh();
        this.container.onResize();
        this.refresh();
    }

    public get Tone() {
        return Tone;
    }

    public play() {
        this.stop();
        var self = this;

        const now = Tone.now() + 0.5
        this.startTime = now;
        this.synths = [];
        for (var i = 0; i < this.data.tracks.length; i++) {
            let track = this.data.tracks[i];
            if (track.notes.length) {
                const synth = new Tone.PolySynth(4, Tone.Synth, {
                    envelope: {
                        attack: 0.02,
                        decay: 0.1,
                        sustain: 0.3,
                        release: 1
                    }
                }).toMaster();
                this.synths.push(synth);
                track.notes.forEach(note => {
                    synth.triggerAttackRelease(note.name, note.duration, note.time + now, note.velocity)
                });
            }
        }

        this.intervalIndex = setInterval(() => {
            self.ui.body.position = (Tone.now() - self.startTime) * 2;
            self.ui.hearder.position = self.ui.body.position;
            self.refresh();
        }, 100);
    }

    public stop() {
        while (this.synths.length) {
            const synth = this.synths.shift()
            synth.dispose()
        }
        if (this.intervalIndex) {
            clearInterval(this.intervalIndex);
            this.intervalIndex = undefined;
        }
    }

    public async loadFromUrl(url: string) {
        this.data = await Midi.fromUrl(url);
        if (this.data) {
            // bmp
            var bpm = 0.5;
            if (this.data["header"] && this.data["header"]["tempos"][0]) {
                if (this.data["header"]["tempos"]) {
                    bpm = 60 / (this.data["header"]["tempos"][0]["bpm"] || 120) * 4;
                    Tone.Transport.bpm.value = this.data["header"]["tempos"][0]["bpm"];
                }
                if (this.data["header"]["ppq"]) {
                    Tone.Transport.PPQ = this.data["header"]["ppq"];
                }
            }

            this.ui.body.bpm = bpm;
            this.ui.hearder.bpm = bpm;

            (this.ui.body.duration = this.data["duration"] || 0)
            this.ui.body.setData(this.data.tracks)
            this.ui.left.setData(this.data.tracks)
            this.ui.hearder.dw = this.ui.body.dw;
            this.ui.hearder.position = this.ui.body.position;
            this.refresh();
            console.log(this.data);
        }

    }

}