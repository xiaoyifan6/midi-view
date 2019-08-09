const { Midi } = require('@tonejs/midi')
const Tone = require('tone/Tone')
import { base } from "./base/rect"
import { UI } from "./ui/ui"
import { EventObject, Event } from "./base/event"

export class MidiView {
    private view: HTMLElement;
    private canvas: HTMLCanvasElement;
    private context: CanvasRenderingContext2D;
    private midi: any;
    private data: any;
    private ui: UI;
    private container: base.Component;
    private eobj?: EventObject;
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
        this.midi = new Midi()
        this.container = new base.Component();
        this.container.borderWith = 2;
        this.container.borderColor = "#cccccc";
        this.container.parent = new base.Component();

        this.ui = new UI(this.container);
        this.fit()
        this.bind();
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
        this.eobj = {
            p: new base.Point(),
            p0: new base.Point(),
            op: new base.Point(),
            detailX: 0,
            detailY: 0
        }
        if (this.eobj.p && this.eobj.p0 && this.eobj.op) {
            this.eobj.p.x = e.offsetX;
            this.eobj.p.y = e.offsetY;
            this.eobj.p0.x = e.offsetX;
            this.eobj.p0.y = e.offsetY;
            this.active = true;
            Event.active(this.eobj.p);
        }
    }

    public onMove(e: MouseEvent) {
        if (!this.eobj) {
            this.eobj = {
                p: new base.Point(),
                p0: new base.Point(),
                op: new base.Point(),
                detailX: 0,
                detailY: 0
            }
        }
        if (this.eobj && this.eobj.p && this.eobj.p0 && this.eobj.op) {
            // console.log("xy:", e.y, e.y, "client:", e.clientX, e.clientY, "page:", e.pageX, e.pageY,
            //     "layer:", e.layerX, e.layerY, "offset:", e.offsetX, e.offsetY);
            this.eobj.op.x = this.eobj.p.x;
            this.eobj.op.y = this.eobj.p.y;
            this.eobj.p.x = e.offsetX;
            this.eobj.p.y = e.offsetY;
            if (this.active) {
                if (this.eobj.p.distance(this.eobj.p0) >= 5) {
                    Event.emitDrag({
                        p: this.eobj.p.clone(),
                        p0: this.eobj.p0.clone(),
                        op: this.eobj.op.clone(),
                        detailX: this.eobj.p.x - this.eobj.op.x,
                        detailY: this.eobj.p.y - this.eobj.op.y,
                    });
                }
                this.refresh();
            }
        }
    }

    public onUp(e: MouseEvent) {
        if (this.eobj && this.active && this.eobj.p && this.eobj.p0 && this.eobj.op) {
            this.eobj.op.x = this.eobj.p.x;
            this.eobj.op.y = this.eobj.p.y;
            this.eobj.p.x = e.offsetX;
            this.eobj.p.y = e.offsetY;

            if (this.eobj.p.distance(this.eobj.p0) < 5) {
                Event.emitClick(e.offsetX, e.offsetY);
            } else {
                Event.emitDrag({
                    p: this.eobj.p.clone(),
                    p0: this.eobj.p0.clone(),
                    op: this.eobj.op.clone(),
                    detailX: this.eobj.p.x - this.eobj.op.x,
                    detailY: this.eobj.p.y - this.eobj.op.y,
                })
            }
            Event.release();
            this.refresh();
            this.active = false;
        }
    }

    public onScroll(e: Event) {
        e = e || window.event;
        var detail = (e["wheelDelta"] || e["detail"] || 0) * 0.1;
        if (this.keysMap["ALT"]) {
            this.eobj && this.eobj.p && Event.emitDrag({
                p: this.eobj.p.clone(),
                detailX: detail,
                detailY: 0,
            })
        } else if (this.keysMap["SHIFT"] && this.keysMap["CONTROL"]) {
            this.eobj && this.eobj.p && Event.emitScale({
                p: this.eobj.p.clone(),
                detailX: detail,
                detailY: detail,
            })
        } else if (this.keysMap["SHIFT"]) {
            this.eobj && this.eobj.p && Event.emitScale({
                p: this.eobj.p.clone(),
                detailX: 0,
                detailY: detail,
            })
        } else if (this.keysMap["CONTROL"]) {
            this.eobj && this.eobj.p && Event.emitScale({
                p: this.eobj.p.clone(),
                detailX: detail,
                detailY: 0,
            })
        } else {
            this.eobj && this.eobj.p && Event.emitDrag({
                p: this.eobj.p.clone(),
                detailX: 0,
                detailY: detail,
            })
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