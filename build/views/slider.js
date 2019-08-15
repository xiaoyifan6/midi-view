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
import { event } from "../base/event";
var Slider = (function (_super) {
    __extends(Slider, _super);
    function Slider() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.max = 100;
        _this.progress = 0;
        _this.lineWidth = 1;
        _this.bgColor1 = "#cccccc";
        _this.bgColor2 = "#000000";
        return _this;
    }
    Slider.prototype.init = function () {
        _super.prototype.init.call(this);
        event.bind(event.TOUCH_MOVE, this.onProcess, this);
    };
    Slider.prototype.onProcess = function (eobj) {
        var x = eobj.data["x"];
        this.progress = (x - this.x) / this.width * this.max;
    };
    Slider.prototype.getProgressX = function () {
        return this.progress / this.max * this.width;
    };
    Slider.prototype.onDraw = function (context) {
        if (this.parent == null || !this.visible)
            return;
        _super.prototype.onDraw.call(this, context);
        var box = this.box;
        context.beginPath();
        context.strokeStyle = this.bgColor1;
        context.lineWidth = this.lineWidth;
        context.moveTo(box.left, box.top);
        context.moveTo(box.left + box.width, box.top);
        context.stroke();
        context.beginPath();
        context.strokeStyle = this.bgColor2;
        context.moveTo(box.left, box.top);
        context.moveTo(box.left + this.getProgressX() * box.sx, box.top);
    };
    return Slider;
}(base.Component));
export { Slider };
