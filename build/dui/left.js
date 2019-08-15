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
import { Tone } from "../constant/data";
import { event } from "../base/event";
var Left = (function (_super) {
    __extends(Left, _super);
    function Left() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.dh = 24;
        _this.offsetY = 0;
        _this.lineWidth = 0.4;
        _this.blackColor = "#000000";
        _this.whiteColor = "#ffffff";
        _this.keyColor = "#ff0000";
        _this.selectKey = {};
        _this.rects = [];
        return _this;
    }
    Left.prototype.init = function () {
        _super.prototype.init.call(this);
        this.borderColor = "#333333";
    };
    Left.prototype.onDraw = function (context) {
        if (this.parent == null || !this.visible)
            return;
        _super.prototype.onDraw.call(this, context);
        var j = 0;
        var box = this.box;
        context.fillStyle = this.blackColor;
        context.strokeStyle = this.borderColor;
        context.lineWidth = this.lineWidth;
        this.rects = [];
        var yarr = [];
        var w = box.left + box.width;
        for (var i = 0; i < Tone.length; i++) {
            context.beginPath();
            var t = Tone[i];
            var y = this.offsetY + box.top + this.dh * j * box.sy;
            if (t.indexOf("#") >= 0) {
                yarr.push({
                    j: j,
                    i: i
                });
            }
            else {
                j++;
                if (y > box.bottom)
                    break;
                var rect = new base.Rect(box.left, y, w, this.dh * box.sy);
                this.rects.push({
                    rect: rect,
                    index: t
                });
                if (this.selectKey[t]) {
                    context.fillStyle = this.keyColor;
                    context.fillRect(rect.x, rect.y, rect.width, rect.height);
                }
                context.strokeRect(rect.x, rect.y, rect.width, rect.height);
                if (/C[-]*[0-9]/.test(t) || this.dh >= 30) {
                    var tm = context.measureText(t);
                    context.strokeText(t, box.left + w - tm.width - 4, y + this.dh * box.sy * 2 / 3);
                }
                context.stroke();
            }
        }
        var p = 2;
        for (var i = 0; i < yarr.length; i++) {
            var y = this.offsetY + box.top + this.dh * (yarr[i].j - 0.5) * box.sy + p;
            w = box.left + box.width * 2 / 3;
            if (y > box.bottom)
                break;
            var t_1 = Tone[yarr[i].i];
            if (this.selectKey[t_1]) {
                context.fillStyle = this.keyColor;
            }
            else {
                context.fillStyle = this.blackColor;
            }
            var rect = new base.Rect(box.left, y, w, this.dh * box.sy - p * 2);
            context.fillRect(rect.x, rect.y, rect.width, rect.height);
            if (this.dh >= 30) {
                context.beginPath();
                context.strokeStyle = this.whiteColor;
                var tm = context.measureText(t_1);
                context.strokeText(t_1, box.left + 4, y + this.dh * box.sy * 2 / 3);
                context.stroke();
            }
            this.rects.push({
                rect: rect,
                index: t_1
            });
        }
        this.rects.reverse();
    };
    Left.prototype.hitKey = function (key, duration) {
        if (duration === void 0) { duration = 500; }
        this.selectKey[key] = true;
        var self = this;
        setTimeout(function () {
            delete self.selectKey[key];
            event.emit("refresh");
        }, duration);
    };
    Left.prototype.hit = function (x, y) {
        for (var i = 0; i < this.rects.length; i++) {
            if (this.rects[i].rect.contain2(x, y)) {
                this.hitKey(this.rects[i].index);
                return this.rects[i].index;
            }
        }
        return null;
    };
    return Left;
}(base.Component));
export { Left };
