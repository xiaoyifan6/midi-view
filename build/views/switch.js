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
var Switch = (function (_super) {
    __extends(Switch, _super);
    function Switch() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.checked = false;
        _this.checkedColor = "#000000";
        _this.unCheckedColor = "#cccccc";
        return _this;
    }
    Switch.prototype.init = function () {
        _super.prototype.init.call(this);
        event.bind(event.TOUCH, this.onCheck, this);
    };
    Switch.prototype.onCheck = function () {
        this.checked = !this.checked;
    };
    Switch.prototype.onDraw = function (context) {
        if (this.parent == null || !this.visible)
            return;
        _super.prototype.onDraw.call(this, context);
        var box = this.box;
        context.beginPath();
        context.strokeStyle = this.unCheckedColor;
        if (this.borderWith == 0) {
            this.borderWith = 1;
        }
        context.lineWidth = this.borderWith;
        context.strokeRect(box.left, box.top, box.width, box.height);
        context.stroke();
        if (this.checked) {
            context.fillStyle = this.checkedColor;
            context.fillRect(box.left - box.height, box.top, box.height, box.height);
        }
        else {
            context.fillStyle = this.unCheckedColor;
            context.fillRect(box.left, box.top, box.height, box.height);
        }
    };
    Switch.prototype.onDettach = function () {
        _super.prototype.onDettach.call(this);
        event.cancel(event.TOUCH, this.onCheck, this);
    };
    return Switch;
}(base.Component));
export { Switch };
