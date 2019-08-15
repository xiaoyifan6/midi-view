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
import { Tone, MusicalInstrumentData } from "../constant/data";
import { event } from "../base/event";
var Item = (function (_super) {
    __extends(Item, _super);
    function Item(x, y, width, height) {
        if (x === void 0) { x = 0; }
        if (y === void 0) { y = 0; }
        if (width === void 0) { width = 0; }
        if (height === void 0) { height = 60; }
        var _this = _super.call(this, x, y, width, height) || this;
        _this.padding = 0;
        _this.recycle = true;
        return _this;
    }
    Item.prototype.setData = function (data) {
        this.data = data;
    };
    Item.prototype.onDraw = function (context) {
        if (this.recycle)
            return;
        _super.prototype.onDraw.call(this, context);
    };
    Item.prototype.hit = function (x, y) {
        return this.box.contain2(x, y);
    };
    Item.prototype.onSelect = function () {
    };
    return Item;
}(base.Component));
export { Item };
var ListView = (function () {
    function ListView(container, data, height) {
        this.offsetY = 0;
        this.offsetX = 0;
        this.views = [];
        this.scrollBarWidth = 0;
        this.data = data || [];
        this.itemHeight = height;
        this.container = container;
        this.refresh();
    }
    ListView.prototype.setData = function (data) {
        this.data = data;
    };
    Object.defineProperty(ListView.prototype, "contentHeight", {
        get: function () {
            return this.itemHeight * this.data.length;
        },
        enumerable: true,
        configurable: true
    });
    ListView.prototype.cbk = function (createItemCbk) {
        this.createItemCbk = createItemCbk;
        return this;
    };
    ListView.prototype.refresh = function () {
        if (!this.createItemCbk)
            return;
        var f = Math.floor(-this.offsetY / this.itemHeight);
        var i = f;
        for (; i < this.data.length && (this.offsetY + i * this.itemHeight) < this.container.height; i++) {
            if (!this.views[i - f]) {
                this.views[i - f] = this.createItemCbk();
                this.container.addChild(this.views[i - f]);
            }
            var item = this.views[i - f];
            item.recycle = false;
            item.setData(this.data[i]);
            var sw = 0;
            if (this.container.height < this.contentHeight) {
                sw = this.scrollBarWidth;
            }
            item.set(0, this.offsetY + i * this.itemHeight, this.container.width - sw, this.itemHeight);
            item["offsetX"] = this.offsetX;
        }
        for (; i - f < this.views.length; i++) {
            if (this.views[i - f]) {
                this.views[i - f].recycle = true;
            }
        }
    };
    ListView.prototype.hit = function (x, y) {
        for (var i in this.views) {
            if (!this.views[i].recycle && this.views[i].hit(x, y)) {
                this.views[i].onSelect();
                return true;
            }
        }
        return false;
    };
    return ListView;
}());
export { ListView };
var MidiItem = (function (_super) {
    __extends(MidiItem, _super);
    function MidiItem(x, y, width, height) {
        if (x === void 0) { x = 0; }
        if (y === void 0) { y = 0; }
        if (width === void 0) { width = 0; }
        if (height === void 0) { height = 60; }
        var _this = _super.call(this, x, y, width, height) || this;
        _this.dw = 60;
        _this.offsetX = 0;
        _this.lineColor = "#000000";
        _this.lineWidth = 2;
        _this.borderWith = 1;
        _this.borderColor = "#666666";
        return _this;
    }
    MidiItem.prototype.onDraw = function (context) {
        if (this.recycle || !this.parent)
            return;
        _super.prototype.onDraw.call(this, context);
        if (!this.data)
            return;
        var box = this.box;
        var eh = box.height / Tone.length;
        context.strokeStyle = "#00ff00";
        context.lineWidth = 0.5;
        context.font = "14px";
        var s = (this.data["instrument"] || {})["number"] || "" + "";
        if (s) {
            var tm = context.measureText(s);
            context.strokeRect(box.left, box.top, tm.width * 2, 14);
            context.strokeText(s, box.left + tm.width / 2, box.top + 10);
        }
        var nodes = this.data.notes;
        context.lineWidth = this.lineWidth;
        context.strokeStyle = this.lineColor;
        for (var j = 0; j < nodes.length; j++) {
            var node = nodes[j];
            context.beginPath();
            var yy = Tone.indexOf(node.name);
            context.moveTo(box.left + (node.time * this.dw + this.offsetX) * box.sx, box.top + eh * yy * box.sy);
            context.lineTo(box.left + ((node.time + node.duration) * this.dw + this.offsetX) * box.sx, box.top + eh * yy * box.sy);
            context.closePath();
            context.stroke();
        }
    };
    MidiItem.prototype.onSelect = function () {
        _super.prototype.onSelect.call(this);
        if (this.data && this.data.notes && this.data.notes.length) {
            event.emit("show-detail", this.data.notes);
        }
    };
    return MidiItem;
}(Item));
export { MidiItem };
var HeadInfoItem = (function (_super) {
    __extends(HeadInfoItem, _super);
    function HeadInfoItem(x, y, width, height) {
        if (x === void 0) { x = 0; }
        if (y === void 0) { y = 0; }
        if (width === void 0) { width = 0; }
        if (height === void 0) { height = 60; }
        var _this = _super.call(this, x, y, width, height) || this;
        _this.textColor = "#000000";
        _this.font = "16px";
        _this.borderWith = 1;
        _this.borderColor = "#aaaaaa";
        return _this;
    }
    HeadInfoItem.prototype.onDraw = function (context) {
        if (this.recycle || !this.parent)
            return;
        _super.prototype.onDraw.call(this, context);
        if (!this.data)
            return;
        var box = this.box;
        context.strokeStyle = this.textColor;
        context.font = this.font;
        var s = (this.data["instrument"] || {})["number"];
        var arr = MusicalInstrumentData[s];
        if (arr && arr.length > 0) {
            context.strokeText(arr[1], box.left + 4, box.top + box.height / 2, box.width);
        }
    };
    return HeadInfoItem;
}(Item));
export { HeadInfoItem };
