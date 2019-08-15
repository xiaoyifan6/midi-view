var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var Tone = require('tone/Tone');
import { base } from "../base/base";
import { Left } from "./left";
import { Header } from "../ui/header";
import { Body } from "./body";
import { event } from "../base/event";
import { views } from "../views/views";
var DUI = (function (_super) {
    __extends(DUI, _super);
    function DUI(container, headHeight, leftWidth) {
        if (headHeight === void 0) { headHeight = 40; }
        if (leftWidth === void 0) { leftWidth = 70; }
        var _this = _super.call(this, container) || this;
        _this.headHeight = headHeight;
        _this.leftWidth = leftWidth;
        _this.body = new Body(leftWidth, headHeight, container.width - leftWidth, container.height - headHeight);
        _this.body.borderWith = 0;
        _this.left = new Left(0, _this.headHeight, _this.leftWidth, _this.container.height - _this.headHeight);
        _this.left.borderWith = 1;
        _this.left.lineWidth = 1;
        _this.hearder = new Header(leftWidth, 0, container.width - leftWidth, headHeight);
        _this.hearder.borderWith = 1;
        _this.hearder.dw = _this.body.dw = 40;
        _this.left.dh = _this.body.dh * 82 / 48;
        var closeBtn = new views.Button(10, 10, 40, 20);
        closeBtn.text = "关 闭";
        closeBtn.borderWith = 0.4;
        _this.closeBtn = closeBtn;
        container.addChild(_this.hearder);
        container.addChild(_this.left);
        container.addChild(_this.body);
        container.addChild(_this.closeBtn);
        _this.bind();
        return _this;
    }
    DUI.prototype.bind = function () {
        var self = this;
        var cbk = function (eobj) {
            var dy = eobj.data.detailY;
            var dx = eobj.data.detailX;
            if (self.body.offsetY + dy <= 0 && self.body.offsetY + self.body.contentHeight + dy >= self.body.height) {
                self.body.offsetY += dy;
                self.left.offsetY += dy;
            }
            if (eobj.target === self.body && self.body.offsetX + dx <= 0 && self.body.offsetX + self.body.contentWidth + dx >= self.body.width) {
                self.body.offsetX += dx;
                self.body.offsetX = self.body.offsetX;
                self.hearder.offsetX += dx;
            }
        };
        event.bind(event.TOUCH_MOVE, cbk, this.body);
        event.bind(event.TOUCH_MOVE, cbk, this.left);
        var cbk = function (eobj) {
            var dy = eobj.data.detailY * 0.2;
            var dx = eobj.data.detailX;
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
        var cbk2 = function (eobj) {
            if (eobj.target !== self.hearder)
                return;
            var x = Math.floor((eobj.data.x - self.body.offsetX - self.body.left) / self.hearder.dw);
            if (self.body.left + self.body.offsetX + x * self.body.dw < self.body.left) {
                x = 0;
            }
            self.body.position = x;
            self.hearder.position = x;
        };
        event.bind(event.TOUCH, cbk2, this.hearder);
        var cbk2 = function (eobj) {
            if (eobj.target !== self.body)
                return;
            var note = self.body.hit(eobj.data.x, eobj.data.y);
            if (note && self.synth) {
                var now = Tone.now() + 0.1;
                self.left.hitKey(note.name, note.duration * 1000);
                self.synth.triggerAttackRelease(note.name, note.duration, now, note.velocity);
            }
        };
        event.bind(event.TOUCH, cbk2, this.body);
        var cbk2 = function (eobj) {
            if (eobj.target !== self.left)
                return;
            var name = self.left.hit(eobj.data.x, eobj.data.y);
            if (name && self.synth) {
                var now = Tone.now() + 0.1;
                self.synth.triggerAttackRelease(name, 0.4, now);
            }
        };
        event.bind(event.TOUCH, cbk2, this.left);
        event.bind(event.TOUCH, function (e) {
            event.emit("hide-detail");
        }, this.closeBtn);
    };
    DUI.prototype.hide = function () {
        _super.prototype.hide.call(this);
        this.left.visible = false;
        this.hearder.visible = false;
        this.body.visible = false;
        this.closeBtn.visible = false;
        if (this.synth) {
            this.synth.dispose();
            this.synth = false;
        }
    };
    DUI.prototype.show = function () {
        _super.prototype.show.call(this);
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
    };
    DUI.prototype.refresh = function () {
        this.hearder.set(this.leftWidth, 0, this.container.width - this.leftWidth, this.headHeight);
        this.left.set(0, this.headHeight, this.leftWidth, this.container.height - this.headHeight);
        this.body.set(this.leftWidth, this.headHeight, this.container.width - this.leftWidth, this.container.height - this.headHeight);
    };
    DUI.prototype.resize = function (width, height) {
        _super.prototype.resize.call(this, width, height);
        this.refresh();
    };
    DUI.prototype.setData = function (data) {
        _super.prototype.setData.call(this, data);
        var bpm = 2;
        if (this.data["header"] && this.data["header"]["tempos"] && this.data["header"]["tempos"][0]) {
            bpm = 60 / (this.data["header"]["tempos"][0]["bpm"] || 120) * 4;
        }
        this.body.bpm = bpm;
        this.hearder.bpm = bpm;
        this.body.duration = this.data["duration"] || 0;
        this.body.setData(this.data.tracks[0].notes);
        console.log(this.data.tracks[0].notes);
        this.hearder.dw = this.body.dw = 40;
        this.left.dh = this.body.dh * 82 / 48;
        this.hearder.offsetX = 0;
        this.left.offsetY = 0;
        this.hearder.position = this.body.position = 0;
    };
    DUI.prototype.setNodesData = function (data) {
        this.body.setData(data);
        this.hearder.dw = this.body.dw = 40;
        this.left.dh = this.body.dh * 82 / 48;
        this.hearder.offsetX = 0;
        this.left.offsetY = 0;
        this.hearder.position = this.body.position;
    };
    Object.defineProperty(DUI.prototype, "position", {
        set: function (p) {
            this.body.position = p;
            this.hearder.position = this.body.position;
        },
        enumerable: true,
        configurable: true
    });
    return DUI;
}(base.BaseUI));
export { DUI };
