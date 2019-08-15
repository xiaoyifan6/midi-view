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
var Header = (function (_super) {
    __extends(Header, _super);
    function Header() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.dw = 8;
        _this.position = 0;
        _this.offsetX = 0;
        _this.bate = 4;
        _this.bpm = 0;
        _this.lineWidth = 0.4;
        _this.lineColor = "#000000";
        _this.indexColor = "#ff0000";
        _this.indexWidth = 0.5;
        return _this;
    }
    Header.prototype.onDraw = function (context) {
        _super.prototype.onDraw.call(this, context);
        if (!this.parent)
            return;
        context.lineWidth = this.lineWidth;
        context.strokeStyle = this.lineColor;
        var box = this.box;
        var i = 0;
        for (var x = 0; x + this.offsetX < this.width; x += this.dw) {
            context.beginPath();
            if (i % this.bate == 0) {
                context.moveTo(box.left + (this.offsetX + x) * box.sx, box.top);
                context.lineTo(box.left + (this.offsetX + x) * box.sx, box.top + this.height * box.sy);
                context.strokeText("" + (i / this.bate + 1), box.left + (this.offsetX + x) * box.sx + this.lineWidth * 4, box.top + box.height * 2 / 5);
            }
            else {
                context.moveTo(box.left + (this.offsetX + x) * box.sx, box.top + box.height / 2);
                context.lineTo(box.left + (this.offsetX + x) * box.sx, box.top + box.height * 3 / 2);
            }
            context.stroke();
            i++;
        }
        context.beginPath();
        context.strokeStyle = this.indexColor;
        context.lineWidth = this.indexWidth;
        context.moveTo(box.left + (this.offsetX + this.position * this.dw) * box.sx, box.top);
        context.lineTo(box.left + (this.offsetX + this.position * this.dw) * box.sx, box.top + box.height);
        context.stroke();
    };
    return Header;
}(base.Component));
export { Header };
