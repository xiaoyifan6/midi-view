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
import { Label } from "./label";
import { event } from "../base/event";
var Button = (function (_super) {
    __extends(Button, _super);
    function Button(x, y, width, height) {
        if (x === void 0) { x = 0; }
        if (y === void 0) { y = 0; }
        if (width === void 0) { width = 0; }
        if (height === void 0) { height = 0; }
        var _this = _super.call(this, x, y, width, height) || this;
        _this.offsetX = 4;
        _this.offsetY = 4;
        _this.ox = 0;
        _this.oy = 0;
        event.bind(event.TOUCH_DOWN, _this.onDown, _this);
        return _this;
    }
    Button.prototype.onDown = function (eobj) {
        var _this = this;
        this.ox = this.x;
        this.oy = this.y;
        this.x += this.offsetX;
        this.y += this.offsetY;
        setTimeout(function () {
            _this.x = _this.ox;
            _this.y = _this.oy;
        }, 500);
    };
    Button.prototype.onDettach = function () {
        _super.prototype.onDettach.call(this);
        event.cancel(event.TOUCH_DOWN, this.onDown, this);
    };
    return Button;
}(Label));
export { Button };
