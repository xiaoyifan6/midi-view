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
var Label = (function (_super) {
    __extends(Label, _super);
    function Label() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this._text = "";
        _this.textColor = "#000000";
        _this.font = "14px";
        _this.lineHeight = 20;
        _this.multyLine = false;
        return _this;
    }
    Object.defineProperty(Label.prototype, "text", {
        get: function () {
            return this._text;
        },
        set: function (_text) {
            this._text = _text;
        },
        enumerable: true,
        configurable: true
    });
    Label.prototype.onDraw = function (context) {
        if (this.parent == null || !this.visible)
            return;
        _super.prototype.onDraw.call(this, context);
        var box = this.box;
        context.beginPath();
        context.strokeStyle = this.textColor;
        context.font = this.font;
        var m = context.measureText(this._text);
        if (this.multyLine) {
            if (m.width <= this.width) {
                context.strokeText(this._text, box.left, box.top, this.maxWidth);
            }
            else {
                var dw = m.width / this._text.length;
                var len = Math.ceil(this.width / dw);
                for (var i = 0; i < len; i++) {
                    context.strokeText(this._text.substr(i * dw, dw), box.left, box.top + i * this.lineHeight, this.maxWidth);
                }
            }
        }
        else {
            context.strokeText(this._text, box.left + (box.width - m.width) / 2, box.top + box.height / 2 + 14 / 4);
        }
        context.stroke();
    };
    return Label;
}(base.Component));
export { Label };
