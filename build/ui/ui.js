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
import { base } from "../base/base";
import { Header } from "./header";
import { Body } from "./body";
import { Left } from "./left";
import { event } from "../base/event";
var UI = (function (_super) {
    __extends(UI, _super);
    function UI(container, headHeight, leftWidth) {
        if (headHeight === void 0) { headHeight = 40; }
        if (leftWidth === void 0) { leftWidth = 80; }
        var _this = _super.call(this, container) || this;
        _this.headHeight = headHeight;
        _this.leftWidth = leftWidth;
        _this.hearder = new Header(leftWidth, 0, container.width - leftWidth, headHeight);
        _this.left = new Left(0, headHeight, leftWidth, container.height - headHeight);
        _this.body = new Body(leftWidth, headHeight, container.width - leftWidth, container.height - headHeight);
        _this.hearder.borderWith = 1;
        _this.hearder.dw = _this.body.dw;
        _this.left.borderWith = 1;
        _this.body.borderWith = 0;
        container.addChild(_this.body);
        container.addChild(_this.hearder);
        container.addChild(_this.left);
        _this.bind();
        return _this;
    }
    UI.prototype.bind = function () {
        var self = this;
        var cbk = function (eobj) {
            var dy = eobj.data.detailY;
            var dx = eobj.data.detailX;
            if (self.body.listView.offsetY + dy <= 0 && self.body.listView.offsetY + self.body.listView.contentHeight + dy >= self.body.height) {
                self.body.listView.offsetY += dy;
                self.left.listView.offsetY += dy;
                self.body.listView.refresh();
                self.left.listView.refresh();
            }
            if (eobj.target === self.body && self.body.offsetX + dx <= 0 && self.body.offsetX + self.body.contentWidth + dx >= self.body.width) {
                self.body.listView.offsetX += dx;
                self.body.offsetX = self.body.listView.offsetX;
                self.hearder.offsetX += dx;
                self.body.listView.refresh();
            }
        };
        event.bind(event.TOUCH_MOVE, cbk, this.body);
        event.bind(event.TOUCH_MOVE, cbk, this.left);
        var cbk = function (eobj) {
            var dy = eobj.data.detailY;
            var dx = eobj.data.detailX;
            if (self.body.listView.itemHeight + dy >= 40 && self.body.listView.itemHeight + dy <= self.body.height / 2) {
                self.body.listView.itemHeight += dy;
                self.left.listView.itemHeight += dy;
                self.body.listView.offsetY = 0;
                self.left.listView.offsetY = 0;
                self.body.listView.refresh();
                self.left.listView.refresh();
            }
            if (self.body.dw + dx >= 8 && (self.body.dw + dx) * self.body.bpm <= 240) {
                self.body.dw += dx;
                self.hearder.dw += dx;
                for (var i in self.body.listView.views) {
                    self.body.listView.views[i]["dw"] = self.body.dw * self.body.bpm;
                }
                self.body.offsetX = 0;
                self.hearder.offsetX = 0;
                self.body.listView.offsetX = 0;
                self.body.listView.refresh();
            }
        };
        event.bind(event.TOUCH_SCALE, cbk, this.body);
        var cbk2 = function (eobj) {
            var x = Math.floor((eobj.data.x - self.body.offsetX - self.body.left) / self.hearder.dw);
            self.body.position = x;
            self.hearder.position = x;
        };
        event.bind(event.TOUCH, cbk2, this.hearder);
        var cbk2 = function (eobj) {
            self.body.listView.hit(eobj.data.x, eobj.data.y);
        };
        event.bind(event.TOUCH, cbk2, this.body);
    };
    UI.prototype.setData = function (data) {
        _super.prototype.setData.call(this, data);
        var bpm = 2;
        if (this.data["header"] && this.data["header"]["tempos"] && this.data["header"]["tempos"][0]) {
            bpm = 60 / (this.data["header"]["tempos"][0]["bpm"] || 120) * 4;
        }
        this.body.bpm = bpm;
        this.hearder.bpm = bpm;
        this.body.duration = this.data["duration"] || 0;
        this.body.setData(this.data.tracks);
        this.left.setData(this.data.tracks);
        this.hearder.offsetX = 0;
        this.hearder.dw = this.body.dw = 8;
        for (var i in this.body.listView.views) {
            this.body.listView.views[i]["dw"] = this.body.dw * this.body.bpm;
        }
        this.hearder.position = this.body.position;
    };
    UI.prototype.resize = function (width, height) {
        _super.prototype.resize.call(this, width, height);
        this.refresh();
    };
    UI.prototype.refresh = function () {
        this.hearder.set(this.leftWidth, 0, this.container.width - this.leftWidth, this.headHeight);
        this.left.set(0, this.headHeight, this.leftWidth, this.container.height - this.headHeight);
        this.body.set(this.leftWidth, this.headHeight, this.container.width - this.leftWidth, this.container.height - this.headHeight);
    };
    Object.defineProperty(UI.prototype, "position", {
        set: function (p) {
            this.body.position = p;
            this.hearder.position = this.body.position;
        },
        enumerable: true,
        configurable: true
    });
    UI.prototype.hide = function () {
        _super.prototype.hide.call(this);
        this.body.visible = false;
        this.hearder.visible = false;
        this.left.visible = false;
    };
    UI.prototype.show = function () {
        _super.prototype.show.call(this);
        this.body.visible = true;
        this.hearder.visible = true;
        this.left.visible = true;
    };
    return UI;
}(base.BaseUI));
export { UI };
