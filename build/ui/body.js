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
import { ListView, MidiItem } from "./item";
var Body = (function (_super) {
    __extends(Body, _super);
    function Body(x, y, width, height) {
        if (x === void 0) { x = 0; }
        if (y === void 0) { y = 0; }
        if (width === void 0) { width = 0; }
        if (height === void 0) { height = 0; }
        var _this = _super.call(this, x, y, width, height) || this;
        _this.dw = 8;
        _this.paddingRight = 40;
        _this.offsetX = 0;
        _this.bate = 4;
        _this.bpm = 0;
        _this.position = 0;
        _this.lineWidth = 0.4;
        _this.lineColor = "#000000";
        _this.barColor = "#000000";
        _this.indexColor = "#ff0000";
        _this.indexWidth = 0.5;
        _this.duration = 0;
        _this.borderWith = 0;
        _this.listView = new ListView(_this, [], 60)
            .cbk(function () {
            var item = new MidiItem();
            item.dw = _this.dw * _this.bpm;
            return item;
        });
        _this.listView.scrollBarWidth = 4;
        return _this;
    }
    Object.defineProperty(Body.prototype, "contentHeight", {
        get: function () {
            return this.listView.contentHeight;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Body.prototype, "contentWidth", {
        get: function () {
            return this.duration * this.bpm * this.dw + this.paddingRight;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Body.prototype, "scrollHeight", {
        get: function () {
            return this.contentHeight - this.height;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Body.prototype, "scrollWidth", {
        get: function () {
            return this.contentWidth - this.width;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Body.prototype, "scrollBarHeight", {
        get: function () {
            return this.height - this.scrollHeight < 10 ? 10 : (this.height - this.scrollHeight);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Body.prototype, "scrollSpeedY", {
        get: function () {
            return (this.height - this.scrollBarHeight) / this.scrollHeight;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Body.prototype, "scrollBarWidth", {
        get: function () {
            return this.width - this.scrollWidth < 10 ? 10 : (this.width - this.scrollWidth);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Body.prototype, "scrollSpeedX", {
        get: function () {
            return (this.width - this.scrollBarWidth) / this.scrollWidth;
        },
        enumerable: true,
        configurable: true
    });
    Body.prototype.setData = function (data) {
        this.listView.setData(data);
        this.listView.offsetY = 0;
        this.listView.offsetX = 0;
        this.offsetX = 0;
        this.position = 0;
        this.dw = 8;
        this.listView.refresh();
    };
    Body.prototype.onResize = function () {
        this.listView.refresh();
        _super.prototype.onResize.call(this);
    };
    Body.prototype.onDraw = function (context) {
        if (!this.parent)
            return;
        context.save();
        _super.prototype.onDraw.call(this, context);
        context.restore();
        var box = this.box;
        context.lineWidth = this.lineWidth;
        context.strokeStyle = this.lineColor;
        for (var i = 0; i * this.dw * this.bate + this.offsetX < this.width; i++) {
            context.beginPath();
            context.moveTo(box.left + (this.offsetX + i * this.dw * this.bate) * box.sx, box.top);
            context.lineTo(box.left + (this.offsetX + i * this.dw * this.bate) * box.sx, box.top + box.height);
            context.stroke();
        }
        context.beginPath();
        context.strokeStyle = this.indexColor;
        context.lineWidth = this.indexWidth;
        context.moveTo(box.left + (this.offsetX + this.position * this.dw) * box.sx, box.top);
        context.lineTo(box.left + (this.offsetX + this.position * this.dw) * box.sx, box.top + box.height);
        context.stroke();
        if (this.height < this.contentHeight) {
            context.beginPath();
            context.fillStyle = this.barColor;
            context.fillRect(box.left + box.width * box.sx - 4, box.top - this.listView.offsetY * this.scrollSpeedY * box.sy, 4, this.scrollBarHeight * box.sy);
        }
        if (this.width < this.contentWidth) {
            context.beginPath();
            context.strokeStyle = this.barColor;
            context.strokeRect(box.left, box.top + box.height * box.sy - 4, box.width * box.sx, 4);
            context.stroke();
            context.fillStyle = this.barColor;
            context.fillRect(box.left - this.listView.offsetX * this.scrollSpeedX * box.sx, box.top + box.height * box.sy - 4, this.scrollBarWidth * box.sx, 4);
        }
    };
    return Body;
}(base.Component));
export { Body };
