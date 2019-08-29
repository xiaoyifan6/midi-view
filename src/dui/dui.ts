const Tone = require('tone/Tone')
import { base } from "../base/base"
import { Left } from "./left"
import { Header } from "../ui/header";
import { Body } from "./body";
import { event } from "../base/event";
import { views } from "../views/views";
import { config } from "../constant/config";
import { Style, Theme } from "../constant/theme";

export class DUI extends base.BaseUI {
    private headHeight: number;
    private leftWidth: number;

    public left: Left;
    public hearder: Header;
    public body: Body;
    private synth: any;
    private closeBtn: base.Component;


    public constructor(container: base.Component, theme: Theme, headHeight: number = config.dui.headHeight, leftWidth: number = config.dui.leftWidth) {
        super(container, theme);
        this.headHeight = headHeight;
        this.leftWidth = leftWidth;

        this.body = new Body(leftWidth, headHeight, container.width - leftWidth, container.height - headHeight);
        this.body.borderWith = 0;

        this.left = new Left(0, this.headHeight, this.leftWidth, this.container.height - this.headHeight);
        this.left.borderWith = config.dui.left.borderWith;
        this.left.lineWidth = config.dui.left.lineWidth;

        this.hearder = new Header(leftWidth, 0, container.width - leftWidth, headHeight);
        this.hearder.borderWith = config.dui.hearder.borderWith;

        this.hearder.dw = this.body.dw = config.dui.body.dw;
        // this.left.dh = this.body.dh * 3 / 2;
        this.left.dh = this.body.dh * 82 / 48;

        var closeBtn = new views.Button(config.dui.closeBtn.x, config.dui.closeBtn.y, config.dui.closeBtn.width, config.dui.closeBtn.height);
        closeBtn.text = "关 闭";
        closeBtn.borderWith = config.dui.closeBtn.borderWith;
        closeBtn.radius = config.dui.closeBtn.radius;
        this.closeBtn = closeBtn;

        container.addChild(this.hearder);
        container.addChild(this.left);
        container.addChild(this.body);
        container.addChild(this.closeBtn);

        this.bind();

        this.setTheme(theme);
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
            let dy = eobj.data.detailY * 0.2;// eobj.p.y - eobj.op.y;
            let dx = eobj.data.detailX;//eobj.p.x - eobj.op.x;

            if (dy != 0 && self.body.dh + dy >= 8 && self.body.dh + dy <= self.body.height / 4) {
                self.body.dh += dy;
                self.left.dh = self.body.dh * 82 / 48;
                // console.log(this.left.dh)
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
                const now = Tone.now() + config.dui.toneDelay;
                self.left.hitKey(note.name, note.duration * 1000);
                self.synth.triggerAttackRelease(note.name, note.duration, now, note.velocity)
            }
        }
        event.bind(event.TOUCH, cbk2, this.body);

        var cbk2 = (eobj: event.EventObject) => {
            if (eobj.target !== self.left) return;
            var name = self.left.hit(eobj.data.x, eobj.data.y);
            if (name && self.synth) {
                const now = Tone.now() + config.dui.toneDelay;
                self.synth.triggerAttackRelease(name, 0.4, now)
            }
        }
        event.bind(event.TOUCH, cbk2, this.left);

        event.bind(event.TOUCH, (e: event.EventObject) => {
            event.emit("hide-detail");
        }, this.closeBtn);
    }

    public hide() {
        super.hide();
        this.left.visible = false;
        this.hearder.visible = false;
        this.body.visible = false;
        this.closeBtn.visible = false;
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
        this.closeBtn.visible = true;
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
        var bpm = config.DEFAULT_BMP;
        var ppq = 4;
        if (this.data["header"]) {
            // if (this.data["header"]["ppq"]) {
            //     ppq = this.data["header"]["ppq"] / 24;
            // }
            if (this.data["header"]["tempos"] && this.data["header"]["tempos"][0]) {
                bpm = 60 / (this.data["header"]["tempos"][0]["bpm"] || config.DEFAULT_TEMPOS) * ppq;
            }
        }

        this.body.bpm = bpm;
        this.hearder.bpm = bpm;

        this.body.duration = this.data["duration"] || 0
        this.body.setData(this.data.tracks[0].notes)
        // console.log(this.data.tracks[0].notes)
        // this.left.setData(this.data.tracks)
        this.hearder.dw = this.body.dw = config.dui.body.dw;
        this.left.dh = this.body.dh * 82 / 48;
        this.hearder.offsetX = 0;
        this.left.offsetY = 0;
        this.hearder.position = this.body.position = 0;
    }

    public setNodesData(data: any) {
        this.body.setData(data);
        this.hearder.dw = this.body.dw = config.dui.body.dw;
        this.left.dh = this.body.dh * 82 / 48;
        this.hearder.offsetX = 0;
        this.left.offsetY = 0;
        this.hearder.position = this.body.position;
    }

    public set position(p: number) {
        this.body.position = p;
        this.hearder.position = this.body.position;
    }

    public setTheme(theme: Theme) {
        super.setTheme(theme);
        this.body.setStyle(theme.dui.body);
        this.left.setStyle(theme.dui.left);
        this.hearder.setStyle(theme.dui.header);
        this.closeBtn.setStyle(theme.dui.closeBtn);
    }
}