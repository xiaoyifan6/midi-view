export namespace base {
    export class Point {
        public x: number;
        public y: number;

        public constructor(x: number = 0, y: number = 0) {
            this.x = x;
            this.y = y;
        }

        public add(p: Point): Point {
            return new Point(this.x + p.x, this.y + p.y)
        }

        public sub(p: Point): Point {
            return new Point(this.x - p.x, this.y - p.y)
        }

        public multy(p: Point): number {
            return this.x * p.y + this.y * p.x;
        }

        public distance(p: Point): number {
            return Math.sqrt((this.x - p.x) * (this.x - p.x) + (this.y - p.y) * (this.y - p.y))
        }

        public static distance(x1: number, y1: number, x2: number, y2: number) {
            return Math.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2))
        }

        public clone(): Point {
            return new Point(this.x, this.y);
        }
    }

    export class Rect {
        public x: number;
        public y: number;
        public width: number;
        public height: number;

        public constructor(x: number = 0, y: number = 0, width: number = 0, height: number = 0) {
            this.x = x;
            this.y = y;
            this.width = width;
            this.height = height;
        }

        public set(x: number = 0, y: number = 0, width: number = 0, height: number = 0) {
            this.x = x;
            this.y = y;
            this.width = width;
            this.height = height;
        }

        public get left(): number {
            return this.x;
        }
        public get right(): number {
            return this.x + this.width;
        }
        public get top(): number {
            return this.y;
        }
        public get bottom(): number {
            return this.y + this.height;
        }

        public get centerX(): number {
            return this.left + this.width / 2;
        }

        public get centerY(): number {
            return this.top + this.height / 2;
        }

        public contain(p: Point): boolean {
            return p.x > this.left && p.x < this.right && p.y > this.top && p.y < this.bottom;
        }
        public contain2(x: number, y: number): boolean {
            return x > this.left && x < this.right && y > this.top && y < this.bottom;
        }

        public clone(): Rect {
            return new Rect(this.x, this.y, this.width, this.height);
        }
    }


    export class Box {
        private cmp: Component;

        public constructor(cmp: Component) {
            this.cmp = cmp;
        }

        public get sx(): number { return this.cmp.getScaleX(this.cmp); }
        public get sy(): number { return this.cmp.getScaleX(this.cmp); }

        public get psx(): number { return this.cmp.getScaleX(this.cmp.parent); }
        public get psy(): number { return this.cmp.getScaleX(this.cmp.parent); }

        public get left(): number { return ((this.cmp.parent ? this.cmp.parent.x : 0) + this.cmp.x) * this.psx; }
        public get top(): number { return ((this.cmp.parent ? this.cmp.parent.y : 0) + this.cmp.y) * this.psy; }
        public get width(): number { return this.cmp.width * this.sx; }
        public get height(): number { return this.cmp.height * this.sy; }

        public get bottom(): number { return this.top + this.height; }
        public get right(): number { return this.left + this.width; }

        public contain(p: Point): boolean {
            return p.x > this.left && p.x < this.right && p.y > this.top && p.y < this.bottom;
        }
        public contain2(x: number, y: number): boolean {
            return x > this.left && x < this.right && y > this.top && y < this.bottom;
        }
    }

    export class Component extends Rect {
        public children: Array<Component> = [];
        public bgColor: string = "#ffffff";
        public scaleX: number = 1;
        public scaleY: number = 1;
        public parent?: Component;
        public overflow: boolean = false; // 是否允许溢出
        public active: boolean = false;
        public visible: boolean = true;
        public box: Box;

        public borderWith: number = 0;
        public borderColor: string = "#000000";

        public constructor(x: number = 0, y: number = 0, width: number = 0, height: number = 0) {
            super(x, y, width, height);
            this.box = new Box(this);
            this.init();
        }

        public release() {
            this.active = false;
        }

        protected init() { }

        public tryActive(p: Point) {
            if (this.box.contain(p) && this.visible) {
                this.active = true;
            }
        }

        public addChild(child: Component, index: number = -1) {
            if (index < 0) {
                index = this.children.length;
            }
            this.children.splice(index, 0, child);
            child.parent = this;
        }

        public removeChild(child: Component) {
            var index = this.children.indexOf(child);
            if (index >= 0) {
                this.removeChildAt(index);
            }
        }

        public removeChildAt(index: number) {
            this.children[index] && (this.children[index].parent = undefined);
            this.children[index].onDettach();
            this.children.splice(index, 1);
        }

        public childAt(index: number) {
            return this.children[index];
        }

        public onResize() {
            for (var i = 0; i < this.children.length; i++) {
                this.children[i] && this.children[i].onResize();
            }
        }

        public getScaleX(c: Component = this) {
            return c.scaleX * (c.parent ? c.parent.scaleX : 1);
        }

        public getScaleY(c: Component = this) {
            return c.scaleY * (c.parent ? c.parent.scaleY : 1);
        }

        public getBound(left: number, top: number, width: number, height: number): Rect {
            return new Rect(left, top, width, height)
        }

        public onDettach() {

        }

        public onDestroy() {
            for (var i = 0; i < this.children.length; i++) {
                this.children[i] && this.children[i].onDestroy();
            }
        }

        public onDraw(context: CanvasRenderingContext2D) {
            if (this.parent == null || !this.visible) return;

            context.fillStyle = this.bgColor;

            var box = this.box;

            if (!this.overflow) {
                context.beginPath();
                var bound = this.getBound(box.left, box.top, box.width, box.height)
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
        }

    }

    export abstract class BaseUI {

        protected container: Component;
        protected data: any;

        public constructor(container: Component) {
            this.container = container;
        }

        public addChild(cmp: Component) {
            this.container.addChild(cmp);
        }

        public removeChile(cmp: Component) {
            this.container.removeChild(cmp);
        }

        public resize(width: number, height: number) {
            this.container.width = width;
            this.container.height = height;
        }

        public setData(data: any) {
            this.data = data;
        }

        public onDraw(context: CanvasRenderingContext2D) {
            if (this.container.visible) {
                this.container.onDraw(context);
            }
        }

        public get width(): number {
            return this.container.width;
        }

        public get height(): number {
            return this.container.height;
        }

        public hide() {

        }

        public show() {

        }

        public onResize() {
            this.container.onResize();
        }
    }

}