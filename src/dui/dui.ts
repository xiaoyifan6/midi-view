const Tone = require('tone/Tone')
import { base } from "../base/base"
import { Left } from "./left"
import { Header } from "../ui/header";
import { Body } from "./body";
import { event } from "../base/event";

export class DUI extends base.BaseUI {
    private headHeight: number;
    private leftWidth: number;

    public left: Left;
    public hearder: Header;
    public body: Body;
    private synth: any;


    public constructor(container: base.Component, headHeight: number = 40, leftWidth: number = 60) {
        super(container);
        this.headHeight = headHeight;
        this.leftWidth = leftWidth;

        this.body = new Body(leftWidth, headHeight, container.width - leftWidth, container.height - headHeight);
        this.body.borderWith = 0;

        this.left = new Left(0, this.headHeight, this.leftWidth, this.container.height - this.headHeight);
        this.left.borderWith = 1;
        this.left.lineWidth = 1;

        this.hearder = new Header(leftWidth, 0, container.width - leftWidth, headHeight);
        this.hearder.borderWith = 1;

        this.hearder.dw = this.body.dw = 40;
        // this.left.dh = this.body.dh * 3 / 2;
        this.left.dh = this.body.dh * 82 / 48;

        container.addChild(this.hearder);
        container.addChild(this.left);
        container.addChild(this.body);

        this.bind();
    }

    public bind() {
        var self = this;

        var cbk = (eobj: event.EventObject) => {
            let dy = eobj.data.detailY;// eobj.p.y - eobj.op.y;
            let dx = eobj.data.detailX;//eobj.p.x - eobj.op.x;
            // dx *= 0.2;

            if (self.body.offsetY + dy <= 0 && self.body.offsetY + self.body.contentHeight + dy >= self.body.height) {
                self.body.offsetY += dy;
                self.left.offsetY += dy;
            }

            if (eobj.target === self.body && self.body.offsetX + dx <= 0 && self.body.offsetX + self.body.contentWidth + dx >= self.body.width) {
                self.body.offsetX += dx;
                self.body.offsetX = self.body.offsetX;
                self.hearder.offsetX += dx;
                // self.body.refresh();
            }
        }
        event.bind(event.TOUCH_MOVE, cbk, this.body);
        event.bind(event.TOUCH_MOVE, cbk, this.left);

        var cbk = (eobj: event.EventObject) => {
            let dy = eobj.data.detailY;// eobj.p.y - eobj.op.y;
            let dx = eobj.data.detailX;//eobj.p.x - eobj.op.x;

            if (dy != 0 && self.body.dh + dy >= 8 && self.body.dh + dy <= self.body.height / 4) {
                self.body.dh += dy;
                self.left.dh = self.body.dh * 82 / 48;
                self.body.offsetY = 0;
                self.left.offsetY = 0;
            }

            if (dx != 0 && self.body.dw + dx >= 30 && (self.body.dw + dx) * self.body.bpm <= 240) {
                self.body.dw += dx;
                self.hearder.dw = self.body.dw;
                self.body.offsetX = 0;
                self.hearder.offsetX = 0;
                self.body.offsetX = 0;
            }
        };

        event.bind(event.TOUCH_SCALE, cbk, this.body);

        var cbk2 = (eobj: event.EventObject) => {
            if (eobj.target !== self.hearder) return;
            var x = Math.floor((eobj.data.x - self.body.offsetX - self.body.left) / self.hearder.dw);
            if (self.body.left + self.body.offsetX + x * self.body.dw < self.body.left) {
                x = 0;
            }
            self.body.position = x;
            self.hearder.position = x;
        }
        event.bind(event.TOUCH, cbk2, this.hearder);

        var cbk2 = (eobj: event.EventObject) => {
            if (eobj.target !== self.body) return;
            var note = self.body.hit(eobj.data.x, eobj.data.y);
            if (note && self.synth) {
                const now = Tone.now() + 0.1
                self.left.hitKey(note.name, note.duration * 1000);
                self.synth.triggerAttackRelease(note.name, note.duration, now, note.velocity)
            }
        }
        event.bind(event.TOUCH, cbk2, this.body);

        var cbk2 = (eobj: event.EventObject) => {
            if (eobj.target !== self.left) return;
            var name = self.left.hit(eobj.data.x, eobj.data.y);
            if (name && self.synth) {
                const now = Tone.now() + 0.1
                self.synth.triggerAttackRelease(name, 0.4, now)
            }
        }
        event.bind(event.TOUCH, cbk2, this.left);
    }

    public hide() {
        super.hide();
        this.left.visible = false;
        this.hearder.visible = false;
        this.body.visible = false;
        if (this.synth) {
            this.synth.dispose()
            this.synth = false;
        }
    }

    public show() {
        super.show();
        this.left.visible = true;
        this.hearder.visible = true;
        this.body.visible = true;
        this.synth = new Tone.PolySynth(4, Tone.Synth, {
            envelope: {
                attack: 0.02,
                decay: 0.1,
                sustain: 0.3,
                release: 1
            }
        }).toMaster();
    }

    public refresh() {
        this.hearder.set(this.leftWidth, 0, this.container.width - this.leftWidth, this.headHeight);
        this.left.set(0, this.headHeight, this.leftWidth, this.container.height - this.headHeight);
        this.body.set(this.leftWidth, this.headHeight, this.container.width - this.leftWidth, this.container.height - this.headHeight);
    }

    public resize(width: number, height: number) {
        super.resize(width, height);
        this.refresh();
    }

    public setData(data: any) {
        super.setData(data);
        var bpm = 0.5;
        if (this.data["header"] && this.data["header"]["tempos"][0]) {
            if (this.data["header"]["tempos"]) {
                bpm = 60 / (this.data["header"]["tempos"][0]["bpm"] || 120) * 4;
            }

        }

        this.body.bpm = bpm;
        this.hearder.bpm = bpm;

        this.body.duration = this.data["duration"] || 0
        this.body.setData(this.data.tracks[0].notes)
        console.log(this.data.tracks[0].notes)
        // this.left.setData(this.data.tracks)
        this.hearder.dw = this.body.dw = 40;
        this.left.dh = this.body.dh * 82 / 48;
        this.hearder.offsetX = 0;
        this.left.offsetY = 0;
        this.hearder.position = this.body.position;
    }

    public set position(p: number) {
        this.body.position = p;
        this.hearder.position = this.body.position;
    }

}