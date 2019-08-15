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
import { ListView, HeadInfoItem } from "./item";
var Left = (function (_super) {
    __extends(Left, _super);
    function Left(x, y, width, height) {
        if (x === void 0) { x = 0; }
        if (y === void 0) { y = 0; }
        if (width === void 0) { width = 0; }
        if (height === void 0) { height = 0; }
        var _this = _super.call(this, x, y, width, height) || this;
        _this.lineWidth = 0.4;
        _this.lineColor = "#000000";
        _this.borderWith = 0;
        _this.listView = new ListView(_this, [], 60)
            .cbk(function () { return new HeadInfoItem(); });
        return _this;
    }
    Left.prototype.setData = function (data) {
        this.listView.setData(data);
        this.listView.offsetY = 0;
        this.listView.refresh();
    };
    Left.prototype.onResize = function () {
        this.listView.refresh();
        _super.prototype.onResize.call(this);
    };
    return Left;
}(base.Component));
export { Left };
