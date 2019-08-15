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
var Body = (function (_super) {
    __extends(Body, _super);
    function Body() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.dh = 8;
        _this.dw = 8;
        _this.lineColor = "#cccccc";
        _this.lineWidth = 1;
        _this.barColor = "#000000";
        _this.hitColor = "#ff0000";
        _this.indexColor = "#ff0000";
        _this.indexWidth = 0.5;
        _this.rects = [];
        _this.offsetX = 0;
        _this.offsetY = 0;
        _this.nodes = [];
        _this.duration = 0;
        _this.bpm = 0;
        _this.position = 0;
        _this.paddingRight = 10;
        _this.hitIndex = -1;
        return _this;
    }
    Body.prototype.setData = function (nodes) {
        this.nodes = nodes;
        this.offsetX = 0;
        this.offsetY = 0;
        this.position = 0;
        this.dw = 8;
        this.hitIndex = -1;
    };
    Body.prototype.init = function () {
        _super.prototype.init.call(this);
        this.borderWith = 0;
    };
    Object.defineProperty(Body.prototype, "contentHeight", {
        get: function () {
            return this.dh * Tone.length;
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
    Body.prototype.onDraw = function (context) {
        if (!this.parent || this.bpm <= 0)
            return;
        _super.prototype.onDraw.call(this, context);
        var box = this.box;
        context.lineWidth = this.lineWidth;
        context.strokeStyle = this.lineColor;
        for (var i = 0; i * this.dw + this.offsetX < this.width; i++) {
            context.beginPath();
            context.moveTo(box.left + (this.offsetX + i * this.dw) * box.sx, box.top);
            context.lineTo(box.left + (this.offsetX + i * this.dw) * box.sx, box.top + box.height);
            context.stroke();
        }
        for (var i = 0; i * this.dh + this.offsetY < this.height; i++) {
            context.beginPath();
            context.moveTo(box.left, box.top + (this.offsetY + i * this.dh) * box.sy);
            context.lineTo(box.left + box.width, box.top + +(this.offsetY + i * this.dh) * box.sy);
            context.stroke();
        }
        if (this.height < this.contentHeight) {
            context.beginPath();
            context.strokeStyle = this.barColor;
            context.strokeRect(box.left + box.width * box.sx - 4, box.top, 4, box.height * box.sy);
            context.stroke();
            context.fillStyle = this.barColor;
            context.fillRect(box.left + box.width * box.sx - 4, box.top - this.offsetY * this.scrollSpeedY * box.sy, 4, this.scrollBarHeight * box.sy);
        }
        if (this.width < this.contentWidth) {
            context.beginPath();
            context.strokeStyle = this.barColor;
            context.strokeRect(box.left, box.top + box.height * box.sy - 4, box.width * box.sx, 4);
            context.stroke();
            context.fillStyle = this.barColor;
            context.fillRect(box.left - this.offsetX * this.scrollSpeedX * box.sx, box.top + box.height * box.sy - 4, this.scrollBarWidth * box.sx, 4);
        }
        this.rects = [];
        for (var i = 0; i < this.nodes.length; i++) {
            if (this.hitIndex === i) {
                context.fillStyle = this.hitColor;
            }
            else {
                context.fillStyle = this.barColor;
            }
            var node = this.nodes[i];
            var yy = Tone.indexOf(node.name);
            var rect = new base.Rect(this.offsetX + box.left + node.time * this.bpm * this.dw * box.sx, this.offsetY + box.top + yy * this.dh * box.sy, node.duration * this.bpm * this.dw * box.sx, this.dh * box.sy);
            context.fillRect(rect.x, rect.y, rect.width, rect.height);
            this.rects.push(rect);
        }
        context.beginPath();
        context.strokeStyle = this.indexColor;
        context.lineWidth = this.indexWidth;
        context.moveTo(box.left + (this.offsetX + this.position * this.dw) * box.sx, box.top);
        context.lineTo(box.left + (this.offsetX + this.position * this.dw) * box.sx, box.top + box.height);
        context.stroke();
    };
    Body.prototype.hit = function (x, y) {
        for (var i = 0; i < this.rects.length; i++) {
            if (this.rects[i].contain2(x, y)) {
                this.hitIndex = i;
                return this.nodes[i];
            }
        }
        return null;
    };
    return Body;
}(base.Component));
export { Body };
