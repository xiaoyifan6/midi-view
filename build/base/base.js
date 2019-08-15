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
export var base;
(function (base) {
    var Point = (function () {
        function Point(x, y) {
            if (x === void 0) { x = 0; }
            if (y === void 0) { y = 0; }
            this.x = x;
            this.y = y;
        }
        Point.prototype.add = function (p) {
            return new Point(this.x + p.x, this.y + p.y);
        };
        Point.prototype.sub = function (p) {
            return new Point(this.x - p.x, this.y - p.y);
        };
        Point.prototype.multy = function (p) {
            return this.x * p.y + this.y * p.x;
        };
        Point.prototype.distance = function (p) {
            return Math.sqrt((this.x - p.x) * (this.x - p.x) + (this.y - p.y) * (this.y - p.y));
        };
        Point.distance = function (x1, y1, x2, y2) {
            return Math.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2));
        };
        Point.prototype.clone = function () {
            return new Point(this.x, this.y);
        };
        return Point;
    }());
    base.Point = Point;
    var Rect = (function () {
        function Rect(x, y, width, height) {
            if (x === void 0) { x = 0; }
            if (y === void 0) { y = 0; }
            if (width === void 0) { width = 0; }
            if (height === void 0) { height = 0; }
            this.x = x;
            this.y = y;
            this.width = width;
            this.height = height;
        }
        Rect.prototype.set = function (x, y, width, height) {
            if (x === void 0) { x = 0; }
            if (y === void 0) { y = 0; }
            if (width === void 0) { width = 0; }
            if (height === void 0) { height = 0; }
            this.x = x;
            this.y = y;
            this.width = width;
            this.height = height;
        };
        Object.defineProperty(Rect.prototype, "left", {
            get: function () {
                return this.x;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Rect.prototype, "right", {
            get: function () {
                return this.x + this.width;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Rect.prototype, "top", {
            get: function () {
                return this.y;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Rect.prototype, "bottom", {
            get: function () {
                return this.y + this.height;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Rect.prototype, "centerX", {
            get: function () {
                return this.left + this.width / 2;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Rect.prototype, "centerY", {
            get: function () {
                return this.top + this.height / 2;
            },
            enumerable: true,
            configurable: true
        });
        Rect.prototype.contain = function (p) {
            return p.x > this.left && p.x < this.right && p.y > this.top && p.y < this.bottom;
        };
        Rect.prototype.contain2 = function (x, y) {
            return x > this.left && x < this.right && y > this.top && y < this.bottom;
        };
        Rect.prototype.clone = function () {
            return new Rect(this.x, this.y, this.width, this.height);
        };
        return Rect;
    }());
    base.Rect = Rect;
    var Box = (function () {
        function Box(cmp) {
            this.cmp = cmp;
        }
        Object.defineProperty(Box.prototype, "sx", {
            get: function () { return this.cmp.getScaleX(this.cmp); },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Box.prototype, "sy", {
            get: function () { return this.cmp.getScaleX(this.cmp); },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Box.prototype, "psx", {
            get: function () { return this.cmp.getScaleX(this.cmp.parent); },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Box.prototype, "psy", {
            get: function () { return this.cmp.getScaleX(this.cmp.parent); },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Box.prototype, "left", {
            get: function () { return ((this.cmp.parent ? this.cmp.parent.x : 0) + this.cmp.x) * this.psx; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Box.prototype, "top", {
            get: function () { return ((this.cmp.parent ? this.cmp.parent.y : 0) + this.cmp.y) * this.psy; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Box.prototype, "width", {
            get: function () { return this.cmp.width * this.sx; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Box.prototype, "height", {
            get: function () { return this.cmp.height * this.sy; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Box.prototype, "bottom", {
            get: function () { return this.top + this.height; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Box.prototype, "right", {
            get: function () { return this.left + this.width; },
            enumerable: true,
            configurable: true
        });
        Box.prototype.contain = function (p) {
            return p.x > this.left && p.x < this.right && p.y > this.top && p.y < this.bottom;
        };
        Box.prototype.contain2 = function (x, y) {
            return x > this.left && x < this.right && y > this.top && y < this.bottom;
        };
        return Box;
    }());
    base.Box = Box;
    var Component = (function (_super) {
        __extends(Component, _super);
        function Component(x, y, width, height) {
            if (x === void 0) { x = 0; }
            if (y === void 0) { y = 0; }
            if (width === void 0) { width = 0; }
            if (height === void 0) { height = 0; }
            var _this = _super.call(this, x, y, width, height) || this;
            _this.children = [];
            _this.bgColor = "#ffffff";
            _this.scaleX = 1;
            _this.scaleY = 1;
            _this.overflow = false;
            _this.active = false;
            _this.visible = true;
            _this.borderWith = 0;
            _this.borderColor = "#000000";
            _this.box = new Box(_this);
            _this.init();
            return _this;
        }
        Component.prototype.release = function () {
            this.active = false;
        };
        Component.prototype.init = function () { };
        Component.prototype.tryActive = function (p) {
            if (this.box.contain(p) && this.visible) {
                this.active = true;
            }
        };
        Component.prototype.addChild = function (child, index) {
            if (index === void 0) { index = -1; }
            if (index < 0) {
                index = this.children.length;
            }
            this.children.splice(index, 0, child);
            child.parent = this;
        };
        Component.prototype.removeChild = function (child) {
            var index = this.children.indexOf(child);
            if (index >= 0) {
                this.removeChildAt(index);
            }
        };
        Component.prototype.removeChildAt = function (index) {
            this.children[index] && (this.children[index].parent = undefined);
            this.children[index].onDettach();
            this.children.splice(index, 1);
        };
        Component.prototype.childAt = function (index) {
            return this.children[index];
        };
        Component.prototype.onResize = function () {
            for (var i = 0; i < this.children.length; i++) {
                this.children[i] && this.children[i].onResize();
            }
        };
        Component.prototype.getScaleX = function (c) {
            if (c === void 0) { c = this; }
            return c.scaleX * (c.parent ? c.parent.scaleX : 1);
        };
        Component.prototype.getScaleY = function (c) {
            if (c === void 0) { c = this; }
            return c.scaleY * (c.parent ? c.parent.scaleY : 1);
        };
        Component.prototype.getBound = function (left, top, width, height) {
            return new Rect(left, top, width, height);
        };
        Component.prototype.onDettach = function () {
        };
        Component.prototype.onDraw = function (context) {
            if (this.parent == null || !this.visible)
                return;
            context.fillStyle = this.bgColor;
            var box = this.box;
            if (!this.overflow) {
                context.beginPath();
                var bound = this.getBound(box.left, box.top, box.width, box.height);
                context.rect(bound.left, bound.top, bound.right, bound.bottom);
                context.clip();
            }
            context.fillRect(box.left, box.top, box.width, box.height);
            for (var i = 0; i < this.children.length; i++) {
                context.save();
                this.children[i] && this.children[i].visible && this.children[i].onDraw(context);
                context.restore();
            }
            if (this.borderWith > 0) {
                context.beginPath();
                context.lineWidth = this.borderWith;
                context.strokeStyle = this.borderColor;
                context.strokeRect(box.left, box.top, box.width, box.height);
                context.stroke();
            }
        };
        return Component;
    }(Rect));
    base.Component = Component;
    var BaseUI = (function () {
        function BaseUI(container) {
            this.container = container;
        }
        BaseUI.prototype.addChild = function (cmp) {
            this.container.addChild(cmp);
        };
        BaseUI.prototype.removeChile = function (cmp) {
            this.container.removeChild(cmp);
        };
        BaseUI.prototype.resize = function (width, height) {
            this.container.width = width;
            this.container.height = height;
        };
        BaseUI.prototype.setData = function (data) {
            this.data = data;
        };
        BaseUI.prototype.onDraw = function (context) {
            if (this.container.visible) {
                this.container.onDraw(context);
            }
        };
        Object.defineProperty(BaseUI.prototype, "width", {
            get: function () {
                return this.container.width;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(BaseUI.prototype, "height", {
            get: function () {
                return this.container.height;
            },
            enumerable: true,
            configurable: true
        });
        BaseUI.prototype.hide = function () {
        };
        BaseUI.prototype.show = function () {
        };
        BaseUI.prototype.onResize = function () {
            this.container.onResize();
        };
        return BaseUI;
    }());
    base.BaseUI = BaseUI;
})(base || (base = {}));
