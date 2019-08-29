const { Midi } = require('@tonejs/midi')
const Tone = require('tone/Tone')
import { base } from "./base/base"
import { UI } from "./ui/ui"
import { event } from "./base/event"
import { clone } from "./base/util"
import { DUI } from "./dui/dui";

import { config } from "./constant/config";
import { theme, ThemeConfig } from "./constant/theme";
import { MidiJSON } from "./constant/midi";

type CbkType = (e) => void
type ListenerObject = {
    type: string,
    cbk: CbkType,
    thisObj: any
}


export class MidiView {
    private view: HTMLElement;
    private canvas: HTMLCanvasElement;
    private context: CanvasRenderingContext2D;
    private data: any;
    private ui: UI;
    private dui: DUI;
    private container: base.Component;
    private eobj: event.TouchData = { x: 0, y: 0, detailX: 0, detailY: 0, oldX: 0, oldY: 0, x0: 0, y0: 0 };
    private active: boolean = false;
    private keysMap: { [key: string]: boolean } = {};
    private synths: any[] = [];
    private startTime: number = 0;
    private intervalIndex: any;
    public bpm: number = 2;
    private bindListner: ListenerObject[] = [];

    public constructor(view: HTMLElement, key?: string) {
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
        this.container.borderWith = config.DEFAULT_BMP;
        this.container.borderColor = "#cccccc";
        this.container.parent = new base.Component();

        if (key && ThemeConfig[key]) {
            theme.cur = ThemeConfig[key];
        }

        this.dui = new DUI(this.container, theme.cur);
        this.dui.hide();

        this.ui = new UI(this.container, theme.cur);

        this.fit()
        this.bind();

        this.container.setStyle(theme.cur.style);

        // this.ui.visible = false;
        // this.ui.hide();

    }

    public setTheme(key: string) {
        if (ThemeConfig[key]) {
            theme.cur = ThemeConfig[key];
            this.container.setStyle(theme.cur.style);
            this.ui.setTheme(theme.cur);
            this.dui.setTheme(theme.cur);
            this.refresh();
        }
    }

    public refresh() {
        this.container.onDraw(this.context);
    }

    protected addEventListener(type: string, cbk: CbkType, _thisObj: any) {
        if (!_thisObj) return
        this.bindListner.push({
            type: type,
            cbk: cbk,
            thisObj: _thisObj,
        })
        _thisObj.addEventListener(type, cbk)
    }

    public bind() {
        this.addEventListener("resize", this.fit.bind(this), window);

        this.addEventListener("mousedown", this.onDown.bind(this), this.canvas)
        this.addEventListener("mousemove", this.onMove.bind(this), this.canvas)
        this.addEventListener("mouseup", this.onUp.bind(this), this.canvas)
        this.addEventListener("mouseout", this.onUp.bind(this), this.canvas)

        this.addEventListener("touchstart", this.onDown.bind(this), this.canvas)
        this.addEventListener("touchmove", this.onMove.bind(this), this.canvas)
        this.addEventListener("touchend", this.onUp.bind(this), this.canvas)

        this.addEventListener("wheel", this.onScroll.bind(this), this.canvas)
        this.addEventListener("keydown", this.onKeyDown.bind(this), document);
        this.addEventListener("keyup", this.onKeyUp.bind(this), document);

        this.addEventListener("position", this.onPosition.bind(this), this.canvas)

        event.bind("refresh", (e: event.EventObject) => {
            this.refresh();
        }, this);
        event.bind("show-detail", (e: event.EventObject) => {
            this.ui.hide();
            this.dui.show();
            this.dui.setNodesData(e.data);
            this.refresh();
        }, this);
        event.bind("hide-detail", (e: event.EventObject) => {
            this.ui.show();
            this.dui.hide();
            this.refresh();
        }, this);
    }

    private adapteEvent(e: MouseEvent) {
        if (e.offsetX !== undefined) return e
        if (e["targetTouches"] && e["targetTouches"].length) {
            return {
                offsetX: e["targetTouches"][0].clientX,
                offsetY: e["targetTouches"][0].clientY
            }
        }
        return e
    }

    public onDown(eee: MouseEvent) {
        var e = this.adapteEvent(eee)
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

    public onMove(eee: MouseEvent) {
        var e = this.adapteEvent(eee)
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

    public onUp(eee: MouseEvent) {
        var e = this.adapteEvent(eee)
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
        var detail = (e["wheelDelta"] || e["detail"] || 0) * config.WHELL_RATE;
        if (this.keysMap["SHIFT"]) {
            this.eobj.detailX = detail;
            this.eobj.detailY = 0;
            event.emitComponent(event.TOUCH_MOVE, clone(this.eobj));
        } else if (this.keysMap["ALT"] && this.keysMap["CONTROL"]) {
            this.eobj.detailX = detail;
            this.eobj.detailY = detail;
            event.emitComponent("scale", clone(this.eobj));
        } else if (this.keysMap["ALT"]) {
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
        this.ui.resize(this.canvas.width, this.canvas.height);
        this.dui.resize(this.canvas.width, this.canvas.height);
        this.container.onResize();
        this.refresh();
    }

    public get Tone() {
        return Tone;
    }

    public play() {
        this.stop();
        var self = this;

        const now = Tone.now() + config.TONE_DELAY
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
            self.ui.position = (Tone.now() - self.startTime) * this.bpm;
            self.dui.position = (Tone.now() - self.startTime) * this.bpm;
            self.refresh();
        }, config.REFRESH_INTERVAL);
    }

    public stop() {
        while (this.synths.length) {
            try {
                const synth = this.synths.shift()
                synth.dispose()
            } catch (e) { }
        }
        if (this.intervalIndex) {
            clearInterval(this.intervalIndex);
            this.intervalIndex = undefined;
        }
    }

    private loadData() {
        if (this.data) {
            var data = <MidiJSON>this.data;
            if (data.header) {
                var ppq = 4;
                // if (data.header.ppq) {
                //     ppq = data.header.ppq / 24;
                //     Tone.Transport.PPQ = data.header.ppq;
                // }
                if (data.header.tempos && data.header.tempos.length) {
                    Tone.Transport.bpm.value = data.header.tempos[0].bpm;
                    this.bpm = 60 / (data.header.tempos[0].bpm || config.DEFAULT_TEMPOS) * ppq;
                } else {
                    Tone.Transport.bpm.value = config.DEFAULT_TEMPOS;
                }
            }
            // bmp
            this.ui.setData(this.data);
            this.dui.setData(this.data);
            this.refresh();
            // console.log(this.data);
        }
    }

    public async loadFromUrl(url: string) {
        this.stop();
        this.data = await Midi.fromUrl(url);
        this.loadData();
    }

    public async loadFromData(bstr: any) {
        this.data = new Midi(bstr);
        this.loadData();
    }

    public destroy() {
        this.data = undefined
        event.cancelAll()
        for (var key in this.bindListner) {
            try {
                let obj = this.bindListner[key]
                obj.thisObj && obj.thisObj.removeEventListener(obj.type, obj.cbk)
            } catch (e) {
                console.error(e)
            }
        }
        this.bindListner = []
        this.container && this.container.onDestroy()
    }
}